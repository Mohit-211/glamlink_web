'use client';

/**
 * CondensedCardPreview - Preview component for condensed card image export
 *
 * Features:
 * - Scaled preview of the condensed card
 * - Respects condensedCardConfig for dimensions and section visibility
 * - Generate preview button triggers html2canvas capture
 * - Shows generated preview image when available
 * - Download saved image (if professional has defaultCondensedCardImage)
 * - Set as default image (uploads generated preview to Firebase Storage)
 * - Drag-to-reposition and resize mode for sections
 */

import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { Download, Save, Image as ImageIcon, Check } from 'lucide-react';
import type { ProfessionalPreviewComponentProps } from '@/lib/pages/admin/config/professionalPreviewComponents';
import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import { CondensedCardView } from '@/lib/features/digital-cards/components/export/CondensedCardView';
import { CondensedCardPositionOverlay } from '@/lib/features/digital-cards/components/export/CondensedCardPositionOverlay';
import { DraggablePositionOverlay } from '@/lib/features/digital-cards/components/export/DraggablePositionOverlay';
import { MoveModeOverlay } from '@/lib/features/digital-cards/components/export/MoveModeOverlay';
import { useCondensedCardPreview } from './useCondensedCardPreview';
import { useAppSelector } from '@/store/hooks';
import { selectSections, selectDimensions, selectStyles, isContentSection } from '@/lib/features/digital-cards/store';

// =============================================================================
// TYPES
// =============================================================================

