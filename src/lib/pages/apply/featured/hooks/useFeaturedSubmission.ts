import { useState } from "react";
import { GetFeaturedFormData, SubmittedFile } from "../types";
import { sanitizeFormData, validateFirestoreDataSize } from "@/lib/pages/apply/shared/utils";

export const useFeaturedSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitApplication = async (formData: GetFeaturedFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Sanitize form data for Firestore compatibility
      const formDataForSubmission = sanitizeFormData(formData);

      // Validate data size before submission
      const validation = validateFirestoreDataSize(formDataForSubmission);
      if (!validation.isValid) {
        throw new Error(`Submission data is too large for Firestore. ${validation.errors.join(', ')}`);
      }

      const response = await fetch('/api/get-featured/submit', {
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