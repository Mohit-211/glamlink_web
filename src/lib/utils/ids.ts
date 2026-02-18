/**
 * ID Generation Utilities
 *
 * Centralized functions for generating unique identifiers across the application.
 */

/**
 * Generates a prefixed unique ID
 * @param prefix - Short prefix like 'cust', 'addr', 'note'
 * @returns Prefixed UUID like 'cust_abc123...'
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 11);
  return `${prefix}_${timestamp}_${randomStr}`;
}

/**
 * Generates a simple unique ID without a prefix
 * @returns Unique ID string
 */
export function generateSimpleId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
