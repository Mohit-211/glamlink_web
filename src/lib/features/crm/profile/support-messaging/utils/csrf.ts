/**
 * CSRF Token utilities for Support Messaging.
 *
 * Uses the shared CSRF manager with messaging-specific storage key.
 */

import { createCsrfManager } from '@/lib/shared/utils/security/csrf';

const CSRF_TOKEN_KEY = 'support-messaging-csrf';

// Create messaging-specific CSRF manager
const csrfManager = createCsrfManager(CSRF_TOKEN_KEY);

/**
 * Get or create CSRF token for the current session.
 */
export const getCsrfToken = csrfManager.getToken;

/**
 * Clear CSRF token (call on logout).
 */
export const clearCsrfToken = csrfManager.clearToken;

/**
 * Get CSRF headers for fetch requests.
 */
export const getCsrfHeaders = csrfManager.getHeaders;

/**
 * Validate a CSRF token against the stored token.
 */
export const validateCsrfToken = csrfManager.validateToken;
