'use client';

/**
 * Render to Container
 *
 * Renders a React component to an off-screen container for canvas capture.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import type { CanvasGenerationConfig, ProgressCallback } from '../types';
import { RENDER_WAIT_MS } from '../image-processing/constants';

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

/**
 * Create wrapper element with content and optional footer
 */
function createWrapperElement(config: CanvasGenerationConfig): React.FC {
  const {
    component: ContentComponent,
    componentProps,
    footerComponent: FooterComponent,
    footerProps,
  } = config;

  return function WrapperElement() {
    return React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        },
      },
      // Main content
      React.createElement(ContentComponent, componentProps),
      // Optional footer
      FooterComponent && React.createElement(FooterComponent, footerProps)
    );
  };
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

/**
 * Render React component to a container
 *
 * Creates a React root, renders the component with optional footer,
 * and waits for the render to complete.
 *
 * @param container - DOM element to render into
 * @param config - Configuration with component and props
 * @param onProgress - Optional progress callback
 * @returns The React root (for cleanup)
 */
export async function renderToContainer(
  container: HTMLDivElement,
  config: CanvasGenerationConfig,
  onProgress?: ProgressCallback
): Promise<ReactDOM.Root> {
  onProgress?.('Rendering content...');

  // Create React root
  const root = ReactDOM.createRoot(container);

  // Create and render wrapper
  const WrapperElement = createWrapperElement(config);
  root.render(React.createElement(WrapperElement));

  // Wait for React to complete render
  await new Promise(resolve => setTimeout(resolve, RENDER_WAIT_MS));

  return root;
}
