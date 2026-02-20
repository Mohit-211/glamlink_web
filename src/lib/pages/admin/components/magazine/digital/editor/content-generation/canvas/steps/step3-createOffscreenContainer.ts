/**
 * Step 3: Create Offscreen Container
 *
 * Create an off-screen DOM container for rendering.
 * Container is positioned off-screen but rendered by the browser.
 */

import type { RenderDimensions } from './step2-calculateRenderDimensions';

/**
 * Create an off-screen DOM container for rendering
 * Container is positioned off-screen but rendered by the browser
 */
export function createOffscreenContainer(
  dimensions: RenderDimensions,
  backgroundColor: string
): HTMLDivElement {
  const container = document.createElement('div');

  // Position off-screen
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';

  // Set exact PDF dimensions
  container.style.width = `${dimensions.renderWidth}px`;
  container.style.height = `${dimensions.renderHeight}px`;

  // Styling
  container.style.backgroundColor = backgroundColor;
  container.style.overflow = 'hidden';
  container.style.padding = `${dimensions.marginPx}px`;
  container.style.boxSizing = 'border-box';
  container.className = 'pdf-export-mode';

  // Add to DOM
  document.body.appendChild(container);

  return container;
}
