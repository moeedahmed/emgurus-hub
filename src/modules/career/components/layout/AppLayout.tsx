import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  Settings,
  Target,
  TrendingUp,
  MessageSquarePlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { useTheme } from '@/modules/career/contexts/ThemeContext';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { useAdmin } from '@/modules/career/hooks/useAdmin';
import { useAvatarSync } from '@/modules/career/hooks/useAvatarSync';
import { cn } from '@/lib/utils';
import { FeedbackDialog } from '@/modules/career/components/feedback/FeedbackDialog';

interface AppLayoutProps {
  children: React.ReactNode;
}

const baseNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/career' },
  { icon: TrendingUp, label: 'Pathways', path: '/career/pathways' },
  { icon: Target, label: 'Goals', path: '/career/goals' },
  { icon: User, label: 'Profile', path: '/career/profile' },
];

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: profile } = useProfile();
  const { isAdmin } = useAdmin();

  // Self-heal avatar if missing
  useAvatarSync();

  // Build nav items dynamically based on admin status
  const navItems = useMemo(() => {
    const items = [...baseNavItems];
    if (isAdmin) {
      items.push({ icon: Settings, label: 'Admin', path: '/career/admin' });
    }
    return items;
  }, [isAdmin]);

  const fullName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const displayName = fullName.split(' ')[0]; // Use first name only for personalization
  const subtitle = profile?.career_stage || 'Medical Professional';
  const initial = displayName[0]?.toUpperCase() || 'U';

  // Get avatar URL from Google OAuth user metadata or identities fallback
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.find((i) => i.identity_data?.avatar_url || i.identity_data?.picture)?.identity_data?.avatar_url ||
    user?.identities?.find((i) => i.identity_data?.picture)?.identity_data?.picture ||
    null;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/50 bg-sidebar transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
          <Link to="/career" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-display font-bold text-base">EM</span>
            </div>
            {sidebarOpen && <span className="font-display font-semibold text-lg whitespace-nowrap">EMGurus</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            <ChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} />
          </Button>
        </div>

        {/* Nav Items - scrollable */}
        <nav className="flex-1 scrollbar-custom p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions - fixed at bottom */}
        <div className="p-4 border-t border-border/50 space-y-2 shrink-0">
          <FeedbackDialog
            trigger={
              <Button
                variant="ghost"
                className={cn('w-full justify-start gap-3', !sidebarOpen && 'justify-center')}
              >
                <MessageSquarePlus className="w-5 h-5" />
                {sidebarOpen && <span>Feedback</span>}
              </Button>
            }
          />
          <Button
            variant="ghost"
            className={cn('w-full justify-start gap-3', !sidebarOpen && 'justify-center')}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn('w-full justify-start gap-3 text-destructive hover:text-destructive', !sidebarOpen && 'justify-center')}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>

        {/* User Info - fixed at bottom */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border/50 shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="gradient-bg text-primary-foreground font-semibold text-sm">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-lg border-b border-border/50 z-50 flex items-center justify-between px-4">
        <Link to="/career" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">EM</span>
          </div>
          <span className="font-display font-semibold whitespace-nowrap">EMGurus</span>
        </Link>

        {/* Avatar dropdown for theme/logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
              <AvatarFallback className="gradient-bg text-primary-foreground font-semibold text-xs">
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFeedbackOpen(true)}>
              <MessageSquarePlus className="w-4 h-4" />
              Send Feedback
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
        <div className={cn(
          "grid h-16",
          isAdmin ? "grid-cols-5" : "grid-cols-4"
        )}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 lg:mt-0 mt-14 pb-20 lg:pb-0 scrollbar-custom relative">
        {children}
      </main>
    </div>
  );
};
