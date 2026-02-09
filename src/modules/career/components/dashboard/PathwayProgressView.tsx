import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, ChevronDown, ChevronUp, Plus, Sparkles, Map, RefreshCw, Loader2, Target, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PathwayProgressResult } from '@/modules/career/hooks/usePathwayProgress';
import { ChecklistCircle } from '@/components/ui/ChecklistCircle';
import { MicroActionButton } from '@/components/ui/MicroActionButton';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveCategory, CATEGORY_CONFIG } from '@/modules/career/data/categoryConfig';
import { MilestoneCategoryDivider } from './MilestoneCategoryDivider';
import { useGenerateMilestones } from '@/modules/career/hooks/useGenerateMilestones';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import AutoHeight from 'embla-carousel-auto-height';

interface PathwayProgressViewProps {
    results: PathwayProgressResult[];
    onToggleMilestone: (milestoneName: string, isCurrentlyComplete: boolean) => void;
    completingMilestone?: string | null;
    onAddMilestone?: (pathwayId: string, pathwayName: string) => void;
    hideGoalButtons?: boolean;
    className?: string;
    layout?: 'grid' | 'carousel';
}

export function PathwayProgressView({
    results,
    onToggleMilestone,
    completingMilestone = null,
    onAddMilestone,
    hideGoalButtons = false,
    className,
    layout = 'grid'
}: PathwayProgressViewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!results || results.length === 0) {
        return null;
    }

    if (layout === 'carousel') {
        return (
            <div className={cn("px-1", className)}>
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    plugins={[AutoHeight()]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 items-start">
                        {results.map((result, idx) => (
                            <CarouselItem key={result.pathway?.id || idx} className="pl-4 basis-full">
                                <div>
                                    <PathwayProgressCard
                                        result={result}
                                        index={idx}
                                        onToggleMilestone={onToggleMilestone}
                                        completingMilestone={completingMilestone}
                                        onAddMilestone={onAddMilestone}
                                        hideGoalButtons={hideGoalButtons}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {results.length > 1 && (
                        <div className="hidden sm:block">
                            <CarouselPrevious className="-left-4" />
                            <CarouselNext className="-right-4" />
                        </div>
                    )}
                    {/* Mobile dots or indicators could go here if needed */}
                </Carousel>
                {results.length > 1 && (
                    <p className="text-xs text-center text-muted-foreground mt-2 sm:hidden">
                        Swipe to see more pathways
                    </p>
                )}
            </div>
        );
    }

    // Sort to ensure the order is stable
    const visibleLimit = 6;
    const visibleResults = isExpanded ? results : results.slice(0, visibleLimit);
    const hasMore = results.length > visibleLimit;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">Career pathways</h3>
                </div>
                {hasMore && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>Show less <ChevronUp className="w-4 h-4" /></>
                        ) : (
                            <>View {results.length - visibleLimit} more <ChevronDown className="w-4 h-4" /></>
                        )}
                    </button>
                )}
            </div>

            <div className="columns-1 lg:columns-2 gap-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {visibleResults.map((result, idx) => (
                        <div key={result.pathway?.id || idx} className="break-inside-avoid mb-4">
                            <PathwayProgressCard
                                result={result}
                                index={idx}
                                onToggleMilestone={onToggleMilestone}
                                completingMilestone={completingMilestone}
                                onAddMilestone={onAddMilestone}
                                hideGoalButtons={hideGoalButtons}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export function PathwayProgressCard({
    result,
    index,
    onToggleMilestone,
    completingMilestone,
    onAddMilestone,
    hideGoalButtons
}: {
    result: PathwayProgressResult;
    index: number;
    onToggleMilestone: (name: string, isComplete: boolean) => void;
    completingMilestone: string | null;
    onAddMilestone?: (pathwayId: string, pathwayName: string) => void;
    hideGoalButtons: boolean;
}) {
    const navigate = useNavigate();
    const { data: profile } = useProfile();
    const generateMilestones = useGenerateMilestones();

    const handleCreateGoal = (milestoneName: string) => {
        navigate('/goal', {
            state: {
                promotedFromMilestone: milestoneName,
                pathwayContext: result.pathway?.name,
                currentProgress: result.completedMilestoneNames,
            }
        });
    };

    const handleGenerateMilestones = (forceRefresh = false) => {
        if (!result.pathway) return;
        // New unified function pulls profile context automatically
        generateMilestones.mutate({
            pathwayId: result.pathway.id,
            forceRefresh,
        });
    };

    if (!result.pathway) return null;

    const matchedVia = result.pathway.matchedVia;
    const isCustom = result.pathway.id.startsWith('custom-path');
    const hasMilestones = result.completed.length > 0 || result.missing.length > 0;
    const isGenerating = generateMilestones.isPending;

    // Create ordered list of all milestones sorted by category then pathway order
    const allMilestones = [...result.completed, ...result.missing].sort((a, b) => {
        const catOrderA = CATEGORY_CONFIG[resolveCategory(a.category)].order;
        const catOrderB = CATEGORY_CONFIG[resolveCategory(b.category)].order;
        if (catOrderA !== catOrderB) return catOrderA - catOrderB;
        return a.order - b.order;
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
                "bg-card border border-border rounded-xl overflow-hidden shadow-sm",
            )}
        >

                {/* Header */}
                <div className="p-5 border-b border-border bg-muted/30">
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-col gap-1 items-start">
                            <h4 className="font-semibold text-base text-foreground leading-snug">
                                {matchedVia || result.pathway.name}
                            </h4>
                            {result.pathway.country && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground w-fit">
                                    {result.pathway.country}
                                </span>
                            )}
                            {isCustom && (
                                <span className="text-xs text-muted-foreground">Custom Pathway</span>
                            )}
                        </div>
                        {/* Refresh button for pathways with milestones */}
                        {hasMilestones && !isCustom && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleGenerateMilestones(true)}
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
                    </div>

                    {/* Progress indicator */}
                    {!isCustom && (
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
                </div>

                {/* Content - Unified Milestone Checklist */}
                <div className="p-5">
                    {/* Empty state - no milestones */}
                    {!hasMilestones ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center border border-dashed border-border">
                                {isGenerating ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : (
                                    <Map className="w-8 h-8 text-muted-foreground/30" />
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
                        <div className="space-y-2">
                                {allMilestones.map((req, idx) => {
                                    const isCompleted = result.completed.some(c => c.name === req.name);
                                    const prevReq = idx > 0 ? allMilestones[idx - 1] : null;
                                    const currentCat = resolveCategory(req.category);
                                    const showDivider = !prevReq || resolveCategory(prevReq.category) !== currentCat;

                                    return (
                                        <div key={req.name}>
                                            {showDivider && (
                                                <MilestoneCategoryDivider
                                                    category={currentCat}
                                                    className={idx > 0 ? 'mt-3 mb-1' : 'mb-1'}
                                                />
                                            )}
                                            <div
                                                className="group/item flex items-center gap-3 py-2 px-2 rounded-lg transition-colors hover:bg-muted/30"
                                            >
                                                <ChecklistCircle
                                                    status={isCompleted ? 'completed' : 'pending'}
                                                    index={idx + 1}
                                                    isUpdating={completingMilestone === req.name}
                                                    onClick={() => onToggleMilestone(req.name, isCompleted)}
                                                    tooltipText={isCompleted ? 'Unmark' : 'Mark complete'}
                                                    size="sm"
                                                />
                                                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                                    <p className={cn(
                                                        "text-sm font-semibold truncate",
                                                        isCompleted ? "text-muted-foreground" : "text-foreground"
                                                    )}>
                                                        {req.name}
                                                    </p>
                                                    {req.resourceUrl && (
                                                        <a
                                                            href={req.resourceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="shrink-0 text-primary/60 hover:text-primary transition-colors opacity-0 group-hover/item:opacity-100"
                                                            title="View official source"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                                {!isCompleted && !hideGoalButtons && (
                                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                        <MicroActionButton
                                                            icon={Target}
                                                            label="Goal"
                                                            onClick={() => handleCreateGoal(req.name)}
                                                            shrinkOnMobile
                                                            tooltip="Set as active goal"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                    )}

                    {/* Add Milestone Button - Footer */}
                    {onAddMilestone && result.pathway && !isCustom && (
                        <div className="pt-6 mt-auto">
                            <Button
                                variant="ghost"
                                onClick={() => onAddMilestone(result.pathway!.id, result.pathway!.name)}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Custom Milestone
                            </Button>
                        </div>
                    )}
                </div>
        </motion.div>
    );
}
