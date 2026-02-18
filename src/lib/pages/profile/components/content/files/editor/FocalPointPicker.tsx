/**
 * FocalPointPicker Component
 *
 * Visual focal point selector for images
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface FocalPointPickerProps {
  imageUrl: string;
  initialPoint?: { x: number; y: number };
  onSave: (point: { x: number; y: number }) => void;
  onCancel: () => void;
}

export function FocalPointPicker({
  imageUrl,
  initialPoint = { x: 50, y: 50 },
  onSave,
  onCancel,
}: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focalPoint, setFocalPoint] = useState(initialPoint);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateFocalPoint(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateFocalPoint(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateFocalPoint = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setFocalPoint({ x: Math.round(x), y: Math.round(y) });
  };

  // Quick position presets
  const presets = [
    { label: 'Top Left', x: 25, y: 25 },
    { label: 'Top Center', x: 50, y: 25 },
    { label: 'Top Right', x: 75, y: 25 },
    { label: 'Center Left', x: 25, y: 50 },
    { label: 'Center', x: 50, y: 50 },
    { label: 'Center Right', x: 75, y: 50 },
    { label: 'Bottom Left', x: 25, y: 75 },
    { label: 'Bottom Center', x: 50, y: 75 },
    { label: 'Bottom Right', x: 75, y: 75 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Set Focal Point</h2>
            <p className="text-sm text-gray-500 mt-1">
              Click or drag to set the focal point. This determines which part of the image stays visible when cropped.
            </p>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Image with focal point */}
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-lg overflow-hidden cursor-crosshair bg-gray-100"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageUrl}
              alt="Set focal point"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>

            {/* Focal point marker */}
            <div
              className="absolute w-12 h-12 -ml-6 -mt-6 pointer-events-none"
              style={{
                left: `${focalPoint.x}%`,
                top: `${focalPoint.y}%`,
              }}
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg animate-pulse" />
              {/* Inner dot */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-pink-600 rounded-full border-2 border-white shadow" />
              {/* Crosshairs */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50" />
            </div>
          </div>

          {/* Position info and presets */}
          <div className="mt-4 flex items-start justify-between">
            {/* Current position */}
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-xs text-gray-500">X Position</span>
                <div className="flex items-center mt-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={focalPoint.x}
                    onChange={(e) => setFocalPoint({ ...focalPoint, x: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="ml-1 text-sm text-gray-500">%</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Y Position</span>
                <div className="flex items-center mt-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={focalPoint.y}
                    onChange={(e) => setFocalPoint({ ...focalPoint, y: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="ml-1 text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Preset grid */}
            <div>
              <span className="text-xs text-gray-500">Quick Positions</span>
              <div className="grid grid-cols-3 gap-1 mt-1">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setFocalPoint({ x: preset.x, y: preset.y })}
                    className={`w-8 h-8 rounded border text-xs font-medium transition-colors ${
                      focalPoint.x === preset.x && focalPoint.y === preset.y
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                    title={preset.label}
                  >
                    {preset.label === 'Center' ? (
                      <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full mx-auto ${
                          focalPoint.x === preset.x && focalPoint.y === preset.y
                            ? 'bg-white'
                            : 'bg-gray-400'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview thumbnails */}
          <div className="mt-6">
            <span className="text-xs text-gray-500 block mb-2">Preview at different aspect ratios</span>
            <div className="flex space-x-4">
              {[
                { label: '1:1', width: 80, height: 80 },
                { label: '16:9', width: 120, height: 68 },
                { label: '4:3', width: 100, height: 75 },
                { label: '3:4', width: 60, height: 80 },
              ].map((preview) => (
                <div key={preview.label} className="text-center">
                  <div
                    className="rounded overflow-hidden bg-gray-100"
                    style={{ width: preview.width, height: preview.height }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Preview ${preview.label}`}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{preview.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(focalPoint)}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Save focal point
          </button>
        </div>
      </div>
    </div>
  );
}

export default FocalPointPicker;
