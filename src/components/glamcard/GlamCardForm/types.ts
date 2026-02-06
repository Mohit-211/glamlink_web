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
  src: string;              // base64 or url
  caption?: string;
  is_thumbnail: boolean;
  sort_order: number;
}


export interface GlamCardFormData {
  /* BASIC INFO */
  name: string;
  business_name: string;
  professional_title: string;
  profession?: string;
  email: string;
  phone: string;
  bio: string;

  /* MEDIA */
  // profileImage?: string;
          // base64 / URL (preview)
  // profileImage?: string;
  profileImage?: File; 
  gallery_meta: GalleryMetaItem[];

  /* LOCATIONS */
  locations: Location[];
  business_hours: BusinessHour[];

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
  excitement: string[];
  painPoints: string[];
  promo: boolean;
  eliteSetup: boolean;
}
