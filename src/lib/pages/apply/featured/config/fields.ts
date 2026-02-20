// Field configuration for Get Featured Application
export interface FieldConfig {
  type: 'text' | 'email' | 'tel' | 'textarea' | 'file-upload' | 'checkbox' | 'radio' | 'bullet-array' | 'select' | 'multi-checkbox';
  label: string;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  helperText?: string;
  description?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minChars?: number; // explicit minimum character requirement
    validateOnBlur?: boolean; // enable blur validation
    clearErrorOnFocus?: boolean; // clear errors when field gains focus
    pattern?: RegExp;
    minFiles?: number;
    maxFiles?: number;
    maxSize?: number; // in MB
    accept?: string;
    message?: string;
  };
  options?: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  maxLength?: number; // for textarea
  rows?: number; // for textarea
  maxPoints?: number; // for bullet-array
  minSelections?: number; // for multi-checkbox
  maxSelections?: number; // for multi-checkbox
  columns?: number; // for multi-checkbox
}

export interface TabConfig {
  [key: string]: FieldConfig;
}

export interface FieldsLayout {
  profile: TabConfig;
  glamlinkIntegration: TabConfig;
  cover: TabConfig;
  localSpotlight: TabConfig;
  risingStar: TabConfig;
  topTreatment: TabConfig;
}

