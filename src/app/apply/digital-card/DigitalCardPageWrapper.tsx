'use client';

import { ClientWrapper } from '@/lib/features/display-cms/ClientWrapper';
import { useDigitalCardSubmission } from '@/lib/pages/apply/get-digital-card/hooks/useDigitalCardSubmission';
import { Alert, LoadingSpinner } from '@/lib/components/ui';
import { useSubmissionStatus, CapReachedMessage, MESSAGES } from '@/lib/features/digital-card-cap';
import { DigitalCardFormData } from '@/lib/pages/apply/get-digital-card';
import { PageConfig } from '@/lib/features/display-cms';

interface DigitalCardPageWrapperProps {
  pageType: string;
  initialData?: PageConfig | null;
}

/**
 * DigitalCardPageWrapper - Client Component
 *
 * Wraps the digital card application page with CMS content display.
 * Manages form submission state and displays success/error states.
 * Checks submission cap before allowing form display.
 */
export function DigitalCardPageWrapper({
  pageType,
  initialData
}: DigitalCardPageWrapperProps) {
  // Check submission cap status
  const { status: submissionStatus, isLoading: isCheckingStatus } = useSubmissionStatus();

  // Form submission hook
  const { submitApplication, isLoading: isSubmitting, error: submitError, isSuccess } = useDigitalCardSubmission();

  const handleSubmit = async (data: DigitalCardFormData) => {
    await submitApplication(data);
  };

  // Loading state - checking submission cap
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Checking availability...</p>
        </div>
      </div>
    );
  }

  // Cap reached state - show waitlist form
  if (submissionStatus && !submissionStatus.isAccepting) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-16">
          <CapReachedMessage />
        </div>
      </div>
    );
  }

  // Success state - display after successful submission
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600">
                Our Concierge Team is now hand-building your empire. Watch your inbox—your custom Glam Card and Launch Kit will arrive shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Error Alert */}
      {submitError && (
        <div className="container-custom py-4">
          <div className="max-w-7xl mx-auto">
            <Alert type="error" message={submitError} />
          </div>
        </div>
      )}

      <ClientWrapper
        pageType={pageType}
        initialData={initialData}
        onDigitalCardSubmit={handleSubmit}
        isDigitalCardLoading={isSubmitting}
        className="min-h-screen bg-white overflow-x-hidden"
      />
    </>
  );
}
