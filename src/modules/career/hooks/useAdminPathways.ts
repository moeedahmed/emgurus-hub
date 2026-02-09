import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { toast } from 'sonner';
import { queryKeys } from '@/modules/career/lib/queryKeys';

// ---------- Types ----------

export interface AdminPathway {
  id: string;
  code: string;
  name: string;
  description: string | null;
  country_id: string | null;
  estimated_duration: string | null;
  target_role: string | null;
  status: 'active' | 'draft' | 'deprecated';
  created_at: string;
  updated_at: string;
  country: { id: string; code: string; name: string } | null;
  milestones: { count: number }[];
  pathway_disciplines: { discipline: { id: string; name: string } }[];
}

export interface Discipline {
  id: string;
  code: string;
  name: string;
}

export interface AdminMilestone {
  id: string;
  code: string | null;
  pathway_id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  is_required: boolean;
  display_order: number;
  evidence_types: string[] | null;
  resource_url: string | null;
  alternatives: string[] | null;
  status: 'active' | 'draft' | 'deprecated';
  created_at: string;
  updated_at: string;
  category: { id: string; code: string; label: string } | null;
}

export interface AdminPathwayDetail {
  id: string;
  code: string;
  name: string;
  description: string | null;
  country_id: string | null;
  estimated_duration: string | null;
  target_role: string | null;
  status: 'active' | 'draft' | 'deprecated';
  created_at: string;
  updated_at: string;
  country: { id: string; code: string; name: string } | null;
  milestones: AdminMilestone[];
}

export interface Country {
  id: string;
  code: string;
  name: string;
}

export interface MilestoneCategory {
  id: string;
  code: string;
  label: string;
  display_order: number;
}

export interface PathwayFormData {
  code: string;
  name: string;
  description: string;
  country_id: string | null;
  estimated_duration: string;
  target_role: string;
  status: 'active' | 'draft' | 'deprecated';
}

export interface MilestoneFormData {
  id?: string;
  name: string;
  description: string;
  category_id: string;
  is_required: boolean;
  display_order: number;
  evidence_types: string[];
  resource_url: string;
  alternatives: string[];
}

// ---------- Loose client (pathway tables not yet in generated types) ----------
const db = supabase as any;

// ---------- Hook ----------