export const fields_layout: FieldsLayout = {
  profile: {
    email: {
      type: 'email',
      label: 'Email',
      required: true,
      defaultValue: 'mohit@blockcod.com',
      placeholder: 'your@email.com',
      helperText: 'Record mohit@blockcod.com as the email to be included with my response',
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        minChars: 6,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Email must be at least 6 characters (e.g., a@b.co)'
      }
    },
    fullName: {
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your full name',
      validation: {
        minChars: 2,
        maxLength: 100,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        pattern: /^[a-zA-Z\s\-'\.]+$/,
        message: 'Full name must be at least 2 characters'
      }
    },
    phone: {
      type: 'tel',
      label: 'Phone Number',
      required: true,
      placeholder: '(555) 123-4567',
      helperText: 'Include country code if outside the US',
      validation: {
        pattern: /^[\d\s\-\+\(\)]+$/,
        minLength: 10,
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Phone number must be at least 10 digits'
      }
    },
    businessName: {
      type: 'text',
      label: 'Business Name',
      required: true,
      placeholder: 'Enter your business name',
      validation: {
        minChars: 2,
        maxLength: 100,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        pattern: /^[a-zA-Z\s\-'\.]+$/,        
        message: 'Business name must be at least 2 characters'
      }
    },
    businessAddress: {
      type: 'text',
      label: 'Business Address',
      required: true,
      placeholder: 'Enter your business address',
      validation: {
        minLength: 5,
        minChars: 10,
        maxLength: 200,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Please enter a complete address (minimum 10 characters)'
      }
    },
    primarySpecialties: {
      type: 'multi-checkbox',
      label: 'Primary Specialties',
      required: true,
      helperText: 'Select all that apply to your business',
      minSelections: 1,
      columns: 2,
      options: [
        { id: 'hair_stylist', label: 'Hair Stylist' },
        { id: 'makeup_artist', label: 'Makeup Artist' },
        { id: 'esthetician', label: 'Esthetician' },
        { id: 'nail_tech', label: 'Nail Tech' },
        { id: 'massage_therapist', label: 'Massage Therapist' },
        { id: 'wellness', label: 'Wellness' },
        { id: 'injector', label: 'Injector' },
        { id: 'med_spa', label: 'Med Spa' },
        { id: 'other', label: 'Other' }
      ],
      validation: {
        message: 'Please select at least one specialty'
      }
    },
    otherSpecialty: {
      type: 'text',
      label: 'Other Specialty',
      required: false,
      placeholder: 'Specify your specialty',
      validation: {
        maxLength: 100,
        minChars: 3,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'If provided, other specialty must be at least 3 characters'
      }
    },
    website: {
      type: 'text',
      label: 'Website',
      required: false,
      placeholder: 'https://yourwebsite.com',
      validation: {
        minChars: 4,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'If provided, website must be at least 4 characters (e.g., https://example.com, x.co, www.glamlink.net)'
      }
    },
    instagramHandle: {
      type: 'text',
      label: 'Instagram Handle',
      required: true,
      placeholder: '@yourhandle',
      validation: {
        pattern: /^@?[a-zA-Z0-9_.]+$/,
        maxLength: 30,
        minChars: 2,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Instagram handle must be at least 2 characters (excluding @)'
      }
    },
    applicationType: {
      type: 'select',
      label: 'Application Type',
      required: false,
      helperText: 'Choose the type of feature you\'d like to apply for',
      options: [
        { id: 'local-spotlight', label: 'Local Spotlight' },
        { id: 'top-treatment', label: 'Top Treatment' },
        { id: 'cover', label: 'Cover Feature' },
        { id: 'rising-star', label: 'Rising Star' }
      ],
      defaultValue: 'local-spotlight'
    },
    certifications: {
      type: 'checkbox',
      label: 'Do you have any professional certifications?',
      required: false,
      validation: {
        message: ''
      }
    },
    certificationDetails: {
      type: 'textarea',
      label: 'Certification Details',
      required: false,
      maxLength: 3000,
      rows: 3,
      placeholder: 'List your certifications and where you received them...',
      validation: {
        maxLength: 3000,
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'If provided, certification details must be at least 10 characters'
      }
    }
  },
  glamlinkIntegration: {
    excitementFeatures: {
      type: 'multi-checkbox',
      label: 'What excites you about Glamlink',
      required: true,
      helperText: 'Select all features that excite you',
      minSelections: 1,
      columns: 2,
      options: [
        {
          id: 'discovery',
          label: 'Clients ability to discover pros nearby and check out their services, work, reviews, etc',
        },
        {
          id: 'booking',
          label: 'Seamless booking inside Glamlink either in app or goes directly to your booking link',
        },
        {
          id: 'ecommerce',
          label: 'Pro shops & e-commerce',
        },
        {
          id: 'magazine',
          label: 'The Glamlink Edit magazine & spotlights',
        },
        {
          id: 'ai',
          label: 'AI powered discovery & smart recommendations (coming soon)',
        },
        {
          id: 'community',
          label: 'Community & networking with other pros',
        },
      ],
      validation: {
        message: 'Please select at least one feature that excites you'
      }
    },
    painPoints: {
      type: 'multi-checkbox',
      label: 'Biggest pain points',
      required: true,
      helperText: 'Select all pain points that apply to you',
      minSelections: 1,
      columns: 2,
      options: [
        {
          id: 'no-conversions',
          label: 'Posting but no conversions',
        },
        {
          id: 'dms-backforth',
          label: 'DMs-too much back and forth',
        },
        {
          id: 'no-shows',
          label: 'No shows',
        },
        {
          id: 'juggling-platforms',
          label: 'Juggling too many platforms (booking, social media, e-commerce, etc)',
        },
        {
          id: 'inventory-not-tied',
          label: 'Inventory/aftercare not tied to treatments',
        },
        {
          id: 'client-notes-everywhere',
          label: 'Client notes/consents all over the place',
        },
        {
          id: 'finding-clients',
          label: 'Finding new clients',
        },
        {
          id: 'no-pain-points',
          label: 'None of the above',
        }
      ],
      validation: {
        message: 'Please select at least one pain point'
      }
    },
    promotionOffer: {
      type: 'checkbox',
      label: 'I would like to offer a promotion with this feature',
      required: false,
      options: [
        {
          id: 'offer-promotion',
          label: 'Yes, I want to offer a promotion'
        }
      ]
    },
    promotionDetails: {
      type: 'textarea',
      label: 'What promotion would you like to run?',
      required: false,
      placeholder: 'Describe your promotion (e.g., 20% off first visit, free consultation with booking, etc.)',
      rows: 3,
      maxLength: 5000,
      validation: {
        maxLength: 5000,
        minChars: 15,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'If offering a promotion, please provide at least 15 characters describing it'
      }
    },
    instagramConsent: {
      type: 'checkbox',
      label: 'I consent to have Glamlink create a free professional profile using publically available instagram content to help build my professional portfolio',
      required: true,
      options: [
        {
          id: 'instagram-consent',
          label: 'I agree to profile creation using Instagram content'
        }
      ],
      validation: {
        message: 'Please consent to profile creation using Instagram content'
      }
    },
    contentPlanningRadio: {
      type: 'radio',
      label: 'Content planning should be scheduled 2 weeks before being featured',
      required: true,
      options: [
        {
          id: 'schedule-day',
          label: 'Schedule a day for content'
        },
        {
          id: 'create-video',
          label: 'Create a video of your space or of a treatment'
        }
      ],
      validation: {
        message: 'Please select a content planning option'
      }
    },
    contentPlanningDate: {
      type: 'textarea',
      label: 'Say what dates work well below',
      required: false,
      placeholder: 'Please provide your preferred dates for content creation...',
      rows: 3,
      maxLength: 3000,
      validation: {
        minChars: 8,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        maxLength: 3000,
        message: 'Date information must be 3000 characters or less'
      }
    },
    contentPlanningMedia: {
      type: 'file-upload',
      label: 'Upload your images and video below',
      required: false,
      helperText: 'Upload images or videos of your space or treatments',
      validation: {
        maxFiles: 5,
        maxSize: 50,
        accept: 'image/*,video/*',
        message: 'Maximum 5 files, up to 50MB each'
      }
    },
    hearAboutLocalSpotlight: {
      type: 'textarea',
      label: 'How did you hear about Glamlink?',
      required: true,
      placeholder: 'Tell us how you discovered The Glamlink Edit...',
      rows: 3,
      maxLength: 4000,
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Please tell us how you heard about Glamlink (minimum 10 characters)'
      }
    }
  },
  cover: {
    bio: {
      type: 'textarea',
      label: 'Bio (A brief story about your journey, how you got started)',
      required: true,
      placeholder: 'Tell us your story...',
      helperText: 'Then Marie will send you follow up questions',
      rows: 4,
      validation: {
        minLength: 50,
        minChars: 50,
        maxLength: 3000,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Bio must be at least 50 characters to provide meaningful information'
      }
    },
    headshots: {
      type: 'file-upload',
      label: 'Headshots 2-3',
      required: true,
      validation: {
        minFiles: 2,
        maxFiles: 3,
        maxSize: 50,
        accept: 'image/*,video/*',
        message: 'Please upload at least 2 headshots or videos (max 3, up to 50MB each)'
      }
    },
    workPhotos: {
      type: 'file-upload',
      label: '3 Photos Of Your Work',
      required: true,
      validation: {
        minFiles: 3,
        maxFiles: 5,
        maxSize: 100,
        accept: 'image/*,video/*',
        message: 'Please upload at least 3 work photos or videos (max 5, up to 100MB each)'
      }
    },
    achievements: {
      type: 'bullet-array',
      label: '5 Achievements-Bullet Points',
      required: true,
      placeholder: 'Enter an achievement',
      maxPoints: 5,
      helperText: 'List your top 5 professional achievements',
      validation: {
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Each achievement must be at least 10 characters'
      }
    },
    favoriteQuote: {
      type: 'textarea',
      label: 'Your favorite quote',
      required: true,
      placeholder: 'Enter your favorite quote...',
      rows: 2,
      maxLength: 5000,
      validation: {
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Favorite quote must be at least 10 characters'
      }
    },
    professionalProduct: {
      type: 'textarea',
      label: 'Your Favorite Professional Product (Ideally something you sell) and why',
      required: true,
      placeholder: 'Tell us about your favorite product and why...',
      rows: 3,
      maxLength: 5000,
      validation: {
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Professional product description must be at least 30 characters'
      }
    },
    confidenceStory: {
      type: 'textarea',
      label: 'A heart warming story where you changed someone\'s confidence with a treatment',
      required: true,
      placeholder: 'Share your story...',
      rows: 4,
      maxLength: 5000,
      validation: {
        minLength: 50,
        minChars: 50,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Confidence story must be at least 50 characters'
      }
    },
     industryChallenges: {
      type: 'textarea',
      label: 'Industry Challenges You\'ve Overcome',
      required: true,
      maxLength: 5000,
      rows: 3,
      placeholder: 'What challenges have you faced in the industry and how did you overcome them?',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 50,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Industry challenges description must be at least 50 characters'
      }
    },
    innovations: {
      type: 'textarea',
      label: 'Innovations or New Techniques',
      required: true,
      maxLength: 5000,
      rows: 3,
      placeholder: 'Have you developed any unique techniques or brought innovations to your field?',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Innovations description must be at least 30 characters'
      }
    },
    futureGoals: {
      type: 'textarea',
      label: 'Future Goals and Aspirations',
      required: true,
      maxLength: 4000,
      rows: 3,
      placeholder: 'Where do you see yourself in the next 5 years?',
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Future goals must be at least 30 characters'
      }
    },
    industryInspiration: {
      type: 'textarea',
      label: 'Who Inspires You in the Industry?',
      required: true,
      maxLength: 5000,
      rows: 2,
      placeholder: 'Who are your role models and sources of inspiration?',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Industry inspiration must be at least 10 characters'
      }
    }   
  },
  localSpotlight: {
    workPhotos: {
      type: 'file-upload',
      label: 'Work Photos',
      required: true,
      helperText: 'Upload 3-5 high-quality photos or videos of your best work',
      validation: {
        minFiles: 3,
        maxFiles: 5,
        maxSize: 100,
        accept: 'image/*,video/*',
        message: 'Please upload at least 3 work photos or videos (max 5, up to 100MB each)'
      }
    },
    workExperience: {
      type: 'textarea',
      label: 'Work Experience',
      required: true,
      maxLength: 5000,
      rows: 4,
      placeholder: 'Describe your experience and background in the beauty industry...',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 50,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Work experience must be at least 50 characters'
      }
    },
    socialMedia: {
      type: 'checkbox',
      label: 'Social Media Platforms',
      required: false,
      helperText: 'Select platforms you\'re active on',
      options: [
        { id: "instagram", label: "Instagram" },
        { id: "facebook", label: "Facebook" },
        { id: "tiktok", label: "TikTok" },
        { id: "youtube", label: "YouTube" },
        { id: "twitter", label: "Twitter/X" },
        { id: "linkedin", label: "LinkedIn" }
      ],
      validation: {
        message: ''
      }
    }
  },
  risingStar: {
    specialties: {
      type: 'checkbox',
      label: 'Primary Specialties',
      required: true,
      helperText: 'Select your main areas of expertise',
      options: [
        { id: "hair_styling", label: "Hair Styling" },
        { id: "hair_coloring", label: "Hair Coloring" },
        { id: "makeup_artistry", label: "Makeup Artistry" },
        { id: "skincare", label: "Skincare" },
        { id: "esthetician", label: "Esthetics" },
        { id: "nail_tech", label: "Nail Technology" },
        { id: "eyelash_specialist", label: "Eyelash Specialist" },
        { id: "beauty_education", label: "Beauty Education" }
      ],
      validation: {
        message: 'Please select at least one specialty'
      }
    },
    careerStartTime: {
      type: 'text',
      label: 'When did you start your career in the beauty industry?',
      required: true,
      maxLength: 500,
      placeholder: 'e.g., 2020, 3 years ago',
      validation: {
        required: true,
        maxLength: 500,
        minChars: 4,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Career start time must be at least 4 characters (e.g., 2020 or 3 yrs)'
      }
    },
    backgroundStory: {
      type: 'textarea',
      label: 'Your Background Story',
      required: true,
      maxLength: 8000,
      rows: 5,
      placeholder: 'Tell us about your journey into the beauty industry. What inspired you to pursue this career?',
      validation: {
        required: true,
        maxLength: 8000,
        minChars: 80,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Background story must be at least 80 characters'
      }
    },
    careerHighlights: {
      type: 'bullet-array',
      label: 'Career Highlights',
      required: true,
      placeholder: 'Enter a highlight',
      maxPoints: 5,
      helperText: 'List your top 5 career highlights',
      validation: {
        minChars: 10,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Each career highlight must be at least 10 characters'
      }
    },
    uniqueApproach: {
      type: 'textarea',
      label: 'What makes your approach unique?',
      required: true,
      maxLength: 5000,
      rows: 3,
      placeholder: 'Describe what sets you apart from others in your field...',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 50,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Unique approach description must be at least 50 characters'
      }
    },
    portfolioPhotos: {
      type: 'file-upload',
      label: 'Portfolio Photos',
      required: true,
      helperText: 'Upload 5-8 photos or videos showcasing your best work and professional presence',
      validation: {
        minFiles: 5,
        maxFiles: 8,
        maxSize: 100,
        accept: 'image/*,video/*',
        message: 'Please upload at least 5 portfolio photos or videos (max 8, up to 100MB each)'
      }
    },
    professionalPhotos: {
      type: 'file-upload',
      label: 'Professional Headshots',
      required: true,
      helperText: 'Upload 2-3 professional photos or videos of yourself',
      validation: {
        minFiles: 2,
        maxFiles: 3,
        maxSize: 50,
        accept: 'image/*,video/*',
        message: 'Please upload at least 2 professional photos or videos (max 3, up to 50MB each)'
      }
    },
    clientTestimonials: {
      type: 'textarea',
      label: 'Client Testimonials',
      required: true,
      maxLength: 6000,
      rows: 4,
      placeholder: 'Share some of the best feedback you\'ve received from clients...',
      validation: {
        required: true,
        maxLength: 6000,
        minChars: 40,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Client testimonials must be at least 40 characters'
      }
    },
    innovations: {
      type: 'textarea',
      label: 'Innovations or New Techniques',
      required: true,
      maxLength: 5000,
      rows: 3,
      placeholder: 'Have you developed any unique techniques or brought innovations to your field?',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Innovations description must be at least 30 characters'
      }
    },
    futureGoals: {
      type: 'textarea',
      label: 'Future Goals and Aspirations',
      required: true,
      maxLength: 4000,
      rows: 3,
      placeholder: 'Where do you see yourself in the next 5 years?',
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Future goals must be at least 30 characters'
      }
    },
    mentorshipOffer: {
      type: 'checkbox',
      label: 'Do you currently offer training?',
      required: false,
      validation: {
        message: ''
      }
    },
    mentorshipDetails: {
      type: 'textarea',
      label: 'Training Details',
      required: false,
      maxLength: 5000,
      rows: 2,
      placeholder: 'What trainings do you offer?',
      validation: {
        maxLength: 5000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'If provided, mentorship details must be at least 30 characters'
      }
    },
    advice: {
      type: 'textarea',
      label: 'Advice for Others',
      required: true,
      maxLength: 4000,
      rows: 3,
      placeholder: 'What advice would you give to others starting in the beauty industry?',
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 50,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Advice must be at least 50 characters'
      }
    }
  },
  topTreatment: {
    treatmentName: {
      type: 'text',
      label: 'Treatment Name',
      required: true,
      maxLength: 100,
      placeholder: 'Name of your signature treatment',
      validation: {
        required: true,
        maxLength: 100,
        minChars: 3,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Treatment name must be at least 3 characters'
      }
    },
    treatmentDescription: {
      type: 'textarea',
      label: 'Treatment Description',
      required: true,
      maxLength: 6000,
      rows: 4,
      placeholder: 'Describe your treatment in detail - what it is, what it does, and why it\'s special...',
      validation: {
        required: true,
        maxLength: 6000,
        minChars: 50,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Treatment description must be at least 50 characters'
      }
    },
    treatmentBenefits: {
      type: 'bullet-array',
      label: 'Client Benefits',
      required: true,
      placeholder: 'Enter a benefit',
      maxPoints: 5,
      helperText: 'List your top 5 client benefits',
      validation: {
        minChars: 15,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Each benefit must be at least 15 characters'
      }
    },
    treatmentDuration: {
      type: 'text',
      label: 'Treatment Duration',
      required: true,
      maxLength: 50,
      placeholder: 'e.g., 60 minutes, 2 hours',
      validation: {
        required: true,
        maxLength: 50,
        minChars: 3,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Treatment duration must be at least 3 characters'
      }
    },
    treatmentFrequency: {
      type: 'text',
      label: 'How often should this treatment be done?',
      required: true,
      maxLength: 500,
      placeholder: 'e.g., every month, once a week',
      validation: {
        required: true,
        maxLength: 500,
        minChars: 5,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Treatment frequency must be at least 5 characters'
      }
    },
    treatmentPrice: {
      type: 'text',
      label: 'Price Range',
      required: true,
      maxLength: 50,
      placeholder: 'e.g., $150-200, Starting at $250',
      validation: {
        required: true,
        maxLength: 50,
        minChars: 2,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Treatment price must be at least 2 characters'
      }
    },
    treatmentExperience: {
      type: 'textarea',
      label: 'Your Experience with This Treatment',
      required: true,
      maxLength: 5000,
      rows: 4,
      placeholder: 'How long have you been performing this treatment? What\'s your training and background?',
      validation: {
        required: true,
        maxLength: 5000,
        minChars: 20,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Treatment experience must be at least 20 characters'
      }
    },
    beforeAfterPhotos: {
      type: 'file-upload',
      label: 'Before & After Photos',
      required: true,
      helperText: 'Upload 3-5 high-quality before and after photos or videos showing your results',
      validation: {
        minFiles: 3,
        maxFiles: 5,
        maxSize: 100,
        accept: 'image/*,video/*',
        message: 'Please upload at least 3 before/after photos or videos (max 5, up to 100MB each)'
      }
    },
    clientResults: {
      type: 'textarea',
      label: 'Typical Client Results',
      required: true,
      maxLength: 4000,
      rows: 3,
      placeholder: 'What kind of results can clients typically expect? How long do results last?',
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Client results must be at least 30 characters'
      }
    },
    idealCandidates: {
      type: 'textarea',
      label: 'Ideal Candidates for This Treatment',
      required: true,
      maxLength: 4000,
      rows: 3,
      placeholder: 'Who is the perfect client for this treatment? What conditions or concerns does it address?',
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 30,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Ideal candidates must be at least 30 characters'
      }
    },
    aftercareInstructions: {
      type: 'textarea',
      label: 'Aftercare Instructions',
      required: true,
      maxLength: 4000,
      rows: 3,
      placeholder: 'What aftercare do you recommend to maintain and enhance results?',
      validation: {
        required: true,
        maxLength: 4000,
        minChars: 40,
        validateOnBlur: true,
        clearErrorOnFocus: true,
        message: 'Aftercare instructions must be at least 40 characters'
      }
    }
  }
};

