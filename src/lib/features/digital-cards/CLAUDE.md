# Digital Business Card System

A comprehensive professional showcase system for Glamlink beauty professionals, featuring rich multimedia content, interactive maps, and dynamic promotions management.

## Overview

The Digital Business Card provides a feature-rich interface that showcases professionals through multiple content sections. Professionals can customize their card through a unified "Sections" tab that controls both the **Access Card Page** (styled web view) and the **Access Card Image** (exportable condensed card).

**Key Concepts:**
- **Access Card Page**: A styled, responsive web page displaying the professional's full digital card
- **Access Card Image**: A condensed, exportable image format (Instagram, Facebook dimensions) for sharing
- **Unified Sections Tab**: Single editor that manages sections for both display formats

## Architecture

### Directory Structure

```
digital-cards/
├── components/
│   ├── condensed/                    # Condensed card system
│   │   ├── CondensedCardPreview.tsx  # Editor preview component
│   │   └── sections/                 # Section wrappers for condensed format
│   │       ├── index.ts             # Barrel exports
│   │       ├── ContentContainer.tsx # Flexible wrapper for content sections
│   │       ├── MapAndContentContainer.tsx # Map + content wrapper
│   │       └── map/                 # Map section components
│   │
│   ├── sections/                     # BASE SECTION COMPONENTS (source of truth)
│   │   ├── index.ts                 # Barrel exports
│   │   ├── SignatureWork.tsx        # Video portfolio section
│   │   ├── Specialties.tsx          # Services/tags display
│   │   ├── ImportantInfo.tsx        # Key information display
│   │   ├── CurrentPromotions.tsx    # Promotions showcase
│   │   └── [Section].tsx            # Other base sections
│   │
│   ├── editor/                       # UNIFIED EDITOR SYSTEM
│   │   ├── shared/                  # Shared editor components
│   │   │   ├── CondensedCardEditor/ # Main unified editor
│   │   │   │   ├── CondensedCardEditor.tsx   # Core component
│   │   │   │   ├── InnerSectionPropsEditor.tsx # Section props editing
│   │   │   │   ├── LayoutPresetSelector.tsx   # Preset management
│   │   │   │   └── types.ts                   # Editor types & mode config
│   │   │   ├── ColumnLayoutEditor/  # Drag-and-drop layout editor
│   │   │   │   ├── ColumnLayoutEditor.tsx     # Main layout component
│   │   │   │   ├── DraggableSectionCard.tsx   # Draggable section UI
│   │   │   │   ├── LayoutRow.tsx              # Row rendering
│   │   │   │   ├── SectionOptionsEditor.tsx   # Container options (z-index)
│   │   │   │   └── rowUtils.ts                # Row grouping utilities
│   │   │   └── DragPositionContext.tsx # Position editing context
│   │   │
│   │   ├── profile/                 # Profile-specific editor
│   │   │   ├── ProfileCondensedCardEditor.tsx # Profile mode wrapper
│   │   │   ├── useProfileCondensedCard.ts     # Profile state management
│   │   │   └── useDerivedSections.ts          # Section sync logic
│   │   │
│   │   └── admin/                   # Admin-specific editor
│   │       └── useCondensedCardEditor.ts      # Admin state management
│   │
│   ├── items/                        # ATOMIC DISPLAY COMPONENTS
│   │   ├── VideoDisplay/            # Video player (YouTube/Vimeo/direct)
│   │   ├── maps/                    # Google Maps components
│   │   ├── SpecialitiesDisplay.tsx  # Services grid
│   │   └── PromoItem.tsx            # Promotion card
│   │
│   └── QuickActions/                 # User interaction buttons
│
├── preview/                          # PREVIEW SYSTEM
│   ├── StyledDigitalCardPreview.tsx  # Access Card Page preview
│   ├── DigitalCardPreview.tsx        # Generic preview orchestrator
│   ├── PreviewContainer.tsx          # Container wrapper
│   └── components/                   # Preview UI components
│
├── config/                           # CONFIGURATION
│   ├── sectionComponentMap.ts       # Section ID → React component mapping
│   ├── sectionDefinitions.ts        # Section metadata definitions
│   ├── sectionPropsConfig.ts        # Editable props per section type
│   └── sectionRegistry.ts           # Combined section registry
│
├── types/                            # TYPE DEFINITIONS (modular)
│   ├── index.ts                     # Barrel exports
│   ├── condensedCardConfig.ts       # Backward-compatible re-exports
│   ├── dimensions.ts                # Dimension presets (Instagram, etc.)
│   ├── sections.ts                  # Section types & constants
│   ├── styles.ts                    # Style configuration types
│   ├── defaults.ts                  # Default configurations
│   └── migration.ts                 # Legacy config migration
│
├── utils/                            # UTILITIES
│   ├── sectionMapping.ts            # Maps sections between formats
│   ├── mapPreprocessing.ts          # Google Maps → Static Maps
│   ├── videoPreprocessing.ts        # Video → Thumbnail extraction
│   └── condensedCardPreprocessing.ts # Main preprocessing orchestrator
│
└── CLAUDE.md                         # This documentation
```

