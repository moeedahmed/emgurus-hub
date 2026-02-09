/**
 * Lightweight logger that silences output in production builds.
 * Use instead of console.warn / console.error for legitimate error-path logging.
 * Debug-only logs (console.log) should be removed entirely, not routed here.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  warn(...args: unknown[]) {
    if (isDev) console.warn(...args);
  },
  error(...args: unknown[]) {
    if (isDev) console.error(...args);
  },
};
