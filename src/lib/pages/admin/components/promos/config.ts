import { FieldConfig } from "@/lib/pages/admin/types";
import { CustomModalConfig } from "@/lib/features/promos/config";

// Extended field config for promos that includes additional properties
interface PromoFieldConfig extends FieldConfig {
  min?: number;
  defaultValue?: any;
  rows?: number;
  helpText?: string;
}

// Custom Modal Registry - Available custom modals for promos
export const CUSTOM_MODAL_REGISTRY: CustomModalConfig[] = [
  {
    id: 'parie-medical-spa',
    name: 'Parie Medical Spa Dialog',
    description: 'Giveaway entry dialog for Parie Medical Spa promotion',
    component: '@/lib/features/promos/components/custom-modals/ParieMedicalSpaDialog'
  },
  {
    id: 'thanksgiving-glam-giveaway',
    name: 'Thanksgiving Glam Giveaway',
    description: 'Thanksgiving giveaway entry dialog with app store download',
    component: '@/lib/features/promos/components/custom-modals/ThanksgivingGlamGiveawayDialog'
  }
];

// Modal type options for form selector
export const MODAL_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard Modal' },
  { value: 'custom', label: 'Custom Modal' }
];
import { PromoItem } from "@/lib/features/promos/config";

// Predefined categories for promos
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

// Common discount/offer types
export const DISCOUNT_TYPES = [
  { value: "FREE", label: "Free" },
  { value: "BOGO", label: "Buy One Get One" },
  { value: "PERCENTAGE", label: "Percentage Off" },
  { value: "FIXED_AMOUNT", label: "Fixed Amount Off" },
  { value: "GIFT_CARD", label: "Gift Card" },
  { value: "OTHER", label: "Other" }
];

// Form field configuration for promos
export const promoFormFields: PromoFieldConfig[] = [
  {
    name: "modalType",
    label: "Modal Type",
    type: "select",
    options: MODAL_TYPE_OPTIONS,
    defaultValue: "standard",
    required: true,
    helpText: "Choose between standard modal or custom modal component"
  },
  {
    name: "customModalId",
    label: "Custom Modal",
    type: "select",
    options: CUSTOM_MODAL_REGISTRY.map(modal => ({
      value: modal.id,
      label: modal.name
    })),
    placeholder: "Select custom modal...",
    helpText: "Choose which custom modal component to use (only for Custom Modal type)"
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
    placeholder: "Enter detailed description with HTML..."
  },
  {
    name: "modalContentHeader",
    label: "Modal Content Header",
    type: "text",
    placeholder: "Header for modal popup...",
    helpText: "Only used for Standard Modal type"
  },
  {
    name: "image",
    label: "Promo Image",
    type: "image",
    contentType: "product", // Use 'product' as it's supported
    required: true,
    helpText: "Upload promo image (recommended: 16:9 ratio)"
  },
  {
    name: "link",
    label: "Promo Link",
    type: "text", // Use 'text' instead of 'url'
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
    helpText: "Only used for Standard Modal type"
  },
  {
    name: "modalCategoryBadge",
    label: "Modal Category Badge",
    type: "text",
    placeholder: "Limited Time",
    helpText: "Only used for Standard Modal type"
  },
  {
    name: "priority",
    label: "Priority",
    type: "number",
    min: 1,
    defaultValue: 5,
    helpText: "Higher number = higher priority"
  },
  {
    name: "visible",
    label: "Visible to Users",
    type: "checkbox",
    defaultValue: true
  },
  {
    name: "featured",
    label: "Featured Promo",
    type: "checkbox",
    defaultValue: false
  }
];

// Helper function to filter fields based on modal type
export const getFieldsForModalType = (modalType: string, allFields: PromoFieldConfig[]): PromoFieldConfig[] => {
  if (modalType === 'custom') {
    // Hide standard modal-specific fields for custom modals
    const standardModalFields = ['modalContentHeader', 'modalStatusBadge', 'modalCategoryBadge'];
    return allFields.filter(field => !standardModalFields.includes(field.name));
  }
  // For standard modal, show all fields but make custom modal field optional
  return allFields.map(field =>
    field.name === 'customModalId'
      ? { ...field, required: false }
      : field
  );
};

