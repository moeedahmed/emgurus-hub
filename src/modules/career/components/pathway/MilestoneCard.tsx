import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, Pencil, Trash2, EyeOff, Check, Target, ExternalLink, Clock, Coins, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChecklistCircle } from '@/components/ui/ChecklistCircle';
import { MicroActionButton } from '@/components/ui/MicroActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvidenceTypeConfig } from '@/modules/career/data/evidenceTypeConfig';
import {
    formatTimeframe,
    getTimeframeColor,
    formatCostBadge,
    formatCostRange,
    getVerificationLabel,
    type Timeframe,
    type CostEstimate,
    type VerificationStatus,
} from '@/modules/career/utils/milestoneFormatters';

interface MilestoneCardProps {
    id: string;
    name: string;
    isCustom: boolean;
    status: 'pending' | 'in-progress' | 'completed';
    index: number;
    isUpdating: boolean;
    isEditMode: boolean;
    isExpanded: boolean;
    resourceUrl?: string;
    description?: string;
    isRequired?: boolean;
    evidenceTypes?: string[];
    estimatedDuration?: string;
    costEstimate?: CostEstimate | null;
    verificationStatus?: string;
    onToggle: () => void;
    onToggleExpand: () => void;
    onDelete: () => void;
    onCreateGoal: () => void;
    onEdit?: () => void;
    isEditingName?: boolean;
    onSaveName?: (newName: string) => void;
    onCancelEdit?: () => void;
}

