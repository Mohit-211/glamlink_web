/**
 * Web Section Preview Components Registry
 * Configuration for available web section preview components
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type {
  WebSectionData,
  WebSectionType,
  WebPreviewComponentProps,
} from '@/lib/pages/admin/components/magazine/web/types';

// Import field configurations
import {
  joinGlamlinkFields,
  getDefaultJoinGlamlink,
  whyGlamlinkFields,
  getDefaultWhyGlamlink,
  customSectionFields,
  getDefaultCustomSection,
} from './fields/web';

// Import preview components
import JoinGlamlinkPreview from '../components/magazine/web/preview/designs/JoinGlamlinkPreview';
import WhyGlamlinkPreview from '../components/magazine/web/preview/designs/WhyGlamlinkPreview';
import CustomSectionPreview from '../components/magazine/web/preview/designs/CustomSectionPreview';

// =============================================================================
// WEB PREVIEW COMPONENT INTERFACE
// =============================================================================

export interface WebPreviewComponent {
  id: WebSectionType;
  label: string;
  description: string;
  component: React.ComponentType<WebPreviewComponentProps>;
  fields: FieldConfig[];
  getDefaultData: () => Partial<WebSectionData>;
  icon?: string;
}

// =============================================================================
// PREVIEW COMPONENTS REGISTRY
// =============================================================================

/**
 * List of available web section preview components
 *
 * To add a new section type:
 * 1. Create the preview component in /web/preview/designs/
 * 2. Add field configuration in /config/fields/web/index.ts
 * 3. Add entry here with unique id, label, component, fields, and defaults
 */
export const webPreviewComponents: WebPreviewComponent[] = [
  {
    id: 'join-glamlink',
    label: 'Join Glamlink',
    description: 'A section with title, subtitle, and description for promoting Glamlink',
    component: JoinGlamlinkPreview,
    fields: joinGlamlinkFields,
    getDefaultData: getDefaultJoinGlamlink,
    icon: '🌟',
  },
  {
    id: 'why-glamlink',
    label: 'Why Glamlink',
    description: 'A section explaining the benefits and reasons to choose Glamlink',
    component: WhyGlamlinkPreview,
    fields: whyGlamlinkFields,
    getDefaultData: getDefaultWhyGlamlink,
    icon: '💡',
  },
  {
    id: 'custom-section',
    label: 'Custom Section',
    description: 'Build a section with multiple content blocks from 40+ components',
    component: CustomSectionPreview,
    fields: customSectionFields,
    getDefaultData: getDefaultCustomSection,
    icon: '🧩',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a preview component configuration by ID
 */
export const getWebPreviewComponent = (
  id: WebSectionType
): WebPreviewComponent | undefined => {
  return webPreviewComponents.find((component) => component.id === id);
};

/**
 * Get fields for a specific section type
 */
export const getFieldsForWebSection = (id: WebSectionType): FieldConfig[] => {
  const component = getWebPreviewComponent(id);
  return component?.fields || joinGlamlinkFields;
};

/**
 * Get default data for a specific section type
 */
export const getDefaultWebSectionData = (id: WebSectionType): Partial<WebSectionData> => {
  const component = getWebPreviewComponent(id);
  return component?.getDefaultData() || getDefaultJoinGlamlink();
};

// =============================================================================
// RE-EXPORTS
// =============================================================================

export type { WebPreviewComponentProps } from '@/lib/pages/admin/components/magazine/web/types';
