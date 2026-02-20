"use client";

import { GetFeaturedFormData } from "../../types";
import { fields_layout as staticFieldsLayout, TabConfig } from "../../config/fields";
import { getFormLayout } from "../../config/formLayouts";
import FormHandler from "./FormHandler";

interface RisingStarFormProps {
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

export default function RisingStarForm({
  formData,
  handleFieldChange,
  handleFieldBlur,
  handleFieldFocus,
  errors,
  isLoading,
  isSubmitting,
  fieldsConfig,
  glamlinkConfig
}: RisingStarFormProps) {
  const formLayout = getFormLayout('risingStar');
  // Use provided config or fall back to static config
  const risingStarFields = fieldsConfig || staticFieldsLayout.risingStar;
  const glamlinkFields = glamlinkConfig || staticFieldsLayout.glamlinkIntegration;

  // Define conditional fields
  const conditionalFields = {
    communityDetails: (data: Record<string, any>) => data.communityInvolvement,
    mentorshipDetails: (data: Record<string, any>) => data.mentorshipOffer,
    promotionDetails: (data: Record<string, any>) => data.promotionOffer === true,
    contentPlanningDate: (data: Record<string, any>) => data.contentPlanningRadio === 'schedule-day',
    contentPlanningMedia: (data: Record<string, any>) => data.contentPlanningRadio === 'create-video'
  };

  // Define custom field handlers for special cases
  const customFieldHandlers = {
    achievements: (fieldKey: string, config: any, value: any, onChange: (fieldKey: string, value: any) => void, error: string | undefined, disabled: boolean) => {
      // Handle achievements array conversion - show as textarea with newlines
      const { CharacterCountField } = require("./fields");

      return (
        <CharacterCountField
          fieldKey={fieldKey}
          config={config}
          value={Array.isArray(value) ? value.join('\n') : value}
          onChange={(fieldKey: string, textValue: string) => {
            const achievementsArray = textValue.split('\n').filter((item: string) => item.trim());
            onChange(fieldKey, achievementsArray);
          }}
          error={error}
          disabled={disabled}
          maxLength={config.validation?.maxLength || 400}
          rows={config.rows || 4}
        />
      );
    }
  };

  return (
    <FormHandler
      formLayout={formLayout}
      fieldsConfig={risingStarFields}
      glamlinkConfig={glamlinkFields}
      formData={formData}
      handleFieldChange={handleFieldChange}
      handleFieldBlur={handleFieldBlur}
      handleFieldFocus={handleFieldFocus}
      errors={errors}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      conditionalFields={conditionalFields}
      customFieldHandlers={customFieldHandlers}
    />
  );
}