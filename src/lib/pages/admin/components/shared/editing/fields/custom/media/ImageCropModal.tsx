'use client';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { XMarkIcon } from '@/lib/pages/admin/components/shared/common';
import { useImageCropModal } from './useImageCropModal';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedUrl: string, originalUrl: string, cropData: any) => void;
  issueId: string;
  imageType?: 'cover' | 'background' | 'content' | 'profile' | 'portrait';
  fieldName?: string;
  customAspectRatio?: { ratio: number; label: string } | null;
  hideFreeOption?: boolean;
}

export default function ImageCropModal({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
  issueId,
  imageType = 'content',
  fieldName = 'cropped',
  customAspectRatio,
  hideFreeOption = false,
}: ImageCropModalProps) {
  const {
    crop,
    completedCrop,
    isProcessing,
    aspectRatioValue,
    selectedAspectRatio,
    cropWidth,
    cropHeight,
    imageWidth,
    imageHeight,
    imgRef,
    scale,
    rotate,
    displayImageUrl,
    setCrop,
    setCompletedCrop,
    setScale,
    setRotate,
    onImageLoad,
    handleDimensionChange,
    handleAspectRatioChange,
    handleApplyCrop,
    setFullImage,
    commonAspectRatios,
  } = useImageCropModal({
    imageUrl,
    issueId,
    imageType,
    fieldName,
    onCropComplete,
    customAspectRatio,
    hideFreeOption,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />

        {/* Modal content */}
        <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Crop Image</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon />
            </button>
          </div>

          {/* Crop area */}
          <div className="p-4 bg-gray-100">
            <div className="flex justify-center items-center" style={{ minHeight: '250px', maxHeight: '45vh' }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatioValue}
                className="max-w-full max-h-[45vh]"
              >
                <img
                  ref={imgRef}
                  src={displayImageUrl}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '45vh',
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                  }}
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Drag the corners or edges to resize the crop area. Drag inside to move it.
            </p>
          </div>

          {/* Controls */}
          <div className="p-4 border-t bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={selectedAspectRatio}
                  onChange={(e) => handleAspectRatioChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal text-sm"
                >
                  {commonAspectRatios.map((ratio) => (
                    <option key={ratio.key} value={ratio.key}>
                      {ratio.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={setFullImage}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Select Full Image
                </button>
                <button
                  type="button"
                  onClick={() => setRotate(0)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Reset Rotation
                </button>
                <button
                  type="button"
                  onClick={() => setScale(1)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Reset Scale
                </button>
              </div>

              {/* Crop Size Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Size
                </label>
                <div className="text-sm text-gray-600 py-2">
                  {cropWidth} × {cropHeight}px
                </div>
              </div>
            </div>

            {/* Dimension inputs - always visible for precise control */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px) - max: {imageWidth}
                </label>
                <input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal text-sm"
                  min="10"
                  max={imageWidth}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px) - max: {imageHeight}
                </label>
                <input
                  type="number"
                  value={cropHeight}
                  onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal text-sm"
                  min="10"
                  max={imageHeight}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t bg-white">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCrop}
              disabled={isProcessing || !completedCrop}
              className="px-4 py-2 bg-glamlink-teal text-white rounded-md hover:bg-glamlink-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
