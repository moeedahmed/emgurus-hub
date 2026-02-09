import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { logger } from '@/modules/career/lib/logger';
import { queryKeys } from '@/modules/career/lib/queryKeys';

interface GenerateMilestonesParams {
  pathwayId?: string;      // Optional hint (for refresh of existing pathway)
  forceRefresh?: boolean;
  generateCustom?: boolean; // NEW: Trigger AI generation for unsupported country/specialty
}

interface PathwayMatch {
  id: string;
  code: string;
  name: string;
  match_confidence: 'high' | 'medium' | 'low';
  match_reason: string;
}

interface GeneratedMilestone {
  name: string;
  description: string;
  category: string;
  is_required: boolean;
  display_order: number;
  resource_url?: string | null;
}

interface AlternativePathway {
  id: string;
  name: string;
  description: string;
}

interface AIPathwayMetadata {
  name: string;
  description: string;
  country_id: string;
  country_name: string;
  specialty: string;
  disclaimer: string;
}

interface GenerateMilestonesResponse {
  pathway: PathwayMatch | null;
  milestones: GeneratedMilestone[];
  alternatives?: AlternativePathway[];
  is_cached: boolean;
  is_ai_generated?: boolean; // NEW: True if milestones are AI-generated (not saved to DB)
  ai_pathway_metadata?: AIPathwayMetadata; // NEW: Metadata for AI pathway (frontend saves this)
  supports_ai_generation?: boolean;
  generation_failed?: boolean;
  disclaimer: string;
  diff?: {
    added: number;
    updated: number;
    unchanged: number;
  };
}

export function useGenerateMilestones() {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  return useMutation({
    mutationFn: async ({
      pathwayId,
      forceRefresh = false,
      generateCustom = false,
    }: GenerateMilestonesParams): Promise<GenerateMilestonesResponse> => {
      if (!profile) {
        throw new Error('Profile not loaded');
      }

      // Build profile context from useProfile
      const profileContext = {
        country: profile.current_country || undefined,
        specialty: profile.specialty || undefined,
        career_stage: profile.career_stage || undefined,
        years_experience: profile.years_experience || undefined,
        milestones_achieved: profile.milestones_achieved || undefined,
        training_paths: profile.training_paths || undefined,
        pathway_ids: profile.pathway_ids || undefined,
      };

      const { data, error } = await supabase.functions.invoke(
        'generate-milestones',
        {
          body: {
            profile: profileContext,
            pathway_id: pathwayId,
            force_refresh: forceRefresh,
            generate_custom: generateCustom,
          },
        }
      );

      if (error) {
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
        logger.error('[useGenerateMilestones] Error:', actualMessage);
        throw new Error(actualMessage);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as GenerateMilestonesResponse;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.pathways.registry });
      queryClient.invalidateQueries({ queryKey: queryKeys.pathways.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.byUser(profile?.id) });

      if (!data.pathway) {
        toast.info('Please select a pathway from the suggestions');
        return;
      }

      if (data.is_cached) {
        toast.success(`Loaded ${data.milestones.length} milestones for ${data.pathway.name}`);
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
        toast.success(`Generated ${data.milestones.length} milestones for ${data.pathway.name}`);
      }
    },
    onError: (error: Error) => {
      logger.error('[useGenerateMilestones] Mutation error:', error);
      toast.error(error.message || 'Failed to generate milestones');
    },
  });
}

// Export types for consumers
export type {
  GenerateMilestonesParams,
  GenerateMilestonesResponse,
  GeneratedMilestone,
  PathwayMatch,
  AlternativePathway,
  AIPathwayMetadata,
};
