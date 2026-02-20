# Glamlink Library Architecture Guide

This document explains the architecture patterns and folder structure for the Glamlink beauty marketplace application's library components.

## Module-Specific Documentation

- **[Admin Panel Documentation](./admin/CLAUDE.md)** - Comprehensive guide for admin components, Redux state management, and type system
- **[Brand Pages Documentation](./pages/brand/CLAUDE.md)** - Guide for public-facing brand showcase pages and components

## Core Architecture Principles

1. **Component-based organization**: Each major feature has its own folder under `/lib/`
2. **Redux for global state**: Authentication and brand data managed centrally
3. **Firebase for persistence**: Firestore for data, Storage for images, Auth for users
4. **Strict component patterns**: All components follow the single props pattern
5. **Type safety**: Full TypeScript coverage with centralized type definitions

## Library Structure

```
/lib/
├── admin/                  # Admin panel components (see admin/CLAUDE.md)
│   ├── components/        # Tab components and shared UI
│   │   ├── fields/       # Form field components
│   │   └── questionnaire/# Brand setup wizard components
│   ├── config.ts         # Admin configuration
│   ├── hooks/            # Custom hooks with Redux integration
│   ├── store/            # Redux slices (adminProfileSlice)
│   ├── types/            # Centralized TypeScript definitions
│   └── utils/            # Utilities (requirements parser)
├── auth/                  # Authentication system
│   ├── components/       # AuthProvider
│   ├── hooks/           # useAuth hook
│   └── store/           # authSlice
├── components/           # Shared UI components
│   ├── banners/         # Hero and promotional banners
│   └── ui/              # Reusable UI components
│       ├── badges/      # Badge components (Spotlight, Verified, etc.)
│       ├── Alert.tsx    # Alert and ErrorAlert components
│       ├── DateDisplay.tsx # Date formatting utilities
│       ├── EmptyState.tsx  # Empty state component
│       ├── LoadingSpinner.tsx # Loading states
│       ├── RatingStars.tsx    # Star rating display
│       └── index.ts     # Centralized exports
├── config/               # Configuration files
│   ├── firebase.ts      # Firebase client config
│   └── features.ts      # Feature flags
├── firebase/             # Firebase utilities
│   └── serverApp.ts     # Server-side Firebase auth
├── pages/                # Page-specific modules
│   ├── brand/           # Brand showcase pages (see pages/brand/CLAUDE.md)
│   │   ├── components/  # Brand page components
│   │   ├── hooks/       # Brand-specific hooks
│   │   ├── store/       # brandSlice Redux store
│   │   └── types/       # Centralized brand types
│   ├── home/            # Landing page
│   └── image-analysis/  # AI beauty analysis
└── services/             # Service layers
    ├── ai/              # AI content generation
    └── firebase/        # Firebase service wrappers
```

## Recent Architecture Updates

### 1. Centralized Type System

We've reorganized all TypeScript types into dedicated type directories:

- `/lib/admin/types/` - All admin panel types organized by feature
- `/lib/pages/brand/types/` - All brand page types

Benefits:

- Single source of truth for types
- Better discoverability
- Reduced duplication
- Easier maintenance

### 2. Redux State Management

Introduced `adminProfileSlice` for centralized admin state:

- Brand data and profile management
- Form state with change tracking
- Questionnaire and brainstorm ideas
- Loading and error states
- See [Migration Guide](./admin/MIGRATION_GUIDE.md) for implementation details

## Key Patterns

### 1. Admin Tab Components

Each admin tab follows this pattern:

```typescript
// Example: ProductsTab.tsx
export default function ProductsTab() {
  const [items, setItems] = useState<Product[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  // Fetch from user's brand document
  const fetchItems = async () => {
    const brand = await firestoreService.getDocument<Brand>("brands", user.brandId);
    setItems(brand?.products || []);
  };

  // CRUD operations using Firestore array helpers
  const handleCreate = async (data) => {
    await firestoreService.addToBrandArray(user.brandId, "products", data);
  };

  return (
    <div>
      {/* Grid/list of items */}
      {/* Create/Edit modals */}
      {/* AI generation button */}
    </div>
  );
}
```

### 2. Date Management Pattern

Consistent date handling across the application:

```typescript
// Storage format: YYYY-MM-DD
const dateString = "2024-02-01";

// Display format: "Feb 2, 2024"
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// In EditModal fields configuration
{ name: 'nextSessionDate', label: 'Next Session', type: 'date' }
```

### 3. File Upload Pattern

Used in Brand Setup Wizard:

```typescript
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const result = parseRequirementsFile(text);

    if (result.success && result.data) {
      setUploadedData(result.data);
    } else {
      setUploadError(result.errors?.join("\n"));
    }
  } catch (error) {
    setUploadError("Failed to read file");
  }
};
```

### 4. Progress Dialog Pattern

For long-running operations:

```typescript
interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed" | "error";
  error?: string;
}

// Usage in questionnaire generation
const steps: GenerationStep[] = [
  { id: "save-questionnaire", label: "Saving questionnaire", status: "pending" },
  { id: "generate-products", label: "Generating products", status: "pending" },
  // ... more steps
];
```

### 5. Firebase Service Pattern

All Firebase operations go through service classes:

```typescript
// firestoreService methods for nested arrays
await firestoreService.addToBrandArray(brandId, "products", newProduct);
await firestoreService.updateInBrandArray(brandId, "products", productId, updates);
await firestoreService.removeFromBrandArray(brandId, "products", productId);
```

