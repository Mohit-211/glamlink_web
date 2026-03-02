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