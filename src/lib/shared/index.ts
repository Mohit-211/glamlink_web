/**
 * Shared library exports.
 *
 * This module provides reusable hooks, components, and utilities
 * that can be used across different features of the application.
 *
 * @example
 * ```ts
 * // Import hooks
 * import { useFocusTrap, useRateLimit, useOfflineQueue } from '@/lib/shared';
 *
 * // Import components
 * import { LoadingSpinner, ConnectionIndicator, AriaAnnouncer } from '@/lib/shared';
 *
 * // Import utilities
 * import { sanitizeUserInput, formatRelativeTime, retryWithBackoff } from '@/lib/shared';
 * ```
 */

// Components
export * from './components';

// Hooks
export * from './hooks';

// Utilities
export * from './utils';
