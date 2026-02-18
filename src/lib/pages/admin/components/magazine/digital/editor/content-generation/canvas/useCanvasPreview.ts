'use client';

/**
 * useCanvasPreview - React hook for canvas preview generation
 *
 * Provides state management and a simple interface for generating
 * canvas previews. Uses CanvasCreator for the actual generation logic.
 */

import { useState, useCallback } from 'react';
import type {
  DigitalPageData,
  DigitalPageType,
  PagePdfSettings,
} from '../../types';
import { generateCanvasPreview } from './CanvasCreator';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result from canvas preview generation
 */
export interface CanvasPreviewResult {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Options for preview generation
 */
export interface GeneratePreviewOptions {
  pageNumber?: number;
  totalPages?: number;
}

/**
 * Return type for useCanvasPreview hook
 */
export interface UseCanvasPreviewReturn {
  canvasDataUrl: string | null;
  canvasWidth: number;
  canvasHeight: number;
  isGenerating: boolean;
  progress: string;
  error: string | null;
  generatePreview: (
    pageData: Partial<DigitalPageData>,
    pageType: DigitalPageType,
    pdfSettings: PagePdfSettings,
    options?: GeneratePreviewOptions
  ) => Promise<CanvasPreviewResult | null>;
  clearPreview: () => void;
  setPreviewFromUrl: (url: string | undefined, width?: number, height?: number) => void;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useCanvasPreview(): UseCanvasPreviewReturn {
  // Canvas state
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate a preview canvas from page data
   */
  const generatePreview = useCallback(async (
    pageData: Partial<DigitalPageData>,
    pageType: DigitalPageType,
    pdfSettings: PagePdfSettings,
    options?: GeneratePreviewOptions
  ): Promise<CanvasPreviewResult | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCanvasPreview(
        pageData,
        pageType,
        pdfSettings,
        options,
        setProgress
      );

      setCanvasDataUrl(result.dataUrl);
      setCanvasWidth(result.width);
      setCanvasHeight(result.height);
      setProgress('Complete!');
      setIsGenerating(false);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Preview generation error:', err);
      setError(errorMessage);
      setIsGenerating(false);
      setProgress('');
      return null;
    }
  }, []);

  /**
   * Clear the current preview
   */
  const clearPreview = useCallback(() => {
    setCanvasDataUrl(null);
    setCanvasWidth(0);
    setCanvasHeight(0);
    setError(null);
    setProgress('');
  }, []);

  /**
   * Set preview from a saved URL (e.g., from Firestore)
   */
  const setPreviewFromUrl = useCallback((
    url: string | undefined,
    width: number = 0,
    height: number = 0
  ) => {
    if (url) {
      setCanvasDataUrl(url);
      setCanvasWidth(width);
      setCanvasHeight(height);
      setError(null);
      setProgress('');
    } else {
      setCanvasDataUrl(null);
      setCanvasWidth(0);
      setCanvasHeight(0);
    }
  }, []);

  return {
    canvasDataUrl,
    canvasWidth,
    canvasHeight,
    isGenerating,
    progress,
    error,
    generatePreview,
    clearPreview,
    setPreviewFromUrl,
  };
}

export default useCanvasPreview;
