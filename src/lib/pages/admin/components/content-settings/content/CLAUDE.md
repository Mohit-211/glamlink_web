# CMS Section Refactoring Guide

Guide for refactoring page sections to match legacy designs while maintaining CMS configurability.

## Core Principle

**Goal**: Same exact design as legacy, but values come from database instead of hardcoded.

## Architecture Pattern

Each page CMS implementation has three core files:

```
/content/[page-name]/
├── types.ts                    # TypeScript interfaces
├── defaultSectionContent.ts    # Default values factory functions
└── (components in /features/display-cms/components/sections/)
```

## Refactoring Process

### Step 1: Update Type Definitions

**File**: `types.ts`

Compare legacy component props with current CMS types and update field names to match exactly.

**Example Changes**:
- `ctaButton` → `buttons` array
- `sectionTitle` → `title`
- `quote` → `text`
- Flat structures → nested structures (e.g., `userSection`/`proSection`)

```typescript
// Before (generic CMS)
export interface HeroSection {
  content: {
    title: string;
    ctaButton: { text: string; action: string; };
  };
}

// After (legacy-compatible)
export interface HeroSection {
  content: {
    title: string;
    subtitle: string;
    buttons: Array<{
      text: string;
      action: 'download-client' | 'download-pro';
      style: 'primary' | 'secondary';
    }>;
    phoneImage: string;
  };
}
```

### Step 2: Update Section Components

**File**: `/features/display-cms/components/sections/[SectionName].tsx`

Rewrite components to match legacy designs EXACTLY:

**Key Requirements**:
- Use exact same layouts (grid columns, flex directions)
- Preserve exact class names from legacy (`lg-custom`, `container-custom`)
- Keep inline styles with specific hex colors (`#faffff`, `#c4e2e6`, `#f7f7f7`)
- Import Material-UI icons if used in legacy
- Include dialog integrations (UserDownloadDialog, ProDownloadDialog)
- Use Next.js `Image` component (not OptimizedImage)

**Pattern**:
```typescript
"use client";

import type { HomeSection } from '@/lib/pages/admin/.../types';
import { isSectionType } from '@/lib/pages/admin/.../types';

export function SectionComponent({ section }: { section: HomeSection }) {
  if (!isSectionType(section)) return null;
  const { content } = section;

  // Add state and handlers if needed

  return (
    <section className="exact-legacy-classes">
      {/* Match legacy JSX structure exactly */}
    </section>
  );
}
```

### Step 3: Update Default Content

**File**: `defaultSectionContent.ts`

Update factory functions with correct legacy default values.

**Sources for Correct Values**:
1. Legacy component files in `/lib/pages/[page]/components/`
2. Legacy `pageContent.ts` configuration in `/lib/config/`
3. Actual rendered HTML from the live site

**Example**:
```typescript
export function getDefaultHeroSection(order: number = 1): HeroSection {
  return {
    id: generateSectionId('hero'),
    type: 'hero',
    name: 'Hero Section',
    order,
    visible: true,
    content: {
      // Use EXACT text from legacy
      title: 'THE PLATFORM POWERING THE BEAUTY INDUSTRY',
      subtitle: 'Connect. Book. Sell. Grow. Everything beauty, in one seamless experience',
      buttons: [
        { text: 'I\'m a Client - Download Now', action: 'download-client', style: 'primary' },
        { text: 'I\'m a Beauty Pro - Grow With Glamlink', action: 'download-pro', style: 'secondary' }
      ],
      phoneImage: '/images/hero pic-website.png'  // Verify image path
    }
  };
}
```

## Common Patterns

### Material-UI Icons

Legacy uses Material-UI icons - must preserve:

```typescript
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const iconMap: { [key: string]: any } = {
  'PersonOutline': PersonOutlineIcon,
  'CalendarTodayOutlined': CalendarTodayOutlinedIcon,
  // ... more icons
};

// In component:
const IconComponent = iconMap[feature.icon || ''];
{IconComponent && <IconComponent className="text-glamlink-teal mt-1" sx={{ fontSize: 20 }} />}
```

### Dialog Integrations

Hero and CTA sections trigger download dialogs:

```typescript
import UserDownloadDialog from "@/lib/components/modals/UserDownloadDialog";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

const [showUserDialog, setShowUserDialog] = useState(false);
const [showProDialog, setShowProDialog] = useState(false);

const handleButtonClick = (action: string) => {
  if (action === "download-client") setShowUserDialog(true);
  else if (action === "download-pro") setShowProDialog(true);
};

// At end of JSX:
<UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />
<ProDownloadDialog isOpen={showProDialog} onClose={() => setShowProDialog(false)} />
```

### Image Handling

Use Next.js Image with exact dimensions:

```typescript
import Image from "next/image";

<Image
  src={content.image}
  alt={content.alt}
  width={400}
  height={600}
  className="w-full h-auto"
/>
```

### Hardcoded Sections

Some sections have intentionally hardcoded content (e.g., "For Professionals" in WhyGlamlink). Keep these as-is in the component.

## Verification Checklist

When refactoring a page, verify:

- [ ] All type field names match legacy exactly
- [ ] Component layouts match legacy (grid columns, spacing)
- [ ] All Material-UI icons preserved with correct names
- [ ] Inline styles maintained (specific hex colors)
- [ ] Legacy custom classes used (`container-custom`, `lg-custom`)
- [ ] Dialog integrations work correctly
- [ ] Image paths correct (check `/public/images/` or `/images/`)
- [ ] Default text content matches legacy word-for-word
- [ ] Button text and actions match legacy
- [ ] Hardcoded sections preserved where intended

## Finding Legacy Content

**Priority order**:

1. **Legacy pageContent.ts**: `/lib/config/pageContent.ts` - has actual default values
2. **Legacy components**: `/lib/pages/[page]/components/` - shows structure and design
3. **Live site HTML**: View source or inspect element for exact rendered content

## Common Mistakes to Avoid

1. **Don't assume defaults are correct** - Always verify against legacy
2. **Don't simplify layouts** - Keep exact grid columns and structure
3. **Don't change icon systems** - If legacy uses Material-UI, keep Material-UI
4. **Don't remove inline styles** - Specific colors like `#faffff` are intentional
5. **Don't guess image paths** - Verify in `/public/images/` or legacy code
6. **Don't skip safety checks** - Always include type guards (e.g., `if (!isHeroSection(section))`)

## File Naming Conventions

- Types: `types.ts` (in page folder)
- Defaults: `defaultSectionContent.ts` (in page folder)
- Components: `[SectionName]Section.tsx` (in `/features/display-cms/components/sections/`)
- Type guards: `is[SectionType]Section()` (in types.ts)

## Testing

After refactoring:

1. Check TypeScript compiles without errors
2. Verify component renders in admin preview
3. Compare side-by-side with legacy page
4. Test all interactive elements (buttons, dialogs)
5. Verify default content loads correctly in admin panel

## Example: Complete Refactor Flow

```bash
# 1. Read legacy component
Read /lib/pages/home/components/HeroSection.tsx

# 2. Read legacy config
Read /lib/config/pageContent.ts (homePageContent.hero section)

# 3. Update types
Edit /lib/pages/admin/.../home/types.ts

# 4. Update component
Edit /lib/features/display-cms/components/sections/HeroSection.tsx

# 5. Update defaults
Edit /lib/pages/admin/.../home/defaultSectionContent.ts

# 6. Test
- Component renders correctly
- Types compile
- Defaults load in admin
```

## Summary

**The golden rule**: If it looks different from legacy, it's wrong. Every pixel, every word, every icon must match exactly - the only difference is values come from the database.
