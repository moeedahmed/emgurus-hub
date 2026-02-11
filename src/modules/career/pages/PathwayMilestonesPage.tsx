import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Loader2, TrendingUp, RefreshCw, Pencil, X } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { PageShell } from '@/modules/career/components/layout/PageShell';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import { usePathwayRegistry } from '@/modules/career/hooks/usePathwayRegistry';
import { useProfile, useUpdateProfile } from '@/modules/career/hooks/useProfile';
import { useGoalWizard } from '@/modules/career/contexts/GoalWizardContext';
import { useGenerateMilestones } from '@/modules/career/hooks/useGenerateMilestones';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { resolveCategory, CATEGORY_CONFIG, type MilestoneCategory } from '@/modules/career/data/categoryConfig';
import { MilestoneCategoryDivider } from '@/modules/career/components/dashboard/MilestoneCategoryDivider';
import { MilestoneCard } from '@/modules/career/components/pathway/MilestoneCard';
import type { CostEstimate } from '@/modules/career/utils/milestoneFormatters';

type MilestoneStatus = 'pending' | 'in-progress' | 'completed';

interface MilestoneItem {
    id: string;
    name: string;
    description: string;
    category: MilestoneCategory;
    isRequired: boolean;
    order: number;
    resourceUrl?: string;
    evidenceTypes?: string[];
    estimatedDuration?: string;
    costEstimate?: CostEstimate | null;
    verificationStatus?: string;
    status: MilestoneStatus;
}

const PathwayMilestonesPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { openGoalWizard } = useGoalWizard();

    const { getPathwayById, isLoading: registryLoading } = usePathwayRegistry();
    const { profile, isLoading: profileLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const generateMilestones = useGenerateMilestones();

    const [togglingMilestone, setTogglingMilestone] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [customOrder, setCustomOrder] = useState<string[] | null>(null);
    const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

    // Toggle milestone expansion (single-expand model like RoadmapPage)
    const toggleExpanded = useCallback((milestoneId: string) => {
        setExpandedMilestone(prev => prev === milestoneId ? null : milestoneId);
    }, []);

    const isLoading = registryLoading || profileLoading;

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Get pathway definition
    const pathway = id ? getPathwayById(id) : undefined;

    // Get milestone status sets from profile
    const completedMilestones = useMemo(() => {
        return new Set(profile?.milestones_achieved || []);
    }, [profile?.milestones_achieved]);

    const inProgressMilestones = useMemo(() => {
        return new Set(profile?.milestones_in_progress || []);
    }, [profile?.milestones_in_progress]);

    // Helper to get status for a milestone
    const getMilestoneStatus = useCallback((name: string): MilestoneStatus => {
        if (completedMilestones.has(name)) return 'completed';
        if (inProgressMilestones.has(name)) return 'in-progress';
        return 'pending';
    }, [completedMilestones, inProgressMilestones]);

    // Get milestones for this pathway
    const milestones = useMemo((): MilestoneItem[] => {
        if (!pathway) return [];
        return pathway.requirements.map((req, index) => ({
            id: req.dbId || `${pathway.id}-${index}`,
            name: req.name,
            description: req.description || '',
            category: resolveCategory(req.category),
            isRequired: req.isRequired,
            order: req.order,
            resourceUrl: req.resourceUrl,
            evidenceTypes: req.evidenceTypes,
            estimatedDuration: req.estimatedDuration,
            costEstimate: req.costEstimate as CostEstimate | undefined,
            verificationStatus: req.verificationStatus,
            status: getMilestoneStatus(req.name),
        }));
    }, [pathway, getMilestoneStatus]);

    // Group milestones by category
    const groupedMilestones = useMemo(() => {
        const groups: Record<string, MilestoneItem[]> = {};
        for (const m of milestones) {
            if (!groups[m.category]) {
                groups[m.category] = [];
            }
            groups[m.category].push(m);
        }
        // Apply custom order within each category if set
        if (customOrder) {
            for (const cat of Object.keys(groups)) {
                groups[cat].sort((a, b) => {
                    const aIdx = customOrder.indexOf(a.id);
                    const bIdx = customOrder.indexOf(b.id);
                    if (aIdx === -1 && bIdx === -1) return a.order - b.order;
                    if (aIdx === -1) return 1;
                    if (bIdx === -1) return -1;
                    return aIdx - bIdx;
                });
            }
        }
        return groups;
    }, [milestones, customOrder]);

    // Sort categories by defined order
    const sortedCategories = Object.keys(groupedMilestones).sort(
        (a, b) => (CATEGORY_CONFIG[a as MilestoneCategory]?.order || 99) -
            (CATEGORY_CONFIG[b as MilestoneCategory]?.order || 99)
    );

    // Calculate progress
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    const inProgressCount = milestones.filter(m => m.status === 'in-progress').length;
    const totalCount = milestones.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Cycle milestone status: pending → in-progress → completed → pending
    const handleToggleMilestone = async (milestoneName: string, currentStatus: MilestoneStatus) => {
        if (!profile) return;

        setTogglingMilestone(milestoneName);
        try {
            const currentAchieved = profile.milestones_achieved || [];
            const currentInProgress = profile.milestones_in_progress || [];

            let newAchieved = [...currentAchieved];
            let newInProgress = [...currentInProgress];

            // Cycle: pending → in-progress → completed → pending
            if (currentStatus === 'pending') {
                newInProgress = [...newInProgress, milestoneName];
            } else if (currentStatus === 'in-progress') {
                newInProgress = newInProgress.filter(m => m !== milestoneName);
                newAchieved = [...newAchieved, milestoneName];
            } else {
                newAchieved = newAchieved.filter(m => m !== milestoneName);
            }

            await updateProfile.mutateAsync({
                milestones_achieved: newAchieved,
                milestones_in_progress: newInProgress,
            });

            const nextStatusLabel: Record<MilestoneStatus, string> = {
                'pending': 'Started',
                'in-progress': 'Completed',
                'completed': 'Reset',
            };

            toast({
                title: `Milestone ${nextStatusLabel[currentStatus]}`,
                description: milestoneName,
            });
        } catch (error) {
            toast({
                title: 'Failed to update milestone',
                variant: 'destructive',
            });
        } finally {
            setTogglingMilestone(null);
        }
    };

    // Create goal from milestone
    const handleMakeGoal = (milestoneName: string) => {
        openGoalWizard({
            promotedFromMilestone: milestoneName,
            pathwayContext: pathway?.name,
            currentProgress: Array.from(completedMilestones),
            autoMagic: true,
        });
    };

    // Handle drag end
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const allIds = sortedCategories.flatMap(cat =>
            groupedMilestones[cat].map(m => m.id)
        );

        const oldIndex = allIds.indexOf(active.id as string);
        const newIndex = allIds.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(allIds, oldIndex, newIndex);
            setCustomOrder(newOrder);
        }
    }, [sortedCategories, groupedMilestones]);


    // Refresh milestones
    const handleRefreshMilestones = () => {
        if (!id) return;
        generateMilestones.mutate({
            pathwayId: id,
            forceRefresh: true,
        });
    };

    if (isLoading) {
        return (
            <AppLayout>
                <PageShell width="focused">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </PageShell>
            </AppLayout>
        );
    }

    if (!pathway) {
        return (
            <AppLayout>
                <PageShell width="focused">
                    <div className="text-center py-16">
                        <h2 className="text-xl font-semibold mb-2">Pathway not found</h2>
                        <p className="text-muted-foreground mb-6">
                            This pathway doesn't exist or hasn't been loaded yet.
                        </p>
                        <Button onClick={() => navigate('/career/pathways')}>
                            <ArrowLeft className="w-4 h-4" />
                            Back to Pathways
                        </Button>
                    </div>
                </PageShell>
            </AppLayout>
        );
    }

    // Flatten all milestones for SortableContext
    const allMilestoneIds = sortedCategories.flatMap(cat =>
        groupedMilestones[cat].map(m => m.id)
    );

    return (
        <AppLayout>
            <PageShell width="focused">
                {/* Header */}
                <PageHeader
                    title={pathway.name}
                    description={pathway.description || `${pathway.country || ''} medical career pathway`}
                    backLink="/pathways"
                    backLabel="Pathways"
                >
                    <div className="flex items-center gap-2">
                        <Button
                            variant={isEditMode ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={cn(isEditMode && "bg-secondary text-secondary-foreground")}
                        >
                            {isEditMode ? (
                                <>
                                    <X className="w-4 h-4" />
                                    <span className="hidden sm:inline">Done</span>
                                </>
                            ) : (
                                <>
                                    <Pencil className="w-4 h-4" />
                                    <span className="hidden sm:inline">Reorder</span>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefreshMilestones}
                            disabled={generateMilestones.isPending}
                        >
                            {generateMilestones.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                    </div>
                </PageHeader>

                {/* Progress Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-semibold text-lg">{completedCount} of {totalCount} milestones</div>
                                <div className="text-sm text-muted-foreground">
                                    {progressPercent === 100
                                        ? 'All complete!'
                                        : inProgressCount > 0
                                            ? `${progressPercent}% complete · ${inProgressCount} in progress`
                                            : `${progressPercent}% complete`
                                    }
                                </div>
                            </div>
                        </div>
                        {progressPercent === 100 && (
                            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                Complete
                            </div>
                        )}
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                </motion.div>

                {/* Edit Mode Hint */}
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-muted-foreground"
                    >
                        Drag milestones to reorder them. Your custom order is saved locally.
                    </motion.div>
                )}

                {/* Milestones List */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    {totalCount === 0 ? (
                        <div className="text-center py-12 md:py-16">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <RefreshCw className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
                            </div>
                            <h2 className="font-display text-xl font-semibold mb-2">No milestones loaded yet</h2>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                                Your milestone list is empty. Click below to generate personalized milestones based on your pathway.
                            </p>
                            <Button onClick={handleRefreshMilestones} disabled={generateMilestones.isPending}>
                                {generateMilestones.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Generate Milestones
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={allMilestoneIds}
                                strategy={verticalListSortingStrategy}
                            >
                                {sortedCategories.map((category) => {
                                    const categoryMilestones = groupedMilestones[category];
                                    return (
                                        <div key={category}>
                                            <MilestoneCategoryDivider
                                                category={category as MilestoneCategory}
                                                count={categoryMilestones.length}
                                                completedCount={categoryMilestones.filter(m => m.status === 'completed').length}
                                            />
                                            <div className="space-y-3 mt-3">
                                                {categoryMilestones.map((milestone, idx) => (
                                                    <MilestoneCard
                                                        key={milestone.id}
                                                        id={milestone.id}
                                                        name={milestone.name}
                                                        isCustom={false}
                                                        status={milestone.status}
                                                        index={idx}
                                                        isUpdating={togglingMilestone === milestone.name}
                                                        isEditMode={isEditMode}
                                                        isExpanded={expandedMilestone === milestone.id}
                                                        resourceUrl={milestone.resourceUrl}
                                                        description={milestone.description}
                                                        isRequired={milestone.isRequired}
                                                        evidenceTypes={milestone.evidenceTypes}
                                                        estimatedDuration={milestone.estimatedDuration}
                                                        costEstimate={milestone.costEstimate}
                                                        verificationStatus={milestone.verificationStatus}
                                                        onToggle={() => handleToggleMilestone(milestone.name, milestone.status)}
                                                        onToggleExpand={() => toggleExpanded(milestone.id)}
                                                        onDelete={() => {/* Pathway milestones can't be deleted */}}
                                                        onCreateGoal={() => handleMakeGoal(milestone.name)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* AI Disclaimer */}
                    {totalCount > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/40 text-center">
                            <p className="text-[11px] text-muted-foreground/60 leading-relaxed mx-auto uppercase tracking-wider">
                                AI-Generated Milestones · Personalized for your pathway. Please verify requirements with official regulatory bodies.
                            </p>
                        </div>
                    )}
                </motion.div>
            </PageShell>
        </AppLayout>
    );
};

export default PathwayMilestonesPage;
