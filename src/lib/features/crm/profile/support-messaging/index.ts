// Support Messaging Feature - Public Exports

// Import for re-export alias
import type { AriaLivePriority as _AriaLivePriority } from '@/lib/shared/hooks';

// Types
export type {
  ConversationStatus,
  ConversationPriority,
  ConversationTag,
  ConversationMetrics,
  MessageReaction,
  Conversation,
  Message,
  ConversationWithMessages,
  CreateConversationRequest,
  CreateConversationResponse,
  SendMessageRequest,
  SendMessageResponse,
  ConversationsListResponse,
  ConversationResponse,
  UnreadCountResponse,
  UseConversationsReturn,
  UseConversationReturn,
  UseAdminUnreadCountReturn,
  PendingMessage,
  PendingMessageStatus,
  Attachment,
  SerializableAttachment,
} from './types';

// Audit Log Types
export type {
  AuditAction,
  AuditLogEntry,
  SerializableAuditLogEntry,
  CreateAuditLogInput,
} from './types/auditLog';

// Attachment Types
export {
  ALLOWED_FILE_TYPES,
  ALL_ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_ATTACHMENTS_PER_MESSAGE,
  getAttachmentType,
  isAllowedFileType,
  formatFileSize,
  getFileExtension,
  validateFile,
} from './types/attachment';
export type { AttachmentType } from './types/attachment';

// Config
export {
  ADMIN_EMAILS,
  DEFAULT_ADMIN_EMAIL,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  CONVERSATION_TAGS,
  MESSAGE_CONFIG,
  NOTIFICATION_CONFIG,
  AVAILABLE_REACTIONS,
  COLLECTION_PATHS,
  MESSAGES,
  TYPING_CONFIG,
  RATE_LIMITS,
  PAGINATION_CONFIG,
  isAdminEmail,
} from './config';

// Hooks
export { useConversations } from './hooks/useConversations';
export { useConversation } from './hooks/useConversation';
export { useSendMessage } from './hooks/useSendMessage';
export { useAdminUnreadCount } from './hooks/useAdminUnreadCount';
export { useConnectionState } from './hooks/useConnectionState';
export type { UseConnectionStateReturn, ConnectionState } from './hooks/useConnectionState';
export { useConversationSearch, highlightMatches } from './hooks/useConversationSearch';
export type { UseConversationSearchReturn } from './hooks/useConversationSearch';
export { useAuditLog } from './hooks/useAuditLog';
export type { UseAuditLogReturn } from './hooks/useAuditLog';
export { useFileUpload } from './hooks/useFileUpload';
export type { UploadProgress, UseFileUploadReturn } from './hooks/useFileUpload';

// Re-export shared hooks for backwards compatibility
export {
  useNotificationSound,
  useRateLimit,
  type RateLimitConfig,
  type UseRateLimitReturn,
  useAriaAnnouncer,
  type UseAriaAnnouncerReturn,
  type AriaLivePriority,
  useKeyboardNavigation,
  useFocusTrap,
  usePrefersReducedMotion,
  useVirtualizedList,
} from '@/lib/shared/hooks';

// Legacy type alias for backwards compatibility
export type AnnouncePolitenesssss = _AriaLivePriority;

// Components
export { SupportLink } from './components/SupportLink';
export { MessagesPage } from './components/MessagesPage';
export { ConversationView, useConversationView } from './components/ConversationView';
export { MessageBubble } from './components/MessageBubble';
export { MessageReactions } from './components/MessageReactions';
export { NewConversationModal } from './components/NewConversationModal';
export { MessagingErrorBoundary } from './components/MessagingErrorBoundary';
export { PriorityBadge } from './components/PriorityBadge';
export { TagBadge, TagList } from './components/TagBadge';
export { TagSelector } from './components/TagSelector';
export { ResponseTimeDisplay, ResponseMetricsSummary } from './components/ResponseTimeDisplay';
export { SearchInput, HighlightedText } from './components/SearchInput';
export { AuditLogPanel } from './components/AuditLogPanel';
export { AttachmentUploader } from './components/AttachmentUploader';
export { AttachmentPreview, AttachmentIndicator } from './components/AttachmentPreview';

// Re-export shared components for backwards compatibility
export { LoadingSpinner, ConnectionIndicator, AriaAnnouncer } from '@/lib/shared/components';

// Utils - messaging-specific wrappers
export {
  sanitizeMessageContent,
  isValidMessageContent,
  getMessageCharCount,
  MAX_MESSAGE_LENGTH,
} from './utils/sanitize';

// Re-export shared utilities for backwards compatibility
export { formatRelativeTime, formatMessageTime, formatFullDateTime } from '@/lib/shared/utils/dateTime';
export {
  createAuditLog,
  fetchAuditLogs,
  getAuditActionDescription,
  getAuditActionIcon,
  AUDIT_LOG_COLLECTION,
} from './utils/auditLog';

// Store
export {
  supportMessagingReducer,
  setConversations,
  setConversationsLoading,
  setCurrentConversation,
  clearCurrentConversation,
  setMessages,
  setMessagesLoading,
  addMessage,
  setAdminUnreadCount,
  updateConversationStatus,
  updateConversationPriority,
  updateConversationUnread,
  setLoading,
  setError,
  resetSupportMessaging,
  toSerializableConversation,
  fromSerializableConversation,
  toSerializableMessage,
  fromSerializableMessage,
  toSerializableConversationWithMessages,
  fromSerializableConversationWithMessages,
} from './store';
export type {
  SerializableMessage,
  SerializableConversation,
  SerializableConversationWithMessages,
} from './store';
