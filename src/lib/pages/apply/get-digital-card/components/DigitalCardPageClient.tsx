'use client';

import { useDigitalCardSubmission } from '../hooks/useDigitalCardSubmission';
import DigitalCardFormWithPreview from './DigitalCardFormWithPreview';
import { Hero, FinalCTASection } from '@/lib/pages/apply/shared/components/layout';
import { Alert } from '@/lib/components/ui';
import type { DigitalCardFormData } from '../types';

export default function DigitalCardPageClient() {
  const { submitApplication, isLoading, error, isSuccess } = useDigitalCardSubmission();

  const handleSubmit = async (data: DigitalCardFormData) => {
    await submitApplication(data);
  };

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
              <p className="text-gray-600 mb-6">
                Thank you for applying for your Digital Business Card. We'll review your application and get back to you within 2-3 business days.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>What happens next:</p>
                <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                  <li>Our team will review your application</li>
                  <li>You'll receive a confirmation email</li>
                  <li>Once approved, your digital card will be created</li>
                  <li>You'll get access to your personalized card link</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero formId="digital-card-form" />

      {/* Application Form with Split-View Preview */}
      {/* <div id="digital-card-form">
        <DigitalCardFormWithPreview
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div> */}

      {/* Error Alert - positioned after form so user sees it after submitting */}
      {error && (
        <div className="container-custom py-4">
          <div className="max-w-7xl mx-auto">
            <Alert type="error" message={error} />
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      <FinalCTASection />
    </div>
  );
}
