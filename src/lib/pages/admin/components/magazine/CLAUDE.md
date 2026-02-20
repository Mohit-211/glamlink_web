# Magazine Admin Module

This document provides technical documentation for the Magazine administration system located at `/lib/pages/admin/components/magazine/`.

---

## Overview

The Magazine Admin Module provides a complete content management system for magazine issues. It supports:

- **Issue Management** - Create, edit, delete, and batch upload magazine issues
- **Section Editing** - Manage individual sections within issues (web editor)
- **Digital Page Editor** - Visual page editor with PDF generation capabilities

---

## File Structure

```
lib/pages/admin/components/magazine/
├── CLAUDE.md                    # This documentation
├── MagazineTab.tsx              # Main tab component (entry point)
├── MagazineSections.tsx         # Sections list for an issue
├── MagazineModal.tsx            # Issue create/edit modal
├── useMagazineAPI.ts            # API hook for CRUD operations
├── useMagazineTab.ts            # Tab logic with Redux + filtering
│
├── digital/                     # Digital Page Editor (see digital/CLAUDE.md)
│   ├── CLAUDE.md               # Detailed digital editor documentation
│   ├── MagazineDigitalPages.tsx # Entry point for digital pages
│   ├── DigitalPageCard.tsx     # Page card with selection
│   ├── DigitalSectionEditor.tsx # Section editor component
│   ├── editor/                 # Full editor system
│   ├── hooks/                  # Shared hooks
│   ├── pdf-manager/            # Combined PDF generation
│   └── lib/                    # Utilities and services
│
└── web/                         # Web Section Editor
    ├── WebSectionEditor.tsx    # Editor component (placeholder)
    ├── MagazineSectionEditor.tsx # Section editor
    └── preview/                # Section preview components
        ├── CoverPreview.tsx
        ├── EditorsNotePreview.tsx
        ├── TableOfContentsPreview.tsx
        ├── index.ts
        └── types.ts
```

---

## Core Components

### MagazineTab.tsx

**File:** `MagazineTab.tsx`

The main entry point component that renders the magazine issues table and handles view switching.

```typescript
export default function MagazineTab() {
  // Uses useMagazineTab for data + filtering
  const {
    issues,
    filteredIssues,
    isLoading,
    error,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleFeatured,
    batchUpload,
    // ... filtering state
  } = useMagazineTab();

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MagazineIssue | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);
  const [digitalIssue, setDigitalIssue] = useState<MagazineIssue | null>(null);
  // ...
}
```

**View States:**
1. **Default** - Shows issue table with CRUD actions
2. **Sections View** - When `selectedIssue` is set, renders `MagazineSections`
3. **Digital View** - When `digitalIssue` is set, renders `MagazineDigitalPages`

**Navigation Flow:**
```
MagazineTab (Issues Table)
    ├── Edit Sections → MagazineSections (Sections Table)
    │   └── Edit Section → WebSectionEditor
    │
    └── Digital Pages → MagazineDigitalPages (Digital Pages)
        ├── Edit Page → DigitalPageEditor
        └── Manage PDFs → PDFManager
```

### MagazineSections.tsx

**File:** `MagazineSections.tsx`

Displays sections for a specific magazine issue and handles section editing.

```typescript
interface MagazineSectionsProps {
  issueId: string;
  issueTitle: string;
  issue: any;
  onBack: () => void;
}
```

**Features:**
- Lists all sections for an issue using `useSectionsRedux`
- Opens `WebSectionEditor` for editing
- Supports batch upload of sections
- Delete with confirmation

### MagazineModal.tsx

**File:** `MagazineModal.tsx`

Modal component for creating and editing magazine issues.

**Props:**
- `isOpen` - Modal visibility
- `onClose` - Close handler
- `onSave` - Save handler receiving issue data
- `title` - Modal title
- `initialData` - Pre-populated form data
- `customTabs` - Tab configuration from `magazineModalTabs`

---

## Hooks

### useMagazineAPI.ts

**File:** `useMagazineAPI.ts`

Core API hook for magazine issue CRUD operations.

