# Home Page Architecture

This is the reference implementation for creating new pages in the application. The home page demonstrates all required patterns and integrations.

## Current Folder Structure

```
/lib/pages/home/
├── config.ts           # All type definitions and constants
├── components/
│   ├── HomePage.tsx       # Main page component
│   ├── ui.tsx            # UI utilities (IN components folder!)
│   ├── HeroBanner.tsx    # Hero section component
│   ├── FeaturedProjects.tsx  # Featured projects section
│   ├── ServicesSection.tsx   # Services display
│   ├── StatsSection.tsx      # Statistics display
│   └── TestimonialsSection.tsx  # Customer testimonials
├── store/
│   └── homeSlice.ts   # Redux slice with MongoDB integration
├── hooks/
│   └── useHome.ts     # Main hook connecting Redux to components
└── server/
    └── homeUtil.ts    # MongoDB query functions
```

**IMPORTANT**: The `ui.tsx` file is located inside the `components/` folder, NOT in a separate `ui/` folder. This keeps all component-related files together.

## Data Flow

1. **Page Load**: `app/page.tsx` renders `HomePage` component
2. **Data Fetch**: `useHome` hook dispatches `fetchHomeData` on mount
3. **API Call**: Redux thunk calls `/api/home` endpoint
4. **MongoDB Query**: API route uses `homeUtil.ts` to fetch from MongoDB
5. **State Update**: Redux store updates with fetched data
6. **Component Render**: Components receive data via props

## Key Files Explained

### config.ts
- Defines `HomeStateInterface` for Redux state shape
- Exports component prop types (e.g., `HeroBannerProps`)
- Contains API response types and constants
- Central location for ALL type definitions

### components/ui.tsx
- Located in `components/` folder (not separate `ui/` folder!)
- `getComponentStates()`: Extracts relevant state for each component
- Styling utilities: `getFeatureIconClass()`, `getButtonClass()`, etc.
- Reusable UI components: `LoadingSpinner`, `ErrorMessage`
- NO inline conditional classNames allowed

### homeSlice.ts
- Redux Toolkit slice with async thunk for data fetching
- Handles loading, error, and success states
- Provides actions for updating specific data sections
- Integrates with MongoDB via API routes

### useHome.ts
- Central hook for all home page logic
- Connects to Redux using typed hooks
- Provides handlers for user interactions
- Returns state and handlers object

### homeUtil.ts
- MongoDB collection queries
- Data transformation functions
- Seed data for development
- Error handling with fallbacks

## Component Pattern

All components follow this exact pattern:

```typescript
export default function ComponentName({ props }: { props: ComponentProps }) {
  if (!props) {
    console.error('ComponentName: props is undefined');
    return null;
  }
  
  const { state, handlers } = props;
  // Component implementation
}
```

## Import Pattern for UI Utilities

Since `ui.tsx` is in the `components/` folder:

```typescript
// From components in the same folder
import { LoadingSpinner, getButtonClass } from "./ui";

// From hooks or other folders
import { LoadingSpinner } from "../components/ui";
```

## MongoDB Collections

The home page uses these collections:
- `home_hero`: Hero banner content
- `projects`: Featured projects (filtered by `featured: true`)
- `services`: Service offerings
- `home_stats`: Statistics/metrics
- `testimonials`: Customer testimonials

## Component Breakdown

### HomePage.tsx
- Main orchestrator component
- Uses `useHome` hook for state and handlers
- Distributes state to child components
- Handles loading and error states

### HeroBanner.tsx
- Displays hero content from MongoDB
- Uses styling utilities from `ui.tsx`
- Follows single props pattern

### FeaturedProjects.tsx
- Shows 3 featured projects
- Click handlers for navigation
- Tech badge styling from utilities

### ServicesSection.tsx
- Grid layout for services
- Dynamic gradient backgrounds
- Icon mapping for service types

### StatsSection.tsx
- Animated stat cards
- Color gradients from utilities
- Responsive grid layout

### TestimonialsSection.tsx
- Customer testimonials with ratings
- Schedule call CTA
- Avatar fallback to initials

## Creating Similar Pages

To create a new page (e.g., `/ads`) based on this structure:

1. Copy folder structure (but remember `ui.tsx` goes in `components/`)
2. Update all type names in `config.ts`
3. Create Redux slice with async thunk
4. Build hook with business logic
5. Create server utilities for MongoDB
6. Build components following single props pattern
7. Add API route
8. Integrate with Redux store
9. Create page file in `/app/[pageName]/`

## Testing Checklist

- [ ] MongoDB connection configured in `.env`
- [ ] API route returns seed data in development
- [ ] Redux DevTools shows state updates
- [ ] All components handle loading/error states
- [ ] Props validation in every component
- [ ] No TypeScript errors
- [ ] UI utilities properly imported from `./ui`

## Common Patterns Used

### State Extraction
```typescript
const {
  heroBanner_state,
  featuredProjects_state,
  servicesSection_state,
} = getComponentStates(state);
```

### Handler Distribution
```typescript
const featuredProjectsHandlers = {
  onProjectClick: handlers.onProjectClick,
  onViewAllClick: handlers.onViewAllClick,
};
```

### Conditional Rendering
```typescript
if (state.isLoading) return <LoadingSpinner />;
if (state.error) return <ErrorMessage message={state.error} />;
```

## Important Rules

1. **ui.tsx Location**: Always in `components/` folder
2. **Single Props**: Never destructure multiple props
3. **Type Safety**: All interfaces in `config.ts`
4. **No Inline Logic**: All utilities in `ui.tsx`
5. **100 Line Limit**: Split large components
6. **Error Handling**: Always validate props