/**
 * Digital Card Application - Field Configuration
 */

export interface TabConfig {
  [key: string]: FieldConfig;
}

export interface FieldConfig {
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: Array<{ id: string; label: string; description?: string }>;
  validation?: {
    minChars?: number;
    maxChars?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
  defaultValue?: any;
  // Multi-checkbox specific
  minSelections?: number;
  maxSelections?: number;
  columns?: 1 | 2;
}

export const fields_layout = {
  profile: {
    name: {
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Your full name',
      validation: { minChars: 2 }
    },
    title: {
      type: 'text',
      label: 'Professional Title',
      required: true,
      placeholder: 'e.g., Master Stylist, Esthetician'
    },
    email: {
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'your.email@example.com',
      validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    },
    phone: {
      type: 'tel',
      label: 'Phone Number',
      required: true,
      placeholder: '(555) 123-4567',
      validation: { maxLength: 20 }
    },
    businessName: {
      type: 'text',
      label: 'Business Name',
      required: false,
      placeholder: 'Your salon or business name'
    },
    locations: {
      type: 'multiLocation',
      label: 'Business Locations',
      required: true,
      helperText: 'Add all your business locations. The first location will be your primary location.'
    },
    businessHours: {
      type: 'array',
      label: 'Business Hours',
      required: false,
      helperText: 'Operating hours for each day (e.g., Monday: 9:00 AM - 7:00 PM)'
    },
    specialty: {
      type: 'select',
      label: 'Primary Specialty',
      required: true,
      placeholder: 'Select your primary specialty',
      helperText: 'Choose the category that best describes your main service',
      options: [
        { id: '', label: 'Select a specialty...' },
        { id: 'nails', label: 'Nails' },
        { id: 'hair', label: 'Hair' },
        { id: 'wellness', label: 'Wellness + Med Spa' },
        { id: 'skincare', label: 'Skincare' },
        { id: 'makeup', label: 'Makeup' },
        { id: 'waxing', label: 'Waxing & Hair Removal' },
      ]
    },
    bio: {
      type: 'textarea',
      label: 'Professional Bio',
      required: true,
      placeholder: 'Tell clients about your expertise and approach',
      validation: { maxLength: 150 }
    },
    website: {
      type: 'text',
      label: 'Website',
      required: false,
      placeholder: 'https://yourwebsite.com'
    },
    instagram: {
      type: 'text',
      label: 'Instagram Handle',
      required: false,
      placeholder: '@yourusername'
    },
    tiktok: {
      type: 'text',
      label: 'TikTok Handle',
      required: false,
      placeholder: '@yourusername',
      helperText: 'Your TikTok profile username'
    },
    bookingUrl: {
      type: 'text',
      label: 'Booking Link',
      required: false,
      placeholder: 'https://booking-service.com/yourprofile'
    },
    specialties: {
      type: 'array',
      label: 'Specialties',
      required: false,
      helperText: 'Maximum 5 specialties showcasing your expertise',
      validation: { maxLength: 5 }
    },
    customHandle: {
      type: 'text',
      label: 'Claim Your Custom Handle',
      required: false,
      placeholder: 'This will be used for your Glamlink Profile'
    },
    gallery: {
      type: 'gallery',
      label: 'Gallery & Portfolio',
      required: false,
      helperText: 'Add a short intro video (up to 60 seconds) and highlight your favorite treatments. Upload up to 5 photos of your best work. Licensed or royalty free music only'
    },
    importantInfo: {
      type: 'array',
      label: 'Important Info',
      required: false,
      helperText: 'Key information clients should know (e.g., "By appointment only", "Cash preferred")'
    }
  },
  glamlinkIntegration: {
    excitementFeatures: {
      type: 'multi-checkbox',
      label: 'What excites you about Glamlink?',
      required: true,
      helperText: 'Select all features that excite you',
      minSelections: 1,
      columns: 1,
      options: [
        { id: 'discovery', label: 'Clients ability to discover pros nearby and check out their services, work, reviews, etc' },
        { id: 'booking', label: 'Seamless booking inside Glamlink either in app or goes directly to your booking link' },
        { id: 'ecommerce', label: 'Pro shops & e-commerce' },
        { id: 'magazine', label: 'The Glamlink Edit magazine & spotlights' },
        { id: 'ai', label: 'AI powered discovery & smart recommendations (coming soon)' },
        { id: 'community', label: 'Community & networking with other pros' }
      ]
    },
    painPoints: {
      type: 'multi-checkbox',
      label: 'Biggest pain points',
      required: true,
      helperText: 'Select all pain points that apply to you',
      minSelections: 1,
      columns: 2,
      options: [
        { id: 'no-conversions', label: 'Posting but no conversions' },
        { id: 'dms-backforth', label: 'DMs - too much back and forth' },
        { id: 'no-shows', label: 'No shows' },
        { id: 'juggling-platforms', label: 'Juggling too many platforms (booking, social media, e-commerce, etc)' },
        { id: 'inventory-not-tied', label: 'Inventory/aftercare not tied to treatments' },
        { id: 'client-notes-everywhere', label: 'Client notes/consents all over the place' },
        { id: 'finding-clients', label: 'Finding new clients' },
        { id: 'no-pain-points', label: 'None of the above' }
      ]
    },
    promotionOffer: {
      type: 'checkbox',
      label: 'I would like to offer a promotion with my digital card',
      required: false
    },
    promotionDetails: {
      type: 'textarea',
      label: 'What promotion would you like to run?',
      required: false,
      placeholder: 'Describe your promotion (e.g., 20% off first visit, free consultation with booking, etc.)',
      validation: { maxLength: 5000 }
    },
    instagramConsent: {
      type: 'checkbox',
      label: '<strong>The Elite Setup (Recommended):</strong> I agree to let the Glamlink Concierge Team build my professional profile and digital business card using my existing public social media content. We\'ll curate your first clips, photo albums, and service menu so you can launch instantly.',
      required: true
    }
  }
};

export type FieldsLayout = typeof fields_layout;
