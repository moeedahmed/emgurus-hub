import { Check, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type ChecklistStatus = 'pending' | 'in-progress' | 'completed';

interface ChecklistCircleProps {
    /** Current status of the item */
    status: ChecklistStatus;
    /** Step number to display when pending */
    index: number;
    /** Show loading spinner */
    isUpdating?: boolean;
    /** Click handler for toggling status */
    onClick?: (e: React.MouseEvent) => void;
    /** Circle size - sm: w-8 h-8, md: w-9 h-9 */
    size?: 'sm' | 'md';
    /** Tooltip text on hover */
    tooltipText?: string;
    /** Disable interactions */
    disabled?: boolean;
}

/**
 * Standardized status circle for checklist items.
 * Used by both roadmap steps and pathway milestones.
 */
export function ChecklistCircle({
    status,
    index,
    isUpdating = false,
    onClick,
    size = 'sm',
    tooltipText,
    disabled = false,
}: ChecklistCircleProps) {
    const sizeClasses = size === 'md' ? 'w-9 h-9' : 'w-8 h-8';

    const statusClasses = {
        completed: 'bg-success text-success-foreground',
        'in-progress': 'bg-primary text-primary-foreground',
        pending: 'bg-muted text-muted-foreground hover:bg-muted/80',
    };

    const circle = (
        <button
            onClick={onClick}
            disabled={disabled || isUpdating}
            className={cn(
                sizeClasses,
                'rounded-full flex items-center justify-center shrink-0 text-sm font-medium transition-all',
                'hover:scale-110 active:scale-95',
                isUpdating && 'bg-muted border border-muted-foreground/20 cursor-wait',
                !isUpdating && statusClasses[status],
                onClick && 'cursor-pointer',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={tooltipText}
        >
            {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === 'completed' ? (
                <Check className="w-4 h-4" />
            ) : status === 'in-progress' ? (
                <Circle className="w-5 h-5 fill-current" />
            ) : (
                index
            )}
        </button>
    );

    if (!tooltipText) return circle;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{circle}</TooltipTrigger>
            <TooltipContent side="left">
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}
