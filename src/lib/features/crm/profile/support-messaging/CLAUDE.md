# Support Messaging System

Real-time support messaging system enabling users to communicate with admins. Features include optimistic updates, offline support, file attachments, message reactions, pinning, editing, audit logging, and comprehensive accessibility support.

## Directory Structure

```
support-messaging/
├── CLAUDE.md                 # This file
├── index.ts                  # Public API exports
├── config.ts                 # Configuration constants
├── types.ts                  # Core TypeScript types
├── components/               # UI components
├── hooks/                    # React hooks
├── store/                    # Redux state management
├── styles/                   # CSS styles
├── types/                    # Additional type definitions
└── utils/                    # Utility functions
```

---

## Core Files

### `index.ts`
Public API barrel export. All imports from this feature should use this file.

### `config.ts`
Configuration constants:
- `STATUS_OPTIONS` - Conversation statuses (open, pending, resolved)
- `PRIORITY_OPTIONS` - Priority levels (low, normal, high, urgent)
- `CONVERSATION_TAGS` - Tags (billing, bug, feature, question, feedback)
- `MESSAGE_CONFIG` - Max length (2000 chars), warning threshold
- `NOTIFICATION_CONFIG` - Sound settings
- `AVAILABLE_REACTIONS` - Emoji reactions (👍 ❤️ ✅ ❓)
- `RATE_LIMITS` - 10 messages/minute, 100/hour
- `PAGINATION_CONFIG` - 20 conversations/page, 10 messages/page
- `EDIT_CONFIG` - 15-minute edit window, max 5 edits
- `PIN_CONFIG` - Max 5 pins per conversation
- `isAdminEmail()` - Check if email is admin

### `types.ts`
Core type definitions:
- `Conversation` - Conversation metadata
- `Message` - Message with reactions, attachments, edit history
- `ConversationWithMessages` - Conversation + messages array
- API request/response types
- Hook return types

---

## Components

### `components/ConversationView/`
Main conversation UI with message thread.

| File | Description |
|------|-------------|
| `ConversationView.tsx` | Main conversation view component |
| `useConversationView.ts` | Hook managing conversation state, sending, scrolling |
| `useDraftPersistence.ts` | LocalStorage draft saving |
| `useMessageInput.ts` | Input handling with character counting |
| `index.ts` | Barrel export |

### `components/MessagesPage/`
Conversations list view.

| File | Description |
|------|-------------|
| `MessagesPage.tsx` | Main messages list page |
| `ConversationItem.tsx` | Individual conversation list item |
| `useMessagesPage.ts` | Hook for list state, filtering, search |
| `index.ts` | Barrel export |

### Other Components

| File | Description |
|------|-------------|
| `AttachmentPreview.tsx` | File attachment display with thumbnails |
| `AttachmentUploader.tsx` | Drag-and-drop file upload UI |
| `AuditLogPanel.tsx` | Admin audit log viewer |
| `ContentSearchInput.tsx` | Search within conversation content |
| `ExportMenu.tsx` | Export conversation to JSON/TXT/PDF |
| `MessageBubble.tsx` | Individual message display |
| `MessageReactions.tsx` | Emoji reaction picker and display |
| `MessagingErrorBoundary.tsx` | Error boundary for messaging |
| `NewConversationModal.tsx` | Modal to create new conversation |
| `PinnedMessages.tsx` | Pinned messages panel |
| `PriorityBadge.tsx` | Priority level badge |
| `ResponseTimeDisplay.tsx` | Response time metrics display |
| `SearchInput.tsx` | Conversation search with highlighting |
| `SupportLink.tsx` | Link to support page with unread badge |
| `TagBadge.tsx` | Conversation tag badges |
| `TagSelector.tsx` | Multi-select tag picker |
| `TemplateManager.tsx` | Admin template CRUD management |
| `TemplateSelector.tsx` | Template picker for quick replies |

---

## Hooks

### `hooks/useConversation/`
Modular conversation management (split for maintainability).

| File | Description |
|------|-------------|
| `index.ts` | Main `useConversation` hook, composes child hooks |
| `useConversationActions.ts` | Status, priority, tags, reactions, pin, edit actions |
| `useConversationMessages.ts` | Optimistic message sending with retry |
| `useConversationPagination.ts` | Load older messages |
| `useConversationRealtime.ts` | Firestore realtime subscription |

### Other Hooks