export function useAdminPathways(enabled: boolean) {
  const queryClient = useQueryClient();

  // ---- Queries ----

  const {
    data: pathways = [],
    isLoading: isPathwaysLoading,
  } = useQuery({
    queryKey: queryKeys.admin.pathways,
    queryFn: async () => {
      const { data, error } = await db
        .from('pathways')
        .select(`
          id, code, name, description, country_id,
          estimated_duration, target_role, status,
          created_at, updated_at,
          country:countries(id, code, name),
          milestones(count),
          pathway_disciplines(discipline:disciplines(id, name))
        `)
        .order('name');
      if (error) throw error;
      return data as AdminPathway[];
    },
    enabled,
  });

  const { data: countries = [] } = useQuery({
    queryKey: queryKeys.admin.countries,
    queryFn: async () => {
      const { data, error } = await db
        .from('countries')
        .select('id, code, name')
        .order('name');
      if (error) throw error;
      return data as Country[];
    },
    enabled,
  });

  const { data: milestoneCategories = [] } = useQuery({
    queryKey: queryKeys.admin.milestoneCategories,
    queryFn: async () => {
      const { data, error } = await db
        .from('milestone_categories')
        .select('id, code, label, display_order')
        .order('display_order');
      if (error) throw error;
      return data as MilestoneCategory[];
    },
    enabled,
  });

  const { data: disciplines = [] } = useQuery({
    queryKey: queryKeys.admin.disciplines,
    queryFn: async () => {
      const { data, error } = await db
        .from('disciplines')
        .select('id, code, name')
        .order('name');
      if (error) throw error;
      return data as Discipline[];
    },
    enabled,
  });

  // ---- Pathway detail (on-demand) ----

  function usePathwayDetail(pathwayId: string | null) {
    return useQuery({
      queryKey: queryKeys.admin.pathwayDetail(pathwayId),
      queryFn: async () => {
        const { data, error } = await db
          .from('pathways')
          .select(`
            id, code, name, description, country_id,
            estimated_duration, target_role, status,
            created_at, updated_at,
            country:countries(id, code, name),
            milestones(
              id, code, pathway_id, name, description,
              category_id, is_required, display_order,
              evidence_types, resource_url, alternatives,
              status, created_at, updated_at,
              category:milestone_categories(id, code, label)
            )
          `)
          .eq('id', pathwayId)
          .single();
        if (error) throw error;
        // Sort milestones by display_order
        const result = data as AdminPathwayDetail;
        if (result.milestones) {
          result.milestones.sort((a: AdminMilestone, b: AdminMilestone) => a.display_order - b.display_order);
        }
        return result;
      },
      enabled: enabled && !!pathwayId,
    });
  }

  // ---- Mutations ----

  const createPathway = useMutation({
    mutationFn: async (form: PathwayFormData) => {
      const { data, error } = await db
        .from('pathways')
        .insert({
          code: form.code,
          name: form.name,
          description: form.description || null,
          country_id: form.country_id || null,
          estimated_duration: form.estimated_duration || null,
          target_role: form.target_role || null,
          status: form.status || 'draft',
        })
        .select('id, code, name')
        .single();
      if (error) throw error;
      return data as { id: string; code: string; name: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathways });
      toast.success(`Pathway "${data.name}" created`);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create pathway'),
  });

  const updatePathway = useMutation({
    mutationFn: async ({ id, ...form }: PathwayFormData & { id: string }) => {
      const { error } = await db
        .from('pathways')
        .update({
          code: form.code,
          name: form.name,
          description: form.description || null,
          country_id: form.country_id || null,
          estimated_duration: form.estimated_duration || null,
          target_role: form.target_role || null,
          status: form.status,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathways });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathwayDetail(null) });
      toast.success('Pathway updated');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update pathway'),
  });

  const deletePathway = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db
        .from('pathways')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathways });
      toast.success('Pathway deleted');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete pathway'),
  });

  // ---- Milestone mutations ----

  const upsertMilestone = useMutation({
    mutationFn: async ({ pathwayId, milestone }: { pathwayId: string; milestone: MilestoneFormData }) => {
      const row = {
        pathway_id: pathwayId,
        name: milestone.name,
        description: milestone.description || null,
        category_id: milestone.category_id || null,
        is_required: milestone.is_required,
        display_order: milestone.display_order,
        evidence_types: milestone.evidence_types.length > 0 ? milestone.evidence_types : null,
        resource_url: milestone.resource_url || null,
        alternatives: milestone.alternatives.length > 0 ? milestone.alternatives : null,
        status: 'active',
      };

      if (milestone.id) {
        // Update
        const { error } = await db
          .from('milestones')
          .update(row)
          .eq('id', milestone.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await db
          .from('milestones')
          .insert(row);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathwayDetail(null) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathways });
      toast.success('Milestone saved');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to save milestone'),
  });

  const deleteMilestone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db
        .from('milestones')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathwayDetail(null) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathways });
      toast.success('Milestone deleted');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete milestone'),
  });

  const reorderMilestones = useMutation({
    mutationFn: async (items: { id: string; display_order: number }[]) => {
      // Batch update display_order for each milestone
      const promises = items.map(({ id, display_order }) =>
        db.from('milestones').update({ display_order }).eq('id', id)
      );
      const results = await Promise.all(promises);
      const firstError = results.find((r: any) => r.error);
      if (firstError?.error) throw firstError.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pathwayDetail(null) });
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to reorder milestones'),
  });

  return {
    // Data
    pathways,
    countries,
    disciplines,
    milestoneCategories,
    isPathwaysLoading,

    // Detail hook (call inside component)
    usePathwayDetail,

    // Mutations
    createPathway,
    updatePathway,
    deletePathway,
    upsertMilestone,
    deleteMilestone,
    reorderMilestones,
  };
}
