import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/auth/supabase';
import { useAuth } from '@/core/auth/AuthProvider';

export function useAdmin() {
  const { user } = useAuth();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id);

      if (error) return [];
      return data?.map(r => r.role) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isAdmin: roles.includes('admin'),
    isGuru: roles.includes('guru'),
    roles,
    isLoading,
  };
}
