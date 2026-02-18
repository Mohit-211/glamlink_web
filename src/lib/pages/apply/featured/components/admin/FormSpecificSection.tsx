"use client";

import { GetFeaturedSubmission } from "../../types";
import {
  TextField,
  TagField,
  FileUploadField,
  BulletArrayField,
  Field
} from "./FieldRenderers";

interface FormSpecificSectionProps {
  submission: GetFeaturedSubmission;
}

export default function FormSpecificSection({ submission }: FormSpecificSectionProps) {
  const formType = submission.formType;

  // Render Cover Form fields
  if (formType === 'cover') {
    const coverFields = [
      submission.bio,
      submission.achievements?.filter(a => a && a.trim()).length || 0,
      submission.favoriteQuote,
      submission.professionalProduct,
      submission.confidenceStory,
      submission.excitementFeatures?.length || 0,
      submission.painPoints?.length || 0,
      submission.headshots?.length || 0,
      submission.workPhotos?.length || 0
    ];

    const filledFields = coverFields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      return field !== undefined && field !== null && field !== '';
    }).length;

    return (
      <div className="space-y-6">
        <TextField value={submission.bio} label="Bio" />

        <BulletArrayField
          values={submission.achievements}
          label="Achievements"
        />

        {submission.favoriteQuote && (
          <Field label="Favorite Quote">
            <blockquote className="border-l-4 border-glamlink-teal pl-4 italic text-gray-700">
              "{submission.favoriteQuote}"
            </blockquote>
          </Field>
        )}

        <TextField value={submission.professionalProduct} label="Professional Product" />
        <TextField value={submission.confidenceStory} label="Confidence Story" />

        <FileUploadField files={submission.headshots || []} label="Headshots" />
        <FileUploadField files={submission.workPhotos || []} label="Work Photos" />
      </div>
    );
  }

  // Render Local Spotlight Form fields
  if (formType === 'local-spotlight') {
    const localFields = [
      submission.city,
      submission.specialties,
      submission.workExperience,
      submission.socialMedia,
      submission.availability,
      submission.featuredInterest,
      submission.whyLocalSpotlight,
      submission.workPhotos?.length || 0
    ];

    const filledFields = localFields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      return field !== undefined && field !== null && field !== '';
    }).length;

    return (
      <div className="space-y-6">
        <TextField value={submission.city} label="City" />
        <TextField value={submission.specialties} label="Specialties" />
        <TextField value={submission.workExperience} label="Work Experience" />
        <TextField value={submission.socialMedia} label="Social Media" />
        <TextField value={submission.availability} label="Availability" />
        <TextField value={submission.featuredInterest} label="Featured Interest" />
        <TextField value={submission.whyLocalSpotlight} label="Why Local Spotlight" />

        <FileUploadField files={submission.workPhotos || []} label="Work Photos" />
      </div>
    );
  }

  // Render Top Treatment Form fields
  if (formType === 'top-treatment') {
    const treatmentFields = [
      submission.treatmentName,
      submission.treatmentCategory,
      submission.treatmentDescription,
      submission.treatmentBenefits,
      submission.treatmentDuration,
      submission.treatmentPrice,
      submission.treatmentExperience,
      submission.treatmentProcess,
      submission.clientResults,
      submission.idealCandidates,
      submission.aftercareInstructions,
      submission.trainingCertification,
      submission.specialEquipment,
      submission.equipmentDetails,
      submission.consultationOffer,
      submission.whyTopTreatment,
      submission.beforeAfterPhotos?.length || 0
    ];

    const filledFields = treatmentFields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      return field !== undefined && field !== null && field !== '';
    }).length;

    return (
      <div className="space-y-6">
        <TextField value={submission.treatmentName} label="Treatment Name" />
        <TextField value={submission.treatmentCategory} label="Treatment Category" />
        <TextField value={submission.treatmentDescription} label="Treatment Description" />
        <BulletArrayField values={submission.treatmentBenefits} label="Treatment Benefits" />
        <TextField value={submission.treatmentDuration} label="Treatment Duration" />
        <TextField value={submission.treatmentPrice} label="Treatment Price" />
        <TextField value={submission.treatmentExperience} label="Treatment Experience" />
        <TextField value={submission.treatmentProcess} label="Treatment Process" />
        <TextField value={submission.clientResults} label="Client Results" />
        <TextField value={submission.idealCandidates} label="Ideal Candidates" />
        <TextField value={submission.aftercareInstructions} label="Aftercare Instructions" />
        <TextField value={submission.trainingCertification} label="Training Certification" />
        <TextField value={submission.specialEquipment} label="Special Equipment" />
        <TextField value={submission.equipmentDetails} label="Equipment Details" />
        <TextField value={submission.consultationOffer} label="Consultation Offer" />
        <TextField value={submission.whyTopTreatment} label="Why Top Treatment" />

        <FileUploadField files={submission.beforeAfterPhotos || []} label="Before & After Photos" />
      </div>
    );
  }

  // Render Rising Star Form fields
  if (formType === 'rising-star') {
    const risingFields = [
      submission.location,
      submission.instagram,
      submission.careerStartTime,
      submission.backgroundStory,
      submission.careerHighlights,
      submission.uniqueApproach,
      submission.achievementsRisingStar?.filter(a => a && a.trim()).length || 0,
      submission.clientTestimonials,
      submission.industryChallenges,
      submission.innovations,
      submission.futureGoals,
      submission.industryInspiration,
      submission.communityInvolvement,
      submission.communityDetails,
      submission.socialMediaPresence,
      submission.awardsRecognition,
      submission.mediaFeatures,
      submission.mentorshipDetails,
      submission.advice,
      submission.contactPreference,
      submission.additionalInfo,
      submission.portfolioPhotos?.length || 0,
      submission.professionalPhotos?.length || 0
    ];

    const filledFields = risingFields.filter(field => {
      if (Array.isArray(field)) return field.length > 0;
      return field !== undefined && field !== null && field !== '';
    }).length;

    return (
      <div className="space-y-6">
        <TextField value={submission.location} label="Location" />
        <TextField value={submission.instagram} label="Instagram" />
        <TextField value={submission.careerStartTime} label="Career Started" />
        <TextField value={submission.backgroundStory} label="Background Story" />
        <BulletArrayField values={submission.careerHighlights} label="Career Highlights" />
        <TextField value={submission.uniqueApproach} label="Unique Approach" />

        <BulletArrayField
          values={submission.achievementsRisingStar}
          label="Achievements"
        />

        <TextField value={submission.clientTestimonials} label="Client Testimonials" />
        <TextField value={submission.industryChallenges} label="Industry Challenges" />
        <TextField value={submission.innovations} label="Innovations" />
        <TextField value={submission.futureGoals} label="Future Goals" />
        <TextField value={submission.industryInspiration} label="Industry Inspiration" />
        <TextField value={submission.communityInvolvement} label="Community Involvement" />
        <TextField value={submission.communityDetails} label="Community Details" />
        <TextField value={submission.socialMediaPresence} label="Social Media Presence" />
        <TextField value={submission.awardsRecognition} label="Awards & Recognition" />
        <TextField value={submission.mediaFeatures} label="Media Features" />
        <TextField value={submission.mentorshipDetails} label="Mentorship Details" />
        <TextField value={submission.advice} label="Advice for Others" />
        <TextField value={submission.contactPreference} label="Contact Preference" />
        <TextField value={submission.additionalInfo} label="Additional Information" />

        <FileUploadField files={submission.portfolioPhotos || []} label="Portfolio Photos" />
        <FileUploadField files={submission.professionalPhotos || []} label="Professional Photos" />
      </div>
    );
  }

  // No specific form type or profile-only
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No form-specific fields available</p>
    </div>
  );
}