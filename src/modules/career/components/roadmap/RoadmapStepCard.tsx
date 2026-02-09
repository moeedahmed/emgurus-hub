import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, Pencil, Trash2, MessageSquare, ExternalLink, AlertCircle, AlertTriangle, Clock, Target, CheckCircle, Coins, Lightbulb, ListChecks } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { cn } from '@/lib/utils';
import { RoadmapNode } from '@/modules/career/hooks/useRoadmap';
import { ChecklistCircle } from '@/components/ui/ChecklistCircle';
import { MicroActionButton } from '@/components/ui/MicroActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface RoadmapStepCardProps {
  node: RoadmapNode;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusToggle: (e: React.MouseEvent) => void;
  isUpdating: boolean;
  getTimeframeColor: (timeframe: string | null) => string;
  onEdit?: () => void;
  onDelete?: () => void;
  onAskAI?: () => void;
  onPromote?: () => void;
  isEditMode?: boolean;
}

const formatTimeframe = (timeframe: string) => {
  const map: Record<string, string> = {
    '30d': '30 Days',
    '6mo': '6 Months',
    '12mo': '1 Year',
    '18mo+': '18+ Months'
  };
  return map[timeframe] || timeframe;
};

const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

const formatCostBadge = (cost: RoadmapNode['cost_estimate']): string => {
  if (!cost) return '';
  if (cost.min === 0 && (!cost.max || cost.max === 0)) return 'Free';
  if (!cost.max || cost.max === cost.min) {
    return `~${formatCurrency(cost.min, cost.currency)}`;
  }
  return `${formatCurrency(cost.min, cost.currency)}-${formatCurrency(cost.max, cost.currency)}`;
};

const formatCostRange = (cost: RoadmapNode['cost_estimate']): string => {
  if (!cost) return '';
  if (cost.min === 0 && (!cost.max || cost.max === 0)) return 'Free';
  if (!cost.max || cost.max === cost.min) {
    return formatCurrency(cost.min, cost.currency);
  }
  return `${formatCurrency(cost.min, cost.currency)} - ${formatCurrency(cost.max, cost.currency)}`;
};

const markdownComponents: Partial<Components> = {
  a: ({ node, ...props }) => (
    <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...props} />
  ),
  p: ({ children }) => <>{children}</>,
  h1: ({ children }) => <strong>{children}</strong>,
  h2: ({ children }) => <strong>{children}</strong>,
  h3: ({ children }) => <strong>{children}</strong>,
  ul: ({ children }) => <>{children}</>,
  ol: ({ children }) => <>{children}</>,
  li: ({ children }) => <span>{children}; </span>,
};

