# Digital Card Analytics System

Comprehensive analytics tracking for Glamlink Digital Business Cards. Tracks user interactions, stores per-professional analytics in Firestore, provides UTM link generation, and delivers dashboards for admins and professionals.

## Overview

This feature enables:
1. **Event Tracking** - Track card views, button clicks, social link clicks, and more
2. **UTM Link Generation** - Auto-generate trackable links for QR codes, Instagram, TikTok, etc.
3. **Per-Professional Storage** - Firestore subcollection under each professional
4. **Dual Dashboards** - Admin sees all pros, individual pros see their own stats
5. **GA4 Compatibility** - Events also forwarded to Google Analytics

## Directory Structure

```
/lib/features/analytics/
├── CLAUDE.md                           # This documentation
├── types/
│   ├── index.ts                        # Barrel export
│   ├── analyticsEvent.ts               # Event types, stats, time series
│   ├── utmConfig.ts                    # UTM preset types
│   └── dashboard.ts                    # Dashboard data types
├── services/
│   ├── index.ts
│   ├── cardAnalyticsService.ts         # Client-side: batched event tracking
│   └── cardAnalyticsServerService.ts   # Server-side: Firestore operations
├── hooks/
│   ├── index.ts
│   ├── useCardAnalytics.ts             # Track events in components
│   ├── useAnalyticsDashboard.ts        # Fetch dashboard data
│   └── useSessionId.ts                 # Session management hook
├── components/
│   ├── index.ts
│   ├── admin/                          # Admin dashboard components
│   └── pro/                            # Pro dashboard components
├── utils/
│   ├── index.ts
│   ├── sessionManager.ts               # Session ID, device detection
│   └── utmLinkGenerator.ts             # Generate UTM links
└── config/
    └── utmPresets.ts                   # Pre-defined UTM configurations
```

## Event Types

All trackable events for digital cards:

| Event Type | Description | Trigger Location |
|------------|-------------|------------------|
| `card_view` | Card page or modal opened | DigitalBusinessCardPage |
| `book_click` | Book Now button clicked | PreviewBookingButton |
| `call_click` | Phone call initiated | PreviewBookingButton |
| `text_click` | SMS/text initiated | PreviewBookingButton |
| `website_click` | Website link clicked | FooterSection |
| `instagram_click` | Instagram link clicked | FooterSection |
| `tiktok_click` | TikTok link clicked | FooterSection |
| `save_card` | Save as Image clicked | useCardShare |
| `copy_url` | Copy URL clicked | useCardShare |

## Firestore Structure

```
professionals/{professionalId}/analytics/{eventId}
  ├── eventType: "card_view"
  ├── professionalId: "pro-123"
  ├── timestamp: "2025-01-15T10:30:00Z"
  ├── sessionId: "1704123456789-abc123xyz"
  ├── utmSource: "instagram"
  ├── utmMedium: "bio"
  ├── utmCampaign: null
  ├── deviceType: "mobile"
  ├── referrer: "https://instagram.com/"
  ├── userAgent: "Mozilla/5.0..."
  ├── viewport: { width: 375, height: 812 }
  ├── pageUrl: "https://glamlink.net/for-professionals/pro-123"
  └── createdAt: Timestamp
```

## UTM Presets

Pre-configured UTM parameters for common scenarios:

| Preset ID | Source | Medium | Use Case |
|-----------|--------|--------|----------|
| `qr-code` | qr | digitalcard | Printed QR codes |
| `instagram-bio` | instagram | bio | Instagram profile link |
| `instagram-post` | instagram | pinnedpost | Pinned post links |
| `tiktok-bio` | tiktok | bio | TikTok profile link |
| `direct-share` | share | direct | Text/DM sharing |
| `email-signature` | email | signature | Email signature links |
| `linktree` | linktree | bio | Linktree/bio link tools |

### Generating UTM Links

