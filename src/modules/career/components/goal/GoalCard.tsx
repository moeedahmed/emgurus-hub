import { motion } from 'framer-motion';
import { Archive, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Goal } from '@/modules/career/hooks/useGoals';
import { MOTION } from '@/modules/career/lib/motion';

interface GoalCardProps {
    goal: Goal;
    progress: { total: number; completed: number; percentage: number };
    index: number;
    onArchive: (goalId: string) => void;
    onDelete: (goalId: string) => void;
}

const formatTimeline = (val: string) => {
    const mapping: Record<string, string> = {
        '3months': '< 3 months',
        '6months': '3-6 months',
        '12months': '6-12 months',
        '12plus': '12+ months',
        '1year': '< 1 year',
        '2years': '1-2 years',
        '5years': '2-5 years',
        '3m': '3m',
        '6m': '6m',
        '12m': '12m',
        '2y': '2y',
        '5y': '5y',
    };
    return mapping[val] || val;
};

const getGoalTypeVariant = (type: string) => {
    switch (type) {
        case 'migrate':
            return 'primary-subtle';
        case 'advance':
            return 'success-subtle';
        case 'exam':
            return 'warning-subtle';
        default:
            return 'accent-subtle';
    }
};

const getGoalTypeLabel = (type: string) => {
    switch (type) {
        case 'migrate':
            return 'Migration';
        case 'advance':
            return 'Advancement';
        case 'exam':
            return 'Exam';
        default:
            return 'Expertise';
    }
};

export function GoalCard({ goal, progress, index, onArchive, onDelete }: GoalCardProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * MOTION.ENTRANCE.STAGGER }}
        >
            <div
                className="bg-card border border-border rounded-lg p-4 md:p-5 h-full cursor-pointer group/card transition-all hover:shadow-md hover:-translate-y-0.5"
                onClick={() => navigate(`/career/roadmap/${goal.id}`)}
                title={goal.title}
            >
                {/* Header Row: Badge + Actions */}
                <div className="flex items-start justify-between mb-4">
                    <Badge variant={getGoalTypeVariant(goal.type) as any}>
                        {getGoalTypeLabel(goal.type)}
                    </Badge>
                    <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        onClick={() => onArchive(goal.id)}
                                    >
                                        <Archive className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Archive goal</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => onDelete(goal.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete goal</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover/card:text-primary transition-colors">
                    {goal.title}
                </h3>

                {/* Timeline */}
                {goal.timeline && (
                    <p className="text-sm text-muted-foreground mb-4">
                        Timeline: <span className="text-foreground/80">{formatTimeline(goal.timeline)}</span>
                    </p>
                )}

                {/* Progress Section */}
                <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress.completed}/{progress.total} steps</span>
                    </div>
                    <Progress value={progress.percentage} className="h-1.5" />
                </div>
            </div>
        </motion.div>
    );
}
