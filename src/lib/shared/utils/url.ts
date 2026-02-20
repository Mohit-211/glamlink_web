/**
 * URL validation and parsing utilities.
 */

/**
 * List of allowed URL protocols.
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * Dangerous URL patterns to block.
 */
const DANGEROUS_PATTERNS = [
  /^javascript:/i,
  /^data:/i,
  /^vbscript:/i,
  /^file:/i,
];

/**
 * URL regex for detecting links in content.
 * Matches common URL patterns including www. prefixed URLs.
 */
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"{}|\\^`[\]]+/gi;

/**
 * Check if a URL is safe to use.
 *
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 *
 * @example
 * ```ts
 * isUrlSafe('https://example.com'); // true
 * isUrlSafe('javascript:alert(1)'); // false
 * ```
 */
export function isUrlSafe(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();

  // Check for dangerous patterns first
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return false;
    }
  }

  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    // If URL parsing fails, it could be a relative URL which is typically safe
    // But check it doesn't start with dangerous patterns
    return !trimmed.toLowerCase().startsWith('javascript:') &&
           !trimmed.toLowerCase().startsWith('data:') &&
           !trimmed.toLowerCase().startsWith('vbscript:');
  }
}

/**
 * Sanitize a URL for safe use in links.
 *
 * @param url - The URL to sanitize
 * @returns Sanitized URL or null if unsafe
 *
 * @example
 * ```ts
 * sanitizeUrl('https://example.com'); // 'https://example.com/'
 * sanitizeUrl('javascript:alert(1)'); // null
 * ```
 */
export function sanitizeUrl(url: string): string | null {
  if (!isUrlSafe(url)) {
    return null;
  }

  // Trim and encode potentially dangerous characters
  const trimmed = url.trim();

  // If it's a valid absolute URL, return as-is
  try {
    const parsed = new URL(trimmed);
    return parsed.href;
  } catch {
    // For relative URLs, encode special characters
    return encodeURI(trimmed);
  }
}

/**
 * Extract URLs from content.
 *
 * @param content - The content to search
 * @returns Array of safe URLs found in the content
 *
 * @example
 * ```ts
 * extractUrls('Check out https://example.com and www.test.com');
 * // ['https://example.com', 'www.test.com']
 * ```
 */
export function extractUrls(content: string): string[] {
  const matches = content.match(URL_REGEX) || [];
  return matches.filter(isUrlSafe);
}

/**
 * Content segment for parsed text with links.
 */
export interface ContentSegment {
  type: 'text' | 'link';
  content: string;
  href?: string;
}

/**
 * Parse text content and separate URLs into clickable link segments.
 *
 * @param content - The content to parse
 * @returns Array of text and link segments
 *
 * @example
 * ```tsx
 * const segments = parseTextWithLinks('Check https://example.com out');
 * // [
 * //   { type: 'text', content: 'Check ' },
 * //   { type: 'link', content: 'https://example.com', href: 'https://example.com/' },
 * //   { type: 'text', content: ' out' }
 * // ]
 *
 * // Render in React:
 * segments.map((seg, i) =>
 *   seg.type === 'link' ? (
 *     <a key={i} href={seg.href}>{seg.content}</a>
 *   ) : (
 *     <span key={i}>{seg.content}</span>
 *   )
 * )
 * ```
 */
export function parseTextWithLinks(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;

  const matches = content.matchAll(URL_REGEX);

  for (const match of matches) {
    const url = match[0];
    const startIndex = match.index!;

    // Add text before the URL
    if (startIndex > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, startIndex),
      });
    }

    // Add the URL as a link if it's safe
    const sanitizedUrl = sanitizeUrl(url.startsWith('www.') ? `https://${url}` : url);
    if (sanitizedUrl) {
      segments.push({
        type: 'link',
        content: url,
        href: sanitizedUrl,
      });
    } else {
      // If URL is not safe, treat as text
      segments.push({
        type: 'text',
        content: url,
      });
    }

    lastIndex = startIndex + url.length;
  }

  // Add remaining text after last URL
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return segments.length > 0 ? segments : [{ type: 'text', content }];
}
