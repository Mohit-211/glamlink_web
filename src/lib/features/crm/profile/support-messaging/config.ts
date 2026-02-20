// Configuration for Support Messaging System

import { ADMIN_EMAILS } from '@/lib/features/auth/config';
import type { ConversationStatus, ConversationPriority, ConversationTag } from './types';

// Re-export admin emails for convenience
export { ADMIN_EMAILS };

// Default admin for new conversations
export const DEFAULT_ADMIN_EMAIL = 'melanie@glamlink.net';

export const STATUS_OPTIONS: { value: ConversationStatus; label: string; color: string }[] = [
  { value: 'open', label: 'Open', color: 'bg-green-100 text-green-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-gray-100 text-gray-800' },
];

export const COLLECTION_PATHS = {
  conversations: 'support_conversations',
  messages: (conversationId: string) => `support_conversations/${conversationId}/messages`,
  adminNotifications: 'app_settings/admin-notifications',
};

export const MESSAGE_CONFIG = {
  maxLength: 2000,
  warningThreshold: 0.8, // Show counter at 80%
};

export const PRIORITY_OPTIONS: { value: ConversationPriority; label: string; color: string; icon: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-600', icon: '' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800', icon: '' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: '' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', icon: '' },
];

export const CONVERSATION_TAGS: { value: ConversationTag; label: string; color: string }[] = [
  { value: 'billing', label: 'Billing', color: 'bg-green-100 text-green-800' },
  { value: 'bug', label: 'Bug Report', color: 'bg-red-100 text-red-800' },
  { value: 'feature', label: 'Feature Request', color: 'bg-blue-100 text-blue-800' },
  { value: 'question', label: 'Question', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'feedback', label: 'Feedback', color: 'bg-purple-100 text-purple-800' },
];

export const NOTIFICATION_CONFIG = {
  sound: {
    enabled: true,
    volume: 0.5,
    path: '/sounds/message-notification.mp3',
  },
};

export const AVAILABLE_REACTIONS = [
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '✅', label: 'Done' },
  { emoji: '❓', label: 'Question' },
];

export const MESSAGES = {
  newConversation: {
    title: 'Start a New Conversation',
    placeholder: 'Describe your issue or question...',
    subjectPlaceholder: 'Subject (e.g., "Question about my digital card")',
  },
  errors: {
    sendFailed: 'Failed to send message. Please try again.',
    loadFailed: 'Failed to load conversation. Please try again.',
    notFound: 'Conversation not found.',
    rateLimitExceeded: 'Too many messages. Please wait a moment before sending more.',
  },
  empty: {
    userConversations: 'No conversations yet. Start a new conversation to get help from our support team.',
    adminConversations: 'No support conversations.',
  },
};

// Typing indicator configuration
export const TYPING_CONFIG = {
  debounceMs: 1000,      // Delay before clearing typing status
  timeoutMs: 3000,       // Auto-clear after inactivity
};

// Rate limiting configuration
export const RATE_LIMITS = {
  messagesPerMinute: 10,
  messagesPerHour: 100,
  windowMs: 60000, // 1 minute in milliseconds
};

// Pagination configuration
export const PAGINATION_CONFIG = {
  conversationsPerPage: 20,
  messagesPerPage: 10,
  messagesInitialLoad: 10,
};

// Message edit configuration
export const EDIT_CONFIG = {
  /** Time window (in ms) during which messages can be edited */
  allowedWindowMs: 15 * 60 * 1000, // 15 minutes
  /** Maximum number of edits allowed per message */
  maxEdits: 5,
};

// Message pinning configuration
export const PIN_CONFIG = {
  /** Maximum number of pinned messages per conversation */
  maxPinsPerConversation: 5,
};

// Check if an email is an admin email
export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
