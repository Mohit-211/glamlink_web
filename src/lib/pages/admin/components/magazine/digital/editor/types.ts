'use client';

/**
 * Digital Page Editor - Type Definitions
 * Core types for the digital page editor system
 */

import type { CustomObject as CustomLayoutObjectBase } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';

// Re-export for use in DigitalPageData
export type CustomLayoutObject = CustomLayoutObjectBase;

// =============================================================================
// IMAGE TYPES
// =============================================================================

export interface ImageObject {
  url: string;
  originalUrl?: string;
  cropData?: any;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPositionX?: number;
  objectPositionY?: number;
}

// =============================================================================
// TYPOGRAPHY TYPES
// =============================================================================

export interface TypographySettings {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

// =============================================================================
// LAYOUT OPTIONS
// =============================================================================

export interface LayoutOptions {
  imagePosition: 'top' | 'bottom' | 'left' | 'right' | 'background' | 'center';
  textAlignment: 'left' | 'center' | 'right';
  contentPadding: number;
  imageSize: 'small' | 'medium' | 'large' | 'full';
  verticalAlignment?: 'top' | 'center' | 'bottom';
}

// =============================================================================
// PDF SETTINGS
// =============================================================================

export type PdfRatioType =
  | 'a4-portrait'
  | 'a4-landscape'
  | '16:9'
  | '4:3'
  | 'square'
  | 'custom';

export interface PagePdfSettings {
  ratio: PdfRatioType;
  customWidth?: number;
  customHeight?: number;
  backgroundColor: string;
  margin: number;
  footer?: FooterSettings;
}

// =============================================================================
// FOOTER SETTINGS
// =============================================================================

export type PageNumberFormat = 'page-x' | 'x' | 'x-of-y';
export type FooterAlignment = 'left' | 'right';

export interface FooterSettings {
  enabled: boolean;
  // Page number settings
  showPageNumber: boolean;
  pageNumberFormat: PageNumberFormat;
  pageNumberAlignment: FooterAlignment;
  pageNumberColor: string;
  // Magazine title settings
  showMagazineTitle: boolean;
  magazineTitleAlignment: FooterAlignment;
  magazineTitleColor: string;
  // Website URL settings
  showWebsiteUrl: boolean;
  websiteUrlAlignment: FooterAlignment;
  websiteUrlColor: string;
  // Shared settings
  fontSize: number;
  marginBottom: number;
}

export const PDF_DIMENSIONS: Record<Exclude<PdfRatioType, 'custom'>, { width: number; height: number }> = {
  'a4-portrait': { width: 210, height: 297 },
  'a4-landscape': { width: 297, height: 210 },
  '16:9': { width: 297, height: 167 },
  '4:3': { width: 280, height: 210 },
  'square': { width: 210, height: 210 },
};

// =============================================================================
// PAGE TYPES
// =============================================================================

export type DigitalPageType =
  | 'image-with-caption'
  | 'full-bleed-image'
  | 'text-only'
  | 'split-layout'
  | 'two-column'
  | 'gallery-grid'
  // New layout types
  | 'full-page-image'
  | 'image-with-title'
  | 'two-column-with-quote'
  | 'article-start-hero'
  | 'image-centered-with-border'
  | 'article-two-images-top'
  | 'article-images-diagonal'
  | 'article-image-center-with-quote'
  | 'article-two-column-text'
  | 'image-with-corner-caption'
  | 'image-with-two-corner-captions'
  | 'image-with-two-captions'
  // Custom content block layout
  | 'page-image-with-custom-block'
  // Custom layout (composable objects)
  | 'page-custom'
  // Table of contents layout
  | 'table-of-contents';

// =============================================================================
// PAGE CATEGORIES
// =============================================================================

export type DigitalPageCategory = 'image' | 'article' | 'custom';

// =============================================================================
// CONTENT BLOCK TYPES (for page-image-with-custom-block)
// =============================================================================

/**
 * Content block from web preview system - used in custom block layouts
 */
export interface DigitalContentBlock {
  id: string;
  type: string;           // Component name (e.g., "SocialLinks", "PhotoGallery")
  category: string;       // Component category (e.g., "shared", "coin-drop")
  props: Record<string, any>;  // Component-specific props
  enabled: boolean;
  order: number;
}

/**
 * Container styling for content block area
 */
export interface BlockContainerStyle {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  marginTop?: number;
}

// =============================================================================
// TABLE OF CONTENTS TYPES
// =============================================================================

/**
 * Entry in the table of contents - represents a page link
 */
export interface TocEntry {
  image?: string | ImageObject;
  title: string;
  subtitle?: string;
  pageNumber: number;
}

// =============================================================================
// DIGITAL PAGE DATA
// =============================================================================

export interface DigitalPageData {
  id: string;
  type: DigitalPageType;
  title: string;
  subtitle?: string;
  caption?: string;
  image?: string | ImageObject;
  backgroundColor?: string;
  canvasName?: string;
  titleTypography?: TypographySettings;
  subtitleTypography?: TypographySettings;
  captionTypography?: TypographySettings;
  layout?: LayoutOptions;
  pdfSettings?: PagePdfSettings;

