// Server-side rate limiting utility
// Uses in-memory Map for tracking request timestamps

interface RateLimitEntry {
  timestamps: number[];
}

// In-memory store for rate limit tracking
// Note: This resets on server restart. For production, consider using Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a user has exceeded the rate limit
 * @param userId - The user ID to check
 * @param limit - Maximum number of actions allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if under limit (allowed), false if limit exceeded
 */
export function checkRateLimit(
  userId: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry) {
    // First request from this user
    return true;
  }

  // Filter out timestamps outside the window
  const validTimestamps = entry.timestamps.filter(
    (timestamp) => now - timestamp < windowMs
  );

  // Update the entry with only valid timestamps
  entry.timestamps = validTimestamps;

  // Check if under limit
  return validTimestamps.length < limit;
}

/**
 * Record an action for rate limiting
 * @param userId - The user ID to record
 */
export function recordRateLimitAction(userId: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (entry) {
    entry.timestamps.push(now);
  } else {
    rateLimitStore.set(userId, { timestamps: [now] });
  }
}

/**
 * Get remaining actions for a user
 * @param userId - The user ID to check
 * @param limit - Maximum number of actions allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Number of remaining actions
 */
export function getRemainingActions(
  userId: string,
  limit: number,
  windowMs: number
): number {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry) {
    return limit;
  }

  const validTimestamps = entry.timestamps.filter(
    (timestamp) => now - timestamp < windowMs
  );

  return Math.max(0, limit - validTimestamps.length);
}

/**
 * Clear rate limit data for a user (for testing purposes)
 * @param userId - The user ID to clear
 */
export function clearRateLimit(userId: string): void {
  rateLimitStore.delete(userId);
}

/**
 * Clean up old entries to prevent memory leaks
 * Should be called periodically in production
 */
export function cleanupRateLimitStore(windowMs: number): void {
  const now = Date.now();

  for (const [userId, entry] of rateLimitStore.entries()) {
    const validTimestamps = entry.timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (validTimestamps.length === 0) {
      rateLimitStore.delete(userId);
    } else {
      entry.timestamps = validTimestamps;
    }
  }
}
