import { GetFeaturedFormData, SubmittedFile } from '../../featured/types';

/**
 * Sanitizes form data before submission to Firestore
 * Removes empty values, cleans arrays, and optimizes file data structure
 */
export function sanitizeFormData(formData: GetFeaturedFormData): any {
  const sanitized: any = {
    ...formData,
    // Map applicationType to formType for API compatibility
    formType: formData.applicationType
  };

  // Remove applicationType since we're using formType
  delete sanitized.applicationType;

  // Clean string arrays - filter out empty strings and undefined values
  const stringArrayFields = [
    'primarySpecialties',
    'specialties',        // Digital card form specialties array
    'businessHours',      // Digital card form business hours array
    'achievements',
    'excitementFeatures',
    'painPoints',
    'treatmentBenefits',
    'careerHighlights',
    'achievementsRisingStar'
  ];

  stringArrayFields.forEach(field => {
    if (Array.isArray(sanitized[field])) {
      const cleanedArray = sanitized[field].filter(
        (item: string) => item && item.trim() !== ''
      );
      sanitized[field] = cleanedArray.length > 0 ? cleanedArray : undefined;
    }
  });

  // Clean file arrays - remove base64 data for Firestore, keep only metadata
  const fileArrayFields = [
    'headshots',
    'workPhotos',
    'contentPlanningMedia',
    'beforeAfterPhotos',
    'portfolioPhotos',
    'professionalPhotos'
  ];

  fileArrayFields.forEach(field => {
    if (Array.isArray(sanitized[field])) {
      const cleanedFiles = sanitized[field]
        .filter((file: SubmittedFile) => file && file.name)
        .map((file: SubmittedFile) => {
          console.log('🔍 Sanitizing file:', file.name, 'Has URL:', !!file.url, 'Has Data:', !!file.data);
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: file.data, // Keep base64 data for server-side upload fallback
            url: file.url // Preserve Firebase Storage URL from frontend upload
          };
        });
      sanitized[field] = cleanedFiles.length > 0 ? cleanedFiles : undefined;
    }
  });

  // Clean string fields - remove empty strings
  const stringFields = [
    'fullName',
    'phone',
    'businessName',
    'businessAddress',
    'otherSpecialty',
    'website',
    'instagramHandle',
    'certificationDetails',
    'bio',
    'favoriteQuote',
    'professionalProduct',
    'confidenceStory',
    'bookingLink',
    'contentDays',
    'giveaway',
    'specialOffers',
    'promotionDetails',
    'contentPlanningRadio',
    'contentPlanningDate',
    'hearAboutLocalSpotlight',
    'city',
    'workExperience',
    'socialMedia',
    'availability',
    'featuredInterest',
    'whyLocalSpotlight',
    'treatmentName',
    'treatmentCategory',
    'treatmentDescription',
    'treatmentDuration',
    'treatmentPrice',
    'treatmentExperience',
    'treatmentProcess',
    'clientResults',
    'idealCandidates',
    'aftercareInstructions',
    'trainingCertification',
    'specialEquipment',
    'equipmentDetails',
    'consultationOffer',
    'whyTopTreatment',
    'location',
    'instagram',
    'careerStartTime',
    'backgroundStory',
    'uniqueApproach',
    'clientTestimonials',
    'industryChallenges',
    'innovations',
    'futureGoals',
    'industryInspiration',
    'communityInvolvement',
    'communityDetails',
    'socialMediaPresence',
    'awardsRecognition',
    'mediaFeatures',
    'mentorshipDetails',
    'advice',
    'contactPreference',
    'additionalInfo'
  ];

  stringFields.forEach(field => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      const value = String(sanitized[field]).trim();
      sanitized[field] = value === '' ? undefined : value;
    }
  });

  // Clean boolean fields
  const booleanFields = [
    'certifications',
    'promotionOffer'
  ];

  booleanFields.forEach(field => {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      sanitized[field] = Boolean(sanitized[field]);
    }
  });

  // Clean select fields with default values
  const selectFields = [
    'bookingPreference',
    'ecommerceInterest'
  ];

  selectFields.forEach(field => {
    if (sanitized[field] && (sanitized[field] === '' || sanitized[field] === null)) {
      sanitized[field] = undefined;
    }
  });

  // Add timestamp
  sanitized.submittedAt = new Date().toISOString();

  return sanitized;
}

/**
 * Validates if the sanitized data is within Firestore limits
 */
export function validateFirestoreDataSize(data: any): {
  isValid: boolean;
  estimatedSize: number;
  errors: string[]
} {
  const jsonString = JSON.stringify(data);
  const sizeInBytes = new Blob([jsonString]).size;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  const errors: string[] = [];

  // Firestore document limit is 1MB
  if (sizeInMB > 1) {
    errors.push(`Document size (${sizeInMB.toFixed(2)}MB) exceeds Firestore limit (1MB)`);
  }

  // Check for potential issues
  if (sizeInMB > 0.8) {
    errors.push(`Document size (${sizeInMB.toFixed(2)}MB) is close to Firestore limit (1MB)`);
  }

  return {
    isValid: sizeInMB < 1,
    estimatedSize: sizeInBytes,
    errors
  };
}

/**
 * Extracts file data for separate processing (Phase 2 implementation)
 */
export function extractFileData(formData: GetFeaturedFormData): {
  [field: string]: SubmittedFile[];
} {
  const fileData: { [field: string]: SubmittedFile[] } = {};

  const fileArrayFields: (keyof GetFeaturedFormData)[] = [
    'headshots',
    'workPhotos',
    'contentPlanningMedia',
    'beforeAfterPhotos',
    'portfolioPhotos',
    'professionalPhotos'
  ];

  fileArrayFields.forEach(field => {
    if (Array.isArray(formData[field]) && formData[field].length > 0) {
      fileData[field] = formData[field] as SubmittedFile[];
    }
  });

  return fileData;
}