| File | Description |
|------|-------------|
| `useAdminUnreadCount.ts` | Total unread count for admin badge |
| `useAuditLog.ts` | Fetch and manage audit log entries |
| `useConnectionState.ts` | Online/offline detection, message queuing |
| `useContentSearch.ts` | Search within message content |
| `useConversations.ts` | Fetch conversation list with pagination |
| `useConversationSearch.ts` | Search/filter conversations |
| `useFileUpload.ts` | File upload with progress tracking |
| `useMessageEdit.ts` | Message editing with validation |
| `useMessageTemplates.ts` | Admin message templates CRUD |
| `useSendMessage.ts` | Simple message sending hook |
| `useTypingIndicator.ts` | Real-time typing indicators |

---

## Store

### `store/supportMessagingSlice.ts`
Redux slice for support messaging state.

**State:**
- `conversations` - List of conversations (serializable)
- `currentConversation` - Active conversation with messages
- `adminUnreadCount` - Total unread for admin
- `isLoading`, `conversationsLoading`, `messagesLoading`
- `error` - Error state

**Actions:**
- `setConversations`, `setCurrentConversation`, `clearCurrentConversation`
- `addMessage`, `setMessages`
- `updateConversationStatus`, `updateConversationPriority`, `updateConversationUnread`
- `setAdminUnreadCount`
- `resetSupportMessaging`

**Serialization Helpers:**
- `toSerializableConversation` / `fromSerializableConversation`
- `toSerializableMessage` / `fromSerializableMessage`
- Converts `Date` objects to ISO strings for Redux

---

## Types

### `types/attachment.ts`
File attachment types and validation.
- `AttachmentType` - image, video, audio, document
- `ALLOWED_FILE_TYPES` - Allowed MIME types per category
- `MAX_FILE_SIZE` - 10MB limit
- `validateFile()` - Validate file before upload

### `types/auditLog.ts`
Audit log entry types.
- `AuditAction` - Actions like 'status_change', 'message_sent', 'pin_message'
- `AuditLogEntry` - Log entry with actor, action, metadata

### `types/template.ts`
Message template types.
- `MessageTemplate` - Template with name, content, category
- `TemplateCategory` - greeting, closing, common, custom

---

## Utils

| File | Description |
|------|-------------|
| `auditLog.ts` | Create/fetch audit logs, action descriptions |
| `csrf.ts` | CSRF token management for API calls |
| `debug.ts` | Toggleable debug logging (`?debug=messaging`) |
| `exportConversation.ts` | Export conversation to JSON/TXT/PDF |
| `messageBatch.ts` | Send multiple messages in batch |
| `rateLimit.ts` | Client-side rate limiting utilities |
| `sanitize.ts` | Message content sanitization, URL parsing |
| `serialization.ts` | Date/object serialization helpers |

---

## Styles

### `styles/accessibility.css`
Accessibility styles including:
- Focus indicators
- Screen reader utilities
- Reduced motion support
- High contrast support

---

## Key Patterns

### Optimistic Updates
Messages are shown immediately with 'sending' status, then updated when confirmed or marked 'failed' for retry.

### Offline Support
`useConnectionState` queues messages when offline, flushes when reconnected.

### Rate Limiting
Client-side rate limiting (10/min) prevents spam. Uses `useRateLimit` from shared hooks.

### Realtime Updates
Firestore `onSnapshot` listeners for instant message/conversation updates.

### Accessibility
- ARIA live regions for announcements
- Keyboard navigation for message list
- Focus trapping in modals
- Reduced motion support

---

## Shared Dependencies

This feature uses hooks/components from `@/lib/shared/`:
- `useAriaAnnouncer` - Screen reader announcements
- `useKeyboardNavigation` - Arrow key navigation
- `useFocusTrap` - Modal focus management
- `useRateLimit` - Rate limiting
- `useNotificationSound` - Audio notifications
- `useVirtualizedList` - Long list performance
- `usePrefersReducedMotion` - Motion preference detection
- `LoadingSpinner` - Loading states
- `ConnectionIndicator` - Online/offline status
- `AriaAnnouncer` - Live region component

---

## API Endpoints

The feature expects these API routes:
- `POST /api/support/conversations` - Create conversation
- `GET /api/support/conversations` - List conversations
- `GET /api/support/conversations/[id]` - Get conversation with messages
- `POST /api/support/conversations/[id]/messages` - Send message
- `PATCH /api/support/conversations/[id]` - Update status/priority/tags
- `POST /api/support/upload` - Upload file attachment
