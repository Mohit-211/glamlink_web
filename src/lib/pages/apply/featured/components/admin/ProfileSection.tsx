"use client";

import { GetFeaturedSubmission } from "../../types";
import {
  EmailField,
  TextField,
  PhoneField,
  UrlField,
  TagField,
  BooleanField,
  ConditionalField
} from "./FieldRenderers";

interface ProfileSectionProps {
  submission: GetFeaturedSubmission;
}

export default function ProfileSection({ submission }: ProfileSectionProps) {
  // Count the number of filled profile fields
  const profileFields = [
    submission.email,
    submission.fullName,
    submission.phone,
    submission.businessName,
    submission.businessAddress,
    submission.primarySpecialties?.length || 0,
    submission.otherSpecialty,
    submission.website,
    submission.instagramHandle,
    submission.certifications,
    submission.certificationDetails,
    submission.formType
  ];

  const filledFields = profileFields.filter(field => {
    if (Array.isArray(field)) return field.length > 0;
    return field !== undefined && field !== null && field !== '';
  }).length;

  return (
    <div className="space-y-6">
      <EmailField value={submission.email} label="Email" />
      <TextField value={submission.fullName} label="Full Name" />
      <PhoneField value={submission.phone} label="Phone Number" />
      <TextField value={submission.businessName} label="Business Name" />
      <TextField value={submission.businessAddress} label="Business Address" />

      {submission.primarySpecialties && submission.primarySpecialties.length > 0 && (
        <TagField
          values={submission.primarySpecialties}
          label="Primary Specialties"
          color="teal"
        />
      )}

      <ConditionalField
        condition={submission.primarySpecialties?.includes('other')}
        label="Other Specialty"
      >
        <TextField value={submission.otherSpecialty} label="Other Specialty" />
      </ConditionalField>

      <UrlField value={submission.website} label="Website" />
      <TextField value={submission.instagramHandle} label="Instagram Handle" />

      <BooleanField
        value={submission.certifications}
        label="Professional Certifications"
        trueText="Has certifications"
        falseText="No certifications"
      />

      <ConditionalField
        condition={submission.certifications}
        label="Certification Details"
      >
        <TextField value={submission.certificationDetails} label="Certification Details" />
      </ConditionalField>

      <TextField value={submission.formType} label="Application Type" />
    </div>
  );
}