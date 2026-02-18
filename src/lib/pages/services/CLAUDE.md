# Services Module Documentation

This module implements the SEO-optimized services/treatments pages for Glamlink. It provides a "Browse All Services" experience where users can discover beauty treatments and professionals by category and location.

## Overview

The services module follows the Glamlink site structure plan, using `/services` as the base route:

| Route | Purpose | Status |
|-------|---------|--------|
| `/services` | Browse All Services | ✅ Complete |
| `/services/[treatment]` | Treatment-specific page | ✅ Complete |
| `/services/location/[location]` | City directory | Phase 3 |
| `/services/[treatment]/[location]` | Treatment + Location | Phase 4 |

## Architecture

```
lib/pages/services/
├── CLAUDE.md                    # This documentation
├── index.ts                     # Barrel exports
├── types/
│   ├── index.ts                # Type re-exports
│   ├── treatment.ts            # Treatment interfaces
│   └── location.ts             # Location interfaces
├── config/
│   ├── index.ts                # Config exports
│   ├── treatments.ts           # Treatment categories, slugs, cities
│   └── treatmentContent.ts     # Treatment descriptions, FAQs, pricing
├── hooks/
│   ├── index.ts                # Hook exports
│   ├── useServicesData.ts      # Main data fetching hook
│   └── useTreatmentData.ts     # Treatment-specific data hook
└── components/
    ├── index.ts                # Component exports
    ├── ServicesPage.tsx        # Main browse all page
    ├── TreatmentPage.tsx       # Treatment detail page
    ├── TreatmentCard.tsx       # Treatment category card
    ├── CityCard.tsx            # City/location card
    ├── ProCard.tsx             # Professional card
    ├── TreatmentHero.tsx       # Treatment page hero
    ├── TreatmentStats.tsx      # Treatment page stats
    ├── CityLinks.tsx           # City links grid
    ├── TreatmentFAQs.tsx       # FAQ accordion
    └── RelatedTreatments.tsx   # Related treatments section
```

## Data Flow

```
useServicesData (hook)
    ↓
Fetch from /api/professionals
    ↓
Process data:
├── categories (from config)
├── featuredPros (from API data)
└── popularLocations (derived from pros + config)
    ↓
ServicesPage (component)
    ↓
Child components render
```

## Components

### ServicesPage

Main page component that displays:
- Hero section with search placeholder
- Browse by Category (6 treatment categories)
- Popular Cities (12 cities with pro counts)
- Featured Professionals (8 pros)
- CTA section for professionals

**Usage:**
```tsx
import { ServicesPage } from '@/lib/pages/services';

export default function Page() {
  return <ServicesPage />;
}
```

### TreatmentCard

Displays a treatment category with icon, name, description, and treatment count.

**Props:**
- `category: TreatmentCategoryInfo` - Category data
- `className?: string` - Additional CSS classes

**Links to:** `/services/[first-treatment-slug]`

### CityCard

Displays a city with state and professional count.

**Props:**
- `location: LocationCardData` - Location data
- `className?: string` - Additional CSS classes
- `variant?: 'default' | 'compact'` - Display variant

**Links to:** `/services/location/[city-slug]`

### ProCard

Displays a professional with image, name, title, location, rating, and badges.

**Props:**
- `professional: Professional` - Professional data
- `className?: string` - Additional CSS classes
- `onClick?: () => void` - Optional click handler

**Links to:** `/for-professionals/[cardUrl]` (if hasDigitalCard)

### TreatmentPage

Main treatment detail page component that displays:
- Hero with treatment info and category
- Quick stats (pro count, reviews, price range)
- "Find in Your City" links
- Featured professionals for this treatment
- About section with educational content
- FAQ accordion
- Related treatments

**Usage:**
```tsx
import { TreatmentPage } from '@/lib/pages/services';

export default function Page({ params }) {
  return <TreatmentPage treatmentSlug={params.treatment} />;
}
```

