/**
 * Digital Magazine PDF Configuration Types
 *
 * These types define the structure for PDF generation configuration
 * used by the digital magazine editor.
 */

export interface PdfConfiguration {
  // Page dimensions
  width?: number;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  // PDF settings
  orientation?: 'portrait' | 'landscape';
  format?: string; // e.g., 'A4', 'letter'

  // Rendering options
  scale?: number;
  quality?: number;

  // Any additional configuration properties
  [key: string]: any;
}

export interface ExtractedLink {
  url: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page?: number;
}
