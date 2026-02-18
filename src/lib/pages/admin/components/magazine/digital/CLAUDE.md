# Digital Page Editor System

This document explains the Digital Page Editor architecture, file structure, hook logic, and how it generates canvases and PDFs.

---

## Overview

The Digital Page Editor provides a visual interface for creating magazine-style pages with various layouts. Users can:
- Select from multiple page layout types
- Edit content via forms or JSON
- Preview the page in real-time with accurate PDF dimensions
- Configure page footers with page numbers, magazine title, and website URL
- Generate and download individual PDFs
- Generate combined multi-page PDFs

---

## Complete File Structure

```
lib/pages/admin/components/magazine/digital/
├── CLAUDE.md                        # This documentation
├── index.ts                         # Main exports
├── DigitalPageCard.tsx              # Page card component with selection support
├── DigitalSectionEditor.tsx         # Section editor component
├── MagazineDigitalPages.tsx         # Main entry point for digital pages
│
├── editor/
│   ├── index.tsx                    # Exports DigitalPageEditor
│   ├── DigitalPageEditor.tsx        # Main editor component
│   ├── useDigitalPageEditor.ts      # Main editor hook (317 lines)
│   ├── DigitalPageCanvas.tsx        # Preview wrapper with PDF dimensions
│   ├── types.ts                     # TypeScript types including FooterSettings
│   │
│   ├── header/
│   │   ├── index.ts                 # Header exports
│   │   ├── MainHeader.tsx           # Main header with action buttons
│   │   ├── PageNavigation.tsx       # Page navigation (prev/next)
│   │   └── useHeader.ts             # Navigation and save logic (316 lines)
│   │
│   ├── page-creator/
│   │   ├── PageCreator.tsx          # Form/JSON editing panel
│   │   ├── usePageCreator.ts        # Page creator logic (145 lines)
│   │   └── form/
│   │       ├── CanvasEditor.tsx     # Canvas editing component
│   │       └── useCanvasEditor.ts   # Canvas editor logic
│   │
│   ├── pdf-config/
│   │   └── PdfConfigPanel.tsx       # PDF settings (ratio, background, footer)
│   │
│   ├── preview/
│   │   ├── DigitalPreview.tsx       # Canvas preview states and regenerate buttons
│   │   ├── footers/
│   │   │   ├── index.tsx            # Footer exports
│   │   │   └── FooterPreview.tsx    # Footer display component
│   │   └── designs/
│   │       ├── index.tsx            # Design exports
│   │       ├── ArticleImageCenterWithQuotePreview.tsx
│   │       ├── ArticleImagesDiagonalPreview.tsx
│   │       ├── ArticleStartHeroPreview.tsx
│   │       ├── ArticleTwoColumnTextPreview.tsx
│   │       ├── ArticleTwoImagesTopPreview.tsx
│   │       ├── FullPageImage.tsx
│   │       ├── FullPageImagePreview.tsx
│   │       ├── ImageCenteredWithBorderPreview.tsx
│   │       ├── ImageWithCaptionPreview.tsx
│   │       ├── ImageWithCornerCaptionPreview.tsx
│   │       ├── ImageWithTitlePreview.tsx
│   │       ├── ImageWithTwoCaptionsPreview.tsx
│   │       ├── TwoColumnWithQuotePreview.tsx
│   │       └── util/
│   │           ├── previewHelpers.tsx   # Helper functions for previews
│   │           └── usePageData.ts       # Hooks for extracting page data (569 lines)
│   │
│   └── util-pdf-canvas/
│       ├── useCanvasPreview.tsx     # Canvas generation with footer (329 lines)
│       └── useDigitalPagePdf.ts     # PDF generation from canvas (177 lines)
│
├── hooks/
│   ├── index.ts                     # Hook exports
│   ├── useCanvasGeneration.tsx      # Canvas generation utilities
│   ├── useImageProcessor.ts         # Image processing utilities
│   └── usePdfGeneration.ts          # PDF generation utilities
│
├── pdf-manager/
│   ├── index.tsx                    # Exports PDFManager
│   ├── PDFManager.tsx               # PDF management with selection + combined PDF
│   ├── SectionCard.tsx              # Section card component
│   └── hooks/
│       └── useCombinedPdf.ts        # Combined multi-page PDF generation (176 lines)
│
└── lib/
    ├── index.ts                     # Lib exports
    ├── components/
    │   ├── index.ts
    │   ├── MagazinePageContentDownload.tsx
    │   └── MagazinePageViewDownload.tsx
    ├── services/
    │   ├── index.ts
    │   ├── pdfConfigurationService.ts   # Configuration persistence
    │   └── pdfGenerationService.ts      # PDF generation service
    ├── types/
    │   └── index.ts                     # Additional types
    └── utils/
        ├── config/
        │   └── sectionPageConfig.ts     # Section page configuration
        └── pdf/
            ├── index.ts
            ├── calculatePageInfo.ts     # Page calculation utilities
            ├── canvasToPdfConverter.ts  # Canvas to PDF conversion
            └── generatePDFFromCanvas.ts # PDF generation from canvas
```

