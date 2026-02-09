import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChecklistCircle } from '@/components/ui/ChecklistCircle';

interface StatusRowProps {
    status: 'pending' | 'in-progress' | 'completed';
    title: ReactNode;
    index?: number;
    isUpdating?: boolean;
    onToggle?: (e: React.MouseEvent) => void;
    rightActions?: ReactNode;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
    description?: string;
}

export function StatusRow({
    status,
    title,
    index,
    isUpdating,
    onToggle,
    rightActions,
    children,
    className,
    onClick,
    description
}: StatusRowProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                onClick && "cursor-pointer hover:bg-muted/30",
                className
            )}
            onClick={onClick}
        >
            {/* Status Indicator */}
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                <ChecklistCircle
                    status={status}
                    index={index}
                    isUpdating={isUpdating}
                    onClick={onToggle}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className={cn(
                            "text-sm font-semibold transition-colors leading-snug",
                            status === 'completed' ? "text-muted-foreground" : "text-foreground"
                        )}>
                            {title}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>

                    {rightActions && (
                        <div className="shrink-0 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            {rightActions}
                        </div>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
