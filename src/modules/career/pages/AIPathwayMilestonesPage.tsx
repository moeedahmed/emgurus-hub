import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { PageShell } from '@/modules/career/components/layout/PageShell';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import { usePathwayMilestones } from '@/modules/career/hooks/usePathwayMilestones';
import { useUserPathways } from '@/modules/career/hooks/useUserPathways';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { MilestoneCard } from '@/modules/career/components/pathway/MilestoneCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { toast } from 'sonner';

type MilestoneStatus = 'todo' | 'in_progress' | 'done' | 'skipped';

const AIPathwayMilestonesPage = () => {
  const { userPathwayId } = useParams<{ userPathwayId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [togglingMilestone, setTogglingMilestone] = useState<string | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  // Fetch user pathways to get metadata
  const { data: userPathways, isLoading: pathwaysLoading } = useUserPathways(user?.id);
  const currentPathway = useMemo(
    () => userPathways?.find(p => p.id === userPathwayId),
    [userPathways, userPathwayId]
  );

  // Fetch milestones for this AI pathway
  const { data: milestones, isLoading: milestonesLoading } = usePathwayMilestones(
    user?.id,
    userPathwayId || null
  );

  const isLoading = pathwaysLoading || milestonesLoading;

  // Calculate progress
  const { completed, inProgress, total, percentage } = useMemo(() => {
    if (!milestones) return { completed: 0, inProgress: 0, total: 0, percentage: 0 };

    const completedCount = milestones.filter(m => m.status === 'done').length;
    const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
    const totalCount = milestones.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      completed: completedCount,
      inProgress: inProgressCount,
      total: totalCount,
      percentage: pct,
    };
  }, [milestones]);

  // Toggle milestone status
  const toggleMilestoneStatus = async (milestoneId: string, currentStatus: MilestoneStatus) => {
    if (!user?.id) return;

    setTogglingMilestone(milestoneId);

    try {
      let newStatus: MilestoneStatus;
      if (currentStatus === 'todo') newStatus = 'in_progress';
      else if (currentStatus === 'in_progress') newStatus = 'done';
      else newStatus = 'todo';

      const updateData: any = { status: newStatus };
      if (newStatus === 'done') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('custom_milestones')
        .update(updateData)
        .eq('id', milestoneId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Optimistic UI handled by React Query refetch
      toast.success(
        newStatus === 'done'
          ? 'Milestone completed!'
          : newStatus === 'in_progress'
          ? 'Milestone in progress'
          : 'Milestone reset'
      );
    } catch (error) {
      console.error('Toggle milestone error:', error);
      toast.error('Failed to update milestone status');
    } finally {
      setTogglingMilestone(null);
    }
  };

  const toggleExpanded = (milestoneId: string) => {
    setExpandedMilestone(prev => (prev === milestoneId ? null : milestoneId));
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageShell width="focused">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </PageShell>
      </AppLayout>
    );
  }

  if (!currentPathway) {
    return (
      <AppLayout>
        <PageShell width="focused">
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Pathway not found</p>
            <Button onClick={() => navigate('/pathways')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pathways
            </Button>
          </div>
        </PageShell>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageShell width="focused">
        <div className="space-y-6">
          {/* Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span>{currentPathway.pathway_name}</span>
              </div>
            }
            description={currentPathway.pathway_description || undefined}
            action={
              <Button onClick={() => navigate('/pathways')} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            }
          />

          {/* AI Disclaimer */}
          {currentPathway.ai_disclaimer && (
            <Alert>
              <Sparkles className="w-4 h-4" />
              <AlertDescription className="text-sm">
                {currentPathway.ai_disclaimer}
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Summary */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completed} of {total} milestones completed
                  {inProgress > 0 && ` · ${inProgress} in progress`}
                </p>
              </div>
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          {/* Milestones Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Milestones</h3>
            {milestones && milestones.length > 0 ? (
              <div className="space-y-3">
                {milestones.map(milestone => (
                  <MilestoneCard
                    key={milestone.id}
                    name={milestone.name}
                    description={milestone.description}
                    category={milestone.category}
                    isRequired={milestone.is_required}
                    status={
                      milestone.status === 'done'
                        ? 'completed'
                        : milestone.status === 'in_progress'
                        ? 'in-progress'
                        : 'pending'
                    }
                    resourceUrl={milestone.resource_url || undefined}
                    isExpanded={expandedMilestone === milestone.id}
                    onToggleExpand={() => toggleExpanded(milestone.id)}
                    onToggleStatus={() =>
                      toggleMilestoneStatus(milestone.id, milestone.status)
                    }
                    isUpdating={togglingMilestone === milestone.id}
                    displayOrder={milestone.display_order}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No milestones found for this pathway</p>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    </AppLayout>
  );
};

export default AIPathwayMilestonesPage;
