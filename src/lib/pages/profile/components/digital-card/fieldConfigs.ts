import type { FieldConfig } from "@/lib/pages/admin/types/forms";

// Define tabs for professional edit form
export const EDIT_TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "contact", label: "Contact & Booking" },
  { id: "location", label: "Location" },
  { id: "hours", label: "Hours & Info" },
  { id: "media", label: "Media" },
  { id: "promotions", label: "Promotions" },
  { id: "condensedCard", label: "Sections" },
];

// Field configurations for each tab
export const basicInfoFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Your full name",
  },
  {
    name: "title",
    label: "Occupation",
    type: "text",
    required: true,
    placeholder: "e.g., Master Esthetician, Hair Stylist",
  },
  {
    name: "specialty",
    label: "Primary Specialty",
    type: "text",
    required: true,
    placeholder: "e.g., Skincare, Hair Color, Makeup",
  },
  {
    name: "business_name",
    label: "Business Name",
    type: "text",
    placeholder: "e.g., Glamlink Salon, Beauty Studio",
    helperText: "Name of your business or salon",
  },
  {
    name: "bio",
    label: "Professional Bio",
    type: "html",
    placeholder: "Tell clients about your background, expertise, and approach...",
    helperText: "Supports rich text formatting",
  },
];

export const contactBookingFields: FieldConfig[] = [
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "(555) 123-4567",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    placeholder: "https://your-website.com",
  },
  {
    name: "instagram",
    label: "Instagram",
    type: "text",
    placeholder: "@username or https://instagram.com/username",
  },
  {
    name: "tiktok",
    label: "TikTok",
    type: "text",
    placeholder: "@username or https://tiktok.com/@username",
  },
  {
    name: "bookingUrl",
    label: "Booking Link",
    type: "url",
    placeholder: "https://calendly.com/your-link",
    helperText: "URL for clients to book appointments",
  },
  {
    name: "preferredBookingMethod",
    label: "Preferred Booking Method",
    type: "select",
    options: [
      { value: "", label: "Not set" },
      { value: "send-text", label: "Send Text" },
      { value: "instagram", label: "Instagram Profile" },
      { value: "booking-link", label: "Go to Booking Link" },
    ],
    helperText: "How clients should book appointments",
  },
];

export const locationFields: FieldConfig[] = [
  {
    name: "locations",
    label: "Business Locations",
    type: "multiLocation",
    required: false,
    helperText: "Add your business locations. Mark one as primary.",
  },
];

export const hoursInfoFields: FieldConfig[] = [
  {
    name: "businessHours",
    label: "Business Hours",
    type: "array",
    helperText: 'Add your operating hours (e.g., "Monday: 9:00 AM - 6:00 PM")',
  },
  {
    name: "specialties",
    label: "Specialties",
    type: "specialties",
    helperText: "Add your specialty tags (e.g., Hair Color, Skincare, Nails)",
  },
  {
    name: "importantInfo",
    label: "Important Info for Clients",
    type: "array",
    maxItems: 10,
    helperText: 'Key information (e.g., "By appointment only", "Cash preferred")',
  },
];

export const mediaFields: FieldConfig[] = [
  {
    name: "profileImage",
    label: "Profile Image",
    type: "image",
    helperText: "Your professional headshot",
  },
  {
    name: "gallery",
    label: "Gallery",
    type: "gallery",
    helperText: "Upload up to 1 video (60 sec max) and 5 images to showcase your work",
  },
];

export const promotionsFields: FieldConfig[] = [
  {
    name: "promotions",
    label: "Promotions",
    type: "promotions",
    helperText: "Add promotional offers for your services",
  },
];

// Map tab IDs to their field configurations
export const TAB_FIELDS: Record<string, FieldConfig[]> = {
  basic: basicInfoFields,
  contact: contactBookingFields,
  location: locationFields,
  hours: hoursInfoFields,
  media: mediaFields,
  promotions: promotionsFields,
};

// All fields combined for FormProvider
export const allFields: FieldConfig[] = [
  ...basicInfoFields,
  ...contactBookingFields,
  ...locationFields,
  ...hoursInfoFields,
  ...mediaFields,
  ...promotionsFields,
];
