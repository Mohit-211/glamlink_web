"use client";

import { GetFeaturedFormData } from "../../types";
import { fields_layout as staticFieldsLayout, TabConfig } from "../../config/fields";
import { getFormLayout } from "../../config/formLayouts";
import FormHandler from "./FormHandler";

interface LocalSpotlightFormProps {
  formData: GetFeaturedFormData;
  handleFieldChange: (fieldKey: string, value: any) => void;
  handleFieldBlur?: (fieldKey: string) => void;
  handleFieldFocus?: (fieldKey: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  fieldsConfig?: TabConfig;
  glamlinkConfig?: TabConfig;
}

export default function LocalSpotlightForm({
  formData,
  handleFieldChange,
  handleFieldBlur,
  handleFieldFocus,
  errors,
  isLoading,
  isSubmitting,
  fieldsConfig,
  glamlinkConfig
}: LocalSpotlightFormProps) {
  const formLayout = getFormLayout('localSpotlight');
  // Use provided config or fall back to static config
  const localSpotlightFields = fieldsConfig || staticFieldsLayout.localSpotlight;
  const glamlinkFields = glamlinkConfig || staticFieldsLayout.glamlinkIntegration;

  // Define conditional fields
  const conditionalFields = {
    certificationDetails: (data: Record<string, any>) => data.certifications,
    promotionDetails: (data: Record<string, any>) => data.promotionOffer === true,
    contentPlanningDate: (data: Record<string, any>) => data.contentPlanningRadio === 'schedule-day',
    contentPlanningMedia: (data: Record<string, any>) => data.contentPlanningRadio === 'create-video'
  };

  return (
    <FormHandler
      formLayout={formLayout}
      fieldsConfig={localSpotlightFields}
      glamlinkConfig={glamlinkFields}
      formData={formData}
      handleFieldChange={handleFieldChange}
      handleFieldBlur={handleFieldBlur}
      handleFieldFocus={handleFieldFocus}
      errors={errors}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      conditionalFields={conditionalFields}
    />
  );
}