## Data Storage

### CondensedCardConfig (Main Configuration)

The card configuration is stored on the `Professional` document in Firestore:

```typescript
interface Professional {
  // ... other fields
  condensedCardConfig?: CondensedCardConfig;
}

interface CondensedCardConfig {
  dimensions: {
    preset: 'instagram-portrait' | 'instagram-story' | 'facebook-post' | 'custom';
    width: number;   // pixels
    height: number;  // pixels
  };
  sections: CondensedCardSectionInstance[];  // Array for ordering
  styles: {
    backgroundColor: string;
    headerGradient: {
      from: string;
      to: string;
      angle: number;
    };
    padding: number;
    borderRadius: number;
  };
}
```

### Section Instance Model

Each section in the array stores its configuration:

```typescript
interface CondensedCardSectionInstance {
  id: string;                           // Unique: "header-1", "bio-content"
  sectionType: string;                  // Component type: "contentContainer", "header"
  label: string;                        // Display name for editor
  visible: boolean;                     // Show/hide toggle
  position: {
    x: { value: number; unit: '%' };    // Percentage-based positioning
    y: { value: number; unit: '%' };
    width: { value: number; unit: '%' };
    height: { value: number; unit: '%' };
    visible: boolean;
  };
  zIndex?: number;                      // Layer order (admin only)
  column?: 'left' | 'right' | 'full';   // Column placement for layout
  rowOrder?: number;                    // Vertical ordering within layout
  props?: {
    innerSectionType?: string;          // For wrapper sections
    innerSectionProps?: Record<string, any>; // Inner section configuration
    // ... other section-specific props
  };
}
```

### Section Wrapping System

Content sections are wrapped in containers for consistent styling:

```typescript
// Example: Signature Work section wrapped in contentContainer
{
  id: 'signature-work-content',
  sectionType: 'contentContainer',  // Wrapper component
  label: 'Signature Work',
  props: {
    innerSectionType: 'signature-work',  // Actual content type
    innerSectionProps: {
      capturedVideoFrame: 4,
      showPlayButton: true,
    },
    containerBackground: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: 20,
  }
}
```

## Editor System

### Unified "Sections" Tab

Both admin and profile users access the same "Sections" tab that manages card content:

| Location | Tab Name | Mode |
|----------|----------|------|
| Admin Professionals Modal | "Sections" | admin |
| Profile `/profile/digital-card` | "Sections" | profile |

### Mode Differences

The `CondensedCardEditor` component operates in two modes:

```typescript
interface CondensedCardEditorProps {
  mode?: 'admin' | 'profile';
  // Mode-specific features controlled by props:
  showDimensions?: boolean;         // Page dimensions editor
  showStylingSection?: boolean;     // Styling section group
  layoutPresetMode?: 'full' | 'readonly';  // Preset save/load
  useColumnLayout?: boolean;        // Column drag-and-drop editor
  hidePositionButton?: boolean;     // Position editing button
}
```

| Feature | Admin Mode | Profile Mode |
|---------|------------|--------------|
| Page Dimensions | Visible | Hidden |
| Styling Sections | Editable | Hidden |
| Layout Presets | Full (save/load/delete) | Readonly (load only) |
| Column Layout | Yes | Yes |
| Position Button | Visible | Hidden |
| Section Options (z-index) | Visible | Hidden |
| Inner Section Options | Visible | Visible |

