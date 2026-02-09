import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';

export interface GoalProgress {
  goalId: string;
  total: number;
  completed: number;
  percentage: number;
}

export function useGoalProgress(goalId: string) {
  return useQuery({
    queryKey: queryKeys.goalProgress.byGoal(goalId),
    queryFn: async () => {
      // First get the roadmap for this goal
      const { data: roadmap, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('id')
        .eq('goal_id', goalId)
        .maybeSingle();

      if (roadmapError) throw roadmapError;
      if (!roadmap) return { goalId, total: 0, completed: 0, percentage: 0 };

      // Then get the nodes for this roadmap
      const { data: nodes, error: nodesError } = await supabase
        .from('roadmap_nodes')
        .select('status')
        .eq('roadmap_id', roadmap.id);

      if (nodesError) throw nodesError;

      const total = nodes?.length || 0;
      const completed = nodes?.filter(n => n.status === 'completed').length || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { goalId, total, completed, percentage };
    },
    enabled: !!goalId,
  });
}

export function useAllGoalsProgress(goalIds: string[]) {
  return useQuery({
    queryKey: queryKeys.goalProgress.byGoals(goalIds),
    queryFn: async () => {
      if (goalIds.length === 0) return {};

      // Get all roadmaps for these goals
      const { data: roadmaps, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('id, goal_id')
        .in('goal_id', goalIds);

      if (roadmapError) throw roadmapError;
      if (!roadmaps || roadmaps.length === 0) {
        return goalIds.reduce((acc, id) => ({ ...acc, [id]: { total: 0, completed: 0, percentage: 0 } }), {});
      }

      const roadmapIds = roadmaps.map(r => r.id);

      // Get all nodes for these roadmaps
      const { data: nodes, error: nodesError } = await supabase
        .from('roadmap_nodes')
        .select('roadmap_id, status')
        .in('roadmap_id', roadmapIds);

      if (nodesError) throw nodesError;

      // Map roadmap_id to goal_id
      const roadmapToGoal: Record<string, string> = {};
      roadmaps.forEach(r => {
        roadmapToGoal[r.id] = r.goal_id;
      });

      // Calculate progress per goal
      const progressByGoal: Record<string, GoalProgress> = {};
      
      goalIds.forEach(goalId => {
        progressByGoal[goalId] = { goalId, total: 0, completed: 0, percentage: 0 };
      });

      nodes?.forEach(node => {
        const goalId = roadmapToGoal[node.roadmap_id];
        if (goalId && progressByGoal[goalId]) {
          progressByGoal[goalId].total++;
          if (node.status === 'completed') {
            progressByGoal[goalId].completed++;
          }
        }
      });

      // Calculate percentages
      Object.keys(progressByGoal).forEach(goalId => {
        const p = progressByGoal[goalId];
        p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
      });

      return progressByGoal;
    },
    enabled: goalIds.length > 0,
  });
}
