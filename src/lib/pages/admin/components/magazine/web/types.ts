/**
 * Web Section Editor Types
 * Type definitions for web section editing system
 */

import type { TypographySettings } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import type { SectionStripConfig } from '@/lib/pages/magazine/types/magazine/sections/custom-section';

// =============================================================================
// SECTION TYPE
// =============================================================================

/**
 * Available web section types
 * Extensible - add new types as needed
 */
export type WebSectionType = 'join-glamlink' | 'why-glamlink' | 'custom-section';

// =============================================================================
// SECTION DATA INTERFACE
// =============================================================================

/**
 * Web section data structure
 * Represents the editable content of a web section
 */
export interface WebSectionData {
  // Identity
  id?: string;
  type: WebSectionType;
  issueId?: string;

  // Content
  title: string;
  titleTypography?: TypographySettings;
  subtitle?: string;
  subtitleTypography?: TypographySettings;
  description?: string;

  // Styling
  backgroundColor?: string;

  // Section Strip - element that appears in corners or fixed positions
  sectionStrip?: SectionStripConfig;

  // Metadata (for saved sections)
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// PREVIEW COMPONENT PROPS
// =============================================================================

/**
 * Props interface for web section preview components
 */
export interface WebPreviewComponentProps {
  sectionData: Partial<WebSectionData>;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

/**
 * Default typography for titles
 */
export const DEFAULT_TITLE_TYPOGRAPHY: TypographySettings = {
  fontSize: 'text-4xl',
  fontFamily: 'font-sans',
  fontWeight: 'font-bold',
  alignment: 'center',
  color: 'text-gray-900'
};

/**
 * Default typography for subtitles
 */
export const DEFAULT_SUBTITLE_TYPOGRAPHY: TypographySettings = {
  fontSize: 'text-xl',
  fontFamily: 'font-sans',
  fontWeight: 'font-normal',
  alignment: 'center',
  color: 'text-gray-600'
};

/**
 * Get default data for a new JoinGlamlink section
 */
export const getDefaultJoinGlamlinkData = (): Partial<WebSectionData> => ({
  type: 'join-glamlink',
  title: '',
  subtitle: '',
  description: '',
  backgroundColor: '#ffffff',
});

/**
 * Get default data for a new WhyGlamlink section
 */
export const getDefaultWhyGlamlinkData = (): Partial<WebSectionData> => ({
  type: 'why-glamlink',
  title: '',
  subtitle: '',
  description: '',
  backgroundColor: '#f5f3ff',
});

/**
 * Get default data for a new Custom section
 */
export const getDefaultCustomSectionData = (): Partial<WebSectionData> => ({
  type: 'custom-section',
  title: '',
  subtitle: '',
  backgroundColor: '#ffffff',
});

/**
 * Get default data for a section type
 */
export const getDefaultWebSectionData = (type: WebSectionType): Partial<WebSectionData> => {
  const sectionData: Record<WebSectionType, () => Partial<WebSectionData>> = {
    'join-glamlink': getDefaultJoinGlamlinkData,
    'why-glamlink': getDefaultWhyGlamlinkData,
    'custom-section': getDefaultCustomSectionData,
  };

  return (sectionData[type] || sectionData['join-glamlink'])();
};

// =============================================================================
// BLOCK STYLING (Custom Section)
// =============================================================================

/**
 * Block styling options
 */
export interface BlockStyling {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  marginTop?: number;
  marginBottom?: number;
}

// =============================================================================
// CONTENT BLOCK (Custom Section)
// =============================================================================

/**
 * Individual content block within a Custom Section
 */
export interface ContentBlock {
  id: string;
  type: string;
  category: string;
  props: Record<string, any>;
  order: number;
  enabled: boolean;
  styling?: BlockStyling;
}

// =============================================================================
// CUSTOM SECTION CONTENT
// =============================================================================

/**
 * Layout mode for Custom Section
 */
export type CustomSectionLayout = 'single-column' | 'two-column' | 'grid-3';

/**
 * Custom Section content structure
 */
export interface CustomSectionContent {
  blocks: ContentBlock[];
  layout: CustomSectionLayout;
  sectionBorder?: boolean;
  sectionRounded?: boolean;
  sectionBackgroundColor?: string;
  sectionPadding?: number;
}

// =============================================================================
// CUSTOM SECTION DATA
// =============================================================================

/**
 * Custom Section data extending WebSectionData
 */
export interface CustomSectionData extends Omit<WebSectionData, 'type'> {
  type: 'custom-section';
  content: CustomSectionContent;
}

// =============================================================================
// BLOCK PICKER TYPES
// =============================================================================

/**
 * Block metadata for the picker modal
 */
export interface BlockPickerItem {
  name: string;
  category: string;
  displayName: string;
  description: string;
  previewImage?: string;
  defaultProps: Record<string, any>;
}

// =============================================================================
// CUSTOM SECTION HELPER FUNCTIONS
// =============================================================================

/**
 * Create a new content block with defaults
 */
export function createContentBlock(
  type: string,
  category: string,
  props: Record<string, any> = {},
  order: number = 0
): ContentBlock {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    category,
    props,
    order,
    enabled: true,
  };
}

/**
 * Get default custom section content
 */
export function getDefaultCustomSectionContent(): CustomSectionContent {
  return {
    blocks: [],
    layout: 'single-column',
    sectionBorder: false,
    sectionRounded: false,
    sectionBackgroundColor: '#ffffff',
  };
}

/**
 * Get layout CSS classes
 */
export function getLayoutClasses(layout: CustomSectionLayout): string {
  switch (layout) {
    case 'two-column':
      return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    case 'grid-3':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    case 'single-column':
    default:
      return 'flex flex-col gap-4';
  }
}

// =============================================================================
// TYPE CONVERSION UTILITIES
// =============================================================================

/**
 * MagazineSectionDocument-compatible structure
 * Used for API compatibility with existing magazine sections API
 */
export interface WebSectionAsDocument {
  id?: string;
  issueId: string;
  order?: number;
  type: WebSectionType;
  title: string;
  subtitle?: string;
  content: {
    // Basic section fields (for simple sections like join-glamlink)
    titleTypography?: TypographySettings;
    subtitleTypography?: TypographySettings;
    description?: string;
    backgroundColor?: string;

    // Custom section fields (for custom-section type)
    blocks?: ContentBlock[];
    layout?: CustomSectionLayout;
    sectionBorder?: boolean;
    sectionRounded?: boolean;
    sectionBackgroundColor?: string;
    sectionPadding?: number;
  };
  // Section Strip - element that appears in corners or fixed positions
  sectionStrip?: SectionStripConfig;
  createdAt?: string;
  updatedAt?: string;
}
