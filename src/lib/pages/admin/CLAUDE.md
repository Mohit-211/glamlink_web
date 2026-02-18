# Admin Panel - Table & Edit System Documentation

## Overview

The admin panel provides CRUD management for various resources using a standardized table/modal/field configuration pattern. This modular architecture ensures consistency across all admin pages while remaining flexible and maintainable.

## System Architecture

The admin system follows a clear three-tier pattern:

### 1. Page Component (`app/admin/[feature]/page.tsx`)
- Simple wrapper with AuthWrapper for access control
- Renders the corresponding Tab component
- Examples: `professionals/page.tsx`, `promos/page.tsx`, `digital/page.tsx`

```typescript
export default function AdminDigitalPage() {
  return (
    <AuthWrapper requireAuth requireAdmin featureName="Digital Magazine Management">
      <div className="p-8">
        <DigitalTab />
      </div>
    </AuthWrapper>
  );
}
```

### 2. Tab Component (`lib/pages/admin/components/[feature]/[Feature]Tab.tsx`)
- Contains core business logic
- Uses API hook for data operations
- Manages modal state (add/edit/batch upload)
- Renders TableHeader, SimpleTable, and Modals

**Key Pattern:**
```typescript
export default function DigitalTab() {
  // 1. Data & operations from API hook
  const { issues, isLoading, error, createIssue, updateIssue, deleteIssue, toggleFeatured, batchUpload } = useDigitalAPI();

  // 2. UI state for modals
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // 3. Computed fields (e.g., section count)
  const issuesWithSectionCount = issues.map(issue => ({
    ...issue,
    sectionCount: issue.sections?.length || 0
  }));

  // 4. Handler wrappers
  const handleDeleteWithConfirm = async (issue) => {
    if (!confirm(`Delete "${issue.title}"?`)) return;
    await deleteIssue(issue.id);
  };

  // 5. Render: Header + Table + Modals
  return (
    <div>
      <TableHeader onRefresh={fetchIssues} onAdd={() => setShowAddForm(true)} />
      <SimpleTable data={issuesWithSectionCount} config={digitalDisplayConfig} onEdit={setEditingIssue} onDelete={handleDeleteWithConfirm} />
      <DigitalModal isOpen={showAddForm} onSave={createIssue} onClose={() => setShowAddForm(false)} />
      <BatchUploadModal isOpen={showBatchUpload} onUpload={batchUpload} onClose={() => setShowBatchUpload(false)} />
    </div>
  );
}
```

### 3. API Hook (`use[Feature]API.ts`)
- Encapsulates all CRUD operations
- Manages loading, error, and saving states
- Auto-fetches data on mount
- Provides consistent interface across features

**Standard Interface:**
```typescript
export interface UseDigitalAPIReturn {
  // Data & state
  issues: MagazineIssue[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  // Operations
  fetchIssues: () => Promise<void>;
  createIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  updateIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  toggleFeatured: (issue: MagazineIssue) => Promise<void>;
  batchUpload: (issues: Partial<MagazineIssue>[]) => Promise<void>;
}
```

**Key Features:**
- Fetch from API with `credentials: 'include'` for authentication
- `useCallback` + `useEffect` for auto-loading on mount
- Optimistic UI updates (update state before API confirms)
- Error handling with user-friendly messages

### 4. Field Configuration (`config/fields/[feature].ts`)
- Defines all form fields for create/edit modals
- Single source of truth for field definitions
- Supports multiple field types with validation

**Field Configuration Structure:**
```typescript
export const digitalEditFields: FieldConfig[] = [
  {
    name: 'id',
    label: 'Issue ID',
    type: 'text',
    required: true,
    disabled: true,  // Read-only in edit mode
    placeholder: '2025-08-04',
    helperText: 'Unique identifier (YYYY-MM-DD format recommended)'
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Summer Glow Edition'
  },
  {
    name: 'issueNumber',
    label: 'Issue Number',
    type: 'number',
    required: true,
    min: 1
  },
  {
    name: 'issueDate',
    label: 'Issue Date',
    type: 'date',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Discover the latest...'
  }
];
```

