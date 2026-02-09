import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { supabase } from '@/modules/career/integrations/supabase/client';

/** A row from user_milestones joined with milestone metadata. */
export interface UserMilestoneRow {
  id: string;
  milestone_id: string;
  status: 'todo' | 'in_progress' | 'done' | 'skipped';
  completed_at: string | null;
  notes: string | null;
  /** Joined milestone metadata */
  milestone: {
    id: string;
    name: string;
    pathway_id: string;
    is_required: boolean;
    display_order: number;
    alternatives: string[] | null;
  };
}

async function fetchUserMilestones(userId: string): Promise<UserMilestoneRow[]> {
  const { data, error } = await (supabase as any)
    .from('user_milestones')
    .select(`
      id,
      milestone_id,
      status,
      completed_at,
      notes,
      milestone:milestones!user_milestones_milestone_id_fkey(
        id,
        name,
        pathway_id,
        is_required,
        display_order,
        alternatives
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as UserMilestoneRow[];
}

/**
 * Fetches the authenticated user's milestone progress from the `user_milestones`
 * relational table. Returns an empty array when no relational data exists yet.
 */
export function useUserMilestones() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.userMilestones.byUser(userId),
    queryFn: () => fetchUserMilestones(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
