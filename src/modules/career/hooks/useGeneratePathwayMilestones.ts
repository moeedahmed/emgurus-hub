import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { logger } from '@/modules/career/lib/logger';
import { queryKeys } from '@/modules/career/lib/queryKeys';

interface GenerateMilestonesParams {
  pathwayCode: string;
  pathwayId?: string;
  country?: string;
  specialty?: string;
  isCustomPathway: boolean;
  forceRefresh?: boolean;
}

interface GeneratedMilestone {
  name: string;
  description: string;
  category: string;
  is_required: boolean;
  display_order: number;
  resource_url?: string;
}

interface GenerateMilestonesResponse {
  milestones: GeneratedMilestone[];
  stored_in: 'central' | 'user_profile';
  is_cached: boolean;
  disclaimer: string;
  diff?: {
    added: number;
    updated: number;
    unchanged: number;
  };
}

export function useGeneratePathwayMilestones() {
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  return useMutation({
    mutationFn: async ({
      pathwayCode,
      pathwayId,
      country,
      specialty,
      isCustomPathway,
      forceRefresh = false,
    }: GenerateMilestonesParams): Promise<GenerateMilestonesResponse> => {
      const { data, error } = await supabase.functions.invoke(
        'generate-pathway-milestones',
        {
          body: {
            pathway_code: pathwayCode,
            pathway_id: pathwayId,
            country,
            specialty,
            is_custom_pathway: isCustomPathway,
            force_refresh: forceRefresh,
            user_id: profile?.id,
          },
        }
      );

      if (error) {
        // Supabase wraps non-2xx responses in FunctionsHttpError.
        // error.context may be a Response object or parsed JSON depending on version.
        const ctx = (error as { context?: unknown }).context;
        let actualMessage = error.message || 'Failed to generate milestones';
        if (ctx instanceof Response) {
          try {
            const body = await ctx.json();
            if (body?.error) {
              actualMessage = body.details
                ? `${body.error}: ${body.details}`
                : body.error;
            }
          } catch { /* body already consumed or not JSON */ }
        } else if (typeof ctx === 'object' && ctx !== null && 'error' in ctx) {
          const ctxObj = ctx as { error: string; details?: string };
          actualMessage = ctxObj.details
            ? `${ctxObj.error}: ${ctxObj.details}`
            : ctxObj.error;
        }
        logger.error('[useGeneratePathwayMilestones] Error:', actualMessage);
        throw new Error(actualMessage);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as GenerateMilestonesResponse;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries based on where data was stored
      if (data.stored_in === 'central') {
        queryClient.invalidateQueries({ queryKey: queryKeys.pathways.registry });
        queryClient.invalidateQueries({ queryKey: queryKeys.pathways.all });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.byUser(profile?.id) });
      }

      if (data.is_cached) {
        toast.success('Milestones loaded from cache');
      } else if (data.diff) {
        const parts: string[] = [];
        if (data.diff.added > 0) parts.push(`${data.diff.added} added`);
        if (data.diff.updated > 0) parts.push(`${data.diff.updated} updated`);
        if (parts.length === 0) {
          toast.success('Milestones are already up to date');
        } else {
          toast.success(`Milestones refreshed: ${parts.join(', ')}`);
        }
      } else {
        toast.success(`Generated ${data.milestones.length} milestones`);
      }
    },
    onError: (error: Error) => {
      logger.error('[useGeneratePathwayMilestones] Mutation error:', error);
      toast.error(error.message || 'Failed to generate milestones');
    },
  });
}
