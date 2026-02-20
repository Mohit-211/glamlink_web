"use client";

import type { FeaturedFormSection as FeaturedFormSectionType } from '@/lib/pages/admin/components/content-settings/content/sections/featured/types';
import { isFeaturedFormSection } from '@/lib/pages/admin/components/content-settings/content/sections/featured/types';
import FeaturedForm from '@/lib/pages/apply/featured/components/FeaturedForm';
import type { GetFeaturedFormData } from '@/lib/pages/apply/featured/types';
import type { FormConfigsData } from '@/lib/pages/apply/shared/services/formConfigService';
import { Alert } from '@/lib/components/ui';

interface FeaturedFormSectionProps {
  section: FeaturedFormSectionType | any;
  onSubmit?: (data: GetFeaturedFormData) => Promise<void>;
  isLoading?: boolean;
  configs?: FormConfigsData;
  isSuccess?: boolean;
  error?: string | null;
}

/**
 * Featured Form Section
 *
 * Wraps the existing FeaturedForm component
 * Multi-step form with form type selection and validation
 * No CMS-configurable content - preserves all existing form logic
 */
export function FeaturedFormSection({
  section,
  onSubmit,
  isLoading = false,
  configs,
  isSuccess = false,
  error = null
}: FeaturedFormSectionProps) {
  if (!isFeaturedFormSection(section)) {
    return null;
  }

  // Return null if no submit handler or configs provided
  if (!onSubmit || !configs) {
    return null;
  }

  return (
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
              onSubmit={onSubmit}
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
  );
}