---

## Hook Documentation

### 1. useDigitalPageEditor (Main Editor Hook)

**File:** `editor/useDigitalPageEditor.ts`

The central hook that orchestrates all editor functionality.

```typescript
interface UseDigitalPageEditorParams {
  issueId: string;
  initialPages: DigitalPage[];
  initialPageIndex?: number;
  onBack: () => void;
}

interface UseDigitalPageEditorReturn {
  // Page state
  localPages: DigitalPage[];
  currentPageIndex: number;
  currentPage: DigitalPage | null;
  showEmptyState: boolean;

  // Editor state
  pageData: Partial<DigitalPageData>;
  pageType: DigitalPageType;
  pdfSettings: PagePdfSettings;
  showPdfConfig: boolean;
  setShowPdfConfig: (show: boolean) => void;
  previewScale: number;
  setPreviewScale: (scale: number) => void;
  hasUnsavedChanges: boolean;

  // Canvas state
  canvasRef: React.RefObject<HTMLDivElement>;
  canvasDataUrl: string | null;
  isGeneratingPreview: boolean;
  previewProgress: string;
  previewError: string | null;

  // PDF state
  isGeneratingPdf: boolean;
  pdfProgress: string;
  pdfError: string | null;

  // CRUD state
  isSaving: boolean;

  // Navigation handlers
  goToPrevPage: () => void;
  goToNextPage: () => void;
  handleBack: () => void;
  handleAddPage: () => Promise<void>;
  handleSavePage: () => Promise<void>;

  // Editor handlers
  handleDataChange: (data: Partial<DigitalPageData>) => void;
  handlePageTypeChange: (newType: DigitalPageType) => void;
  handlePdfSettingsChange: (settings: PagePdfSettings) => void;
  handleGeneratePreview: () => Promise<void>;
  handleGenerateExample: () => Promise<void>;
  handleGeneratePdf: () => Promise<void>;
}
```

**Key responsibilities:**
- Manages multi-page state with `localPages` array
- Integrates with Redux via `useDigitalPagesRedux`
- Coordinates `useDigitalPagePdf`, `useCanvasPreview`, and `useHeader` hooks
- Handles page navigation, data changes, and PDF generation
- Syncs editor state when page index changes

---

### 2. useHeader (Navigation & Save Logic)

**File:** `editor/header/useHeader.ts`

Handles navigation between pages and save operations.

```typescript
interface UseHeaderParams {
  localPages: DigitalPage[];
  setLocalPages: React.Dispatch<React.SetStateAction<DigitalPage[]>>;
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>;
  pageData: Partial<DigitalPageData>;
  pageType: DigitalPageType;
  pdfSettings: PagePdfSettings;
  canvasDataUrl?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  issueId: string;
  onBack: () => void;
  createPage: (data: any) => Promise<DigitalPage>;
  updatePage: (data: any) => Promise<void>;
}

interface UseHeaderReturn {
  goToPrevPage: () => void;
  goToNextPage: () => void;
  handleBack: () => void;
  handleAddPage: () => Promise<void>;
  handleSavePage: () => Promise<void>;
}
```

