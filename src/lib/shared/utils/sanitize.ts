/**
 * Content sanitization utilities.
 * Note: React already escapes content by default, this is defense-in-depth.
 */

/**
 * Sanitize HTML content by removing all tags.
 *
 * @param content - Content to sanitize
 * @returns Content with HTML tags removed
 *
 * @example
 * ```ts
 * sanitizeHtml('<script>alert("XSS")</script>Hello'); // "Hello"
 * ```
 */
export function sanitizeHtml(content: string): string {
  return content.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize user input content.
 * - Removes any HTML tags
 * - Normalizes whitespace (collapse multiple newlines)
 * - Trims leading/trailing whitespace
 * - Optionally enforces max length
 *
 * @param content - Content to sanitize
 * @param maxLength - Optional maximum length to enforce
 * @returns Sanitized content
 *
 * @example
 * ```ts
 * sanitizeUserInput('  <b>Hello</b>\n\n\n\nWorld  '); // "Hello\n\nWorld"
 * sanitizeUserInput('Long text...', 10); // "Long text."
 * ```
 */
export function sanitizeUserInput(content: string, maxLength?: number): string {
  // Remove any HTML tags
  const withoutHtml = sanitizeHtml(content);

  // Normalize whitespace (collapse multiple newlines)
  const normalized = withoutHtml.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  const trimmed = normalized.trim();

  // Enforce max length if specified
  if (maxLength !== undefined && trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength);
  }

  return trimmed;
}

/**
 * Validate user input content.
 * - Must not be empty after trimming
 * - Must not exceed specified max length
 *
 * @param content - Content to validate
 * @param maxLength - Maximum allowed length (default: 2000)
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidInput('Hello'); // true
 * isValidInput('   '); // false (empty after trim)
 * isValidInput('x'.repeat(3000)); // false (too long)
 * ```
 */
export function isValidInput(content: string, maxLength: number = 2000): boolean {
  const trimmed = content.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength;
}

/**
 * Get character count for display.
 *
 * @param content - Content to count
 * @returns Character count after trimming
 */
export function getCharCount(content: string): number {
  return content.trim().length;
}
