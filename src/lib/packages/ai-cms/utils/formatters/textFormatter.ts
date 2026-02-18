/**
 * Text Formatting Utilities
 */

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts text to title case
 */
export function toTitleCase(text: string): string {
  if (!text) return '';
  
  const articles = ['a', 'an', 'the'];
  const prepositions = ['at', 'by', 'for', 'in', 'of', 'on', 'to', 'up', 'and', 'as', 'but', 'or', 'nor'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) return capitalize(word);
      if (articles.includes(word) || prepositions.includes(word)) return word;
      return capitalize(word);
    })
    .join(' ');
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If we can find a word boundary near the end, use it
  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + ellipsis;
  }
  
  return truncated + ellipsis;
}

/**
 * Extracts words from text (removes punctuation)
 */
export function extractWords(text: string): string[] {
  if (!text) return [];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Counts words in text
 */
export function countWords(text: string): number {
  return extractWords(text).length;
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Formats text for SEO-friendly URLs
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Removes extra whitespace and normalizes line breaks
 */
export function normalizeWhitespace(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\t/g, '  ') // Replace tabs with spaces
    .replace(/[ ]{2,}/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double line break
    .trim();
}

/**
 * Converts text to sentence case (first letter capitalized, rest lowercase)
 */
export function toSentenceCase(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split('. ')
    .map(sentence => capitalize(sentence.trim()))
    .join('. ');
}

/**
 * Wraps text at specified line length
 */
export function wrapText(text: string, lineLength: number = 80): string {
  if (!text) return '';
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length > lineLength && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  
  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim());
  }
  
  return lines.join('\n');
}

/**
 * Extracts initials from a name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxLength)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials;
}

/**
 * Formats a name for display (proper capitalization)
 */
export function formatName(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(part => {
      // Handle hyphenated names
      if (part.includes('-')) {
        return part.split('-').map(capitalize).join('-');
      }
      // Handle names with apostrophes
      if (part.includes("'")) {
        const parts = part.split("'");
        return parts.map((p, i) => i === 0 ? capitalize(p) : p.toLowerCase()).join("'");
      }
      return capitalize(part);
    })
    .join(' ');
}