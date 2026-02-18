/**
 * Content sanitization utilities for Support Messaging.
 * These are messaging-specific wrappers around shared utilities.
 */

import {
  sanitizeUserInput,
  isValidInput,
  getCharCount,
} from '@/lib/shared/utils/sanitize';
import {
  isUrlSafe,
  sanitizeUrl,
  extractUrls,
  parseTextWithLinks,
  type ContentSegment,
} from '@/lib/shared/utils/url';

// Re-export URL utilities for backwards compatibility
export { isUrlSafe, sanitizeUrl, extractUrls, parseTextWithLinks };
export type { ContentSegment };

/**
 * Maximum allowed message length
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Sanitize message content before display/storage.
 * Alias for sanitizeUserInput with message-specific semantics.
 */
export function sanitizeMessageContent(content: string): string {
  return sanitizeUserInput(content, MAX_MESSAGE_LENGTH);
}

/**
 * Validate message content.
 * - Must not be empty after trimming
 * - Must not exceed 2000 characters
 */
export function isValidMessageContent(content: string): boolean {
  return isValidInput(content, MAX_MESSAGE_LENGTH);
}

/**
 * Get character count for display.
 */
export function getMessageCharCount(content: string): number {
  return getCharCount(content);
}

/**
 * Alias for backwards compatibility
 * @deprecated Use parseTextWithLinks instead
 */
export const parseContentWithLinks = parseTextWithLinks;
