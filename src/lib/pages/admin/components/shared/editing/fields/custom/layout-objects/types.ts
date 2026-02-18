/**
 * Custom Layout Object Types
 *
 * Type definitions for the Custom Layout system that allows composing pages
 * from Text, Image, Spacer, Custom Block, and Link objects with absolute positioning.
 *
 * This is the central types file for the layout-objects system.
 */

import type { ImageObject } from '@/lib/pages/admin/components/magazine/digital/editor/types';
import type { TypographySettings } from './shared/typographyHelpers';
import { getDefaultTitleTypography, getDefaultSubtitleTypography } from './shared/typographyHelpers';

// =============================================================================
// DIMENSION VALUE (supports px or %)
// =============================================================================

export interface DimensionValue {
  value: number;
  unit: 'px' | '%';
}

// =============================================================================
// BASE OBJECT (shared properties)
// =============================================================================

export interface BaseCustomObject {
  id: string;
  type: 'text' | 'image' | 'spacer' | 'custom-block' | 'link';
  x: DimensionValue;
  y: DimensionValue;
  width: DimensionValue;
  height: DimensionValue;
  zIndex?: number;
}

// =============================================================================
// TEXT SUB-SPACER (for positioning within text container)
// =============================================================================

export interface TextSubSpacer {
  id: string;
  x: DimensionValue;      // X position within text container
  y: DimensionValue;      // Y position within text container
  width: DimensionValue;
  height: DimensionValue;
}

// =============================================================================
// TEXT OBJECT
// =============================================================================

export interface TextCustomObject extends BaseCustomObject {
  type: 'text';
  title?: string | TypographySettings;
  subtitle?: string | TypographySettings;
  content?: string; // HTML content
  backgroundColor?: string;
  spacers?: TextSubSpacer[]; // Up to 4 sub-spacers (one per corner)
  dropCapEnabled?: boolean; // Enable drop-cap on first letter of content
}

// =============================================================================
// IMAGE OBJECT
// =============================================================================

export interface ImageCustomObject extends BaseCustomObject {
  type: 'image';
  image?: string | ImageObject;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
}

// =============================================================================
// SPACER OBJECT (invisible positioning aid)
// =============================================================================

export interface SpacerCustomObject extends BaseCustomObject {
  type: 'spacer';
  // No additional fields - just takes up space for layout purposes
}

// =============================================================================
// CUSTOM BLOCK OBJECT (web content block with dynamic props)
// =============================================================================

export interface CustomBlockCustomObject extends BaseCustomObject {
  type: 'custom-block';
  blockType: string;         // Component name (e.g., "Stats", "PhotoGallery")
  blockCategory: string;     // Category (e.g., "shared", "coin-drop")
  blockProps: Record<string, any>;  // Component-specific props
  blockEnabled?: boolean;    // Show/hide block (default true)
  spacers?: TextSubSpacer[]; // Sub-spacers positioned within block
}

// =============================================================================
// LINK OBJECT (invisible clickable hotspot for PDF links)
// =============================================================================

export interface LinkCustomObject extends BaseCustomObject {
  type: 'link';
  linkType: 'external' | 'internal';
  externalUrl?: string;           // For external links
  targetPageNumber?: number;       // For internal links (references DigitalPage.pageNumber)
  // Note: No label properties - this is an invisible hotspot
}

// =============================================================================
// UNION TYPE
// =============================================================================

export type CustomObject = TextCustomObject | ImageCustomObject | SpacerCustomObject | CustomBlockCustomObject | LinkCustomObject;

export type CustomObjectType = CustomObject['type'];

// =============================================================================
// PAGE DATA
// =============================================================================

