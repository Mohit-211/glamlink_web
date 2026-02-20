/**
 * Block Selector Default Configuration
 *
 * Default magazine-specific configuration for the block selector.
 * This is the ONLY file that contains hardcoded imports to magazine-specific
 * component registries, making it easy to identify and potentially override
 * for different features.
 *
 * Usage:
 * - Import DEFAULT_BLOCK_SELECTOR_CONFIG when you need magazine block components
 * - Create your own BlockSelectorConfig for other features (e.g., condensed cards)
 */

import { COMPONENT_MAP } from '@/lib/pages/admin/components/magazine/web/preview/designs/CustomSectionPreview';
import { CONTENT_COMPONENTS } from '@/lib/pages/admin/components/magazine/web/editor/config/content-discovery';
import { getComponentDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults';
import type { BlockSelectorConfig } from './types';

/**
 * Default configuration using magazine web preview components.
 * This provides backward compatibility for existing magazine functionality.
 */
export const DEFAULT_BLOCK_SELECTOR_CONFIG: BlockSelectorConfig = {
  componentMap: COMPONENT_MAP,
  contentComponents: CONTENT_COMPONENTS,
  getComponentDefaults,
};
