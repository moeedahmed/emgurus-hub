import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';

export interface GoalConstraints {
  // Migrate constraints
  target_country?: string;
  visa_needs?: 'needs_sponsorship' | 'has_work_rights' | 'unsure';
  family_situation?: ('solo' | 'partner' | 'children')[];
  // Advance constraints
  target_role?: string;
  current_system?: 'nhs' | 'private' | 'academic' | 'military';
  pathway_preference?: 'formal' | 'independent' | 'internal' | 'unsure';
  // Expertise constraints
  target_area?: 'subspecialty' | 'procedural' | 'research' | 'teaching' | 'leadership' | 'other';
  focus_area?: string; // Backward compatibility
  target_area_other?: string; // Custom specification for any target area
  subspecialty?: string;
  certification_goal?: 'qualification' | 'fellowship' | 'specialist' | 'certification';
  training_format?: 'fulltime' | 'parttime' | 'selfstudy';
  // Exam constraints
  exam_target?: string;
  exam_date?: string;
  study_capacity?: 'fulltime' | 'parttime' | 'minimal';
  attempt_status?: 'first' | 'retake';
  previous_score?: string;
  study_style?: ('selfstudy' | 'course' | 'group')[];
  weak_areas?: string;
  // Metadata for better personalization
  primary_driver?: ('income' | 'training' | 'lifestyle' | 'safety' | 'family')[];
  current_proficiency?: 'novice' | 'intermediate' | 'advanced';
  // Common
  timeline_preference?: '3m' | '6m' | '12m' | '2y' | '5y';
}

export interface Goal {
  id: string;
  user_id: string;
  type: 'migrate' | 'advance' | 'expertise' | 'exam';
  title: string;
  narrative: string | null;
  target_country: string | null;
  target_role: string | null;
  timeline: string | null;
  constraints: GoalConstraints | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
}

export interface CreateGoalInput {
  type: 'migrate' | 'advance' | 'expertise' | 'exam';
  title: string;
  narrative?: string;
  target_country?: string;
  target_role?: string;
  timeline?: string;
  constraints?: GoalConstraints;
}

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Goal | null;
    },
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          type: input.type,
          title: input.title,
          narrative: input.narrative || null,
          target_country: input.target_country || null,
          target_role: input.target_role || null,
          timeline: input.timeline || null,
          constraints: input.constraints ? JSON.parse(JSON.stringify(input.constraints)) : null,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, constraints, ...updates }: Partial<Goal> & { id: string }) => {
      const updateData = {
        ...updates,
        ...(constraints !== undefined && { constraints: JSON.parse(JSON.stringify(constraints)) })
      };
      const { data, error } = await supabase
        .from('goals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(data.id) });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
