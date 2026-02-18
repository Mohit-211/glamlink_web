/**
 * Block Selector Types
 * Type definitions for the content block selector system
 *
 * Includes:
 * - Configuration types for props-based component registry injection
 * - Component props interfaces
 * - Data types for blocks and sections
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// =============================================================================
// COMPONENT REGISTRY TYPES (Props-Based Configuration)
// =============================================================================

/**
 * Component map for rendering blocks
 * Maps category → componentName → ReactComponent
 */
export type ComponentMap = Record<string, Record<string, React.ComponentType<any>>>;

/**
 * Content component info for discovery
 * Defines available block types with their editable fields
 */
export interface ContentComponentInfo {
  name: string;
  category: string;
  displayName: string;
  description: string;
  propFields?: FieldConfig[];
}

/**
 * Configuration registry passed to block-selector components
 * Allows different consumers to provide different component registries
 */
export interface BlockSelectorConfig {
  componentMap: ComponentMap;
  contentComponents: ContentComponentInfo[];
  getComponentDefaults?: (type: string, category: string) => Record<string, any>;
}

// =============================================================================
// CONTENT BLOCK TYPES
// =============================================================================

/**
 * Content block from web preview system - used in custom block layouts
 */
export interface DigitalContentBlock {
  id: string;
  type: string;                    // Component name (e.g., "SocialLinks", "PhotoGallery")
  category: string;                // Component category (e.g., "shared", "coin-drop")
  props: Record<string, any>;      // Component-specific props
  enabled: boolean;
  order: number;
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for the main ContentBlockSelector component
 */
export interface ContentBlockSelectorProps {
  issueId?: string;
  selectedBlock: DigitalContentBlock | null;
  onChange: (block: DigitalContentBlock | null) => void;
  config?: BlockSelectorConfig;     // Optional - uses DEFAULT_BLOCK_SELECTOR_CONFIG if not provided
}

/**
 * Props for the BlockPreview component
 */
export interface BlockPreviewProps {
  block: DigitalContentBlock;
  componentMap?: ComponentMap;      // Optional - uses default if not provided
}

/**
 * Props for the FromSectionsTab component
 */
export interface FromSectionsTabProps {
  issueId?: string;
  onSelectBlock: (block: DigitalContentBlock) => void;
}

/**
 * Props for the AddNewTab component
 */
export interface AddNewTabProps {
  onSelectBlock: (block: DigitalContentBlock) => void;
  config?: BlockSelectorConfig;     // Optional - uses default if not provided
}

// =============================================================================
// DATA TYPES
// =============================================================================

/**
 * Section data with its content blocks
 */
export interface SectionWithBlocks {
  id: string;
  title: string;
  type: string;
  blocks: DigitalContentBlock[];
}

/**
 * Block type option from content discovery
 */
export interface BlockTypeOption {
  name: string;
  category: string;
  displayName: string;
  description: string;
}

/**
 * Tab type for the selector
 */
export type TabType = 'from-sections' | 'add-new';

// =============================================================================
// HOOK TYPES
// =============================================================================

/**
 * Return type for useBlockSelector hook
 */
export interface UseBlockSelectorReturn {
  sections: SectionWithBlocks[];
  loading: boolean;
  error: string | null;
  expandedSection: string | null;
  setExpandedSection: (id: string | null) => void;
  fetchSections: () => Promise<void>;
}

// =============================================================================
// MODAL TYPES
// =============================================================================

/**
 * Props for the BlockEditorPreviewModal component
 */
export interface BlockEditorPreviewModalProps {
  isOpen: boolean;
  blockType: BlockTypeOption | null;
  onClose: () => void;
  onSave: (block: DigitalContentBlock) => void;
  config?: BlockSelectorConfig;     // Optional - uses default if not provided
}

/**
 * Props for the LiveBlockPreview component
 */
export interface LiveBlockPreviewProps {
  category: string;
  type: string;
  componentMap?: ComponentMap;      // Optional - uses default if not provided
}

/**
 * Return type for useBlockEditorModal hook
 */
export interface UseBlockEditorModalReturn {
  fields: FieldConfig[];
  defaultData: Record<string, any>;
  handleSave: (formData: Record<string, any>) => void;
}
