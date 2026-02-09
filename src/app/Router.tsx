import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthProvider';
import { HubLayout } from '@/core/layouts/HubLayout';
import { Landing } from '@/app/pages/Landing';
import { Login } from '@/app/pages/Login';
import { SignUp } from '@/app/pages/SignUp';
import { HubDashboard } from '@/app/pages/HubDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
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

        {/* Protected routes */}
        <Route element={<ProtectedRoute><HubLayout /></ProtectedRoute>}>
          <Route path="/hub" element={<HubDashboard />} />
          <Route path="/career/*" element={<ComingSoon module="Career Guru" />} />
          <Route path="/exam/*" element={<ComingSoon module="Exam Guru" />} />
          <Route path="/blog/*" element={<ComingSoon module="Blog" />} />
          <Route path="/profile" element={<ComingSoon module="Profile" />} />
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
