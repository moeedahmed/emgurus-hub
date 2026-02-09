import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { logger } from '@/modules/career/lib/logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PathwayOption {
  id: string;
  code: string;
  name: string;
  description: string;
  milestone_count: number;
  is_recommended: boolean;
  match_reason?: string;
}

interface ListPathwaysParams {
  country: string;
  specialty?: string;
  careerStage?: string;
  showAll?: boolean;
}

interface ListPathwaysResponse {
  pathways: PathwayOption[];
  total_count: number;
  similar_pathways?: PathwayOption[];
  supports_ai_generation?: boolean;
  message?: string;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useListPathways(params: ListPathwaysParams) {
  const { country, specialty, careerStage, showAll } = params;

  return useQuery({
    queryKey: [...queryKeys.pathways.byFilters(country, specialty), showAll],
    queryFn: async (): Promise<ListPathwaysResponse> => {
      const { data, error } = await supabase.functions.invoke('list-pathways', {
        body: {
          country,
          specialty,
          career_stage: careerStage,
          show_all: showAll,
        },
      });

      if (error) {
        // Extract actual error message from context
        const ctx = (error as { context?: unknown }).context;
        let actualMessage = error.message || 'Failed to fetch pathways';

        if (ctx instanceof Response) {
          try {
            const body = await ctx.json();
            if (body?.error) {
              actualMessage = body.details
                ? `${body.error}: ${body.details}`
                : body.error;
            }
          } catch {
            // Body already consumed or not JSON
          }
        } else if (typeof ctx === 'object' && ctx !== null && 'error' in ctx) {
          const ctxObj = ctx as { error: string; details?: string };
          actualMessage = ctxObj.details
            ? `${ctxObj.error}: ${ctxObj.details}`
            : ctxObj.error;
        }

        logger.error('[useListPathways] Error:', actualMessage);
        throw new Error(actualMessage);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as ListPathwaysResponse;
    },
    enabled: !!country, // Only run when country is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
