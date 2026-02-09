import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { logger } from '@/modules/career/lib/logger';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { useToast } from '@/components/ui/use-toast';

export interface ResearchQueueItem {
  id: string;
  milestone_id: string;
  pathway_id: string;
  milestone_name: string;
  pathway_code: string;
  estimated_duration: string | null;
  cost_estimate: {
    label: string;
    min: number;
    max: number | null;
    currency: string;
    note: string | null;
    source_url: string | null;
  } | null;
  confidence: 'high' | 'medium' | 'low';
  research_notes: string | null;
  sources: string[];
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface ResearchQueueFilters {
  pathwayId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'edited';
  confidence?: 'high' | 'medium' | 'low';
}

export function useMilestoneResearchQueue(filters?: ResearchQueueFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch research queue items
  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.researchQueue(filters),
    queryFn: async () => {
      let query = supabase
        .from('milestone_research_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.pathwayId) {
        query = query.eq('pathway_id', filters.pathwayId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.confidence) {
        query = query.eq('confidence', filters.confidence);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[useMilestoneResearchQueue] Error fetching queue:', error);
        throw error;
      }

      return (data || []) as ResearchQueueItem[];
    },
    enabled: !!user?.id,
  });

  // Approve a research item
  const approveMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Update the milestone with the researched data
      const { error: milestoneError } = await supabase
        .from('milestones')
        .update({
          estimated_duration: item.estimated_duration,
          cost_estimate: item.cost_estimate,
          verification_status: 'ai_validated',
          last_verified_at: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq('id', item.milestone_id);

      if (milestoneError) {
        logger.error('[useMilestoneResearchQueue] Error updating milestone:', milestoneError);
        throw milestoneError;
      }

      // Mark the queue item as approved
      const { error: queueError } = await supabase
        .from('milestone_research_queue')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (queueError) {
        logger.error('[useMilestoneResearchQueue] Error updating queue item:', queueError);
        throw queueError;
      }

      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.researchQueue() });
      toast({
        title: 'Research approved',
        description: 'Milestone data has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error approving research',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Reject a research item
  const rejectMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('milestone_research_queue')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (error) {
        logger.error('[useMilestoneResearchQueue] Error rejecting item:', error);
        throw error;
      }

      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.researchQueue() });
      toast({
        title: 'Research rejected',
        description: 'Item marked for manual research',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error rejecting research',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Edit and approve a research item
  const editAndApproveMutation = useMutation({
    mutationFn: async ({
      itemId,
      updates,
    }: {
      itemId: string;
      updates: {
        estimated_duration?: string | null;
        cost_estimate?: ResearchQueueItem['cost_estimate'];
      };
    }) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Update the milestone with the edited data
      const { error: milestoneError } = await supabase
        .from('milestones')
        .update({
          estimated_duration: updates.estimated_duration ?? item.estimated_duration,
          cost_estimate: updates.cost_estimate ?? item.cost_estimate,
          verification_status: 'ai_validated',
          last_verified_at: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq('id', item.milestone_id);

      if (milestoneError) {
        logger.error('[useMilestoneResearchQueue] Error updating milestone:', milestoneError);
        throw milestoneError;
      }

      // Mark the queue item as edited and approved
      const { error: queueError } = await supabase
        .from('milestone_research_queue')
        .update({
          status: 'edited',
          estimated_duration: updates.estimated_duration ?? item.estimated_duration,
          cost_estimate: updates.cost_estimate ?? item.cost_estimate,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (queueError) {
        logger.error('[useMilestoneResearchQueue] Error updating queue item:', queueError);
        throw queueError;
      }

      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.researchQueue() });
      toast({
        title: 'Research edited and approved',
        description: 'Milestone data has been updated with your edits',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error editing research',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Batch approve all high-confidence items
  const batchApproveMutation = useMutation({
    mutationFn: async (confidence: 'high' | 'medium' = 'high') => {
      const toApprove = items.filter(
        (item) => item.status === 'pending' && item.confidence === confidence
      );

      if (toApprove.length === 0) {
        throw new Error('No items to approve');
      }

      // Process each item
      for (const item of toApprove) {
        // Update milestone
        await supabase
          .from('milestones')
          .update({
            estimated_duration: item.estimated_duration,
            cost_estimate: item.cost_estimate,
            verification_status: 'ai_validated',
            last_verified_at: new Date().toISOString(),
            verified_by: user?.id,
          })
          .eq('id', item.milestone_id);

        // Update queue item
        await supabase
          .from('milestone_research_queue')
          .update({
            status: 'approved',
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', item.id);
      }

      return toApprove.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.researchQueue() });
      toast({
        title: 'Batch approved',
        description: `${count} items have been approved`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error in batch approval',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get summary stats
  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === 'pending').length,
    highConfidence: items.filter((i) => i.status === 'pending' && i.confidence === 'high').length,
    mediumConfidence: items.filter((i) => i.status === 'pending' && i.confidence === 'medium').length,
    lowConfidence: items.filter((i) => i.status === 'pending' && i.confidence === 'low').length,
    approved: items.filter((i) => i.status === 'approved' || i.status === 'edited').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
  };

  return {
    items,
    stats,
    isLoading,
    error,
    refetch,
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    editAndApprove: editAndApproveMutation.mutate,
    batchApprove: batchApproveMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isEditing: editAndApproveMutation.isPending,
    isBatchApproving: batchApproveMutation.isPending,
  };
}