**Key features:**
- `goToPrevPage` / `goToNextPage`: Navigate with unsaved changes warning
- `handleSavePage`: Uploads canvas to Firebase Storage, then saves page to Firestore
- `handleAddPage`: Creates new page with default settings
- Uses `uploadCanvasToStorage` helper to convert base64 to Firebase URL

---

### 3. usePageCreator (Form Editing Logic)

**File:** `editor/page-creator/usePageCreator.ts`

Manages the page creator panel state and form handling.

```typescript
interface UsePageCreatorParams {
  initialData?: Partial<DigitalPageData>;
  initialPageType?: DigitalPageType;
  onDataChange: (data: Partial<DigitalPageData>) => void;
  onPageTypeChange: (pageType: DigitalPageType) => void;
}

interface UsePageCreatorReturn {
  activeTab: EditorTab;  // 'form' | 'json' | 'canvas'
  setActiveTab: (tab: EditorTab) => void;
  selectedPageType: DigitalPageType;
  formKey: number;
  previewConfig: ReturnType<typeof getDigitalPreviewComponent>;
  fields: FieldConfig[];
  mergedInitialData: Partial<DigitalPageData>;
  handlePageTypeChange: (newType: DigitalPageType) => void;
  handleFieldChange: (name: string, value: any, data: Partial<DigitalPageData>) => void;
  handleJsonApply: (data: Partial<DigitalPageData>) => void;
}
```

**Key features:**
- Manages form vs JSON vs canvas editing tabs
- Syncs internal state when props change (page navigation)
- Gets field configuration from `digitalPreviewComponents` registry
- Merges initial data with defaults for the selected page type

---

### 4. useCanvasPreview (Canvas Generation)

**File:** `editor/util-pdf-canvas/useCanvasPreview.tsx`

Generates preview images using html2canvas with footer support.

```typescript
interface GeneratePreviewOptions {
  pageNumber?: number;
  totalPages?: number;
}

interface UseCanvasPreviewReturn {
  canvasDataUrl: string | null;
  canvasWidth: number;
  canvasHeight: number;
  isGenerating: boolean;
  progress: string;
  error: string | null;
  generatePreview: (
    pageData: Partial<DigitalPageData>,
    pageType: DigitalPageType,
    pdfSettings: PagePdfSettings,
    options?: GeneratePreviewOptions
  ) => Promise<CanvasPreviewResult | null>;
  clearPreview: () => void;
  setPreviewFromUrl: (url: string | undefined, width?: number, height?: number) => void;
}
```

**Generation process:**
1. Get preview component from registry
2. Calculate PDF pixel dimensions (at 96 DPI)
3. Create off-screen container at PDF dimensions
4. Render React preview component with FooterPreview if enabled
5. Process images (proxy Firebase URLs, convert to base64)
6. Capture with html2canvas at 2x scale
7. Return data URL for display

---

### 5. useDigitalPagePdf (PDF Generation)

**File:** `editor/util-pdf-canvas/useDigitalPagePdf.ts`

Generates single-page PDFs from canvas data URLs.

```typescript
interface UseDigitalPagePdfReturn {
  generatePdf: (
    canvasDataUrl: string,
    fileName: string,
    pdfSettings: PagePdfSettings
  ) => Promise<PdfGenerationResult>;
  isGenerating: boolean;
  progress: string;
  error: string | null;
}
```

**Generation process:**
1. Validate canvas data URL
2. Get PDF dimensions from settings
3. Load canvas as image
4. Create jsPDF with correct dimensions
5. Add image at full page size (no margin)
6. Save PDF file

---

### 6. useCombinedPdf (Multi-Page PDF)

**File:** `pdf-manager/hooks/useCombinedPdf.ts`

Generates combined PDFs from multiple page canvases.

```typescript
interface UseCombinedPdfReturn {
  generateCombinedPdf: (pages: DigitalPage[], fileName: string) => Promise<void>;
  isGenerating: boolean;
  progress: string;
  error: string | null;
}
```

