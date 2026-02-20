'use client';

/**
 * Step 4: Render Preview to Container
 *
 * Render React preview component to the container.
 * Includes optional footer rendering.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import type {
  DigitalPageData,
  PagePdfSettings,
  FooterSettings,
} from '../../../types';
import { DEFAULT_FOOTER_SETTINGS } from '../../../types';
import { RENDER_WAIT_MS } from '../../shared';
import FooterPreview from '../FooterPreview';

// =============================================================================
// TYPES
// =============================================================================

/** Options for canvas generation */
export interface CanvasGenerationOptions {
  pageNumber?: number;
  totalPages?: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create the wrapper element with preview and optional footer
 */
function createWrapperElement(
  PreviewComponent: React.ComponentType<any>,
  pageData: Partial<DigitalPageData>,
  pdfSettings: PagePdfSettings,
  footerSettings: FooterSettings,
  pageNumber: number,
  totalPages?: number
) {
  return () => (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <PreviewComponent pageData={pageData} pdfSettings={pdfSettings} />
      {footerSettings.enabled && (
        <FooterPreview
          settings={footerSettings}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

// =============================================================================
// FUNCTION
// =============================================================================

/**
 * Render React preview component to the container
 * Returns the root for later cleanup
 */
export async function renderPreviewToContainer(
  container: HTMLDivElement,
  PreviewComponent: React.ComponentType<any>,
  pageData: Partial<DigitalPageData>,
  pdfSettings: PagePdfSettings,
  options: CanvasGenerationOptions = {}
): Promise<ReactDOM.Root> {
  const { pageNumber = 1, totalPages } = options;
  const footerSettings: FooterSettings = pdfSettings.footer || DEFAULT_FOOTER_SETTINGS;

  // Create React root and render
  const root = ReactDOM.createRoot(container);
  const WrapperElement = createWrapperElement(
    PreviewComponent,
    pageData,
    pdfSettings,
    footerSettings,
    pageNumber,
    totalPages
  );

  root.render(<WrapperElement />);

  // Wait for React to complete render
  await new Promise(resolve => setTimeout(resolve, RENDER_WAIT_MS));

  return root;
}
