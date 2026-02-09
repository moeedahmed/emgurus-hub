import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { queryKeys } from '@/modules/career/lib/queryKeys';

// Tier limits - must match check-usage edge function (Career Guru sustainable pricing)
const TIER_LIMITS = {
  free: {
    roadmaps: 3,
    ai_messages: 50,
    documents: 5,
    voice: 10,
  },
  supporter: {
    roadmaps: 8,
    ai_messages: 100,
    documents: 10,
    voice: 20,
  },
  sustainer: {
    roadmaps: 20,
    ai_messages: 300,
    documents: 30,
    voice: 60,
  },
  champion: {
    roadmaps: 100,
    ai_messages: 1000,
    documents: 100,
    voice: 200,
  },
};

type Tier = keyof typeof TIER_LIMITS;

export interface UsageData {
  roadmaps_generated: number;
  ai_messages_sent: number;
  documents_analyzed: number;
  voice_minutes_used: number;
  subscription_tier: Tier | 'admin';
  current_period_start: string | null;
  current_period_end: string | null;
}

export interface UsageLimits {
  roadmaps: { used: number; limit: number; remaining: number };
  ai_messages: { used: number; limit: number; remaining: number };
  documents: { used: number; limit: number; remaining: number };
  voice: { used: number; limit: number; remaining: number };
  tier: Tier | 'admin';
  periodEnd: string | null;
  daysRemaining: number;
}

export function useUsage() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.usage.byUser(user?.id),
    queryFn: async (): Promise<UsageLimits | null> => {
      if (!user?.id) return null;

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const isAdmin = !!roleData;

      if (isAdmin) {
        return {
          roadmaps: { used: 0, limit: 999999, remaining: 999999 },
          ai_messages: { used: 0, limit: 999999, remaining: 999999 },
          documents: { used: 0, limit: 999999, remaining: 999999 },
          voice: { used: 0, limit: 999999, remaining: 999999 },
          tier: 'admin',
          periodEnd: null,
          daysRemaining: 30,
        };
      }

      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching usage:', error);
        throw error;
      }

      // If no usage record, return defaults for free tier
      if (!data) {
        return {
          roadmaps: { used: 0, limit: TIER_LIMITS.free.roadmaps, remaining: TIER_LIMITS.free.roadmaps },
          ai_messages: { used: 0, limit: TIER_LIMITS.free.ai_messages, remaining: TIER_LIMITS.free.ai_messages },
          documents: { used: 0, limit: TIER_LIMITS.free.documents, remaining: TIER_LIMITS.free.documents },
          voice: { used: 0, limit: TIER_LIMITS.free.voice, remaining: TIER_LIMITS.free.voice },
          tier: 'free',
          periodEnd: null,
          daysRemaining: 30,
        };
      }

      const tier = (data.subscription_tier as Tier) || 'free';
      const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

      // Calculate days remaining
      let daysRemaining = 30;
      if (data.current_period_end) {
        const endDate = new Date(data.current_period_end);
        const now = new Date();
        daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      }

      return {
        roadmaps: {
          used: data.roadmaps_generated || 0,
          limit: limits.roadmaps,
          remaining: Math.max(0, limits.roadmaps - (data.roadmaps_generated || 0)),
        },
        ai_messages: {
          used: data.ai_messages_sent || 0,
          limit: limits.ai_messages,
          remaining: Math.max(0, limits.ai_messages - (data.ai_messages_sent || 0)),
        },
        documents: {
          used: data.documents_analyzed || 0,
          limit: limits.documents,
          remaining: Math.max(0, limits.documents - (data.documents_analyzed || 0)),
        },
        voice: {
          used: Number(data.voice_minutes_used) || 0,
          limit: limits.voice,
          remaining: Math.max(0, limits.voice - (Number(data.voice_minutes_used) || 0)),
        },
        tier,
        periodEnd: data.current_period_end,
        daysRemaining,
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache for 30 seconds
  });
}
