import { useState } from "react";
import { DigitalCardFormData } from "../types";
import { sanitizeFormData, validateFirestoreDataSize } from "@/lib/pages/apply/shared/utils";
import storageService from "@/lib/services/firebase/storageService";

export const useDigitalCardSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Upload profile image to Firebase Storage and return the download URL
   */
  const uploadProfileImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `profile_${timestamp}_${file.name}`;
    const path = `digital-card-applications/profiles/${fileName}`;

    const downloadUrl = await storageService.uploadImage(
      file,
      path,
      {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        }
      }
    );

    return downloadUrl;
  };

  const submitApplication = async (formData: DigitalCardFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Create a copy of form data to modify
      const processedData = { ...formData };

      // Upload profile image if it's a File object
      if (processedData.profileImage instanceof File) {
        console.log('Uploading profile image...');
        const profileImageUrl = await uploadProfileImage(processedData.profileImage);
        processedData.profileImage = profileImageUrl as any;
        console.log('Profile image uploaded:', profileImageUrl);
      }

      // Sanitize form data for Firestore compatibility
      // @ts-expect-error - DigitalCardFormData vs GetFeaturedFormData type mismatch
      const formDataForSubmission = sanitizeFormData(processedData);

      // Validate data size before submission
      const validation = validateFirestoreDataSize(formDataForSubmission);
      if (!validation.isValid) {
        throw new Error(`Submission data is too large for Firestore. ${validation.errors.join(', ')}`);
      }

      const response = await fetch('/api/apply/digital-card/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataForSubmission),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      const result = await response.json();
      console.log('Application submitted successfully:', result);
      setIsSuccess(true);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Application submission error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  };

  return {
    submitApplication,
    isLoading,
    error,
    isSuccess,
    reset
  };
};
