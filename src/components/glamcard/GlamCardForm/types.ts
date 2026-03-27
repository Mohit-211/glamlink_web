/* ================= SHARED TYPES ================= */
export type BusinessHour =
 
  {
      note: string;
    };


export interface Location {
  id: string;
  label: string;
  location_type: "exact_address" | "city_only";
  address: string;
  area: string;
  city: string;
  state: string;

  latitude?: number;     // ✅ ADD THIS
  longitude?: number;     // ✅ ADD THIS
  isSet?: boolean;  // optional helper

  business_name: string;
  phone: string;
  description: string;
  isPrimary: boolean;
  isOpen: boolean;
}
export interface GalleryMetaItem {
  id: string;
  caption: string;
  is_thumbnail: boolean;
  sort_order: number;
}
export interface GlamCardFormData {
  // business_card_link: any;
  // data: GlamCardFormData;
  promotion_details: string;
  offer_promotion: boolean | undefined;
  booking_link: string;
  profileImage: string | Blob | undefined;
  /* BASIC INFO */
  name: string;
  business_name: string;
  professional_title: string;
  profession?: string;
  email: string;
  phone: string;
  bio: string;
  profile_image?: File;              // ✅ SINGLE profile image
  images: File[];            // ✅ gallery images only
  gallery_meta: GalleryMetaItem[];
  /* LOCATIONS */
  locations: Location[];
  business_hour: BusinessHour[];
  /* SERVICES */
  primary_specialty: string;
  specialties: string[];
  /* LINKS */
  custom_handle: string;
  website: string;
  social_media: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
  /* BOOKING */
  preferred_booking_method: string;
  important_info: string[];
  /* MARKETING */
  excites_about_glamlink: string[];
  biggest_pain_points: string[];
  elite_setup: boolean;
  
}
export type PriceRange = '$' | '$$' | '$$$' | '$$$$' | ''
export type BookingMethod = 'Online booking' | 'Phone / text' | 'Walk-ins welcome' | 'By appointment only' | ''
export type YearsInBusiness = 'Less than 1 year' | '1–3 years' | '3–5 years' | '5–10 years' | '10+ years' | ''

export interface FormData {
  // Section 1 – Business Info
  businessName: string
  fullName: string
  email: string
  phone: string
  website: string
  instagram: string
  bio: string

  // Section 2 – Location
  address: string
  city: string
  state: string
  zip: string
  country: string

  // Section 3 – Specialty
  specialties: string[]
  otherSpecialty: string

  // Section 4 – Treatments
  treatments: string[]

  // Section 5 – Media
  profilePhoto: File | null
  studioPhoto: File | null
  logo: File | null

  // Section 6 – Details
  yearsInBusiness: YearsInBusiness
  priceRange: PriceRange
  bookingMethod: BookingMethod
  certifications: string
  howHeard: string

  // Access card opt-in
  createAccessCard: boolean
}

export interface Specialty {
  label: string
  icon: string
}

export type FormSection = 1 | 2 | 3 | 4 | 5 | 6