import { SubmittedFile } from '../../featured/types';

/**
 * Converts a File object to a SubmittedFile object with base64 data
 */
export async function convertFileToSubmittedFile(file: File): Promise<SubmittedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const base64Data = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") to get just the base64
        const base64Content = base64Data.split(',')[1];

        const submittedFile: SubmittedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Content
        };

        resolve(submittedFile);
      } catch (error) {
        reject(new Error(`Failed to process file ${file.name}: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converts an array of File objects to SubmittedFile objects
 */
export async function convertFilesToSubmittedFiles(files: File[]): Promise<SubmittedFile[]> {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    const submittedFiles = await Promise.all(
      files.map(file => convertFileToSubmittedFile(file))
    );
    return submittedFiles;
  } catch (error) {
    console.error('Error converting files:', error);
    throw error;
  }
}

/**
 * Validates if a file is an image based on its type
 */
export function isImageFile(file: File): boolean {
  if (!file || !file.type) return false;
  return file.type.startsWith('image/');
}

/**
 * Validates file size (in bytes)
 */
export function validateFileSize(file: File, maxSizeInMB: number = 10): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Filters and validates files for upload
 */
export function validateFiles(files: File[], options: {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}): { validFiles: File[]; errors: string[] } {
  const { maxFiles = 10, maxSizeInMB = 10, allowedTypes } = options;
  const validFiles: File[] = [];
  const errors: string[] = [];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed. ${files.length} files selected.`);
  }

  files.forEach((file, index) => {
    // Check file size
    if (!validateFileSize(file, maxSizeInMB)) {
      errors.push(`File "${file.name}" exceeds maximum size of ${maxSizeInMB}MB.`);
      return;
    }

    // Check file type if restrictions are specified
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = allowedTypes.includes(file.type) || allowedTypes.includes(fileExtension);

      if (!isValidType) {
        errors.push(`File "${file.name}" is not an allowed type.`);
        return;
      }
    }

    validFiles.push(file);
  });

  return { validFiles, errors };
}

/**
 * Creates a safe filename by removing special characters
 */
export function createSafeFilename(originalName: string): string {
  return originalName
    .replace(/[^a-zA-Z0-9\-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}