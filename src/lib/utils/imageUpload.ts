export const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
};

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > IMAGE_UPLOAD_CONFIG.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${IMAGE_UPLOAD_CONFIG.maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!IMAGE_UPLOAD_CONFIG.acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be an image (JPG, PNG, WebP, or GIF)',
    };
  }

  return { valid: true };
}

export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
  const nameWithoutExt = originalFilename
    .substring(0, originalFilename.lastIndexOf('.'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50); // Limit length
  
  return `${nameWithoutExt}-${timestamp}-${randomString}${extension}`;
}

export async function uploadImage(file: File): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: error || 'Upload failed' };
    }

    const data = await response.json();
    return { success: true, path: data.path };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}