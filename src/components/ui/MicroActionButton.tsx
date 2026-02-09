import { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MicroActionButtonProps {
    /** The icon to display */
    icon: LucideIcon;
    /** The text label */
    label: string;
    /** Click handler */
    onClick: (e: React.MouseEvent) => void;
    /** Optional tooltip text */
    tooltip?: string;
    /** Visual variant - default is muted/primary hover, destructive is red */
    variant?: 'default' | 'destructive' | 'active';
    /** Whether to hide text on mobile screens */
    shrinkOnMobile?: boolean;
    /** Optional extra classes */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Aria label (defaults to label if not provided) */
    ariaLabel?: string;
}

/**
 * Standardized "pill" button for micro-actions like Goal, Help, Edit, Delete.
 * replaces the legacy GoalButton and inline styles.
 */
export function MicroActionButton({
    icon: Icon,
    label,
    onClick,
    tooltip,
    variant = 'default',
    shrinkOnMobile = false,
    className,
    disabled = false,
    ariaLabel,
}: MicroActionButtonProps) {
    const variants = {
        default: "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20",
        destructive: "text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20",
        active: "text-primary bg-primary/20 hover:bg-primary/30 border-primary/20",
    };

    const Button = (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onClick(e);
            }}
            disabled={disabled}
            aria-label={ariaLabel || label}
            className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 h-7 transition-all rounded-full border bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            <span className={cn(
                "text-[10px] font-bold uppercase tracking-tight",
                shrinkOnMobile && "hidden sm:inline"
            )}>
                {label}
            </span>
        </button>
    );

    if (tooltip) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {Button}
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
        );
    }

    return Button;
}
