import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ProfileCompletionNudgeProps {
  completion: number;
}

const DISMISS_KEY = 'profile-nudge-dismissed';
const DISMISS_DAYS = 7;

export function ProfileCompletionNudge({ completion }: ProfileCompletionNudgeProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissDate = new Date(dismissedAt);
      const now = new Date();
      const daysDiff = (now.getTime() - dismissDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < DISMISS_DAYS) {
        setIsDismissed(true);
        return;
      }
    }
    setIsDismissed(false);
  }, []);

  // Don't show if profile is 80% or more complete
  if (completion >= 80 || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">Complete your profile</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    A complete profile helps us personalize your roadmaps better.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 shrink-0"
                  onClick={handleDismiss}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-3 mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{completion}%</span>
                </div>
                <Progress value={completion} className="h-1.5" />
              </div>

              <Button size="sm" asChild>
                <Link to="/career/profile">
                  Complete profile
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
