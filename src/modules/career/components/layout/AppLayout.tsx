/**
 * AppLayout shim for hub integration.
 * 
 * In the standalone career-guru app, this provided the full shell (header, sidebar, bottom nav).
 * In the hub, HubLayout already provides that, so this is a simple pass-through.
 */

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return <>{children}</>;
};
