# Promos Page Architecture

This document provides comprehensive documentation for the Promos feature in the Glamlink beauty marketplace application, including its architecture, components, and implementation details.

## Overview

The Promos page is a comprehensive promotions platform that displays beauty brand offers and deals to customers. It features a responsive grid layout, category filtering, modal popups for detailed views, and full Firebase integration with fallback to mock data.

## Current Folder Structure

```
/lib/pages/promos/
├── config.ts           # All type definitions and constants
├── mockData.ts         # Mock promo data for development
├── components/
│   ├── PromosPage.tsx      # Main page component with grid layout
│   ├── PromoCard.tsx       # Individual promo card component
│   ├── PromoModal.tsx      # Modal for detailed promo view
│   └── ui.tsx             # UI utilities and styling helpers
├── hooks/
│   └── usePromos.ts       # Custom hook for state management
└── server/
    ├── promosListingService.ts    # Public data fetching with auth pattern
    └── promosServerService.ts     # Firebase CRUD operations
```

**IMPORTANT**: The `ui.tsx` file is located inside the `components/` folder, NOT in a separate `ui/` folder. This keeps all component-related files together.

## Data Flow

1. **Page Load**: `app/promos/page.tsx` renders `PromosPageWrapper` component
2. **Data Fetch**: `usePromos` hook fetches promo data on mount
3. **API Call**: Hook calls promosListingService which connects to Firebase
4. **Firebase Query**: Uses authentication pattern similar to magazine module
5. **Fallback**: If Firebase unavailable, uses mock data from `mockData.ts`
6. **State Update**: Component state updates with fetched data
7. **Component Render**: Grid displays promo cards with modal support

## Key Features

### Responsive Grid Layout
- **Desktop**: 4 cards per row
- **Tablet**: 2 cards per row
- **Mobile**: 1 card per row (full width)
- Animated card hover effects and transitions

### Category Filtering
- 8 beauty categories: Skincare, Makeup, Hair Care, Beauty Tools, Wellness, Fragrance, Body Care, All
- Real-time promo count per category
- Visual category pills with counts

### Promo Cards
- Eye-catching design with gradient backgrounds
- Status badges (Active, Ends Today, X Days Left, Expired, Upcoming)
- Discount percentage badges
- Featured badges for highlighted promos
- Category badges with color coding
- Responsive images with overlay effects

### Modal System
- Detailed promo view with full information
- Image gallery with hero display
- Validity period and countdown timers
- Terms and conditions section
- CTA buttons for promo links

### Status Management
- **Active**: Currently running promotions
- **Upcoming**: Future promotions not yet started
- **Expired**: Past promotions (hidden by default)
- **Featured**: Highlighted promotions in separate section

## Key Files Explained

### config.ts
- Defines `PromoItem` interface with all promo fields
- Component prop types and state interfaces
- API response types and constants
- Helper functions for date formatting and status checking
- Grid configuration and animation constants

### mockData.ts
- 10 sample promos with various categories and statuses
- Helper functions for filtering mock data
- Date generation utilities for testing different states
- Category-based filtering functions

### components/PromosPage.tsx
- Main orchestrator component with full page layout
- Category filter implementation
- Featured promos section
- Grid layout with responsive design
- Modal integration and state management
- Tips section for user guidance

### components/PromoCard.tsx
- Individual promo card component
- Status badge logic and styling
- Hover effects and animations
- Accessibility features (ARIA labels, keyboard navigation)
- Grid helper components for different layouts

### components/PromoModal.tsx
- Full-screen modal for detailed promo view
- Image hero section with gradient overlay
- Countdown timers and status displays
- Modal management hook for easier usage
- Escape key and backdrop click handling

### components/ui.tsx
- Loading states and error handling components
- Empty state component with custom messages
- Badge generation utilities (status, discount, category, featured)
- Styling helpers for cards, buttons, and animations
- Color schemes for different categories

### hooks/usePromos.ts
- Main hook for promo state management
- Data fetching with error handling
- Modal state management
- Event handlers for user interactions
- Additional hooks for specific use cases (by category, by ID, stats)

### server/promosListingService.ts
- Public data fetching with authentication pattern
- Follows magazine module architecture
- Firebase integration with fallback to mock data
- Category filtering and featured promos
- Statistics and data availability checks

### server/promosServerService.ts
- Firebase CRUD operations for promos
- Timestamp handling for date fields
- Bulk operations for data migration
- Category-based querying
- Visibility and featured status management

## Data Structure

### PromoItem Interface
```typescript
interface PromoItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  ctaText: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  popupDisplay: string; // Name for popup display
  visible: boolean;
  featured: boolean;
  category?: string;
  discount?: string | number; // Can be "FREE", "BOGO", "50% OFF", or numeric percentage like 25
  priority?: number; // Higher number = higher priority
  createdAt?: string;
  updatedAt?: string;
}
```

## Firebase Integration

