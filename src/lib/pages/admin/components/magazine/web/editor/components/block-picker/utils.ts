import { ContentComponentInfo } from '../../config/content-discovery';
import { getComponentDefaults } from '../../config/content-defaults';
import type { BlockPickerItem } from '../../../types';

/**
 * Get preview image path for a component
 * Falls back to placeholder if specific image doesn't exist
 */
export function getPreviewImagePath(category: string, name: string): string {
  // Format: /images/block-previews/{category}/{name}.png
  return `/images/block-previews/${category}/${name}.png`;
}

/**
 * Convert ContentComponentInfo to BlockPickerItem
 * Uses rich defaults from content-defaults, falls back to field defaults
 */
export function toBlockPickerItem(info: ContentComponentInfo): BlockPickerItem {
  // Get rich defaults from content-defaults system (comprehensive component data)
  const richDefaults = getComponentDefaults(info.name, info.category);

  // Extract field-level defaults as fallback for components without rich defaults
  const fieldDefaults: Record<string, any> = {};
  info.propFields.forEach(field => {
    if (field.defaultValue !== undefined) {
      fieldDefaults[field.name] = field.defaultValue;
    }
  });

  // Merge: rich defaults take precedence, field defaults fill any gaps
  // This ensures all blocks start with realistic, complete data when available
  const defaultProps = { ...fieldDefaults, ...richDefaults };

  return {
    name: info.name,
    category: info.category,
    displayName: info.displayName,
    description: info.description,
    previewImage: getPreviewImagePath(info.category, info.name),
    defaultProps,
  };
}

/**
 * Get an icon for a category (fallback for missing images)
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'shared': '🔧',
    'maries-corner': '👩',
    'whats-new-glamlink': '✨',
    'cover-pro-feature': '🌟',
    'top-treatment': '💆',
    'top-product-spotlight': '🎯',
    'magazine-closing': '📖',
    'coin-drop': '💰',
    'glamlink-stories': '📱',
    'spotlight-city': '🏙️',
    'rising-star': '⭐',
  };
  return icons[category] || '📦';
}
