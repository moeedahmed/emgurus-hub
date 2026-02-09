/**
 * Shared formatting utilities for milestone and roadmap metadata
 * Extracted from RoadmapStepCard to ensure consistency
 */

export type Timeframe = '30d' | '6mo' | '12mo' | '18mo+';

export interface CostEstimate {
  label: string;
  min: number;
  max: number | null;
  currency: string;
  note: string | null;
  source_url: string | null;
}

/**
 * Format timeframe for display
 */
export const formatTimeframe = (timeframe: Timeframe): string => {
  const map: Record<Timeframe, string> = {
    '30d': '30 Days',
    '6mo': '6 Months',
    '12mo': '1 Year',
    '18mo+': '18+ Months'
  };
  return map[timeframe];
};

/**
 * Get color class for timeframe badge
 */
export const getTimeframeColor = (timeframe: Timeframe | null): string => {
  switch (timeframe) {
    case '30d': return 'bg-success/10 text-success';
    case '6mo': return 'bg-primary/10 text-primary';
    case '12mo': return 'bg-accent/10 text-accent';
    case '18mo+': return 'bg-warning/10 text-warning';
    default: return 'bg-muted text-muted-foreground';
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

/**
 * Format cost for compact badge display
 */
export const formatCostBadge = (cost: CostEstimate | null | undefined): string => {
  if (!cost) return '';
  if (cost.min === 0 && (!cost.max || cost.max === 0)) return 'Free';
  if (!cost.max || cost.max === cost.min) {
    return `~${formatCurrency(cost.min, cost.currency)}`;
  }
  return `${formatCurrency(cost.min, cost.currency)}-${formatCurrency(cost.max, cost.currency)}`;
};

/**
 * Format cost range for detailed display (tooltip/expanded view)
 */
export const formatCostRange = (cost: CostEstimate | null | undefined): string => {
  if (!cost) return '';
  if (cost.min === 0 && (!cost.max || cost.max === 0)) return 'Free';
  if (!cost.max || cost.max === cost.min) {
    return formatCurrency(cost.min, cost.currency);
  }
  return `${formatCurrency(cost.min, cost.currency)} - ${formatCurrency(cost.max, cost.currency)}`;
};

export type Confidence = 'high' | 'medium' | 'low';

/**
 * Get color classes for confidence badge
 */
export const getConfidenceBadgeColor = (confidence: Confidence | null | undefined): string => {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    case 'low':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get label for confidence level
 */
export const getConfidenceLabel = (confidence: Confidence | null | undefined): string => {
  switch (confidence) {
    case 'high': return 'High Confidence';
    case 'medium': return 'Medium Confidence';
    case 'low': return 'Low Confidence';
    default: return 'Unknown';
  }
};

export type VerificationStatus = 'manual' | 'ai_validated' | 'ai_unvalidated' | 'community' | 'stale';

/**
 * Get color classes for verification status badge
 */
export const getVerificationBadgeColor = (status: VerificationStatus | null | undefined): string => {
  switch (status) {
    case 'manual':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    case 'ai_validated':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    case 'ai_unvalidated':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    case 'community':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
    case 'stale':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get label for verification status
 */
export const getVerificationLabel = (status: VerificationStatus | null | undefined): string => {
  switch (status) {
    case 'manual': return 'Human Verified';
    case 'ai_validated': return 'AI + Human Verified';
    case 'ai_unvalidated': return 'AI Researched';
    case 'community': return 'Community Submitted';
    case 'stale': return 'Needs Re-verification';
    default: return 'Unverified';
  }
};
