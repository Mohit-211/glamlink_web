/**
 * Utility functions for image cropping functionality
 */

/**
 * Creates a cropped image from the source image and crop area
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // Set canvas dimensions
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Translate canvas context to center and rotate if needed
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Draw rotated image
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // Set canvas to the desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste the cropped image
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // Return as base64 string
  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Creates an image element from a URL
 * Exported for use in getting image dimensions
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');

    // Use proxy for Firebase Storage URLs to avoid CORS
    if (url.includes('firebasestorage.googleapis.com')) {
      console.log('Using proxy for Firebase image to avoid CORS');
      image.src = `/api/admin/image-proxy?url=${encodeURIComponent(url)}`;
    } else {
      image.src = url;
    }
  });
}

/**
 * Convert degrees to radians
 */
function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Convert base64 to blob for uploading
 */
export function base64ToBlob(base64: string, mimeType = 'image/jpeg'): Blob {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}

/**
 * Convert base64 to File object
 */
export function base64ToFile(base64: string, filename: string): File {
  const blob = base64ToBlob(base64);
  return new File([blob], filename, { type: blob.type });
}

/**
 * Check if a value is an image object with crop data
 */
export function isImageObject(value: any): value is { url: string; originalUrl?: string; cropData?: any; objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; objectPositionX?: number; objectPositionY?: number } {
  return value && typeof value === 'object' && 'url' in value;
}

/**
 * Get the display URL from an image value (string or object)
 */
export function getImageUrl(value: string | { url: string; originalUrl?: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number }): string {
  if (typeof value === 'string') {
    return value;
  }
  return value?.url || '';
}

/**
 * Get the original URL for cropping (or current URL if no original)
 */
export function getOriginalImageUrl(value: string | { url: string; originalUrl?: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number }): string {
  if (typeof value === 'string') {
    return value;
  }
  return value?.originalUrl || value?.url || '';
}

/**
 * Get the object-fit value from an image value
 */
export function getImageObjectFit(value: string | { url: string; objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; objectPositionX?: number; objectPositionY?: number }): 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' | undefined {
  if (typeof value === 'string') {
    return undefined;
  }
  return value?.objectFit;
}

/**
 * Get the object-position value from an image value
 */
export function getImageObjectPosition(value: string | { url: string; objectPositionX?: number; objectPositionY?: number }): string | undefined {
  if (typeof value === 'string') {
    return undefined;
  }
  // Only return position if both X and Y are defined
  if (value?.objectPositionX !== undefined && value?.objectPositionY !== undefined) {
    return `${value.objectPositionX}% ${value.objectPositionY}%`;
  }
  return undefined;
}