**Supported Field Types:**
- `text` - Single-line text input
- `textarea` - Multi-line text input
- `number` - Numeric input with optional min/max
- `date` - Date picker
- `select` - Dropdown with options
- `checkbox` - Boolean toggle
- `image` - Image upload with preview
- `array` - Dynamic list of items

**Field Configuration Files:**
- `fields/professionals.ts` - Professional field definitions
- `fields/promos.ts` - Promo field definitions
- `fields/digital.ts` - Digital magazine field definitions
- `fields/index.ts` - Centralized exports

### 5. Display Configuration (`config/displayTables.ts`)
- Defines table columns and rendering
- Maps data fields to visual representation
- Supports various column types

**Display Configuration Structure:**
```typescript
export const digitalDisplayConfig: DisplayTableConfig = {
  id: {
    label: 'Issue ID',
    type: 'text',
    width: '120px'
  },
  title: {
    label: 'Title',
    type: 'text',
    width: '200px'
  },
  sectionCount: {
    label: 'Sections',
    type: 'text',
    width: '100px'
  },
  featured: {
    label: 'Featured',
    type: 'toggleWithIcon',
    trueLabel: '⭐',
    falseLabel: '☆',
    trueColor: 'bg-yellow-100 text-yellow-800',
    falseColor: 'bg-gray-100 text-gray-800',
    width: '100px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '120px',
    align: 'right'
  }
};
```

**Supported Column Types:**
- `text` - Plain text display
- `multiLine` - Multiple fields stacked
- `badge` - Colored badge with background
- `toggle` - Toggle button with labels
- `toggleWithIcon` - Toggle with icons (e.g., ⭐/☆)
- `dateRange` - Date range display
- `actions` - Action buttons (edit/delete)
- `rating` - Star rating display
- `years` - Years of experience

### 6. Modal Component (`[Feature]Modal.tsx`)
- Wraps FormModal with feature-specific logic
- Handles data transformation before save
- Provides default values

```typescript
export default function DigitalModal({ isOpen, onClose, onSave, initialData, title }: DigitalModalProps) {
  const handleSave = async (data: any): Promise<void> => {
    // Transform and validate data
    const magazineData: Partial<MagazineIssue> = {
      ...data,
      id: initialData?.id || data.id,
      urlId: data.urlId || data.id,
      title: data.title!,
      featured: data.featured ?? false,
      sections: initialData?.sections || []
    };

    await onSave(magazineData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      initialData={{ ...getDefaultDigitalValues(), ...initialData }}
      fields={digitalEditFields}
      onSave={handleSave}
      saveButtonText="Save Issue"
      size="2xl"
    />
  );
}
```

## Data Flow

The complete data flow for a typical operation:

```
[User Action]
    �
[Tab Component]
    �
[API Hook]
    �
[API Endpoint] (/api/magazine/issues, /api/admin/professionals, etc.)
    �
[Firestore Collection] (magazine_issues, professionals collection, etc.)
    �
[State Update in API Hook]
    �
[Table Re-render with New Data]
```

**Example: Creating a New Issue**

1. User clicks "Add Issue" button
2. `DigitalTab` sets `showAddForm = true`
3. `DigitalModal` renders with `getDefaultDigitalValues()`
4. User fills form and clicks "Save Issue"
5. `DigitalModal.handleSave()` transforms data
6. `createIssue()` from `useDigitalAPI` is called
7. POST to `/api/magazine/issues` with data
8. API validates and saves to Firestore
9. API returns saved issue
10. `useDigitalAPI` adds to state: `setIssues([...prev, newIssue])`
11. Table automatically re-renders with new row
12. Modal closes

## API Endpoint Patterns

### Standard CRUD Endpoints

