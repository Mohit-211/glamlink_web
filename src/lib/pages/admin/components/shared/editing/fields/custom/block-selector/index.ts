/**
 * Block Selector - Central Exports
 *
 * Content block selector system for digital page editor.
 * Allows users to select content blocks from existing sections or create new ones.
 *
 * Features:
 * - Props-based configuration for custom component registries
 * - Default magazine configuration included
 * - Reusable by different features (magazine, condensed cards, etc.)
 *
 * Usage:
 * ```typescript
 * import {
 *   ContentBlockSelector,
 *   DEFAULT_BLOCK_SELECTOR_CONFIG,
 *   type BlockSelectorConfig,
 *   type DigitalContentBlock,
 * } from '@/lib/pages/admin/components/shared/editing/fields/custom/block-selector';
 *
 * // Using default config (magazine)
 * <ContentBlockSelector selectedBlock={block} onChange={setBlock} />
 *
 * // Using custom config
 * <ContentBlockSelector selectedBlock={block} onChange={setBlock} config={myConfig} />
 * ```
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

export { DEFAULT_BLOCK_SELECTOR_CONFIG } from './defaultConfig';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export { ContentBlockSelector, default } from './ContentBlockSelector';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

export { BlockPreview } from './BlockPreview';
export { FromSectionsTab } from './FromSectionsTab';
export { AddNewTab } from './AddNewTab';

// =============================================================================
// HOOKS
// =============================================================================

export { useBlockSelector } from './useBlockSelector';

// =============================================================================
// HELPERS
// =============================================================================

export {
  generateBlockId,
  getAvailableBlockTypes,
  getBlockCategories,
  getDefaultPropsForBlock,
  filterBlockTypes,
} from './helpers';

// =============================================================================
// MODAL COMPONENTS
// =============================================================================

export {
  BlockEditorPreviewModal,
  LiveBlockPreview,
  useBlockEditorModal,
} from './modal';

// =============================================================================
// FIELD COMPONENT
// =============================================================================

export { ContentBlockSelectorField } from './ContentBlockSelectorField';

// =============================================================================
// TYPES
// =============================================================================

export type {
  // Configuration types
  ComponentMap,
  ContentComponentInfo,
  BlockSelectorConfig,
  // Component props
  ContentBlockSelectorProps,
  BlockPreviewProps,
  FromSectionsTabProps,
  AddNewTabProps,
  // Data types
  DigitalContentBlock,
  SectionWithBlocks,
  BlockTypeOption,
  TabType,
  // Hook types
  UseBlockSelectorReturn,
  // Modal types
  BlockEditorPreviewModalProps,
  LiveBlockPreviewProps,
  UseBlockEditorModalReturn,
} from './types';