  // Article content fields
  heroImage?: string | ImageObject;
  articleContent?: string;
  dropCapEnabled?: boolean;
  articleTitle?: string;
  byline?: string;
  showDropCap?: boolean;

  // Quote fields
  quote?: string;
  quoteAuthor?: string;
  pullQuote?: string;
  quoteContext?: string;
  quotePosition?: number;

  // Multi-image support
  image1?: string | ImageObject;
  image1Caption?: string;
  image2?: string | ImageObject;
  image2Caption?: string;
  imagesCaption?: string;
  mainImage?: string | ImageObject;
  secondImage?: string | ImageObject;
  secondImageCaption?: string;
  thirdImage?: string | ImageObject;
  thirdImageCaption?: string;
  imageTopRight?: string | ImageObject;
  imageTopRightCaption?: string;
  topRightImage?: string | ImageObject;
  topRightCaption?: string;
  imageBottomLeft?: string | ImageObject;
  imageBottomLeftCaption?: string;
  bottomLeftImage?: string | ImageObject;
  bottomLeftCaption?: string;
  articleContinued?: string;
  imageSize?: 'small' | 'medium' | 'large';

  // Caption box fields
  titleBox?: string;
  titleBoxContent?: string;
  captionTitle?: string;
  captionContent?: string;
  captionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  captionBackgroundColor?: string;

  // Caption 2 fields (for two corner captions layout)
  caption2Title?: string;
  caption2?: string;
  caption2Position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  caption2BackgroundColor?: string;
  caption2TitleTypography?: TypographySettings;
  caption2Typography?: TypographySettings;

  // Full page image option
  useFullPageImage?: boolean;

  // Border options
  borderColor?: string;
  borderWidth?: number;
  imageWidth?: '70%' | '80%' | '90%';

  // Sidebar fields
  sidebarTitle?: string;
  sidebarContent?: string;
  sidebarBackgroundColor?: string;
  imageCaption?: string;

  // Custom content block fields (for page-image-with-custom-block)
  customBlock?: DigitalContentBlock | null;
  blockContainerStyle?: BlockContainerStyle;

  // Content block toggle (for layouts with swappable content blocks)
  useContentBlock?: boolean;
  contentMode?: 'quote' | 'content-block' | 'digital-card' | 'image';
  professionalId?: string;

  // Diagonal layout content blocks (two independent block slots)
  useTopRightBlock?: boolean;
  topRightBlock?: DigitalContentBlock | null;
  topRightContentMode?: 'image' | 'content-block' | 'digital-card';
  topRightProfessionalId?: string;
  useBottomLeftBlock?: boolean;
  bottomLeftBlock?: DigitalContentBlock | null;
  bottomLeftContentMode?: 'image' | 'content-block' | 'digital-card';
  bottomLeftProfessionalId?: string;

  // Custom layout objects (for page-custom)
  objects?: CustomLayoutObject[];

