"use client";

import { GetFeaturedFormData } from "../../types";
import { fields_layout as staticFieldsLayout, TabConfig } from "../../config/fields";
import { TextField, MultiCheckboxField, SelectField, CheckboxOptionField, CheckboxField, TextareaField } from "@/lib/pages/apply/shared/components/fields";

interface ProfileInfoFormProps {
  formData: GetFeaturedFormData;
  handleFieldChange: (fieldKey: string, value: any) => void;
  handleFieldBlur?: (fieldKey: string) => void;
  handleFieldFocus?: (fieldKey: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
  profileConfig?: TabConfig;
}

export default function ProfileInfoForm({
  formData,
  handleFieldChange,
  handleFieldBlur,
  handleFieldFocus,
  errors,
  disabled = false,
  profileConfig
}: ProfileInfoFormProps) {
  // Use provided config or fall back to static config
  const profileFields = profileConfig || staticFieldsLayout.profile;

  // Fields for the first row (2 columns)
  const firstRowFields = ['email', 'fullName', 'phone', 'businessName'];

  // Fields for the second row (2 columns)
  const secondRowFields = ['website', 'instagramHandle'];

  // Check if "Other" is selected in primary specialties
  const showOtherSpecialty = Array.isArray(formData.primarySpecialties) &&
    formData.primarySpecialties.includes('other');

  return (
    <div className="space-y-8">
      {/* First Row - 4 fields in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {firstRowFields.map(fieldKey => {
          const config = profileFields[fieldKey as keyof typeof profileFields];
          const value = formData[fieldKey as keyof GetFeaturedFormData];
          const error = errors[fieldKey];

          return (
            <TextField
              key={fieldKey}
              fieldKey={fieldKey}
              config={config}
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              onFocus={handleFieldFocus}
              error={error}
              disabled={disabled}
            />
          );
        })}
      </div>

      {/* Second Row - 2 fields in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondRowFields.map(fieldKey => {
          const config = profileFields[fieldKey as keyof typeof profileFields];
          const value = formData[fieldKey as keyof GetFeaturedFormData];
          const error = errors[fieldKey];

          return (
            <TextField
              key={fieldKey}
              fieldKey={fieldKey}
              config={config}
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              onFocus={handleFieldFocus}
              error={error}
              disabled={disabled}
            />
          );
        })}
      </div>

      {/* Primary Specialties - Full width */}
      <div className="col-span-full">
        <MultiCheckboxField
          fieldKey="primarySpecialties"
          config={profileFields.primarySpecialties}
          value={formData.primarySpecialties}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          onFocus={handleFieldFocus}
          error={errors.primarySpecialties}
          disabled={disabled}
          options={profileFields.primarySpecialties.options || []}
          minSelections={1}
          columns={2}
        />
      </div>

      {/* Other Specialty - Conditional field */}
      {showOtherSpecialty && (
        <div className="col-span-full">
          <div className="transition-all duration-200">
            <input
              type="text"
              value={formData.otherSpecialty || ''}
              onChange={(e) => handleFieldChange('otherSpecialty', e.target.value)}
              onBlur={() => handleFieldBlur?.('otherSpecialty')}
              onFocus={() => handleFieldFocus?.('otherSpecialty')}
              placeholder="Specify your specialty"
              disabled={disabled}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
                border-gray-300 focus:ring-glamlink-teal focus:border-glamlink-teal
                ${errors.otherSpecialty ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
            />
            {errors.otherSpecialty && (
              <p className="mt-1 text-sm text-red-500">{errors.otherSpecialty}</p>
            )}
          </div>
        </div>
      )}

      {/* Business Address - Full width */}
      <div className="col-span-full">
        <TextField
          fieldKey="businessAddress"
          config={profileFields.businessAddress}
          value={formData.businessAddress}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          onFocus={handleFieldFocus}
          error={errors.businessAddress}
          disabled={disabled}
        />
      </div>

      {/* Certifications - Full width */}
      <div className="col-span-full">
        <CheckboxField
          fieldKey="certifications"
          config={profileFields.certifications}
          value={formData.certifications}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          onFocus={handleFieldFocus}
          error={errors.certifications}
          disabled={disabled}
        />
      </div>

      {/* Certification Details - Full width, conditional */}
      {formData.certifications === true && (
        <div className="col-span-full">
          <TextareaField
            fieldKey="certificationDetails"
            config={profileFields.certificationDetails}
            value={formData.certificationDetails}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            onFocus={handleFieldFocus}
            error={errors.certificationDetails}
            disabled={disabled}
          />
        </div>
      )}

      {/* Application Type - Full width */}
      <div className="col-span-full">
        <SelectField
          fieldKey="applicationType"
          config={profileFields.applicationType}
          value={formData.applicationType}
          onChange={handleFieldChange}
          error={errors.applicationType}
          disabled={disabled}
          options={profileFields.applicationType.options || []}
        />
      </div>
    </div>
  );
}