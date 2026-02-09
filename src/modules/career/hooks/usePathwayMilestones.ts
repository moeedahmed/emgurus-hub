import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { logger } from '@/modules/career/lib/logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PathwayMilestone {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'todo' | 'in_progress' | 'done' | 'skipped';
  display_order: number;
  is_ai_generated: boolean;
  is_required: boolean;
  resource_url?: string | null;
  completed_at?: string | null;
  pathway_code?: string;  // For curated milestones
  user_pathway_id?: string;  // For AI milestones
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Fetch user's milestones for a specific pathway
 * @param userId - User's ID
 * @param pathwayIdentifier - Either pathway code (curated) or user_pathway UUID (AI-generated)
 */
export function usePathwayMilestones(
  userId: string | undefined,
  pathwayIdentifier: string | null
) {
  // Detect if identifier is a UUID (AI pathway) or code (curated pathway)
  const isAiPathway = pathwayIdentifier?.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  );

  return useQuery({
    queryKey: queryKeys.milestones.byUserAndPathway(userId, pathwayIdentifier),
    queryFn: async (): Promise<PathwayMilestone[]> => {
      if (!userId || !pathwayIdentifier) {
        throw new Error('User ID and pathway identifier are required');
      }

      // AI-generated pathway: query custom_milestones
      if (isAiPathway) {
        const { data, error } = await supabase
          .from('custom_milestones')
          .select(`
            *,
            category:milestone_categories(label)
          `)
          .eq('user_id', userId)
          .eq('user_pathway_id', pathwayIdentifier)
          .order('display_order');

        if (error) {
          logger.error('[usePathwayMilestones] Error fetching AI milestones:', error);
          throw new Error(error.message || 'Failed to fetch milestones');
        }

        return (data || []).map(m => ({
          id: m.id,
          name: m.name,
          description: m.description || '',
          category: (m.category as any)?.label || 'Uncategorized',
          status: m.status,
          display_order: m.display_order,
          is_ai_generated: m.is_ai_generated,
          is_required: m.is_required,
          resource_url: m.resource_url,
          completed_at: m.status === 'done' ? m.updated_at : null,
          user_pathway_id: m.user_pathway_id || undefined,
        }));
      }

      // Curated pathway: query user_milestones joined with milestones table
      // First, get the pathway UUID from code
      const { data: pathway, error: pathwayError } = await supabase
        .from('pathways')
        .select('id')
        .eq('code', pathwayIdentifier)
        .single();

      if (pathwayError || !pathway) {
        logger.error('[usePathwayMilestones] Pathway not found:', pathwayIdentifier);
        return [];
      }

      const { data, error } = await supabase
        .from('user_milestones')
        .select(`
          *,
          milestone:milestones(
            name,
            description,
            display_order,
            is_required,
            resource_url,
            category:milestone_categories(label)
          )
        `)
        .eq('user_id', userId)
        .eq('milestone.pathway_id', pathway.id);

      if (error) {
        logger.error('[usePathwayMilestones] Error fetching curated milestones:', error);
        throw new Error(error.message || 'Failed to fetch milestones');
      }

      return (data || [])
        .map(um => {
          const milestone = um.milestone as any;
          return {
            id: um.id,
            name: milestone.name,
            description: milestone.description || '',
            category: milestone.category?.label || 'Uncategorized',
            status: um.status,
            display_order: milestone.display_order,
            is_ai_generated: false,
            is_required: milestone.is_required,
            resource_url: milestone.resource_url,
            completed_at: um.completed_at,
            pathway_code: pathwayIdentifier,
          };
        })
        .sort((a, b) => a.display_order - b.display_order);
    },
    enabled: !!userId && !!pathwayIdentifier,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
