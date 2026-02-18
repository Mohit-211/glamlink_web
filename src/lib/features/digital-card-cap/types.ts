// Types for Digital Card Submission Cap Feature

export interface SubmissionStatus {
  currentCount: number;
  maxAllowed: number;
  isAccepting: boolean;
  spotsRemaining: number;
  lastUpdated?: Date;
}

export interface WaitlistEntry {
  email: string;
  createdAt: Date;
  notified: boolean;
}

export interface WaitlistFormData {
  email: string;
}

export interface DigitalCardSubmissionSettings {
  currentCount: number;
  maxAllowed: number;
  isAccepting: boolean;
  waitlistEmails: string[];
  lastUpdated: Date;
}

// API Response types
export interface SubmissionStatusResponse {
  success: boolean;
  data?: SubmissionStatus;
  error?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
  alreadyOnWaitlist?: boolean;
}
