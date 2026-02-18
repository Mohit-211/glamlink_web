# Magazine Content Analytics Tracking

This document describes how analytics tracking is implemented in magazine content components.

## Overview

Magazine content components track user interactions to help measure engagement. The tracking uses the `useMagazineAnalytics` hook and stores events in Firestore at `analytics/magazine/issues/{issueId}/events`.

## Event Types

| Event Type | Description | Context |
|------------|-------------|---------|
| `cta_click` | CTA button clicked | `buttonLabel`, `buttonVariant` |
| `link_click` | External link clicked | `linkType`, `linkUrl` |
| `video_play` | Video started playing | `videoSource` |

## Tracked Interactions

### CTA Button Clicks

**Tracked in:**
- `CallToAction.tsx` - Primary CTA buttons
- `CTAStat.tsx` - Primary/secondary stat CTAs

**Event Context:**
- `buttonLabel`: The text on the button (e.g., "Join Glamlink", "Shop Now")
- `buttonVariant`: `'primary'` or `'secondary'`

### Link Clicks

**Tracked in:**
- `SocialLinks.tsx` - Instagram, Website, Glamlink profile links

**Event Context:**
- `linkType`: Platform type (`'website'`, `'instagram'`, `'tiktok'`, `'email'`, `'linkedin'`, `'glamlink'`, `'other'`)
- `linkUrl`: Sanitized target URL (origin + pathname only)

### Video Plays

**Tracked in:**
- `VideoEmbed.tsx` - YouTube embeds and uploaded videos
- `MediaItem.tsx` - Video play button clicks
- `BusinessProfile.tsx` - Video play button clicks

**Event Context:**
- `videoSource`: `'youtube'` or `'upload'`

## Component Props

### Shared Components

Each component accepts optional tracking callbacks:

```typescript
// CTAStat.tsx
interface CTAStatProps {
  onCtaClick?: (label: string, variant: 'primary' | 'secondary') => void;
}

// CallToAction.tsx
interface CallToActionProps {
  onCtaClick?: (label: string) => void;
}

// SocialLinks.tsx
interface SocialLinksProps {
  onLinkClick?: (linkType: string, url: string) => void;
}

// VideoEmbed.tsx, MediaItem.tsx, BusinessProfile.tsx
interface VideoProps {
  onVideoPlay?: () => void;
}
```

## Section Component Integration

Section components use the `useMagazineAnalytics` hook and pass callbacks to shared components.

### Example: MagazineClosing

```tsx
import { useMagazineAnalytics } from '@/lib/features/analytics/hooks/useMagazineAnalytics';

export default function MagazineClosing({ content, issueId }: MagazineClosingProps) {
  const { trackEnhancedCTAClick } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  const handleCtaClick = (label: string) => {
    if (issueId) {
      trackEnhancedCTAClick(label, 'primary', 'magazine-closing', 'closing');
    }
  };

  return (
    <CallToActionComponent
      {...content}
      onCtaClick={handleCtaClick}
    />
  );
}
```

### Example: CoverProFeature (Link Tracking)

```tsx
const { trackLinkClick } = useMagazineAnalytics({
  issueId: issueId || '',
  trackViewOnMount: false,
});

const handleLinkClick = (linkType: string, url: string) => {
  if (issueId) {
    const normalizedType = linkType.toLowerCase() as LinkType;
    trackLinkClick(normalizedType, url, 'cover-pro-feature', 'cover-pro-feature');
  }
};

<SocialLinks links={...} onLinkClick={handleLinkClick} />
```

### Example: TopTreatment (Video Tracking)

```tsx
const { trackVideoPlay } = useMagazineAnalytics({
  issueId: issueId || '',
  trackViewOnMount: false,
});

const handlePlayClick = () => {
  setIsVideoPlaying(true);
  if (issueId) {
    const source = videoType === 'youtube' ? 'youtube' : 'upload';
    trackVideoPlay(source, 'top-treatment', 'top-treatment');
  }
};
```

