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

/**
 * ModuleLayout is now a thin wrapper — navigation is handled by
 * AppSidebar (desktop) and MobileBottomNav (mobile) via HubLayout.
 * This component remains for backwards compatibility with module routes.
 */
export function ModuleLayout({ children }: ModuleLayoutProps) {
  return <div className="flex flex-col min-h-0">{children}</div>;
}
