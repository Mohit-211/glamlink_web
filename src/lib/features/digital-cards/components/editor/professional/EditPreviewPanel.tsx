'use client';

import React, { useMemo } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { transformFormDataForPreview } from '@/lib/pages/admin/components/professionals/preview/transformers';
import StyledDigitalCardPreview from '@/lib/features/digital-cards/preview/StyledDigitalCardPreview';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

/**
 * EditPreviewPanel - Live preview panel for the professional edit page
 *
 * Shows the styled digital card preview (same layout as the live /for-professionals/[id] page)
 * with real-time updates as the user edits form fields.
 */
export default function EditPreviewPanel() {
  const { formData } = useFormContext<Partial<Professional>>();

  // Transform form data for preview
  const transformedProfessional = useMemo(() => {
    return transformFormDataForPreview(formData);
  }, [formData]);

  // Determine booking method from preferred booking method
  const bookingMethod = useMemo(() => {
    const pref = formData.preferredBookingMethod;
    if (pref === 'send-text' && formData.phone) return 'send-text';
    if (pref === 'booking-link' && formData.bookingUrl) return 'booking-link';
    if (pref === 'instagram' && formData.instagram) return 'instagram';
    // Fallback: Prefer booking URL if available, otherwise use phone for text-to-book
    if (formData.bookingUrl) return 'booking-link';
    if (formData.phone) return 'text-to-book';
    return undefined;
  }, [formData]);

  // Check if promotions exist
  const showPromoSection = !!(formData.promotions && formData.promotions.length > 0);

  return (
    <div className="min-h-screen py-8">
      <div className="w-full lg:container lg:mx-auto px-4">
        <StyledDigitalCardPreview
          professional={transformedProfessional}
          showPromoSection={showPromoSection}
          bookingMethod={bookingMethod}
          importantInfo={formData.importantInfo}
        />
      </div>
    </div>
  );
}
