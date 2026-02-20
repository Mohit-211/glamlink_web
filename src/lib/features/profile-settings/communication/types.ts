export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'instagram' | 'platform_message';
export type BookingStatus = 'accepting' | 'paused' | 'by_request';
export type AutoReplyTrigger = 'always' | 'outside_hours' | 'when_busy' | 'disabled';
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | 'custom';

export interface ContactMethodConfig {
  method: ContactMethod;
  enabled: boolean;
  value: string;                      // Email address, phone number, handle
  isPrimary: boolean;                 // Primary contact method
  displayOnProfile: boolean;          // Show on public profile
}

export interface BookingSettings {
  status: BookingStatus;
  pausedUntil?: string;               // ISO date for temporary pause
  pauseReason?: string;               // Optional reason shown to customers
  leadTime: number;                   // Minimum hours before booking (0-168)
  maxAdvanceBooking: number;          // Maximum days in advance (1-365)
  requireDeposit: boolean;            // Require deposit for bookings
  depositAmount?: number;             // Deposit percentage or fixed amount
  depositType?: 'percentage' | 'fixed';
  instantBooking: boolean;            // Allow instant booking vs. request only
  cancellationPolicy: CancellationPolicy;
}

export interface AutoReplySettings {
  enabled: boolean;
  trigger: AutoReplyTrigger;
  message: string;                    // Custom auto-reply message
  includeAvailability: boolean;       // Include next available time
  includeBookingLink: boolean;        // Include link to book
  excludeExistingClients: boolean;    // Don't auto-reply to existing clients
}

export interface CommunicationSettings {
  contactMethods: ContactMethodConfig[];
  booking: BookingSettings;
  autoReply: AutoReplySettings;
}

export interface UseCommunicationReturn {
  settings: CommunicationSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Contact Methods
  updateContactMethod: (method: ContactMethod, updates: Partial<ContactMethodConfig>) => Promise<void>;
  addContactMethod: (config: ContactMethodConfig) => Promise<void>;
  removeContactMethod: (method: ContactMethod) => Promise<void>;
  setPrimaryContact: (method: ContactMethod) => Promise<void>;

  // Booking Settings
  updateBookingSettings: (updates: Partial<BookingSettings>) => Promise<void>;
  pauseBookings: (until?: string, reason?: string) => Promise<void>;
  resumeBookings: () => Promise<void>;

  // Auto Reply
  updateAutoReply: (updates: Partial<AutoReplySettings>) => Promise<void>;
}