export function RoadmapStepCard({
  node,
  index,
  isExpanded,
  onToggleExpand,
  onStatusToggle,
  isUpdating,
  getTimeframeColor,
  onEdit,
  onDelete,
  onAskAI,
  onPromote,
  isEditMode,
}: RoadmapStepCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
  };

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
        {/* Main card content - responsive layout */}
        <div className="p-2.5 md:p-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Left side: Drag + Status - self-stretch to center vertically */}
            <div className="flex items-center shrink-0 self-stretch">
              <div className="flex items-center gap-1">
                {/* Drag Handle - Only in Edit Mode */}
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

                {/* Status Toggle Circle */}
                <ChecklistCircle
                  status={node.status}
                  index={index + 1}
                  isUpdating={isUpdating}
                  onClick={onStatusToggle}
                  size="md"
                />
              </div>
            </div>

            {/* Right side: Title + Actions - responsive layout */}
            {/* Right side: Title + Actions - Grid Layout */}
            <div
              className="flex-1 min-w-0 cursor-pointer grid grid-cols-[1fr_auto] gap-x-2 gap-y-1.5 md:gap-x-4"
              onClick={onToggleExpand}
            >
              {/* 1. Title Area - Spans full width on mobile, left col on desktop */}
              <div className="col-span-2 md:col-span-1 md:col-start-1 md:row-start-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-sm break-words leading-snug transition-colors",
                  node.status === 'completed' ? "text-muted-foreground" : "text-foreground"
                )}>{node.title}</h3>
              </div>

              {/* 2. Metadata Area - Row 2 on both, left col */}
              <div className="col-span-1 col-start-1 row-start-2 md:row-start-2 md:col-start-1 flex flex-wrap items-center gap-2 min-w-0">
                {/* Timeframe badge */}
                {node.timeframe && (
                  <span className={cn(
                    'flex items-center justify-center gap-1 px-2 h-5 text-[10px] font-bold tracking-tight rounded-md whitespace-nowrap shrink-0 border border-transparent',
                    getTimeframeColor(node.timeframe).replace('rounded-full', 'rounded-md'),
                    'bg-opacity-15'
                  )}>
                    <Clock className="w-3 h-3" />
                    {formatTimeframe(node.timeframe)}
                  </span>
                )}

                {/* Cost badge */}
                {node.cost_estimate && (
                  <span className="flex items-center justify-center gap-1 px-2 h-5 text-[10px] font-bold tracking-tight rounded-md whitespace-nowrap shrink-0 bg-accent/10 text-accent border border-transparent">
                    <Coins className="w-3 h-3" />
                    {formatCostBadge(node.cost_estimate)}
                  </span>
                )}
              </div>

              {/* 3. Actions Area - Right col. Row 2 on mobile, Row 1-2 span on desktop */}
              <div className="col-span-1 col-start-2 row-start-2 md:row-start-1 md:row-span-2 md:self-center justify-self-end flex items-center gap-1.5 sm:gap-2">
                {/* Action buttons */}
                {onAskAI && !isEditMode && (
                  <MicroActionButton
                    icon={MessageSquare}
                    label="HELP"
                    onClick={onAskAI}
                    tooltip="Get AI suggestions"
                  />
                )}

                {onEdit && isEditMode && (
                  <MicroActionButton
                    icon={Pencil}
                    label="Edit"
                    onClick={onEdit}
                    tooltip="Edit step details"
                  />
                )}
                {onPromote && !isEditMode && (
                  <MicroActionButton
                    icon={Target}
                    label="Goal"
                    onClick={onPromote}
                    tooltip="Set as active goal"
                  />
                )}
                {onDelete && isEditMode && (
                  <MicroActionButton
                    icon={Trash2}
                    label="Delete"
                    onClick={onDelete}
                    tooltip="Remove this step"
                    variant="destructive"
                  />
                )}

                {/* Chevron indicator */}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground shrink-0 transition-transform ml-1",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-2 mt-2 border-t border-border space-y-4">
                  {/* Completed date banner */}
                  {node.status === 'completed' && node.completed_at && (
                    <div className="flex items-center gap-2 text-sm text-success bg-success/10 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed on {format(new Date(node.completed_at), 'MMM d, yyyy')}</span>
                    </div>
                  )}

                  {node.why && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-primary" /> Why this matters
                      </h4>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        <ReactMarkdown components={markdownComponents}>
                          {node.why}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {node.how.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <ListChecks className="w-3.5 h-3.5 text-primary" /> How to complete
                      </h4>
                      <ul className="space-y-2">
                        {node.how.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground">
                              <ReactMarkdown components={markdownComponents}>
                                {step}
                              </ReactMarkdown>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {node.examples.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-warning" /> Real-world examples
                      </h4>
                      <ul className="space-y-1.5">
                        {node.examples.map((example, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-warning mt-0.5 shrink-0">-</span>
                            <span className="text-muted-foreground">
                              <ReactMarkdown components={markdownComponents}>
                                {example}
                              </ReactMarkdown>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {node.cost_estimate && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5 text-accent" /> Estimated Cost
                      </h4>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-semibold text-foreground">
                          {formatCostRange(node.cost_estimate)}
                        </span>
                        {node.cost_estimate.note && (
                          <span className="text-xs text-muted-foreground italic">{node.cost_estimate.note}</span>
                        )}
                      </div>
                      {node.cost_estimate.source_url && (
                        <a
                          href={node.cost_estimate.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View source
                        </a>
                      )}
                    </div>
                  )}

                  {/* Sources data kept in model for AI assistant context but not rendered —
                     inline links in why/how fields already provide contextual source references */}

                  {/* Trust indicator - user-friendly action labels */}
                  {node.confidence && node.confidence !== 'high' && (
                    <div className={cn(
                      "flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border",
                      node.confidence === 'medium'
                        ? "text-warning bg-warning/10 border-warning/20"
                        : "text-destructive bg-destructive/10 border-destructive/20"
                    )}>
                      {node.confidence === 'medium' ? (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <div className="flex flex-wrap items-center gap-x-1">
                        <span className="font-medium whitespace-nowrap">
                          {node.confidence === 'medium'
                            ? "🔍 Double-check this step"
                            : "⚠️ Verify with official sources"
                          }
                        </span>
                        <span className="opacity-80">
                          — {node.confidence === 'medium'
                            ? "AI is moderately confident"
                            : "AI has low confidence"
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div >
  );
}
