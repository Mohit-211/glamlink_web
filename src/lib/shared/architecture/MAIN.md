# Shared Library - Detailed Architecture

**IMPORTANT: This file documents all shared library features in detail. When this file becomes too large to adequately explain all features, content MUST be split into separate documentation files (e.g., `HOOKS.md`, `COMPONENTS.md`, `UTILS.md`) and referenced from here.**

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Components](#components)
3. [Hooks](#hooks)
4. [Utilities](#utilities)
5. [Usage Patterns](#usage-patterns)

---

## Directory Structure

```
lib/shared/
├── index.ts                              # Main barrel export
├── components/
│   ├── index.ts
│   ├── ui/
│   │   ├── index.ts
│   │   ├── LoadingSpinner.tsx            # Loading indicator with reduced motion
│   │   └── ConnectionIndicator.tsx       # Online/offline status banner
│   └── accessibility/
│       ├── index.ts
│       └── AriaAnnouncer.tsx             # Screen reader live region
├── hooks/
│   ├── index.ts
│   ├── accessibility/
│   │   ├── index.ts
│   │   ├── useFocusTrap.ts               # Modal focus trapping
│   │   ├── useAriaAnnouncer.ts           # Screen reader announcements
│   │   ├── useKeyboardNavigation.ts      # Arrow key list navigation
│   │   └── usePrefersReducedMotion.ts    # Detect motion preference
│   ├── useRateLimit.ts                   # Client-side rate limiting
│   ├── useOfflineQueue.ts                # Offline action queuing
│   ├── useVirtualizedList.ts             # Long list virtualization
│   ├── useNotificationSound.ts           # Audio notifications
│   └── useDraftPersistence.ts            # LocalStorage draft saving
└── utils/
    ├── index.ts
    ├── dateTime.ts                       # Time formatting utilities
    ├── sanitize.ts                       # HTML/content sanitization
    ├── url.ts                            # URL validation & parsing
    ├── retry.ts                          # Retry with exponential backoff
    ├── debug.ts                          # Toggleable debug logging
    └── security/
        ├── index.ts
        └── csrf.ts                       # CSRF token management
```

---

## Components

### LoadingSpinner

Loading indicator with reduced motion support.

```typescript
import { LoadingSpinner } from '@/lib/shared/components';

<LoadingSpinner />
<LoadingSpinner message="Loading data..." />
```

**Props:**
- `message?: string` - Optional loading message

**Features:**
- Respects `prefers-reduced-motion` media query
- Shows static indicator when motion is reduced

---

### ConnectionIndicator

Displays online/offline status with pending message count.

```typescript
import { ConnectionIndicator } from '@/lib/shared/components';

<ConnectionIndicator isOnline={isOnline} pendingCount={3} />
```

**Props:**
- `isOnline: boolean` - Current connection status
- `pendingCount?: number` - Number of pending offline actions

---

### AriaAnnouncer

Screen reader live region for accessibility announcements.

```typescript
import { AriaAnnouncer } from '@/lib/shared/components';

<AriaAnnouncer message={announcement} priority="polite" />
```

**Props:**
- `message: string` - Text to announce
- `priority?: 'polite' | 'assertive'` - Announcement urgency

---

## Hooks

### Accessibility Hooks

#### useFocusTrap

Traps keyboard focus within a container (modals, dialogs).

```typescript
import { useFocusTrap } from '@/lib/shared/hooks';

const { containerRef } = useFocusTrap({
  isActive: isModalOpen,
  onEscape: handleClose,
});

<div ref={containerRef}>...</div>
```

**Options:**
- `isActive: boolean` - Enable/disable trap
- `onEscape?: () => void` - Escape key handler

---

#### useAriaAnnouncer

Manage screen reader announcements.

```typescript
import { useAriaAnnouncer } from '@/lib/shared/hooks';

const { announcement, priority, announce } = useAriaAnnouncer();

announce('Message sent successfully', 'polite');
announce('Error: Connection lost', 'assertive');
```

**Returns:**
- `announcement: string` - Current announcement text
- `priority: AriaLivePriority` - Current priority
- `announce: (message, priority?) => void` - Trigger announcement

---

#### useKeyboardNavigation

Arrow key navigation for lists.

```typescript
import { useKeyboardNavigation } from '@/lib/shared/hooks';

const {
  focusedIndex,
  setFocusedIndex,
  handleKeyDown,
  itemRefs,
  isNavigating,
} = useKeyboardNavigation({
  itemCount: items.length,
  onEscape: () => inputRef.current?.focus(),
  enabled: true,
});

<div onKeyDown={handleKeyDown}>
  {items.map((item, i) => (
    <div ref={(el) => itemRefs.current[i] = el} />
  ))}
</div>
```

**Options:**
- `itemCount: number` - Total navigable items
- `onEscape?: () => void` - Escape handler
- `enabled?: boolean` - Enable/disable navigation

---

#### usePrefersReducedMotion

Detect user's motion preference.

```typescript
import { usePrefersReducedMotion } from '@/lib/shared/hooks';

const prefersReducedMotion = usePrefersReducedMotion();

<div className={prefersReducedMotion ? 'no-animation' : 'animate-pulse'} />
```

---

### useRateLimit

Client-side rate limiting for actions.

```typescript
import { useRateLimit } from '@/lib/shared/hooks';

const { isLimited, remainingActions, recordAction } = useRateLimit({
  limit: 10,        // Max actions
  windowMs: 60000,  // Per minute
});

const handleSend = () => {
  if (isLimited) return;
  recordAction();
  sendMessage();
};
```

**Config:**
- `limit: number` - Maximum actions allowed
- `windowMs: number` - Time window in milliseconds

**Returns:**
- `isLimited: boolean` - Currently rate limited
- `remainingActions: number` - Actions left in window
- `recordAction: () => void` - Record an action

---

### useOfflineQueue

Queue actions when offline, flush when online.

```typescript
import { useOfflineQueue } from '@/lib/shared/hooks';

const {
  isOnline,
  connectionState,
  queue,
  pending,
  remove,
  flush,
  clear,
} = useOfflineQueue<MessageData>({
  onFlush: async (items) => {
    for (const item of items) {
      await sendToServer(item.data);
    }
  },
  storageKey: 'my-queue', // Optional localStorage persistence
});

// Queue action when offline
const id = queue({ content: 'Hello' });
```

**Config:**
- `onFlush: (items) => Promise<void>` - Handler for queued items
- `storageKey?: string` - LocalStorage key for persistence

**Returns:**
- `isOnline: boolean` - Network status
- `connectionState: 'connected' | 'connecting' | 'reconnecting' | 'disconnected'`
- `queue: (data) => string` - Add to queue, returns ID
- `pending: QueueItem[]` - Current queue
- `remove: (id) => void` - Remove by ID
- `flush: () => Promise<void>` - Force flush
- `clear: () => void` - Clear all

---

### useVirtualizedList

Efficiently render long lists.

```typescript
import { useVirtualizedList } from '@/lib/shared/hooks';

const {
  visibleItems,
  containerProps,
  totalHeight,
  startIndex,
} = useVirtualizedList({
  items: allItems,
  itemHeight: 60,
  containerHeight: 400,
  overscan: 5,
});

<div {...containerProps}>
  <div style={{ height: totalHeight }}>
    {visibleItems.map((item, i) => (
      <div key={startIndex + i} style={{ height: 60 }}>
        {item.content}
      </div>
    ))}
  </div>
</div>
```

---

### useNotificationSound

Play notification sounds.

```typescript
import { useNotificationSound } from '@/lib/shared/hooks';

const { play, stop, setEnabled } = useNotificationSound({
  src: '/sounds/notification.mp3',
  volume: 0.5,
  enabled: true,
  playWhenHidden: false,
});

// On new message
play();
```

**Config:**
- `src: string` - Audio file path (required)
- `volume?: number` - Volume 0-1 (default: 1)
- `enabled?: boolean` - Enable sounds (default: true)
- `playWhenHidden?: boolean` - Play when tab hidden (default: false)

---

### useDraftPersistence

Persist draft content to localStorage.

```typescript
import { useDraftPersistence } from '@/lib/shared/hooks';

const { value, setValue, clear } = useDraftPersistence({
  key: 'message-draft',
  debounceMs: 500,
});

<textarea value={value} onChange={(e) => setValue(e.target.value)} />

// On submit
clear();
```

---

## Utilities

### dateTime

Time formatting utilities.

```typescript
import { formatRelativeTime, formatMessageTime, formatFullDateTime } from '@/lib/shared/utils';

formatRelativeTime(new Date()); // "just now", "5 minutes ago", "2 hours ago"
formatMessageTime(new Date());  // "3:45 PM" or "Jan 15"
formatFullDateTime(new Date()); // "January 15, 2025 at 3:45 PM"
```

---

### sanitize

HTML and content sanitization.

```typescript
import { sanitizeHtml, sanitizeUserInput, isValidInput } from '@/lib/shared/utils';

// Remove all HTML tags
const clean = sanitizeHtml('<script>alert("xss")</script>Hello');

// Sanitize and trim user input
const input = sanitizeUserInput(rawInput, 500);

// Validate input
if (isValidInput(text, 1000)) {
  submit(text);
}
```

---

### url

URL validation and parsing.

```typescript
import {
  isUrlSafe,
  sanitizeUrl,
  extractUrls,
  parseTextWithLinks,
} from '@/lib/shared/utils';

isUrlSafe('https://example.com'); // true
isUrlSafe('javascript:alert(1)'); // false

const safeUrl = sanitizeUrl(userUrl); // null if unsafe

const urls = extractUrls('Check out https://example.com');
// ['https://example.com']

const segments = parseTextWithLinks('Visit https://example.com today');
// [{ type: 'text', content: 'Visit ' },
//  { type: 'link', content: 'https://example.com', href: 'https://example.com' },
//  { type: 'text', content: ' today' }]
```

---

### retry

Retry with exponential backoff.

```typescript
import { retryWithBackoff } from '@/lib/shared/utils';

const result = await retryWithBackoff(
  () => fetchData(),
  {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    backoffFactor: 2,
  }
);
```

---

### debug

Toggleable debug logging.

```typescript
import { createDebugLogger, createFeatureDebug } from '@/lib/shared/utils';

// Custom logger
const debug = createDebugLogger({
  prefix: '[MyFeature]',
  storageKey: 'debug_myfeature',
  urlParam: 'debug_myfeature',
});

debug.log('Starting...');
debug.warn('Warning!');
debug.error('Error:', err);

// Feature shorthand
const debug = createFeatureDebug('messaging');
// Uses: [Messaging], messaging_debug storage key
```

Enable via localStorage or URL param.

---

### security/csrf

CSRF token management.

```typescript
import { createCSRFManager } from '@/lib/shared/utils';

const csrf = createCSRFManager({
  storageKey: 'my_csrf_token',
  headerName: 'X-CSRF-Token',
});

// Get or generate token
const token = csrf.getToken();

// Include in fetch
const headers = csrf.getHeaders();
// { 'X-CSRF-Token': 'abc123...' }

// Validate incoming token
if (csrf.validateToken(incomingToken)) {
  // Valid
}

// Regenerate after auth changes
csrf.regenerateToken();
```

---

## Usage Patterns

### Importing

```typescript
// Recommended: Import from category
import { LoadingSpinner, ConnectionIndicator } from '@/lib/shared/components';
import { useRateLimit, useFocusTrap } from '@/lib/shared/hooks';
import { formatRelativeTime, sanitizeHtml } from '@/lib/shared/utils';

// Also available: Main barrel export
import { LoadingSpinner, useRateLimit, formatRelativeTime } from '@/lib/shared';
```

### Feature Integration

Features can wrap shared utilities with feature-specific defaults:

```typescript
// In feature's utils/csrf.ts
import { createCSRFManager } from '@/lib/shared/utils';

export const csrfManager = createCSRFManager({
  storageKey: 'support_messaging_csrf',
  headerName: 'X-CSRF-Token',
});

export const getCSRFToken = () => csrfManager.getToken();
export const getCSRFHeaders = () => csrfManager.getHeaders();
```

---

## File Split Guidelines

When this document exceeds ~500 lines or any section becomes unwieldy:

1. Create dedicated files: `HOOKS.md`, `COMPONENTS.md`, `UTILS.md`
2. Move detailed content to those files
3. Keep this file as an index with brief descriptions and links
4. Example structure:
   ```
   architecture/
   ├── MAIN.md          # Index and overview
   ├── HOOKS.md         # All hook documentation
   ├── COMPONENTS.md    # All component documentation
   └── UTILS.md         # All utility documentation
   ```
