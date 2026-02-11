import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthProvider';
import { HubLayout } from '@/core/layouts/HubLayout';
import { Landing } from '@/app/pages/Landing';
import { Login } from '@/app/pages/Login';
import { SignUp } from '@/app/pages/SignUp';
import { Onboarding } from '@/app/pages/Onboarding';
import { HubDashboard } from '@/app/pages/HubDashboard';
import { CareerRoutes } from '@/modules/career';
import { ExamRoutes } from '@/modules/exam';
import { BlogRoutes } from '@/modules/blog';
import { ForumRoutes } from '@/modules/forum';
import { Profile } from '@/app/pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Redirect to onboarding if not completed
  if (!profile?.hub_onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // If already onboarded, skip to hub
  if (profile?.hub_onboarding_completed) {
    return <Navigate to="/hub" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/hub" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute><HubLayout /></ProtectedRoute>}>
          <Route path="/hub" element={<HubDashboard />} />
          <Route path="/career/*" element={<CareerRoutes />} />
          <Route path="/exam/*" element={<ExamRoutes />} />
          <Route path="/blog/*" element={<BlogRoutes />} />
          <Route path="/forum/*" element={<ForumRoutes />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ComingSoon({ module }: { module: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold mb-2">{module}</h2>
      <p className="text-muted-foreground">Module coming soon. We're building this next.</p>
    </div>
  );
}
