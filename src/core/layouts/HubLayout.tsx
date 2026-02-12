import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/core/components/AppSidebar';
import { MobileBottomNav } from '@/core/components/MobileBottomNav';

export function HubLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-x-hidden">
        {/* Top bar with sidebar toggle */}
        <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-md px-4">
          <SidebarTrigger className="-ml-1" />
          <span className="text-sm font-semibold text-foreground md:hidden">EMGurus</span>
        </header>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="p-4 pb-20 md:p-6 md:pb-6 overflow-x-hidden">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>

      {/* Mobile bottom nav — visible below md breakpoint */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}
