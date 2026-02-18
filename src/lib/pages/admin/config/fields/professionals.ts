// ============================================
// PROFESSIONAL FIELDS CONFIGURATION
// ============================================

import { FieldConfig } from "@/lib/pages/admin/types";
import { CustomTab } from "@/lib/pages/admin/components/shared/editing/types";
import { DEFAULT_CONDENSED_CARD_CONFIG } from "@/lib/features/digital-cards/types/condensedCardConfig";

export const CERTIFICATION_LEVELS = [
  { value: "Bronze", label: "Bronze" },
  { value: "Silver", label: "Silver" },
  { value: "Gold", label: "Gold" },
  { value: "Platinum", label: "Platinum" }
];

export const MODAL_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard Modal' },
  { value: 'custom', label: 'Custom Modal' }
];

// Custom Modal Registry for professionals
export const PROFESSIONAL_CUSTOM_MODAL_REGISTRY = [
  { value: 'basic-profile', label: 'Basic Professional Profile' },
  { value: 'featured-profile', label: 'Featured Professional Profile' },
  { value: 'service-specialist', label: 'Service Specialist Profile' }
];

// ============================================
// BASIC INFO TAB FIELDS
// ============================================
export const basicInfoFields: FieldConfig[] = [
  {
    name: "ownerId",
    label: "Profile Owner",
    type: "userSelect",
    placeholder: "Search by name or email...",
    helperText: "Assign a user account that can manage this profile via /profile"
  },
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter professional's full name..."
  },
  {
    name: "title",
    label: "Occupation",
    type: "text",
    required: true,
    placeholder: "e.g., Master Esthetician, Hair Stylist..."
  },
  {
    name: "specialty",
    label: "Specialties",
    type: "text",
    required: true,
    placeholder: "e.g., Skincare, Hair Color, Makeup...",
    helperText: "Professional specialties"
  },
  {
    name: "business_name",
    label: "Business Name",
    type: "text",
    placeholder: "e.g., Glamlink Salon, Beauty Studio...",
    helperText: "Name of the business or salon"
  },
  {
    name: "customHandle",
    label: "Custom Handle",
    type: "text",
    placeholder: "e.g., @showoff_makeup",
    helperText: "Display handle/username for this professional (e.g., @showoff_makeup). This is NOT for URLs."
  },
  {
    name: "cardUrl",
    label: "Custom URL",
    type: "text",
    placeholder: "e.g., wendy-ryan, betty-smith",
    helperText: "URL for pros page (e.g., wendy-ryan --> displaying card on https://glamlink.net/wendy-ryan). Leave blank to use the generated pro ID."
  },
  {
    name: "enhancedSocialLinks",
    label: "Other Social Links",
    type: "array",
    data: "object",
    maxItems: 10,
    itemSchema: [
      {
        name: "platform",
        label: "Platform",
        type: "text",
        placeholder: "e.g., Facebook, Twitter, LinkedIn, YouTube",
        required: true
      },
      {
        name: "url",
        label: "URL",
        type: "url",
        placeholder: "https://linkedin.com/in/username",
        required: true
      },
      {
        name: "handle",
        label: "Handle/Username",
        type: "text",
        placeholder: "@username"
      }
    ],
    helperText: "Add additional social links (Facebook, LinkedIn, YouTube, etc.)"
  },
  {
    name: "locationData",
    label: "Primary Business Location",
    type: "locationInput",
    required: false,
    helperText: "Single location (legacy) - use Locations below for multiple",
    hide: true  // Hidden in favor of locations array field
  },
  {
    name: "locations",
    label: "Business Locations",
    type: "multiLocation",
    required: false,
    helperText: "Add up to 30 business locations. Mark one as primary."
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "professional@example.com"
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "(555) 123-4567"
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    placeholder: "https://professional-website.com",
    helperText: "Professional website URL (displayed in footer)"
  },
  {
    name: "instagram",
    label: "Instagram",
    type: "text",
    placeholder: "@username or https://instagram.com/username",
    helperText: "Instagram handle or full URL (displayed in footer)"
  },
  {
    name: "tiktok",
    label: "TikTok",
    type: "text",
    placeholder: "@username or https://tiktok.com/@username",
    helperText: "TikTok handle or full URL (displayed in footer)"
  },
  {
    name: "bookingUrl",
    label: "Booking Link",
    type: "url",
    placeholder: "https://calendly.com/your-link or https://your-booking-page.com",
    helperText: "URL for clients to book appointments (used in Quick Actions)"
  },
  {
    name: "preferredBookingMethod",
    label: "Preferred Booking Method",
    type: "select",
    options: [
      { value: "", label: "Not set" },
      { value: "send-text", label: "Send Text" },
      { value: "instagram", label: "Instagram Profile" },
      { value: "booking-link", label: "Go to Booking Link" }
    ],
    helperText: "How clients should book appointments (used by Quick Actions 'Default' preset)"
  },
  {
    name: "certificationLevel",
    label: "Certification Level",
    type: "select",
    options: CERTIFICATION_LEVELS,
    required: true,
    hide: true
  },
  {
    name: "hasDigitalCard",
    label: "Has Digital Card",
    type: "checkbox",
    checkboxLabel: "Enable digital business card for this professional",
    hide: false
  },
  {
    name: "bio",
    label: "Professional Bio",
    type: "html",
    placeholder: "Tell us about your professional background, expertise, and approach...",
    helperText: "Supports rich text formatting (bold, lists, etc.)"
  },
  {
    name: "order",
    label: "Display Order",
    type: "number",
    min: 1,
    max: 999
  },
  {
    name: "featured",
    label: "Featured Professional",
    type: "checkbox",
    checkboxLabel: "Feature this professional on the homepage"
  },
  {
    name: "isFounder",
    label: "Founding Member",
    type: "checkbox",
    checkboxLabel: "Mark as founding member of Glamlink"
  },
  {
    name: "importantInfo",
    label: "Important Info",
    type: "array",
    maxItems: 10,
    helperText: "Key information for clients (e.g., 'By appointment only', 'Cash preferred')"
  }
];

