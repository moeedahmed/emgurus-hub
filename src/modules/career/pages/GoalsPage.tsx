import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Map, ArrowRight, Loader2, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { PageShell } from '@/modules/career/components/layout/PageShell';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import { GoalCard } from '@/modules/career/components/goal/GoalCard';
import { useGoals, useUpdateGoal, useDeleteGoal, Goal } from '@/modules/career/hooks/useGoals';
import { useAllGoalsProgress } from '@/modules/career/hooks/useGoalProgress';
import { toast } from 'sonner';
import { useGoalWizard } from '@/modules/career/contexts/GoalWizardContext';
import { Trash2 } from 'lucide-react';


const GoalsPage = () => {
    const navigate = useNavigate();
    const { data: goals = [], isLoading, error } = useGoals();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

    const activeGoals = goals.filter((g) => g.status === 'active');
    const archivedGoals = goals.filter((g) => g.status === 'archived');
    const activeGoalIds = activeGoals.map(g => g.id);
    const { data: progressData = {} } = useAllGoalsProgress(activeGoalIds);

    const handleArchive = (goalId: string) => {
        updateGoal.mutate(
            { id: goalId, status: 'archived' },
            {
                onSuccess: () => toast.success('Goal archived'),
                onError: () => toast.error('Failed to archive goal'),
            }
        );
    };

    const handleRestore = (goalId: string) => {
        updateGoal.mutate(
            { id: goalId, status: 'active' },
            {
                onSuccess: () => toast.success('Goal restored'),
                onError: () => toast.error('Failed to restore goal'),
            }
        );
    };

    const handleDelete = (goalId: string) => {
        setGoalToDelete(goalId);
    };

    const confirmDelete = () => {
        if (goalToDelete) {
            deleteGoal.mutate(goalToDelete, {
                onSuccess: () => toast.success('Goal deleted'),
                onError: () => toast.error('Failed to delete goal'),
            });
            setGoalToDelete(null);
        }
    };

    if (error) {
        return (
            <AppLayout>
                <div className="p-6 lg:p-8 text-center">
                    <p className="text-destructive">Failed to load goals. Please try again.</p>
                </div>
            </AppLayout>
        );
    }

    const { openGoalWizard } = useGoalWizard();

    // ... existing code ...

    return (
        <AppLayout>
            <PageShell width="wide">
                {/* Header */}
                <PageHeader
                    title="Your goals"
                    description="Track progress and manage roadmaps"
                >
                    <Button size="sm" className="md:h-10 md:px-4" onClick={() => openGoalWizard()}>
                        <Plus className="h-4 w-4" />
                        <span>New<span className="hidden sm:inline"> goal</span></span>
                    </Button>
                </PageHeader>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : activeGoals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                            <Map className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="font-display text-xl font-semibold mb-2">No active plans yet</h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                            Start by creating your first career goal. We'll generate a personalized roadmap.
                        </p>
                        <Button onClick={() => openGoalWizard()}>
                            Create your first goal
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {activeGoals.map((goal, index) => {
                            const progress = progressData[goal.id] || { total: 0, completed: 0, percentage: 0 };

                            return (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    progress={progress}
                                    index={index}
                                    onArchive={handleArchive}
                                    onDelete={handleDelete}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Archived Goals Section */}
                {archivedGoals.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="mt-8 pb-8"
                    >
                        <details className="group">
                            <summary className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                                <span className="text-sm font-medium">Archived goals</span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-muted">{archivedGoals.length}</span>
                            </summary>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {archivedGoals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="bg-card/50 border border-border rounded-lg p-4 opacity-75"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                                                {goal.type}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRestore(goal.id)}
                                                className="h-7 text-xs"
                                            >
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Restore
                                            </Button>
                                        </div>
                                        <h3 className="font-medium text-sm text-muted-foreground line-clamp-2">{goal.title}</h3>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </motion.div>
                )}
            </PageShell>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the goal and all its roadmap data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            <Trash2 className="w-4 h-4" />Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default GoalsPage;