**Generation process:**
1. Sort pages by pageNumber
2. Filter pages with canvasDataUrl
3. Create jsPDF with first page dimensions
4. For each page:
   - Get page-specific dimensions
   - Add new page (except first)
   - Load canvas image (proxy Firebase URLs)
   - Add image to PDF
5. Save as `glamlink-edit-{issueId}.pdf`

---

### 7. usePageData Hooks (Preview Data Extraction)

**File:** `editor/preview/designs/util/usePageData.ts`

Collection of hooks for extracting and processing props for each preview component.

| Hook | Purpose |
|------|---------|
| `useFullPageImageProps` | Full page image data |
| `useImageCenteredWithBorderProps` | Centered image with border styling |
| `useImageWithTitleProps` | Image with title/subtitle styling |
| `useImageWithCornerCaptionProps` | Corner caption positioning |
| `useImageWithTwoCaptionsProps` | Two caption boxes styling |
| `useImageWithCaptionProps` | Layout and background styles |
| `useArticleStartHeroProps` | Hero article with drop cap |
| `useTwoColumnWithQuoteProps` | Two-column with pull quote |
| `useArticleTwoColumnTextProps` | Two-column article text |
| `useArticleTwoImagesTopProps` | Article with top images |
| `useArticleImageCenterWithQuoteProps` | Centered image article |
| `useArticleImagesDiagonalProps` | Diagonal image layout |

Each hook extracts:
- Image URLs with object-fit and position
- Background colors and gradients
- Typography styles
- Layout-specific options

---

## Key Types

**File:** `editor/types.ts`

```typescript
// Page type identifier
type DigitalPageType =
  | 'image-with-caption'
  | 'full-page-image'
  | 'full-bleed-image'
  | 'text-only'
  | 'split-layout'
  | 'two-column'
  | 'gallery-grid'
  | 'image-with-title'
  | 'two-column-with-quote'
  | 'article-start-hero'
  | 'image-centered-with-border'
  | 'article-two-images-top'
  | 'article-images-diagonal'
  | 'article-image-center-with-quote'
  | 'article-two-column-text'
  | 'image-with-corner-caption'
  | 'image-with-two-captions';

// PDF ratio types
type PdfRatioType =
  | 'a4-portrait'
  | 'a4-landscape'
  | '16:9'
  | '4:3'
  | 'square'
  | 'custom';

// Page number format for footer
type PageNumberFormat = 'page-x' | 'x' | 'x-of-y';

// Footer settings
interface FooterSettings {
  enabled: boolean;
  showPageNumber: boolean;
  pageNumberFormat: PageNumberFormat;
  showMagazineTitle: boolean;      // "The Glamlink Edit"
  showWebsiteUrl: boolean;         // "glamlink.net"
  alignment: 'left' | 'right';
  magazineTitleColor: string;      // Default: #14b8a6 (glamlink-teal)
  fontSize: number;                // Default: 10
  marginBottom: number;            // Distance from bottom in mm
}

// PDF settings with optional footer
interface PagePdfSettings {
  ratio: PdfRatioType;
  customWidth?: number;
  customHeight?: number;
  backgroundColor: string;
  margin: number;
  footer?: FooterSettings;
}

// Page data structure
interface DigitalPageData {
  id: string;
  type: DigitalPageType;
  title: string;
  subtitle?: string;
  image?: string | ImageObject;
  backgroundColor?: string;
  // ... 50+ layout-specific fields
}

// Firestore document structure
interface DigitalPage {
  id: string;
  issueId: string;
  pageNumber: number;
  pageType: DigitalPageType;
  pageData: Partial<DigitalPageData>;
  pdfSettings: PagePdfSettings;
  canvasDataUrl?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  hasCanvas: boolean;
  title?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}
```

---

## Footer System

### Footer Configuration UI

**File:** `editor/pdf-config/PdfConfigPanel.tsx`

