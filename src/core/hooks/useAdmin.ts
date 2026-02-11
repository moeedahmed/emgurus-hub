import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/auth/supabase';
import { useAuth } from '@/core/auth/AuthProvider';

export function useAdmin() {
  const { user } = useAuth();

  const { data: isAdmin = false, isLoading: adminLoading } = useQuery({
    queryKey: ['user-role-admin', user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc('user_has_role', { check_role: 'admin' });
      return data === true;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: isGuru = false, isLoading: guruLoading } = useQuery({
    queryKey: ['user-role-guru', user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc('user_has_role', { check_role: 'guru' });
      return data === true;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const roles = [
    ...(isAdmin ? ['admin'] : []),
    ...(isGuru ? ['guru'] : []),
  ];

  return {
    isAdmin,
    isGuru,
    roles,
    isLoading: adminLoading || guruLoading,
  };
}
