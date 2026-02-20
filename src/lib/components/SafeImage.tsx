'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { 
  getValidImageUrl, 
  processImageUrl, 
  getImageType,
  isFirebaseStorageUrl,
  getImageLoader 
} from '@/lib/utils/imageUtils';
import NoImagePlaceholder from './NoImagePlaceholder';

export interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | undefined | null;
  fallbackType?: 'product' | 'provider' | 'brand' | 'transformation' | 'training' | 'generic';
  context?: string;
  showPlaceholder?: boolean; // If true, shows "No Image Uploaded" instead of fallback image
}

/**
 * SafeImage component that wraps Next.js Image with fallback support
 * Handles Firebase Storage URLs and provides error handling
 */
export default function SafeImage({ 
  src, 
  alt,
  fallbackType,
  context,
  showPlaceholder = false,
  onError,
  fill,
  className = '',
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    // Process the initial src
    const processedUrl = processImageUrl(src);
    
    // If it's not valid, use fallback immediately
    if (!src || !processedUrl) {
      const type = fallbackType || getImageType(src || undefined, context);
      return getValidImageUrl(null, type);
    }
    
    return processedUrl;
  });
  
  const [hasError, setHasError] = useState(false);
  const [showNoImage, setShowNoImage] = useState(false);

  // Show placeholder for products if requested and no valid source
  if (showPlaceholder && fallbackType === 'product' && (!src || hasError || showNoImage)) {
    return (
      <NoImagePlaceholder 
        className={`${fill ? 'absolute inset-0' : ''} ${className}`}
      />
    );
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Image failed to load
    
    // For products with showPlaceholder, show the placeholder
    if (showPlaceholder && fallbackType === 'product') {
      setShowNoImage(true);
      setHasError(true);
    } else if (!hasError) {
      // Otherwise use the fallback image
      setHasError(true);
      const type = fallbackType || getImageType(src || undefined, context);
      const fallbackUrl = getValidImageUrl(null, type);
      setImgSrc(fallbackUrl);
    }
    
    // Call the original onError if provided
    if (onError) {
      onError(e);
    }
  };

  // For Firebase Storage URLs, use a custom loader
  const imageLoader = isFirebaseStorageUrl(imgSrc) 
    ? ({ src }: { src: string }) => getImageLoader(src)
    : undefined;

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'Image'}
      className={className}
      fill={fill}
      onError={handleError}
      loader={imageLoader}
      unoptimized={isFirebaseStorageUrl(imgSrc)} // Disable optimization for Firebase URLs
    />
  );
}