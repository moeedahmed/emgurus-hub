/**
 * Auth compatibility shim for Career module.
 * Re-exports the hub's auth in the format career-guru expects.
 */
import { useAuth as useHubAuth } from '@/core/auth/AuthProvider';

export function useAuth() {
  const hub = useHubAuth();
  return {
    user: hub.user,
    session: hub.session,
    isAuthenticated: !!hub.user,
    isLoading: hub.loading,
    signUp: async (email: string, password: string) => {
      try { await hub.signUp(email, password, ''); return { error: null }; }
      catch (e) { return { error: e as Error }; }
    },
    signIn: async (email: string, password: string) => {
      try { await hub.signInWithEmail(email, password); return { error: null }; }
      catch (e) { return { error: e as Error }; }
    },
    signInWithGoogle: async () => {
      try { await hub.signInWithGoogle(); return { error: null }; }
      catch (e) { return { error: e as Error }; }
    },
    signOut: hub.signOut,
    resendConfirmationEmail: async (_email: string) => ({ error: null }),
    hasCompletedOnboarding: hub.profile?.hub_onboarding_completed ?? false,
    setHasCompletedOnboarding: () => {},
  };
}

// Dummy provider (hub's AuthProvider wraps everything already)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
