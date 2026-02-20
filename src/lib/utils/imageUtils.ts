/**
 * Image utility functions for handling various image sources
 * including Firebase Storage URLs and external URLs
 */

// Default fallback images for different content types
export const DEFAULT_IMAGES = {
  product: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  provider: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
  brand: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
  transformation: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
  training: 'https://images.unsplash.com/photo-1609207807107-e8a263266d3f?w=400&h=400&fit=crop',
  generic: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
};

/**
 * Check if a URL is from Firebase Storage
 */
export function isFirebaseStorageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'firebasestorage.googleapis.com';
  } catch {
    return false;
  }
}

/**
 * Check if a URL is valid
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check if it's a supported protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check if it's from a known/allowed domain
    const allowedDomains = [
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'i.imgur.com',
      'res.cloudinary.com'
    ];
    
    // Allow all Firebase Storage URLs
    if (isFirebaseStorageUrl(url)) {
      return true;
    }
    
    // Check against allowed domains for other URLs
    return allowedDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    // If URL parsing fails, check if it's a relative path
    return url.startsWith('/') && !url.startsWith('//');
  }
}

/**
 * Get a valid image URL with fallback
 */
export function getValidImageUrl(
  url: string | undefined | null,
  fallbackType: keyof typeof DEFAULT_IMAGES = 'generic'
): string {
  // If URL is valid, return it
  if (isValidImageUrl(url)) {
    return url!;
  }
  
  // Return appropriate fallback
  return DEFAULT_IMAGES[fallbackType] || DEFAULT_IMAGES.generic;
}

/**
 * Process image URL for Next.js Image component
 * Ensures Firebase Storage URLs are properly formatted
 */
export function processImageUrl(url: string | undefined | null): string {
  if (!url) return DEFAULT_IMAGES.generic;
  
  // If it's a Firebase Storage URL, ensure it's properly formatted
  if (isFirebaseStorageUrl(url)) {
    try {
      const urlObj = new URL(url);
      // Ensure the URL has proper query parameters
      if (!urlObj.searchParams.has('alt')) {
        urlObj.searchParams.set('alt', 'media');
      }
      return urlObj.toString();
    } catch {
      return url;
    }
  }
  
  return url;
}

/**
 * Get image loader for Next.js Image component
 * This helps with Firebase Storage URLs
 */
export function getImageLoader(src: string): string {
  // For Firebase Storage URLs, ensure they have the media parameter
  if (isFirebaseStorageUrl(src)) {
    const url = new URL(src);
    if (!url.searchParams.has('alt')) {
      url.searchParams.set('alt', 'media');
    }
    return url.toString();
  }
  
  return src;
}

/**
 * Extract image type from context or URL
 */
export function getImageType(
  url: string | undefined,
  context?: string
): keyof typeof DEFAULT_IMAGES {
  if (!url && !context) return 'generic';
  
  // Check context first
  if (context) {
    if (context.includes('product')) return 'product';
    if (context.includes('provider')) return 'provider';
    if (context.includes('brand')) return 'brand';
    if (context.includes('transformation') || context.includes('before') || context.includes('after')) return 'transformation';
    if (context.includes('training')) return 'training';
  }
  
  // Check URL patterns
  if (url) {
    if (url.includes('/products/')) return 'product';
    if (url.includes('/providers/')) return 'provider';
    if (url.includes('/brands/')) return 'brand';
    if (url.includes('/transformations/') || url.includes('/before') || url.includes('/after')) return 'transformation';
    if (url.includes('/training/')) return 'training';
  }
  
  return 'generic';
}