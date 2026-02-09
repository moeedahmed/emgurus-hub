import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { queryKeys } from '@/modules/career/lib/queryKeys';


export interface CustomMilestone {
  id: string;
  name: string;
  pathway_id: string | null;
  completed: boolean;
  created_at: string;
  category?: string;
}


export interface PathwayConfigEntry {
  hidden_milestones?: string[];
  milestone_order?: string[];
  milestone_overrides?: Record<string, string>;
  completed_milestones?: string[];
  in_progress_milestones?: string[];
}

export interface PathwayConfig {
  [pathwayName: string]: PathwayConfigEntry;
}

export interface Profile {
  id: string;
  career_stage: string | null;
  current_country: string | null;
  specialty: string | null;
  specialties: string[] | null;
  training_paths: string[] | null;
  pathway_ids?: string[] | null;
  archived_pathway_ids?: string[] | null;
  graduation_year: string | null;
  milestones_achieved: string[] | null;
  years_experience: string | null;
  onboarding_completed: boolean | null;
  display_name: string | null;
  preferred_countries: string[] | null;
  primary_career_goal: string | null;
  timeline: string | null;
  work_rhythm: string | null;
  additional_context: string | null;
  language_proficiency: string | null;
  custom_milestones: CustomMilestone[] | null;
  pathway_id: string | null;
  pathway_configs: PathwayConfig | null;
  milestones_in_progress: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile.byUser(user?.id),
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Profile | null;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
      if (!user) throw new Error('Not authenticated');

      // Convert complex types to JSON-compatible format for Supabase
      const supabaseUpdates: Record<string, unknown> = { ...updates };

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...supabaseUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Profile;
    },
    onSuccess: (data) => {
      // Set the new data directly in the cache for immediate UI update
      queryClient.setQueryData(queryKeys.profile.byUser(user?.id), data);
    },
  });
}

export function calculateProfileCompletion(profile: Profile | null): number {
  if (!profile) return 0;

  const fields = [
    profile.career_stage,
    profile.current_country,
    profile.specialty,
    (profile.training_paths && profile.training_paths.length > 0) ||
      (profile.pathway_ids && profile.pathway_ids.length > 0),
    profile.graduation_year,
    profile.years_experience,
    profile.display_name,
    profile.work_rhythm,
    profile.additional_context,
  ];

  const filledCount = fields.filter(Boolean).length;
  return Math.round((filledCount / fields.length) * 100);
}
