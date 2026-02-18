'use client';

import { ClientWrapper } from '@/lib/features/display-cms/ClientWrapper';
import { useFeaturedSubmission } from '@/lib/pages/apply/featured/hooks/useFeaturedSubmission';
import type { PageConfig } from '@/lib/features/display-cms/types';
import type { GetFeaturedFormData } from '@/lib/pages/apply/featured/types';
import type { FormConfigsData } from '@/lib/pages/apply/shared/services/formConfigService';

interface FeaturedPageWrapperProps {
  pageType: string;
  initialData?: PageConfig | null;
  configs: FormConfigsData;
}

/**
 * FeaturedPageWrapper - Client Component
 *
 * Wraps the featured application page with CMS content display.
 * Manages form submission state and passes form configs to form section.
 */
export function FeaturedPageWrapper({
  pageType,
  initialData,
  configs
}: FeaturedPageWrapperProps) {
  // Form submission hook
  const { submitApplication, isLoading: isSubmitting, error: submitError, isSuccess } = useFeaturedSubmission();

  const handleFormSubmit = async (formData: GetFeaturedFormData) => {
    await submitApplication(formData);
  };

  return (
    <ClientWrapper
      pageType={pageType}
      initialData={initialData}
      onFeaturedSubmit={handleFormSubmit}
      isFeaturedLoading={isSubmitting}
      featuredConfigs={configs}
      isFeaturedSuccess={isSuccess}
      featuredError={submitError}
      className="min-h-screen bg-white overflow-x-hidden"
    />
  );
}
