import type { ContactMethod, BookingStatus, CancellationPolicy, AutoReplyTrigger, CommunicationSettings } from './types';

export const CONTACT_METHOD_OPTIONS: {
  method: ContactMethod;
  label: string;
  icon: string;
  placeholder: string;
  validation: RegExp;
}[] = [
  {
    method: 'email',
    label: 'Email',
    icon: 'Mail',
    placeholder: 'your@email.com',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  {
    method: 'phone',
    label: 'Phone',
    icon: 'Phone',
    placeholder: '+1 (555) 123-4567',
    validation: /^\+?[\d\s\-\(\)]+$/,
  },
  {
    method: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    placeholder: '+1 555 123 4567',
    validation: /^\+?[\d\s]+$/,
  },
  {
    method: 'instagram',
    label: 'Instagram',
    icon: 'Instagram',
    placeholder: '@yourusername',
    validation: /^@?[\w.]+$/,
  },
  {
    method: 'platform_message',
    label: 'Platform Messages',
    icon: 'MessageSquare',
    placeholder: 'Enabled by default',
    validation: /.*/,
  },
];

export const BOOKING_STATUS_OPTIONS: {
  value: BookingStatus;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'accepting',
    label: 'Accepting Bookings',
    description: 'Customers can book appointments',
    icon: 'CheckCircle',
  },
  {
    value: 'paused',
    label: 'Paused',
    description: 'Temporarily not accepting new bookings',
    icon: 'PauseCircle',
  },
  {
    value: 'by_request',
    label: 'By Request Only',
    description: 'Customers must request and you approve',
    icon: 'HelpCircle',
  },
];

export const CANCELLATION_POLICIES: {
  value: CancellationPolicy;
  label: string;
  description: string;
}[] = [
  {
    value: 'flexible',
    label: 'Flexible',
    description: 'Free cancellation up to 24 hours before',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Free cancellation up to 48 hours before',
  },
  {
    value: 'strict',
    label: 'Strict',
    description: 'Free cancellation up to 7 days before',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Set your own cancellation policy',
  },
];

export const AUTO_REPLY_TRIGGERS: {
  value: AutoReplyTrigger;
  label: string;
  description: string;
}[] = [
  {
    value: 'disabled',
    label: 'Disabled',
    description: 'No automatic replies',
  },
  {
    value: 'always',
    label: 'Always',
    description: 'Reply to all new messages',
  },
  {
    value: 'outside_hours',
    label: 'Outside Business Hours',
    description: 'Reply when outside your set hours',
  },
  {
    value: 'when_busy',
    label: 'When Busy',
    description: 'Reply when bookings are paused',
  },
];

export const DEFAULT_AUTO_REPLY_MESSAGE = `Thanks for reaching out! I've received your message and will get back to you as soon as possible.

In the meantime, feel free to check my availability and book an appointment through my profile.

Best,
{{brand_name}}`;

export const DEFAULT_COMMUNICATION_SETTINGS: CommunicationSettings = {
  contactMethods: [
    {
      method: 'platform_message',
      enabled: true,
      value: '',
      isPrimary: true,
      displayOnProfile: true,
    },
  ],
  booking: {
    status: 'accepting',
    leadTime: 24,
    maxAdvanceBooking: 60,
    requireDeposit: false,
    instantBooking: true,
    cancellationPolicy: 'moderate',
  },
  autoReply: {
    enabled: false,
    trigger: 'disabled',
    message: DEFAULT_AUTO_REPLY_MESSAGE,
    includeAvailability: true,
    includeBookingLink: true,
    excludeExistingClients: true,
  },
};
