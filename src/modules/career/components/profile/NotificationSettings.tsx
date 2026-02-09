import { motion } from 'framer-motion';
import { Loader2, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/modules/career/hooks/useNotificationPreferences';
import { toast } from 'sonner';

export function NotificationSettings() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const handleToggle = async (field: 'weekly_summary_enabled' | 'deadline_reminders_enabled', value: boolean) => {
    try {
      await updatePreferences.mutateAsync({ [field]: value });
      toast.success('Notification preferences updated');
    } catch {
      toast.error('Failed to update preferences');
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  // Default values if no preferences exist yet
  const weeklySummary = preferences?.weekly_summary_enabled ?? true;
  const deadlineReminders = preferences?.deadline_reminders_enabled ?? true;

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Email Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Manage your email preferences
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-summary" className="text-sm font-medium">
              Weekly Progress Summary
            </Label>
            <p className="text-xs text-muted-foreground">
              Receive a summary of your progress every Monday
            </p>
          </div>
          <Switch
            id="weekly-summary"
            checked={weeklySummary}
            onCheckedChange={(checked) => handleToggle('weekly_summary_enabled', checked)}
            disabled={updatePreferences.isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="deadline-reminders" className="text-sm font-medium">
              Deadline Reminders
            </Label>
            <p className="text-xs text-muted-foreground">
              Get notified when steps are approaching their target timeframe
            </p>
          </div>
          <Switch
            id="deadline-reminders"
            checked={deadlineReminders}
            onCheckedChange={(checked) => handleToggle('deadline_reminders_enabled', checked)}
            disabled={updatePreferences.isPending}
          />
        </div>
      </div>
    </motion.div>
  );
}