  // Table of contents fields (for table-of-contents)
  tocTitle?: string;
  tocTitleTypography?: TypographySettings;
  tocImagePlacement?: 'top' | 'left';  // Card layout: 'top' = image above content, 'left' = image on left side
  tocEntries?: TocEntry[];
}

// =============================================================================
// PREVIEW COMPONENT TYPES
// =============================================================================

export interface DigitalPreviewComponentProps {
  pageData: Partial<DigitalPageData>;
  pdfSettings?: PagePdfSettings;
}

// =============================================================================
// EDITOR STATE TYPES
// =============================================================================

export interface DigitalPageEditorState {
  pageData: Partial<DigitalPageData>;
  selectedPageType: DigitalPageType;
  pdfSettings: PagePdfSettings;
  isGeneratingPdf: boolean;
  pdfError: string | null;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  imagePosition: 'top',
  textAlignment: 'center',
  contentPadding: 24,
  imageSize: 'large',
  verticalAlignment: 'center',
};

export const DEFAULT_PDF_SETTINGS: PagePdfSettings = {
  ratio: 'a4-portrait',
  backgroundColor: '#ffffff',
  margin: 20,
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  enabled: false,
  // Page number defaults
  showPageNumber: true,
  pageNumberFormat: 'page-x',
  pageNumberAlignment: 'left',
  pageNumberColor: '#6b7280',      // gray-500
  // Magazine title defaults
  showMagazineTitle: false,
  magazineTitleAlignment: 'right',
  magazineTitleColor: '#14b8a6',   // glamlink-teal
  // Website URL defaults
  showWebsiteUrl: false,
  websiteUrlAlignment: 'right',
  websiteUrlColor: '#6b7280',      // gray-500
  // Shared defaults
  fontSize: 10,
  marginBottom: 10,
};

export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: '400',
  textAlign: 'left',
  color: '#000000',
  lineHeight: '1.5',
};

// =============================================================================
// PDF GENERATION TYPES
// =============================================================================

export interface PdfGenerationConfig {
  element: HTMLElement;
  fileName: string;
  pdfSettings: PagePdfSettings;
}

export interface PdfGenerationResult {
  success: boolean;
  fileName?: string;
  error?: string;
}

// =============================================================================
// SAVED CANVAS TYPES
// =============================================================================

export interface SavedCanvas {
  id: string;
  name: string;
  description?: string;
  canvasDataUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  pdfSettings: PagePdfSettings;
  pageType: DigitalPageType;
  pageData: Partial<DigitalPageData>;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// DIGITAL PAGE (FIRESTORE COLLECTION)
// =============================================================================

/**
 * Represents a digital page stored in the `digital_pages` Firestore collection.
 * Each digital page belongs to a magazine issue and represents one PDF page.
 */
export interface DigitalPage {
  id: string;                           // Auto-generated Firestore ID
  issueId: string;                      // Reference to magazine issue
  pageNumber: number;                   // 1-indexed page order
  pageType: DigitalPageType;            // Layout type (e.g., 'image-with-caption')
  pageData: Partial<DigitalPageData>;   // Form field values
  pdfSettings: PagePdfSettings;         // Per-page PDF settings (ratio, background)
  canvasDataUrl?: string;               // Generated canvas (base64 PNG)
  canvasWidth?: number;                 // Canvas pixel dimensions
  canvasHeight?: number;
  hasCanvas: boolean;                   // Quick status check for table
  title?: string;                       // Optional page title from pageData
  createdAt: string;                    // ISO timestamp
  updatedAt: string;
  createdBy?: string;                   // User ID
}

/**
 * Data required to create a new digital page
 */
export interface CreateDigitalPageData {
  issueId: string;
  pageNumber: number;
  pageType: DigitalPageType;
  pageData: Partial<DigitalPageData>;
  pdfSettings: PagePdfSettings;
  title?: string;
}

/**
 * Data for updating an existing digital page
 */
export interface UpdateDigitalPageData {
  id: string;
  issueId: string;
  pageNumber?: number;
  pageType?: DigitalPageType;
  pageData?: Partial<DigitalPageData>;
  pdfSettings?: PagePdfSettings;
  canvasDataUrl?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  hasCanvas?: boolean;
  title?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const HTML2CANVAS_SCALE = 2;
export const JPEG_QUALITY = 0.95;
export const IMAGE_PROXY_ENDPOINT = '/api/magazine/image-proxy';
