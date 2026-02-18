# Shared Library

**IMPORTANT: This file MUST remain brief and high-level. For detailed documentation, see [architecture/MAIN.md](./architecture/MAIN.md).**

## Overview

`lib/shared/` contains reusable code extracted from feature modules for cross-project use.

## Contents

| Category | Purpose |
|----------|---------|
| **Components** | UI components (LoadingSpinner, ConnectionIndicator) and accessibility (AriaAnnouncer) |
| **Hooks** | Accessibility, rate limiting, offline queue, virtualization, notifications, drafts |
| **Utils** | Date/time, sanitization, URL handling, retry logic, debug logging, CSRF |

## Quick Import

```typescript
// Components
import { LoadingSpinner, ConnectionIndicator, AriaAnnouncer } from '@/lib/shared/components';

// Hooks
import { useRateLimit, useOfflineQueue, useFocusTrap } from '@/lib/shared/hooks';

// Utils
import { formatRelativeTime, sanitizeHtml, retryWithBackoff } from '@/lib/shared/utils';
```

## Documentation

- **Detailed API & Usage**: [architecture/MAIN.md](./architecture/MAIN.md)
