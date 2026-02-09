/**
 * Centralized React Query key definitions.
 *
 * Using `as const` gives exact tuple types so TypeScript can
 * catch key mismatches at compile time.
 */
export const queryKeys = {
  goals: {
    all: ['goals'] as const,
    detail: (id: string) => ['goals', id] as const,
  },
  roadmap: {
    byGoal: (goalId: string) => ['roadmap', goalId] as const,
    all: ['roadmap'] as const,
  },
  profile: {
    byUser: (userId: string | undefined) => ['profile', userId] as const,
  },
  subscription: {
    byUser: (userId: string | undefined) => ['subscription', userId] as const,
  },
  usage: {
    byUser: (userId: string | undefined) => ['usage', userId] as const,
  },
  userRoles: {
    byUser: (userId: string | undefined) => ['user-roles', userId] as const,
  },
  pathways: {
    registry: ['pathway-registry'] as const,
    /** Legacy key used in some invalidations */
    all: ['pathways'] as const,
    suggestions: (specialties: string[]) => ['pathway-suggestions', specialties] as const,
    /** List pathways by country/specialty for selection step */
    byFilters: (country: string, specialty?: string) => ['pathways-list', country, specialty] as const,
  },
  goalProgress: {
    byGoal: (goalId: string) => ['goal-progress', goalId] as const,
    byGoals: (goalIds: string[]) => ['all-goals-progress', goalIds] as const,
  },
  notifications: {
    prefs: (userId: string | undefined) => ['notification-preferences', userId] as const,
  },
  recentActivity: {
    byUser: (userId: string | undefined, limit: number) => ['recentActivity', userId, limit] as const,
    dueThisWeek: (userId: string | undefined) => ['dueThisWeek', userId] as const,
  },
  nextStep: {
    byGoals: (goalIds: string[]) => ['next-step', goalIds] as const,
  },
  userMilestones: {
    byUser: (userId: string | undefined) => ['user-milestones', userId] as const,
  },
  userPathways: {
    byUser: (userId: string | undefined) => ['user-pathways', userId] as const,
  },
  milestones: {
    byUserAndPathway: (userId: string | undefined, pathwayId: string | null) =>
      ['pathway-milestones', userId, pathwayId] as const,
  },
  admin: {
    pathways: ['admin-pathways'] as const,
    pathwayDetail: (id: string | null) => ['admin-pathway-detail', id] as const,
    countries: ['admin-countries'] as const,
    milestoneCategories: ['admin-milestone-categories'] as const,
    disciplines: ['admin-disciplines'] as const,
    prompts: ['ai-prompts'] as const,
    roles: ['user-roles-admin'] as const,
    usageStats: ['admin-usage-stats'] as const,
    allUsers: ['all-users-for-roles'] as const,
    notificationSettings: (userId: string | undefined) => ['admin-notification-settings', userId] as const,
    feedback: ['admin-feedback'] as const,
    userDetails: (userIds: string[]) => ['user-details', userIds] as const,
  },
} as const;
