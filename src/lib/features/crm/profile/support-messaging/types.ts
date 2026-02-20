// Types for Support Messaging System

import type { Attachment, SerializableAttachment } from './types/attachment';

export type ConversationStatus = 'open' | 'resolved' | 'pending';
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ConversationTag = 'billing' | 'bug' | 'feature' | 'question' | 'feedback';

// Re-export attachment types
export type { Attachment, SerializableAttachment };

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

/**
 * Record of a message edit
 */
export interface MessageEdit {
  content: string;
  editedAt: Date;
}

export interface ConversationMetrics {
  firstResponseTimeMs?: number;  // Time from creation to first admin reply
  averageResponseTimeMs?: number;
  totalAdminReplies: number;
}

export interface Conversation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  adminId: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  subject: string;
  unreadByUser: number;
  unreadByAdmin: number;
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  /** Timestamp when the user last viewed this conversation (for unread divider) */
  lastReadAt?: Date;
  /** Tags for categorizing conversations */
  tags?: ConversationTag[];
  /** Response time metrics (admin only) */
  metrics?: ConversationMetrics;
}

export interface Message {
  id: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  content: string;
  timestamp: Date;
  readAt?: Date;
  /** Array of user IDs who have read this message */
  readBy?: string[];
  /** Reactions on this message */
  reactions?: MessageReaction[];
  /** Status for optimistic messages - only present for messages being sent */
  status?: 'sending' | 'failed';
  /** File attachments */
  attachments?: Attachment[];
  /** When the message was last edited */
  editedAt?: Date;
  /** History of edits (original content stored first) */
  editHistory?: MessageEdit[];
  /** Whether the message is pinned */
  isPinned?: boolean;
  /** User ID who pinned the message */
  pinnedBy?: string;
  /** When the message was pinned */
  pinnedAt?: Date;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

// API Request/Response types
export interface CreateConversationRequest {
  subject: string;
  initialMessage: string;
}

export interface CreateConversationResponse {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}

export interface SendMessageRequest {
  content: string;
  attachments?: Attachment[];
}

export interface SendMessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface ConversationsListResponse {
  success: boolean;
  conversations?: Conversation[];
  error?: string;
}

export interface ConversationResponse {
  success: boolean;
  conversation?: ConversationWithMessages;
  error?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  count?: number;
  error?: string;
}

// Hook return types
export interface UseConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isLoadingMore: boolean;
}

export interface UseConversationReturn {
  conversation: ConversationWithMessages | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  sendMessageBatch: (contents: string[]) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  updateStatus: (status: ConversationStatus) => Promise<void>;
  updatePriority: (priority: ConversationPriority) => Promise<void>;
  updateTags: (tags: ConversationTag[]) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  /** Pin a message */
  pinMessage: (messageId: string) => Promise<void>;
  /** Unpin a message */
  unpinMessage: (messageId: string) => Promise<void>;
  /** Edit a message content */
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  /** Whether there are more messages to load */
  hasMoreMessages: boolean;
  /** Load older messages */
  loadMoreMessages: () => Promise<void>;
  /** Whether older messages are being loaded */
  isLoadingMore: boolean;
}

export interface UseAdminUnreadCountReturn {
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Typing indicator types
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  updatedAt: Date;
}

export interface UseTypingIndicatorReturn {
  typingUsers: TypingIndicator[];
  setTyping: (isTyping: boolean) => void;
}

// Pending message types for offline support
export type PendingMessageStatus = 'queued' | 'sending' | 'failed';

export interface PendingMessage {
  id: string;
  content: string;
  timestamp: Date;
  status: PendingMessageStatus;
}
