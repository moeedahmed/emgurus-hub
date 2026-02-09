import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { logger } from '@/modules/career/lib/logger';

export type SubscriptionTier = 'free' | 'supporter' | 'sustainer' | 'champion';

export interface SubscriptionStatus {
  subscribed: boolean;
  tier: SubscriptionTier;
  subscription_end: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.subscription.byUser(user?.id),
    queryFn: async (): Promise<SubscriptionStatus> => {
      if (!user?.id) {
        return { subscribed: false, tier: 'free', subscription_end: null };
      }

      // Get fresh session before calling
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        // Session is invalid, return free tier without throwing
        logger.warn('No valid session for subscription check');
        return { subscribed: false, tier: 'free', subscription_end: null };
      }
      
      // Refresh if expiring soon (within 60 seconds)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      if (expiresAt - Date.now() < 60000) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          logger.warn('Session refresh failed');
          return { subscribed: false, tier: 'free', subscription_end: null };
        }
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        // Handle auth errors gracefully - return free tier instead of throwing
        if (error.message?.includes('401') || error.message?.includes('session') || error.message?.includes('Auth')) {
          logger.warn('Auth error in subscription check:', error.message);
          return { subscribed: false, tier: 'free', subscription_end: null };
        }
        logger.error('Error checking subscription:', error);
        throw error;
      }

      return data as SubscriptionStatus;
    },
    enabled: !!user?.id,
    staleTime: 60000,
    refetchInterval: 60000,
  });

  // Refetch subscription status when returning from Stripe checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'success') {
      toast.success('Thank you for supporting Career Guru!', {
        description: 'Your contribution helps keep the servers running.',
      });
      
      // Wait a moment for Stripe webhook to process, then refetch
      const timer = setTimeout(() => {
        refetch();
        queryClient.invalidateQueries({ queryKey: queryKeys.usage.byUser(user?.id) });
      }, 2000);
      
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      
      return () => clearTimeout(timer);
    }
  }, [refetch, queryClient]);

  const createCheckout = useMutation({
    mutationFn: async (tier: 'supporter' | 'sustainer' | 'champion') => {
      // Get fresh session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Please sign in to continue');
      }
      
      // Force refresh if token is about to expire (within 60 seconds)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      if (expiresAt - Date.now() < 60000) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw new Error('Session expired. Please sign in again.');
        }
      }
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier },
      });

      if (error) {
        // Check for auth errors
        if (error.message?.includes('401') || error.message?.includes('JWT') || error.message?.includes('Invalid')) {
          throw new Error('Session expired. Please sign in again.');
        }
        throw error;
      }
      return data as { url: string };
    },
    onSuccess: (data) => {
      // Open checkout in new tab
      window.open(data.url, '_blank');
    },
  });

  const openCustomerPortal = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      return data as { url: string };
    },
    onSuccess: (data) => {
      window.open(data.url, '_blank');
    },
  });

  return {
    subscription: subscription ?? { subscribed: false, tier: 'free' as SubscriptionTier, subscription_end: null },
    isLoading,
    error,
    refetch,
    createCheckout,
    openCustomerPortal,
  };
}
