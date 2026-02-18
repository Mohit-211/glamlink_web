"use client";

import type { DigitalCardFormSection as DigitalCardFormSectionType } from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/types';
import { isDigitalCardFormSection } from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/types';
import DigitalCardFormWithPreview from '@/lib/pages/apply/get-digital-card/components/DigitalCardFormWithPreview';
import type { DigitalCardFormData } from '@/lib/pages/apply/get-digital-card/types';

interface DigitalCardFormSectionProps {
  section: DigitalCardFormSectionType | any;
  onSubmit?: (data: DigitalCardFormData) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Digital Card Form Section
 *
 * Wraps the existing DigitalCardFormWithPreview component
 * No CMS-configurable content - preserves all existing form logic
 */
export function DigitalCardFormSection({
  section,
  onSubmit,
  isLoading = false
}: DigitalCardFormSectionProps) {
  if (!isDigitalCardFormSection(section)) {
    return null;
  }

  // Return null if no submit handler provided
  if (!onSubmit) {
    return null;
  }

  return (
    <div id="digital-card-form">
      <DigitalCardFormWithPreview
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
