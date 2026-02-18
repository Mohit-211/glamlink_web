'use client';

/**
 * GlamlinkIdLogo - ACCESS by glamlink branding logo for preview header
 *
 * Displays the ACCESS by glamlink logo centered at the top of the preview.
 * Uses the ACCESS-3.png image.
 */

import React from 'react';
import Image from 'next/image';

// =============================================================================
// TYPES
// =============================================================================

export interface GlamlinkIdLogoProps {
  /** Optional custom height (default: 80px) */
  height?: number;
  /** Optional custom className */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function GlamlinkIdLogo({
  height = 80,
  className = '',
}: GlamlinkIdLogoProps) {
  // Calculate width based on aspect ratio of ACCESS logo (approximately 2.5:1)
  const width = Math.round(height * 2.5);

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <Image
        src="/images/ACCESS-3.png"
        alt="ACCESS by glamlink"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