**GET - List All Items**
```typescript
// GET /api/magazine/issues?includeHidden=true
export async function GET(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();
  if (!currentUser || !db) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const includeHidden = request.nextUrl.searchParams.get('includeHidden') === 'true';
  const issues = await magazineServerService.getAllIssues(db, includeHidden);

  return NextResponse.json({ success: true, data: issues });
}
```

**POST - Create Item**
```typescript
// POST /api/magazine/issues
export async function POST(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();
  if (!currentUser || !db) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const newIssue = await magazineServerService.createIssue(db, data);

  return NextResponse.json({ success: true, data: newIssue });
}
```

**PUT - Update Item**
```typescript
// PUT /api/magazine/issues/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // IMPORTANT: Always await params in Next.js 15
  const { db, currentUser } = await getAuthenticatedAppForUser();

  const data = await request.json();
  const updated = await magazineServerService.updateIssue(db, id, data);

  return NextResponse.json({ success: true, data: updated });
}
```

**DELETE - Remove Item**
```typescript
// DELETE /api/magazine/issues/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, currentUser } = await getAuthenticatedAppForUser();

  await magazineServerService.deleteIssue(db, id);
  return NextResponse.json({ success: true });
}
```

### Batch Upload Endpoint

```typescript
// POST /api/magazine/issues/batch
export async function POST(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();
  if (!currentUser || !db) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { issues } = await request.json();

  // Validate array
  if (!Array.isArray(issues)) {
    return NextResponse.json({ error: "Invalid request: issues must be an array" }, { status: 400 });
  }

  // Validate required fields
  for (let i = 0; i < issues.length; i++) {
    if (!issues[i].id) {
      return NextResponse.json({ error: `Issue ${i}: missing 'id'` }, { status: 400 });
    }
    if (!issues[i].title) {
      return NextResponse.json({ error: `Issue ${i}: missing 'title'` }, { status: 400 });
    }
  }

  // Delete existing and upload new
  const existing = await magazineServerService.getAllIssues(db, true);
  for (const item of existing) {
    await magazineServerService.deleteIssue(db, item.id);
  }

  const result = await magazineServerService.bulkUploadIssues(db, issues);

  // Return all issues
  const allIssues = await magazineServerService.getAllIssues(db, true);
  return NextResponse.json({ success: true, data: allIssues });
}
```

## Shared Components

### Centralized Icon System

**Location:** `/lib/pages/admin/components/shared/common/Icons.tsx`

All admin panel icons are centralized in a single file to ensure consistency and maintainability. **NEVER create inline SVG icons** - always use the centralized icon components.

#### Available Icons (24 total)

**Navigation Icons:**
- `HomeIcon` - Home/overview
- `GiftIcon` - Promotions/gifts
- `StarIcon` - Featured/ratings
- `UserGroupIcon` - Users/professionals
- `Bars3Icon` - Mobile menu (hamburger)
- `XMarkIcon` - Close/cancel
- `DocumentTextIcon` - Documents/magazine

**Action Icons:**
- `PlusIcon` - Add/create
- `EditIcon` - Edit
- `DeleteIcon` - Delete/remove
- `UploadIcon` - Upload files
- `RefreshIcon` - Refresh/reload

**Status Icons:**
- `EyeIcon` - Visible/show
- `EyeOffIcon` - Hidden/hide
- `WarningIcon` - Warning/alert
- `SuccessIcon` - Success/complete
- `ErrorIcon` - Error/failed

**Utility Icons:**
- `CodeIcon` - Code/TypeScript
- `ClipboardIcon` - Copy to clipboard
- `SpinnerIcon` - Loading (animated)
- `ChevronUpIcon` - Collapse/up arrow
- `CalendarIcon` - Date/calendar
- `DocumentIcon` - Empty state document
- `ArrowLeftIcon` - Back/previous

#### Usage

```typescript
// Import icons from centralized location
import { PlusIcon, EditIcon, DeleteIcon } from '@/lib/pages/admin/components/shared/common';

// Use in components
<button onClick={handleAdd}>
  <PlusIcon className="h-4 w-4" />
  Add Item
</button>

// With custom styling
<StarIcon className="h-4 w-4 text-yellow-400 fill-current" />

// Animated spinner
<SpinnerIcon /> {/* Already includes animate-spin */}
```

