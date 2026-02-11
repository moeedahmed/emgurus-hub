import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, GraduationCap, BookOpen, Newspaper,
  ArrowLeft, LayoutDashboard, Library, Brain,
  PenSquare, MessageSquare, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const hubItems: NavItem[] = [
  { to: '/hub', icon: Home, label: 'Home', end: true },
  { to: '/career', icon: GraduationCap, label: 'Career' },
  { to: '/exam', icon: BookOpen, label: 'Exam' },
  { to: '/blog', icon: Newspaper, label: 'Blog' },
  { to: '/forum', icon: MessageSquare, label: 'Forum' },
];

const moduleItems: Record<string, NavItem[]> = {
  career: [
    { to: '/career', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/career/goals', icon: Target, label: 'Goals' },
    { to: '/career/pathways', icon: BookOpen, label: 'Pathways' },
  ],
  exam: [
    { to: '/exam', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/exam/bank', icon: Library, label: 'Bank' },
    { to: '/exam/ai/config', icon: Brain, label: 'AI Practice' },
  ],
  blog: [
    { to: '/blog', icon: Newspaper, label: 'Posts', end: true },
    { to: '/blog/editor/new', icon: PenSquare, label: 'Write' },
  ],
  forum: [
    { to: '/forum', icon: MessageSquare, label: 'Threads', end: true },
    { to: '/forum/new', icon: PenSquare, label: 'New' },
  ],
};

function getActiveModule(pathname: string): string | null {
  const match = pathname.match(/^\/(career|exam|blog|forum)/);
  return match ? match[1] : null;
}

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeModule = getActiveModule(pathname);
  const items = activeModule ? moduleItems[activeModule] : hubItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex justify-around py-2">
        {/* Back to Hub button when inside a module */}
        {activeModule && (
          <button
            onClick={() => navigate('/hub')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Hub</span>
          </button>
        )}
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors',
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
  );
}
