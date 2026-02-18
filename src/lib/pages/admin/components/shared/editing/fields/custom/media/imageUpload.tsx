'use client';

import Image from 'next/image';
import ImageCropModal from './ImageCropModal';
import { useImageUpload } from './useImageUpload';
import type { PagePdfSettings } from '@/lib/pages/admin/components/magazine/digital/editor/types';
import type { DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';

// PDF dimensions in mm
const PDF_DIMENSIONS: Record<string, { width: number; height: number }> = {
  'a4-portrait': { width: 210, height: 297 },
  'a4-landscape': { width: 297, height: 210 },
  '16:9': { width: 297, height: 167 },
  '4:3': { width: 280, height: 210 },
  'square': { width: 210, height: 210 },
};

/**
 * Calculate aspect ratio for image crop based on object dimensions and PDF canvas
 *
 * @param objectDimensions - Object with width/height DimensionValue (px or %)
 * @param pdfSettings - PDF configuration
 * @returns Object with ratio and label, or null if cannot calculate
 */
function calculateCustomAspectRatio(
  objectDimensions: { width: DimensionValue; height: DimensionValue } | undefined,
  pdfSettings: PagePdfSettings | undefined
): { ratio: number; label: string } | null {
  if (!objectDimensions || !pdfSettings) return null;

  // Get canvas dimensions in mm
  let canvasWidthMm: number;
  let canvasHeightMm: number;

  if (pdfSettings.ratio === 'custom') {
    if (!pdfSettings.customWidth || !pdfSettings.customHeight) return null;
    canvasWidthMm = pdfSettings.customWidth;
    canvasHeightMm = pdfSettings.customHeight;
  } else {
    const dims = PDF_DIMENSIONS[pdfSettings.ratio];
    if (!dims) return null;
    canvasWidthMm = dims.width;
    canvasHeightMm = dims.height;
  }

  // Convert mm to pixels (96 DPI: 1mm = 3.7795px)
  const MM_TO_PX = 3.7795;
  const canvasWidthPx = canvasWidthMm * MM_TO_PX;
  const canvasHeightPx = canvasHeightMm * MM_TO_PX;

  // Convert object dimensions to pixels
  let objectWidthPx: number;
  let objectHeightPx: number;

  if (objectDimensions.width.unit === '%') {
    objectWidthPx = (objectDimensions.width.value / 100) * canvasWidthPx;
  } else {
    objectWidthPx = objectDimensions.width.value;
  }

  if (objectDimensions.height.unit === '%') {
    objectHeightPx = (objectDimensions.height.value / 100) * canvasHeightPx;
  } else {
    objectHeightPx = objectDimensions.height.value;
  }

  // Handle zero/invalid dimensions
  if (objectWidthPx <= 0 || objectHeightPx <= 0) {
    return null;
  }

  // Calculate aspect ratio
  const ratio = objectWidthPx / objectHeightPx;

  // Create descriptive label
  const label = `Scaled to PDF (${Math.round(objectWidthPx)}×${Math.round(objectHeightPx)}px)`;

  return { ratio, label };
}

interface ImageUploadFieldProps {
  field?: any;
  value: string;  // Form passes simple string URL
  onChange: (fieldName: string, value: string) => void;  // Form expects field name and value back
  onGalleryClick?: () => void;
  issueId?: string;
  imageType?: 'cover' | 'background' | 'content' | 'profile' | 'portrait';
  label?: string;
  placeholder?: string;
  required?: boolean;
  onExtractVideoThumbnail?: () => void;
  fieldName?: string;
  showObjectFitControls?: boolean;
  error?: string;
  objectDimensions?: { width: DimensionValue; height: DimensionValue };  // For custom layout aspect ratio calculation
  pdfSettings?: PagePdfSettings;  // For custom layout aspect ratio calculation
  customAspectRatio?: { ratio: number; label: string };  // Direct custom aspect ratio (alternative to objectDimensions/pdfSettings)
}

export default function ImageUploadField({
  field,
  value,
  onChange,
  onGalleryClick,
  issueId = 'admin',
  imageType,
  label,
  placeholder = '/images/placeholder.png',
  required = false,
  onExtractVideoThumbnail,
  fieldName = 'image',
  showObjectFitControls = false,
  objectDimensions,
  pdfSettings,
  customAspectRatio: directCustomAspectRatio,
}: ImageUploadFieldProps) {
  // Derive imageType from field.contentType if not explicitly passed
  const derivedImageType = imageType ?? (field?.contentType === 'professional' ? 'portrait' : 'profile');

  // Determine if field should span full width based on layout
  const isFullWidth = field?.layout === 'full' || field?.layout === 'double';

  const {
    isUploading,
    uploadProgress,
    showCropModal,
    previewUrl,
    displayUrl,
    originalUrl,
    isFirebaseUrl,
    isReadOnly,
    fileInputRef,
    currentObjectFit,
    currentPositionX,
    currentPositionY,
    setShowCropModal,
    setPreviewUrl,
    handleFileSelect,
    handleCropComplete,
    handleUrlChange,
    handleRemoveImage,
    triggerFileInput,
    handleObjectFitChange,
    handleObjectPositionXChange,
    handleObjectPositionYChange,
  } = useImageUpload({
    value,
    fieldName: field?.name || fieldName || 'image',
    issueId,
    imageType: derivedImageType,
    onChange,
  });

  // Calculate custom aspect ratio for "Scaled to PDF" option
  // Use direct prop if provided, otherwise calculate from objectDimensions/pdfSettings
  const customAspectRatio = directCustomAspectRatio || calculateCustomAspectRatio(objectDimensions, pdfSettings);

  // Use field label if provided, otherwise use prop label
  const displayLabel = field?.label || label || 'Image URL';

  return (
    <div className={isFullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {displayLabel} {required && '*'}
      </label>

      <div className="space-y-2">
        {/* URL Input Field */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={displayUrl || previewUrl || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal ${
                isReadOnly ? 'bg-gray-50 cursor-not-allowed pr-10' : ''
              }`}
              required={required}
              readOnly={isReadOnly}
              title={isReadOnly ? 'Firebase URLs cannot be edited directly. Use Upload or Gallery to change.' : ''}
            />
            {isReadOnly && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" title="Locked: Firebase URL">
                🔒
              </div>
            )}
          </div>

          {/* Use Existing Button - Only show if onGalleryClick is provided */}
          {onGalleryClick && (
            <button
              type="button"
              onClick={onGalleryClick}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              📁 Use Existing
            </button>
          )}

          {/* Remove Image Button - Only show when there's a value */}
          {(displayUrl || previewUrl) && (displayUrl || previewUrl).trim() !== '' && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors whitespace-nowrap"
              title="Remove image"
            >
              🗑️ Remove
            </button>
          )}

          {/* Crop Image Button - Only show when there's an image */}
          {(displayUrl || previewUrl) && (displayUrl || previewUrl).trim() !== '' && (
            <button
              type="button"
              onClick={() => setShowCropModal(true)}
              className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors whitespace-nowrap"
              title="Crop image"
            >
              ✂️ Crop
            </button>
          )}

          {/* Pull Video Image Button - Only show if handler is provided */}
          {onExtractVideoThumbnail && (
            <button
              type="button"
              onClick={onExtractVideoThumbnail}
              className="px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded-md hover:bg-purple-200 transition-colors whitespace-nowrap"
              title="Extract thumbnail from video"
            >
              🎬 Pull Video Image
            </button>
          )}
        </div>

        {/* Upload Section */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />

          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="px-4 py-2 bg-glamlink-teal text-white text-sm rounded-md hover:bg-glamlink-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : '📤 Upload Image'}
          </button>

          {/* Upload Progress */}
          {isUploading && (
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-glamlink-teal transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">{uploadProgress}%</span>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {(previewUrl || displayUrl) && (previewUrl || displayUrl).trim() !== '' && (
          <div className="mt-3 p-2 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
              <Image
                src={previewUrl || displayUrl}
                alt="Preview"
                fill
                className={currentObjectFit === 'cover' ? 'object-cover' : 'object-contain'}
                style={{
                  objectPosition: currentObjectFit === 'cover' && currentPositionX !== undefined && currentPositionY !== undefined
                    ? `${currentPositionX}% ${currentPositionY}%`
                    : undefined
                }}
                onError={() => {
                  console.error('Failed to load image:', previewUrl);
                  setPreviewUrl('');
                }}
                unoptimized={isFirebaseUrl}
              />
            </div>
            {isFirebaseUrl && (
              <p className="text-xs text-amber-600 mt-2">🔒 Firebase image - Use Upload or Gallery to replace</p>
            )}
          </div>
        )}

      </div>

      {/* Crop Modal */}
      {showCropModal && displayUrl && (
        <ImageCropModal
          isOpen={showCropModal}
          imageUrl={originalUrl || displayUrl || previewUrl}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
          issueId={issueId}
          imageType={derivedImageType}
          fieldName={field?.name || fieldName}
          customAspectRatio={customAspectRatio}
        />
      )}
    </div>
  );
}
