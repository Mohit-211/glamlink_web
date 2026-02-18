'use client';

/**
 * useCanvasCapture - Canvas Capture Hook
 *
 * Provides canvas capture functionality combining preview state management
 * with the core canvas generation utilities.
 *
 * This hook handles:
 * - Creating off-screen containers
 * - Rendering React components
 * - Processing images (Firebase proxy, base64 conversion)
 * - Capturing with html2canvas
 * - Cleanup
 */

import { useCallback } from 'react';
import type {
  CanvasGenerationConfig,
  RenderDimensions,
  CanvasResult,
  ProgressCallback,
  UseCanvasCaptureReturn,
} from '../types';
import { usePreviewState } from './usePreviewState';
import {
  createOffscreenContainer,
  renderToContainer,
  captureContainer,
  cleanupContainer,
} from '../core';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Capture React components to canvas images
 *
 * Combines preview state management with canvas capture functionality.
 * Use this hook when you need to capture React components as images
 * for preview or PDF generation.
 *
 * @returns Canvas capture functions and preview state
 *
 * @example
 * ```tsx
 * const {
 *   previewDataUrl,
 *   isGenerating,
 *   progress,
 *   error,
 *   captureCanvas,
 *   clearPreview,
 * } = useCanvasCapture();
 *
 * const handleCapture = async () => {
 *   const result = await captureCanvas(
 *     {
 *       component: MyPreviewComponent,
 *       componentProps: { data: myData },
 *     },
 *     { width: 800, height: 600 },
 *     '#ffffff'
 *   );
 *
 *   if (result) {
 *     console.log('Captured:', result.width, 'x', result.height);
 *   }
 * };
 * ```
 */
export function useCanvasCapture(): UseCanvasCaptureReturn {
  const previewState = usePreviewState();

  const {
    setPreviewDataUrl,
    setIsGenerating,
    setProgress,
    setError,
  } = previewState;

  /**
   * Capture a React component to canvas
   *
   * @param config - Component configuration
   * @param dimensions - Width and height for capture
   * @param backgroundColor - Background color for canvas
   * @param onProgress - Optional external progress callback
   * @returns Canvas result with data URL and dimensions, or null on error
   */
  const captureCanvas = useCallback(
    async (
      config: CanvasGenerationConfig,
      dimensions: RenderDimensions,
      backgroundColor: string,
      onProgress?: ProgressCallback
    ): Promise<CanvasResult | null> => {
      setIsGenerating(true);
      setError(null);

      // Progress handler that updates both internal state and external callback
      const handleProgress = (message: string) => {
        setProgress(message);
        onProgress?.(message);
      };

      let container: HTMLDivElement | null = null;
      let root: any = null;

      try {
        // Step 1: Create off-screen container
        handleProgress('Creating container...');
        container = createOffscreenContainer(dimensions, backgroundColor);

        // Step 2: Render React component
        handleProgress('Rendering content...');
        root = await renderToContainer(container, config, handleProgress);

        // Step 3: Capture with html2canvas
        handleProgress('Capturing canvas...');
        const canvas = await captureContainer(
          container,
          dimensions,
          backgroundColor,
          handleProgress
        );

        // Step 4: Convert to data URL
        handleProgress('Processing...');
        const dataUrl = canvas.toDataURL('image/png');

        // Update state
        setPreviewDataUrl(dataUrl);
        handleProgress('Complete!');
        setIsGenerating(false);

        return {
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Canvas capture error:', err);
        setError(errorMessage);
        setIsGenerating(false);
        setProgress('');

        return null;
      } finally {
        // Step 5: Cleanup
        cleanupContainer({ container: container!, root });
      }
    },
    [setPreviewDataUrl, setIsGenerating, setProgress, setError]
  );

  return {
    ...previewState,
    captureCanvas,
  };
}

export default useCanvasCapture;
