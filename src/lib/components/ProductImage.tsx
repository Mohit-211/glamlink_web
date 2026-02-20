'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import NoImagePlaceholder from './NoImagePlaceholder';

interface ProductImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | undefined | null;
}

export default function ProductImage({ 
  src, 
  alt,
  className = '',
  fill,
  ...props 
}: ProductImageProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!src);
  const [imageError, setImageError] = useState(false);

  // If no src provided, show placeholder immediately
  if (!src || showPlaceholder || imageError) {
    return (
      <NoImagePlaceholder 
        className={`${fill ? 'absolute inset-0' : ''} ${className}`}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt || 'Product image'}
      className={className}
      fill={fill}
      onError={() => {
        setImageError(true);
        setShowPlaceholder(true);
      }}
    />
  );
}