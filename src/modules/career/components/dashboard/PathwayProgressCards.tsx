import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, ChevronDown, ChevronUp, Plus, Trash2, Pencil, Check, RefreshCw, Loader2, Sparkles, Map as MapIcon, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { usePathwayProgress, PathwayProgressResult } from '@/modules/career/hooks/usePathwayProgress';
import { useProfile, useUpdateProfile, Profile, CustomMilestone } from '@/modules/career/hooks/useProfile';
import { usePathwayRegistry } from '@/modules/career/hooks/usePathwayRegistry';
import { useToggleMilestone } from '@/modules/career/hooks/useToggleMilestone';
import { ChecklistCircle } from '@/components/ui/ChecklistCircle';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { MilestoneCard } from '../pathway/MilestoneCard';
import { Button } from '@/components/ui/button';
import { useGoalWizard } from '@/modules/career/contexts/GoalWizardContext';

import { useUserMilestones, UserMilestoneRow } from '@/modules/career/hooks/useUserMilestones';
import { resolveCategory, CATEGORY_ORDER, CATEGORY_CONFIG, type MilestoneCategory } from '@/modules/career/data/categoryConfig';
import { MilestoneCategoryDivider } from './MilestoneCategoryDivider';
import { useGenerateMilestones } from '@/modules/career/hooks/useGenerateMilestones';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PathwayProgressCardsProps {
    className?: string;
    onAddMilestone?: (pathwayId: string, pathwayName: string) => void;
    onMilestoneReached?: (milestone: '50%' | '100%') => void;
}


