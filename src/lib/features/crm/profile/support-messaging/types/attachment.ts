// File Attachment Types for Support Messaging System

export type AttachmentType = 'image' | 'document' | 'other';

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  thumbnailUrl?: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface SerializableAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  thumbnailUrl?: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string; // ISO string
}

// Allowed file types for upload
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
};

// All allowed MIME types
export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_FILE_TYPES.image,
  ...ALLOWED_FILE_TYPES.document,
];

// Max file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max attachments per message
export const MAX_ATTACHMENTS_PER_MESSAGE = 5;

/**
 * Get the attachment type from a MIME type
 */
export function getAttachmentType(mimeType: string): AttachmentType {
  if (ALLOWED_FILE_TYPES.image.includes(mimeType)) {
    return 'image';
  }
  if (ALLOWED_FILE_TYPES.document.includes(mimeType)) {
    return 'document';
  }
  return 'other';
}

/**
 * Check if a file type is allowed
 */
export function isAllowedFileType(mimeType: string): boolean {
  return ALL_ALLOWED_MIME_TYPES.includes(mimeType);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Validate a file for upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isAllowedFileType(file.type)) {
    return { valid: false, error: 'File type not allowed. Please upload images (JPEG, PNG, GIF, WebP) or documents (PDF, DOC, TXT).' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.` };
  }

  return { valid: true };
}

// Conversion helpers
export const toSerializableAttachment = (attachment: Attachment): SerializableAttachment => ({
  ...attachment,
  uploadedAt: attachment.uploadedAt instanceof Date ? attachment.uploadedAt.toISOString() : attachment.uploadedAt,
});

export const fromSerializableAttachment = (attachment: SerializableAttachment): Attachment => ({
  ...attachment,
  uploadedAt: new Date(attachment.uploadedAt),
});