// ============================================
// MEDIA & GALLERY TAB FIELDS
// ============================================
export const mediaGalleryFields: FieldConfig[] = [
  {
    name: "portraitImage",
    label: "Portrait Image",
    type: "image",
    helperText: "Professional headshot (used in carousel cards)"
  },
  {
    name: "profileImage",
    label: "Profile Image",
    type: "image",
    helperText: "Alternative professional image"
  },
  {
    name: "gallery",
    label: "Gallery & Portfolio",
    type: "gallery",
    helperText: "Mixed media gallery with images and videos showcasing your work"
  }
];

// ============================================
// SERVICES & PROMOTIONS TAB FIELDS
// ============================================
export const servicesPromotionsFields: FieldConfig[] = [
  {
    name: "specialties",
    label: "Specialties Array",
    type: "array",
    maxItems: 5,
    helperText: "Maximum 5 specialties showcasing your expertise"
  },
  {
    name: "promotions",
    label: "Promotions & Offers",
    type: "promotions",
    helperText: "Special offers, discounts, and promotional packages"
  },
  {
    name: "businessHours",
    label: "Business Hours",
    type: "array",
    helperText: "Operating hours for each day (e.g., Monday: 9:00 AM - 7:00 PM)"
  },
  {
    name: "tags",
    label: "Tags",
    type: "array",
    helperText: "Professional and service tags for discovery"
  }
];

// ============================================
// CONDENSED CARD TAB FIELDS
// ============================================
export const condensedCardFields: FieldConfig[] = [
  {
    name: "condensedCardConfig",
    label: "Condensed Card Designer",
    // @ts-expect-error - condensedCardEditor is a custom field type
    type: "condensedCardEditor",
    helperText: "Configure the layout and dimensions for the condensed card image export"
  }
];

// ============================================
// LEGACY: ALL FIELDS (for non-tabbed modals)
// ============================================
/**
 * Complete field list for professionals (backward compatible)
 * Used when custom tabs are not enabled
 */
export const professionalEditFields: FieldConfig[] = [
  ...basicInfoFields,
  ...mediaGalleryFields,
  ...servicesPromotionsFields,
  ...condensedCardFields
];

// ============================================
// MODAL TABS CONFIGURATION
// ============================================
/**
 * Custom tabs configuration for professional create/edit modals
 */
export const professionalModalTabs: CustomTab[] = [
  {
    id: 'basic-info',
    label: 'Basic Info',
    fields: basicInfoFields
  },
  {
    id: 'media-gallery',
    label: 'Media & Gallery',
    fields: mediaGalleryFields
  },
  {
    id: 'services-promotions',
    label: 'Services & Promos',
    fields: servicesPromotionsFields
  },
  {
    id: 'condensed-card',
    label: 'Sections',
    fields: condensedCardFields
  }
];

/**
 * Filter fields based on modal type for professionals
 */
export const getProfessionalFieldsForModalType = (modalType: string): FieldConfig[] => {
  let filteredFields = professionalEditFields;

  // Apply modal type filtering
  if (modalType !== 'custom') {
    // For standard modal, hide the custom modal field
    filteredFields = filteredFields.filter(field => field.name !== 'customModalId');
  }

  // Apply hide parameter filtering
  filteredFields = filteredFields.filter(field => !field.hide);

  return filteredFields;
};

/**
 * Get default values for professional fields
 */
export const getDefaultProfessionalValues = (): Record<string, any> => {
  return {
    modalType: 'standard',
    customModalId: '',
    certificationLevel: 'Silver',
    yearsExperience: 5,
    featured: false,
    isFounder: false,
    rating: 0,
    reviewCount: 0,
    hasDigitalCard: true,
    condensedCardConfig: DEFAULT_CONDENSED_CARD_CONFIG
  };
};
