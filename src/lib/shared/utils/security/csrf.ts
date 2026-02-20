/**
 * CSRF Token utilities.
 * Provides defense-in-depth against cross-site request forgery attacks.
 */

const DEFAULT_STORAGE_KEY = 'csrf-token';

/**
 * Generate a cryptographically random token.
 */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a CSRF token manager with a custom storage key.
 *
 * @param storageKey - Key to use for sessionStorage
 * @returns CSRF token management functions
 *
 * @example
 * ```ts
 * const csrf = createCsrfManager('my-feature-csrf');
 * const token = csrf.getToken();
 * const headers = csrf.getHeaders();
 * ```
 */
export function createCsrfManager(storageKey: string = DEFAULT_STORAGE_KEY) {
  /**
   * Get or create CSRF token for the current session.
   */
  function getToken(): string {
    if (typeof window === 'undefined') return '';

    let token = sessionStorage.getItem(storageKey);
    if (!token) {
      token = generateToken();
      sessionStorage.setItem(storageKey, token);
    }
    return token;
  }

  /**
   * Clear CSRF token (call on logout).
   */
  function clearToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(storageKey);
  }

  /**
   * Get CSRF headers for fetch requests.
   */
  function getHeaders(): Record<string, string> {
    return {
      'X-CSRF-Token': getToken(),
    };
  }

  /**
   * Validate a CSRF token against the stored token.
   * Note: In a full implementation, this would be validated server-side
   * against a session-stored token. This client-side check is for
   * consistency and can be used with server-side validation.
   */
  function validateToken(token: string): boolean {
    if (typeof window === 'undefined') return false;
    const storedToken = sessionStorage.getItem(storageKey);
    return !!storedToken && storedToken === token;
  }

  return {
    getToken,
    clearToken,
    getHeaders,
    validateToken,
  };
}

// Default CSRF manager instance
const defaultManager = createCsrfManager(DEFAULT_STORAGE_KEY);

/**
 * Get or create CSRF token for the current session.
 */
export const getCsrfToken = defaultManager.getToken;

/**
 * Clear CSRF token (call on logout).
 */
export const clearCsrfToken = defaultManager.clearToken;

/**
 * Get CSRF headers for fetch requests.
 */
export const getCsrfHeaders = defaultManager.getHeaders;

/**
 * Validate a CSRF token against the stored token.
 */
export const validateCsrfToken = defaultManager.validateToken;
