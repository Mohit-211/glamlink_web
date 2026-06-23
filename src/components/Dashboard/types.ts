export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  cardTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  orderId: string;
}

export interface AccessCardData {
  id: number;
  name: string;
  professional_title: string;
  bio: string;
  email: string;
  phone: string;
  business_name: string;
  booking_link: string;
  is_phone_visible: boolean;
  primary_specialty: string;
  specialties: string[];
  website: string;
  custom_handle: string;
  social_media: Record<string, string>;
  profile_image: string | null;
  business_card_link: string;
  business_card_qr: string;
  payment_status: 'pending' | 'completed' | 'failed';
  subscription_status: 'active' | 'inactive' | 'cancelled';
}

