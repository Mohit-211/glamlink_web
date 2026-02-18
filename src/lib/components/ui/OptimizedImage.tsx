import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function OptimizedImage({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className, 
  priority = false,
  sizes,
  style 
}: OptimizedImageProps) {
  const [imgError, setImgError] = useState(false);
  
  // Check if it's a local image
  const isLocalImage = src && (src.startsWith('/images/') || src.startsWith('/'));
  
  // For local images or on error, use regular img tag
  if (isLocalImage || imgError) {
    if (fill) {
      return (
        <img 
          src={src} 
          alt={alt} 
          className={className}
          style={{ 
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            color: 'transparent',
            ...style
          }}
        />
      );
    }
    
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className}
        style={style}
      />
    );
  }
  
  // For remote images, use Next.js Image with error handling
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      style={style}
      onError={() => setImgError(true)}
    />
  );
}