### Column Layout Editor

The drag-and-drop layout editor (`ColumnLayoutEditor`) allows visual section arrangement:

```
┌─────────────────┬─────────────────┐
│   LEFT COLUMN   │   RIGHT COLUMN  │
├─────────────────┼─────────────────┤
│ [Header & Bio]  │ [Map Section]   │
├─────────────────┼─────────────────┤
│ [Specialties]   │ [Business Hours]│
├─────────────────┴─────────────────┤
│        [Signature Work - FULL]    │
└───────────────────────────────────┘
```

**Features:**
- Drag sections between left/right columns
- Drop to create full-width rows
- Reorder sections vertically
- Click gear icon to edit section options
- Visibility toggles per section

### Section Props Configuration

Editable props are defined in `config/sectionPropsConfig.ts`:

```typescript
const SECTION_PROPS_CONFIG: Record<string, UnifiedPropField[]> = {
  'signature-work': [
    { key: 'capturedVideoFrame', label: 'Video Frame (seconds)', type: 'number' },
    { key: 'showPlayButton', label: 'Show Play Button', type: 'checkbox' },
    { key: 'displayFullWidth', label: 'Display Full Width', type: 'checkbox' },
  ],
  'specialties': [
    { key: 'displayQrCode', label: 'Display QR Code', type: 'checkbox' },
    { key: 'qrCodeUrl', label: 'QR Code URL', type: 'url' },
  ],
  // ... more section configs
};

// Container-level options (admin only)
const SECTION_CONTAINER_OPTIONS: UnifiedPropField[] = [
  {
    key: 'zIndex',
    label: 'Layer Order (Z-Index)',
    type: 'number',
    adminOnly: true,  // Only visible in admin mode
  },
];

// Toggle group for compact multi-toggle UI
{
  key: 'displayedContent',
  label: 'Displayed Content',
  type: 'toggleGroup',
  toggles: [
    { key: 'showVerifiedBadge', label: 'Badge', defaultValue: true },
    { key: 'showName', label: 'Name', defaultValue: true },
    { key: 'showTitle', label: 'Title', defaultValue: true },
    { key: 'showCompany', label: 'Company', defaultValue: true },
    { key: 'showSocialLinks', label: 'Socials', defaultValue: true },
  ],
}
```

## Redux State Management

The digital card system uses Redux as a **single source of truth** for live preview updates. This ensures that when users edit section options, both the Access Card Page and Access Card Image previews update immediately.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  User edits section option in editor                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Editor Component (InnerSectionPropsEditor)                             │
│  - onChange() dispatches to Redux                                       │
│  - Also updates form state for Firestore persistence                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  REDUX STORE (digitalCardConfig slice)                                  │
│  - state.digitalCardConfig.sections updated                             │
│  - All subscribed components re-render automatically                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ Access Card Page     │ │ Access Card Image    │ │ All Section          │
│ Preview              │ │ Preview              │ │ Components           │
│                      │ │                      │ │                      │
│ useAppSelector()     │ │ useAppSelector()     │ │ useAppSelector()     │
│                      │ │                      │ │                      │
│ ← READS FROM REDUX   │ │ ← READS FROM REDUX   │ │ ← READS FROM REDUX   │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

### Key Redux Actions & Selectors

Located in `/lib/features/digital-cards/store/digitalCardConfigSlice.ts`:

**Actions:**
- `setConfig(config)` - Initialize entire config from Firestore
- `updateSection(sectionId, updates)` - Update a single section
- `updateSectionProps(sectionId, props)` - Update section inner props
- `setSections(sections)` - Replace all sections

**Selectors:**
- `selectSections` - Get all sections array
- `selectSectionById(sectionId)` - Get specific section
- `selectPropsByInnerSectionType(type)` - Get props for a section type (used by preview components)

### Using Redux in Section Components

All preview section components read their props from Redux for live updates:

```typescript
import { useAppSelector } from '@/store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

export default function HeaderAndBio({ professional, section }) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('headerAndBio'));

  // Merge props: Redux takes highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract individual props with defaults
  const showName = mergedProps?.showName ?? true;
  const showTitle = mergedProps?.showTitle ?? true;
  const showCompany = mergedProps?.showCompany ?? true;
  const showSocialLinks = mergedProps?.showSocialLinks ?? true;
  const showVerifiedBadge = mergedProps?.showVerifiedBadge ?? true;

  // ... render component using these props
}
```