// Example promo data for JSON editor templates
export const promoExamples = {
  giftCard: {
    id: 'example-gift-card',
    modalType: 'standard' as const,
    title: "$100 Amazon Gift Card Giveaway",
    subtitle: "Gift Card",
    descriptionShort: "Vegas Beauty & Wellness Professionals - your app is here!",
    description: "<ol class=\"list-decimal list-inside space-y-1 ml-4\"><li>Download Glamlink Pro on App Store</li><li>Add at least 1 post, clip, photo album</li><li>Set up your hours & services</li><li>Add in-app booking or your own booking link at <a href=\"http://www.crm.glamlink.net\" class=\"text-blue-600 hover:underline\">www.crm.glamlink.net</a></li><li>Share you joined Glamlink and tag <span class=\"font-semibold\">@glamlink_app</span> on IG</li></ol><p class=\"mt-4\">BONUS: Not only do you receive a Founders Badge but you can have the chance of being featured in our digital magazine, The Glamlink Edit.</p><p class=\"mt-4\">Winner Announced Monday Nov 10</p>",
    modalContentHeader: "How to enter",
    image: "/images/amazon_card_2.png",
    link: "https://apps.apple.com/us/app/glamlink-pro/id6502331317",
    ctaText: "Sign Up & Post",
    popupDisplay: "$100 Gift Card Giveaway",
    startDate: "2025-10-12",
    endDate: "2025-11-10",
    category: "Gift Cards",
    discount: null,
    modalStatusBadge: "Sign Up Now",
    modalCategoryBadge: "Giveaway",
    priority: 9,
    visible: true,
    featured: true
  },
  serviceDiscount: {
    id: 'example-service-discount',
    modalType: 'standard' as const,
    title: "20% Off All Hair Services",
    subtitle: "Limited Time Offer",
    descriptionShort: "Get 20% off any hair service this month",
    description: "Book any hair service this month and get 20% off. Includes cuts, coloring, treatments, and more. Valid for first-time clients only.",
    modalContentHeader: "Service Details",
    image: "/images/hair_service.jpg",
    link: "/book-appointment",
    ctaText: "Book Now",
    popupDisplay: "20% Off Hair",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    category: "Services",
    discount: "20% OFF",
    modalStatusBadge: "Limited Time",
    modalCategoryBadge: "Services",
    priority: 7,
    visible: true,
    featured: false
  },
  thanksgivingGiveaway: {
    id: 'example-thanksgiving-giveaway',
    modalType: 'custom' as const,
    customModalId: 'thanksgiving-glam-giveaway',
    title: "Thanksgiving Glam Giveaway",
    subtitle: "Win Beauty Prizes",
    descriptionShort: "Enter our Thanksgiving giveaway for a chance to win amazing beauty prizes",
    description: "Join our Thanksgiving giveaway and celebrate the season with glam! Download the Glamlink app and enter for a chance to win exclusive beauty products and services.",
    image: "/images/thanksgiving_glam.jpg",
    link: "https://apps.apple.com/us/app/glamlink-pro/id6502331317",
    ctaText: "Enter Now",
    popupDisplay: "Thanksgiving Giveaway",
    startDate: "2025-11-15",
    endDate: "2025-11-30",
    category: "Giveaway",
    discount: null,
    priority: 10,
    visible: true,
    featured: true
  }
};

// Generate default form data
export const generateDefaultPromoData = (): Partial<PromoItem> => {
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
    endDate: thirtyDaysFromNow.toISOString().split('T')[0],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
};

// Validate promo data
export const validatePromoData = (data: Partial<PromoItem>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!data.title || data.title.trim() === '') {
    errors.push("Title is required");
  }

  if (!data.link || data.link.trim() === '') {
    errors.push("Link is required");
  }

  if (!data.ctaText || data.ctaText.trim() === '') {
    errors.push("CTA button text is required");
  }

  if (!data.startDate) {
    errors.push("Start date is required");
  }

  if (!data.endDate) {
    errors.push("End date is required");
  }

  // Modal type validation
  if (data.modalType === 'custom' && !data.customModalId) {
    errors.push("Custom modal selection is required when Custom Modal type is selected");
  }

  // Date validation
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate >= endDate) {
      errors.push("End date must be after start date");
    }
  }

  // URL validation
  if (data.link && !isValidUrl(data.link)) {
    errors.push("Link must be a valid URL");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}