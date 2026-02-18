"use client";

import React, { useState, useEffect, useRef } from "react";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || urlString.trim() === '') return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generate QR code URL using QuickChart API with custom color
 * Uses Glamlink teal (#22B8C8) for the QR code color
 */
export function getQrCodeUrl(targetUrl: string, size: number = 100): string {
  // QuickChart QR API supports custom colors
  // dark parameter is the QR code color (without #)
  const encodedUrl = encodeURIComponent(targetUrl);
  return `https://quickchart.io/qr?text=${encodedUrl}&dark=22B8C8&size=${size}&margin=1`;
}

// =============================================================================
// QR CODE COMPONENT
// =============================================================================

export interface QrCodeDisplayProps {
  /** The URL to encode in the QR code */
  url: string;
  /** Size in pixels (default: 80) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * QrCodeDisplay - Renders a QR code for a given URL
 *
 * Uses QuickChart API with Glamlink teal (#22B8C8) color.
 * Handles loading states and errors gracefully.
 */
export function QrCodeDisplay({ url, size = 80, className = '' }: QrCodeDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const prevUrlRef = useRef<string>(url);

  // Check if image is already loaded (handles hydration case where image loads before React)
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight > 0) {
      setIsLoaded(true);
    }
  }, []);

  // Reset state only when URL actually changes (not on initial mount)
  useEffect(() => {
    if (prevUrlRef.current !== url) {
      setIsLoaded(false);
      setHasError(false);
      prevUrlRef.current = url;
    }
  }, [url]);

  if (!isValidUrl(url)) {
    return null;
  }

  const qrCodeSrc = getQrCodeUrl(url, size);

  return (
    <div className={`qr-code-display flex-shrink-0 ${className}`}>
      {!isLoaded && !hasError && (
        <div
          className="bg-gray-100 rounded animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      <img
        ref={imgRef}
        src={qrCodeSrc}
        alt="QR Code"
        width={size}
        height={size}
        className={`rounded ${isLoaded ? 'block' : 'hidden'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div
          className="bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs"
          style={{ width: size, height: size }}
        >
          QR Error
        </div>
      )}
    </div>
  );
}

export default QrCodeDisplay;
