/* ================= SHARED TYPES ================= */
/** Keyed by validateData's field keys (see GlamCardForm.tsx) — value is the message to show under that field when it fails validation. */
export type FieldErrors = Partial<Record<string, string>>;
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
  thumbnail_file?: File;
}
/* ================= FEATURED LINKS ================= */
export interface FeaturedLink {
  /** Client-side only — used as a React key/local reference, never sent to the server. */
  id: string;
  title: string;
  url: string;
  /** Persisted image URL — the actual key the GET response returns. */
  image?: string;
  /** Alternate keys seen/expected for the same thing; kept for safety. */
  thumbnail_url?: string;
  image_url?: string;
  /** Newly selected image pending upload — cleared once saved. */
  thumbnail_file?: File;
  /** Display order (1-based on the wire); index in the array doubles as this. */
  sort_order: number;
  /** The one link a professional has chosen to show first/pinned. */
  is_featured?: boolean;
}
/* ================= MAIN FORM ================= */
export interface GlamCardFormData {
  [x: string]: any;
  other_links: any;
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
  social_media?: {
    instagram?: string;
    instagram1?: string;
    instagram2?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
    facebook?: string;
  };
  preferred_booking_methods: BookingMethod[];
  booking_link?: string;
  important_info: string[];
  featured_links?: FeaturedLink[];
  /** Hex color (e.g. "#3BBDD4") the professional picked to theme their Access Card — drives the Featured Links accent. */
  color_code?: string;
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
  LINK: "GO_tO_BOOKING_LINK",
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