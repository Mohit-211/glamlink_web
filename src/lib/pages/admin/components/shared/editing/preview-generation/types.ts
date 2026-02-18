/**
 * Shared Preview Generation Types
 *
 * Generic types for canvas/PDF generation that can be used across
 * different preview features (magazine, condensed card, etc.)
 */

import type React from 'react';

// =============================================================================
// CANVAS GENERATION TYPES
// =============================================================================

/**
 * Configuration for canvas generation
 */
export interface CanvasGenerationConfig {
  /** React component to render */
  component: React.ComponentType<any>;
  /** Props to pass to component */
  componentProps: Record<string, any>;
  /** Optional footer component */
  footerComponent?: React.ComponentType<any>;
  /** Footer props */
  footerProps?: Record<string, any>;
}

/**
 * Render dimensions in pixels
 */
export interface RenderDimensions {
  width: number;
  height: number;
  marginPx?: number;
}

/**
 * Canvas capture result
 */
export interface CanvasResult {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Progress callback type
 */
export type ProgressCallback = (message: string) => void;

// =============================================================================
// PDF TYPES
// =============================================================================

/**
 * PDF ratio presets
 */
export type PdfRatioType =
  | 'a4-portrait'
  | 'a4-landscape'
  | '16:9'
  | '4:3'
  | 'square'
  | 'custom';

/**
 * PDF settings (generic, no feature-specific fields)
 */
export interface PdfSettings {
  ratio: PdfRatioType;
  customWidth?: number;
  customHeight?: number;
  backgroundColor: string;
  margin?: number;
}

/**
 * PDF dimension result
 */
export interface PdfDimensions {
  width: number;   // in mm
  height: number;  // in mm
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Preview state hook return type
 */
export interface UsePreviewStateReturn {
  previewDataUrl: string | null;
  setPreviewDataUrl: (url: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  progress: string;
  setProgress: (progress: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearPreview: () => void;
}

/**
 * Canvas capture hook return type
 */
export interface UseCanvasCaptureReturn extends UsePreviewStateReturn {
  captureCanvas: (
    config: CanvasGenerationConfig,
    dimensions: RenderDimensions,
    backgroundColor: string,
    onProgress?: ProgressCallback
  ) => Promise<CanvasResult | null>;
}

/**
 * PDF generation hook return type
 */
export interface UsePdfGenerationReturn {
  generatePdf: (
    canvasDataUrl: string,
    fileName: string,
    settings: PdfSettings
  ) => Promise<void>;
  isGenerating: boolean;
  progress: string;
  error: string | null;
}

// =============================================================================
// CONTAINER TYPES
// =============================================================================

/**
 * Container context for cleanup
 */
export interface ContainerContext {
  container: HTMLDivElement;
  root: any; // ReactDOM.Root - using any to avoid import issues
}
