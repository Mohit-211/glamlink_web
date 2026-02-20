"use client";

import { useState, useRef, useEffect } from "react";
import SafeImage from "@/lib/components/SafeImage";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  height?: number;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  height = 400
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSliding, setIsSliding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset slider position when images change
  useEffect(() => {
    setSliderPosition(50);
  }, [beforeImage, afterImage]);

  const handleMouseDown = () => {
    setIsSliding(true);
  };

  const handleMouseUp = () => {
    setIsSliding(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSliding || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, percentage)));
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-lg cursor-ew-resize select-none"
        style={{ height: `${height}px` }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <SafeImage
            src={afterImage}
            alt={afterAlt}
            fill
            className="object-cover"
            fallbackType="transformation"
            priority
          />
        </div>

        {/* Before Image (Foreground with clip) */}
        <div 
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <SafeImage
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover"
            fallbackType="transformation"
            priority
          />
        </div>

        {/* Slider Line and Handle */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3-3m0 0l3-3m-3 3h12m-7 6l3 3m0 0l-3 3m3-3H7" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
          After
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-500 mt-2">
        Drag the slider to compare before and after
      </p>
    </div>
  );
}