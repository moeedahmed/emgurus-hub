import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { queryKeys } from '@/modules/career/lib/queryKeys';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  weekly_summary_enabled: boolean;
  deadline_reminders_enabled: boolean;
  last_weekly_email_at: string | null;
  last_reminder_email_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotificationPreferences() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.prefs(user?.id),
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as NotificationPreferences | null;
    },
    enabled: !!user?.id,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Pick<NotificationPreferences, 'weekly_summary_enabled' | 'deadline_reminders_enabled'>>) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Upsert - insert if doesn't exist, update if it does
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
        }, {
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.prefs(user?.id) });
    },
  });
}
