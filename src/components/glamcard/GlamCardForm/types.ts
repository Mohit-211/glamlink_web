/* ================= SHARED TYPES ================= */

export type BusinessHour = {
  note: string;
};

/* ================= LOCATION ================= */

export interface Location {
  id: string;
  label: string;
  location_type: "exact_address" | "city_only";

  address: string;
  area: string;
  city: string;
  state: string;

  latitude?: number;
  longitude?: number;
  isSet?: boolean;

  business_name: string;
  phone: string;
  description: string;

  isPrimary: boolean;
  isOpen: boolean;
}

/* ================= GALLERY ================= */

export interface GalleryMetaItem {
  id: string;
  caption: string;
  is_thumbnail: boolean;
  sort_order: number;
}

/* ================= MAIN FORM ================= */

export interface GlamCardFormData {
  /* BASIC INFO */
  name: string;
  business_name: string;
  professional_title: string;
  profession?: string;

  email: string;
  phone: string;
  booking_phone: string;

  bio: string;

  /* USER HANDLES */
  custom_handle: string;
  instagram_handle: string;

  /* MEDIA */
  profile_image: File;       // ✅ required (you always use it)
  images: File[];
  gallery_meta: GalleryMetaItem[];

  /* LOCATION */
  locations: Location[];
  business_hour: BusinessHour[];

  /* SERVICES */
  primary_specialty: string;
  specialties: string[];

  /* LINKS */
  website?: string;

  social_media: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };

preferred_booking_method: BookingMethod;
  booking_link?: string;
  important_info: string[];

  /* MARKETING */
  offer_promotion?: boolean;
  promotion_details?: string;

  excites_about_glamlink: string[];
  biggest_pain_points: string[];

  elite_setup: boolean;
}

/* ================= EXTRA TYPES ================= */

export type PriceRange = "$" | "$$" | "$$$" | "$$$$" | "";

export const BOOKING_METHODS = {
  LINK: "Go_to_Booking_Link",
  CALL: "CALL_TEXT",
  INSTAGRAM: "DM_INSTAGRAM",
} as const;

export type BookingMethod =
  (typeof BOOKING_METHODS)[keyof typeof BOOKING_METHODS];
export type YearsInBusiness =
  | "Less than 1 year"
  | "1–3 years"
  | "3–5 years"
  | "5–10 years"
  | "10+ years"
  | "";

/* ================= SECOND FORM ================= */

export interface FormData {
  // Section 1 – Business Info
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  bio: string;

  // Section 2 – Location
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  // Section 3 – Specialty
  specialties: string[];
  otherSpecialty: string;

  // Section 4 – Treatments
  treatments: string[];

  // Section 5 – Media
  profilePhoto: File | null;
  studioPhoto: File | null;
  logo: File | null;

  // Section 6 – Details
  yearsInBusiness: YearsInBusiness;
  priceRange: PriceRange;
  bookingMethod: BookingMethod;
  certifications: string;
  howHeard: string;

  // Access card opt-in
  createAccessCard: boolean;
}

/* ================= UI ================= */

export interface Specialty {
  label: string;
  icon: string;
}

export type FormSection = 1 | 2 | 3 | 4 | 5 | 6;