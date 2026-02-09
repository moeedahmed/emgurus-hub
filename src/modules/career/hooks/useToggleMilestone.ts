import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type MilestoneStatus = 'todo' | 'in_progress' | 'done' | 'skipped';

interface ToggleMilestoneInput {
  milestoneId: string; // UUID from milestones table
  newStatus: MilestoneStatus;
}

/**
 * Mutation hook that upserts a row in `user_milestones`.
 *
 * - Uses `ON CONFLICT (user_id, milestone_id)` for idempotent writes.
 * - Sets `completed_at = now()` when status is 'done', null otherwise.
 * - Invalidates the `userMilestones` query cache on success.
 * - Does NOT use optimistic updates — waits for server confirmation.
 */
export function useToggleMilestone() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ milestoneId, newStatus }: ToggleMilestoneInput) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('user_milestones')
        .upsert(
          {
            user_id: user.id,
            milestone_id: milestoneId,
            status: newStatus,
            completed_at: newStatus === 'done' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,milestone_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userMilestones.byUser(user?.id),
      });
      // Also invalidate profile cache so the trigger-synced milestones_achieved is fresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.byUser(user?.id),
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to save milestone',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });
}