```typescript
import { generateUTMLink, generateAllUTMLinks } from '@/lib/features/analytics/utils';

// Generate single link
const link = generateUTMLink('pro-123', 'instagram-bio');
// link.fullUrl = "https://glamlink.net/for-professionals/pro-123?utm_source=instagram&utm_medium=bio"

// Generate all preset links
const allLinks = generateAllUTMLinks('pro-123');
```

## Session Management

Sessions track unique visitors with 30-minute inactivity timeout.

```typescript
import { getSessionId, getSessionContext } from '@/lib/features/analytics/utils';

// Get session ID (creates new if expired)
const sessionId = getSessionId();

// Get full session context
const context = getSessionContext();
// { sessionId, deviceType, viewport, pageUrl, referrer, userAgent }
```

## Usage

### Tracking Events in Components

```typescript
import { useCardAnalytics } from '@/lib/features/analytics/hooks';

function DigitalCard({ professional }) {
  const {
    trackBookClick,
    trackInstagramClick,
    trackSaveCard,
    // ... other tracking methods
  } = useCardAnalytics({ professionalId: professional.id });

  return (
    <button onClick={trackBookClick}>Book Now</button>
  );
}
```

### Fetching Dashboard Data

```typescript
import { useAnalyticsDashboard } from '@/lib/features/analytics/hooks';

function ProDashboard({ professionalId }) {
  const { data, isLoading, setDateRange } = useAnalyticsDashboard({
    professionalId,
    initialDateRange: '30d',
  });

  return (
    <div>
      <h2>Views: {data?.stats.totalViews}</h2>
      <h2>Clicks: {data?.stats.bookClicks}</h2>
    </div>
  );
}
```

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/analytics/card-events` | POST | Public | Receive batched events |
| `/api/analytics/card-dashboard` | GET | Admin | All pros stats |
| `/api/analytics/card-dashboard/[professionalId]` | GET | Public | Single pro stats |

### Event Ingestion

```typescript
// POST /api/analytics/card-events
{
  "events": [
    {
      "eventType": "card_view",
      "professionalId": "pro-123",
      "timestamp": "2025-01-15T10:30:00Z",
      "sessionId": "abc123",
      "utmSource": "instagram",
      "utmMedium": "bio"
    }
  ]
}
```

## Key Design Decisions

### Event Batching
- Client batches events for 1 second (debounce) or max 10 events
- Uses `sendBeacon` on page unload for reliability
- Reduces Firestore write operations

### Session-Based Unique Visitors
- 30-minute session timeout (matches GA4 default)
- localStorage-based session ID
- Session ID regenerates on timeout

### GA4 Compatibility
- All events also sent to existing GA4 via `analytics.trackEvent()`
- Uses `card_${eventType}` naming convention
- No duplicate page views (GA4 handles those separately in layout.tsx)

### Privacy
- No PII stored in analytics events
- Session IDs are anonymous and rotate
- UTM params are marketing data, not personal
- User agent stored but not parsed for personal identification

## Integration Points

Files that need tracking integration:

| File | Integration |
|------|-------------|
| `/lib/features/digital-cards/DigitalBusinessCardPage.tsx` | Initialize `useCardAnalytics`, track view on mount |
| `/lib/features/digital-cards/components/useCardShare.ts` | Add `trackCopyUrl()`, `trackSaveCard()` calls |
| `/lib/features/digital-cards/components/condensed/sections/FooterSection.tsx` | Add social click tracking |
| `/lib/features/digital-cards/preview/components/PreviewBookingButton.tsx` | Add booking/text tracking |

## Dashboard Routes

| Route | Purpose |
|-------|---------|
| `/app/admin/card-analytics/page.tsx` | Admin analytics dashboard |
| `/app/for-professionals/[id]/analytics/page.tsx` | Pro-facing dashboard |

## Related Documentation

- [Digital Cards CLAUDE.md](/lib/features/digital-cards/CLAUDE.md) - Digital card components
- [Analytics Service](/lib/services/analytics.ts) - Existing GA4 integration
- [UTM Handler](/lib/utils/utmHandler.ts) - Existing UTM parameter handling