**Props:**
- `treatmentSlug: string` - Treatment slug from URL (e.g., 'lip-blush')

### Treatment Page Sub-Components

| Component | Purpose |
|-----------|---------|
| `TreatmentHero` | Hero section with treatment name, description, and quick info |
| `TreatmentStats` | Stats bar showing pro count, reviews, and price range |
| `CityLinks` | Grid of cities where treatment is available |
| `TreatmentFAQs` | Accordion FAQ section |
| `RelatedTreatments` | Cards linking to related treatments |

## Hooks

### useServicesData

Main data fetching hook for the services page.

**Returns:**
```typescript
{
  categories: TreatmentCategoryInfo[];  // From config
  featuredPros: Professional[];         // From API (8 max)
  popularLocations: LocationCardData[]; // Derived from pros + config
  allPros: Professional[];              // All professionals
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Features:**
- Fetches professionals from `/api/professionals`
- Extracts unique locations from professional data
- Merges with configured popular cities
- Selects featured professionals by `featured` flag, then by rating

### useTreatmentData

Data fetching hook for treatment-specific pages.

**Parameters:**
- `treatmentSlug: string` - Treatment slug to fetch data for

**Returns:**
```typescript
{
  treatment: TreatmentContent | null;     // Treatment info from config
  category: TreatmentCategoryInfo | null; // Category containing treatment
  pros: Professional[];                    // All pros offering this treatment
  featuredPros: Professional[];            // Featured pros (8 max)
  stats: TreatmentStats;                   // Pro count, reviews, prices
  cityStats: LocationCardData[];           // Cities with pro counts
  relatedTreatments: TreatmentContent[];   // Related treatment content
  isLoading: boolean;
  error: string | null;
  isValidSlug: boolean;                    // Whether slug is valid
  refetch: () => Promise<void>;
}
```

**Features:**
- Validates treatment slug against `VALID_TREATMENT_SLUGS`
- Filters professionals by matching services, specialty, or title
- Calculates city stats from filtered professionals
- Gets related treatment content
- Handles invalid slugs gracefully

## Configuration

### Treatment Categories

Defined in `config/treatments.ts`:

```typescript
const TREATMENT_CATEGORIES = [
  { id: 'injectables', name: 'Injectables', treatments: [...] },
  { id: 'permanent-makeup', name: 'Permanent Makeup', treatments: [...] },
  { id: 'skin-treatments', name: 'Skin Treatments', treatments: [...] },
  { id: 'lashes-brows', name: 'Lashes & Brows', treatments: [...] },
  { id: 'hair-removal', name: 'Hair Removal', treatments: [...] },
  { id: 'body-treatments', name: 'Body Treatments', treatments: [...] },
];
```

### Valid Treatment Slugs

Used for URL validation:
```typescript
const VALID_TREATMENT_SLUGS = [
  'botox', 'dermal-fillers', 'lip-filler', 'lip-blush',
  'microblading', 'eyeliner-tattoo', 'lash-extensions',
  // ... more
];
```

### Popular Cities

Pre-configured for consistent display:
```typescript
const POPULAR_CITIES = [
  { slug: 'las-vegas', city: 'Las Vegas', state: 'NV' },
  { slug: 'los-angeles', city: 'Los Angeles', state: 'CA' },
  // ... more
];
```

## Types

### TreatmentCategoryInfo
```typescript
interface TreatmentCategoryInfo {
  id: TreatmentCategory;
  name: string;
  description: string;
  treatments: string[];
  image: string;
  icon?: string;
}
```

### LocationCardData
```typescript
interface LocationCardData {
  slug: string;
  city: string;
  state: string;
  proCount: number;
  image?: string;
}
```

### Professional

Re-exported from `@/lib/pages/for-professionals/types/professional`.

## Treatment Content Configuration

Treatment content is defined in `config/treatmentContent.ts`:

```typescript
interface TreatmentContent {
  slug: string;
  name: string;
  category: TreatmentCategory;
  shortDescription: string;
  longDescription: string;
  whatToExpect: string;
  priceRange: { min: number; max: number; currency: string };
  duration: string;
  healingTime: string;
  resultsLast: string;
  relatedTreatments: string[];
  faqs: FAQ[];
  image: string;
}
```

**Helper functions:**
- `getTreatmentContent(slug)` - Get content for a treatment
- `getTreatmentsByCategory(category)` - Get all treatments in a category
- `getRelatedTreatmentContent(slugs)` - Get content for related treatments

## Future Phases

### Phase 3: Location Pages (`/services/location/[location]`)
- City directory pages
- All treatments in a city
- Local featured pros
- Neighborhood information

### Phase 4: Combined (`/services/[treatment]/[location]`)
- Main SEO landing pages
- "[Treatment] in [City]" format
- Filtered pro listings
- Local pricing data

## SEO Considerations

### Browse All Services (`/services`)
- **Title:** "Beauty & Wellness Services | Find Verified Pros | Glamlink"
- **Target Keywords:** "beauty services", "find beauty pros", "beauty appointments"
- **Schema:** To be added in SEO optimization phase

### Treatment Pages (`/services/[treatment]`)
- **Title:** "[Treatment] Artists | Find & Book Verified Pros | Glamlink"
- **Description:** "Find verified [treatment] professionals. See before & after photos, read reviews, and book with confidence."
- **Target Keywords:** "[treatment]", "[treatment] near me", "[treatment] artists", "[treatment] cost"

### URL Structure Benefits
- Clean, semantic URLs (`/services/lip-blush`)
- No conflicts with existing routes
- Scalable for treatment + location combinations
- Good for link building and internal linking

## Styling

Components use:
- Tailwind CSS for styling
- `glamlink-teal` brand color (#22B8C8)
- Responsive grid layouts
- Hover animations and transitions

## Testing

### Browse All Services (`/services`)
1. Navigate to `/services`
2. Verify categories display correctly
3. Verify cities show with pro counts
4. Verify featured pros appear
5. Test responsive behavior
6. Test category links go to treatment pages

### Treatment Pages (`/services/[treatment]`)
1. Navigate to `/services/lip-blush`
2. Verify treatment name and description display
3. Verify stats section shows (pro count, reviews, price)
4. Verify city links section renders
5. Verify featured professionals appear (if any match)
6. Verify "About" section with long description
7. Verify FAQs accordion works
8. Verify related treatments link correctly
9. Test invalid treatment slug (e.g., `/services/invalid`) shows 404
10. Test responsive behavior

### Test URLs
- `/services` - Browse all services
- `/services/lip-blush` - Permanent makeup treatment
- `/services/botox` - Injectables treatment
- `/services/lash-extensions` - Lashes treatment
- `/services/invalid-treatment` - Should show 404

```bash
npm run typecheck
npm run dev
# Navigate to http://localhost:3000/services
# Navigate to http://localhost:3000/services/lip-blush
```

## Troubleshooting

### No professionals showing
- Check `/api/professionals` is returning data
- Verify Firestore has professional documents

### Cities showing 0 pros
- Check professional `locationData` or `location` fields
- Ensure location parsing is working

### TypeScript errors
- Run `npm run typecheck`
- Check import paths are correct

### Treatment page not loading
- Check treatment slug is in `VALID_TREATMENT_SLUGS`
- Verify `getTreatmentContent(slug)` returns data
- Check browser console for API errors

### Professionals not filtering correctly
- Check professional `services` array contains matching treatment names
- Verify `proOffersTreatment()` matching logic in `useTreatmentData.ts`

---

**Last Updated:** January 2025
**Version:** 2.0.0 (Phase 1 + Phase 2 Complete)
**Maintainer:** Glamlink Development Team
