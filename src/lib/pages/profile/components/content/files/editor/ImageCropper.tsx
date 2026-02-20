/**
 * ImageCropper Component
 *
 * Interactive image cropping tool with aspect ratio presets
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (cropArea: CropArea) => void;
  onCancel: () => void;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
];

export function ImageCropper({ imageUrl, onCrop, onCancel }: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize crop area when image loads
  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      const img = imageRef.current;
      const containerWidth = containerRef.current?.clientWidth || 600;
      const containerHeight = containerRef.current?.clientHeight || 400;

      // Scale image to fit container
      const scale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight, 1);
      const displayWidth = img.naturalWidth * scale;
      const displayHeight = img.naturalHeight * scale;

      setImageDimensions({ width: displayWidth, height: displayHeight });

      // Start with full image selected
      const padding = 20;
      setCropArea({
        x: padding,
        y: padding,
        width: displayWidth - padding * 2,
        height: displayHeight - padding * 2,
      });
    }
  }, [imageLoaded]);

  // Apply aspect ratio constraint
  const applyAspectRatio = useCallback((area: CropArea, ratio: number | null): CropArea => {
    if (!ratio) return area;

    const newHeight = area.width / ratio;
    if (newHeight <= imageDimensions.height - area.y) {
      return { ...area, height: newHeight };
    } else {
      const newWidth = area.height * ratio;
      return { ...area, width: newWidth };
    }
  }, [imageDimensions]);

  useEffect(() => {
    if (aspectRatio !== null) {
      setCropArea(prev => applyAspectRatio(prev, aspectRatio));
    }
  }, [aspectRatio, applyAspectRatio]);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | string) => {
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });

    if (type === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(type);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCropArea(prev => {
      let newArea = { ...prev };

      if (isDragging) {
        // Move the crop area
        newArea.x = Math.max(0, Math.min(imageDimensions.width - prev.width, prev.x + deltaX));
        newArea.y = Math.max(0, Math.min(imageDimensions.height - prev.height, prev.y + deltaY));
      } else if (isResizing) {
        // Resize from corners/edges
        switch (isResizing) {
          case 'se':
            newArea.width = Math.max(50, Math.min(imageDimensions.width - prev.x, prev.width + deltaX));
            newArea.height = aspectRatio ? newArea.width / aspectRatio : Math.max(50, Math.min(imageDimensions.height - prev.y, prev.height + deltaY));
            break;
          case 'sw':
            const newWidthSW = Math.max(50, prev.width - deltaX);
            newArea.x = prev.x + prev.width - newWidthSW;
            newArea.width = newWidthSW;
            newArea.height = aspectRatio ? newArea.width / aspectRatio : Math.max(50, Math.min(imageDimensions.height - prev.y, prev.height + deltaY));
            break;
          case 'ne':
            newArea.width = Math.max(50, Math.min(imageDimensions.width - prev.x, prev.width + deltaX));
            const newHeightNE = aspectRatio ? newArea.width / aspectRatio : Math.max(50, prev.height - deltaY);
            newArea.y = prev.y + prev.height - newHeightNE;
            newArea.height = newHeightNE;
            break;
          case 'nw':
            const newWidthNW = Math.max(50, prev.width - deltaX);
            const newHeightNW = aspectRatio ? newWidthNW / aspectRatio : Math.max(50, prev.height - deltaY);
            newArea.x = prev.x + prev.width - newWidthNW;
            newArea.y = prev.y + prev.height - newHeightNW;
            newArea.width = newWidthNW;
            newArea.height = newHeightNW;
            break;
        }
      }

      return newArea;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isResizing, dragStart, imageDimensions, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleApplyCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const scaleX = img.naturalWidth / imageDimensions.width;
    const scaleY = img.naturalHeight / imageDimensions.height;

    onCrop({
      x: Math.round(cropArea.x * scaleX),
      y: Math.round(cropArea.y * scaleY),
      width: Math.round(cropArea.width * scaleX),
      height: Math.round(cropArea.height * scaleY),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-white">Crop Image</h2>
        </div>

        {/* Aspect Ratio Buttons */}
        <div className="flex items-center space-x-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => setAspectRatio(ratio.value)}
              className={`px-3 py-1 text-sm rounded ${
                aspectRatio === ratio.value
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>

      <div className="flex items-center space-x-3">
  <button
    onClick={onCancel}
    className="px-4 py-2 text-sm text-black hover:text-gray-700"
  >
    Cancel
  </button>
  <button
    onClick={handleApplyCrop}
    className="px-4 py-2 text-sm bg-pink-600 text-black rounded-lg hover:bg-pink-700 hover:text-black"
  >
    Apply crop
  </button>
</div>
      </div>

      {/* Crop Area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-8 overflow-hidden"
      >
        <div className="relative" style={{ width: imageDimensions.width, height: imageDimensions.height }}>
          {/* Image */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            onLoad={() => setImageLoaded(true)}
            className="max-w-full max-h-full"
            style={{ width: imageDimensions.width, height: imageDimensions.height }}
          />

          {/* Darkened overlay */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none">
            {/* Cut out the crop area */}
            <div
              className="absolute bg-transparent"
              style={{
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              }}
            />
          </div>

          {/* Crop selection */}
          <div
            className="absolute border-2 border-white cursor-move"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
            </div>

            {/* Corner handles */}
            {['nw', 'ne', 'sw', 'se'].map((corner) => (
              <div
                key={corner}
                className="absolute w-4 h-4 bg-white border-2 border-white rounded-full cursor-pointer"
                style={{
                  [corner.includes('n') ? 'top' : 'bottom']: -8,
                  [corner.includes('w') ? 'left' : 'right']: -8,
                  cursor: `${corner}-resize`,
                }}
                onMouseDown={(e) => handleMouseDown(e, corner)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 bg-gray-800 border-t border-gray-700 text-center">
        <span className="text-sm text-gray-400">
          {Math.round(cropArea.width)} × {Math.round(cropArea.height)} pixels
        </span>
      </div>
    </div>
  );
}

export default ImageCropper;