#### Icon Styling

All icons accept a `className` prop for customization:
- **Size**: `h-4 w-4`, `h-5 w-5`, `h-6 w-6`
- **Color**: `text-red-600`, `text-blue-500`, etc.
- **Fill**: `fill-current` (for StarIcon, etc.)
- **Spacing**: `mr-2`, `ml-2`, etc.

#### Adding New Icons

If you need a new icon:

1. **Add to Icons.tsx:**
```typescript
export const NewIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
  </svg>
);
```

2. **Icons are auto-exported** via `index.tsx`:
```typescript
// No need to update - uses export * from './Icons'
```

3. **Import and use:**
```typescript
import { NewIcon } from '@/lib/pages/admin/components/shared/common';
```

#### Best Practices

**✅ DO:**
- Use centralized icons from `Icons.tsx`
- Pass className for customization
- Use semantic icon names (EditIcon, not PencilIcon)
- Include size classes (h-4 w-4)

**❌ DON'T:**
- Create inline `<svg>` tags in components
- Duplicate icon definitions
- Hard-code colors in icon components
- Skip className prop

**Example - Correct:**
```typescript
import { EditIcon } from '@/lib/pages/admin/components/shared/common';

<button>
  <EditIcon className="h-4 w-4 text-blue-600" />
  Edit
</button>
```

**Example - Incorrect:**
```typescript
// ❌ DON'T DO THIS
<button>
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="..." />
  </svg>
  Edit
</button>
```

## Current Admin Pages

### 1. Professionals (`/admin/professionals`)
**Purpose:** Manage certified beauty professionals

**Fields:**
- Basic Info: name, title, specialty, location
- Certification: certificationLevel (Bronze/Silver/Gold/Platinum)
- Experience: yearsExperience
- Contact: instagram, email, phone, website
- Content: bio, description
- Images: profileImage
- Pricing: consultation, standard, premium
- Status: featured, isFounder

**Features:**
- Toggle featured status
- Location-based filtering (future)
- Certification level badges
- Rating display

**File Locations:**
- Page: `/app/admin/professionals/page.tsx`
- Tab: `/lib/pages/admin/components/professionals/ProfessionalsTab.tsx`
- Modal: `/lib/pages/admin/components/professionals/ProfessionalModal.tsx`
- API Hook: `/lib/pages/admin/components/professionals/useProfessionalsAPI.ts`
- Fields: `/lib/pages/admin/config/fields/professionals.ts`
- Display: `/lib/pages/admin/config/displayTables.ts` (professionalsDisplayConfig)

### 2. Promos (`/admin/promos`)
**Purpose:** Manage promotional campaigns

**Fields:**
- Basic Info: title, subtitle, description
- Media: image, link, ctaText
- Scheduling: startDate, endDate
- Display: popupDisplay, category
- Status: featured, visible
- Modal: modalType, customModalId

**Features:**
- Toggle featured status
- Toggle visibility
- Date range display
- Status badges (Active/Expired/Scheduled)

**File Locations:**
- Page: `/app/admin/promos/page.tsx`
- Tab: `/lib/pages/admin/components/promos/PromosTab.tsx`
- Modal: `/lib/pages/admin/components/promos/PromoModal.tsx`
- API Hook: `/lib/pages/admin/components/promos/usePromosAPI.ts`
- Fields: `/lib/pages/admin/config/fields/promos.ts`
- Display: `/lib/pages/admin/config/displayTables.ts` (promosDisplayConfig)

### 3. Digital Magazine (`/admin/digital`)
**Purpose:** Manage magazine issues metadata

**Fields (Displayed):**
- Identification: id (read-only), urlId
- Content: title, subtitle, issueNumber
- Scheduling: issueDate
- Description: description, editorNote
- Integration: publuuLink
- Computed: sectionCount (read-only, from sections array)

