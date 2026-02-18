'use client';

/**
 * useImageExport - Unified hook for exporting card images
 *
 * This is THE ONLY image export logic. Both the digital card page
 * and admin professionals page use this same hook.
 *
 * Features:
 * - Preprocessing pipeline (maps, videos, images)
 * - html-to-image capture with toPng
 * - Progress tracking
 * - Preview image state management
 */

import { useState, useCallback, RefObject } from 'react';
import { toPng } from 'html-to-image';
import {
  preprocessForImageExport,
  fixSmallGradientElements,
  createImageExportFilter,
  downloadImage,
  type PreprocessingProgress,
} from '@/lib/features/digital-cards/utils/imagePreprocessing';

// =============================================================================
// TYPES
// =============================================================================

export interface ImageExportDimensions {
  width: number;
  height: number;
}

export interface UseImageExportOptions {
  /** Dimensions for the exported image */
  dimensions: ImageExportDimensions;
  /** Background color for the exported image */
  backgroundColor?: string;
  /** Whether to remove action buttons during export */
  removeActionButtons?: boolean;
}

export interface UseImageExportReturn {
  /** Generate preview image from the element */
  generateImage: (elementRef: RefObject<HTMLElement | null>) => Promise<string | null>;
  /** The generated preview image data URL */
  previewImage: string | null;
  /** Whether image generation is in progress */
  isGenerating: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Current preprocessing step description */
  preprocessingStep: string;
  /** Progress tracking for multi-step preprocessing */
  preprocessingProgress: PreprocessingProgress | null;
  /** Clear the preview image */
  clearPreview: () => void;
  /** Download the current preview image */
  downloadPreview: (filename: string) => void;
  /** Set preview image directly (for external use) */
  setPreviewImage: (dataUrl: string | null) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useImageExport(options: UseImageExportOptions): UseImageExportReturn {
  const { dimensions, backgroundColor = '#f9fafb', removeActionButtons = true } = options;

  // State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preprocessingStep, setPreprocessingStep] = useState<string>('');
  const [preprocessingProgress, setPreprocessingProgress] = useState<PreprocessingProgress | null>(null);

  /**
   * Clear the preview image
   */
  const clearPreview = useCallback(() => {
    setPreviewImage(null);
    setError(null);
    setPreprocessingStep('');
    setPreprocessingProgress(null);
  }, []);

  /**
   * Download the preview image
   */
  const downloadPreview = useCallback((filename: string) => {
    if (!previewImage) return;
    downloadImage(previewImage, filename);
  }, [previewImage]);

  /**
   * Generate preview image from the element
   * This is the CORE export logic - used by both pages
   */
  const generateImage = useCallback(async (
    elementRef: RefObject<HTMLElement | null>
  ): Promise<string | null> => {
    if (!elementRef.current) {
      setError('No element to capture');
      return null;
    }

    setIsGenerating(true);
    setError(null);
    setPreprocessingStep('');
    setPreprocessingProgress(null);

    try {
      console.log('🚀 Starting image export...');

      // ========================================================================
      // Use shared preprocessing pipeline
      // ========================================================================
      const { element } = await preprocessForImageExport(elementRef.current, {
        removeActionButtons,
        onProgress: (step, progress) => {
          setPreprocessingStep(step);
          if (progress) {
            setPreprocessingProgress(progress);
          }
        },
      });

      setPreprocessingProgress(null);

      // ========================================================================
      // Append to DOM temporarily for image capture
      // ========================================================================
      setPreprocessingStep('Generating final preview...');
      console.log('📸 Preparing element for capture');

      // Position element on-screen but hidden for html-to-image
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-1';
      element.style.pointerEvents = 'none';
      document.body.appendChild(element);

      // Force a reflow to ensure styles are applied before capture
      void element.offsetHeight;

      // Fix small gradient elements (must be done after appending to DOM)
      fixSmallGradientElements(element);

      try {
        // ===================================================================
        // html-to-image capture
        // ===================================================================
        console.log('📸 Using html-to-image library');
        console.log(`📐 Dimensions: ${dimensions.width}x${dimensions.height}`);

        const dataUrl = await toPng(element, {
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor,
          pixelRatio: 2,
          skipFonts: false,
          cacheBust: true,
          filter: createImageExportFilter(),
        });

        console.log('✅ Image captured successfully!');
        console.log('✓ toPng completed, dataUrl length:', dataUrl?.length || 0);

        setPreviewImage(dataUrl);
        return dataUrl;
      } finally {
        // Clean up - remove from DOM
        document.body.removeChild(element);
      }
    } catch (err) {
      console.error('❌ Image export failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
      setPreprocessingStep('');
      setPreprocessingProgress(null);
    }
  }, [dimensions, backgroundColor, removeActionButtons]);

  return {
    generateImage,
    previewImage,
    isGenerating,
    error,
    preprocessingStep,
    preprocessingProgress,
    clearPreview,
    downloadPreview,
    setPreviewImage,
  };
}

export default useImageExport;