export interface PageCustomData {
  type: 'page-custom';
  backgroundColor?: string;
  objects: CustomObject[];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format a DimensionValue to CSS string
 */
export function formatDimension(dim: DimensionValue): string {
  return `${dim.value}${dim.unit}`;
}

/**
 * Create a default DimensionValue
 */
export function createDimension(value: number, unit: 'px' | '%' = '%'): DimensionValue {
  return { value, unit };
}

/**
 * Generate a unique ID for objects
 */
export function generateObjectId(): string {
  return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique ID for sub-spacers
 */
export function generateSpacerId(): string {
  return `spacer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// DEFAULT OBJECT FACTORIES
// =============================================================================

export function createDefaultTextObject(): TextCustomObject {
  return {
    id: generateObjectId(),
    type: 'text',
    x: createDimension(5, '%'),
    y: createDimension(5, '%'),
    width: createDimension(40, '%'),
    height: createDimension(30, '%'),
    title: getDefaultTitleTypography(),
    subtitle: getDefaultSubtitleTypography(),
    content: '',
    backgroundColor: 'transparent',
    spacers: [],
    dropCapEnabled: false,
  };
}

export function createDefaultImageObject(): ImageCustomObject {
  return {
    id: generateObjectId(),
    type: 'image',
    x: createDimension(50, '%'),
    y: createDimension(5, '%'),
    width: createDimension(45, '%'),
    height: createDimension(40, '%'),
    objectFit: 'cover',
    borderRadius: 0,
  };
}

export function createDefaultSpacerObject(): SpacerCustomObject {
  return {
    id: generateObjectId(),
    type: 'spacer',
    x: createDimension(0, '%'),
    y: createDimension(0, '%'),
    width: createDimension(20, '%'),
    height: createDimension(20, '%'),
  };
}

export function createDefaultCustomBlockObject(): CustomBlockCustomObject {
  return {
    id: generateObjectId(),
    type: 'custom-block',
    x: createDimension(10, '%'),
    y: createDimension(10, '%'),
    width: createDimension(80, '%'),
    height: createDimension(40, '%'),
    blockType: '',           // No component selected yet
    blockCategory: '',
    blockProps: {},
    blockEnabled: true,
    spacers: [],             // Initialize with no sub-spacers
  };
}

export function createDefaultLinkObject(): LinkCustomObject {
  return {
    id: generateObjectId(),
    type: 'link',
    x: createDimension(10, '%'),
    y: createDimension(10, '%'),
    width: createDimension(30, '%'),
    height: createDimension(10, '%'),
    linkType: 'external',
    externalUrl: '',
  };
}

export function createDefaultSubSpacer(): TextSubSpacer {
  return {
    id: generateSpacerId(),
    x: createDimension(0, '%'),
    y: createDimension(0, '%'),
    width: createDimension(30, '%'),
    height: createDimension(30, '%'),
  };
}

/**
 * Create a new object by type
 */
export function createObjectByType(type: CustomObjectType): CustomObject {
  switch (type) {
    case 'text':
      return createDefaultTextObject();
    case 'image':
      return createDefaultImageObject();
    case 'spacer':
      return createDefaultSpacerObject();
    case 'custom-block':
      return createDefaultCustomBlockObject();
    case 'link':
      return createDefaultLinkObject();
  }
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isTextObject(obj: CustomObject): obj is TextCustomObject {
  return obj.type === 'text';
}

export function isImageObject(obj: CustomObject): obj is ImageCustomObject {
  return obj.type === 'image';
}

export function isSpacerObject(obj: CustomObject): obj is SpacerCustomObject {
  return obj.type === 'spacer';
}

export function isCustomBlockObject(obj: CustomObject): obj is CustomBlockCustomObject {
  return obj.type === 'custom-block';
}

export function isLinkObject(obj: CustomObject): obj is LinkCustomObject {
  return obj.type === 'link';
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const MAX_OBJECTS = 30;

export const OBJECT_TYPE_OPTIONS = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'spacer', label: 'Spacer', icon: '⬜' },
  { value: 'custom-block', label: 'Custom Block', icon: '🧩' },
  { value: 'link', label: 'Link', icon: '🔗' },
] as const;

export const OBJECT_FIT_OPTIONS = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'fill', label: 'Fill' },
] as const;

export const UNIT_OPTIONS = [
  { value: 'px', label: 'px' },
  { value: '%', label: '%' },
] as const;

// =============================================================================
// SECTION MATCH (for load from section feature)
// =============================================================================

/**
 * Represents a web section that contains data matching a custom block component
 * Used for loading existing section data into custom blocks
 */
export interface SectionMatch {
  sectionId: string;          // Section document ID
  sectionTitle: string;       // Section title for display
  sectionSubtitle?: string;   // Optional subtitle
  sectionType: string;        // Section type (e.g., "maries-corner")
  componentData: Record<string, any>;  // Extracted component props
  dataPreview: string;        // Human-readable preview text
}
