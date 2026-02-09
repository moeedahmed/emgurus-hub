import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { logger } from '@/modules/career/lib/logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserPathway {
  id: string;
  user_id: string;
  pathway_id: string | null;
  pathway_name: string | null;
  pathway_description: string | null;
  country_id: string | null;
  specialty: string | null;
  is_ai_generated: boolean;
  generated_at: string | null;
  ai_disclaimer: string | null;
  status: 'planned' | 'active' | 'completed' | 'paused';
  is_primary: boolean;
  created_at: string;

  // Joined data from curated pathways
  pathway?: {
    code: string;
    name: string;
    description: string;
  };
  country?: {
    name: string;
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUserPathways(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.pathways.byUser(userId),
    queryFn: async (): Promise<UserPathway[]> => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('user_pathways')
        .select(`
          *,
          pathway:pathways(code, name, description),
          country:countries(name)
        `)
        .eq('user_id', userId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('[useUserPathways] Error:', error);
        throw new Error(error.message || 'Failed to fetch user pathways');
      }

      return (data || []) as UserPathway[];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
