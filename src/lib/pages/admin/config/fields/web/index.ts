/**
 * Web Section Editor - Field Configurations
 * Field definitions for web section types
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { WebSectionData, WebSectionType } from '@/lib/pages/admin/components/magazine/web/types';

// Re-export custom section configuration
export * from './customSection';
import { customSectionFields, getDefaultCustomSection } from './customSection';

// =============================================================================
// JOIN GLAMLINK SECTION FIELDS
// =============================================================================

export const joinGlamlinkFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter section title...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter section description...',
    helperText: 'Main content text for this section',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Background color for the section',
  },
];

// =============================================================================
// WHY GLAMLINK SECTION FIELDS
// =============================================================================

export const whyGlamlinkFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Why Choose Glamlink?',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Your beauty journey starts here...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Explain the benefits of Glamlink...',
    helperText: 'Describe why users should choose Glamlink',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Background color for the section',
  },
];

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const getDefaultJoinGlamlink = (): Partial<WebSectionData> => ({
  type: 'join-glamlink',
  title: '',
  subtitle: '',
  description: '',
  backgroundColor: '#ffffff',
});

export const getDefaultWhyGlamlink = (): Partial<WebSectionData> => ({
  type: 'why-glamlink',
  title: '',
  subtitle: '',
  description: '',
  backgroundColor: '#f5f3ff',
});

// =============================================================================
// FIELD CONFIG MAPPING
// =============================================================================

export const webSectionFieldConfigs: Record<WebSectionType, FieldConfig[]> = {
  'join-glamlink': joinGlamlinkFields,
  'why-glamlink': whyGlamlinkFields,
  'custom-section': customSectionFields,
};

export const getFieldsForWebSectionType = (sectionType: WebSectionType): FieldConfig[] => {
  return webSectionFieldConfigs[sectionType] || joinGlamlinkFields;
};

// =============================================================================
// DEFAULT DATA MAPPING
// =============================================================================

export const webSectionDefaultsMap: Record<WebSectionType, () => Partial<WebSectionData>> = {
  'join-glamlink': getDefaultJoinGlamlink,
  'why-glamlink': getDefaultWhyGlamlink,
  'custom-section': getDefaultCustomSection,
};

export const getDefaultDataForWebSectionType = (sectionType: WebSectionType): Partial<WebSectionData> => {
  const getDefault = webSectionDefaultsMap[sectionType] || webSectionDefaultsMap['join-glamlink'];
  return getDefault();
};
