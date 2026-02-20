/**
 * Content Helpers for Magazine Article Previews
 *
 * Utilities for manipulating HTML content in article layouts.
 */

/**
 * Split HTML content at a percentage position for quote/block insertion.
 * Used by TwoColumnWithQuotePreview and ArticleImageCenterWithQuotePreview
 * to position centered elements between content sections.
 *
 * @param content - HTML content string (typically with <p> tags)
 * @param position - Percentage (0-100) where to split content
 * @returns Tuple of [firstSection, secondSection] HTML strings
 *
 * @example
 * const [first, second] = splitContentAtPosition(articleHtml, 50);
 * // first = first half of paragraphs
 * // second = second half of paragraphs
 */
export function splitContentAtPosition(
  content: string,
  position: number
): [string, string] {
  if (!content) return ['', ''];

  // Match paragraph tags (including nested content)
  const paragraphRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
  const paragraphs = content.match(paragraphRegex) || [];

  // If only one paragraph or none, return as-is with empty second section
  if (paragraphs.length <= 1) {
    return [content, ''];
  }

  // Clamp position to valid range
  const clampedPosition = Math.max(0, Math.min(100, position));

  // Calculate split index (ensure at least 1 paragraph in each section)
  const total = paragraphs.length;
  const splitIndex = Math.max(
    1,
    Math.min(total - 1, Math.floor((clampedPosition / 100) * total))
  );

  // Split paragraphs into two sections
  const firstSection = paragraphs.slice(0, splitIndex).join('');
  const secondSection = paragraphs.slice(splitIndex).join('');

  return [firstSection, secondSection];
}

/**
 * Count the number of paragraphs in HTML content
 *
 * @param content - HTML content string
 * @returns Number of paragraph elements found
 */
export function countParagraphs(content: string): number {
  if (!content) return 0;
  const paragraphRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
  const matches = content.match(paragraphRegex);
  return matches ? matches.length : 0;
}

/**
 * Check if content has enough paragraphs to split
 *
 * @param content - HTML content string
 * @param minParagraphs - Minimum paragraphs needed (default: 2)
 * @returns True if content can be split
 */
export function canSplitContent(
  content: string,
  minParagraphs: number = 2
): boolean {
  return countParagraphs(content) >= minParagraphs;
}

/**
 * Split HTML content into two columns (left and right) by alternating paragraphs.
 * Used for side-by-side column layouts where text needs to wrap around a centered element.
 *
 * @param content - HTML content string (typically with <p> tags)
 * @returns Object with leftColumn and rightColumn paragraph arrays
 *
 * @example
 * const { leftColumn, rightColumn } = splitIntoTwoColumns(articleHtml);
 * // leftColumn = ['<p>Para 1</p>', '<p>Para 3</p>', ...]
 * // rightColumn = ['<p>Para 2</p>', '<p>Para 4</p>', ...]
 */
export function splitIntoTwoColumns(content: string): {
  leftColumn: string[];
  rightColumn: string[];
} {
  if (!content) return { leftColumn: [], rightColumn: [] };

  // Match paragraph tags (including nested content)
  const paragraphRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
  const paragraphs = content.match(paragraphRegex) || [];

  const leftColumn: string[] = [];
  const rightColumn: string[] = [];

  // Alternate paragraphs between columns
  paragraphs.forEach((p, i) => {
    if (i % 2 === 0) {
      leftColumn.push(p);
    } else {
      rightColumn.push(p);
    }
  });

  return { leftColumn, rightColumn };
}
