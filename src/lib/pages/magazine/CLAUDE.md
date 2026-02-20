# Magazine Module

Single-page magazine viewer with URL parameter navigation and thumbnail strip.

## Overview

This module provides the magazine viewing experience where all pages are displayed on a single route (`/magazine/[id]/`) with URL parameter navigation (`?pid=X`).

### Key Features

- **Single Page Architecture**: No more nested routes for sections/editors-note/TOC
- **URL Parameter Navigation**: `?pid=0` for cover, `?pid=1` for TOC, etc.
- **Thumbnail Navigation Strip**: Visual navigation above arrow controls
- **Browser History Integration**: Back/forward navigation works seamlessly
- **Keyboard Navigation**: Arrow keys for prev/next

## Page ID Mapping (0-indexed)

| pid | Page Type | Notes |
|-----|-----------|-------|
| 0 | Cover | Default when no pid param |
| 1 | Table of Contents | Always present |
| 2 | Editor's Note | Only if `issue.editorNote` exists |
| 3+ | Sections | From `issue.sections` array |

If no Editor's Note exists, sections start at pid=2.

## File Structure

```
lib/pages/magazine/
├── CLAUDE.md              # This documentation
├── index.ts               # Barrel exports
├── types.ts               # TypeScript definitions
├── hooks/
│   ├── index.ts
│   ├── usePageList.ts     # Build ordered page list from issue
│   ├── usePageNavigation.ts  # Handle ?pid param navigation
│   └── useThumbnailExtraction.ts  # Extract thumbnails per section
└── components/
    ├── index.ts
    ├── MagazineNewViewer.tsx  # Main viewer component
    ├── ThumbnailNavigation.tsx  # Horizontal thumbnail strip
    └── ThumbnailItem.tsx  # Individual thumbnail
```

## Usage

```tsx
// In /app/magazine/[id]/page.tsx
import { MagazineNewViewer } from '@/lib/pages/magazine';

export default async function MagazinePage({ params }) {
  const issue = await fetchIssue(params.id);
  return <MagazineNewViewer issue={issue} />;
}
```

## Hooks

### usePageList

Builds an ordered `MagazinePage[]` from a `MagazineIssue`.

```tsx
const pages = usePageList(issue);
// Returns: [{ pid: 0, type: 'cover', title: '...', thumbnail: '...' }, ...]
```

### usePageNavigation

Manages URL parameter navigation with browser history.

```tsx
const { currentPid, navigateTo, goNext, goPrev, canGoNext, canGoPrev } = usePageNavigation(totalPages);

// Navigate to specific page
navigateTo(3);

// Navigate prev/next
goNext();
goPrev();
```

### useThumbnailExtraction

Extracts primary images from sections for thumbnails.

```tsx
const { extractThumbnail } = useThumbnailExtraction();
const thumbnailUrl = extractThumbnail(section);
```

## Thumbnail Extraction

Each section type has a specific image property used for thumbnails:

| Section Type | Image Property |
|--------------|----------------|
| cover-pro-feature | `coverImage` or `professionalImage` |
| rising-star | `starImage` |
| maries-corner | `mainStory.backgroundImage` or `authorImage` |
| top-treatment | `heroImage` |
| top-product-spotlight | `productImage` |
| glamlink-stories | `stories[0].image` |
| spotlight-city | `cityImage` |
| magazine-closing | `nextIssueCover` |
| featured-story | `heroImage` |
| custom-section | First image block in `contentBlocks` |

Sections without images display a fallback with the section title initial.

## Adding New Section Types

When adding new section types, update `useThumbnailExtraction.ts`:

```typescript
case 'new-section-type':
  return getImageUrl(content.primaryImage);
```

## Components

### MagazineNewViewer

Main viewer component. Wraps everything in `<Suspense>` for SSR compatibility.

Props:
- `issue: MagazineIssue` - The magazine issue data

### ThumbnailNavigation

Horizontal scrollable strip of thumbnails.

Props:
- `pages: MagazinePage[]` - All pages
- `currentPid: number` - Current page ID
- `onNavigate: (pid: number) => void` - Navigation callback

### ThumbnailItem

Individual thumbnail with active state.

Props:
- `page: MagazinePage` - Page data
- `isActive: boolean` - Whether this is the current page
- `onClick: () => void` - Click handler

## URL Behavior

| URL | Result |
|-----|--------|
| `/magazine/issue-1` | Shows cover (pid=0) |
| `/magazine/issue-1?pid=0` | Shows cover |
| `/magazine/issue-1?pid=1` | Shows TOC |
| `/magazine/issue-1?pid=5` | Shows section at index 5 |

## Reused Components

From `/lib/pages/magazine/`:
- `MagazinePageView` - Renders page content
- `MagazineNavigation` - Arrow navigation controls
- `MagazineCTA` - Call-to-action component
- `MagazineIssueSection` - Section type router (27 section types)
- All section components in `/components/sections/`

## Browser History

The `usePageNavigation` hook uses Next.js `useRouter` and `useSearchParams` to:
- Update URL without page reload (`router.push(..., { scroll: false })`)
- Integrate with browser back/forward buttons
- Clean URL for cover page (removes `?pid=0`)

## Custom Thumbnails

Thumbnails can be customized per page through the admin interface:

### Data Structure

Custom thumbnails are stored in `MagazineIssue.pageThumbnails`:

```typescript
{
  pageThumbnails?: Record<number, string>; // pid -> image URL
}
```

### Editing Thumbnails

1. Go to Admin → Magazine
2. Click "Thumbnails" button for any issue
3. Upload custom images for any page
4. Custom thumbnails override auto-extracted images

### Priority

When displaying thumbnails, the system checks in order:
1. Custom thumbnail from `pageThumbnails[pid]`
2. Auto-extracted thumbnail from section data
3. Fallback with page type initial (C, T, E, etc.)

## Thumbnail Navigation Layout

The thumbnail navigation displays in a 4-column grid between the prev/next arrows:

```
[ < ]  [T1][T2][T3][T4]  [ > ]
       [T5][T6][T7][T8]
       Page 3 of 10
```

This replaces the previous numbered page indicators for a more visual navigation experience.
