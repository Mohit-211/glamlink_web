/**
 * Debug logging utility for Support Messaging.
 *
 * Uses the shared debug logger factory with messaging-specific configuration.
 *
 * @example
 * ```typescript
 * import { debug } from '../utils/debug';
 *
 * debug.log('Sending message', { content, conversationId });
 * debug.warn('Rate limit approaching', { remaining: 3 });
 * debug.error('Failed to send', error);
 * debug.group('Message Processing');
 * debug.log('Step 1');
 * debug.log('Step 2');
 * debug.groupEnd();
 * ```
 */

import { createFeatureDebug } from '@/lib/shared/utils/debug';

/**
 * Debug logger instance for Support Messaging.
 *
 * Enable debugging via:
 * - localStorage: localStorage.setItem('support-messaging-debug', 'true')
 * - URL parameter: ?support-messaging-debug=true
 */
export const debug = createFeatureDebug('Support Messaging');

// Expose debug to window for easy console access
if (typeof window !== 'undefined') {
  (window as unknown as { supportMessagingDebug: typeof debug }).supportMessagingDebug = debug;
}
