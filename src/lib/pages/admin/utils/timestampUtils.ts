/**
 * Calculate elapsed time from Unix timestamp (milliseconds)
 * Returns minutes and seconds
 */
export function calculateElapsedTime(lastUpdated: number | null): {
  minutes: number;
  seconds: number;
} {
  if (!lastUpdated) {
    return { minutes: 0, seconds: 0 };
  }

  const now = Date.now();
  const elapsedMs = now - lastUpdated;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return { minutes, seconds };
}

/**
 * Format as "Updated X min, Y sec"
 * Static calculation (not live-updating)
 */
export function formatElapsedTime(lastUpdated: number | null): string {
  const { minutes, seconds } = calculateElapsedTime(lastUpdated);
  return `Updated ${minutes} min, ${seconds} sec`;
}
