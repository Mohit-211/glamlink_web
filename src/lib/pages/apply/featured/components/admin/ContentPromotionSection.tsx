"use client";

import { GetFeaturedSubmission } from "../../types";
import {
  TextField,
  BooleanField,
  ConditionalField,
  Field,
  FileUploadField
} from "./FieldRenderers";

interface ContentPromotionSectionProps {
  submission: GetFeaturedSubmission;
}

export default function ContentPromotionSection({ submission }: ContentPromotionSectionProps) {
  // Count the number of filled content promotion fields
  const contentFields = [
    submission.contentPlanningRadio,
    submission.contentPlanningDate,
    submission.contentPlanningMedia?.length || 0,
    submission.hearAboutLocalSpotlight
  ];

  const filledFields = contentFields.filter(field => {
    if (Array.isArray(field)) return field.length > 0;
    return field !== undefined && field !== null && field !== '';
  }).length;

  return (
    <div className="space-y-6">
      {/* Content Planning Radio */}
      {submission.contentPlanningRadio && (
        <Field label="Content Planning">
          <p className="text-gray-700">
            {submission.contentPlanningRadio === 'schedule-day'
              ? 'Prefers to schedule content creation for a specific day'
              : 'Flexible with content scheduling'}
          </p>
        </Field>
      )}

      {/* Content Planning Date (conditional) */}
      <ConditionalField
        condition={submission.contentPlanningRadio === 'schedule-day'}
        label="Preferred Content Date"
      >
        <TextField value={submission.contentPlanningDate} label="Preferred Content Date" />
      </ConditionalField>

      {/* Content Planning Media Files */}
      <FileUploadField
        files={submission.contentPlanningMedia || []}
        label="Content Planning Media"
      />

      {/* How did you hear about us */}
      <TextField value={submission.hearAboutLocalSpotlight} label="How did you hear about Local Spotlight?" />
    </div>
  );
}