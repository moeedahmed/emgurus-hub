import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthProvider';
import { HubLayout } from '@/core/layouts/HubLayout';
import { Landing } from '@/app/pages/Landing';
import { Login } from '@/app/pages/Login';
import { SignUp } from '@/app/pages/SignUp';
import { Onboarding } from '@/app/pages/Onboarding';
import { HubDashboard } from '@/app/pages/HubDashboard';

// Lazy-loaded modules — each becomes a separate JS chunk
const CareerRoutes = lazy(() => import('@/modules/career').then(m => ({ default: m.CareerRoutes })));
const ExamRoutes = lazy(() => import('@/modules/exam').then(m => ({ default: m.ExamRoutes })));
const BlogRoutes = lazy(() => import('@/modules/blog').then(m => ({ default: m.BlogRoutes })));
const ForumRoutes = lazy(() => import('@/modules/forum').then(m => ({ default: m.ForumRoutes })));
const Profile = lazy(() => import('@/app/pages/Profile').then(m => ({ default: m.Profile })));
const Admin = lazy(() => import('@/app/pages/Admin').then(m => ({ default: m.Admin })));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

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

        {/* Protected routes — modules are lazy-loaded */}
        <Route element={<ProtectedRoute><HubLayout /></ProtectedRoute>}>
          <Route path="/hub" element={<HubDashboard />} />
          <Route path="/career/*" element={<Suspense fallback={<LoadingSpinner />}><CareerRoutes /></Suspense>} />
          <Route path="/exam/*" element={<Suspense fallback={<LoadingSpinner />}><ExamRoutes /></Suspense>} />
          <Route path="/blog/*" element={<Suspense fallback={<LoadingSpinner />}><BlogRoutes /></Suspense>} />
          <Route path="/forum/*" element={<Suspense fallback={<LoadingSpinner />}><ForumRoutes /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<LoadingSpinner />}><Admin /></Suspense>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
