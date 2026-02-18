'use client';

import { useState, useMemo, useRef, useCallback, RefObject } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardConfig } from '@/lib/features/digital-cards/types/condensedCardConfig';
import {
  DEFAULT_CONDENSED_CARD_CONFIG,
  mergeWithDefaultConfig,
  migrateCondensedCardConfig,
} from '@/lib/features/digital-cards/types/condensedCardConfig';
import {
  preprocessForImageExport,
  fixSmallGradientElements,
  createImageExportFilter,
  type PreprocessingProgress,
} from '@/lib/features/digital-cards/utils/imagePreprocessing';
import { fetchGoogleFontsCSS, injectFontStyles } from '@/lib/features/digital-cards/utils/fontEmbedding';

// html-to-image for image generation
import { toPng } from 'html-to-image';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Save the generated preview image as a downloadable PNG file
 */
export function saveGeneratedPreview(
  dataUrl: string,
  filename: string = 'digital-card-preview.png'
): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =============================================================================
// TYPES
// =============================================================================

// Re-export PreprocessingProgress from shared utility for convenience
export type { PreprocessingProgress } from '@/lib/features/digital-cards/utils/imagePreprocessing';

export interface UseCondensedCardPreviewReturn {
  // Refs
  previewRef: RefObject<HTMLDivElement | null>;

  // State
  previewImage: string | null;
  isGenerating: boolean;
  error: string | null;
  showPositionOverlay: boolean;
  setShowPositionOverlay: (show: boolean) => void;
  preprocessingStep: string;
  preprocessingProgress: PreprocessingProgress | null;

  // Computed values
  config: CondensedCardConfig;
  cardUrl: string;
  scaleFactor: number;

  // Actions
  handleClearPreview: () => void;
  handleGeneratePreview: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * useCondensedCardPreview - Hook for managing condensed card preview state and generation
 *
 * Features:
 * - Preview image generation with html2canvas
 * - Video preprocessing (extract frames)
 * - Map preprocessing (static screenshots)
 * - Firebase image proxy handling
 * - Progress tracking for multi-step generation
 */
export function useCondensedCardPreview(
  professional: Partial<Professional>
): UseCondensedCardPreviewReturn {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPositionOverlay, setShowPositionOverlay] = useState(false);

  // Phase 4: Enhanced preprocessing state
  const [preprocessingStep, setPreprocessingStep] = useState<string>('');
  const [preprocessingProgress, setPreprocessingProgress] = useState<PreprocessingProgress | null>(null);

  // Get config from professional or use defaults
  const config = useMemo<CondensedCardConfig>(() => {
    const rawConfig = (professional as any).condensedCardConfig;
    if (!rawConfig) return DEFAULT_CONDENSED_CARD_CONFIG;

    // Migrate if needed (handles old Record format)
    const migrated = migrateCondensedCardConfig(rawConfig);

    // Merge with defaults
    return mergeWithDefaultConfig(migrated);
  }, [professional]);

  // Generate card URL for preview
  const cardUrl = useMemo(() => {
    return `https://glamlink.net/for-professionals/${professional.id || 'preview'}`;
  }, [professional.id]);

  // Calculate scale factor for preview
  const scaleFactor = useMemo(() => {
    const containerWidth = 600; // Preview container width (increased for better visibility)
    return Math.min(1, containerWidth / config.dimensions.width); // Max scale of 1 (100%)
  }, [config.dimensions.width]);

  // Clear preview image
  const handleClearPreview = useCallback(() => {
    setPreviewImage(null);
    setError(null);
    setPreprocessingStep('');
    setPreprocessingProgress(null);
  }, []);

  // Generate preview image using html-to-image with embedded Google Fonts
  const handleGeneratePreview = useCallback(async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    setError(null);
    setPreprocessingStep('');
    setPreprocessingProgress(null);

    try {
      console.log('🚀 Starting preview generation with html-to-image');

      // ========================================================================
      // Pre-fetch Google Fonts CSS (cached for performance)
      // ========================================================================
      setPreprocessingStep('Loading fonts...');
      const fontCSS = await fetchGoogleFontsCSS();

      // ========================================================================
      // Use shared preprocessing pipeline
      // ========================================================================
      const { element } = await preprocessForImageExport(previewRef.current, {
        removeActionButtons: false, // Admin preview doesn't have action buttons to remove
        onProgress: (step, progress) => {
          setPreprocessingStep(step);
          if (progress) {
            setPreprocessingProgress(progress);
          }
        },
      });

      setPreprocessingProgress(null);

      // ========================================================================
      // Inject embedded fonts into cloned element
      // ========================================================================
      if (fontCSS) {
        injectFontStyles(element, fontCSS);
        console.log('✓ Google Fonts embedded into element');
      }

      // ========================================================================
      // Append to DOM temporarily for image capture
      // ========================================================================
      setPreprocessingStep('Generating final preview...');
      console.log('📸 Preparing element for capture');

      element.style.position = 'fixed';
      element.style.pointerEvents = 'none';
      // html-to-image: Must be on-screen and visible
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-1';
      document.body.appendChild(element);

      // Force a reflow to ensure styles are applied before capture
      void element.offsetHeight;

      // Fix small gradient elements (must be done after appending to DOM)
      fixSmallGradientElements(element);

      try {
        console.log('📸 Using html-to-image library');

        const dataUrl = await toPng(element, {
          width: config.dimensions.width,
          height: config.dimensions.height,
          backgroundColor: config.styles.backgroundColor,
          pixelRatio: 2,
          skipFonts: true, // We've already embedded fonts manually
          cacheBust: true,
          filter: createImageExportFilter(),
        });

        console.log('✓ html-to-image toPng completed, dataUrl length:', dataUrl?.length || 0);

        setPreviewImage(dataUrl);
        console.log('✓ Preview generation complete!');
      } finally {
        // Clean up
        document.body.removeChild(element);
      }
    } catch (err) {
      console.error('❌ Preview generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setIsGenerating(false);
      setPreprocessingStep('');
      setPreprocessingProgress(null);
    }
  }, [config]);

  return {
    // Refs
    previewRef,

    // State
    previewImage,
    isGenerating,
    error,
    showPositionOverlay,
    setShowPositionOverlay,
    preprocessingStep,
    preprocessingProgress,

    // Computed values
    config,
    cardUrl,
    scaleFactor,

    // Actions
    handleClearPreview,
    handleGeneratePreview,
  };
}
