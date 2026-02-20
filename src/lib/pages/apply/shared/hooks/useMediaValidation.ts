import { useCallback } from "react";
import { FormErrors } from "../types";

interface MediaValidationError {
  fieldKey: string;
  error: string;
  type: 'size' | 'count' | 'type';
}

// Lightweight media validation that only checks basic requirements during typing
export const useMediaValidation = () => {
  // Fast validation for typing (no file size checks)
  const validateMediaOnTyping = useCallback((fieldKey: string, files: File[], fieldConfig: any): string | null => {
    if (!files || files.length === 0) {
      if (fieldConfig?.required && (fieldConfig?.validation?.minFiles || 1) > 0) {
        return fieldConfig?.validation?.message || `${fieldConfig?.label || 'Files'} are required`;
      }
      return null;
    }

    // Only check minimum file count during typing (skip expensive size checks)
    const minFiles = fieldConfig?.validation?.minFiles || 1;
    if (files.length < minFiles) {
      return `At least ${minFiles} file(s) required`;
    }

    // Check maximum file count (fast operation)
    const maxFiles = fieldConfig?.validation?.maxFiles;
    if (maxFiles && files.length > maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  }, []);

  // Comprehensive validation for blur/submit (includes expensive file operations)
  const validateMediaOnBlur = useCallback((fieldKey: string, files: File[], fieldConfig: any): string | null => {
    // First do fast validation
    const fastError = validateMediaOnTyping(fieldKey, files, fieldConfig);
    if (fastError) return fastError;

    // Then do expensive validations only when user moves away or submits
    if (files && files.length > 0) {
      // Check file sizes (expensive operation)
      const maxSize = fieldConfig?.validation?.maxSize;
      if (maxSize) {
        for (const file of files) {
          if (file.size > maxSize * 1024 * 1024) {
            return `${file.name} exceeds ${maxSize}MB limit`;
          }
        }
      }

      // Check file types if specified
      const allowedTypes = fieldConfig?.validation?.allowedTypes;
      if (allowedTypes && allowedTypes.length > 0) {
        for (const file of files) {
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
          if (!allowedTypes.includes(fileExtension) && !allowedTypes.includes(file.type)) {
            return `${file.name} has invalid file type. Allowed: ${allowedTypes.join(', ')}`;
          }
        }
      }
    }

    return null;
  }, [validateMediaOnTyping]);

  // Batch validation for multiple media fields (optimized for form submission)
  const validateAllMediaFields = useCallback((formData: any, fieldConfigs: Record<string, any>): MediaValidationError[] => {
    const errors: MediaValidationError[] = [];

    for (const [fieldKey, files] of Object.entries(formData)) {
      if (Array.isArray(files) && files.length > 0 && fieldConfigs[fieldKey]?.type === 'file-upload') {
        const error = validateMediaOnBlur(fieldKey, files, fieldConfigs[fieldKey]);
        if (error) {
          errors.push({
            fieldKey,
            error,
            type: 'size' // Default to size for simplicity
          });
        }
      }
    }

    return errors;
  }, [validateMediaOnBlur]);

  // Convert media validation errors to form errors format
  const mediaErrorsToFormErrors = useCallback((mediaErrors: MediaValidationError[]): FormErrors => {
    const formErrors: FormErrors = {};
    mediaErrors.forEach(({ fieldKey, error }) => {
      formErrors[fieldKey] = error;
    });
    return formErrors;
  }, []);

  // Quick check if any media field has files (for progress calculation)
  const hasMediaFiles = useCallback((fieldKey: string, files: File[]): boolean => {
    return files && files.length > 0;
  }, []);

  // Get file count for progress calculation (without validation)
  const getMediaFileCount = useCallback((fieldKey: string, files: File[]): number => {
    return files ? files.length : 0;
  }, []);

  // Check if media field meets minimum requirement (fast check)
  const isMediaFieldComplete = useCallback((fieldKey: string, files: File[], fieldConfig: any): boolean => {
    if (!fieldConfig?.required) return true;

    const minFiles = fieldConfig?.validation?.minFiles || 1;
    return files && files.length >= minFiles;
  }, []);

  return {
    validateMediaOnTyping,
    validateMediaOnBlur,
    validateAllMediaFields,
    mediaErrorsToFormErrors,
    hasMediaFiles,
    getMediaFileCount,
    isMediaFieldComplete
  };
};