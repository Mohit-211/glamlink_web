/**
 * Retry utilities with exponential backoff.
 */

export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in milliseconds (default: 1000) */
  baseDelayMs?: number;
  /** Maximum delay cap in milliseconds (default: 30000) */
  maxDelayMs?: number;
  /** Backoff multiplier (default: 2) */
  backoffFactor?: number;
  /** Whether to add jitter to prevent thundering herd (default: true) */
  jitter?: boolean;
  /** Optional callback on each retry attempt */
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with optional jitter.
 *
 * @param attempt - Current retry attempt (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 */
export function getBackoffDelay(
  attempt: number,
  config: RetryConfig = {}
): number {
  const {
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    backoffFactor = 2,
    jitter = true,
  } = config;

  // Calculate exponential delay
  const delay = Math.min(baseDelayMs * Math.pow(backoffFactor, attempt), maxDelayMs);

  // Add jitter (+-20%) to prevent thundering herd
  if (jitter) {
    const jitterAmount = delay * 0.2 * (Math.random() - 0.5);
    return Math.round(delay + jitterAmount);
  }

  return Math.round(delay);
}

/**
 * Retry an async function with exponential backoff.
 *
 * @param fn - The async function to retry
 * @param config - Retry configuration
 * @returns The result of the function
 * @throws The last error if all retries fail
 *
 * @example
 * ```ts
 * // Basic usage
 * const result = await retryWithBackoff(
 *   async () => fetch('/api/data').then(r => r.json()),
 *   { maxRetries: 3 }
 * );
 *
 * // With logging
 * const result = await retryWithBackoff(fetchData, {
 *   maxRetries: 5,
 *   baseDelayMs: 500,
 *   onRetry: (attempt, delay, error) => {
 *     console.log(`Retry ${attempt} after ${delay}ms: ${error.message}`);
 *   },
 * });
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries = 3, onRetry } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;

      if (attempt < maxRetries) {
        const delay = getBackoffDelay(attempt, config);
        onRetry?.(attempt + 1, delay, lastError);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Create a retry wrapper with pre-configured options.
 *
 * @param config - Default retry configuration
 * @returns A retry function with the given defaults
 *
 * @example
 * ```ts
 * const apiRetry = createRetryWrapper({
 *   maxRetries: 3,
 *   baseDelayMs: 500,
 *   onRetry: (attempt, delay) => console.log(`Retrying in ${delay}ms...`),
 * });
 *
 * const data = await apiRetry(() => fetchData());
 * const user = await apiRetry(() => fetchUser(id));
 * ```
 */
export function createRetryWrapper(config: RetryConfig) {
  return <T>(fn: () => Promise<T>, overrides?: Partial<RetryConfig>): Promise<T> => {
    return retryWithBackoff(fn, { ...config, ...overrides });
  };
}