### Data Flow Summary

1. **Editor Change** → User toggles a setting (e.g., "Show Name")
2. **Redux Dispatch** → `updateSectionProps()` updates store
3. **Selector Triggers** → Components using `selectPropsByInnerSectionType()` re-render
4. **Live Preview** → Both Access Card Page and Image update instantly
5. **Form State** → Also updates for eventual Firestore save

### Toggle Group Field Type

For compact UI with multiple related toggles, use the `toggleGroup` field type:

```typescript
{
  key: 'displayedContent',
  label: 'Displayed Content',
  type: 'toggleGroup',
  toggles: [
    { key: 'showVerifiedBadge', label: 'Badge', defaultValue: true },
    { key: 'showName', label: 'Name', defaultValue: true },
    { key: 'showTitle', label: 'Title', defaultValue: true },
  ],
}
```

This renders as a row of pill-shaped toggle buttons that users can click to enable/disable:

```
Displayed Content:
[Badge] [Name] [Title] [Company] [Socials]
  ✓       ✓      ✓        ✓         ✓
```

Each toggle updates its corresponding Redux key independently.

## Preview System

### Two Preview Types

The profile page provides a dropdown to switch between preview formats:

**1. Access Card Page** (`StyledDigitalCardPreview`)
- Full styled web page layout
- Two-column responsive design
- Interactive elements (maps, videos)
- Booking buttons and social links
- Used on `/for-professionals/[id]` public pages

**2. Access Card Image** (`CondensedCardPreview`)
- Exportable image format
- Fixed dimensions (Instagram, Facebook, etc.)
- Static previews of interactive content
- Download/share functionality
- Position editing overlay (admin mode)

### Preview Data Flow

```
Professional Data (Firestore)
       ↓
FormProvider (form state)
       ↓
transformFormToProfessional()
       ↓
┌──────────────────────────────────────┐
│ Preview Type Selector                │
│ ┌────────────────┬─────────────────┐ │
│ │ Access Card    │ Access Card     │ │
│ │ Page           │ Image           │ │
│ └────────────────┴─────────────────┘ │
└──────────────────────────────────────┘
       ↓                    ↓
StyledDigitalCard   CondensedCardPreview
Preview
```

### Image Export Pipeline

For generating shareable images:

1. **Preprocess** - Convert interactive elements to static
   - Videos → Thumbnail images
   - Google Maps → Static Map API images
2. **Clone DOM** - Create detached copy with static content
3. **Generate Image** - Use html2canvas to create PNG
4. **Save/Download** - Upload to Firebase Storage or download locally

## Section Configuration System

### Three-Layer Architecture

**Layer 1: Section Types** (`types/sections.ts`)
```typescript
type CondensedCardSectionId =
  | 'header' | 'nameTitle' | 'rating' | 'specialties'
  | 'contact' | 'map' | 'mapWithHours' | 'footer'
  | 'contentContainer' | 'mapAndContentContainer'
  | 'signature-work' | 'important-info' | 'current-promotions'
  // ... more types
```

**Layer 2: Section Registry** (`config/sectionRegistry.ts`)
```typescript
{
  id: 'signature-work',
  componentId: 'SignatureWork',
  label: 'Signature Work',
  category: 'media',
  component: SignatureWork,
  defaultPosition: { x: '5%', y: '35%', width: '90%', height: '40%' },
  allowMultiple: false,
}
```

**Layer 3: Props Configuration** (`config/sectionPropsConfig.ts`)
```typescript
'signature-work': [
  { key: 'capturedVideoFrame', type: 'number', defaultValue: 4 },
  { key: 'showPlayButton', type: 'checkbox', defaultValue: true },
]
```

### Section Mapping

The `utils/sectionMapping.ts` bridges section formats:

```typescript
// Maps simple section IDs to wrapped condensed card sections
createCondensedCardSection('signature-work')
  ↓
{
  id: 'signature-work-content',
  sectionType: 'contentContainer',
  props: { innerSectionType: 'signature-work' }
}
```

