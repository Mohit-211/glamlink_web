/**
 * Digital Layout Types
 *
 * Type definitions for the layout template system that allows saving
 * and loading page configurations as reusable templates.
 */

import type {
  DigitalPageType,
  DigitalPageData,
  PagePdfSettings
} from '../components/magazine/digital/editor/types';

// =============================================================================
// LAYOUT DATA (What gets saved and restored)
// =============================================================================

export interface DigitalLayoutData {
  pageType: DigitalPageType;
  pdfSettings: PagePdfSettings;
  pageData: Partial<DigitalPageData>;
}

// =============================================================================
// LAYOUT DOCUMENT (Firestore structure)
// =============================================================================

export interface DigitalLayout {
  id: string;
  issueId: string;
  layoutName: string;
  layoutDescription?: string;
  layoutCategory?: string;            // User-defined category for filtering
  previewImage?: string;              // Canvas dataUrl or uploaded image
  layoutData: DigitalLayoutData;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

export interface CreateDigitalLayoutRequest {
  issueId: string;
  layoutName: string;
  layoutDescription?: string;
  layoutCategory?: string;
  previewImage?: string;
  layoutData: DigitalLayoutData;
}

export interface UpdateDigitalLayoutRequest {
  layoutName?: string;
  layoutDescription?: string;
  layoutCategory?: string;
  previewImage?: string;
  layoutData?: DigitalLayoutData;
}

export interface BatchUploadLayoutsRequest {
  layouts: Omit<DigitalLayout, 'createdAt' | 'updatedAt' | 'createdBy'>[];
}

export interface DigitalLayoutsResponse {
  success: boolean;
  data?: DigitalLayout | DigitalLayout[];
  error?: string;
  message?: string;
}

// =============================================================================
// MODAL PROPS
// =============================================================================

export interface CurrentPageData {
  pageType: DigitalPageType;
  pdfSettings: PagePdfSettings;
  pageData: Partial<DigitalPageData>;
  canvasDataUrl?: string;
}