## Component Patterns

### EditModal Configuration

The EditModal component supports various field types:

```typescript
const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'select', options: [...] },
  { name: 'published', label: 'Published', type: 'checkbox' },
  { name: 'tags', label: 'Tags', type: 'array' },
  { name: 'mainImage', label: 'Image', type: 'image', contentType: 'product' },
  { name: 'gallery', label: 'Gallery', type: 'image-array', maxImages: 5 },
  { name: 'launchDate', label: 'Launch Date', type: 'date' }
];
```

### Navigation Patterns

Profile navigation with exact route matching:

```typescript
const isActiveRoute = (href?: string) => {
  if (!href) return false;
  if (href === "/profile") return pathname === href;
  if (href === "/profile/brand") return pathname === href; // Exact match
  return pathname.startsWith(href);
};
```

## AI Integration

### Content Generation Service

```typescript
// Generate content with brand context
const products = await contentGeneratorService.generateProducts({
  brandName: brand.name,
  brandTagline: brand.tagline,
  brandMission: brand.mission,
  count: 10,
  category: "skincare",
});
```

### Image Generation Service

```typescript
// Generate images with DALL-E 3 or fallback
const images = await imageGeneratorService.generateImages({
  contentType: "product",
  imageType: "main",
  quantity: 1,
  context: { name: product.name, category: product.category },
});
```

## Shared UI Components

The `/lib/components/ui/` directory contains reusable UI components used throughout the application:

### Core Components

1. **EmptyState** - Display when no data is available

```typescript
import { EmptyState } from "@/lib/components/ui";
<EmptyState message="No products found" />;
```

2. **LoadingSpinner** - Loading indicators

```typescript
import { LoadingSpinner, LoadingOverlay } from '@/lib/components/ui';
<LoadingSpinner />
<LoadingOverlay message="Processing..." />
```

3. **RatingStars** - Star rating display

```typescript
import { RatingStars } from "@/lib/components/ui";
<RatingStars rating={4.5} size="md" showCount={true} count={120} />;
```

4. **DateDisplay** - Consistent date formatting

```typescript
import { DateDisplay, formatDate } from "@/lib/components/ui";
<DateDisplay date="2024-02-01" format="short" />;
// Or use the utility: formatDate("2024-02-01", "long")
```

5. **Alert** - Multi-purpose alert component

```typescript
import { Alert, ErrorAlert } from '@/lib/components/ui';
<Alert type="success" message="Brand created successfully!" />
<ErrorAlert error="Failed to save" onDismiss={handleDismiss} />
```

### Badge Components

Located in `/lib/components/ui/badges/`:

- **SpotlightBadge** - For featured items
- **OutOfStockOverlay** - Product unavailability indicator
- **VerifiedBadge** - Verification checkmark
- **CertificationBadge** - Provider certification levels

### Import Pattern

All UI components can be imported from the index:

```typescript
import { EmptyState, LoadingSpinner, RatingStars, SpotlightBadge, Alert } from "@/lib/components/ui";
```

## Common Tasks

### Adding a New Admin Tab

1. Create component in `/lib/admin/components/[TabName]Tab.tsx`
2. Add to `AdminTab` type in `/lib/admin/config.ts`
3. Add to `ALL_ADMIN_TABS` array with icon
4. Update `getAdminTabsForUser()` if needed
5. Add case in admin page's tab renderer

### Creating a Profile Management Page

1. Create page in `/app/profile/brand/[feature]/page.tsx`
2. Add navigation item to `/app/profile/layout.tsx`:

```typescript
{ label: 'Feature', href: '/profile/brand/feature', icon: '' }
```

3. Create management component following admin tab pattern
4. Implement CRUD with Firestore service

### Adding Date Fields

1. Add field with `type: 'date'` in EditModal config
2. Store as YYYY-MM-DD string
3. Display with `formatDate()` utility
4. EditModal automatically handles date input

## Testing Patterns

### Mock Data Fallback

- AI services fall back to Unsplash images
- Content generation falls back to structured mock data
- Empty states shown when Firestore has no data

### File Upload Testing

```bash
# Download sample file
curl http://localhost:3000/sample-requirements.txt -o test.txt
# Upload via UI at /profile → Brand Setup Wizard
```

### Date Field Testing

- Create/edit training program with session date
- Verify storage format in Firestore console
- Confirm display format in UI

## Security Considerations

1. **Authentication**: All API routes check session cookies
2. **Authorization**: Users can only modify their own brand
3. **Validation**: Input sanitization on all forms
4. **File Upload**: Text files only, parsed safely
5. **AI Content**: Sanitized before storage

## Performance Optimizations

1. **Nested Documents**: Single read for all brand data
2. **Lazy Loading**: Images loaded on demand
3. **Optimistic Updates**: UI updates before server confirmation
4. **Caching**: AI responses cached when possible
5. **Batch Operations**: Multiple Firestore operations combined

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined"**

   - Check if using Firebase Admin SDK (don't)
   - Verify user is authenticated
   - Ensure brand document exists

2. **Date Display Issues**

   - Verify date string format (YYYY-MM-DD)
   - Check formatDate() implementation
   - Ensure consistent timezone handling

3. **File Upload Errors**

   - Check file format (.txt only)
   - Verify parser handles all fields
   - Test with sample file first

4. **Navigation Highlighting**
   - Use exact match for base routes
   - Check isActiveRoute logic
   - Verify pathname comparison
