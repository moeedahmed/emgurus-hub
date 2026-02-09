// Responsive breakpoints and patterns for consistent layouts across the app

// Breakpoints matching Tailwind defaults
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Common responsive class patterns
// Use these as reference when building new components
export const PATTERNS = {
  // Page headers - stack on mobile, row on desktop
  pageHeader: 'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
  
  // Page titles - responsive sizing
  pageTitle: 'text-xl md:text-2xl font-display font-semibold',
  
  // Section headers
  sectionTitle: 'text-lg md:text-xl font-display font-semibold',
  
  // Card grids with different column counts
  cardGrid: {
    single: 'grid grid-cols-1 gap-3 md:gap-4',
    two: 'grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4',
    three: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4',
  },
  
  // Page content padding - for pages within AppLayout
  pagePadding: 'p-4 md:p-6 lg:p-8',
  
  // Standalone page padding - for pages without AppLayout (like GoalPage, RoadmapPage)
  standalonePagePadding: 'px-4 md:px-6 lg:px-8 py-4 md:py-6',
  
  // Card internal padding
  cardPadding: 'p-4 md:p-5',
  
  // Vertical card list spacing
  cardGap: 'space-y-3 md:space-y-4',
  
  // Grid gap for card layouts
  cardGridGap: 'gap-3 md:gap-4',
  
  // Stats grid
  statsGrid: 'grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4',
  
  // Full width button on mobile, auto on desktop
  buttonMobileFull: 'w-full md:w-auto',
} as const;

// Helper to check if we're on mobile (client-side only)
export const isMobileBreakpoint = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};