**Fields (Not Displayed):**
- sections - Managed in Magazine Editor (`/magazine/editor/`)
- All section content - Edited separately in dedicated editor
- PDF configurations - Managed in PDF generation tool

**Features:**
- Toggle featured status (only one featured at a time)
- Section count display (read-only)
- ID field disabled in edit modal
- Full magazine editing redirects to `/magazine/editor/`

**Important Notes:**
- This admin page is for METADATA ONLY
- Section editing happens in the dedicated Magazine Editor
- Each record in magazine_issues has large nested sections array
- Only relevant fields shown here to avoid overwhelming the UI

**File Locations:**
- Page: `/app/admin/digital/page.tsx`
- Tab: `/lib/pages/admin/components/digital/DigitalTab.tsx`
- Modal: `/lib/pages/admin/components/digital/DigitalModal.tsx`
- API Hook: `/lib/pages/admin/components/digital/useDigitalAPI.ts`
- Fields: `/lib/pages/admin/config/fields/digital.ts`
- Display: `/lib/pages/admin/config/displayTables.ts` (digitalDisplayConfig)
- API Endpoints: `/app/api/magazine/issues/route.ts`, `/app/api/magazine/issues/[id]/route.ts`, `/app/api/magazine/issues/batch/route.ts`

## Adding New Admin Pages

To create a new admin feature, follow the existing architecture pattern. Reference the current implementations (Professionals, Promos, Magazine) as examples.

### Architecture Overview

All admin pages follow this structure:
1. **Field Configuration** - Define form fields
2. **Display Configuration** - Define table columns
3. **API Hook** - Handle data operations
4. **Tab Component** - Main UI component
5. **Modal Component** - Create/edit modal
6. **Page Component** - Route wrapper
7. **API Endpoints** - Backend routes
8. **Navigation** - Add to admin layout

### Key Implementation Points

#### 1. Use Centralized Icons

**✅ Correct - Use centralized icons:**
```typescript
import { CalendarIcon } from '@/lib/pages/admin/components/shared/common';

// In navigation array:
{
  name: "Feature Name",
  href: "/admin/feature",
  icon: CalendarIcon,
  current: pathname === "/admin/feature"
}
```

**❌ Incorrect - Don't create inline SVGs:**
```typescript
// DON'T DO THIS
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="..." />
  </svg>
);
```

#### 2. Follow Naming Conventions

- **Fields**: `[feature]EditFields`, `getDefault[Feature]Values`
- **Display**: `[feature]DisplayConfig`
- **Hook**: `use[Feature]API`
- **Components**: `[Feature]Tab`, `[Feature]Modal`
- **Types**: Follow existing pattern in `/lib/pages/admin/types/`

#### 3. API Authentication

Always include `credentials: 'include'` for authenticated requests:

```typescript
const response = await fetch('/api/admin/feature', {
  credentials: 'include'  // Required for auth cookies
});
```

#### 4. Reference Existing Implementations

**Best examples to follow:**

- **Professionals** (`/lib/pages/admin/components/professionals/`)
  - Complex fields (rating, certifications, images)
  - Multiple action buttons
  - Custom data transformations

- **Promos** (`/lib/pages/admin/components/promos/`)
  - Date ranges
  - Status badges
  - Visibility toggles

- **Magazine** (`/lib/pages/admin/components/magazine/`)
  - Computed fields (section count)
  - Read-only fields
  - External editor integration

## Field Type Reference

Complete reference for all supported field types:

### Text Input
```typescript
{ name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter title...', helperText: 'Brief description' }
```

### Textarea
```typescript
{ name: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Enter description...' }
```

### Number
```typescript
{ name: 'price', label: 'Price', type: 'number', min: 0, max: 10000, step: 0.01 }
```

### Date
```typescript
{ name: 'eventDate', label: 'Event Date', type: 'date', required: true }
```

