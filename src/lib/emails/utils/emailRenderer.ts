import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

/**
 * Renders a React email component to static HTML string
 * @param Component - The React component to render
 * @param props - Props to pass to the component
 * @returns HTML string suitable for email
 */
export function renderEmailToHtml<P>(
  Component: React.ComponentType<P>,
  props: P
): string {
  // Render the component to static HTML
  const element = React.createElement(Component as React.ComponentType<any>, props);
  const rendered = renderToStaticMarkup(element);
  
  // Check if the component already includes the DOCTYPE (if it's wrapped in a div with dangerouslySetInnerHTML)
  if (rendered.includes('<!DOCTYPE')) {
    // Extract the HTML content from the div wrapper
    const match = rendered.match(/<div[^>]*>(.+)<\/div>$/s);
    return match ? match[1] : rendered;
  }
  
  // Otherwise add DOCTYPE for better email client compatibility
  const fullHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
${rendered}`;
  
  return fullHtml;
}

/**
 * Validates that the rendered HTML meets email requirements
 * @param html - The HTML string to validate
 * @returns Object with validation result and any warnings
 */
export function validateEmailHtml(html: string): {
  isValid: boolean;
  warnings: string[];
  sizeKB: number;
} {
  const warnings: string[] = [];
  
  // Check size (should be under 100KB for Gmail)
  const sizeKB = new Blob([html]).size / 1024;
  if (sizeKB > 100) {
    warnings.push(`Email size is ${sizeKB.toFixed(2)}KB. Gmail clips emails over 102KB.`);
  }
  
  // Check for problematic elements
  if (html.includes('<script')) {
    warnings.push('JavaScript is not supported in emails and should be removed.');
  }
  
  if (html.includes('<link') && !html.includes('<!--[if mso]>')) {
    warnings.push('External stylesheets are not supported. Use inline styles instead.');
  }
  
  if (html.includes('position:') && (html.includes('position:absolute') || html.includes('position:fixed'))) {
    warnings.push('Avoid using position:absolute or position:fixed in emails.');
  }
  
  if (!html.includes('alt=')) {
    warnings.push('All images should have alt text for accessibility.');
  }
  
  // Check for recommended elements
  if (!html.includes('width="600"') && !html.includes('max-width:600px')) {
    warnings.push('Consider using a max-width of 600px for better email client compatibility.');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    sizeKB
  };
}

/**
 * Minifies HTML for smaller email size
 * @param html - The HTML string to minify
 * @returns Minified HTML string
 */
export function minifyEmailHtml(html: string): string {
  return html
    // Remove comments (except MSO conditionals)
    .replace(/<!--(?!\[if).*?-->/gs, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Trim the result
    .trim();
}

/**
 * Injects custom tracking pixels or analytics code
 * @param html - The HTML string
 * @param trackingPixelUrl - Optional tracking pixel URL
 * @returns HTML with tracking injected
 */
export function injectTracking(html: string, trackingPixelUrl?: string): string {
  if (!trackingPixelUrl) return html;
  
  const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" border="0" alt="" style="display:block;width:1px;height:1px;border:0;" />`;
  
  // Insert before closing body tag
  return html.replace('</body>', `${trackingPixel}</body>`);
}