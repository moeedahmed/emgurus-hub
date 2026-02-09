import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription, SubscriptionTier } from '@/modules/career/hooks/useSubscription';

const tierLabels: Record<SubscriptionTier, string> = {
  free: 'Free',
  supporter: 'Supporter',
  sustainer: 'Sustainer',
  champion: 'Champion',
};

const tierVariants: Record<SubscriptionTier, "secondary" | "primary-subtle" | "accent-subtle" | "default"> = {
  free: 'secondary',
  supporter: 'primary-subtle',
  sustainer: 'accent-subtle',
  champion: 'default',
};

export const SubscriptionSection = () => {
  const { subscription, isLoading, openCustomerPortal } = useSubscription();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Subscription</h2>
            <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Subscription</h2>
          <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Plan</span>
          <Badge variant={tierVariants[subscription.tier]}>
            {tierLabels[subscription.tier]}
          </Badge>
        </div>

        {subscription.subscription_end && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Renews on</span>
            <span className="text-sm font-medium">
              {formatDate(subscription.subscription_end)}
            </span>
          </div>
        )}

        <div className="pt-2">
          {subscription.subscribed ? (
            <Button
              variant="outline"
              onClick={() => openCustomerPortal.mutate()}
              disabled={openCustomerPortal.isPending}
              className="w-full"
            >
              {openCustomerPortal.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Manage Subscription
            </Button>
          ) : (
            <Link to="/pricing">
              <Button className="w-full sm:w-auto">
                <Heart className="w-4 h-4" />
                Support Career Guru
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};