// Helper function to get all field keys for a form type
export function getFormFieldKeys(form: 'profile' | 'cover' | 'localSpotlight' | 'risingStar' | 'topTreatment'): string[] {
  return Object.keys(fields_layout[form]);
}

// Helper function to get required field keys for a form type
export function getRequiredFieldKeys(form: 'profile' | 'cover' | 'localSpotlight' | 'risingStar' | 'topTreatment'): string[] {
  return Object.entries(fields_layout[form])
    .filter(([_, config]) => config.required)
    .map(([key, _]) => key);
}

// Helper function to get all required fields across all form types
export function getAllRequiredFieldKeys(): string[] {
  return [
    ...getRequiredFieldKeys('profile'),
    ...getRequiredFieldKeys('cover'),
    ...getRequiredFieldKeys('localSpotlight'),
    ...getRequiredFieldKeys('risingStar'),
    ...getRequiredFieldKeys('topTreatment')
  ];
}

// Helper function to check if a field is conditional (depends on another field)
export function isConditionalField(fieldKey: string): boolean {
  return fieldKey === 'bookingLink' || fieldKey === 'certificationDetails' || fieldKey === 'communityDetails' || fieldKey === 'mentorshipDetails' || fieldKey === 'equipmentDetails' || fieldKey === 'otherSpecialty';
}

// Legacy helper functions for backward compatibility
export function getTabFieldKeys(tab: 'profile' | 'magazine'): string[] {
  // Map old tab names to new form names
  if (tab === 'magazine') {
    return Object.keys(fields_layout['cover']);
  }
  return Object.keys(fields_layout[tab]);
}