export function PathwayProgressCards({ className, onAddMilestone, onMilestoneReached }: PathwayProgressCardsProps) {
    const { data: profile, isLoading: profileLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const { getPathwayById } = usePathwayRegistry();
    const { data: userMilestones } = useUserMilestones();
    const toggleMilestone = useToggleMilestone();
    const [isExpanded, setIsExpanded] = useState(false);
    const [completingMilestone, setCompletingMilestone] = useState<string | null>(null);
    const { toast } = useToast();

    // Global edit mode state - usually we might want this per card, but per card is fine too
    const [editModePathways, setEditModePathways] = useState<Record<string, boolean>>({});

    const toggleEditMode = (pathwayId: string) => {
        setEditModePathways(prev => ({
            ...prev,
            [pathwayId]: !prev[pathwayId]
        }));
    };

    const handleToggleMilestone = async (milestoneName: string, status: 'pending' | 'in-progress' | 'completed', customMilestoneId?: string, pathwayId?: string) => {
        if (!profile || completingMilestone) return;

        const lockKey = customMilestoneId || milestoneName;
        setCompletingMilestone(lockKey);
        try {
            const currentCustom = profile.custom_milestones || [];

            // Check if this is a custom milestone
            const customMilestone = customMilestoneId
                ? currentCustom.find(cm => cm.id === customMilestoneId)
                : currentCustom.find(cm => cm.name === milestoneName);

            if (customMilestone) {
                // Toggle custom milestone completed status (pending <-> completed)
                const updatedCustom = currentCustom.map(cm =>
                    cm.id === customMilestone.id
                        ? { ...cm, completed: !cm.completed }
                        : cm
                );
                await updateProfile.mutateAsync({
                    custom_milestones: updatedCustom,
                });
                toast({
                    title: customMilestone.completed ? 'Milestone reset to pending' : '🎉 Milestone completed!',
                    description: milestoneName,
                });
            } else {
                // Standard milestone: resolve name → DB UUID and write to relational table
                let milestoneDbId: string | undefined;
                if (pathwayId) {
                    const pathway = getPathwayById(pathwayId);
                    milestoneDbId = pathway?.requirements.find(r => r.name === milestoneName)?.dbId;
                }

                if (!milestoneDbId) {
                    toast({ title: 'Failed to update', description: 'Milestone not found in database.', variant: 'destructive' });
                    return;
                }

                // Map toggle state to relational status
                const newStatus = status === 'pending' ? 'in_progress' as const
                    : status === 'in-progress' ? 'done' as const
                        : 'todo' as const;

                await toggleMilestone.mutateAsync({ milestoneId: milestoneDbId, newStatus });

                const toastConfig = {
                    in_progress: { title: '▶️ Step in progress', description: milestoneName },
                    done: { title: '🎉 Step completed!', description: milestoneName },
                    todo: { title: 'Step reset to pending', description: milestoneName },
                };
                toast(toastConfig[newStatus]);
            }
        } catch (error) {
            // Error toast for relational writes is handled by useToggleMilestone's onError
            if ((profile.custom_milestones || []).some(cm => cm.id === customMilestoneId)) {
                toast({ title: 'Failed to update', description: 'Please try again.', variant: 'destructive' });
            }
        } finally {
            setCompletingMilestone(null);
        }
    };

    const handleDeleteCustomMilestone = async (milestoneId: string, milestoneName: string) => {
        if (!profile) return;

        // Confirm deletion
        if (!window.confirm(`Delete "${milestoneName}"? This cannot be undone.`)) return;

        try {
            const currentCustom = profile.custom_milestones || [];
            const updatedCustom = currentCustom.filter(cm => cm.id !== milestoneId);
            await updateProfile.mutateAsync({
                custom_milestones: updatedCustom,
            });
            toast({
                title: 'Milestone deleted',
                description: milestoneName,
            });
        } catch (error) {
            toast({
                title: 'Failed to delete',
                description: 'Please try again.',
                variant: 'destructive',
            });
        }
    };


    const results = usePathwayProgress(
        profile ? {
            pathway_ids: profile.pathway_ids,
            specialty: profile.specialty,
            custom_milestones: profile.custom_milestones,
        } : null,
        userMilestones,
    );

    // Track progress for all pathways to trigger celebrations
    const prevProgressRef = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!results || results.length === 0) return;

        results.forEach(result => {
            if (!result.pathway) return;
            const pathwayId = result.pathway.id;
            const currentPercent = result.percentComplete;
            const prevPercent = prevProgressRef.current[pathwayId] ?? currentPercent;

            // Check if we crossed the 50% threshold (going up)
            if (prevPercent < 50 && currentPercent >= 50 && currentPercent < 100) {
                onMilestoneReached?.('50%');
            }
            // Check if we hit 100%
            if (prevPercent < 100 && currentPercent === 100) {
                onMilestoneReached?.('100%');
            }

            prevProgressRef.current[pathwayId] = currentPercent;
        });
    }, [results, onMilestoneReached]);

    if (profileLoading) {
        return (
            <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-20 bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return null;
    }

    // Sort to ensure the order is stable
    const visibleLimit = 6;
    const visibleResults = isExpanded ? results : results.slice(0, visibleLimit);
    const hasMore = results.length > visibleLimit;

    return (
        <div className={cn("space-y-4", className)}>


            <div className="columns-1 lg:columns-2 gap-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {visibleResults.map((result, idx) => (
                        <div key={result.pathway?.id || idx} className="break-inside-avoid">
                            <PathwayProgressCard
                                result={result}
                                index={idx}
                                onToggleMilestone={handleToggleMilestone}
                                completingMilestone={completingMilestone}
                                onAddMilestone={onAddMilestone}
                                onMilestoneReached={onMilestoneReached}
                                onDeleteMilestone={handleDeleteCustomMilestone}
                                profile={profile}
                                userMilestones={userMilestones}
                                isEditMode={!!editModePathways[result.pathway?.id || '']}
                                onToggleEditMode={() => toggleEditMode(result.pathway!.id)}
                                updateProfile={updateProfile}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="flex justify-center pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-muted-foreground hover:text-primary"
                    >
                        {isExpanded ? (
                            <>Show less <ChevronUp className="ml-2 w-4 h-4" /></>
                        ) : (
                            <>View {results.length - visibleLimit} more <ChevronDown className="ml-2 w-4 h-4" /></>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

function PathwayProgressCard({
    result,
    index,
    onToggleMilestone,
    completingMilestone,
    onAddMilestone,
    onMilestoneReached,
    onDeleteMilestone,
    profile,
    userMilestones,
    isEditMode,
    onToggleEditMode,
    updateProfile
}: {
    result: PathwayProgressResult;
    index: number;
    onToggleMilestone: (name: string, status: 'pending' | 'in-progress' | 'completed', customMilestoneId?: string, pathwayId?: string) => void;
    completingMilestone: string | null;
    onAddMilestone?: (pathwayId: string, pathwayName: string) => void;
    onMilestoneReached?: (milestone: '50%' | '100%') => void;
    onDeleteMilestone?: (milestoneId: string, milestoneName: string) => void;
    profile: Profile | null | undefined;
    userMilestones?: UserMilestoneRow[];
    isEditMode: boolean;
    onToggleEditMode: () => void;
    updateProfile: ReturnType<typeof useUpdateProfile>;
}) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { openGoalWizard } = useGoalWizard();
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);
    const generateMilestones = useGenerateMilestones();

    const handleGenerateMilestones = (forceRefresh = false) => {
        if (!result.pathway) return;
        // New unified function pulls profile context automatically
        generateMilestones.mutate({
            pathwayId: result.pathway.id,
            forceRefresh,
        });
    };

    const isGenerating = generateMilestones.isPending;

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleCreateGoal = (milestoneName: string) => {
        openGoalWizard({
            promotedFromMilestone: milestoneName,
            pathwayContext: result.pathway?.name,
            currentProgress: result.completedMilestoneNames,
            autoMagic: true,
        });
    };


    if (!result.pathway) return null;

    const matchedVia = result.pathway.matchedVia;
    const isCustom = result.pathway.id.startsWith('custom-path');
    const pathwayId = result.pathway.id;
    const pathwayName = result.pathway.name;

    // --- Data Preparation Layer ---

    // 1. Get Config for this pathway
    // Prefer ID keys, but keep updating legacy name keys if they already exist.
    const pathwayConfigKey = profile?.pathway_configs?.[pathwayId]
        ? pathwayId
        : profile?.pathway_configs?.[pathwayName]
            ? pathwayName
            : pathwayId;
    const pathwayConfig = profile?.pathway_configs?.[pathwayConfigKey] || {};
    const hiddenMilestones = new Set(pathwayConfig.hidden_milestones || []);
    const milestoneOrder = pathwayConfig.milestone_order || [];

    // 2. Identify all source items (Standard + Custom)
    // Standard Requirements
    const standardReqs = [...result.completed, ...result.missing];

    // Custom Milestones for this path
    const customForPath = (profile?.custom_milestones || []).filter(
        (cm: CustomMilestone) =>
            cm.pathway_id === result.sourcePathName ||
            cm.pathway_id === pathwayId ||
            cm.pathway_id === pathwayName
    );

    // 3. Merge & Filter & Sort
    // Create a unified list of "Items"
    interface UnifiedItem {
        id: string; // Unique ID: 'req:name' or 'custom:id'
        originalId: string; // 'name' or 'customId'
        name: string;
        type: 'standard' | 'custom';
        status: 'pending' | 'in-progress' | 'completed';
        isCustom: boolean;
        category: MilestoneCategory;
        resourceUrl?: string;
    }

    const allItems: UnifiedItem[] = [];

    // Process Standard Reqs
    standardReqs.forEach(req => {
        if (!hiddenMilestones.has(req.name)) {
            // Determine status from relational data
            const umMatch = userMilestones?.find(um =>
                (req.dbId ? um.milestone_id === req.dbId : um.milestone.name === req.name)
            );
            const isCompleted = umMatch?.status === 'done';
            const isInProgress = !isCompleted && umMatch?.status === 'in_progress';

            // Apply override if exists
            const displayName = (pathwayConfig.milestone_overrides || {})[req.name] || req.name;

            allItems.push({
                id: req.name,
                originalId: req.name,
                name: displayName,
                type: 'standard',
                status: isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'pending',
                isCustom: false,
                category: resolveCategory(req.category),
                resourceUrl: req.resourceUrl,
            });
        }
    });

    // Process Custom Milestones
    customForPath.forEach(cm => {
        allItems.push({
            id: cm.id,
            originalId: cm.id,
            name: cm.name,
            type: 'custom',
            status: cm.completed ? 'completed' : 'pending',
            isCustom: true,
            category: cm.category ? resolveCategory(cm.category) : 'Custom',
        });
    });

    // Sort: primary by category order, secondary by existing logic within category
    const sortedItems = [...allItems].sort((a, b) => {
        // 0. Category grouping — always group by category first
        const catOrderA = CATEGORY_CONFIG[a.category].order;
        const catOrderB = CATEGORY_CONFIG[b.category].order;
        if (catOrderA !== catOrderB) return catOrderA - catOrderB;

        // Within same category:
        // 1. Priority: User custom order (Drag & Drop)
        const indexA = milestoneOrder.indexOf(a.id);
        const indexB = milestoneOrder.indexOf(b.id);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // 2. Fallback: Canonical Pathway Order (defined in registry)
        if (!a.isCustom && !b.isCustom && result.pathway?.requirements) {
            const reqs = result.pathway.requirements;
            const canonA = reqs.findIndex(r => r.name === a.originalId);
            const canonB = reqs.findIndex(r => r.name === b.originalId);

            if (canonA !== -1 && canonB !== -1) return canonA - canonB;
        }

        // 3. Final Fallback: Custom items go to bottom if not ordered, or stable sort
        if (a.isCustom && !b.isCustom) return 1;
        if (!a.isCustom && b.isCustom) return -1;

        return 0;
    });

    // --- Actions ---

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
        const newIndex = sortedItems.findIndex((item) => item.id === over.id);

        // Reject cross-category drags
        const activeItem = sortedItems[oldIndex];
        const overItem = sortedItems[newIndex];
        if (activeItem?.category !== overItem?.category) return;

        const newOrder = arrayMove(sortedItems, oldIndex, newIndex).map(item => item.id);

        // Optimistic update would be nice, but for now we rely on mutation
        const newConfig = {
            ...profile?.pathway_configs,
            [pathwayConfigKey]: {
                ...pathwayConfig,
                milestone_order: newOrder
            }
        };

        try {
            await updateProfile.mutateAsync({ pathway_configs: newConfig });
        } catch (error) {
            toast({ title: 'Failed to reorder', variant: 'destructive' });
        }
    };

    const handleEditClick = (item: UnifiedItem) => {
        setEditingItemId(item.id);
    };

    const handleSaveEdit = async (item: UnifiedItem, newName: string) => {
        setEditingItemId(null);
        if (!newName || newName.trim() === item.name) return;

        const trimmedName = newName.trim();
        if (item.isCustom) {
            const currentCustom = profile?.custom_milestones || [];
            const updatedCustom = currentCustom.map(cm =>
                cm.id === item.originalId ? { ...cm, name: trimmedName } : cm
            );
            await updateProfile.mutateAsync({ custom_milestones: updatedCustom });
        } else {
            const newOverrides = {
                ...(pathwayConfig.milestone_overrides || {}),
                [item.originalId]: trimmedName
            };
            const newConfig = {
                ...(profile?.pathway_configs || {}),
                [pathwayConfigKey]: { ...pathwayConfig, milestone_overrides: newOverrides }
            };
            await updateProfile.mutateAsync({ pathway_configs: newConfig });
        }
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
    };

    // Compute hidden standard milestones (for the Edit-mode restore section)
    const hiddenItems = standardReqs.filter(req => hiddenMilestones.has(req.name));

    const handleUnhide = async (milestoneName: string) => {
        const newHidden = (pathwayConfig.hidden_milestones || []).filter((n: string) => n !== milestoneName);
        const newConfig = {
            ...profile?.pathway_configs,
            [pathwayConfigKey]: {
                ...pathwayConfig,
                hidden_milestones: newHidden,
            },
        };
        try {
            await updateProfile.mutateAsync({ pathway_configs: newConfig });
            toast({ title: 'Milestone restored' });
        } catch {
            toast({ title: 'Failed to restore', variant: 'destructive' });
        }
    };

    const handleUnhideAll = async () => {
        const newConfig = {
            ...profile?.pathway_configs,
            [pathwayConfigKey]: {
                ...pathwayConfig,
                hidden_milestones: [],
            },
        };
        try {
            await updateProfile.mutateAsync({ pathway_configs: newConfig });
            toast({ title: `${hiddenItems.length} milestone${hiddenItems.length !== 1 ? 's' : ''} restored` });
        } catch {
            toast({ title: 'Failed to restore', variant: 'destructive' });
        }
    };

    const handleDeleteClick = async (item: UnifiedItem) => {
        if (!window.confirm(item.isCustom ? `Delete "${item.name}"?` : `Hide "${item.name}" from this card?`)) return;

        if (item.isCustom) {
            // Delete custom milestone
            if (onDeleteMilestone) onDeleteMilestone(item.originalId, item.name);
        } else {
            // Hide standard milestone
            const newHidden = [...(pathwayConfig.hidden_milestones || []), item.originalId];
            const newConfig = {
                ...profile?.pathway_configs,
                [pathwayConfigKey]: {
                    ...pathwayConfig,
                    hidden_milestones: newHidden
                }
            };
            try {
                await updateProfile.mutateAsync({ pathway_configs: newConfig });
                toast({ title: 'Milestone hidden', description: 'Switch to Edit mode to restore it.' });
            } catch (error) {
                toast({ title: 'Failed to hide', variant: 'destructive' });
            }
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
                "bg-card border rounded-xl overflow-hidden shadow-sm transition-colors",
                isEditMode ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
            )}
        >
            {/* Header */}
            <div className="p-5 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col gap-1 items-start">
                        <h4 className="font-semibold text-base text-foreground leading-snug">
                            {result.pathway.matchedVia || result.pathway.name}
                        </h4>
                        {result.pathway.country && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground w-fit">
                                {result.pathway.country}
                            </span>
                        )}
                        {/* Subtitles */}
                        {isCustom && (
                            <p className="text-[11px] text-warning font-medium">
                                Manual tracking active
                            </p>
                        )}
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-2">
                        {/* Refresh milestones from AI */}
                        {sortedItems.length > 0 && !isCustom && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowRefreshConfirm(true)}
                                        disabled={isGenerating}
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Refresh from official sources</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {/* Edit Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isEditMode ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "h-8 w-8 p-0 transition-all",
                                        isEditMode
                                            ? "text-secondary-foreground"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                    onClick={onToggleEditMode}
                                >
                                    {isEditMode ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isEditMode ? "Done editing" : "Edit milestones"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Progress bar (Hide in Edit Mode to reduce noise) */}
                {!isCustom && !isEditMode && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                {result.completedCount} of {result.totalRequired} requirements
                            </span>
                            <span className="font-bold text-primary">{result.percentComplete}%</span>
                        </div>
                        <Progress value={result.percentComplete} className="h-1.5" />
                    </div>
                )}

                {isEditMode && (
                    <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5 bg-background/50 p-2 rounded border border-border/50">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Drag to reorder • Hide non-relevant items
                    </p>
                )}
            </div>

            {/* Content - DnD Area */}
            <div className="p-5">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortedItems.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                        disabled={!isEditMode}
                    >
                        <div className="space-y-2">
                            {sortedItems.flatMap((item, idx) => {
                                const prevItem = idx > 0 ? sortedItems[idx - 1] : null;
                                const showDivider = !prevItem || prevItem.category !== item.category;
                                const elements: React.ReactNode[] = [];

                                if (showDivider) {
                                    elements.push(
                                        <MilestoneCategoryDivider
                                            key={`divider-${item.category}`}
                                            category={item.category}
                                            className={idx > 0 ? 'mt-3 mb-1' : 'mb-1'}
                                        />
                                    );
                                }

                                elements.push(
                                    <MilestoneCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        isCustom={item.isCustom}
                                        status={item.status}
                                        index={idx + 1}
                                        isUpdating={completingMilestone === item.originalId}
                                        isEditMode={isEditMode}
                                        resourceUrl={item.resourceUrl}
                                        onToggle={() => onToggleMilestone(item.isCustom ? item.name : item.originalId, item.status, item.isCustom ? item.id : undefined, pathwayId)}
                                        onDelete={() => handleDeleteClick(item)}
                                        onCreateGoal={() => handleCreateGoal(item.name)}
                                        onEdit={() => handleEditClick(item)}
                                        isEditingName={editingItemId === item.id}
                                        onSaveName={(newName) => handleSaveEdit(item, newName)}
                                        onCancelEdit={handleCancelEdit}
                                    />
                                );

                                return elements;
                            })}
                        </div>
                    </SortableContext>
                </DndContext>

                {/* Empty State */}
                {sortedItems.length === 0 && (
                    standardReqs.length === 0 && customForPath.length === 0 ? (
                        /* No milestones exist at all — offer to generate */
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center border border-dashed border-border">
                                {isGenerating ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : (
                                    <MapIcon className="w-8 h-8 text-muted-foreground/30" />
                                )}
                            </div>
                            {isGenerating ? (
                                <p className="text-xs text-muted-foreground font-medium">
                                    Generating milestones from official sources...
                                </p>
                            ) : (
                                <>
                                    <p className="text-xs text-muted-foreground font-medium italic max-w-[200px]">
                                        {isCustom
                                            ? 'Generate milestones for this custom pathway or add them manually.'
                                            : 'No milestones found. Generate them from official sources.'}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleGenerateMilestones(false)}
                                        className="gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Generate Milestones
                                    </Button>
                                    {isCustom && (
                                        <p className="text-[10px] text-muted-foreground">
                                            (Saved to your profile only)
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        /* Milestones exist but are all hidden */
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">All milestones are hidden. Tap Edit to restore them.</p>
                        </div>
                    )
                )}


                {/* Hidden Milestones Section — Edit Mode only */}
                {isEditMode && hiddenItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dashed border-border/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground font-medium">
                                {hiddenItems.length} hidden milestone{hiddenItems.length !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={handleUnhideAll}
                                className="text-xs text-primary hover:underline"
                            >
                                Show all
                            </button>
                        </div>
                        <ul className="space-y-1">
                            {hiddenItems.map(item => (
                                <li
                                    key={item.name}
                                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/30 transition-colors"
                                >
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                    <button
                                        onClick={() => handleUnhide(item.name)}
                                        className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                        title="Show milestone"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Add Milestone Button - Footer */}
                {isEditMode && onAddMilestone && result.pathway && (
                    <div className="px-0 pt-4 border-t border-border/50 mt-4">
                        <button
                            onClick={() => onAddMilestone?.(pathwayId, pathwayName)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border border-dashed border-border hover:border-primary/30"
                        >
                            <Plus className="w-4 h-4" />
                            Add Custom Milestone
                        </button>
                    </div>
                )}
            </div>

            {/* Refresh Confirmation Dialog */}
            <AlertDialog open={showRefreshConfirm} onOpenChange={setShowRefreshConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Refresh milestones?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will check official sources for new milestones.
                            Your existing progress will be preserved. New milestones
                            may be added and descriptions updated.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                setShowRefreshConfirm(false);
                                handleGenerateMilestones(true);
                            }}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}