The PdfConfigPanel includes a "Footer Settings" section with:
- Enable/disable toggle
- Page number checkbox with format selection (Page X, X, X of Y)
- Magazine title checkbox ("The Glamlink Edit")
- Website URL checkbox (glamlink.net)
- Alignment buttons (left/right)
- Title color picker with reset to glamlink-teal (#14b8a6)
- Font size slider (8-14px)
- Bottom margin slider (5-20mm)

### Footer Rendering

**File:** `editor/preview/footers/FooterPreview.tsx`

```typescript
interface FooterPreviewProps {
  settings: FooterSettings;
  pageNumber: number;
  totalPages?: number;
}
```

The footer is automatically included in canvas generation when enabled.

---

## PDF Manager & Combined PDF

### PDFManager Component

**File:** `pdf-manager/PDFManager.tsx`

Features:
- Grid display of all digital pages with canvas thumbnails
- Selection checkboxes for pages with generated canvases
- "Select All" / "Deselect All" toggle
- "Generate Combined PDF" button
- Progress indicator during generation
- Summary footer showing canvas status

### DigitalPageCard Selection

**File:** `DigitalPageCard.tsx`

```typescript
interface DigitalPageCardProps {
  page: DigitalPage;
  issueId: string;
  onEdit?: (page: DigitalPage) => void;
  isSelected?: boolean;
  onSelectionChange?: (pageId: string, selected: boolean) => void;
  showSelection?: boolean;
}
```

Selection features:
- Checkbox in card header (only for pages with canvas)
- Visual highlight when selected (indigo border + ring)

---

## Firebase Image Handling

Firebase Storage images require proxying due to CORS:

```typescript
// In useCanvasPreview.tsx
const IMAGE_PROXY_ENDPOINT = '/api/magazine/image-proxy';

if (originalSrc.includes('firebasestorage.googleapis.com')) {
  fetchUrl = `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(originalSrc)}`;
}
```

Canvas uploads use a dedicated API endpoint:

```typescript
// In useHeader.ts
const response = await fetch('/api/digital-pages/upload-canvas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    canvasDataUrl: dataUrl,
    issueId,
    pageId,
    pageNumber,
  }),
});
```

---

## Adding New Page Types

To add a new page type:

1. **Create Preview Component** in `editor/preview/designs/`
   ```typescript
   export default function MyNewLayoutPreview({ pageData, pdfSettings }) {
     return <div>...</div>;
   }
   ```

2. **Add Data Hook** in `editor/preview/designs/util/usePageData.ts`
   ```typescript
   export function useMyNewLayoutProps(pageData, pdfSettings) {
     return { /* extracted props */ };
   }
   ```

3. **Add Field Configuration** in `config/fields/digital.ts`
   ```typescript
   export const myNewLayoutFields: FieldConfig[] = [...];
   export const getDefaultMyNewLayout = () => ({ type: 'my-new-layout', ... });
   ```

4. **Export from designs/index.tsx**
   ```typescript
   export { default as MyNewLayoutPreview } from './MyNewLayoutPreview';
   ```

5. **Register in digitalPreviewComponents.ts**
   ```typescript
   {
     id: 'my-new-layout',
     label: 'My New Layout',
     component: MyNewLayoutPreview,
     fields: myNewLayoutFields,
     getDefaultData: getDefaultMyNewLayout,
   }
   ```

6. **Add to DigitalPageType** in `editor/types.ts`
   ```typescript
   type DigitalPageType = ... | 'my-new-layout';
   ```

---

## Summary

The Digital Page Editor system provides:

1. **Modular Architecture** - Each layout type is a separate component with dedicated data hooks
2. **Live Preview** - Real-time preview with accurate PDF dimensions using html2canvas
3. **Flexible Editing** - Form-based or JSON editing with type switching
4. **PDF Generation** - High-quality PDF output with Firebase image proxy support
5. **Extensibility** - Easy to add new layout types via the registry pattern
6. **Configurable Footer** - Page numbers, magazine title, and website URL
7. **Combined PDF Export** - Generate multi-page PDFs from selected pages
8. **Redux Integration** - Centralized state management via `useDigitalPagesRedux`
9. **Firebase Storage** - Automatic canvas upload and image proxying
