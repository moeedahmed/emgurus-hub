export const CHART_COLORS = {
  primary: '#1a8a7a',    // ≈ hsl(172 50% 35%)
  success: '#1d9970',    // ≈ hsl(160 60% 35%)
  warning: '#d9960a',    // ≈ hsl(38 80% 50%)
  accent: '#d96a30',     // ≈ hsl(25 70% 50%)
  destructive: '#cc4040', // ≈ hsl(0 60% 50%)
  muted: '#94a3b8',
  // Goal type aliases
  migrate: '#1a8a7a',
  advance: '#1d9970',
  expertise: '#d96a30',
  exam: '#d9960a',
} as const;

export const CHART_SERIES_COLORS = [
  CHART_COLORS.success,
  CHART_COLORS.primary,
  CHART_COLORS.warning,
  CHART_COLORS.accent,
] as const;
