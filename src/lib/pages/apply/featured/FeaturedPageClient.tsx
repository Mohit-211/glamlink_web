"use client";

/**
 * GetFeaturedPageClient - Client-side component for the Get Featured page
 *
 * Receives form configurations from the server component and renders
 * the form with all interactive functionality.
 */

import { useState } from "react";
import { Hero, TwoBoxesSection, FinalCTASection, ContentPreview } from "@/lib/pages/apply/shared/components/layout";
import FeaturedForm from "./components/FeaturedForm";
import type { GetFeaturedFormData } from './types';
import { useFeaturedSubmission } from "./hooks/useFeaturedSubmission";
import { Alert } from "@/lib/components/ui";
import type { FormConfigsData } from "@/lib/pages/apply/shared/services/formConfigService";

// =============================================================================
// TYPES
// =============================================================================

interface GetFeaturedPageClientProps {
  configs: FormConfigsData;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function GetFeaturedPageClient({ configs }: GetFeaturedPageClientProps) {
  const [showForm, setShowForm] = useState(false);
  const { submitApplication, isLoading, error, isSuccess } = useFeaturedSubmission();

  const handleFormSubmit = async (formData: GetFeaturedFormData) => {
    try {
      await submitApplication(formData);
      setShowForm(false);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <Hero formId="get-featured-form" />

      {/* Content Preview Section */}
      <ContentPreview />

      {/* Application Form */}
      <div id="get-featured-form" className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {isSuccess ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Application Submitted Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for applying to get featured in Glamlink. We've received your application and will review it carefully. Marie will be in touch with follow-up questions soon.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>What happens next:</p>
                  <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                    <li>Our team will review your application</li>
                    <li>Marie may contact you for additional information</li>
                    <li>Selected professionals will be featured in upcoming content</li>
                    <li>You'll receive confirmation via email</li>
                  </ul>
                </div>
              </div>
            ) : (
              <FeaturedForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                configs={configs}
              />
            )}

            {error && (
              <div className="mt-6">
                <Alert type="error" message={error} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Ready to Apply?
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Scroll down to complete your application and get featured in Glamlink!
            </p>
            <button
              onClick={() => {
                setShowForm(false);
                const formElement = document.getElementById('get-featured-form');
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full px-4 py-2 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
            >
              Go to Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
