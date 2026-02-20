/**
 * HTML Content Processing Helpers
 *
 * Utilities for processing HTML content to ensure proper rendering
 * in both browser and html2canvas contexts.
 *
 * When html2canvas captures content, it may not inherit global CSS styles.
 * These utilities add inline styles to HTML elements to ensure consistent
 * rendering across different contexts.
 */

/**
 * Add inline paragraph spacing to HTML content
 *
 * This ensures spacing is preserved when html2canvas captures the content.
 * The function adds `margin-bottom: 1em` to all <p> tags while preserving
 * any existing inline styles.
 *
 * @param html - HTML string with paragraph tags
 * @returns HTML string with inline paragraph margins
 *
 * @example
 * // Input:
 * "<p>First paragraph.</p><p>Second paragraph.</p>"
 *
 * // Output:
 * "<p style=\"margin-bottom: 1em;\">First paragraph.</p>
 *  <p style=\"margin-bottom: 1em;\">Second paragraph.</p>"
 *
 * @example
 * // With existing styles:
 * "<p style=\"color: red;\">Paragraph</p>"
 *
 * // Output:
 * "<p style=\"color: red; margin-bottom: 1em;\">Paragraph</p>"
 */
export function addParagraphSpacing(html: string): string {
  if (!html) return '';

  const PARAGRAPH_MARGIN = '1em';

  // Process <p> tags to add inline margin-bottom
  let processed = html.replace(
    /<p(\s[^>]*)?>/gi,
    (match, attributes) => {
      const attrs = attributes || '';

      // Check if style attribute already exists
      if (attrs.includes('style=')) {
        // Add margin to existing style
        return match.replace(
          /style="([^"]*)"/,
          (styleMatch, existingStyles) => {
            const styles = existingStyles.trim();
            const separator = styles.endsWith(';') ? '' : ';';
            return `style="${styles}${separator} margin-bottom: ${PARAGRAPH_MARGIN};"`;
          }
        );
      } else {
        // Add new style attribute
        return `<p${attrs} style="margin-bottom: ${PARAGRAPH_MARGIN};">`;
      }
    }
  );

  return processed;
}

/**
 * Add inline spacing to heading tags
 *
 * Adds appropriate margins to h1-h6 tags for consistent spacing in canvas rendering.
 *
 * @param html - HTML string with heading tags
 * @returns HTML string with inline heading margins
 */
export function addHeadingSpacing(html: string): string {
  if (!html) return '';

  const HEADING_MARGINS: Record<string, string> = {
    h1: '1.5em 0 0.75em 0',
    h2: '1.25em 0 0.625em 0',
    h3: '1em 0 0.5em 0',
    h4: '0.875em 0 0.5em 0',
    h5: '0.75em 0 0.5em 0',
    h6: '0.625em 0 0.5em 0',
  };

  let processed = html;

  // Process each heading level
  Object.entries(HEADING_MARGINS).forEach(([tag, margin]) => {
    const regex = new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi');

    processed = processed.replace(regex, (match, attributes) => {
      const attrs = attributes || '';

      // Check if style attribute already exists
      if (attrs.includes('style=')) {
        // Add margin to existing style
        return match.replace(
          /style="([^"]*)"/,
          (styleMatch, existingStyles) => {
            const styles = existingStyles.trim();
            const separator = styles.endsWith(';') ? '' : ';';
            return `style="${styles}${separator} margin: ${margin};"`;
          }
        );
      } else {
        // Add new style attribute
        return `<${tag}${attrs} style="margin: ${margin};">`;
      }
    });
  });

  return processed;
}

/**
 * Add inline spacing to list items
 *
 * Adds margins to ul/ol and li elements for proper spacing in canvas rendering.
 *
 * @param html - HTML string with list elements
 * @returns HTML string with inline list spacing
 */
export function addListSpacing(html: string): string {
  if (!html) return '';

  const LIST_CONTAINER_MARGIN = '1em 0';
  const LIST_ITEM_MARGIN = '0.5em 0';

  let processed = html;

  // Process ul and ol tags
  ['ul', 'ol'].forEach((tag) => {
    const regex = new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi');

    processed = processed.replace(regex, (match, attributes) => {
      const attrs = attributes || '';

      if (attrs.includes('style=')) {
        return match.replace(
          /style="([^"]*)"/,
          (styleMatch, existingStyles) => {
            const styles = existingStyles.trim();
            const separator = styles.endsWith(';') ? '' : ';';
            return `style="${styles}${separator} margin: ${LIST_CONTAINER_MARGIN};"`;
          }
        );
      } else {
        return `<${tag}${attrs} style="margin: ${LIST_CONTAINER_MARGIN};">`;
      }
    });
  });

  // Process li tags
  processed = processed.replace(
    /<li(\s[^>]*)?>/gi,
    (match, attributes) => {
      const attrs = attributes || '';

      if (attrs.includes('style=')) {
        return match.replace(
          /style="([^"]*)"/,
          (styleMatch, existingStyles) => {
            const styles = existingStyles.trim();
            const separator = styles.endsWith(';') ? '' : ';';
            return `style="${styles}${separator} margin: ${LIST_ITEM_MARGIN};"`;
          }
        );
      } else {
        return `<li${attrs} style="margin: ${LIST_ITEM_MARGIN};">`;
      }
    }
  );

  return processed;
}

/**
 * Ensure HTML content has proper structure for canvas rendering
 *
 * Main function that applies all spacing enhancements to HTML content.
 * Call this function before rendering HTML with dangerouslySetInnerHTML
 * when the content will be captured by html2canvas.
 *
 * @param html - Raw HTML content string
 * @returns Processed HTML with inline spacing styles
 *
 * @example
 * // In a React component:
 * <div
 *   dangerouslySetInnerHTML={{
 *     __html: processHtmlForCanvas(object.content)
 *   }}
 * />
 */
export function processHtmlForCanvas(html: string): string {
  if (!html) return '';

  // Apply all spacing enhancements
  let processed = html;
  processed = addParagraphSpacing(processed);
  processed = addHeadingSpacing(processed);
  processed = addListSpacing(processed);

  return processed;
}
