// ============================================
// EDIT FIELD CONFIGURATIONS
// ============================================

import { FieldConfig } from "@/lib/pages/admin/types";

// ============================================
// PROMO FIELDS CONFIGURATION
// ============================================

export const PROMO_CATEGORIES = [
  { value: "Gift Cards", label: "Gift Cards" },
  { value: "Giveaway", label: "Giveaway" },
  { value: "Services", label: "Services" },
  { value: "Products", label: "Products" },
  { value: "Events", label: "Events" },
  { value: "Training", label: "Training" },
  { value: "Membership", label: "Membership" },
  { value: "Featured", label: "Featured" },
  { value: "Sale", label: "Sale" },
  { value: "New Launch", label: "New Launch" },
  { value: "Other", label: "Other" }
];

export const DISCOUNT_TYPES = [
  { value: "FREE", label: "Free" },
  { value: "BOGO", label: "Buy One Get One" },
  { value: "PERCENTAGE", label: "Percentage Off" },
  { value: "FIXED_AMOUNT", label: "Fixed Amount Off" },
  { value: "GIFT_CARD", label: "Gift Card" },
  { value: "OTHER", label: "Other" }
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

// Custom Modal Registry for promos
export const PROMO_CUSTOM_MODAL_REGISTRY = [
  { value: 'parie-medical-spa', label: 'Parie Medical Spa Dialog' },
  { value: 'thanksgiving-glam-giveaway', label: 'Thanksgiving Glam Giveaway' }
];

export const promoEditFields: FieldConfig[] = [
  {
    name: "modalType",
    label: "Modal Type",
    type: "select",
    options: MODAL_TYPE_OPTIONS,
    required: true,
    helperText: "Choose between standard modal or custom modal component"
  },
  {
    name: "customModalId",
    label: "Custom Modal",
    type: "select",
    options: PROMO_CUSTOM_MODAL_REGISTRY,
    placeholder: "Select custom modal...",
    helperText: "Choose which custom modal component to use (only for Custom Modal type)"
  },
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter promo title..."
  },
  {
    name: "subtitle",
    label: "Subtitle",
    type: "text",
    placeholder: "Enter subtitle (optional)..."
  },
  {
    name: "descriptionShort",
    label: "Short Description",
    type: "textarea",
    placeholder: "Brief description for cards..."
  },
  {
    name: "description",
    label: "Full Description",
    type: "textarea",
    placeholder: "Enter detailed description with HTML...",
    helperText: "HTML supported. Use for rich text formatting."
  },
  {
    name: "modalContentHeader",
    label: "Modal Content Header",
    type: "text",
    placeholder: "Header for modal popup...",
    helperText: "Only used for Standard Modal type"
  },
  {
    name: "image",
    label: "Promo Image",
    type: "image",
    required: true,
    helperText: "Enter image path. Image upload coming soon."
  },
  {
    name: "link",
    label: "Promo Link",
    type: "url",
    required: true,
    placeholder: "https://example.com/promo"
  },
  {
    name: "ctaText",
    label: "CTA Button Text",
    type: "text",
    required: true,
    placeholder: "Sign Up Now"
  },
  {
    name: "popupDisplay",
    label: "Popup Display Name",
    type: "text",
    placeholder: "Special Offer"
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    required: true
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: PROMO_CATEGORIES,
    placeholder: "Select category..."
  },
  {
    name: "discount",
    label: "Discount/Offer Type",
    type: "select",
    options: DISCOUNT_TYPES,
    placeholder: "Select discount type..."
  },
  {
    name: "modalStatusBadge",
    label: "Modal Status Badge",
    type: "text",
    placeholder: "Sign Up Now",
    helperText: "Only used for Standard Modal type"
  },
  {
    name: "modalCategoryBadge",
    label: "Modal Category Badge",
    type: "text",
    placeholder: "Limited Time",
    helperText: "Only used for Standard Modal type"
  },
  {
    name: "priority",
    label: "Priority (1-10)",
    type: "number",
    min: 1,
    max: 10,
    helperText: "Higher number = higher priority"
  },
  {
    name: "visible",
    label: "Visible to Users",
    type: "checkbox",
    checkboxLabel: "Show this promo to users"
  },
  {
    name: "featured",
    label: "Featured Promo",
    type: "checkbox",
    checkboxLabel: "Feature this promo prominently"
  }
];

// ============================================
// PROFESSIONAL FIELDS CONFIGURATION
// ============================================

export const CERTIFICATION_LEVELS = [
  { value: "Bronze", label: "Bronze" },
  { value: "Silver", label: "Silver" },
  { value: "Gold", label: "Gold" },
  { value: "Platinum", label: "Platinum" }
];

export const professionalEditFields: FieldConfig[] = [
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
    label: "Business Location",
    type: "locationInput",
    required: true,
    helperText: "Enter business address with autocomplete"
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
    placeholder: "https://professional-website.com"
  },
  {
    name: "instagram",
    label: "Instagram Handle",
    type: "text",
    placeholder: "@professional_handle",
    helperText: "Primary Instagram for backward compatibility",
    hide: true // Hidden in favor of enhancedSocialLinks array field
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
    name: "yearsExperience",
    label: "Years of Experience",
    type: "number",
    required: true,
    min: 0,
    max: 50
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
    type: "textarea",
    placeholder: "Tell us about your professional background, expertise, and approach..."
  },
  {
    name: "portraitImage",
    label: "Portrait Image",
    type: "image",
    helperText: "Professional headshot or logo"
  },  
  {
    name: "profileImage",
    label: "Profile Image",
    type: "image",
    helperText: "Professional headshot or logo"
  },
  {
    name: "order",
    label: "Display Order",
    type: "number",
    min: 1,
    max: 999
  },

  // === ENHANCED FIELDS ===

  {
    name: "specialties",
    label: "Specialties Array",
    type: "array",
    maxItems: 5,
    helperText: "Maximum 5 specialties showcasing your expertise"
  },
  {
    name: "gallery",
    label: "Gallery & Portfolio",
    type: "gallery",
    helperText: "Mixed media gallery with images and videos showcasing your work"
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
  },
  {
    name: "featured",
    label: "Featured Professional",
    type: "checkbox",
    checkboxLabel: "Feature this professional on the homepage",
    hide: true
  },
  {
    name: "isFounder",
    label: "Founding Member",
    type: "checkbox",
    checkboxLabel: "Mark as founding member of Glamlink",
    hide: true
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Filter fields based on modal type for promos
 */
export const getPromoFieldsForModalType = (modalType: string): FieldConfig[] => {
  if (modalType === 'custom') {
    // Hide standard modal-specific fields for custom modals
    const standardModalFields = ['modalContentHeader', 'modalStatusBadge', 'modalCategoryBadge'];
    return promoEditFields.filter(field => !standardModalFields.includes(field.name));
  }
  // For standard modal, show all fields
  return promoEditFields;
};

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
 * Get default values for promo fields
 */
export const getDefaultPromoValues = (): Record<string, any> => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    modalType: 'standard',
    customModalId: '',
    visible: true,
    featured: false,
    priority: 5,
    popupDisplay: "Special Offer",
    ctaText: "Learn More",
    startDate: now.toISOString().split('T')[0],
    endDate: thirtyDaysFromNow.toISOString().split('T')[0]
  };
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
    reviewCount: 0
  };
};