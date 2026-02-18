'use client';

/**
 * usePreviewState - Preview State Management Hook
 *
 * Provides state management for preview generation, including:
 * - Preview data URL
 * - Generation progress
 * - Error handling
 * - Loading state
 *
 * This hook is used as a building block for more complex preview hooks.
 */

import { useState, useCallback } from 'react';
import type { UsePreviewStateReturn } from '../types';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Manage preview state for canvas/PDF generation
 *
 * @returns State and setters for preview management
 *
 * @example
 * ```tsx
 * const {
 *   previewDataUrl,
 *   setPreviewDataUrl,
 *   isGenerating,
 *   setIsGenerating,
 *   progress,
 *   setProgress,
 *   error,
 *   setError,
 *   clearPreview,
 * } = usePreviewState();
 *
 * const handleGenerate = async () => {
 *   setIsGenerating(true);
 *   setError(null);
 *   setProgress('Starting...');
 *
 *   try {
 *     const dataUrl = await generatePreview();
 *     setPreviewDataUrl(dataUrl);
 *     setProgress('Complete!');
 *   } catch (err) {
 *     setError(err.message);
 *   } finally {
 *     setIsGenerating(false);
 *   }
 * };
 * ```
 */
export function usePreviewState(): UsePreviewStateReturn {
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Clear all preview state
   *
   * Resets data URL, progress, and error.
   * Does not reset isGenerating to allow clearing during generation.
   */
  const clearPreview = useCallback(() => {
    setPreviewDataUrl(null);
    setProgress('');
    setError(null);
  }, []);

  return {
    previewDataUrl,
    setPreviewDataUrl,
    isGenerating,
    setIsGenerating,
    progress,
    setProgress,
    error,
    setError,
    clearPreview,
  };
}

export default usePreviewState;
