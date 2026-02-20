/**
 * Digital Card Form Configuration
 *
 * Static configuration for the digital business card application form.
 * This is used for migration to the database and as a fallback.
 *
 * IMPORTANT: Keep this in sync with fields_layout in:
 * /lib/pages/apply/get-digital-card/config/fields.ts
 */

import type { DigitalCardFormConfig } from '../types';

export const digitalCardFormConfig: DigitalCardFormConfig = {
  id: 'digital-card-main',
  category: 'digital-card',
  title: 'Digital Business Card Application',
  description: 'Apply for your professional digital business card to showcase your expertise',
  icon: 'card',
  bannerColor: 'bg-gradient-to-r from-teal-600 to-cyan-600',
  enabled: true,
  order: 1,
  previewEnabled: true,
  successMessage: 'Thank you for applying! We\'ll review your application within 2-3 business days.',
  sections: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Your professional details and contact information',
      order: 1,
      layout: 'grid',
      fields: [
        {
          id: 'name',
          name: 'name',
          type: 'text',
          label: 'Full Name',
          required: true,
          placeholder: 'Your full name',
          order: 1,
          validation: { minChars: 2 }
        },
        {
          id: 'title',
          name: 'title',
          type: 'text',
          label: 'Professional Title',
          required: true,
          placeholder: 'e.g., Master Stylist, Esthetician',
          order: 2
        },
        {
          id: 'email',
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'your.email@example.com',
          order: 3,
          validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
        },
        {
          id: 'phone',
          name: 'phone',
          type: 'tel',
          label: 'Phone Number',
          required: true,
          placeholder: '(555) 123-4567',
          order: 4,
          validation: { maxLength: 20 }
        },
        {
          id: 'businessName',
          name: 'businessName',
          type: 'text',
          label: 'Business Name',
          required: false,
          placeholder: 'Your salon or business name',
          order: 5
        },
        {
          id: 'bio',
          name: 'bio',
          type: 'textarea',
          label: 'Professional Bio',
          required: true,
          placeholder: 'Tell clients about your expertise and approach',
          order: 6,
          rows: 4,
          validation: { maxLength: 150 }
        }
      ]
    },
    {
      id: 'locations-hours',
      title: 'Locations & Hours',
      description: 'Where and when clients can find you',
      order: 2,
      layout: 'single',
      fields: [
        {
          id: 'locations',
          name: 'locations',
          type: 'multiLocation',
          label: 'Business Locations',
          required: true,
          helperText: 'Add all your business locations. The first location will be your primary location.',
          order: 1
        },
        {
          id: 'businessHours',
          name: 'businessHours',
          type: 'array',
          label: 'Business Hours',
          required: false,
          helperText: 'Operating hours for each day (e.g., Monday: 9:00 AM - 7:00 PM)',
          order: 2
        }
      ]
    },
    {
      id: 'media-portfolio',
      title: 'Media & Profile',
      description: 'Your professional image and portfolio',
      order: 3,
      layout: 'single',
      fields: [
        {
          id: 'gallery',
          name: 'gallery',
          type: 'gallery',
          label: 'Gallery & Portfolio',
          required: false,
          helperText: 'Upload images and videos to showcase your work',
          order: 1
        }
      ]
    },
    {
      id: 'services-booking',
      title: 'Services & Booking',
      description: 'Your specialties and how clients can reach you',
      order: 4,
      layout: 'single',
      fields: [
        {
          id: 'specialty',
          name: 'specialty',
          type: 'text',
          label: 'Primary Specialty',
          required: true,
          placeholder: 'Hair Styling, Nails, Makeup, etc.',
          order: 1
        },
        {
          id: 'specialties',
          name: 'specialties',
          type: 'array',
          label: 'Specialties',
          required: false,
          helperText: 'Maximum 5 specialties showcasing your expertise',
          order: 2,
          validation: { maxLength: 5 }
        },
        {
          id: 'customHandle',
          name: 'customHandle',
          type: 'text',
          label: 'Claim Your Custom Handle',
          required: false,
          placeholder: 'This will be used for your Glamlink Profile',
          order: 3
        },
        {
          id: 'website',
          name: 'website',
          type: 'text',
          label: 'Website',
          required: false,
          placeholder: 'https://yourwebsite.com',
          order: 4
        },
        {
          id: 'instagram',
          name: 'instagram',
          type: 'text',
          label: 'Instagram Handle',
          required: false,
          placeholder: '@yourusername',
          order: 5
        },
        {
          id: 'enhancedSocialLinks',
          name: 'enhancedSocialLinks',
          type: 'socialLinksArray',
          label: 'Other Social Media',
          required: false,
          helperText: 'Add your other social media profiles (TikTok, YouTube, etc.)',
          order: 6,
          validation: { maxLength: 5 }
        },
        {
          id: 'bookingUrl',
          name: 'bookingUrl',
          type: 'text',
          label: 'Booking Link',
          required: false,
          placeholder: 'https://booking-service.com/yourprofile',
          order: 7
        }
      ]
    },
    {
      id: 'glamlink-integration',
      title: 'Glamlink Integration',
      description: 'Help us understand your needs and how we can best support your business',
      order: 5,
      layout: 'single',
      fields: [
        {
          id: 'excitementFeatures',
          name: 'excitementFeatures',
          type: 'multi-checkbox',
          label: 'What excites you about Glamlink?',
          required: true,
          helperText: 'Select all features that excite you',
          minSelections: 1,
          columns: 1,
          order: 1,
          options: [
            { id: 'discovery', label: 'Clients ability to discover pros nearby and check out their services, work, reviews, etc' },
            { id: 'booking', label: 'Seamless booking inside Glamlink either in app or goes directly to your booking link' },
            { id: 'ecommerce', label: 'Pro shops & e-commerce' },
            { id: 'magazine', label: 'The Glamlink Edit magazine & spotlights' },
            { id: 'ai', label: 'AI powered discovery & smart recommendations (coming soon)' },
            { id: 'community', label: 'Community & networking with other pros' }
          ]
        },
        {
          id: 'painPoints',
          name: 'painPoints',
          type: 'multi-checkbox',
          label: 'Biggest pain points',
          required: true,
          helperText: 'Select all pain points that apply to you',
          minSelections: 1,
          columns: 2,
          order: 2,
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
        {
          id: 'promotionOffer',
          name: 'promotionOffer',
          type: 'checkbox',
          label: 'I would like to offer a promotion with my digital card',
          required: false,
          order: 3
        },
        {
          id: 'promotionDetails',
          name: 'promotionDetails',
          type: 'textarea',
          label: 'What promotion would you like to run?',
          required: false,
          placeholder: 'Describe your promotion (e.g., 20% off first visit, free consultation with booking, etc.)',
          order: 4,
          validation: { maxLength: 5000 },
          showWhen: {
            field: 'promotionOffer',
            value: true
          }
        },
        {
          id: 'instagramConsent',
          name: 'instagramConsent',
          type: 'checkbox',
          label: '<strong>The Elite Setup (Recommended):</strong> I agree to let the Glamlink Concierge Team build my professional profile and digital business card using my existing public social media content. We\'ll curate your first clips, photo albums, and service menu so you can launch instantly.',
          required: true,
          order: 5
        }
      ]
    }
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export default digitalCardFormConfig;
