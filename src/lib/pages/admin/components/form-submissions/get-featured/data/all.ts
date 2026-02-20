import type { GetFeaturedFormConfig } from '../types';

/**
 * Sample data for Get Featured form configurations
 *
 * This data represents all 4 form types with complete field definitions.
 * Used in the batch upload modal for reference and quick loading.
 *
 * Each form config includes:
 * - Profile section (shared across all forms)
 * - Form-specific sections
 * - Glamlink integration closing section
 */
export const sampleFormConfigs: GetFeaturedFormConfig[] = [
  {
    "id": "local-spotlight",
    "title": "Local Spotlight Feature",
    "description": "Get featured as a local beauty professional! Share your expertise, showcase your work, and connect with clients in your community.",
    "icon": "location",
    "bannerColor": "bg-gradient-to-r from-teal-600 to-blue-600",
    "enabled": true,
    "order": 1,
    "sections": [
      {
        "id": "profile",
        "title": "Profile Information",
        "description": "Your basic contact and business information",
        "layout": "grid",
        "order": 1,
        "fields": [
          {
            "id": "email",
            "name": "email",
            "type": "email",
            "label": "Email",
            "required": true,
            "placeholder": "your@email.com",
            "helperText": "We'll use this to contact you about your feature",
            "order": 1,
            "validation": {
              "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
              "minChars": 6,
              "message": "Email must be at least 6 characters (e.g., a@b.co)"
            }
          },
          {
            "id": "fullName",
            "name": "fullName",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name",
            "order": 2,
            "validation": {
              "minChars": 2,
              "maxLength": 100,
              "pattern": "^[a-zA-Z\\s\\-'\\.]+$",
              "message": "Full name must be at least 2 characters"
            }
          },
          {
            "id": "phone",
            "name": "phone",
            "type": "tel",
            "label": "Phone Number",
            "required": true,
            "placeholder": "(555) 123-4567",
            "helperText": "Include country code if outside the US",
            "order": 3,
            "validation": {
              "pattern": "^[\\d\\s\\-\\+\\(\\)]+$",
              "minLength": 10,
              "minChars": 10,
              "message": "Phone number must be at least 10 digits"
            }
          },
          {
            "id": "businessName",
            "name": "businessName",
            "type": "text",
            "label": "Business Name",
            "required": true,
            "placeholder": "Enter your business name",
            "order": 4,
            "validation": {
              "minChars": 2,
              "maxLength": 100,
              "message": "Business name must be at least 2 characters"
            }
          },
          {
            "id": "businessAddress",
            "name": "businessAddress",
            "type": "text",
            "label": "Business Address",
            "required": true,
            "placeholder": "Enter your business address",
            "order": 5,
            "validation": {
              "minLength": 5,
              "minChars": 10,
              "maxLength": 200,
              "message": "Please enter a complete address (minimum 10 characters)"
            }
          },
          {
            "id": "website",
            "name": "website",
            "type": "text",
            "label": "Website",
            "required": false,
            "placeholder": "https://yourwebsite.com",
            "order": 6,
            "validation": {
              "minChars": 4,
              "message": "If provided, website must be at least 4 characters"
            }
          },
          {
            "id": "instagramHandle",
            "name": "instagramHandle",
            "type": "text",
            "label": "Instagram Handle",
            "required": true,
            "placeholder": "@yourhandle",
            "order": 7,
            "validation": {
              "pattern": "^@?[a-zA-Z0-9_.]+$",
              "maxLength": 30,
              "minChars": 2,
              "message": "Instagram handle must be at least 2 characters (excluding @)"
            }
          },
          {
            "id": "primarySpecialties",
            "name": "primarySpecialties",
            "type": "multi-checkbox",
            "label": "Primary Specialties",
            "required": true,
            "helperText": "Select all that apply to your business",
            "minSelections": 1,
            "columns": 2,
            "order": 8,
            "options": [
              { "id": "hair_stylist", "label": "Hair Stylist" },
              { "id": "makeup_artist", "label": "Makeup Artist" },
              { "id": "esthetician", "label": "Esthetician" },
              { "id": "nail_tech", "label": "Nail Tech" },
              { "id": "massage_therapist", "label": "Massage Therapist" },
              { "id": "wellness", "label": "Wellness" },
              { "id": "injector", "label": "Injector" },
              { "id": "med_spa", "label": "Med Spa" },
              { "id": "other", "label": "Other" }
            ],
            "validation": {
              "message": "Please select at least one specialty"
            }
          },
          {
            "id": "certifications",
            "name": "certifications",
            "type": "checkbox",
            "label": "Do you have any professional certifications?",
            "required": false,
            "order": 9
          },
          {
            "id": "certificationDetails",
            "name": "certificationDetails",
            "type": "textarea",
            "label": "Certification Details",
            "required": false,
            "maxLength": 3000,
            "rows": 3,
            "placeholder": "List your certifications and where you received them...",
            "order": 10,
            "validation": {
              "maxLength": 3000,
              "minChars": 10,
              "message": "If provided, certification details must be at least 10 characters"
            }
          }
        ]
      },
      {
        "id": "work-details",
        "title": "Professional Information",
        "description": "Your expertise and experience",
        "layout": "single",
        "order": 2,
        "fields": [
          {
            "id": "workPhotos",
            "name": "workPhotos",
            "type": "file-upload",
            "label": "Work Photos",
            "required": true,
            "helperText": "Upload 3-5 high-quality photos or videos of your best work",
            "order": 1,
            "validation": {
              "minFiles": 3,
              "maxFiles": 5,
              "maxSize": 100,
              "accept": "image/*,video/*",
              "message": "Please upload at least 3 work photos or videos (max 5, up to 100MB each)"
            }
          },
          {
            "id": "workExperience",
            "name": "workExperience",
            "type": "textarea",
            "label": "Work Experience",
            "required": true,
            "maxLength": 5000,
            "rows": 4,
            "placeholder": "Describe your experience and background in the beauty industry...",
            "order": 2,
            "validation": {
              "required": true,
              "maxLength": 5000,
              "minChars": 50,
              "message": "Work experience must be at least 50 characters"
            }
          },
          {
            "id": "socialMedia",
            "name": "socialMedia",
            "type": "checkbox",
            "label": "Social Media Platforms",
            "required": false,
            "helperText": "Select platforms you're active on",
            "order": 3,
            "options": [
              { "id": "instagram", "label": "Instagram" },
              { "id": "facebook", "label": "Facebook" },
              { "id": "tiktok", "label": "TikTok" },
              { "id": "youtube", "label": "YouTube" },
              { "id": "twitter", "label": "Twitter/X" },
              { "id": "linkedin", "label": "LinkedIn" }
            ]
          }
        ]
      },
      {
        "id": "glamlink-closing",
        "title": "Glamlink Integration",
        "description": "Your feature connects to Glamlink, our interactive platform built for the beauty and wellness community.",
        "layout": "single",
        "order": 3,
        "fields": [
          {
            "id": "excitementFeatures",
            "name": "excitementFeatures",
            "type": "multi-checkbox",
            "label": "What excites you about Glamlink",
            "required": true,
            "helperText": "Select all features that excite you",
            "minSelections": 1,
            "columns": 2,
            "order": 1,
            "options": [
              { "id": "discovery", "label": "Clients ability to discover pros nearby and check out their services, work, reviews, etc" },
              { "id": "booking", "label": "Seamless booking inside Glamlink either in app or goes directly to your booking link" },
              { "id": "ecommerce", "label": "Pro shops & e-commerce" },
              { "id": "magazine", "label": "The Glamlink Edit magazine & spotlights" },
              { "id": "ai", "label": "AI powered discovery & smart recommendations (coming soon)" },
              { "id": "community", "label": "Community & networking with other pros" }
            ],
            "validation": {
              "message": "Please select at least one feature that excites you"
            }
          },
          {
            "id": "painPoints",
            "name": "painPoints",
            "type": "multi-checkbox",
            "label": "Biggest pain points",
            "required": true,
            "helperText": "Select all pain points that apply to you",
            "minSelections": 1,
            "columns": 2,
            "order": 2,
            "options": [
              { "id": "no-conversions", "label": "Posting but no conversions" },
              { "id": "dms-backforth", "label": "DMs-too much back and forth" },
              { "id": "no-shows", "label": "No shows" },
              { "id": "juggling-platforms", "label": "Juggling too many platforms (booking, social media, e-commerce, etc)" },
              { "id": "inventory-not-tied", "label": "Inventory/aftercare not tied to treatments" },
              { "id": "client-notes-everywhere", "label": "Client notes/consents all over the place" },
              { "id": "finding-clients", "label": "Finding new clients" },
              { "id": "no-pain-points", "label": "None of the above" }
            ],
            "validation": {
              "message": "Please select at least one pain point"
            }
          },
          {
            "id": "promotionOffer",
            "name": "promotionOffer",
            "type": "checkbox",
            "label": "I would like to offer a promotion with this feature",
            "required": false,
            "order": 3
          },
          {
            "id": "promotionDetails",
            "name": "promotionDetails",
            "type": "textarea",
            "label": "What promotion would you like to run?",
            "required": false,
            "placeholder": "Describe your promotion (e.g., 20% off first visit, free consultation with booking, etc.)",
            "rows": 3,
            "maxLength": 5000,
            "order": 4,
            "validation": {
              "maxLength": 5000,
              "minChars": 15,
              "message": "If offering a promotion, please provide at least 15 characters describing it"
            }
          },
          {
            "id": "contentPlanningRadio",
            "name": "contentPlanningRadio",
            "type": "radio",
            "label": "Content planning should be scheduled 2 weeks before being featured",
            "required": true,
            "order": 5,
            "options": [
              { "id": "schedule-day", "label": "Schedule a day for content" },
              { "id": "create-video", "label": "Create a video of your space or of a treatment" }
            ],
            "validation": {
              "message": "Please select a content planning option"
            }
          },
          {
            "id": "contentPlanningDate",
            "name": "contentPlanningDate",
            "type": "textarea",
            "label": "Say what dates work well below",
            "required": false,
            "placeholder": "Please provide your preferred dates for content creation...",
            "rows": 3,
            "maxLength": 3000,
            "order": 6,
            "validation": {
              "minChars": 8,
              "maxLength": 3000,
              "message": "Date information must be 3000 characters or less"
            }
          },
          {
            "id": "contentPlanningMedia",
            "name": "contentPlanningMedia",
            "type": "file-upload",
            "label": "Upload your images and video below",
            "required": false,
            "helperText": "Upload images or videos of your space or treatments",
            "order": 7,
            "validation": {
              "maxFiles": 5,
              "maxSize": 50,
              "accept": "image/*,video/*",
              "message": "Maximum 5 files, up to 50MB each"
            }
          },
          {
            "id": "instagramConsent",
            "name": "instagramConsent",
            "type": "checkbox",
            "label": "I consent to have Glamlink create a free professional profile using publically available instagram content to help build my professional portfolio",
            "required": true,
            "order": 8,
            "validation": {
              "message": "Please consent to profile creation using Instagram content"
            }
          },
          {
            "id": "hearAboutLocalSpotlight",
            "name": "hearAboutLocalSpotlight",
            "type": "textarea",
            "label": "How did you hear about Glamlink?",
            "required": true,
            "placeholder": "Tell us how you discovered The Glamlink Edit...",
            "rows": 3,
            "maxLength": 4000,
            "order": 9,
            "validation": {
              "required": true,
              "maxLength": 4000,
              "minChars": 10,
              "message": "Please tell us how you heard about Glamlink (minimum 10 characters)"
            }
          }
        ]
      }
    ],
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "cover",
    "title": "Cover Feature",
    "description": "Get featured on the cover of Glamlink Magazine! Share your story, showcase your work, and inspire beauty professionals across the industry.",
    "icon": "star",
    "bannerColor": "bg-gradient-to-r from-purple-600 to-pink-600",
    "enabled": true,
    "order": 2,
    "sections": [
      {
        "id": "profile",
        "title": "Profile Information",
        "description": "Your basic contact and business information",
        "layout": "grid",
        "order": 1,
        "fields": [
          { "id": "email", "name": "email", "type": "email", "label": "Email", "required": true, "placeholder": "your@email.com", "order": 1, "validation": { "minChars": 6, "message": "Email must be at least 6 characters" } },
          { "id": "fullName", "name": "fullName", "type": "text", "label": "Full Name", "required": true, "placeholder": "Enter your full name", "order": 2, "validation": { "minChars": 2, "message": "Full name must be at least 2 characters" } },
          { "id": "phone", "name": "phone", "type": "tel", "label": "Phone Number", "required": true, "placeholder": "(555) 123-4567", "order": 3, "validation": { "minChars": 10, "message": "Phone number must be at least 10 digits" } },
          { "id": "businessName", "name": "businessName", "type": "text", "label": "Business Name", "required": true, "placeholder": "Enter your business name", "order": 4, "validation": { "minChars": 2, "message": "Business name must be at least 2 characters" } },
          { "id": "businessAddress", "name": "businessAddress", "type": "text", "label": "Business Address", "required": true, "placeholder": "Enter your business address", "order": 5, "validation": { "minChars": 10, "message": "Please enter a complete address" } },
          { "id": "instagramHandle", "name": "instagramHandle", "type": "text", "label": "Instagram Handle", "required": true, "placeholder": "@yourhandle", "order": 6, "validation": { "minChars": 2, "message": "Instagram handle must be at least 2 characters" } },
          { "id": "primarySpecialties", "name": "primarySpecialties", "type": "multi-checkbox", "label": "Primary Specialties", "required": true, "minSelections": 1, "columns": 2, "order": 7, "options": [{ "id": "hair_stylist", "label": "Hair Stylist" }, { "id": "makeup_artist", "label": "Makeup Artist" }, { "id": "esthetician", "label": "Esthetician" }, { "id": "nail_tech", "label": "Nail Tech" }, { "id": "massage_therapist", "label": "Massage Therapist" }, { "id": "wellness", "label": "Wellness" }, { "id": "injector", "label": "Injector" }, { "id": "med_spa", "label": "Med Spa" }, { "id": "other", "label": "Other" }], "validation": { "message": "Please select at least one specialty" } }
        ]
      },
      {
        "id": "your-story",
        "title": "Your Story",
        "description": "Tell us about your journey and what makes you unique",
        "layout": "single",
        "order": 2,
        "fields": [
          { "id": "bio", "name": "bio", "type": "textarea", "label": "Bio (A brief story about your journey, how you got started)", "required": true, "placeholder": "Tell us your story...", "helperText": "Then Marie will send you follow up questions", "rows": 4, "order": 1, "validation": { "minChars": 50, "maxLength": 3000, "message": "Bio must be at least 50 characters" } },
          { "id": "favoriteQuote", "name": "favoriteQuote", "type": "textarea", "label": "Your favorite quote", "required": true, "placeholder": "Enter your favorite quote...", "rows": 2, "maxLength": 5000, "order": 2, "validation": { "minChars": 10, "message": "Favorite quote must be at least 10 characters" } },
          { "id": "confidenceStory", "name": "confidenceStory", "type": "textarea", "label": "A heart warming story where you changed someone's confidence with a treatment", "required": true, "placeholder": "Share your story...", "rows": 4, "maxLength": 5000, "order": 3, "validation": { "minChars": 50, "message": "Confidence story must be at least 50 characters" } }
        ]
      },
      {
        "id": "professional-work",
        "title": "Professional Work",
        "description": "Showcase your best work and achievements",
        "layout": "single",
        "order": 3,
        "fields": [
          { "id": "headshots", "name": "headshots", "type": "file-upload", "label": "Headshots 2-3", "required": true, "order": 1, "validation": { "minFiles": 2, "maxFiles": 3, "maxSize": 50, "accept": "image/*,video/*", "message": "Please upload at least 2 headshots (max 3, up to 50MB each)" } },
          { "id": "workPhotos", "name": "workPhotos", "type": "file-upload", "label": "3 Photos Of Your Work", "required": true, "order": 2, "validation": { "minFiles": 3, "maxFiles": 5, "maxSize": 100, "accept": "image/*,video/*", "message": "Please upload at least 3 work photos (max 5, up to 100MB each)" } },
          { "id": "achievements", "name": "achievements", "type": "bullet-array", "label": "5 Achievements-Bullet Points", "required": true, "placeholder": "Enter an achievement", "maxPoints": 5, "helperText": "List your top 5 professional achievements", "order": 3, "validation": { "minChars": 10, "message": "Each achievement must be at least 10 characters" } },
          { "id": "professionalProduct", "name": "professionalProduct", "type": "textarea", "label": "Your Favorite Professional Product (Ideally something you sell) and why", "required": true, "placeholder": "Tell us about your favorite product and why...", "rows": 3, "maxLength": 5000, "order": 4, "validation": { "minChars": 30, "message": "Professional product description must be at least 30 characters" } }
        ]
      },
      {
        "id": "industry-impact",
        "title": "Industry Impact",
        "description": "Your influence and innovations",
        "layout": "single",
        "order": 4,
        "fields": [
          { "id": "industryChallenges", "name": "industryChallenges", "type": "textarea", "label": "Industry Challenges You've Overcome", "required": true, "maxLength": 5000, "rows": 3, "placeholder": "What challenges have you faced in the industry and how did you overcome them?", "order": 1, "validation": { "minChars": 50, "message": "Industry challenges description must be at least 50 characters" } },
          { "id": "innovations", "name": "innovations", "type": "textarea", "label": "Innovations or New Techniques", "required": true, "maxLength": 5000, "rows": 3, "placeholder": "Have you developed any unique techniques or brought innovations to your field?", "order": 2, "validation": { "minChars": 30, "message": "Innovations description must be at least 30 characters" } },
          { "id": "futureGoals", "name": "futureGoals", "type": "textarea", "label": "Future Goals and Aspirations", "required": true, "maxLength": 4000, "rows": 3, "placeholder": "Where do you see yourself in the next 5 years?", "order": 3, "validation": { "minChars": 30, "message": "Future goals must be at least 30 characters" } },
          { "id": "industryInspiration", "name": "industryInspiration", "type": "textarea", "label": "Who Inspires You in the Industry?", "required": true, "maxLength": 5000, "rows": 2, "placeholder": "Who are your role models and sources of inspiration?", "order": 4, "validation": { "minChars": 10, "message": "Industry inspiration must be at least 10 characters" } }
        ]
      },
      {
        "id": "glamlink-closing",
        "title": "Glamlink Integration",
        "description": "Your feature connects to Glamlink, our interactive platform.",
        "layout": "single",
        "order": 5,
        "fields": [
          { "id": "excitementFeatures", "name": "excitementFeatures", "type": "multi-checkbox", "label": "What excites you about Glamlink", "required": true, "minSelections": 1, "columns": 2, "order": 1, "options": [{ "id": "discovery", "label": "Clients ability to discover pros nearby" }, { "id": "booking", "label": "Seamless booking inside Glamlink" }, { "id": "ecommerce", "label": "Pro shops & e-commerce" }, { "id": "magazine", "label": "The Glamlink Edit magazine" }, { "id": "ai", "label": "AI powered discovery (coming soon)" }, { "id": "community", "label": "Community & networking with other pros" }], "validation": { "message": "Please select at least one feature" } },
          { "id": "painPoints", "name": "painPoints", "type": "multi-checkbox", "label": "Biggest pain points", "required": true, "minSelections": 1, "columns": 2, "order": 2, "options": [{ "id": "no-conversions", "label": "Posting but no conversions" }, { "id": "dms-backforth", "label": "DMs-too much back and forth" }, { "id": "no-shows", "label": "No shows" }, { "id": "juggling-platforms", "label": "Juggling too many platforms" }, { "id": "finding-clients", "label": "Finding new clients" }, { "id": "no-pain-points", "label": "None of the above" }], "validation": { "message": "Please select at least one pain point" } },
          { "id": "instagramConsent", "name": "instagramConsent", "type": "checkbox", "label": "I consent to have Glamlink create a free professional profile using publically available instagram content", "required": true, "order": 3, "validation": { "message": "Please consent to profile creation" } },
          { "id": "contentPlanningRadio", "name": "contentPlanningRadio", "type": "radio", "label": "Content planning should be scheduled 2 weeks before being featured", "required": true, "order": 4, "options": [{ "id": "schedule-day", "label": "Schedule a day for content" }, { "id": "create-video", "label": "Create a video of your space or of a treatment" }], "validation": { "message": "Please select a content planning option" } },
          { "id": "hearAboutLocalSpotlight", "name": "hearAboutLocalSpotlight", "type": "textarea", "label": "How did you hear about Glamlink?", "required": true, "placeholder": "Tell us how you discovered Glamlink...", "rows": 3, "maxLength": 4000, "order": 5, "validation": { "minChars": 10, "message": "Please tell us how you heard about Glamlink" } }
        ]
      }
    ],
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "rising-star",
    "title": "Rising Star Feature",
    "description": "Are you an emerging talent in the beauty industry? We want to showcase your journey, achievements, and potential to inspire others!",
    "icon": "rocket",
    "bannerColor": "bg-gradient-to-r from-indigo-600 to-purple-600",
    "enabled": true,
    "order": 3,
    "sections": [
      {
        "id": "profile",
        "title": "Profile Information",
        "description": "Your basic contact and business information",
        "layout": "grid",
        "order": 1,
        "fields": [
          { "id": "email", "name": "email", "type": "email", "label": "Email", "required": true, "placeholder": "your@email.com", "order": 1, "validation": { "minChars": 6, "message": "Email must be at least 6 characters" } },
          { "id": "fullName", "name": "fullName", "type": "text", "label": "Full Name", "required": true, "placeholder": "Enter your full name", "order": 2, "validation": { "minChars": 2, "message": "Full name must be at least 2 characters" } },
          { "id": "phone", "name": "phone", "type": "tel", "label": "Phone Number", "required": true, "placeholder": "(555) 123-4567", "order": 3, "validation": { "minChars": 10, "message": "Phone number must be at least 10 digits" } },
          { "id": "businessName", "name": "businessName", "type": "text", "label": "Business Name", "required": true, "placeholder": "Enter your business name", "order": 4, "validation": { "minChars": 2, "message": "Business name must be at least 2 characters" } },
          { "id": "businessAddress", "name": "businessAddress", "type": "text", "label": "Business Address", "required": true, "placeholder": "Enter your business address", "order": 5, "validation": { "minChars": 10, "message": "Please enter a complete address" } },
          { "id": "instagramHandle", "name": "instagramHandle", "type": "text", "label": "Instagram Handle", "required": true, "placeholder": "@yourhandle", "order": 6, "validation": { "minChars": 2, "message": "Instagram handle must be at least 2 characters" } },
          { "id": "primarySpecialties", "name": "primarySpecialties", "type": "multi-checkbox", "label": "Primary Specialties", "required": true, "minSelections": 1, "columns": 2, "order": 7, "options": [{ "id": "hair_stylist", "label": "Hair Stylist" }, { "id": "makeup_artist", "label": "Makeup Artist" }, { "id": "esthetician", "label": "Esthetician" }, { "id": "nail_tech", "label": "Nail Tech" }, { "id": "massage_therapist", "label": "Massage Therapist" }, { "id": "wellness", "label": "Wellness" }, { "id": "other", "label": "Other" }], "validation": { "message": "Please select at least one specialty" } }
        ]
      },
      {
        "id": "career-background",
        "title": "Career Background",
        "description": "Your journey in the beauty industry",
        "layout": "single",
        "order": 2,
        "fields": [
          { "id": "careerStartTime", "name": "careerStartTime", "type": "text", "label": "When did you start your career in the beauty industry?", "required": true, "maxLength": 500, "placeholder": "e.g., 2020, 3 years ago", "order": 1, "validation": { "minChars": 4, "message": "Career start time must be at least 4 characters" } },
          { "id": "backgroundStory", "name": "backgroundStory", "type": "textarea", "label": "Your Background Story", "required": true, "maxLength": 8000, "rows": 5, "placeholder": "Tell us about your journey into the beauty industry. What inspired you to pursue this career?", "order": 2, "validation": { "minChars": 80, "message": "Background story must be at least 80 characters" } },
          { "id": "careerHighlights", "name": "careerHighlights", "type": "bullet-array", "label": "Career Highlights", "required": true, "placeholder": "Enter a highlight", "maxPoints": 5, "helperText": "List your top 5 career highlights", "order": 3, "validation": { "minChars": 10, "message": "Each career highlight must be at least 10 characters" } },
          { "id": "uniqueApproach", "name": "uniqueApproach", "type": "textarea", "label": "What makes your approach unique?", "required": true, "maxLength": 5000, "rows": 3, "placeholder": "Describe what sets you apart from others in your field...", "order": 4, "validation": { "minChars": 50, "message": "Unique approach description must be at least 50 characters" } }
        ]
      },
      {
        "id": "achievements-portfolio",
        "title": "Achievements & Portfolio",
        "description": "Showcase your best work and accomplishments",
        "layout": "single",
        "order": 3,
        "fields": [
          { "id": "portfolioPhotos", "name": "portfolioPhotos", "type": "file-upload", "label": "Portfolio Photos", "required": true, "helperText": "Upload 5-8 photos or videos showcasing your best work", "order": 1, "validation": { "minFiles": 5, "maxFiles": 8, "maxSize": 100, "accept": "image/*,video/*", "message": "Please upload at least 5 portfolio photos (max 8, up to 100MB each)" } },
          { "id": "professionalPhotos", "name": "professionalPhotos", "type": "file-upload", "label": "Professional Headshots", "required": true, "helperText": "Upload 2-3 professional photos of yourself", "order": 2, "validation": { "minFiles": 2, "maxFiles": 3, "maxSize": 50, "accept": "image/*,video/*", "message": "Please upload at least 2 professional photos (max 3, up to 50MB each)" } },
          { "id": "clientTestimonials", "name": "clientTestimonials", "type": "textarea", "label": "Client Testimonials", "required": true, "maxLength": 6000, "rows": 4, "placeholder": "Share some of the best feedback you've received from clients...", "order": 3, "validation": { "minChars": 40, "message": "Client testimonials must be at least 40 characters" } }
        ]
      },
      {
        "id": "industry-impact",
        "title": "Industry Impact",
        "description": "Your influence and innovations",
        "layout": "single",
        "order": 4,
        "fields": [
          { "id": "innovations", "name": "innovations", "type": "textarea", "label": "Innovations or New Techniques", "required": true, "maxLength": 5000, "rows": 3, "placeholder": "Have you developed any unique techniques or brought innovations to your field?", "order": 1, "validation": { "minChars": 30, "message": "Innovations description must be at least 30 characters" } },
          { "id": "futureGoals", "name": "futureGoals", "type": "textarea", "label": "Future Goals and Aspirations", "required": true, "maxLength": 4000, "rows": 3, "placeholder": "Where do you see yourself in the next 5 years?", "order": 2, "validation": { "minChars": 30, "message": "Future goals must be at least 30 characters" } }
        ]
      },
      {
        "id": "mentorship-advice",
        "title": "Mentorship & Advice",
        "description": "Sharing knowledge with others",
        "layout": "single",
        "order": 5,
        "fields": [
          { "id": "mentorshipOffer", "name": "mentorshipOffer", "type": "checkbox", "label": "Do you currently offer training?", "required": false, "order": 1 },
          { "id": "mentorshipDetails", "name": "mentorshipDetails", "type": "textarea", "label": "Training Details", "required": false, "maxLength": 5000, "rows": 2, "placeholder": "What trainings do you offer?", "order": 2, "validation": { "minChars": 30, "message": "If provided, training details must be at least 30 characters" } },
          { "id": "advice", "name": "advice", "type": "textarea", "label": "Advice for Others", "required": true, "maxLength": 4000, "rows": 3, "placeholder": "What advice would you give to others starting in the beauty industry?", "order": 3, "validation": { "minChars": 50, "message": "Advice must be at least 50 characters" } }
        ]
      },
      {
        "id": "glamlink-closing",
        "title": "Glamlink Integration",
        "description": "Your feature connects to Glamlink.",
        "layout": "single",
        "order": 6,
        "fields": [
          { "id": "excitementFeatures", "name": "excitementFeatures", "type": "multi-checkbox", "label": "What excites you about Glamlink", "required": true, "minSelections": 1, "columns": 2, "order": 1, "options": [{ "id": "discovery", "label": "Clients ability to discover pros nearby" }, { "id": "booking", "label": "Seamless booking inside Glamlink" }, { "id": "ecommerce", "label": "Pro shops & e-commerce" }, { "id": "magazine", "label": "The Glamlink Edit magazine" }, { "id": "ai", "label": "AI powered discovery (coming soon)" }, { "id": "community", "label": "Community & networking with other pros" }], "validation": { "message": "Please select at least one feature" } },
          { "id": "painPoints", "name": "painPoints", "type": "multi-checkbox", "label": "Biggest pain points", "required": true, "minSelections": 1, "columns": 2, "order": 2, "options": [{ "id": "no-conversions", "label": "Posting but no conversions" }, { "id": "dms-backforth", "label": "DMs-too much back and forth" }, { "id": "no-shows", "label": "No shows" }, { "id": "juggling-platforms", "label": "Juggling too many platforms" }, { "id": "finding-clients", "label": "Finding new clients" }, { "id": "no-pain-points", "label": "None of the above" }], "validation": { "message": "Please select at least one pain point" } },
          { "id": "instagramConsent", "name": "instagramConsent", "type": "checkbox", "label": "I consent to have Glamlink create a free professional profile using publically available instagram content", "required": true, "order": 3, "validation": { "message": "Please consent to profile creation" } },
          { "id": "contentPlanningRadio", "name": "contentPlanningRadio", "type": "radio", "label": "Content planning should be scheduled 2 weeks before being featured", "required": true, "order": 4, "options": [{ "id": "schedule-day", "label": "Schedule a day for content" }, { "id": "create-video", "label": "Create a video of your space or of a treatment" }], "validation": { "message": "Please select a content planning option" } },
          { "id": "hearAboutLocalSpotlight", "name": "hearAboutLocalSpotlight", "type": "textarea", "label": "How did you hear about Glamlink?", "required": true, "placeholder": "Tell us how you discovered Glamlink...", "rows": 3, "maxLength": 4000, "order": 5, "validation": { "minChars": 10, "message": "Please tell us how you heard about Glamlink" } }
        ]
      }
    ],
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "top-treatment",
    "title": "Top Treatment Feature",
    "description": "Showcase your signature beauty treatment! Help clients discover your unique services and expertise.",
    "icon": "sparkles",
    "bannerColor": "bg-gradient-to-r from-pink-600 to-rose-600",
    "enabled": true,
    "order": 4,
    "sections": [
      {
        "id": "profile",
        "title": "Profile Information",
        "description": "Your basic contact and business information",
        "layout": "grid",
        "order": 1,
        "fields": [
          { "id": "email", "name": "email", "type": "email", "label": "Email", "required": true, "placeholder": "your@email.com", "order": 1, "validation": { "minChars": 6, "message": "Email must be at least 6 characters" } },
          { "id": "fullName", "name": "fullName", "type": "text", "label": "Full Name", "required": true, "placeholder": "Enter your full name", "order": 2, "validation": { "minChars": 2, "message": "Full name must be at least 2 characters" } },
          { "id": "phone", "name": "phone", "type": "tel", "label": "Phone Number", "required": true, "placeholder": "(555) 123-4567", "order": 3, "validation": { "minChars": 10, "message": "Phone number must be at least 10 digits" } },
          { "id": "businessName", "name": "businessName", "type": "text", "label": "Business Name", "required": true, "placeholder": "Enter your business name", "order": 4, "validation": { "minChars": 2, "message": "Business name must be at least 2 characters" } },
          { "id": "businessAddress", "name": "businessAddress", "type": "text", "label": "Business Address", "required": true, "placeholder": "Enter your business address", "order": 5, "validation": { "minChars": 10, "message": "Please enter a complete address" } },
          { "id": "instagramHandle", "name": "instagramHandle", "type": "text", "label": "Instagram Handle", "required": true, "placeholder": "@yourhandle", "order": 6, "validation": { "minChars": 2, "message": "Instagram handle must be at least 2 characters" } },
          { "id": "primarySpecialties", "name": "primarySpecialties", "type": "multi-checkbox", "label": "Primary Specialties", "required": true, "minSelections": 1, "columns": 2, "order": 7, "options": [{ "id": "hair_stylist", "label": "Hair Stylist" }, { "id": "makeup_artist", "label": "Makeup Artist" }, { "id": "esthetician", "label": "Esthetician" }, { "id": "nail_tech", "label": "Nail Tech" }, { "id": "massage_therapist", "label": "Massage Therapist" }, { "id": "wellness", "label": "Wellness" }, { "id": "injector", "label": "Injector" }, { "id": "med_spa", "label": "Med Spa" }, { "id": "other", "label": "Other" }], "validation": { "message": "Please select at least one specialty" } }
        ]
      },
      {
        "id": "treatment-details",
        "title": "Treatment Details",
        "description": "Everything about your signature treatment",
        "layout": "single",
        "order": 2,
        "fields": [
          { "id": "treatmentName", "name": "treatmentName", "type": "text", "label": "Treatment Name", "required": true, "maxLength": 100, "placeholder": "Name of your signature treatment", "order": 1, "validation": { "minChars": 3, "message": "Treatment name must be at least 3 characters" } },
          { "id": "treatmentDescription", "name": "treatmentDescription", "type": "textarea", "label": "Treatment Description", "required": true, "maxLength": 6000, "rows": 4, "placeholder": "Describe your treatment in detail - what it is, what it does, and why it's special...", "order": 2, "validation": { "minChars": 50, "message": "Treatment description must be at least 50 characters" } },
          { "id": "treatmentBenefits", "name": "treatmentBenefits", "type": "bullet-array", "label": "Client Benefits", "required": true, "placeholder": "Enter a benefit", "maxPoints": 5, "helperText": "List your top 5 client benefits", "order": 3, "validation": { "minChars": 15, "message": "Each benefit must be at least 15 characters" } },
          { "id": "treatmentDuration", "name": "treatmentDuration", "type": "text", "label": "Treatment Duration", "required": true, "maxLength": 50, "placeholder": "e.g., 60 minutes, 2 hours", "order": 4, "validation": { "minChars": 3, "message": "Treatment duration must be at least 3 characters" } },
          { "id": "treatmentFrequency", "name": "treatmentFrequency", "type": "text", "label": "How often should this treatment be done?", "required": true, "maxLength": 500, "placeholder": "e.g., every month, once a week", "order": 5, "validation": { "minChars": 5, "message": "Treatment frequency must be at least 5 characters" } },
          { "id": "treatmentPrice", "name": "treatmentPrice", "type": "text", "label": "Price Range", "required": true, "maxLength": 50, "placeholder": "e.g., $150-200, Starting at $250", "order": 6, "validation": { "minChars": 2, "message": "Treatment price must be at least 2 characters" } }
        ]
      },
      {
        "id": "your-expertise",
        "title": "Your Expertise",
        "description": "Your experience and results",
        "layout": "single",
        "order": 3,
        "fields": [
          { "id": "treatmentExperience", "name": "treatmentExperience", "type": "textarea", "label": "Your Experience with This Treatment", "required": true, "maxLength": 5000, "rows": 4, "placeholder": "How long have you been performing this treatment? What's your training and background?", "order": 1, "validation": { "minChars": 20, "message": "Treatment experience must be at least 20 characters" } },
          { "id": "beforeAfterPhotos", "name": "beforeAfterPhotos", "type": "file-upload", "label": "Before & After Photos", "required": true, "helperText": "Upload 3-5 high-quality before and after photos showing your results", "order": 2, "validation": { "minFiles": 3, "maxFiles": 5, "maxSize": 100, "accept": "image/*,video/*", "message": "Please upload at least 3 before/after photos (max 5, up to 100MB each)" } },
          { "id": "clientResults", "name": "clientResults", "type": "textarea", "label": "Typical Client Results", "required": true, "maxLength": 4000, "rows": 3, "placeholder": "What kind of results can clients typically expect? How long do results last?", "order": 3, "validation": { "minChars": 30, "message": "Client results must be at least 30 characters" } }
        ]
      },
      {
        "id": "client-information",
        "title": "Client Information",
        "description": "Who this treatment is for",
        "layout": "single",
        "order": 4,
        "fields": [
          { "id": "idealCandidates", "name": "idealCandidates", "type": "textarea", "label": "Ideal Candidates for This Treatment", "required": true, "maxLength": 4000, "rows": 3, "placeholder": "Who is the perfect client for this treatment? What conditions or concerns does it address?", "order": 1, "validation": { "minChars": 30, "message": "Ideal candidates must be at least 30 characters" } },
          { "id": "aftercareInstructions", "name": "aftercareInstructions", "type": "textarea", "label": "Aftercare Instructions", "required": true, "maxLength": 4000, "rows": 3, "placeholder": "What aftercare do you recommend to maintain and enhance results?", "order": 2, "validation": { "minChars": 40, "message": "Aftercare instructions must be at least 40 characters" } }
        ]
      },
      {
        "id": "glamlink-closing",
        "title": "Glamlink Integration",
        "description": "Your feature connects to Glamlink.",
        "layout": "single",
        "order": 5,
        "fields": [
          { "id": "excitementFeatures", "name": "excitementFeatures", "type": "multi-checkbox", "label": "What excites you about Glamlink", "required": true, "minSelections": 1, "columns": 2, "order": 1, "options": [{ "id": "discovery", "label": "Clients ability to discover pros nearby" }, { "id": "booking", "label": "Seamless booking inside Glamlink" }, { "id": "ecommerce", "label": "Pro shops & e-commerce" }, { "id": "magazine", "label": "The Glamlink Edit magazine" }, { "id": "ai", "label": "AI powered discovery (coming soon)" }, { "id": "community", "label": "Community & networking with other pros" }], "validation": { "message": "Please select at least one feature" } },
          { "id": "painPoints", "name": "painPoints", "type": "multi-checkbox", "label": "Biggest pain points", "required": true, "minSelections": 1, "columns": 2, "order": 2, "options": [{ "id": "no-conversions", "label": "Posting but no conversions" }, { "id": "dms-backforth", "label": "DMs-too much back and forth" }, { "id": "no-shows", "label": "No shows" }, { "id": "juggling-platforms", "label": "Juggling too many platforms" }, { "id": "finding-clients", "label": "Finding new clients" }, { "id": "no-pain-points", "label": "None of the above" }], "validation": { "message": "Please select at least one pain point" } },
          { "id": "instagramConsent", "name": "instagramConsent", "type": "checkbox", "label": "I consent to have Glamlink create a free professional profile using publically available instagram content", "required": true, "order": 3, "validation": { "message": "Please consent to profile creation" } },
          { "id": "contentPlanningRadio", "name": "contentPlanningRadio", "type": "radio", "label": "Content planning should be scheduled 2 weeks before being featured", "required": true, "order": 4, "options": [{ "id": "schedule-day", "label": "Schedule a day for content" }, { "id": "create-video", "label": "Create a video of your space or of a treatment" }], "validation": { "message": "Please select a content planning option" } },
          { "id": "hearAboutLocalSpotlight", "name": "hearAboutLocalSpotlight", "type": "textarea", "label": "How did you hear about Glamlink?", "required": true, "placeholder": "Tell us how you discovered Glamlink...", "rows": 3, "maxLength": 4000, "order": 5, "validation": { "minChars": 10, "message": "Please tell us how you heard about Glamlink" } }
        ]
      }
    ],
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  }
];
