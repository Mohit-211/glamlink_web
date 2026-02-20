/**
 * Utility functions for content editors
 */

/**
 * Format elapsed time since last update
 */
export function formatElapsedTime(timestamp: number | null): string {
  if (!timestamp) return "Never updated";

  const now = Date.now();
  const elapsedMs = now - timestamp;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `Updated ${minutes} min, ${seconds} sec ago`;
}
