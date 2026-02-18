'use client';

/**
 * useCombinedPdf - Combined Multi-Page PDF Generation Hook
 *
 * Generates a combined PDF from multiple digital page canvases.
 * Each page's canvasDataUrl is loaded and added to a single PDF document.
 *
 * Features:
 * - Sorts pages by pageNumber
 * - Handles different page dimensions per page
 * - Progress tracking
 * - Error handling
 */

import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import type { DigitalPage, PagePdfSettings, PdfRatioType, TocEntry } from '@/lib/pages/admin/components/magazine/digital/editor/types';

// =============================================================================
// CONSTANTS
// =============================================================================

const IMAGE_PROXY_ENDPOINT = '/api/magazine/image-proxy';

// PDF dimensions in mm
const DIMENSIONS: Record<Exclude<PdfRatioType, 'custom'>, { width: number; height: number }> = {
  'a4-portrait': { width: 210, height: 297 },
  'a4-landscape': { width: 297, height: 210 },
  '16:9': { width: 297, height: 167 },
  '4:3': { width: 280, height: 210 },
  'square': { width: 210, height: 210 },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get PDF dimensions based on settings
 */
function getPdfDimensions(
  pdfSettings: PagePdfSettings
): { width: number; height: number } {
  if (pdfSettings.ratio === 'custom') {
    return {
      width: pdfSettings.customWidth || 210,
      height: pdfSettings.customHeight || 297,
    };
  }
  return DIMENSIONS[pdfSettings.ratio];
}

/**
 * Load image from URL or base64
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src.substring(0, 50)}...`));
    img.src = src;
  });
}

/**
 * Get proxied URL for Firebase images
 */
function getProxiedUrl(url: string): string {
  if (url.includes('firebasestorage.googleapis.com')) {
    return `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Add internal page links for Table of Contents entries
 * Calculates card positions based on 2-column grid layout with dynamic heights
 *
 * Card layout: Content area has FIXED height, image takes ALL remaining space.
 * Card heights are calculated dynamically based on number of entries.
 */
function addTocInternalLinks(
  pdf: jsPDF,
  page: DigitalPage,
  dims: { width: number; height: number },
  sortedPages: DigitalPage[]
): void {
  // Only process table-of-contents pages
  if (page.pageType !== 'table-of-contents') return;

  const tocEntries: TocEntry[] = page.pageData?.tocEntries || [];
  if (tocEntries.length === 0) {
    return;
  }

  // Layout measurements (converted from Tailwind classes to mm)
  // p-6 ≈ 24px ≈ 6.35mm at 96dpi
  const pagePadding = 6.35;
  // gap-4 ≈ 16px ≈ 4.23mm
  const gap = 4.23;
  // Fixed content height: p-2 padding + compact text layout (~18mm)
  const contentHeight = 18;
  // Minimum image height: min-h-[80px] ≈ 21.17mm
  const minImageHeight = 21.17;
  // Header title height when present: text-2xl + mb-6 ≈ 24px + 24px ≈ 48px ≈ 12.7mm
  const hasTitle = !!page.pageData?.tocTitle;
  const headerOffset = hasTitle ? 12.7 : 0;

  // Calculate card width (2 columns with gap)
  const availableWidth = dims.width - (pagePadding * 2) - gap;
  const cardWidth = availableWidth / 2;

  // Calculate dynamic card height based on number of entries
  const numEntries = tocEntries.length;
  const numRows = Math.ceil(numEntries / 2);

  // Calculate available height for grid
  const availableGridHeight = dims.height - (pagePadding * 2) - headerOffset;
  const totalGapHeight = (numRows - 1) * gap;

  // Calculate card height (divide available space by rows, with minimum)
  const cardHeight = Math.max(
    (availableGridHeight - totalGapHeight) / numRows,
    contentHeight + minImageHeight  // Minimum card height
  );

  // Add internal link for each entry
  tocEntries.forEach((entry, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);

    // Calculate position
    const x = pagePadding + (col * (cardWidth + gap));
    const y = pagePadding + headerOffset + (row * (cardHeight + gap));

    // CRITICAL FIX: Coerce entry.pageNumber to number for comparison
    // This handles cases where pageNumber might be stored as string
    const targetPageNumber = typeof entry.pageNumber === 'string'
      ? parseInt(entry.pageNumber, 10)
      : entry.pageNumber;

    // Validate the page number
    if (!targetPageNumber || isNaN(targetPageNumber)) {
      return;
    }

    // Find the PDF page index for this entry's target page
    // sortedPages contains all pages with canvas, find the one matching entry.pageNumber
    const targetPdfPageIndex = sortedPages.findIndex(
      (p) => p.pageNumber === targetPageNumber
    );

    if (targetPdfPageIndex !== -1) {
      // jsPDF page numbers are 1-indexed
      const targetPdfPage = targetPdfPageIndex + 1;

      // Add internal link to navigate to the target page
      // NOTE: jsPDF uses 'pageNumber' not 'page' for internal links
      pdf.link(x, y, cardWidth, cardHeight, { pageNumber: targetPdfPage });
    }
  });
}

// =============================================================================
// CUSTOM LAYOUT LINK HELPERS
// =============================================================================

interface DimensionValue {
  value: number;
  unit: 'px' | '%';
}

/**
 * Convert DimensionValue to mm based on total dimension
 */
function convertToMm(dim: DimensionValue | undefined, totalMm: number): number {
  if (!dim) return 0;
  if (dim.unit === '%') {
    return (dim.value / 100) * totalMm;
  }
  // px to mm (assuming 96 DPI: 1px = 0.264583mm)
  return dim.value * 0.264583;
}

/**
 * Add links for custom layout link objects
 * Scans page objects for link types and adds PDF annotations
 */
function addCustomLayoutLinks(
  pdf: jsPDF,
  page: DigitalPage,
  dims: { width: number; height: number },
  sortedPages: DigitalPage[]
): void {
  // Only process page-custom pages
  if (page.pageType !== 'page-custom') return;

  const objects = page.pageData?.objects || [];
  const linkObjects = objects.filter((obj: any) => obj.type === 'link');

  if (linkObjects.length === 0) return;

  linkObjects.forEach((linkObj: any) => {
    // Convert position to mm
    const x = convertToMm(linkObj.x, dims.width);
    const y = convertToMm(linkObj.y, dims.height);
    const width = convertToMm(linkObj.width, dims.width);
    const height = convertToMm(linkObj.height, dims.height);

    if (linkObj.linkType === 'external' && linkObj.externalUrl) {
      // External URL link
      pdf.link(x, y, width, height, { url: linkObj.externalUrl });
    } else if (linkObj.linkType === 'internal' && linkObj.targetPageNumber) {
      // Internal page link - find PDF page index
      const targetPdfPageIndex = sortedPages.findIndex(
        (p) => p.pageNumber === linkObj.targetPageNumber
      );

      if (targetPdfPageIndex !== -1) {
        const targetPdfPage = targetPdfPageIndex + 1; // 1-indexed for jsPDF
        // NOTE: jsPDF uses 'pageNumber' not 'page' for internal links
        pdf.link(x, y, width, height, { pageNumber: targetPdfPage });
      }
    }
  });
}

// =============================================================================
// HOOK INTERFACE
// =============================================================================

export interface UseCombinedPdfReturn {
  generateCombinedPdf: (pages: DigitalPage[], fileName: string) => Promise<void>;
  isGenerating: boolean;
  progress: string;
  error: string | null;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useCombinedPdf(): UseCombinedPdfReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateCombinedPdf = useCallback(
    async (pages: DigitalPage[], fileName: string): Promise<void> => {
      if (pages.length === 0) {
        setError('No pages to generate');
        return;
      }

      setIsGenerating(true);
      setError(null);
      setProgress('Preparing...');

      try {
        // 1. Sort pages by pageNumber
        const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);

        // 2. Filter pages with canvas
        const pagesWithCanvas = sortedPages.filter((p) => p.canvasDataUrl);

        if (pagesWithCanvas.length === 0) {
          throw new Error('No pages with generated canvas found');
        }

        setProgress(`Loading ${pagesWithCanvas.length} page(s)...`);

        // 3. Get dimensions from first page for initial PDF setup
        const firstPage = pagesWithCanvas[0];
        const firstDims = getPdfDimensions(firstPage.pdfSettings);
        const orientation = firstDims.width > firstDims.height ? 'landscape' : 'portrait';

        // 4. Create jsPDF instance
        const pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: [firstDims.width, firstDims.height],
        });

        // 5. Process each page
        for (let i = 0; i < pagesWithCanvas.length; i++) {
          const page = pagesWithCanvas[i];
          setProgress(`Processing page ${i + 1} of ${pagesWithCanvas.length}...`);

          // Get page dimensions
          const dims = getPdfDimensions(page.pdfSettings);

          // Add new page for subsequent pages
          if (i > 0) {
            pdf.addPage([dims.width, dims.height], dims.width > dims.height ? 'l' : 'p');
          }

          // Load canvas image
          let imageSrc = page.canvasDataUrl!;

          // If it's a Firebase URL, proxy it
          if (!imageSrc.startsWith('data:')) {
            imageSrc = getProxiedUrl(imageSrc);
          }

          try {
            const img = await loadImage(imageSrc);

            // Add image to PDF at full page dimensions
            pdf.addImage(
              img,
              'PNG',
              0,
              0,
              dims.width,
              dims.height,
              undefined,
              'FAST'
            );

            // Add clickable link for website URL if footer is enabled
            const footerSettings = page.pdfSettings.footer;
            if (footerSettings?.enabled && footerSettings?.showWebsiteUrl) {
              const marginBottomMm = footerSettings.marginBottom || 10;
              const fontSize = footerSettings.fontSize || 10;
              const linkText = 'glamlink.net';
              const linkUrl = 'https://glamlink.net';

              // Set font to calculate text width
              pdf.setFontSize(fontSize);
              const textWidth = pdf.getTextWidth(linkText);

              // Calculate link position based on alignment
              // Footer uses 6mm padding (px-6 at ~24px ≈ 6mm)
              const paddingMm = 6;
              const yPos = dims.height - marginBottomMm;

              let xPos: number;
              if (footerSettings.websiteUrlAlignment === 'left') {
                xPos = paddingMm;
              } else {
                xPos = dims.width - paddingMm - textWidth;
              }

              // Add clickable link annotation
              const linkHeight = fontSize * 0.4;
              pdf.link(xPos, yPos - linkHeight, textWidth, linkHeight * 1.5, { url: linkUrl });
            }

            // Add internal page links for Table of Contents entries
            addTocInternalLinks(pdf, page, dims, pagesWithCanvas);

            // Add custom layout link objects (external URLs and internal page links)
            addCustomLayoutLinks(pdf, page, dims, pagesWithCanvas);
          } catch (imgError) {
            console.warn(`Failed to load page ${page.pageNumber}:`, imgError);
            // Continue with other pages
          }
        }

        // 6. Save PDF
        setProgress('Saving PDF...');
        pdf.save(fileName);

        setProgress('Complete!');
        setIsGenerating(false);

        // Clear progress after a short delay
        setTimeout(() => setProgress(''), 2000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Combined PDF generation error:', err);
        setError(errorMessage);
        setIsGenerating(false);
        setProgress('');
      }
    },
    []
  );

  return {
    generateCombinedPdf,
    isGenerating,
    progress,
    error,
  };
}

export default useCombinedPdf;
