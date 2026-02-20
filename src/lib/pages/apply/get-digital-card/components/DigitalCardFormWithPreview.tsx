"use client";

import React from "react";
import type { Professional } from "@/lib/pages/for-professionals/types/professional";
import type { DigitalCardFormData } from "../types";

import FooterSection from "@/lib/features/digital-cards/components/condensed/sections/FooterSection";
import GlamlinkIdLogo from "@/lib/features/digital-cards/preview/components/GlamlinkIdLogo";
import { PreviewRowBasedLayout } from "@/lib/features/digital-cards/preview/components/columns";
import PreviewBookingButton from "@/lib/features/digital-cards/preview/components/PreviewBookingButton";

interface Props {
  formData: DigitalCardFormData;
  previewData: Partial<Professional>;
}

const DigitalCardFormWithPreview: React.FC<Props> = ({
  formData,
  previewData,
}) => {
  const condensedCardConfig =
    previewData.condensedCardConfig ?? {
      sections: [
        { id: "header", type: "header", props: {} },
        { id: "bio", type: "bio", props: {} },
        { id: "specialties", type: "specialties", props: {} },
        { id: "business-hours", type: "business-hours", props: {} },
      ],
    };

  return (
    <div className="bg-gray-100 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-50px)] min-h-[calc(100vh-50px)] xl:sticky xl:top-6">

      {/* Header */}
      <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Live Preview
            </h3>
            <p className="text-sm text-gray-600">
              See how your digital card will look
            </p>
          </div>
          <div className="text-xs text-green-600 font-medium">
            Auto-updating
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="styled-digital-business-card bg-gray-50 p-3">
        <div className="bg-white overflow-hidden rounded-lg"
          style={{
            border: "4px solid #14b8a6",
            background:
              "linear-gradient(135deg, #f5f7fa 0%, #e5e7eb 100%)",
          }}
        >
          <div className="bg-gray-100 rounded-lg p-4">

            <GlamlinkIdLogo height={60} />

            <div className="mt-4 bg-white rounded-xl p-4 shadow">

              <PreviewRowBasedLayout
                professional={previewData}
                condensedCardConfig={condensedCardConfig}
                showPromo={formData.offer_promotion}
                promotionDetails={formData.promotion_details}
                importantInfo={formData.important_info}
              />

              {/* {formData.preferred_booking_method && previewData.phone && (
                <div className="mt-4">
                  <PreviewBookingButton
                    professional={previewData}
                    bookingMethod={formData.preferred_booking_method}
                  />
                </div>
              )} */}

            </div>

            {(previewData.instagram || previewData.website) && (
              <div className="mt-4 border-t pt-4">
                <FooterSection
                  professional={previewData as Professional}
                />
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default DigitalCardFormWithPreview;