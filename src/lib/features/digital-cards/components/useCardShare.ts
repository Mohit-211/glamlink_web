'use client';

/**
 * useCardShare - Hook for sharing digital business cards
 *
 * Features:
 * - Copy card URL to clipboard
 * - Save card as image (uses UNIFIED useImageExport hook)
 * - Preview before download
 *
 * IMPORTANT: Image generation uses the same code as the admin
 * professionals page (condensed card preview) via useImageExport.
 */

import { useState, useCallback, useMemo, RefObject } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import { useImageExport } from '@/lib/features/digital-cards/components/export/useImageExport';
import { downloadImage } from '@/lib/features/digital-cards/utils/imagePreprocessing';
import {
  DEFAULT_CONDENSED_CARD_CONFIG,
  mergeWithDefaultConfig,
  migrateCondensedCardConfig,
} from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// TYPES
// =============================================================================

export type ImageExportMode = 'condensed' | 'full';

export interface UseCardShareProps {
  professional: Professional;
  cardRef?: RefObject<HTMLDivElement | null>;
  condensedRef?: RefObject<HTMLDivElement | null>;
}

export interface UseCardShareReturn {
  // Copy URL
  copyUrl: () => Promise<void>;
  isCopied: boolean;

  // Save as Image
  saveAsImage: (mode: ImageExportMode) => Promise<void>;
  isSaving: boolean;
  saveError: string | null;

  // Modal state for choosing image type
  showImageOptions: boolean;
  setShowImageOptions: (show: boolean) => void;

  // Preview before download
  previewImage: string | null;
  preprocessingStep: string;
  confirmDownload: (mode?: ImageExportMode) => void;
  clearPreview: () => void;
  isDownloading: boolean;

  // Pre-saved image indicator
  hasPreSavedImage: boolean;

