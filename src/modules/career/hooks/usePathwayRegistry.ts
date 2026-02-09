import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { supabase } from '@/modules/career/integrations/supabase/client';
import {
  type PathwayDefinition,
  type PathwayRequirement,
} from '@/modules/career/data/pathwayRequirements';
import { resolvePathwayId, resolvePrimaryPathwayFromList, fuzzyMatchByNameFromList, type ResolvePrimaryPathwayInput } from '@/modules/career/utils/pathwayResolver';

type DbMilestone = {
  id: string;
  name: string;
  description?: string | null;
  is_required?: boolean | null;
  display_order?: number | null;
  evidence_types?: string[] | null;
  resource_url?: string | null;
  alternatives?: string[] | null;
  status?: string | null;
  category?: { code?: string | null } | null;
  estimated_duration?: string | null;
  cost_estimate?: any | null;
  verification_status?: string | null;
  last_verified_at?: string | null;
};

type DbPathway = {
  code: string;
  name: string;
  description?: string | null;
  estimated_duration?: string | null;
  target_role?: string | null;
  status?: string | null;
  country?: { name?: string | null } | null;
  milestones?: DbMilestone[] | null;
};

function mapDbRequirement(requirement: DbMilestone): PathwayRequirement {
  const rawCategory = requirement.category?.code || 'Training';
  const safeCategory = rawCategory as PathwayRequirement['category'];

  return {
    name: requirement.name,
    category: safeCategory,
    isRequired: requirement.is_required ?? true,
    order: requirement.display_order ?? 0,
    description: requirement.description ?? undefined,
    evidenceTypes: requirement.evidence_types ?? undefined,
    resourceUrl: requirement.resource_url ?? undefined,
    alternatives: requirement.alternatives ?? undefined,
    dbId: requirement.id,
    estimatedDuration: requirement.estimated_duration ?? undefined,
    costEstimate: requirement.cost_estimate ?? undefined,
    verificationStatus: requirement.verification_status ?? undefined,
    lastVerifiedAt: requirement.last_verified_at ?? undefined,
  };
}

function mapDbPathway(pathway: DbPathway): PathwayDefinition {
  const requirements = (pathway.milestones || [])
    .filter(m => !m.status || m.status === 'active')
    .map(mapDbRequirement)
    .sort((a, b) => a.order - b.order);

  return {
    id: pathway.code,
    name: pathway.name,
    description: pathway.description || '',
    requirements,
    estimatedDuration: pathway.estimated_duration || '',
    targetRole: pathway.target_role || '',
    country: pathway.country?.name || undefined,
  };
}

async function fetchDbPathways(): Promise<PathwayDefinition[]> {
  // Supabase types are generated separately; use a loose client here to avoid type drift.
  const client = supabase as any;
  const { data, error } = await client
    .from('pathways')
    .select(
      `
        code,
        name,
        description,
        estimated_duration,
        target_role,
        status,
        country:countries(name),
        milestones:milestones(
          id,
          name,
          description,
          is_required,
          display_order,
          evidence_types,
          resource_url,
          alternatives,
          status,
          estimated_duration,
          cost_estimate,
          verification_status,
          last_verified_at,
          category:milestone_categories(code)
        )
      `
    )
    .eq('status', 'active');

  if (error) throw error;
  const rows = (data || []) as DbPathway[];
  return rows.map(mapDbPathway);
}

export function usePathwayRegistry() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.pathways.registry,
    queryFn: fetchDbPathways,
    staleTime: 5 * 60 * 1000,
  });

  // DB is the single source of truth — no local fallback.
  const pathways = useMemo(() => data || [], [data]);

  const source = data && data.length > 0 ? 'db' : 'empty';

  const getPathwayById = useCallback(
    (id: string) => pathways.find((pathway) => pathway.id === id),
    [pathways]
  );

  const getPathwayByName = useCallback(
    (name: string, specialty?: string | null) => {
      const normalized = name.trim().toLowerCase();
      const direct = pathways.find((pathway) => pathway.name.toLowerCase() === normalized);
      if (direct) return direct;

      const mappedId = resolvePathwayId(name);
      if (mappedId) {
        const byId = pathways.find((pathway) => pathway.id === mappedId);
        if (byId) return byId;
      }

      return fuzzyMatchByNameFromList(pathways, name, specialty);
    },
    [pathways]
  );

  const resolvePrimaryPathway = useCallback(
    (input: ResolvePrimaryPathwayInput) => resolvePrimaryPathwayFromList(input, pathways),
    [pathways]
  );

  return {
    pathways,
    source,
    isLoading,
    isError,
    getPathwayById,
    getPathwayByName,
    resolvePrimaryPathway,
  };
}
