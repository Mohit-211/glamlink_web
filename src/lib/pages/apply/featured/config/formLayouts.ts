// Form data structure templates for Get Featured forms

export interface FormLayout {
  title: string;
  description: string;
  icon: string;
  bannerColor: string;
  sections: FormSection[];
}

export interface FormSection {
  title: string;
  description?: string;
  fields: string[];
  layout?: 'grid' | 'single';
}

// Closing layout - shared across all forms
export const closingLayout: FormLayout = {
  title: "Glamlink Integration & Promotion",
  description: "Complete your feature submission with integration details and content planning.",
  icon: "sparkles",
  bannerColor: "bg-gradient-to-r from-teal-600 to-cyan-600",
  sections: [
    {
      title: "Content Promotion",
      description: "Let's create buzz before your feature drop",
      fields: ["contentPlanningRadio", "contentPlanningDate", "contentPlanningMedia", "hearAboutLocalSpotlight"],
      layout: "single"
    },
    {
      title: "Glamlink Integration",
      description: "Your feature connects to Glamlink, our interactive platform built for the beauty and wellness community - where pros get booked, sell products, and share their work.",
      fields: ["excitementFeatures", "painPoints", "promotionOffer", "promotionDetails", "instagramConsent"],
      layout: "single"
    }
  ]
};

// Cover form layout (formerly magazine)
export const coverFormLayout: FormLayout = {
  title: "Cover Feature",
  description: "Get featured on the cover of Glamlink Magazine! Share your story, showcase your work, and inspire beauty professionals across the industry.",
  icon: "star",
  bannerColor: "bg-gradient-to-r from-purple-600 to-pink-600",
  sections: [
    {
      title: "Your Story",
      description: "Tell us about your journey and what makes you unique",
      fields: ["bio", "favoriteQuote", "confidenceStory"]
    },
    {
      title: "Professional Work",
      description: "Showcase your best work and achievements",
      fields: ["headshots", "workPhotos", "achievements", "professionalProduct"]
    },
    {
      title: "Industry Impact",
      description: "Your influence and innovations",
      fields: ["industryChallenges", "innovations", "futureGoals", "industryInspiration"]
    }
  ]
};

// Local Spotlight form layout
export const localSpotlightFormLayout: FormLayout = {
  title: "Local Spotlight Feature",
  description: "Get featured as a local beauty professional! Share your expertise, showcase your work, and connect with clients in your community.",
  icon: "location",
  bannerColor: "bg-gradient-to-r from-teal-600 to-blue-600",
  sections: [
    {
      title: "Professional Information",
      description: "Your expertise and experience",
      fields: ["workPhotos", "workExperience"]
    }
  ]
};

// Rising Star form layout
export const risingStarFormLayout: FormLayout = {
  title: "Rising Star Feature",
  description: "Are you an emerging talent in the beauty industry? We want to showcase your journey, achievements, and potential to inspire others!",
  icon: "rocket",
  bannerColor: "bg-gradient-to-r from-indigo-600 to-purple-600",
  sections: [
    {
      title: "Career Background",
      description: "Your journey in the beauty industry",
      fields: ["careerStartTime", "backgroundStory", "careerHighlights", "uniqueApproach"]
    },
    {
      title: "Achievements & Portfolio",
      description: "Showcase your best work and accomplishments",
      fields: ["portfolioPhotos", "professionalPhotos", "clientTestimonials"]
    },
    {
      title: "Industry Impact",
      description: "Your influence and innovations",
      fields: ["innovations", "futureGoals"]
    },
    {
      title: "Mentorship & Advice",
      description: "Sharing knowledge with others",
      fields: ["mentorshipOffer", "mentorshipDetails", "advice"]
    }
  ]
};

// Top Treatment form layout
export const topTreatmentFormLayout: FormLayout = {
  title: "Top Treatment Feature",
  description: "Showcase your signature beauty treatment! Help clients discover your unique services and expertise.",
  icon: "sparkles",
  bannerColor: "bg-gradient-to-r from-pink-600 to-rose-600",
  sections: [
    {
      title: "Treatment Details",
      description: "Everything about your signature treatment",
      fields: ["treatmentName", "treatmentDescription", "treatmentBenefits", "treatmentDuration", "treatmentFrequency", "treatmentPrice"],
      layout: "single"
    },
    {
      title: "Your Expertise",
      description: "Your experience and results",
      fields: ["treatmentExperience", "beforeAfterPhotos", "clientResults"]
    },
    {
      title: "Client Information",
      description: "Who this treatment is for",
      fields: ["idealCandidates", "aftercareInstructions"]
    }
  ]
};


// Form layout configurations
export const formLayouts = {
  cover: coverFormLayout,
  localSpotlight: localSpotlightFormLayout,
  risingStar: risingStarFormLayout,
  topTreatment: topTreatmentFormLayout
};

// Helper function to get form layout by type
export function getFormLayout(formType: 'cover' | 'localSpotlight' | 'risingStar' | 'topTreatment'): FormLayout {
  return formLayouts[formType];
}

// Helper function to get all form types
export function getFormTypes(): Array<'cover' | 'localSpotlight' | 'risingStar' | 'topTreatment'> {
  return Object.keys(formLayouts) as Array<'cover' | 'localSpotlight' | 'risingStar' | 'topTreatment'>;
}