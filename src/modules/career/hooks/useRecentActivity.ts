import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { queryKeys } from '@/modules/career/lib/queryKeys';

export interface RecentActivity {
  nodeId: string;
  nodeTitle: string;
  goalId: string;
  goalTitle: string;
  completedAt: string;
}

export function useRecentActivity(limit: number = 3) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.recentActivity.byUser(user?.id, limit),
    queryFn: async () => {
      if (!user) return [];

      // Step 1: Get user's goals
      const { data: userGoals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title')
        .eq('user_id', user.id);

      if (goalsError) throw goalsError;
      if (!userGoals?.length) return [];

      const goalIds = userGoals.map(g => g.id);

      // Step 2: Get roadmaps for those goals
      const { data: roadmaps, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('id, goal_id')
        .in('goal_id', goalIds);

      if (roadmapsError) throw roadmapsError;
      if (!roadmaps?.length) return [];

      const roadmapIds = roadmaps.map(r => r.id);

      // Step 3: Get completed nodes from those roadmaps
      const { data: nodes, error: nodesError } = await supabase
        .from('roadmap_nodes')
        .select('id, title, completed_at, roadmap_id')
        .in('roadmap_id', roadmapIds)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (nodesError) throw nodesError;

      // Step 4: Join the data in JS
      const activities: RecentActivity[] = (nodes || []).map((node) => {
        const roadmap = roadmaps.find(r => r.id === node.roadmap_id);
        const goal = userGoals.find(g => g.id === roadmap?.goal_id);
        return {
          nodeId: node.id,
          nodeTitle: node.title,
          goalId: goal?.id || '',
          goalTitle: goal?.title || '',
          completedAt: node.completed_at,
        };
      });

      return activities;
    },
    enabled: !!user,
  });
}

export function useDueThisWeek() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.recentActivity.dueThisWeek(user?.id),
    queryFn: async () => {
      if (!user) return 0;

      // Get pending nodes with 30d timeframe from goals created > 25 days ago
      const twentyFiveDaysAgo = new Date();
      twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25);

      // Step 1: Get user's goals created > 25 days ago
      const { data: userGoals, error: goalsError } = await supabase
        .from('goals')
        .select('id, created_at')
        .eq('user_id', user.id)
        .lt('created_at', twentyFiveDaysAgo.toISOString());

      if (goalsError) throw goalsError;
      if (!userGoals?.length) return 0;

      const goalIds = userGoals.map(g => g.id);

      // Step 2: Get roadmaps for those goals
      const { data: roadmaps, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('id')
        .in('goal_id', goalIds);

      if (roadmapsError) throw roadmapsError;
      if (!roadmaps?.length) return 0;

      const roadmapIds = roadmaps.map(r => r.id);

      // Step 3: Count pending 30d nodes from those roadmaps
      const { count, error: nodesError } = await supabase
        .from('roadmap_nodes')
        .select('id', { count: 'exact', head: true })
        .in('roadmap_id', roadmapIds)
        .eq('timeframe', '30d')
        .eq('status', 'pending');

      if (nodesError) throw nodesError;

      return count || 0;
    },
    enabled: !!user,
  });
}
