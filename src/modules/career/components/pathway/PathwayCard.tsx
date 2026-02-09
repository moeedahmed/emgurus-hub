import { Trash2, Archive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PathwayCardProps {
    title: string;
    subtitle?: string;
    progress: number; // 0-100
    completedCount: number;
    totalCount: number;
    onClick?: () => void;
    onArchive?: () => void;
    onDelete?: () => void;
    className?: string;
}

export function PathwayCard({
    title,
    subtitle,
    progress,
    completedCount,
    totalCount,
    onClick,
    onArchive,
    onDelete,
    className,
}: PathwayCardProps) {
    const isComplete = progress === 100;

    return (
        <div
            className={cn(
                "w-full bg-card border border-border rounded-lg p-4 md:p-5",
                "group/card transition-all",
                "hover:shadow-md hover:-translate-y-0.5",
                className
            )}
        >
            {/* Header Row: Country Badge + Complete Badge + Actions */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {subtitle || 'Training Pathway'}
                    </Badge>
                    {isComplete && (
                        <Badge variant="success-subtle" className="text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                            Complete
                        </Badge>
                    )}
                </div>
                <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    {onArchive && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        onClick={onArchive}
                                    >
                                        <Archive className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Archive pathway</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {onDelete && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={onDelete}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete pathway</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3
                className="font-semibold mb-4 line-clamp-2 group-hover/card:text-primary transition-colors cursor-pointer"
                onClick={onClick}
            >
                {title}
            </h3>

            {/* Progress Section */}
            <div onClick={onClick} className="cursor-pointer">
                <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{completedCount}/{totalCount} steps</span>
                </div>
                <Progress value={progress} className="h-1.5" />
            </div>
        </div>
    );
}
