import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { logger } from '@/modules/career/lib/logger';
import { queryKeys } from '@/modules/career/lib/queryKeys';

export function useAdmin() {
  const { user } = useAuth();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: queryKeys.userRoles.byUser(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id);

      if (error) {
        logger.error('[useAdmin] Error fetching user roles:', error);
        return [];
      }
      return data?.map((r) => r.role) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = roles.includes('admin');
  const isTester = roles.includes('tester');
  const hasElevatedAccess = isAdmin || isTester;


  return {
    isAdmin,
    isTester,
    hasElevatedAccess,
    roles,
    isLoading
  };
}
