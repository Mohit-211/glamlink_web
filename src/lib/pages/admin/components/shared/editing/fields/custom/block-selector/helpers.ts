/**
 * Block Selector Helpers
 * Utility functions for the content block selector
 *
 * All functions accept optional configuration parameters for flexibility.
 * When not provided, they fall back to DEFAULT_BLOCK_SELECTOR_CONFIG.
 */

import { DEFAULT_BLOCK_SELECTOR_CONFIG } from './defaultConfig';
import type { BlockTypeOption, ContentComponentInfo } from './types';

// =============================================================================
// ID GENERATION
// =============================================================================

/**
 * Generate a unique block ID
 */
export function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// =============================================================================
// BLOCK TYPE DISCOVERY
// =============================================================================

/**
 * Get available block types from content discovery system
 *
 * @param contentComponents - Optional array of content components. Uses default if not provided.
 */
export function getAvailableBlockTypes(
  contentComponents: ContentComponentInfo[] = DEFAULT_BLOCK_SELECTOR_CONFIG.contentComponents
): BlockTypeOption[] {
  return contentComponents.map(component => ({
    name: component.name,
    category: component.category,
    displayName: component.displayName,
    description: component.description,
  }));
}

/**
 * Get unique categories from available block types
 *
 * @param contentComponents - Optional array of content components. Uses default if not provided.
 */
export function getBlockCategories(
  contentComponents: ContentComponentInfo[] = DEFAULT_BLOCK_SELECTOR_CONFIG.contentComponents
): string[] {
  const blockTypes = getAvailableBlockTypes(contentComponents);
  return ['all', ...new Set(blockTypes.map(b => b.category))];
}

// =============================================================================
// DEFAULT PROPS
// =============================================================================

/**
 * Get default props for a block type
 * Uses content-defaults first, then falls back to field-based defaults
 *
 * @param category - Block category
 * @param type - Block type name
 * @param contentComponents - Optional array of content components. Uses default if not provided.
 * @param getComponentDefaults - Optional function to get component defaults. Uses default if not provided.
 */
export function getDefaultPropsForBlock(
  category: string,
  type: string,
  contentComponents: ContentComponentInfo[] = DEFAULT_BLOCK_SELECTOR_CONFIG.contentComponents,
  getComponentDefaults?: (type: string, category: string) => Record<string, any>
): Record<string, any> {
  // Use provided getComponentDefaults or fall back to default
  const defaultsGetter = getComponentDefaults || DEFAULT_BLOCK_SELECTOR_CONFIG.getComponentDefaults;

  // Try to get pre-defined defaults from content-defaults
  if (defaultsGetter) {
    const componentDefaultProps = defaultsGetter(type, category);
    if (Object.keys(componentDefaultProps).length > 0) {
      return componentDefaultProps;
    }
  }

  // Fall back to generating defaults from field definitions
  const componentInfo = contentComponents.find(
    c => c.category === category && c.name === type
  );

  if (componentInfo?.propFields) {
    const defaultProps: Record<string, any> = {};
    componentInfo.propFields.forEach(field => {
      // Use field's defaultValue if provided
      if (field.defaultValue !== undefined) {
        defaultProps[field.name] = field.defaultValue;
      } else if (field.name.endsWith('Typography')) {
        defaultProps[field.name] = {};
      } else if (field.type === 'array') {
        defaultProps[field.name] = [];
      } else if (field.type === 'checkbox') {
        defaultProps[field.name] = false;
      } else if (field.type === 'number') {
        defaultProps[field.name] = 0;
      } else {
        defaultProps[field.name] = '';
      }
    });
    return defaultProps;
  }

  return {};
}

// =============================================================================
// FILTERING
// =============================================================================

/**
 * Filter block types by category and search term
 */
export function filterBlockTypes(
  blockTypes: BlockTypeOption[],
  category: string,
  searchTerm: string
): BlockTypeOption[] {
  return blockTypes.filter(type => {
    const matchesCategory = category === 'all' || type.category === category;
    const matchesSearch = !searchTerm ||
      type.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}
