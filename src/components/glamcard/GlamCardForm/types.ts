/* ================= SHARED TYPES ================= */
export interface BusinessHour {
  day: string;
  open_time: string;
  close_time: string;
  closed?: boolean;
}
export interface Location {
  id: string;
  label: string;
  type: "exact" | "city";
  address: string;
  city: string;
  state: string;
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