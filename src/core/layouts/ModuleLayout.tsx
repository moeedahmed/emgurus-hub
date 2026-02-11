import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface ModuleNavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface ModuleLayoutProps {
  title: string;
  navItems: ModuleNavItem[];
  children: React.ReactNode;
}

export function ModuleLayout({ title, navItems, children }: ModuleLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem-5rem)] sm:min-h-[calc(100vh-3.5rem)]">
      {/* Module sub-header with back + tabs (desktop) */}
      <div className="border-b border-border bg-background/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-11">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Hub</span>
          </button>
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to.split('/').length <= 2}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Mobile bottom nav — module-specific */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md sm:hidden">
        <div className="flex justify-around py-2">
          <button
            onClick={() => navigate('/hub')}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Hub</span>
          </button>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split('/').length <= 2}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
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
