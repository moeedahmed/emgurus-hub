import { Outlet, NavLink } from 'react-router-dom';
import { Home, GraduationCap, BookOpen, Newspaper, User, LogOut } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/hub', icon: Home, label: 'Hub' },
  { to: '/career', icon: GraduationCap, label: 'Career' },
  { to: '/exam', icon: BookOpen, label: 'Exam' },
  { to: '/blog', icon: Newspaper, label: 'Blog' },
];

export function HubLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">EMGurus</span>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
            </NavLink>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md sm:hidden">
        <div className="flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
