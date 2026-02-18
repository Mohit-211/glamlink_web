/**
 * Create Offscreen Container
 *
 * Creates an off-screen DOM container for rendering React components
 * before html2canvas capture.
 */

import type { RenderDimensions } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateOffscreenContainerOptions {
  /** CSS class to add to container */
  className?: string;
  /** Additional inline styles */
  additionalStyles?: Partial<CSSStyleDeclaration>;
}

// =============================================================================
// FUNCTION
// =============================================================================

/**
 * Create an off-screen DOM container for rendering
 *
 * Container is positioned off-screen but rendered by the browser,
 * allowing html2canvas to capture it.
 *
 * @param dimensions - Width, height, and optional margin in pixels
 * @param backgroundColor - Background color for the container
 * @param options - Additional container options
 * @returns The created container element
 */
export function createOffscreenContainer(
  dimensions: RenderDimensions,
  backgroundColor: string,
  options: CreateOffscreenContainerOptions = {}
): HTMLDivElement {
  const { className = 'pdf-export-mode', additionalStyles = {} } = options;

  const container = document.createElement('div');

  // Position off-screen (but still rendered)
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';

  // Set exact dimensions
  container.style.width = `${dimensions.width}px`;
  container.style.height = `${dimensions.height}px`;

  // Styling
  container.style.backgroundColor = backgroundColor;
  container.style.overflow = 'hidden';
  container.style.boxSizing = 'border-box';

  // Apply margin as padding if specified
  if (dimensions.marginPx) {
    container.style.padding = `${dimensions.marginPx}px`;
  }

  // Add class for PDF-specific styling
  if (className) {
    container.className = className;
  }

  // Apply any additional styles
  Object.entries(additionalStyles).forEach(([key, value]) => {
    if (value !== undefined) {
      (container.style as any)[key] = value;
    }
  });

  // Add to DOM
  document.body.appendChild(container);

  return container;
}
