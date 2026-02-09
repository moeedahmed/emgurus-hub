import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Clock, ArrowRight, User, CheckCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { useGoals } from '@/modules/career/hooks/useGoals';
import { useAllGoalsProgress } from '@/modules/career/hooks/useGoalProgress';
import { useProfile, calculateProfileCompletion } from '@/modules/career/hooks/useProfile';
import { useRecentActivity, useDueThisWeek } from '@/modules/career/hooks/useRecentActivity';
import { UsageBar } from '@/modules/career/components/dashboard/UsageBar';
import { PageShell } from '@/modules/career/components/layout/PageShell';
import { ProfileCompletionNudge } from '@/modules/career/components/dashboard/ProfileCompletionNudge';
import { ProgressSummaryWidget } from '@/modules/career/components/dashboard/ProgressSummaryWidget';
import { NextStepWidget } from '@/modules/career/components/dashboard/NextStepWidget';
import { GreetingHeader } from '@/modules/career/components/dashboard/GreetingHeader';
import { formatDistanceToNow } from 'date-fns';
import { MOTION } from '@/modules/career/lib/motion';
import { useGoalWizard } from '@/modules/career/contexts/GoalWizardContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { openGoalWizard } = useGoalWizard();
  const { data: goals = [], error } = useGoals();
  const { data: profile } = useProfile();
  const { data: recentActivity = [] } = useRecentActivity(3);
  const { data: dueThisWeek = 0 } = useDueThisWeek();

  const activeGoals = goals.filter((g) => g.status === 'active');
  const { data: goalProgress = {} } = useAllGoalsProgress(activeGoals.map(g => g.id));
  const profileComplete = calculateProfileCompletion(profile || null);

  if (error) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 text-center">
          <p className="text-destructive">Failed to load goals. Please try again.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageShell width="wide">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <GreetingHeader />
            <p className="text-muted-foreground mt-1">Here's what's happening with your career today.</p>
          </div>

          {/* Quick Stats Chips */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full shadow-sm">
              <Map className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold">{activeGoals.length} Active Plans</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full shadow-sm">
              <Clock className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-semibold">{dueThisWeek} Due Soon</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full shadow-sm">
              <User className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-semibold">{profileComplete}% Profile</span>
            </div>
          </div>
        </div>

        {/* Top: Usage Bar (Full Width) */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION.ENTRANCE.DURATION }}
          >
            <UsageBar />
          </motion.div>
        </div>

        {/* Middle Row: Ready/Next Step + Training Reality (50/50 Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Left: Action Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: MOTION.ENTRANCE.DURATION, delay: MOTION.ENTRANCE.STAGGER }}
            className="h-full"
          >
            <NextStepWidget
              className="h-full"
              goals={goals}
              isLoading={!goals && !error}
            />
          </motion.div>

          {/* Right: Training Reality */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: MOTION.ENTRANCE.DURATION, delay: MOTION.ENTRANCE.STAGGER * 2 }}
            className="h-full"
          >
            <ProgressSummaryWidget className="shadow-sm h-full" />
          </motion.div>
        </div>

        {/* Active Goals Section (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.ENTRANCE.DURATION, delay: MOTION.ENTRANCE.STAGGER * 3 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight">Active Goals</h2>
            </div>
            <Link to="/career/goals" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Manage all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeGoals.slice(0, 4).map((goal) => {
                const progress = goalProgress[goal.id];
                return (
                  <motion.div
                    key={goal.id}
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all shadow-sm"
                    onClick={() => navigate(`/career/roadmap/${goal.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant={goal.type === 'migrate' ? 'primary-subtle' : goal.type === 'advance' ? 'success-subtle' : goal.type === 'exam' ? 'warning-subtle' : 'accent-subtle'}
                        className="text-[10px] font-bold uppercase tracking-wider"
                      >
                        {goal.type === 'migrate' ? 'Migration' : goal.type === 'advance' ? 'Advancement' : goal.type === 'exam' ? 'Exam' : 'Expertise'}
                      </Badge>
                      {progress && progress.total > 0 && (
                        <span className="text-[10px] font-bold text-primary">
                          {progress.completed}/{progress.total}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-3 line-clamp-1 group-hover/card:text-primary transition-colors" title={goal.title}>{goal.title}</h3>

                    {/* Progress Bar */}
                    {progress && progress.total > 0 ? (
                      <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                            transition={{ duration: MOTION.DATA.FILL_DURATION, ease: 'easeOut' }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{progress.percentage}% complete</span>
                          <span>{goal.timeline ? goal.timeline : 'Flexible'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-warning">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                        No roadmap yet
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">No active career goals yet.</p>
              <Button variant="outline" size="sm" onClick={() => openGoalWizard()}>
                Create your first goal
              </Button>
            </div>
          )}
        </motion.div>

        {/* Recent Completions Section */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION.ENTRANCE.DURATION, delay: MOTION.ENTRANCE.STAGGER * 4 }}
            className="mb-8"
          >
            <h3 className="text-sm font-bold text-muted-foreground mb-4 px-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Recent Completions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.nodeId}
                  className="bg-card/50 border border-border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => navigate(`/career/roadmap/${activity.goalId}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{activity.nodeTitle}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {formatDistanceToNow(new Date(activity.completedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Profile Completion Nudge - Bottom */}
        <ProfileCompletionNudge completion={profileComplete} />


      </PageShell>
    </AppLayout>
  );
};


export default DashboardPage;
