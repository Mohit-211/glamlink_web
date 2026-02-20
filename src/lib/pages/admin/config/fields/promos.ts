// ============================================
// PROMO FIELDS CONFIGURATION
// ============================================

import { FieldConfig } from "@/lib/pages/admin/types";

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