## Key Data Flows

### Adding a Section

```
User clicks "Add Section" dropdown
       ↓
Select section type (e.g., "Signature Work")
       ↓
handleAddSection('signature-work')
       ↓
createCondensedCardSection() creates wrapped instance
       ↓
Updates condensedCardConfig.sections array
       ↓
FormProvider.updateField() persists to form state
       ↓
Preview updates in real-time
```

### Editing Section Props

```
User clicks gear icon on section card
       ↓
Opens InnerSectionPropsEditor panel
       ↓
Shows Section Options (admin only) + Inner Section Options
       ↓
User modifies props (checkboxes, numbers, etc.)
       ↓
handlePropsChange() or handleSectionOptionsChange()
       ↓
onSectionChange() updates specific section in array
       ↓
Preview updates in real-time
```

### Saving Changes

```
User clicks "Save" on form
       ↓
FormProvider collects all field values
       ↓
API call to update Professional document
       ↓
Firestore update: professional.condensedCardConfig
       ↓
Success notification
```

## Hooks & State Management

### Profile Mode Hooks

```typescript
// Main profile editor hook
useProfileCondensedCard({
  onSectionAdded?: (sectionId: string) => void;
})
  ↓
Returns: {
  sections,           // Current sections array
  addableSections,    // Sections available to add
  handleAddSection,   // Add section handler
  handleSectionChange,// Update section handler
  handleResetConfirm, // Reset all sections
  // ... more handlers
}

// Section synchronization hook
useDerivedSections()
  ↓
- Syncs with sectionsConfig (legacy format)
- Maps to condensed card format
- Computes addable sections
```

### Admin Mode Hook

```typescript
useCondensedCardEditor(professional, db, onUpdate)
  ↓
Returns: {
  config,              // Current config
  previewImageUrl,     // Generated preview
  handleDimensionChange,
  handleSectionUpdate,
  handleGeneratePreview,
  // ... full CRUD handlers
}
```

## Type System

### Module Organization

| File | Purpose | Key Exports |
|------|---------|-------------|
| `dimensions.ts` | Card sizing | `DIMENSION_PRESETS`, `getDimensionsForPreset()` |
| `sections.ts` | Section definitions | `CondensedCardSectionId`, `SectionColumn` |
| `styles.ts` | Visual styling | `CondensedCardStyles`, `CondensedCardConfig` |
| `defaults.ts` | Default values | `DEFAULT_CONDENSED_CARD_CONFIG` |
| `migration.ts` | Legacy support | `migrateCondensedCardConfig()` |

### Imports

```typescript
// Recommended: Import from barrel
import {
  CondensedCardConfig,
  CondensedCardSectionInstance,
  DEFAULT_CONDENSED_CARD_CONFIG,
} from '@/lib/features/digital-cards/types';

// Or from specific module
import { DIMENSION_PRESETS } from '@/lib/features/digital-cards/types/dimensions';
```

## Video Display System

### Supported Sources
- YouTube Videos (automatic embed)
- Vimeo Videos (full-featured player)
- Direct Video URLs (Firebase Storage, etc.)
- Custom Thumbnails (fallback support)

```typescript
<VideoDisplay
  video={videoItem}
  autoplay={false}
  controls={true}
  muted={true}
/>
```

## Google Maps Integration

### Features
- Interactive Maps with Google Maps JavaScript API
- Custom Markers with business styling
- Directions Integration
- Static Map Fallback for exports
- Error Handling with OpenStreetMap fallback

### Required Environment Variables
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_VERSION=3.54
```

## Troubleshooting

### "No configurable options" for section
- Check section type is in `SECTION_PROPS_CONFIG`
- Verify `innerSectionType` is set for wrapper sections
- Check mode filtering (admin vs profile)

### Section not appearing in preview
- Verify `visible: true` on section instance
- Check `position` values are valid percentages
- Confirm section is in `sections` array

### Maps show gray placeholders
- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Verify Static Maps API is enabled
- Check API quota limits

### Videos not playing
- Verify video URL format and accessibility
- Check CORS configuration for direct URLs
- Test in different browsers

---

**Last Updated**: January 2025
**Version**: 3.0.0
**Maintainer**: Glamlink Development Team
