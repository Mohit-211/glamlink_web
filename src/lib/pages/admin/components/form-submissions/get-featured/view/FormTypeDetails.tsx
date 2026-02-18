'use client';

import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';
import {
  CollapsibleSection,
  FieldDisplay,
  TextareaDisplay,
  ArrayDisplay,
  FilesDisplay,
  CheckboxArrayDisplay
} from '@/lib/pages/admin/components/shared/common/collapse-display';

interface FormTypeDetailsProps {
  submission: GetFeaturedSubmission;
}

export function CoverDetails({ submission }: FormTypeDetailsProps) {
  return (
    <CollapsibleSection title="Cover Feature Details" defaultOpen={true}>
      <TextareaDisplay label="Bio" value={submission.bio} />
      <TextareaDisplay label="Favorite Quote" value={submission.favoriteQuote} />
      <TextareaDisplay label="Confidence Story" value={submission.confidenceStory} />
      <TextareaDisplay label="Professional Product" value={submission.professionalProduct} />
      <ArrayDisplay label="Achievements" items={submission.achievements} />
      <TextareaDisplay label="Industry Challenges" value={submission.industryChallenges} />
      <TextareaDisplay label="Innovations" value={submission.innovations} />
      <TextareaDisplay label="Future Goals" value={submission.futureGoals} />
      <TextareaDisplay label="Industry Inspiration" value={submission.industryInspiration} />
      <FilesDisplay label="Headshots" files={submission.headshots} />
      <FilesDisplay label="Work Photos" files={submission.workPhotos} />
    </CollapsibleSection>
  );
}

export function LocalSpotlightDetails({ submission }: FormTypeDetailsProps) {
  return (
    <CollapsibleSection title="Local Spotlight Details" defaultOpen={true}>
      <TextareaDisplay label="Work Experience" value={submission.workExperience} />
      <FilesDisplay label="Work Photos" files={submission.workPhotos} />
    </CollapsibleSection>
  );
}

export function RisingStarDetails({ submission }: FormTypeDetailsProps) {
  return (
    <CollapsibleSection title="Rising Star Details" defaultOpen={true}>
      <FieldDisplay label="Career Start Time" value={submission.careerStartTime} />
      <TextareaDisplay label="Background Story" value={submission.backgroundStory} />
      <ArrayDisplay label="Career Highlights" items={submission.careerHighlights} />
      <TextareaDisplay label="Unique Approach" value={submission.uniqueApproach} />
      <TextareaDisplay label="Client Testimonials" value={submission.clientTestimonials} />
      <TextareaDisplay label="Innovations" value={submission.innovations} />
      <TextareaDisplay label="Future Goals" value={submission.futureGoals} />
      <TextareaDisplay label="Advice" value={submission.advice} />
      <FilesDisplay label="Portfolio Photos" files={submission.portfolioPhotos} />
      <FilesDisplay label="Professional Photos" files={submission.professionalPhotos} />
    </CollapsibleSection>
  );
}

export function TopTreatmentDetails({ submission }: FormTypeDetailsProps) {
  return (
    <CollapsibleSection title="Top Treatment Details" defaultOpen={true}>
      <FieldDisplay label="Treatment Name" value={submission.treatmentName} />
      <TextareaDisplay label="Treatment Description" value={submission.treatmentDescription} />
      <ArrayDisplay label="Treatment Benefits" items={submission.treatmentBenefits} />
      <FieldDisplay label="Duration" value={submission.treatmentDuration} />
      <FieldDisplay label="Frequency" value={submission.treatmentFrequency} />
      <FieldDisplay label="Price Range" value={submission.treatmentPrice} />
      <TextareaDisplay label="Your Experience" value={submission.treatmentExperience} />
      <TextareaDisplay label="Client Results" value={submission.clientResults} />
      <TextareaDisplay label="Ideal Candidates" value={submission.idealCandidates} />
      <TextareaDisplay label="Aftercare Instructions" value={submission.aftercareInstructions} />
      <FilesDisplay label="Before/After Photos" files={submission.beforeAfterPhotos} />
    </CollapsibleSection>
  );
}

export function GlamlinkIntegrationDetails({ submission }: FormTypeDetailsProps) {
  return (
    <CollapsibleSection title="Glamlink Integration" defaultOpen={false}>
      <CheckboxArrayDisplay label="Excitement Features" items={submission.excitementFeatures} />
      <CheckboxArrayDisplay label="Pain Points" items={submission.painPoints} />
      <FieldDisplay
        label="Promotion Offer"
        value={submission.promotionOffer ? 'Yes' : 'No'}
      />
      <TextareaDisplay label="Promotion Details" value={submission.promotionDetails} />
      <FieldDisplay
        label="Instagram Consent"
        value={submission.instagramConsent ? 'Consented' : 'Not Consented'}
      />
      <TextareaDisplay label="How They Heard About Us" value={submission.hearAboutLocalSpotlight} />
      <TextareaDisplay label="Content Planning Date" value={submission.contentPlanningDate} />
      <FilesDisplay label="Content Planning Media" files={submission.contentPlanningMedia} />
    </CollapsibleSection>
  );
}