### Select/Dropdown
```typescript
{
  name: 'category',
  label: 'Category',
  type: 'select',
  options: [
    { value: 'workshop', label: 'Workshop' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'conference', label: 'Conference' }
  ],
  required: true
}
```

### Checkbox
```typescript
{ name: 'featured', label: 'Featured Event', type: 'checkbox' }
```

### Image Upload
```typescript
{ name: 'coverImage', label: 'Cover Image', type: 'image', helperText: 'Upload event banner (1200x630 recommended)' }
```

### Array/List
```typescript
{ name: 'tags', label: 'Tags', type: 'array', itemType: 'text', placeholder: 'Add tag...' }
```

### Disabled (Read-only)
```typescript
{ name: 'id', label: 'Event ID', type: 'text', disabled: true }
```

## Best Practices

### 1. Field Configuration
- Always define fields in `/config/fields/[feature].ts`
- Use clear, descriptive labels
- Include helper text for complex fields
- Set appropriate validation (required, min, max)
- Use disabled for read-only fields (like IDs in edit mode)

### 2. API Hooks
- Always use `credentials: 'include'` for authenticated requests
- Handle loading, error, and success states
- Use optimistic updates for better UX
- Provide clear error messages

### 3. Component Organization
- Keep Tab components focused on UI logic
- Move data operations to API hooks
- Use modals for create/edit operations
- Separate concerns (data, UI, business logic)

### 4. State Management
- Local state for UI (modal visibility)
- API hook state for data
- Avoid prop drilling - use hooks

### 5. Error Handling
- Display errors prominently to users
- Log errors to console for debugging
- Provide actionable error messages
- Handle edge cases gracefully

### 6. Performance
- Use `useCallback` for expensive functions
- Memoize computed values if needed
- Lazy load heavy components
- Paginate large datasets

## Common Patterns

### Computed Fields (e.g., Section Count)
```typescript
const issuesWithSectionCount = issues.map(issue => ({
  ...issue,
  sectionCount: issue.sections?.length || 0
}));
```

### Confirmation Dialogs
```typescript
const handleDeleteWithConfirm = async (item) => {
  if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
  await deleteItem(item.id);
};
```

### Default Values
```typescript
export const getDefaultDigitalValues = () => {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0];

  return {
    id: dateString,
    title: '',
    issueNumber: 1,
    issueDate: dateString,
    featured: false,
    visible: true
  };
};
```

### Toggle Operations
```typescript
const toggleFeatured = async (item) => {
  await fetch(`/api/items/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ featured: !item.featured })
  });

  setItems(prev => prev.map(i => i.id === item.id ? { ...i, featured: !i.featured } : i));
};
```

## Troubleshooting

### Issue: "File has not been read yet"
**Cause:** Trying to write to a file without reading it first
**Solution:** Use Glob to check if file exists, then Read before Write

### Issue: Table not updating after create/update
**Cause:** State not being updated in API hook
**Solution:** Ensure `setItems()` is called after successful API operation

### Issue: Modal fields not showing
**Cause:** Field configuration mismatch
**Solution:** Verify field names match between config and data structure

### Issue: "Unauthorized" on API calls
**Cause:** Missing `credentials: 'include'` in fetch
**Solution:** Add `credentials: 'include'` to all fetch calls

### Issue: Featured toggle not working
**Cause:** Wrong endpoint or missing data
**Solution:** Check endpoint uses PUT with correct ID and body

## Summary

The admin panel follows a consistent, modular architecture:

1. **Field Configs** define what fields are available
2. **Display Configs** define how data is shown in tables
3. **API Hooks** handle all data operations
4. **Tab Components** orchestrate UI and user interactions
5. **Modal Components** provide create/edit interfaces
6. **Page Components** wrap everything with authentication

This architecture provides:
- **Consistency** across all admin pages
- **Reusability** of components and patterns
- **Maintainability** through clear separation of concerns
- **Scalability** - easy to add new admin pages
- **Type Safety** with TypeScript throughout

By following these patterns, new admin features can be added quickly while maintaining code quality and user experience.
