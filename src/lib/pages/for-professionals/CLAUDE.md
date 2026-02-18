# For Professionals Page Documentation

This document provides high-level documentation for the `/for-professionals` page. For detailed component documentation, see the linked files below.

## Page Overview

The For Professionals page (`/app/for-professionals/page.tsx`) showcases beauty professionals and encourages new professionals to join Glamlink. It consists of multiple sections that work together to create a compelling landing experience.

### Page Structure

```tsx
<ForProfessionalsPage>
  <PaginationCarouselClean />      // Professional showcase carousel
  <PassionIntoPowerSection />       // CTA section with app download
  <TwoBoxesSection />               // AI features and Founders Badge info
  <ExpertiseIntoSalesSection />     // E-commerce features showcase
  <EverythingYouNeedSection />      // Platform features grid
  <FinalCTASection />               // Final call-to-action
</ForProfessionalsPage>
```

## Component Directory Structure

```
lib/pages/for-professionals/
   CLAUDE.md                           # This documentation
   types/
      professional.ts                 # Professional type definitions
   components/
      PaginationCarouselClean/       # Main carousel component
         CLAUDE.md                  # ⭐ Detailed carousel documentation
         index.tsx                  # Main component (~374 lines)
         hooks/                     # Custom hooks
             useAPI.ts             # Data fetching
             useFiltering.ts       # Filters & sorting
             useNavigation.ts      # Carousel navigation
         components/               # Child components
             SearchBar.tsx
             SortDropdown.tsx
             FilterDropdown.tsx
             PaginationControls.tsx
             ProfessionalCard/
         types.ts                   # Component types
         mockData.ts                # Mock data generation
      DigitalBusinessCard/
         DigitalBusinessCard.tsx    # Modal popup component
         CLAUDE.md                  # Modal documentation
      PassionIntoPowerSection.tsx
      TwoBoxesSection.tsx
      ExpertiseIntoSalesSection.tsx
      EverythingYouNeedSection.tsx
      FinalCTASection.tsx
```

---

## PaginationCarouselClean Component

The main carousel component that displays professionals with responsive views and modal popups.

**📖 For detailed documentation, see:** [`components/PaginationCarouselClean/CLAUDE.md`](./components/PaginationCarouselClean/CLAUDE.md)

### Quick Overview

**Architecture**: Hook-based with clean separation of concerns
- **useAPI**: Data fetching with mock fallback
- **useFiltering**: Search, filter, sort, pagination
- **useNavigation**: Carousel navigation (desktop/tablet/mobile)

**Responsive Views**:
- **Desktop (xl+)**: 3 cards, group shifting
- **Tablet (md-lg)**: 2 cards, group shifting
- **Mobile**: 1 card, simple swipe

**Features**:
- Search by name, specialty, location, Instagram
- Filter by specialty and location
- Sort by name, location, rating, experience
- Pagination (6 per page)
- Center card highlighting
- Modal popup on card click
- Dropdown management (no overlap)

---

## DigitalBusinessCard Modal

A full-featured modal popup that displays detailed professional information.

**📖 For detailed documentation, see:** [`components/DigitalBusinessCard/CLAUDE.md`](./components/DigitalBusinessCard/CLAUDE.md)

### Sections
1. **Header**: Profile image, name, title, contact options
2. **Video Display**: Signature work video if available
3. **About Me**: Professional bio and business information
4. **Current Promotions**: Active promotional offers
5. **Footer**: Website, Instagram, Email links

---

## Other Page Sections

### PassionIntoPowerSection
- Headline: "Turn Your Passion Into Power"
- Two CTAs: "Become A Founding Pro" and "E-Commerce Panel"
- Opens ProDownloadDialog modal

### TwoBoxesSection
- Two-column grid layout
- **Left box**: AI Discovery features and benefits
- **Right box**: Founders Badge criteria and benefits
- Both open ProDownloadDialog modal

### ExpertiseIntoSalesSection
- Video player section (configurable: local, YouTube, or placeholder)
- Four feature cards with hover effects:
  - Your Shop, Everywhere
  - Sell Through Your Content
  - An Ecosystem That Works Together
  - Built For Professionals
- "Join Now, Pay Less" CTA

### EverythingYouNeedSection
- Feature grid using CardWithIconAnimated component
- Features: Geo-Discovery, Reviews, E-Commerce, Social Media, Founders Badge, Glamlink Edit, AI Discovery, Business Growth Tools

### FinalCTASection
- Gradient background section
- "Your Future in Beauty Starts Here" headline
- CTAs: "Become a Founding Pro" and "Access E-Commerce Panel"

---

## Types Reference

### Professional Interface

```typescript
interface Professional {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  instagram?: string;
  isFounder?: boolean;

  // Professional details
  certificationLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  yearsExperience: number;
  bio?: string;

  // Media
  profileImage?: string;
  portraitImage?: string;
  image?: string;
  gallery?: GalleryItem[];

  // Services & business
  services?: ProfessionalService[];
  promotions?: Promotion[];
  locationData?: LocationData;

  // Metadata
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  order?: number | null;
}
```

### Sort Options

```typescript
type SortBy = "none" | "name" | "location" | "rating" | "experience";
type SortDirection = "asc" | "desc";
```

---

## Styling Patterns

### Color Palette
- **Primary**: `glamlink-teal` (#22B8C8)
- **Hover state**: `glamlink-teal-dark`
- **Active card ring**: `ring-glamlink-teal`

### Transitions
- Card highlight: `transition-all duration-500 ease-in-out`
- Carousel transform: `transition-transform duration-500 ease-in-out`
- Button hover: `transition-all duration-300`

### Responsive Breakpoints
- Mobile: `< md` (< 768px)
- Tablet: `md` to `xl` (768px - 1279px)
- Desktop: `xl+` (>= 1280px)

---

## Common Tasks

### Adding a New Professional
1. Add to database via admin panel
2. Professional appears automatically via API fetch
3. Ensure required fields: `id`, `name`, `title`, `specialty`, `location`, `certificationLevel`, `yearsExperience`

### Modifying Carousel Behavior

See detailed instructions in [`components/PaginationCarouselClean/CLAUDE.md`](./components/PaginationCarouselClean/CLAUDE.md):
- Change cards per view
- Change animation speed
- Enable drag navigation
- Add new sort options
- Customize filter options

### Updating Page Sections

Each section component is self-contained. To modify:
1. Locate component file in `/components/` directory
2. Update JSX and styling as needed
3. Test responsive behavior at all breakpoints

---

## Quick Reference

### Carousel Hook Usage

```typescript
// Main component pattern
const { allPros, isLoading } = useAPI(ENABLE_PAGINATION);

const { state: filterState, actions: filterActions, results: filterResults } =
  useFiltering(allPros, cardsPerPage, ENABLE_PAGINATION);

const { desktop, tablet, drag, actions: navActions } =
  useNavigation(filterResults.currentPagePros.length, ENABLE_DRAG);
```

### Modal Integration

```typescript
// Click handler
const handleCardClick = (pro: Professional) => {
  setSelectedPro(pro);
  setIsModalOpen(true);
};

// Render modal
<DigitalBusinessCard
  professional={selectedPro!}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
/>
```

---

## Related Documentation

- **Carousel Details**: [`components/PaginationCarouselClean/CLAUDE.md`](./components/PaginationCarouselClean/CLAUDE.md)
- **Modal Details**: [`components/DigitalBusinessCard/CLAUDE.md`](./components/DigitalBusinessCard/CLAUDE.md)
- **Professional Types**: `types/professional.ts`

---

**Last Updated**: December 2024
**Maintainer**: Glamlink Development Team
