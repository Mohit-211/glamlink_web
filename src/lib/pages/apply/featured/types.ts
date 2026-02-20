// File is a global type in browser environments

export interface GetFeaturedFormData {
  // Profile fields
  email: string;
  fullName: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  primarySpecialties: string[];
  otherSpecialty: string;
  website: string;
  instagramHandle: string;
  certifications: boolean;
  certificationDetails: string;
  applicationType: string;

  // Magazine fields (Cover form)
  bio: string;
  headshots: SubmittedFile[];
  workPhotos: SubmittedFile[];
  achievements: string[];
  favoriteQuote: string;
  professionalProduct: string;
  confidenceStory: string;
  excitementFeatures: string[];
  painPoints: string[];
  bookingPreference: 'in-app' | 'external';
  bookingLink: string;
  ecommerceInterest: 'yes' | 'later';
  contentDays: string;
  giveaway: string;
  specialOffers: string;

  // Glamlink Integration fields
  promotionOffer: boolean;
  promotionDetails: string;
  contentPlanningRadio: string;
  contentPlanningDate: string;
  contentPlanningMedia: SubmittedFile[];
  hearAboutLocalSpotlight: string;

  // Local Spotlight fields
  city: string;
  specialties: string;
  workExperience: string;
  socialMedia: string;
  availability: string;
  featuredInterest: string;
  whyLocalSpotlight: string;

  // Top Treatment fields
  treatmentName: string;
  treatmentCategory: string;
  treatmentDescription: string;
  treatmentBenefits: string[];
  treatmentDuration: string;
  treatmentPrice: string;
  treatmentExperience: string;
  treatmentProcess: string;
  clientResults: string;
  idealCandidates: string;
  aftercareInstructions: string;
  trainingCertification: string;
  specialEquipment: string;
  equipmentDetails: string;
  consultationOffer: string;
  whyTopTreatment: string;
  beforeAfterPhotos: SubmittedFile[];

  // Rising Star fields
  location: string;
  instagram: string;
  careerStartTime: string;
  backgroundStory: string;
  careerHighlights: string[];
  uniqueApproach: string;
  achievementsRisingStar: string[];
  clientTestimonials: string;
  industryChallenges: string;
  innovations: string;
  futureGoals: string;
  industryInspiration: string;
  communityInvolvement: string;
  communityDetails: string;
  socialMediaPresence: string;
  awardsRecognition: string;
  mediaFeatures: string;
  mentorshipDetails: string;
  advice: string;
  contactPreference: string;
  additionalInfo: string;
  portfolioPhotos: SubmittedFile[];
  professionalPhotos: SubmittedFile[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface TabValidationState {
  profile: boolean;
  magazine: boolean;
}

export interface SubmittedFile {
  name: string;
  type: string;
  size: number;
  data?: string; // base64 data (optional for backward compatibility)
  url?: string; // Firebase Storage URL (optional for future use)
}

export interface GetFeaturedSubmission extends Omit<GetFeaturedFormData,
  'headshots' | 'workPhotos' | 'city' | 'specialties' | 'workExperience' | 'socialMedia' | 'availability' | 'featuredInterest' | 'whyLocalSpotlight' | 'hearAboutUs' |
  'treatmentName' | 'treatmentCategory' | 'treatmentDescription' | 'treatmentBenefits' | 'treatmentDuration' | 'treatmentPrice' | 'treatmentExperience' | 'treatmentProcess' | 'clientResults' | 'idealCandidates' | 'aftercareInstructions' | 'trainingCertification' | 'specialEquipment' | 'equipmentDetails' | 'consultationOffer' | 'whyTopTreatment' |
  'location' | 'instagram' | 'careerStartTime' | 'backgroundStory' | 'careerHighlights' | 'uniqueApproach' | 'achievementsRisingStar' | 'clientTestimonials' | 'industryChallenges' | 'innovations' | 'futureGoals' | 'industryInspiration' | 'communityInvolvement' | 'communityDetails' | 'socialMediaPresence' | 'awardsRecognition' | 'mediaFeatures' | 'mentorshipDetails' | 'advice' | 'contactPreference' | 'additionalInfo' |
  'beforeAfterPhotos' | 'portfolioPhotos' | 'professionalPhotos'
> {
  // Common fields
  id: string;
  formType: 'cover' | 'local-spotlight' | 'top-treatment' | 'rising-star' | 'profile-only';
  headshots: SubmittedFile[];
  workPhotos: SubmittedFile[];
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  reviewed: boolean;
  instagramConsent?: boolean;
  metadata?: {
    userAgent: string;
    ip: string;
    source: string;
  };

  // Local Spotlight form fields
  city?: string;
  specialties?: string;
  workExperience?: string;
  socialMedia?: string;
  availability?: string;
  featuredInterest?: string;
  whyLocalSpotlight?: string;
  hearAboutUs?: string;

  // Top Treatment form fields
  treatmentName?: string;
  treatmentCategory?: string;
  treatmentDescription?: string;
  treatmentBenefits?: string[];
  treatmentDuration?: string;
  treatmentFrequency?: string;
  treatmentPrice?: string;
  treatmentExperience?: string;
  treatmentProcess?: string;
  clientResults?: string;
  idealCandidates?: string;
  aftercareInstructions?: string;
  trainingCertification?: string;
  specialEquipment?: string;
  equipmentDetails?: string;
  consultationOffer?: string;
  whyTopTreatment?: string;

  // Rising Star form fields
  location?: string;
  instagram?: string;
  careerStartTime?: string;
  backgroundStory?: string;
  careerHighlights?: string[];
  uniqueApproach?: string;
  achievementsRisingStar?: string[];
  clientTestimonials?: string;
  industryChallenges?: string;
  innovations?: string;
  futureGoals?: string;
  industryInspiration?: string;
  communityInvolvement?: string;
  communityDetails?: string;
  socialMediaPresence?: string;
  awardsRecognition?: string;
  mediaFeatures?: string;
  mentorshipDetails?: string;
  advice?: string;
  contactPreference?: string;
  additionalInfo?: string;

  // Additional image arrays
  beforeAfterPhotos?: SubmittedFile[];
  portfolioPhotos?: SubmittedFile[];
  professionalPhotos?: SubmittedFile[];
}

// Import FormConfigsData type for props
import type { FormConfigsData } from '../shared/services/formConfigService';

export interface GetFeaturedFormProps {
  onSubmit: (data: GetFeaturedFormData) => Promise<void>;
  isLoading?: boolean;
  configs?: FormConfigsData;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
  completedFields: string[];
}

export interface TabConfig {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}