export interface CondensedCardPreviewProps extends ProfessionalPreviewComponentProps {
  /** Section ID currently in edit mode (for drag-to-reposition) */
  editingSectionId?: string | null;
  /** Current position during drag (for real-time preview) */
  editingPosition?: PositionConfig | null;
  /** Callback when position is saved */
  onSavePosition?: (newPosition: PositionConfig) => void;
  /** Callback when edit mode is cancelled */
  onCancelEdit?: () => void;
  /** Callback during drag for real-time position updates */
  onPositionChange?: (newPosition: PositionConfig) => void;
  /** Profile mode: simplified UI with only Generate Preview (html-to-image) and Add Digital Card Image */
  profileMode?: boolean;
  /** Move sections mode: shows draggable overlays for ALL content sections */
  moveSectionsMode?: boolean;
  /** Callback when a section position changes in move mode (for form state sync) */
  onMoveModePositionChange?: (sectionId: string, newPosition: PositionConfig) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

// Color palette for section overlays in move mode
const SECTION_COLORS = [
  { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },   // red
  { border: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },  // blue
  { border: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },  // green
  { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },  // amber
  { border: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },  // purple
  { border: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)' },  // pink
  { border: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)' },   // cyan
  { border: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' },  // orange
];

export default function CondensedCardPreview({
  professional,
  onProfessionalUpdate,
  editingSectionId,
  editingPosition,
  onSavePosition,
  onCancelEdit,
  onPositionChange,
  profileMode = false,
  moveSectionsMode = false,
  onMoveModePositionChange,
}: CondensedCardPreviewProps) {
  // READ FROM REDUX - sections, dimensions, styles as source of truth for live updates
  const reduxSections = useAppSelector(selectSections);
  const reduxDimensions = useAppSelector(selectDimensions);
  const reduxStyles = useAppSelector(selectStyles);

  const {
    previewRef,
    previewImage,
    isGenerating,
    error,
    showPositionOverlay,
    setShowPositionOverlay,
    preprocessingStep,
    preprocessingProgress,
    config: hookConfig,
    cardUrl,
    scaleFactor,
    handleClearPreview,
    handleGeneratePreview,
  } = useCondensedCardPreview(professional);

  // Merge Redux state with hook config (Redux takes precedence for live updates)
  const config = useMemo(() => {
    if (reduxSections.length > 0) {
      return {
        sections: reduxSections,
        dimensions: reduxDimensions,
        styles: reduxStyles,
      };
    }
    return hookConfig;
  }, [hookConfig, reduxSections, reduxDimensions, reduxStyles]);

  // State for saving default image
  const [isSavingDefault, setIsSavingDefault] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Find the editing section if in edit mode
  const editingSection = editingSectionId
    ? config.sections.find(s => s.id === editingSectionId)
    : null;

  // Use editing position if available, otherwise use the section's current position
  const displayPosition = editingPosition || editingSection?.position;

  // Debug: Log when in edit mode
  if (editingSectionId) {
    console.log('[CondensedCardPreview] Edit mode active:', {
      editingSectionId,
      editingPosition,
      editingSection,
      displayPosition,
      onSavePosition: !!onSavePosition,
      onCancelEdit: !!onCancelEdit,
    });
  }

  /**
   * Generate filename from professional name
   */
  const generateFilename = useCallback((suffix: string = 'condensed-card') => {
    const safeName = (professional?.name || 'professional')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${safeName}-${suffix}.png`;
  }, [professional?.name]);

  /**
   * Save the generated preview image as a downloadable PNG file
   */
  const handleSaveImage = useCallback(() => {
    if (!previewImage) return;
    const filename = generateFilename('condensed-card');

    // Create and trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = previewImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [previewImage, generateFilename]);

  /**
   * Download the pre-saved default image using server-side proxy
   * (Firebase Storage URLs have CORS restrictions, so we use a proxy)
   */
  const handleDownloadSavedImage = useCallback(() => {
    const savedImageUrl = professional?.defaultCondensedCardImage;
    if (!savedImageUrl) return;

    const filename = generateFilename('saved-card');

    // Use server-side proxy to bypass CORS restrictions
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(savedImageUrl)}&filename=${encodeURIComponent(filename)}`;

    // Create and trigger download
    const link = document.createElement('a');
    link.href = proxyUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [professional?.defaultCondensedCardImage, generateFilename]);

  /**
   * Set the current preview image as the default image for this professional
   * Uploads to Firebase Storage and updates the professional record
   */
  const handleSetDefaultImage = useCallback(async () => {
    if (!previewImage || !professional?.id) return;

    setIsSavingDefault(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/admin/professionals/${professional.id}/default-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          imageDataUrl: previewImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save default image');
      }

      const result = await response.json();
      console.log('Default image saved successfully:', result.data.imageUrl);

      setSaveSuccess(true);

      // Notify parent component of the update if callback provided
      if (onProfessionalUpdate) {
        onProfessionalUpdate({
          ...professional,
          defaultCondensedCardImage: result.data.imageUrl,
        });
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving default image:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save default image');
    } finally {
      setIsSavingDefault(false);
    }
  }, [previewImage, professional, onProfessionalUpdate]);

  // Check if professional has a saved default image
  const hasSavedDefaultImage = !!professional?.defaultCondensedCardImage;

  return (
    <div className="space-y-4 p-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            Condensed Card Preview
          </h3>
          <p className="text-xs text-gray-500">
            {config.dimensions.width} × {config.dimensions.height}px
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!previewImage ? (
            <>
              {/* Profile Mode: Show Generate Preview button (uses html-to-image) and Download Saved Image if available */}
              {profileMode ? (
                <>
                  <button
                    onClick={() => handleGeneratePreview()}
                    disabled={isGenerating}
                    className="px-3 py-1.5 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal/90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>
                          {preprocessingProgress
                            ? `${preprocessingStep} (${preprocessingProgress.current}/${preprocessingProgress.total})`
                            : preprocessingStep || 'Generating...'
                          }
                        </span>
                      </>
                    ) : (
                      'Generate Preview'
                    )}
                  </button>
                  {/* Download Saved Image button - only shows if professional has a saved default image */}
                  {hasSavedDefaultImage && (
                    <button
                      onClick={handleDownloadSavedImage}
                      className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                      title="Download the saved digital card image"
                    >
                      <Download className="w-4 h-4" />
                      Download Saved Image
                    </button>
                  )}
                </>
              ) : (
                /* Admin Mode: Show all buttons */
                <>
                  <button
                    onClick={() => setShowPositionOverlay(!showPositionOverlay)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      showPositionOverlay
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {showPositionOverlay ? 'Hide Positions' : 'Show Positions'}
                  </button>
                  <button
                    onClick={() => handleGeneratePreview()}
                    disabled={isGenerating}
                    className="px-3 py-1.5 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal/90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>
                          {preprocessingProgress
                            ? `${preprocessingStep} (${preprocessingProgress.current}/${preprocessingProgress.total})`
                            : preprocessingStep || 'Generating...'
                          }
                        </span>
                      </>
                    ) : (
                      'Generate Preview'
                    )}
                  </button>
                  {/* Download Saved Image button - only shows if professional has a saved default image */}
                  {hasSavedDefaultImage && (
                    <button
                      onClick={handleDownloadSavedImage}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                      title="Download the pre-saved default image"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Download Saved Img
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleClearPreview}
                className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Back to Live Preview
              </button>
              {profileMode ? (
                /* Profile Mode: Single "Add Digital Card Image" button */
                <button
                  onClick={handleSetDefaultImage}
                  disabled={isSavingDefault}
                  className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors ${
                    saveSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-glamlink-teal text-white hover:bg-glamlink-teal/90'
                  } disabled:opacity-50`}
                  title="Add this image to your digital card"
                >
                  {isSavingDefault ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      Add Digital Card Image
                    </>
                  )}
                </button>
              ) : (
                /* Admin Mode: Save Image and Set Default Image buttons */
                <>
                  <button
                    onClick={handleSaveImage}
                    className="px-3 py-1.5 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal/90 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Save Image
                  </button>
                  {/* Set Default Image button - saves the generated preview as the default */}
                  <button
                    onClick={handleSetDefaultImage}
                    disabled={isSavingDefault}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors ${
                      saveSuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    } disabled:opacity-50`}
                    title="Set this image as the default for this professional"
                  >
                    {isSavingDefault ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Set Default Image
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-md p-2">
          {error}
        </div>
      )}

      {saveError && (
        <div className="text-sm text-red-600 bg-red-50 rounded-md p-2">
          {saveError}
        </div>
      )}

      {/* Indicator for saved default image */}
      {hasSavedDefaultImage && !previewImage && (
        <div className="text-sm text-green-600 bg-green-50 rounded-md p-2 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {profileMode
            ? 'This professional has a saved default image.'
            : 'This professional has a saved default image. Click "Download Saved Img" to download it.'
          }
        </div>
      )}

      {/* Preview Container */}
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        {previewImage ? (
          /* Generated Preview Image */
          <div className="flex justify-center p-4">
            <img
              src={previewImage}
              alt="Condensed Card Preview"
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '500px' }}
            />
          </div>
        ) : (
          /* Live Preview (scaled) */
          <div
            className="overflow-auto flex justify-center items-start p-4"
            style={{ maxHeight: '800px' }}
          >
            <div
              className="origin-top-left"
              style={{
                transform: `scale(${scaleFactor})`,
                width: `${config.dimensions.width * scaleFactor}px`,
                height: `${config.dimensions.height * scaleFactor}px`,
              }}
            >
              {/* Actual size preview container for html2canvas */}
              <div
                className="relative"
                style={{
                  width: `${config.dimensions.width}px`,
                  height: `${config.dimensions.height}px`,
                }}
              >
                {/* Use CondensedCardView for dynamic rendering */}
                <CondensedCardView
                  ref={previewRef}
                  // @ts-expect-error - professional is Partial<Professional> for preview
                  professional={professional}
                  cardUrl={cardUrl}
                  config={config}
                />

                {/* Position Overlay (debug mode) */}
                {showPositionOverlay && !editingSectionId && (
                  <CondensedCardPositionOverlay
                    config={config}
                    onSectionClick={(sectionId) => {
                      console.log('Section clicked:', sectionId);
                      // Could scroll to section editor here
                    }}
                  />
                )}

                {/* Draggable Position Overlay (single section edit mode - admin only) */}
                {editingSectionId && displayPosition && onSavePosition && onCancelEdit && !moveSectionsMode && (
                  <DraggablePositionOverlay
                    sectionId={editingSectionId}
                    position={displayPosition}
                    zIndex={1000}
                    cardDimensions={{ width: config.dimensions.width, height: config.dimensions.height }}
                    scaleFactor={scaleFactor}
                    onSave={onSavePosition}
                    onCancel={onCancelEdit}
                    onPositionChange={onPositionChange}
                  />
                )}

                {/* Move Mode Overlays - draggable colored boxes for ALL content sections */}
                {moveSectionsMode && config.sections
                  .filter(section => isContentSection(section.sectionType) && section.visible !== false && section.position)
                  .map((section, index) => {
                    const colorIndex = index % SECTION_COLORS.length;
                    const colors = SECTION_COLORS[colorIndex];
                    return (
                      <MoveModeOverlay
                        key={section.id}
                        sectionId={section.id}
                        label={section.label}
                        position={section.position!}
                        borderColor={colors.border}
                        bgColor={colors.bg}
                        zIndex={900 + index}
                        cardDimensions={{ width: config.dimensions.width, height: config.dimensions.height }}
                        scaleFactor={scaleFactor}
                        onPositionChange={onMoveModePositionChange}
                      />
                    );
                  })
                }
            </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center">
        Click "Generate Preview" to create an exportable image. Configure dimensions and sections in the "Condensed Card" tab.
      </p>
    </div>
  );
}
