// Type definitions for content discovery system
import type { FieldType } from '@/lib/pages/admin/types/forms';

export interface ContentComponentInfo {
  name: string;
  category: string;
  displayName: string;
  description: string;
  propFields: FieldDefinition[];
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;  // Changed from string to FieldType for type safety
  required?: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  // Array field properties
  maxItems?: number;
  minItems?: number;
  itemType?: 'text' | 'number' | 'object';  // Item type for arrays (text, number, or object)
  fields?: FieldDefinition[];
  objectFields?: FieldDefinition[]; // Fields for object items in arrays
  // Other field properties
  rows?: number;
  helperText?: string;
  fieldGroup?: string; // For grouping fields on the same line
  // Typography settings (for typography-group fields)
  showAlignment?: boolean;
  showColor?: boolean;
  showTag?: boolean;       // Show HTML tag dropdown (h1-h6, etc.)
  tagOptions?: string[];   // Override default tag options
  defaultTag?: string;     // Default tag value (default 'h3')
}

// Category labels for display
export const CATEGORY_LABELS: Record<string, string> = {
  "shared": "Shared Components",
  "cover-pro-feature": "Cover Pro Feature",
  "magazine-closing": "Magazine Closing",
  "maries-corner": "Marie's Corner",
  "rising-star": "Rising Star",
  "top-product-spotlight": "Top Product Spotlight",
  "top-treatment": "Top Treatment",
  "whats-new-glamlink": "What's New Glamlink",
  "coin-drop": "Coin Drop",
  "glamlink-stories": "Glamlink Stories",
  "spotlight-city": "Spotlight City",
};

// Get all available categories
export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_LABELS);
}