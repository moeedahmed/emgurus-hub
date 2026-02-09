import { toast } from 'sonner';
import { logger } from '@/modules/career/lib/logger';

/**
 * Extracts a human-readable message from an unknown error value.
 * Safe to use in catch blocks where the error type is `unknown`.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

/**
 * Standard error handler: logs via dev-only logger and shows a sonner toast.
 *
 * @example
 * ```ts
 * catch (error) {
 *   handleError(error, { context: 'saving roadmap step' });
 * }
 * ```
 */
export function handleError(
  error: unknown,
  opts?: {
    /** Dev-logger prefix, e.g. "saving roadmap step" */
    context?: string;
    /** Override the toast message (default: extracted from error) */
    userMessage?: string;
    /** Log only, no toast */
    silent?: boolean;
  }
): void {
  const message = extractErrorMessage(error);

  if (opts?.context) {
    logger.error(`[${opts.context}]`, error);
  }

  if (!opts?.silent) {
    toast.error(opts?.userMessage || message);
  }
}