## Updated Section Components

| Section | Tracking | Shared Component |
|---------|----------|------------------|
| `MagazineClosing` | CTA clicks | `CallToAction` |
| `CoverProFeature` | Link clicks | `SocialLinks` |
| `RisingStar` | Link clicks | `SocialLinks` |
| `TopTreatment` | Video plays | `VideoEmbed` (internal) |
| `TopProductSpotlight` | CTA clicks | `CallToAction` |
| `CustomSection` | CTA, Link, Video | All shared components (dynamic) |

### CustomSection Analytics

`CustomSection` dynamically injects analytics callbacks into shared components based on their type:

| Component Type | Injected Callback |
|----------------|-------------------|
| `CallToAction` | `onCtaClick` |
| `CTAStat` | `onCtaClick` |
| `SocialLinks` | `onLinkClick` |
| `EmbeddableBusinessCard` | `onLinkClick`, `onVideoPlay` |
| `VideoEmbed` | `onVideoPlay` |
| `MediaItem` | `onVideoPlay` |
| `BusinessProfile` | `onVideoPlay` |

This means any shared component added to a custom section will automatically track interactions without additional configuration.

## Components Without Tracking

Some shared components don't have trackable user interactions:

- `BackgroundWrapper.tsx` - Structural only
- `SectionDivider.tsx` - Decorative only
- `SectionHeader.tsx` - Text display only
- `RichContent.tsx` - Text content only
- `EventsList.tsx` - Display only
- `HTMLContent.tsx` - Embedded content
- `PhotoGallery.tsx` - Image display (hover not tracked)
- `PhotoGalleryProducts.tsx` - Product display (hover not tracked)
- `Stats.tsx` - Stat display only

## Admin Dashboard

The interaction breakdown is displayed in the Magazine Analytics drilldown modal:

1. Navigate to Admin > Analytics > Magazine
2. Click on an issue row to open the drilldown
3. Scroll to "Interaction Breakdown" section

### Tables Displayed:

1. **CTA Button Clicks** - Button labels, click counts, unique clickers
2. **External Link Clicks** - Platform types, click counts, unique clickers
3. **Video Plays** - Source types, play counts, unique viewers

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/analytics/magazine-events` | Store analytics events (batched) |
| `GET /api/analytics/magazine-dashboard/[issueId]/interactions` | Get interaction breakdown |

## Firestore Structure

Events are stored with the following structure:

```typescript
// analytics/magazine/issues/{issueId}/events/{eventId}
{
  eventType: 'cta_click' | 'link_click' | 'video_play',
  issueId: string,
  timestamp: string,  // ISO format
  sessionId: string,
  sectionId?: string,
  sectionType?: string,

  // CTA click context
  buttonLabel?: string,
  buttonVariant?: 'primary' | 'secondary',

  // Link click context
  linkType?: 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other',
  linkUrl?: string,  // Sanitized URL

  // Video context
  videoSource?: 'youtube' | 'upload',

  createdAt: Timestamp
}
```

## Adding Tracking to New Components

1. Add optional callback prop to component interface
2. Call the callback at the appropriate interaction point
3. In the section component, use `useMagazineAnalytics` hook
4. Pass the tracking callback to the shared component

### Example: Adding tracking to a new component

```tsx
// In shared component
interface NewComponentProps {
  onInteraction?: (type: string) => void;
}

function NewComponent({ onInteraction }: NewComponentProps) {
  return (
    <button onClick={() => onInteraction?.('button-click')}>
      Click Me
    </button>
  );
}

// In section component
const { trackEnhancedCTAClick } = useMagazineAnalytics({ issueId, trackViewOnMount: false });

<NewComponent
  onInteraction={(type) => trackEnhancedCTAClick(type, 'primary', sectionId, sectionType)}
/>
```