### Authentication Pattern
Follows the magazine module pattern for Firebase access:

```typescript
// Get Firebase instance based on auth requirement
const { db } = requireAuth
  ? await getAuthenticatedAppForUser()
  : await getPublicFirebaseApp();
```

### Collection Structure
- **Collection**: `promos`
- **Fields**: All PromoItem fields with Firebase Timestamps for dates
- **Indexing**: Optimized for category, featured, and date queries
- **Security Rules**: Public read access, admin write access

## API Routes

### GET /api/promos
- Returns all visible promos
- Query parameters:
  - `category`: Filter by category
  - `featured=true`: Return only featured promos
  - `stats=true`: Return promo statistics

### GET /api/promos/[id]
- Returns single promo by ID
- Includes visibility checks

### POST /api/promos (Admin)
- Creates new promo
- Requires authentication
- Validates required fields

### PUT /api/promos/[id] (Admin)
- Updates existing promo
- Requires authentication
- Validates promo existence

### DELETE /api/promos/[id] (Admin)
- Deletes promo
- Requires authentication
- Validates promo existence

## Component Pattern

All components follow the single props pattern:

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

## Usage Examples

### Basic Promos Page
```typescript
import PromosPage from "@/lib/pages/promos/components/PromosPage";
import { usePromos } from "@/lib/pages/promos/hooks/usePromos";

export default function MyPromosPage() {
  const { state, handlers, isLoading, error } = usePromos();

  return (
    <PromosPage
      props={{
        state: {
          promos: state.promos,
          featuredPromos: state.featuredPromos,
          isLoading,
          error,
          selectedPromo: state.selectedPromo,
          isModalOpen: state.isModalOpen
        },
        handlers
      }}
    />
  );
}
```

### Category-Specific Promos
```typescript
import { usePromosByCategory } from "@/lib/pages/promos/hooks/usePromos";

export function SkincarePromos() {
  const { promos, isLoading, error } = usePromosByCategory("Skincare");
  // Render promos...
}
```

### Single Promo Display
```typescript
import { usePromoById } from "@/lib/pages/promos/hooks/usePromos";

export function PromoDetail({ promoId }: { promoId: string }) {
  const { promo, isLoading, error } = usePromoById(promoId);
  // Render single promo...
}
```

## Styling Guidelines

### Color Schemes
- **Primary**: Glamlink purple to teal gradient
- **Status**: Green (active), Orange (ending soon), Red (expired), Blue (upcoming)
- **Categories**: Each category has distinct color coding
- **Discounts**: Red badges for percentage off

### Animations
- **Cards**: Scale and shadow on hover
- **Modal**: Fade in with backdrop blur
- **Badges**: Pulse for urgent/time-sensitive offers
- **Grid**: Staggered fade-in animation

### Responsive Breakpoints
- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: 1024px - 1280px (3 columns)
- **Large**: > 1280px (4 columns)

## Testing Checklist

- [ ] Mock data displays correctly when Firebase unavailable
- [ ] Category filtering works with proper counts
- [ ] Modal opens/closes with keyboard navigation
- [ ] Countdown timers update correctly
- [ ] Responsive grid adapts to all screen sizes
- [ ] Status badges display correct information
- [ ] Featured promos appear in dedicated section
- [ ] CTA buttons open links in new tabs
- [ ] Error states display helpful messages
- [ ] Loading states show during data fetch

## Common Patterns Used

### Status Checking
```typescript
const isActive = isPromoActive(promo);
const isExpired = isPromoExpired(promo);
const daysRemaining = getDaysRemaining(promo);
```

### Badge Generation
```typescript
const statusBadge = getPromoStatusBadge(promo);
const discountBadge = getDiscountBadge(promo.discount);
const categoryBadge = getCategoryBadge(promo.category);
```

### Modal Management
```typescript
const {
  isOpen,
  selectedPromo,
  openModal,
  closeModal,
  handleCtaClick
} = usePromoModal();
```

## Future Enhancements

1. **Search Functionality**: Full-text search across promo titles and descriptions
2. **Advanced Filtering**: Price range, discount percentage, date range filters
3. **User Favorites**: Allow users to save favorite promos
4. **Share Features**: Social sharing for individual promos
5. **Analytics Integration**: Track promo views and clicks
6. **Admin Panel**: Full CRUD interface for managing promos
7. **Email Notifications**: Alert users for new promos in favorite categories
8. **Bulk Operations**: Import/export promos in bulk

## Important Rules

1. **ui.tsx Location**: Always in `components/` folder
2. **Single Props**: Never destructure multiple props
3. **Type Safety**: All interfaces in `config.ts`
4. **No Inline Logic**: All utilities in `ui.tsx`
5. **Firebase Fallback**: Always provide mock data fallback
6. **Accessibility**: Include ARIA labels and keyboard navigation
7. **Responsive Design**: Test all breakpoints
8. **Error Handling**: Graceful degradation for all error states