export function MilestoneCard({
    id,
    name,
    isCustom,
    status,
    index,
    isUpdating,
    isEditMode,
    isExpanded,
    resourceUrl,
    description,
    isRequired,
    evidenceTypes,
    estimatedDuration,
    costEstimate,
    verificationStatus,
    onToggle,
    onToggleExpand,
    onDelete,
    onCreateGoal,
    onEdit,
    isEditingName,
    onSaveName,
    onCancelEdit
}: MilestoneCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 200ms ease',
    };

    const hasDetails = description || (evidenceTypes && evidenceTypes.length > 0) || resourceUrl || costEstimate;
    const timeframe = estimatedDuration as Timeframe | undefined;
    const costBadge = formatCostBadge(costEstimate);
    const showVerificationWarning = verificationStatus && verificationStatus !== 'manual' && verificationStatus !== 'ai_validated';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'touch-manipulation transition-opacity',
                isDragging && 'opacity-50 z-50'
            )}
        >
            <div
                className={cn(
                    'bg-card border rounded-lg transition-all',
                    isExpanded && 'ring-2 ring-primary border-primary',
                    isDragging ? 'border-dashed border-primary/50 bg-muted/50' : 'border-border'
                )}
            >
                {/* Card header */}
                <div className="p-2.5 md:p-3">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        {/* Left: Drag + Status */}
                        <div className="flex items-center shrink-0 self-stretch">
                            <div className="flex items-center gap-1">
                                {isEditMode && (
                                    <button
                                        {...attributes}
                                        {...listeners}
                                        className="touch-none cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label="Drag to reorder"
                                    >
                                        <GripVertical className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <ChecklistCircle
                                    status={status}
                                    index={index + 1}
                                    isUpdating={isUpdating}
                                    onClick={isEditMode ? undefined : onToggle}
                                    size="md"
                                />
                            </div>
                        </div>

                        {/* Right: Title + Badges + Actions — Grid Layout */}
                        <div
                            className="flex-1 min-w-0 cursor-pointer grid grid-cols-[1fr_auto] gap-x-2 gap-y-1.5 md:gap-x-4"
                            onClick={(e) => {
                                if ((e.target as HTMLElement).closest('button, a')) return;
                                if (!isEditMode) onToggleExpand();
                            }}
                        >
                            {/* Row 1: Title */}
                            <div className="col-span-2 md:col-span-1 md:col-start-1 md:row-start-1 min-w-0">
                                {isEditingName ? (
                                    <input
                                        autoFocus
                                        defaultValue={name}
                                        className="w-full bg-background border border-input rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-8"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.stopPropagation();
                                                e.currentTarget.blur();
                                            }
                                            if (e.key === 'Escape') {
                                                e.stopPropagation();
                                                onCancelEdit?.();
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const val = e.target.value;
                                            if (val !== name) {
                                                onSaveName?.(val);
                                            } else {
                                                onCancelEdit?.();
                                            }
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <h3 className={cn(
                                        "font-semibold text-sm break-words leading-snug transition-colors",
                                        status === 'completed' ? "text-muted-foreground" : "text-foreground"
                                    )}>
                                        {name}
                                        {resourceUrl && (
                                            <a
                                                href={resourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex ml-1.5 align-middle text-primary/60 hover:text-primary transition-colors"
                                                title="View official source"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </h3>
                                )}
                            </div>

                            {/* Row 2: Metadata badges */}
                            <div className="col-span-1 col-start-1 row-start-2 md:row-start-2 md:col-start-1 flex flex-wrap items-center gap-1.5 min-w-0">
                                {timeframe && (
                                    <span className={cn(
                                        'flex items-center justify-center gap-1 px-2 h-5 text-[10px] font-bold tracking-tight rounded-md whitespace-nowrap shrink-0 border border-transparent',
                                        getTimeframeColor(timeframe)
                                    )}>
                                        <Clock className="w-3 h-3" />
                                        {formatTimeframe(timeframe)}
                                    </span>
                                )}
                                {costBadge && (
                                    <span className="flex items-center justify-center gap-1 px-2 h-5 text-[10px] font-bold tracking-tight rounded-md whitespace-nowrap shrink-0 bg-accent/10 text-accent border border-transparent">
                                        <Coins className="w-3 h-3" />
                                        {costBadge}
                                    </span>
                                )}
                                {isRequired && (
                                    <span className="flex items-center justify-center px-2 h-5 text-[10px] font-bold tracking-tight rounded-md whitespace-nowrap shrink-0 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-transparent">
                                        Required
                                    </span>
                                )}
                            </div>

                            {/* Actions: Row 2 mobile / Row 1-2 desktop */}
                            <div className="col-span-1 col-start-2 row-start-2 md:row-start-1 md:row-span-2 md:self-center justify-self-end flex items-center gap-1.5 sm:gap-2">
                                {isEditMode ? (
                                    <>
                                        {onEdit && (
                                            <MicroActionButton
                                                icon={isEditingName ? Check : Pencil}
                                                label={isEditingName ? "Save" : "Edit"}
                                                onClick={() => {
                                                    if (isEditingName) {
                                                        const input = document.querySelector(`[data-milestone-id="${id}"] input`) as HTMLInputElement;
                                                        input?.blur();
                                                    } else {
                                                        onEdit();
                                                    }
                                                }}
                                                variant={isEditingName ? "active" : "default"}
                                                tooltip={isEditingName ? "Save name" : "Edit name"}
                                            />
                                        )}
                                        <MicroActionButton
                                            icon={isCustom ? Trash2 : EyeOff}
                                            label={isCustom ? "Delete" : "Hide"}
                                            onClick={onDelete}
                                            variant="destructive"
                                            tooltip={isCustom ? "Delete custom milestone" : "Hide milestone"}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {status !== 'completed' && (
                                            <MicroActionButton
                                                icon={Target}
                                                label="Goal"
                                                onClick={onCreateGoal}
                                                tooltip="Set as active goal"
                                            />
                                        )}
                                    </>
                                )}

                                {hasDetails && !isEditMode && (
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 text-muted-foreground shrink-0 transition-transform ml-1",
                                            isExpanded && "rotate-180"
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence>
                        {isExpanded && hasDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 pt-2 mt-2 border-t border-border space-y-4">
                                    {/* Description */}
                                    {description && (
                                        <div>
                                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-3.5 h-3.5 text-primary" /> About this milestone
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Evidence types */}
                                    {evidenceTypes && evidenceTypes.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Evidence needed</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {evidenceTypes.map((evType) => {
                                                    const config = getEvidenceTypeConfig(evType);
                                                    const Icon = config.icon;
                                                    return (
                                                        <span
                                                            key={evType}
                                                            className={cn(
                                                                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                                                                config.badgeVariant
                                                            )}
                                                        >
                                                            <Icon className="w-3 h-3" />
                                                            {config.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cost details */}
                                    {costEstimate && (
                                        <div>
                                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                                <Coins className="w-3.5 h-3.5 text-accent" /> Estimated Cost
                                            </h4>
                                            <div className="flex flex-wrap items-baseline gap-2">
                                                <span className="text-lg font-semibold text-foreground">
                                                    {formatCostRange(costEstimate)}
                                                </span>
                                                {costEstimate.note && (
                                                    <span className="text-xs text-muted-foreground italic">{costEstimate.note}</span>
                                                )}
                                            </div>
                                            {costEstimate.source_url && (
                                                <a
                                                    href={costEstimate.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View source
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Resource link */}
                                    {resourceUrl && (
                                        <a
                                            href={resourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline flex items-center gap-1.5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Official source
                                        </a>
                                    )}

                                    {/* Verification warning */}
                                    {showVerificationWarning && (
                                        <div className={cn(
                                            "flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border",
                                            verificationStatus === 'ai_unvalidated'
                                                ? "text-warning bg-warning/10 border-warning/20"
                                                : verificationStatus === 'stale'
                                                    ? "text-destructive bg-destructive/10 border-destructive/20"
                                                    : "text-muted-foreground bg-muted/50 border-border"
                                        )}>
                                            {verificationStatus === 'stale' ? (
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            ) : (
                                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                            )}
                                            <span className="font-medium">
                                                {verificationStatus === 'ai_unvalidated'
                                                    ? "🔍 AI researched — verify with official sources"
                                                    : verificationStatus === 'stale'
                                                        ? "⚠️ Needs re-verification — data may be outdated"
                                                        : `${getVerificationLabel(verificationStatus as VerificationStatus)}`
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
