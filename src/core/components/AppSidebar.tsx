import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, GraduationCap, BookOpen, Newspaper, MessageSquare,
  User, Shield, LogOut, ArrowLeft, Target, Map, LayoutDashboard,
  Library, Brain, PenSquare,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth } from '@/core/auth/AuthProvider';
import { useAdmin } from '@/core/hooks/useAdmin';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const hubNav: NavItem[] = [
  { to: '/hub', icon: Home, label: 'Hub', end: true },
  { to: '/career', icon: GraduationCap, label: 'Career Guru' },
  { to: '/exam', icon: BookOpen, label: 'Exam Guru' },
  { to: '/blog', icon: Newspaper, label: 'Blog' },
  { to: '/forum', icon: MessageSquare, label: 'Forum' },
];

const moduleNav: Record<string, { title: string; items: NavItem[] }> = {
  career: {
    title: 'Career Guru',
    items: [
      { to: '/career', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/career/goals', icon: Target, label: 'Goals' },
      { to: '/career/pathways', icon: Map, label: 'Pathways' },
    ],
  },
  exam: {
    title: 'Exam Guru',
    items: [
      { to: '/exam', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/exam/bank', icon: Library, label: 'Question Bank' },
      { to: '/exam/ai/config', icon: Brain, label: 'AI Practice' },
    ],
  },
  blog: {
    title: 'Blog',
    items: [
      { to: '/blog', icon: Newspaper, label: 'All Posts', end: true },
      { to: '/blog/editor/new', icon: PenSquare, label: 'Write' },
    ],
  },
  forum: {
    title: 'Forum',
    items: [
      { to: '/forum', icon: MessageSquare, label: 'All Threads', end: true },
      { to: '/forum/new', icon: PenSquare, label: 'New Thread' },
    ],
  },
};

function getActiveModule(pathname: string): string | null {
  const match = pathname.match(/^\/(career|exam|blog|forum)/);
  return match ? match[1] : null;
}

export function AppSidebar() {
  const { signOut, profile } = useAuth();
  const { isAdmin } = useAdmin();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeModule = getActiveModule(pathname);
  const modNav = activeModule ? moduleNav[activeModule] : null;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        {activeModule ? (
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Back to Hub</span>
          </button>
        ) : (
          <NavLink to="/hub" className="text-lg font-bold text-sidebar-primary">
            EMGurus
          </NavLink>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Module-specific nav when inside a module */}
        {modNav && (
          <SidebarGroup>
            <SidebarGroupLabel>{modNav.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {modNav.items.map(({ to, icon: Icon, label, end }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={end ? pathname === to : pathname.startsWith(to)}>
                      <NavLink to={to}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Hub navigation — always shown, but as secondary when inside a module */}
        {!activeModule && (
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {hubNav.map(({ to, icon: Icon, label, end }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={end ? pathname === to : pathname.startsWith(to)}>
                      <NavLink to={to}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin link */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/admin')}>
                      <NavLink to={activeModule ? `/admin?view=content&module=${activeModule}` : '/admin'}>
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/profile'}>
              <NavLink to="/profile">
                <User className="h-4 w-4" />
                <span>{profile?.display_name || 'Profile'}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