```typescript
export interface UseMagazineAPIReturn {
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

**API Endpoints Used:**
- `GET /api/magazine/issues?includeHidden=true` - Fetch all issues
- `POST /api/magazine/issues` - Create issue
- `PUT /api/magazine/issues/{id}` - Update issue
- `DELETE /api/magazine/issues/{id}` - Delete issue
- `POST /api/magazine/issues/batch` - Batch upload

**Key Implementation Details:**
```typescript
// Always include credentials for authentication
const response = await fetch('/api/magazine/issues?includeHidden=true', {
  credentials: 'include'
});

// API returns array directly (not wrapped in { success, data })
if (Array.isArray(data)) {
  setIssues(data);
}
```

### useMagazineTab.ts

**File:** `useMagazineTab.ts`

Combines Redux data with local filtering logic.

```typescript
export interface UseMagazineTabReturn {
  // Data from Redux
  issues: MagazineIssue[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;

  // Filtered/computed data
  filteredIssues: MagazineIssueWithSectionCount[];
  inactiveCount: number;

  // Filter state
  showActiveOnly: boolean;
  setShowActiveOnly: (value: boolean) => void;
  dateFilter: DateFilterState;
  setDateFilter: (filter: DateFilterState) => void;

  // Operations (from Redux)
  fetchIssues: () => Promise<void>;
  createIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  // ... other operations
}
```

**Filtering Capabilities:**
- **Active Filter** - Toggle to show only active issues (default: true)
- **Date Filter** - Filter by issue date (all, week, month, custom range)
- **Section Count** - Computed field showing number of sections per issue

**Architecture Pattern:**
```
useMagazineRedux (Redux layer - data + caching)
    ↓
useMagazineTab (Presentation layer - filtering + UI state)
    ↓
MagazineTab (Component - rendering + user interactions)
```

---

## Web Section Editor

### WebSectionEditor.tsx

**File:** `web/WebSectionEditor.tsx`

Editor component for web magazine sections. Currently a placeholder for future implementation.

```typescript
interface WebSectionEditorProps {
  section: any;
  issueId: string;
  issueTitle: string;
  onBack: () => void;
}
```

### Preview Components

**Location:** `web/preview/`

Preview components for different section types:

| Component | Purpose |
|-----------|---------|
| `CoverPreview.tsx` | Magazine cover section preview |
| `EditorsNotePreview.tsx` | Editor's note section preview |
| `TableOfContentsPreview.tsx` | Table of contents preview |
| `types.ts` | Shared types for previews |
| `index.ts` | Centralized exports |

---

## Digital Page Editor

For comprehensive documentation of the Digital Page Editor system, see:

**[digital/CLAUDE.md](./digital/CLAUDE.md)**

The digital system includes:
- Visual page editor with 17+ layout types
- Real-time preview with html2canvas
- PDF generation with jsPDF
- Footer configuration (page numbers, magazine title, URL)
- Combined multi-page PDF generation
- Firebase Storage integration for canvas images

---

## Configuration

### Display Configuration

**File:** `/lib/pages/admin/config/displayTables.ts`

```typescript
export const magazineDisplayConfig: DisplayTableConfig = {
  id: { label: 'Issue ID', type: 'text', width: '120px' },
  title: { label: 'Title', type: 'text', width: '200px' },
  sectionCount: { label: 'Sections', type: 'text', width: '100px' },
  featured: {
    label: 'Featured',
    type: 'toggleWithIcon',
    trueLabel: '⭐',
    falseLabel: '☆',
    // ...
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete', 'editSections', 'digitalView'],
    // ...
  }
};

export const sectionsDisplayConfig: DisplayTableConfig = {
  // Section table columns...
};
```

### Field Configuration

**File:** `/lib/pages/admin/config/fields/magazine.ts`

- `magazineEditFields` - Issue form fields
- `getDefaultMagazineValues()` - Default values for new issues
- `magazineModalTabs` - Tab configuration for issue modal

---

## API Endpoints

### Magazine Issues

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/magazine/issues` | List all issues |
| GET | `/api/magazine/issues?includeHidden=true` | List including hidden |
| POST | `/api/magazine/issues` | Create issue |
| PUT | `/api/magazine/issues/{id}` | Update issue |
| DELETE | `/api/magazine/issues/{id}` | Delete issue |
| POST | `/api/magazine/issues/batch` | Batch upload |

### Sections

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/magazine/sections?issueId={id}` | Get sections for issue |
| DELETE | `/api/magazine/sections/{id}` | Delete section |
| POST | `/api/magazine/sections/batch?issueId={id}` | Batch upload sections |

### Digital Pages

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/digital-pages?issueId={id}` | Get digital pages |
| POST | `/api/digital-pages` | Create page |
| PUT | `/api/digital-pages/{id}` | Update page |
| DELETE | `/api/digital-pages/{id}` | Delete page |
| POST | `/api/digital-pages/upload-canvas` | Upload canvas image |

---

## Redux Integration

The magazine system uses Redux for centralized state management:

### useMagazineRedux

**File:** `/lib/pages/admin/hooks/useMagazineRedux.ts`

Manages magazine issues data with caching:
- Auto-fetches on mount
- Caches data with `lastUpdated` timestamp
- Provides all CRUD operations
- Integrated with Redux store

### useSectionsRedux

**File:** `/lib/pages/admin/hooks/useSectionsRedux.ts`

Manages sections for a specific issue:
- Takes `issueId` parameter
- Fetches sections from API
- Provides section operations

### useDigitalPagesRedux

**File:** `/lib/pages/admin/hooks/useDigitalPagesRedux.ts`

Manages digital pages for a specific issue:
- Takes `issueId` parameter
- Fetches digital pages from API
- Provides page CRUD operations

---

## Data Flow

### Issue Operations

```
User Action (Add/Edit/Delete)
    ↓
MagazineTab (UI Handler)
    ↓
useMagazineTab (delegates to Redux)
    ↓
useMagazineRedux (API call + state update)
    ↓
API Endpoint (/api/magazine/issues)
    ↓
Firestore (magazine_issues collection)
    ↓
Redux State Update
    ↓
UI Re-render
```

### View Navigation

```
Issues Table
    │
    ├── [Edit Sections] → MagazineSections
    │   │
    │   └── [Edit] → WebSectionEditor
    │
    └── [Digital Pages] → MagazineDigitalPages
        │
        ├── [Edit] → DigitalPageEditor
        │   └── [Generate PDF] → Single page PDF
        │
        └── [Manage PDFs] → PDFManager
            └── [Generate Combined PDF] → Multi-page PDF
```

---

## Types

### MagazineIssue

**File:** `/lib/pages/magazine/types/magazine/core.ts`

```typescript
interface MagazineIssue {
  id: string;
  urlId?: string;
  title: string;
  subtitle?: string;
  issueNumber: number;
  issueDate: string;
  coverImage?: string;
  featured: boolean;
  visible?: boolean;
  isActive?: boolean;
  sections?: MagazineIssueSection[];
  editorNote?: string;
  description?: string;
  publuuLink?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### MagazineIssueWithSectionCount

**File:** `useMagazineTab.ts`

```typescript
interface MagazineIssueWithSectionCount extends MagazineIssue {
  sectionCount: number;
  isActive?: boolean;
}
```

---

## Best Practices

### API Calls

Always include credentials for authentication:

```typescript
const response = await fetch('/api/magazine/issues', {
  credentials: 'include',  // Required for auth cookies
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### Error Handling

Handle API errors with user feedback:

```typescript
try {
  await deleteIssue(issue.id);
} catch (error) {
  console.error('Failed to delete:', error);
  setError('Failed to delete issue');
}
```

### Confirmation Dialogs

Use for destructive actions:

```typescript
const handleDeleteWithConfirm = async (issue: MagazineIssue) => {
  if (!confirm(`Delete "${issue.title}"? This cannot be undone.`)) return;
  await deleteIssue(issue.id);
};
```

---

## Summary

The Magazine Admin Module provides:

1. **Issue Management** - Full CRUD with batch upload via `MagazineTab`
2. **Section Management** - Per-issue sections via `MagazineSections`
3. **Digital Page Editor** - Visual editor with PDF generation (see `digital/CLAUDE.md`)
4. **Redux Integration** - Centralized state with caching
5. **Filtering** - Active/date filters for issue list

Key files:
- `MagazineTab.tsx` - Main entry point
- `useMagazineTab.ts` - Combined hook with filtering
- `useMagazineAPI.ts` - Core API operations
- `digital/` - Complete digital page editing system
- `web/` - Web section editing (placeholder)
