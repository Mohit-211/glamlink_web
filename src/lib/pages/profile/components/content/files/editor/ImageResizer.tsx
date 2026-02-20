/**
 * ImageResizer Component
 *
 * Resize image with dimension inputs and presets
 */

'use client';

import { useState, useEffect } from 'react';

interface ImageResizerProps {
  currentWidth: number;
  currentHeight: number;
  onResize: (width: number, height: number) => void;
  onCancel: () => void;
}

const SIZE_PRESETS = [
  { label: 'Original', width: null, height: null },
  { label: 'Small (480px)', width: 480, height: null },
  { label: 'Medium (800px)', width: 800, height: null },
  { label: 'Large (1200px)', width: 1200, height: null },
  { label: 'HD (1920px)', width: 1920, height: null },
  { label: 'Square (500px)', width: 500, height: 500 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Facebook Cover', width: 820, height: 312 },
];

export function ImageResizer({
  currentWidth,
  currentHeight,
  onResize,
  onCancel,
}: ImageResizerProps) {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio] = useState(currentWidth / currentHeight);
  const [unit, setUnit] = useState<'px' | '%'>('px');

  const originalWidth = currentWidth;
  const originalHeight = currentHeight;

  // Handle width change
  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (lockAspectRatio) {
      setHeight(Math.round(value / aspectRatio));
    }
  };

  // Handle height change
  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (lockAspectRatio) {
      setWidth(Math.round(value * aspectRatio));
    }
  };

  // Apply preset
  const applyPreset = (preset: typeof SIZE_PRESETS[0]) => {
    if (preset.width === null) {
      setWidth(originalWidth);
      setHeight(originalHeight);
    } else if (preset.height === null) {
      // Width-based preset, maintain aspect ratio
      setWidth(preset.width);
      setHeight(Math.round(preset.width / aspectRatio));
    } else {
      // Fixed dimensions
      setWidth(preset.width);
      setHeight(preset.height);
    }
  };

  // Convert between px and %
  const getDisplayValue = (value: number, original: number) => {
    if (unit === '%') {
      return Math.round((value / original) * 100);
    }
    return value;
  };

  const getPixelValue = (value: number, original: number) => {
    if (unit === '%') {
      return Math.round((value / 100) * original);
    }
    return value;
  };

  const handleApply = () => {
    onResize(width, height);
  };

  const scalePercent = Math.round((width / originalWidth) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Resize Image</h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current size info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Original size:</span>
            <span className="font-medium text-gray-900">{originalWidth} × {originalHeight} px</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Scale:</span>
            <span className={`font-medium ${scalePercent > 100 ? 'text-orange-600' : 'text-gray-900'}`}>
              {scalePercent}%
              {scalePercent > 100 && (
                <span className="ml-2 text-xs text-orange-500">(may lose quality)</span>
              )}
            </span>
          </div>
        </div>

        {/* Dimension inputs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Dimensions</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUnit('px')}
                className={`px-2 py-1 text-xs rounded ${
                  unit === 'px' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                px
              </button>
              <button
                onClick={() => setUnit('%')}
                className={`px-2 py-1 text-xs rounded ${
                  unit === '%' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                %
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Width</label>
              <input
                type="number"
                value={getDisplayValue(width, originalWidth)}
                onChange={(e) => handleWidthChange(getPixelValue(parseInt(e.target.value) || 0, originalWidth))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={() => setLockAspectRatio(!lockAspectRatio)}
              className={`mt-5 p-2 rounded ${
                lockAspectRatio ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            >
              {lockAspectRatio ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Height</label>
              <input
                type="number"
                value={getDisplayValue(height, originalHeight)}
                onChange={(e) => handleHeightChange(getPixelValue(parseInt(e.target.value) || 0, originalHeight))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-3">Presets</span>
          <div className="flex flex-wrap gap-2">
            {SIZE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Apply resize
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageResizer;
