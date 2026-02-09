// Animation timing constants for consistent motion across the app

export const ANIMATION = {
  // Durations (in seconds for framer-motion)
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  
  // Stagger delays for lists
  stagger: {
    fast: 0.05,
    normal: 0.1,
  },
  
  // Section delays for page content
  sectionDelay: {
    first: 0.1,
    second: 0.2,
    third: 0.3,
  },
  
  // Easing curves
  ease: {
    out: [0, 0, 0.2, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
    spring: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
};

// Reusable animation variants for framer-motion
export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: ANIMATION.stagger.normal,
    },
  },
};

// Utility to create staggered item animation
export const createStaggeredItem = (index: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { delay: index * ANIMATION.stagger.normal }
  },
});
