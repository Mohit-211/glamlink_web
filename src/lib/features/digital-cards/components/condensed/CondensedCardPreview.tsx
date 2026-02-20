'use client';

import React, { useCallback, useState, useMemo, useRef } from 'react';
import { Download, Save, Image as ImageIcon, Check } from 'lucide-react';
import type { ProfessionalPreviewComponentProps } from '@/lib/pages/admin/config/professionalPreviewComponents';
import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import { CondensedCardView } from '@/lib/features/digital-cards/components/export/CondensedCardView';
import { CondensedCardPositionOverlay } from '@/lib/features/digital-cards/components/export/CondensedCardPositionOverlay';
import { DraggablePositionOverlay } from '@/lib/features/digital-cards/components/export/DraggablePositionOverlay';
import { MoveModeOverlay } from '@/lib/features/digital-cards/components/export/MoveModeOverlay';

interface CondensedCardPreviewProps extends ProfessionalPreviewComponentProps {
  /** Optional live form data */
  externalConfig?: {
    sections: any[];
    dimensions: { width: number; height: number };
    styles: any;
  };
  editingSectionId?: string | null;
  editingPosition?: PositionConfig | null;
  onSavePosition?: (newPosition: PositionConfig) => void;
  onCancelEdit?: () => void;
  onPositionChange?: (newPosition: PositionConfig) => void;
  profileMode?: boolean;
  moveSectionsMode?: boolean;
  onMoveModePositionChange?: (sectionId: string, newPosition: PositionConfig) => void;
}

/** Color palette for section overlays in move mode */
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
  externalConfig,
  editingSectionId,
  editingPosition,
  onSavePosition,
  onCancelEdit,
  onPositionChange,
  profileMode = false,
  moveSectionsMode = false,
  onMoveModePositionChange,
}: CondensedCardPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPositionOverlay, setShowPositionOverlay] = useState(false);
  const [isSavingDefault, setIsSavingDefault] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Use externalConfig if provided, otherwise fallback to minimal defaults
  const config = useMemo(() => {
    if (externalConfig) return externalConfig;
    return {
      sections: [],
      dimensions: { width: 400, height: 600 },
      styles: {},
    };
  }, [externalConfig]);

  // Editing section and position
  const editingSection = editingSectionId
    ? config.sections.find(s => s.id === editingSectionId)
    : null;
  const displayPosition = editingPosition || editingSection?.position;

  // -------------------------------
  // Filename generator
  const generateFilename = useCallback((suffix: string = 'condensed-card') => {
    const safeName = (professional?.name || 'professional')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${safeName}-${suffix}.png`;
  }, [professional?.name]);

  // -------------------------------
  // Save image to client
  const handleSaveImage = useCallback(() => {
    if (!previewImage) return;
    const filename = generateFilename('condensed-card');
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [previewImage, generateFilename]);

  // -------------------------------
  // Set preview image as default for professional
  const handleSetDefaultImage = useCallback(async () => {
    if (!previewImage || !professional?.id) return;
    setIsSavingDefault(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const response = await fetch(`/api/admin/professionals/${professional.id}/default-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageDataUrl: previewImage }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save default image');
      }
      const result = await response.json();
      setSaveSuccess(true);
      if (professional) {
        professional.defaultCondensedCardImage = result.data.imageUrl;
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save default image');
    } finally {
      setIsSavingDefault(false);
    }
  }, [previewImage, professional]);

  // -------------------------------
  // Generate preview (dummy example using html2canvas or similar)
  const handleGeneratePreview = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      setIsGenerating(true);
      setError(null);

      // Replace this with html2canvas logic in your app
      // Example: const canvas = await html2canvas(previewRef.current);
      // setPreviewImage(canvas.toDataURL('image/png'));
      setTimeout(() => {
        setPreviewImage('https://via.placeholder.com/400x600.png?text=Preview'); // placeholder
        setIsGenerating(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      setIsGenerating(false);
    }
  }, []);

  const handleClearPreview = useCallback(() => setPreviewImage(null), []);

  const hasSavedDefaultImage = !!professional?.defaultCondensedCardImage;

  // -------------------------------
  return (
    <div className="space-y-4 p-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Condensed Card Preview</h3>
          <p className="text-xs text-gray-500">
            {config.dimensions.width} × {config.dimensions.height}px
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!previewImage ? (
            <>
              {/* Generate Preview Button */}
              <button
                onClick={handleGeneratePreview}
                disabled={isGenerating}
                className="px-3 py-1.5 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal/90 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Preview'}
              </button>

              {/* Download Saved Image (if exists) */}
              {hasSavedDefaultImage && (
                <a
                  href={professional!.defaultCondensedCardImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 inline-block mr-1" /> Download Saved Image
                </a>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleClearPreview}
                className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Back to Live Preview
              </button>

              <button
                onClick={handleSaveImage}
                className="px-3 py-1.5 text-sm bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal/90 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Save Image
              </button>

              <button
                onClick={handleSetDefaultImage}
                disabled={isSavingDefault}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${
                  saveSuccess ? 'bg-green-600 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'
                } disabled:opacity-50`}
              >
                {isSavingDefault ? 'Saving...' : saveSuccess ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Set Default Image</>}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-md p-2">{error}</div>}
      {saveError && <div className="text-sm text-red-600 bg-red-50 rounded-md p-2">{saveError}</div>}

      {/* Preview Container */}
      <div className="bg-gray-100 rounded-lg overflow-hidden flex justify-center p-4">
        {previewImage ? (
          <img src={previewImage} alt="Condensed Card Preview" className="max-w-full h-auto rounded-lg shadow-lg" />
        ) : (
          <div
            ref={previewRef}
            className="origin-top-left relative"
            style={{
              width: config.dimensions.width,
              height: config.dimensions.height,
              transform: 'scale(1)',
            }}
          >
            {/* <CondensedCardView professional={professional} config={config} /> */}

            {/* Position Overlay */}
            {/* {showPositionOverlay && !editingSectionId && (
              <CondensedCardPositionOverlay
                config={config}
                onSectionClick={(sectionId) => console.log('Section clicked:', sectionId)}
              />
            )} */}

            {/* Draggable single section */}
            {editingSectionId && displayPosition && onSavePosition && onCancelEdit && (
              <DraggablePositionOverlay
                sectionId={editingSectionId}
                position={displayPosition}
                zIndex={1000}
                cardDimensions={config.dimensions}
                scaleFactor={1}
                onSave={onSavePosition}
                onCancel={onCancelEdit}
                onPositionChange={onPositionChange}
              />
            )}

            {/* Move mode overlays */}
            {moveSectionsMode && config.sections.map((section, idx) => {
              const colors = SECTION_COLORS[idx % SECTION_COLORS.length];
              return (
                <MoveModeOverlay
                  key={section.id}
                  sectionId={section.id}
                  label={section.label}
                  position={section.position}
                  borderColor={colors.border}
                  bgColor={colors.bg}
                  zIndex={900 + idx}
                  cardDimensions={config.dimensions}
                  scaleFactor={1}
                  onPositionChange={onMoveModePositionChange}
                />
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Click "Generate Preview" to create an exportable image.
      </p>
    </div>
  );
}