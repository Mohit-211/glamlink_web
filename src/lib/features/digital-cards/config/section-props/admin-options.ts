/**
 * Section Props Configuration - Admin Options
 *
 * Admin-only configuration options:
 * - Section admin options (z-index, layer order)
 * - Position fields
 * - Outer container styling
 * - Inner container styling
 *
 * These are shown in collapsible "Admin" sections and are only
 * visible in admin mode.
 */

import { UnifiedPropField } from './types';

// =============================================================================
// SECTION ADMIN OPTIONS
// =============================================================================

/**
 * Admin-only section options
 * These are shown in a collapsible "Admin" section
 */
export const SECTION_ADMIN_OPTIONS: UnifiedPropField[] = [
  {
    key: 'zIndex',
    label: 'Layer Order (Z-Index)',
    type: 'number',
    defaultValue: 1,
    min: 0,
    max: 100,
    step: 1,
    helperText: 'Controls which section appears on top when overlapping (higher = on top)',
    adminOnly: true,
  },
];

// =============================================================================
// SECTION POSITION OPTIONS
// =============================================================================

/**
 * Position fields for admin-only editing
 * These are shown in a collapsible "Position" sub-section within Admin
 */
export const SECTION_POSITION_OPTIONS: UnifiedPropField[] = [
  {
    key: 'position.x',
    label: 'X Position (%)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    adminOnly: true,
    group: 'position',
  },
  {
    key: 'position.y',
    label: 'Y Position (%)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    adminOnly: true,
    group: 'position',
  },
  {
    key: 'position.width',
    label: 'Width (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 1,
    adminOnly: true,
    group: 'position',
  },
  {
    key: 'position.height',
    label: 'Height (%)',
    type: 'number',
    defaultValue: 30,
    min: 5,
    max: 100,
    step: 1,
    adminOnly: true,
    group: 'position',
  },
];

// =============================================================================
// SECTION OUTER STYLING OPTIONS
// =============================================================================

/**
 * Outer container styling fields for admin-only editing
 * These are shown in a collapsible "Section Styling" sub-section within Admin
 */
export const SECTION_OUTER_STYLING_OPTIONS: UnifiedPropField[] = [
  {
    key: 'containerBackground',
    label: 'Container Background',
    type: 'text',
    defaultValue: '#ffffff',
    placeholder: '#ffffff or linear-gradient(...)',
    helperText: 'Background color or gradient for the outer container',
    adminOnly: true,
    group: 'outerContainer',
  },
  {
    key: 'borderRadius',
    label: 'Border Radius (px)',
    type: 'number',
    defaultValue: 12,
    min: 0,
    max: 50,
    step: 1,
    adminOnly: true,
    group: 'outerContainer',
  },
  {
    key: 'padding',
    label: 'Padding (px)',
    type: 'number',
    defaultValue: 16,
    min: 0,
    max: 50,
    step: 2,
    adminOnly: true,
    group: 'outerContainer',
  },
  {
    key: 'containerHeight',
    label: 'Container Height (px)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 1000,
    step: 10,
    helperText: '0 = auto height',
    adminOnly: true,
    group: 'outerContainer',
  },
  {
    key: 'fullWidthSection',
    label: 'Full Width Section',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Make the inner section fill the full width',
    adminOnly: true,
    group: 'outerContainer',
  },
];

// =============================================================================
// SECTION INNER STYLING OPTIONS
// =============================================================================

/**
 * Inner container styling fields for admin-only editing
 */
export const SECTION_INNER_STYLING_OPTIONS: UnifiedPropField[] = [
  {
    key: 'sectionBackground',
    label: 'Section Background',
    type: 'text',
    defaultValue: '#ffffff',
    placeholder: '#ffffff',
    helperText: 'Background color for the inner section area',
    adminOnly: true,
    group: 'innerContainer',
  },
  {
    key: 'sectionBorderRadius',
    label: 'Section Border Radius (px)',
    type: 'number',
    defaultValue: 8,
    min: 0,
    max: 50,
    step: 1,
    adminOnly: true,
    group: 'innerContainer',
  },
  {
    key: 'sectionPadding',
    label: 'Section Padding (px)',
    type: 'number',
    defaultValue: 12,
    min: 0,
    max: 50,
    step: 2,
    adminOnly: true,
    group: 'innerContainer',
  },
  {
    key: 'sectionMinHeight',
    label: 'Section Min Height (px)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 500,
    step: 10,
    helperText: '0 = auto height',
    adminOnly: true,
    group: 'innerContainer',
  },
];

// =============================================================================
// BACKWARD COMPATIBILITY
// =============================================================================

/**
 * @deprecated Use SECTION_ADMIN_OPTIONS instead
 */
export const SECTION_CONTAINER_OPTIONS = SECTION_ADMIN_OPTIONS;
