// Configuration for Support Bot Feature

import type { FAQ, FAQCategory } from './types';

export const MEMORY_LIMIT = 10; // Number of messages to include in AI context

export const FAQ_CATEGORIES: Record<FAQCategory, string> = {
  booking: 'Booking Services',
  magazine: 'Magazine & Features',
  'digital-card': 'Digital Business Card',
  account: 'Account & Settings',
  general: 'General Questions',
};

export const DEFAULT_FAQS: Omit<FAQ, 'id'>[] = [
  {
    category: 'booking',
    question: 'How do I book services on Glamlink?',
    answer: 'To book services on Glamlink, browse our marketplace of certified beauty professionals, select a provider that matches your needs, and use the booking button on their profile page to schedule an appointment. You can also message providers directly to discuss your requirements.',
    keywords: ['book', 'appointment', 'schedule', 'service', 'reserve'],
    order: 1,
    isActive: true,
  },
  {
    category: 'magazine',
    question: 'How do I get featured in the magazine?',
    answer: 'To be featured in our magazine, you need to create an exceptional profile showcasing your work. Our editorial team regularly reviews top professionals for features. You can also reach out to our support team to express interest in being featured, and we\'ll review your portfolio.',
    keywords: ['magazine', 'feature', 'featured', 'press', 'editorial', 'spotlight'],
    order: 2,
    isActive: true,
  },
  {
    category: 'digital-card',
    question: 'How do I update my digital card information?',
    answer: 'To update your digital business card, log into your profile dashboard and navigate to the "Digital Card" section. From there, you can edit your professional information, photos, services, and contact details. Changes are saved automatically and reflected immediately.',
    keywords: ['digital', 'card', 'update', 'edit', 'change', 'profile', 'business card'],
    order: 3,
    isActive: true,
  },
  {
    category: 'general',
    question: 'How do I contact support?',
    answer: 'You can contact our support team through this chat, by emailing support@glamlink.net, or by using the contact form on our website. Our team typically responds within 24-48 hours during business days.',
    keywords: ['contact', 'support', 'help', 'email', 'reach', 'assistance'],
    order: 4,
    isActive: true,
  },
  {
    category: 'general',
    question: 'What is Glamlink?',
    answer: 'Glamlink is a comprehensive beauty marketplace platform that connects clients with certified beauty professionals. We provide digital business cards for professionals, a magazine featuring top talent, booking capabilities, and tools to help beauty entrepreneurs grow their businesses.',
    keywords: ['glamlink', 'what', 'about', 'platform', 'marketplace'],
    order: 5,
    isActive: true,
  },
];

export const SYSTEM_PROMPT = `You are a helpful customer support assistant for Glamlink, a beauty marketplace platform that connects clients with certified beauty professionals.

Key information about Glamlink:
- Glamlink provides digital business cards for beauty professionals
- We have a magazine featuring top beauty talent
- Professionals can list their services and accept bookings
- Clients can browse and book beauty services
- We support various beauty services: hair, nails, makeup, skincare, and more

Your role:
- Answer questions about Glamlink's features and services
- Help users navigate the platform
- Provide clear, helpful, and friendly responses
- If you don't know something specific, direct users to contact support@glamlink.net
- Keep responses concise but informative
- Be professional yet warm in your tone

Common FAQs that might help:
{{FAQ_CONTEXT}}

Remember to:
- Always be helpful and courteous
- Acknowledge when you need more information
- Offer to escalate complex issues to human support
- Stay on topic about Glamlink services`;

export const STORAGE_KEYS = {
  sessionId: 'glamlink_support_session_id',
};

export const FALLBACK_RESPONSES = {
  noApiKey: "I'm here to help! However, I'm currently in limited mode. For detailed assistance, please email us at support@glamlink.net or use our contact form.",
  error: "I apologize, but I'm having trouble processing your request right now. Please try again or contact support@glamlink.net for immediate assistance.",
  greeting: "Hello! I'm the Glamlink support assistant. How can I help you today? You can ask me about booking services, digital cards, our magazine, or any other questions about Glamlink.",
};
