import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2, Settings, Sparkles, Plus, Trash2, ChevronDown, RotateCcw } from 'lucide-react';
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
import { PathwayCard } from '@/modules/career/components/pathway/PathwayCard';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { usePathwayWizard } from '@/modules/career/contexts/PathwayWizardContext';
import { usePathwayProgress } from '@/modules/career/hooks/usePathwayProgress';
import { useUserMilestones } from '@/modules/career/hooks/useUserMilestones';
import { usePathwayManagement } from '@/modules/career/hooks/usePathwayManagement';
import { toast } from 'sonner';

const PathwaysPage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading } = useProfile();
    const { data: userMilestones } = useUserMilestones();
    const pathwayResults = usePathwayProgress(profile ?? null, userMilestones);
    const { openPathwayWizard } = usePathwayWizard();
    const { archivePathway, restorePathway, removePathway } = usePathwayManagement();
    const [pathwayToDelete, setPathwayToDelete] = useState<{ id: string; name: string } | null>(null);

    // Check if user has selected any training paths
    const pathwayIds = profile?.pathway_ids || [];
    const archivedPathwayIds = profile?.archived_pathway_ids || [];
    const trainingPaths = profile?.training_paths || [];
    const hasPathways = pathwayIds.length > 0 || trainingPaths.length > 0;

    // Separate active and archived pathways
    const { activeResults, archivedResults } = useMemo(() => {
        const active = pathwayResults.filter(result =>
            !archivedPathwayIds.includes(result.pathway?.id || result.sourcePathName)
        );
        const archived = pathwayResults.filter(result =>
            archivedPathwayIds.includes(result.pathway?.id || result.sourcePathName)
        );
        return { activeResults: active, archivedResults: archived };
    }, [pathwayResults, archivedPathwayIds]);

    const handleArchive = (pathwayId: string) => {
        archivePathway.mutate(pathwayId, {
            onSuccess: () => toast.success('Pathway archived'),
            onError: () => toast.error('Failed to archive pathway'),
        });
    };

    const handleRestore = (pathwayId: string) => {
        restorePathway.mutate(pathwayId, {
            onSuccess: () => toast.success('Pathway restored'),
            onError: () => toast.error('Failed to restore pathway'),
        });
    };

    const handleDelete = (pathwayId: string, pathwayName: string) => {
        setPathwayToDelete({ id: pathwayId, name: pathwayName });
    };

    const confirmDelete = () => {
        if (pathwayToDelete) {
            removePathway.mutate(pathwayToDelete.id, {
                onSuccess: () => toast.success('Pathway removed'),
                onError: () => toast.error('Failed to remove pathway'),
            });
            setPathwayToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <PageShell width="wide">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </PageShell>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PageShell width="wide">
                {/* Header */}
                <PageHeader
                    title="Your career pathways"
                    description="Track your standing on official career pathways"
                >
                    <div className="flex items-center gap-2">
                        {hasPathways && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/career/profile')}
                                className="md:h-10 md:px-4"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="hidden sm:inline">Manage</span>
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={() => openPathwayWizard()}
                            className="md:h-10 md:px-4"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Pathway</span>
                        </Button>
                    </div>
                </PageHeader>

                {/* Empty State */}
                {!hasPathways ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="font-display text-xl font-semibold mb-2">Set up your career pathway</h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                            Let AI find the right pathway based on your country and specialty, then track your progress towards your career goals.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button onClick={() => openPathwayWizard()}>
                                <Sparkles className="w-4 h-4" />
                                Start Pathway Setup
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/career/profile')}>
                                Or edit profile manually
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Active Pathway Summary Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {activeResults.map((result) => (
                                <PathwayCard
                                    key={result.pathway?.id || result.sourcePathName}
                                    title={result.pathway?.name || result.sourcePathName}
                                    subtitle={result.pathway?.country}
                                    progress={result.percentComplete}
                                    completedCount={result.completedCount}
                                    totalCount={result.totalRequired}
                                    onClick={() => navigate(`/pathways/${result.pathway?.id || result.sourcePathName}`)}
                                    onArchive={() => handleArchive(result.pathway?.id || result.sourcePathName)}
                                    onDelete={() => handleDelete(
                                        result.pathway?.id || result.sourcePathName,
                                        result.pathway?.name || result.sourcePathName
                                    )}
                                />
                            ))}
                        </motion.div>

                        {/* Archived Pathways Section */}
                        {archivedResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="mt-8 pb-8"
                            >
                                <details className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                                        <span className="text-sm font-medium">Archived pathways</span>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-muted">{archivedResults.length}</span>
                                    </summary>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {archivedResults.map((result) => (
                                            <div
                                                key={result.pathway?.id || result.sourcePathName}
                                                className="bg-card/50 border border-border rounded-lg p-4 opacity-75"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                                                        {result.pathway?.country || 'Archived'}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRestore(result.pathway?.id || result.sourcePathName)}
                                                        className="h-7 text-xs"
                                                    >
                                                        <RotateCcw className="w-3 h-3 mr-1" />
                                                        Restore
                                                    </Button>
                                                </div>
                                                <h3 className="font-medium text-sm text-muted-foreground line-clamp-2">
                                                    {result.pathway?.name || result.sourcePathName}
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            </motion.div>
                        )}
                    </>
                )}
            </PageShell>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!pathwayToDelete} onOpenChange={(open) => !open && setPathwayToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove this pathway?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove "{pathwayToDelete?.name}" from your pathways list. Your milestone progress will be preserved, but you won't see this pathway in your dashboard anymore.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            <Trash2 className="w-4 h-4" />Yes, remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default PathwaysPage;
