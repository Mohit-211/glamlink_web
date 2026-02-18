'use client';

/**
 * useCanvasEditor - Hook for Canvas Save Operations
 *
 * Handles saving canvas data to the API, including:
 * - Canvas image (data URL)
 * - Canvas dimensions
 * - PDF settings
 * - Page type and data
 */

import { useState, useCallback } from 'react';
import type { SavedCanvas, PagePdfSettings, DigitalPageData, DigitalPageType } from '../../types';

interface SaveCanvasParams {
  sectionId: string;
  issueId: string;
  name: string;
  description?: string;
  canvasDataUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  pdfSettings: PagePdfSettings;
  pageType: DigitalPageType;
  pageData: Partial<DigitalPageData>;
}

interface UseCanvasEditorReturn {
  isSaving: boolean;
  error: string | null;
  saveCanvas: (params: SaveCanvasParams) => Promise<SavedCanvas | null>;
  clearError: () => void;
}

export function useCanvasEditor(): UseCanvasEditorReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const saveCanvas = useCallback(async (params: SaveCanvasParams): Promise<SavedCanvas | null> => {
    setIsSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!params.name || params.name.trim() === '') {
        throw new Error('Canvas name is required');
      }

      if (!params.canvasDataUrl) {
        throw new Error('No canvas data to save. Generate a preview first.');
      }

      if (!params.sectionId) {
        throw new Error('Section ID is required');
      }

      if (!params.issueId) {
        throw new Error('Issue ID is required');
      }

      // Create canvas object
      const now = Date.now();
      const randomStr = Math.random().toString(36).substr(2, 9);
      const canvas: SavedCanvas = {
        id: 'canvas-' + now + '-' + randomStr,
        name: params.name.trim(),
        description: params.description?.trim() || undefined,
        canvasDataUrl: params.canvasDataUrl,
        canvasWidth: params.canvasWidth,
        canvasHeight: params.canvasHeight,
        pdfSettings: params.pdfSettings,
        pageType: params.pageType,
        pageData: params.pageData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to API
      const response = await fetch(
        '/api/magazine/sections/' + params.sectionId + '/canvas',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            issueId: params.issueId,
            canvas,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save canvas (' + response.status + ')');
      }

      const result = await response.json();
      setIsSaving(false);

      return result.canvas || canvas;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      setIsSaving(false);
      return null;
    }
  }, []);

  return {
    isSaving,
    error,
    saveCanvas,
    clearError,
  };
}