  // Generated URL
  cardUrl: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COPY_SUCCESS_DURATION = 2000; // 2 seconds

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Copy text to clipboard with fallback for older browsers
 */
async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Generate the card URL for a professional
 * Uses cardUrl > id for the URL slug (NOT customHandle - that's a separate field)
 * URL format: /{slug} (not /for-professionals/{id})
 */
function generateCardUrl(professional: Professional): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const origin = window.location.origin;
  // Use cardUrl if available, otherwise fall back to id
  // NOTE: customHandle is a separate field and NOT used for URLs
  const slug = professional.cardUrl || professional.id;
  return `${origin}/${slug}`;
}

/**
 * Generate a safe filename for the image download
 */
function generateFilename(professional: Professional, mode: ImageExportMode): string {
  const safeName = professional.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const suffix = mode === 'condensed' ? 'card' : 'full';
  return `${safeName}-digital-${suffix}.png`;
}


// =============================================================================
// HOOK
// =============================================================================

export function useCardShare({
  professional,
  cardRef,
  condensedRef,
}: UseCardShareProps): UseCardShareReturn {
  // Copy URL state
  const [isCopied, setIsCopied] = useState(false);

  // Modal state
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Track last export mode for download
  const [lastExportMode, setLastExportMode] = useState<ImageExportMode>('full');

  // Generate card URL
  const cardUrl = generateCardUrl(professional);

  // Get condensed card config from professional - SAME as admin page
  const config = useMemo(() => {
    const rawConfig = (professional as any).condensedCardConfig;
    if (!rawConfig) return DEFAULT_CONDENSED_CARD_CONFIG;
    const migrated = migrateCondensedCardConfig(rawConfig);
    return mergeWithDefaultConfig(migrated);
  }, [professional]);

  // Loading state for pre-saved image fetch
  const [isLoadingPreSaved, setIsLoadingPreSaved] = useState(false);

  // Use the UNIFIED image export hook - SAME as admin page
  // Uses config.dimensions from professional (NOT hardcoded INSTAGRAM_PORTRAIT)
  const {
    generateImage,
    previewImage,
    isGenerating,
    error: saveError,
    preprocessingStep,
    clearPreview: clearPreviewInternal,
    setPreviewImage,
  } = useImageExport({
    dimensions: config.dimensions, // SAME dimensions as admin page
    backgroundColor: config.styles.backgroundColor,
    removeActionButtons: true,
  });

  // Combined loading state for UI (either generating or loading pre-saved)
  const isSaving = isGenerating || isLoadingPreSaved;

  /**
   * Copy the card URL to clipboard
   */
  const copyUrl = useCallback(async () => {
    try {
      const url = cardUrl || window.location.href;
      await copyToClipboard(url);
      setIsCopied(true);

      // Reset after duration
      setTimeout(() => {
        setIsCopied(false);
      }, COPY_SUCCESS_DURATION);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Still show success since most browsers will have copied it
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
    }
  }, [cardUrl]);

  /**
   * Save the card as an image using the UNIFIED useImageExport hook
   * This is THE SAME code used by the admin professionals page
   *
   * ALWAYS shows preview modal first, then user confirms download.
   * If a pre-saved default image exists for condensed mode, it will be
   * loaded into the preview (no generation needed).
   */
  const saveAsImage = useCallback(async (mode: ImageExportMode) => {
    setLastExportMode(mode);

    // Check for pre-saved image first (condensed mode only)
    // Show it in preview modal instead of direct download
    if (mode === 'condensed' && professional.defaultCondensedCardImage) {
      console.log('📸 Loading pre-saved condensed card image into preview');
      setIsLoadingPreSaved(true);

      // Fetch the image via proxy and convert to data URL for preview
      try {
        const proxyUrl = `/api/download-image?url=${encodeURIComponent(professional.defaultCondensedCardImage)}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();

        // Convert blob to data URL for preview
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        setPreviewImage(dataUrl);
        console.log('✅ Pre-saved image loaded into preview');
      } catch (error) {
        console.error('Failed to load pre-saved image:', error);
        // Fall back to generating a new image
        const targetRef = condensedRef;
        if (targetRef?.current) {
          await generateImage(targetRef);
        }
      } finally {
        setIsLoadingPreSaved(false);
      }

      setShowImageOptions(false);
      return;
    }

    const targetRef = mode === 'condensed' ? condensedRef : cardRef;

    if (!targetRef?.current) {
      console.error(`No ${mode} view element found`);
      return;
    }

    console.log('🚀 Starting card image export...');

    // Generate the image using the unified hook
    const dataUrl = await generateImage(targetRef);

    if (dataUrl) {
      // Close the image options modal after successful generation
      setShowImageOptions(false);
    }
  }, [cardRef, condensedRef, generateImage, professional, setPreviewImage]);

  // Download in progress state
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Confirm and download the preview image
   * NOTE: Modal stays open after download - user must manually close with X
   */
  const confirmDownload = useCallback(async (mode?: ImageExportMode) => {
    if (!previewImage) return;

    setIsDownloading(true);

    try {
      const exportMode = mode || lastExportMode;
      const filename = generateFilename(professional, exportMode);

      // Small delay to show loading state (download is synchronous)
      await new Promise(resolve => setTimeout(resolve, 500));

      downloadImage(previewImage, filename);

      // Keep loading state visible briefly after download starts
      await new Promise(resolve => setTimeout(resolve, 300));
      // Modal stays open - user can close with X button
    } finally {
      setIsDownloading(false);
    }
  }, [previewImage, professional, lastExportMode]);

  /**
   * Clear the preview without downloading
   */
  const clearPreview = useCallback(() => {
    clearPreviewInternal();
  }, [clearPreviewInternal]);

  // Compute if pre-saved image is available
  const hasPreSavedImage = !!professional.defaultCondensedCardImage;

  return {
    // Copy URL
    copyUrl,
    isCopied,

    // Save as Image
    saveAsImage,
    isSaving,
    saveError,

    // Modal state
    showImageOptions,
    setShowImageOptions,

    // Preview before download
    previewImage,
    preprocessingStep,
    confirmDownload,
    clearPreview,
    isDownloading,

    // Pre-saved image indicator
    hasPreSavedImage,

    // URL
    cardUrl,
  };
}

export default useCardShare;
