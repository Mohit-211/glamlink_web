/**
 * Get Digital Card Types
 */

import type { LocationData, GalleryItem } from '@/lib/pages/for-professionals/types/professional';

export interface DigitalCardFormData {
  // Professional Info
  name: string;
  title: string;
  specialty: string;
  bio: string;
  profileImage: File | string | null;  // File before upload, string URL after upload

  // Business Details
  businessName?: string;
  locations: LocationData[];
  phone: string;
  email: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  bookingUrl?: string;
  businessHours: string[];

  // Services & Specialties
  specialties: string[];
  customHandle?: string;
  preferredBookingMethod?: 'send-text' | 'instagram' | 'booking-link';
  importantInfo?: string[];  // Array of important info items for clients

  // Media & Portfolio
  gallery?: GalleryItem[];

  // Glamlink Integration
  excitementFeatures?: string[];
  painPoints?: string[];
  promotionOffer?: boolean;
  promotionDetails?: string;
  instagramConsent?: boolean;

  // Application metadata
  applicationType: 'digital-card';
}

export interface DigitalCardSubmission extends DigitalCardFormData {
  id: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  reviewed: boolean;
  metadata?: {
    userAgent: string;
    ip: string;
    source: string;
  };
}
