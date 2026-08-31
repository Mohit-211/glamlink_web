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

export interface AccessOrder {
  id: number;
  order_number: string;
  created_at: string;
  amount_paid: string;
  customer_email: string;
  customer_name: string;
  fulfillment_status: string;
  payment_status: string;
  recipient_name: string;
  shipping_address_line_1: string;
  shipping_address_line_2: string | null;
  shipping_amount: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code: string;
  shipping_state: string;
  tracking_link: string | null;
  tracking_number: string | null;
}

export interface AccessCardData {
  status: string;
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
  access_orders?: AccessOrder[];
}

