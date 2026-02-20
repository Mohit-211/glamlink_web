'use client';

/**
 * usePdfGeneration - Generic PDF Generation Hook
 *
 * Provides PDF generation from canvas data URLs using jsPDF.
 * This is a generic hook without feature-specific logic (like footers).
 * For feature-specific PDF generation, use this hook as a base and
 * add custom logic in the calling code.
 */

import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';

import type { PdfSettings, UsePdfGenerationReturn } from '../types';
import type { PdfGenerationResult, GeneratePdfOptions, PdfLinkConfig } from './types';
import { getPdfDimensions, getPdfOrientation } from './dimensions';
import { loadImage, fetchImageAsBase64 } from '../image-processing';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Prepare image data for PDF
 *
 * Handles both data URLs and Firebase Storage URLs
 */
async function prepareImageData(
  imageSource: string,
  setProgress: (msg: string) => void
): Promise<string> {
  if (imageSource.startsWith('data:')) {
    // Already a data URL, validate it can be loaded
    setProgress('Loading preview image...');
    await loadImage(imageSource);
    return imageSource;
  } else if (imageSource.startsWith('https://')) {
    // Firebase Storage or external URL - fetch and convert to base64
    setProgress('Loading image from storage...');
    return fetchImageAsBase64(imageSource);
  } else {
    throw new Error('Invalid image format. Expected data URL or HTTPS URL.');
  }
}

/**
 * Add clickable links to PDF
 */
function addLinksToPage(pdf: jsPDF, links: PdfLinkConfig[]): void {
  links.forEach(link => {
    const fontSize = link.fontSize || 10;
    pdf.setFontSize(fontSize);
    const textWidth = pdf.getTextWidth(link.text);
    const linkHeight = fontSize * 0.4; // Approximate mm height for font

    pdf.link(
      link.x,
      link.y - linkHeight,
      textWidth,
      linkHeight * 1.5,
      { url: link.url }
    );
  });
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Generic PDF generation hook
 *
 * @returns PDF generation functions and state
 *
 * @example
 * ```tsx
 * const { generatePdf, isGenerating, progress, error } = usePdfGeneration();
 *
 * const handleDownload = async () => {
 *   await generatePdf(canvasDataUrl, 'my-document.pdf', {
 *     ratio: 'a4-portrait',
 *     backgroundColor: '#ffffff',
 *   });
 * };
 * ```
 */
export function usePdfGeneration(): UsePdfGenerationReturn & {
  generatePdfWithLinks: (
    canvasDataUrl: string,
    fileName: string,
    settings: PdfSettings,
    options?: GeneratePdfOptions
  ) => Promise<PdfGenerationResult>;
} {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate a simple PDF without links
   */
  const generatePdf = useCallback(
    async (
      canvasDataUrl: string,
      fileName: string,
      settings: PdfSettings
    ): Promise<void> => {
      setIsGenerating(true);
      setError(null);
      setProgress('Preparing PDF...');

      try {
        // Validate input
        if (!canvasDataUrl) {
          throw new Error('No canvas image provided. Generate a preview first.');
        }

        // Prepare image data
        const imageData = await prepareImageData(canvasDataUrl, setProgress);

        // Get PDF dimensions in mm
        const dimensions = getPdfDimensions(settings);
        const { width: pdfWidthMm, height: pdfHeightMm } = dimensions;

        setProgress('Creating PDF...');

        // Create PDF with correct dimensions
        const orientation = getPdfOrientation(settings);
        const pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: [pdfWidthMm, pdfHeightMm],
        });

        // Add canvas image to PDF at full size
        pdf.addImage(
          imageData,
          'PNG',
          0,              // x position
          0,              // y position
          pdfWidthMm,     // width (full page width)
          pdfHeightMm     // height (full page height)
        );

        setProgress('Saving PDF...');

        // Save PDF
        const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        pdf.save(finalFileName);

        setProgress('Complete!');
        setIsGenerating(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('PDF generation error:', err);
        setError(errorMessage);
        setIsGenerating(false);
        setProgress('');
      }
    },
    []
  );

  /**
   * Generate PDF with optional clickable links
   *
   * Use this for more advanced PDF generation with link annotations.
   */
  const generatePdfWithLinks = useCallback(
    async (
      canvasDataUrl: string,
      fileName: string,
      settings: PdfSettings,
      options: GeneratePdfOptions = {}
    ): Promise<PdfGenerationResult> => {
      setIsGenerating(true);
      setError(null);
      setProgress('Preparing PDF...');

      try {
        // Validate input
        if (!canvasDataUrl) {
          throw new Error('No canvas image provided. Generate a preview first.');
        }

        // Prepare image data
        const imageData = await prepareImageData(canvasDataUrl, setProgress);

        // Get PDF dimensions in mm
        const dimensions = getPdfDimensions(settings);
        const { width: pdfWidthMm, height: pdfHeightMm } = dimensions;

        setProgress('Creating PDF...');

        // Create PDF with correct dimensions
        const orientation = getPdfOrientation(settings);
        const pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: [pdfWidthMm, pdfHeightMm],
        });

        // Add canvas image to PDF at full size
        pdf.addImage(
          imageData,
          'PNG',
          0,
          0,
          pdfWidthMm,
          pdfHeightMm
        );

        // Add clickable links if provided
        if (options.links && options.links.length > 0) {
          addLinksToPage(pdf, options.links);
        }

        setProgress('Saving PDF...');

        // Save PDF
        const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        pdf.save(finalFileName);

        setProgress('Complete!');
        setIsGenerating(false);

        return {
          success: true,
          fileName: finalFileName,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('PDF generation error:', err);
        setError(errorMessage);
        setIsGenerating(false);
        setProgress('');

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  return {
    generatePdf,
    generatePdfWithLinks,
    isGenerating,
    progress,
    error,
  };
}

export default usePdfGeneration;
