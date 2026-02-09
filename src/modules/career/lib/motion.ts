export const MOTION = {
    // 1. Primitive Tokens (The Physics)
    TOKENS: {
        FAST: 0.2,    // Micro-interactions (Hover, Click)
        NORMAL: 0.3,  // Interface Entrances (Cards, Dialogs)
        RELAXED: 0.5, // Large Layout Shifts
        SLOW: 0.8,    // Data Visualization (Progress Bars)
    },

    // 2. Semantic Usage (The Application)
    ENTRANCE: {
        DURATION: 0.3, // Standard "In" speed (NORMAL)
        STAGGER: 0.1,  // Standard list delay
    },
    DATA: {
        FILL_DURATION: 0.8, // Progress bars should feel "full" and take time to rise
    }
} as const;
