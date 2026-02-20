/**
 * HTML Formatting Utilities
 * Migrated from magazine editor HTML extensions
 */

/**
 * Formats HTML for display by removing script tags and dangerous content
 */
export function formatHtmlForDisplay(html: string): string {
  if (!html) return '';
  
  // Remove script tags and their content
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous event handlers
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: links
  cleaned = cleaned.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  
  return cleaned.trim();
}

/**
 * Strips HTML tags from content, leaving only text
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
}

/**
 * Converts plain text to basic HTML with paragraph tags
 */
export function textToHtml(text: string): string {
  if (!text) return '';
  
  return text
    .split('\n\n') // Split by double line breaks
    .filter(paragraph => paragraph.trim()) // Remove empty paragraphs
    .map(paragraph => `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`) // Convert to HTML paragraphs
    .join('');
}

/**
 * Sanitizes HTML content for safe display
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // List of allowed tags
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div'
  ];
  
  // List of allowed attributes
  const allowedAttributes = ['href', 'title', 'alt', 'class'];
  
  let sanitized = html;
  
  // Remove all tags not in the allowed list
  sanitized = sanitized.replace(/<(\/?)\s*(\w+)[^>]*>/gi, (match, slash, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/(\w+)\s*=\s*["'][^"']*["']/gi, (match, attr) => {
    if (allowedAttributes.includes(attr.toLowerCase())) {
      return match;
    }
    return '';
  });
  
  return formatHtmlForDisplay(sanitized);
}

/**
 * Gets the text length of HTML content (excluding tags)
 */
export function getHtmlTextLength(html: string): number {
  return stripHtmlTags(html).length;
}

/**
 * Truncates HTML content while preserving tags
 */
export function truncateHtml(html: string, maxLength: number): string {
  const text = stripHtmlTags(html);
  if (text.length <= maxLength) return html;
  
  // Simple truncation - could be improved with proper HTML parsing
  const truncatedText = text.substring(0, maxLength);
  return textToHtml(truncatedText + '...');
}

/**
 * Extracts a preview from HTML content
 */
export function getHtmlPreview(html: string, maxLength: number = 100): string {
  const text = stripHtmlTags(html);
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}