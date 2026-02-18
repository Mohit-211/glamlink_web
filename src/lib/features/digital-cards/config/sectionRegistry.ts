/**
 * Section Registry for Condensed Card Designer
 *
 * Maps all available section components to their configurations,
 * default positions, and metadata.
 */

import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import type { CondensedCardSectionInstance } from '../types/condensedCardConfig';

// Import section definitions from separate file
import { CONTENT_SECTIONS, CONDENSED_CARD_SECTIONS } from './sectionDefinitions';

// Import media/action section components
import { SignatureWorkAndActions, SignatureWork, VideoDisplaySection } from '../components/sections/media';
import { CurrentPromotions, CurrentPromotionsDetailed } from '../components/sections/promotions';
import { CardActionButtons } from '../components/sections/actions';
import QuickActions from '../components/sections/QuickActions';

// =============================================================================
// TYPES
// =============================================================================

export type SectionCategory = 'content' | 'media' | 'actions' | 'info';

export interface SectionRegistryItem {
  id: string;                           // Registry identifier (unique)
  componentId: string;                  // React component name
  label: string;                        // Display name in UI
  description: string;                  // Brief description for picker
  icon?: string;                        // Icon name (future use)
  category: SectionCategory;            // Category for grouping
  component: React.ComponentType<any>;  // Actual React component
  defaultPosition: PositionConfig;      // Default x, y, width, height
  allowMultiple: boolean;               // Can add multiple instances?
  defaultProps?: Record<string, any>;   // Default component props
  zIndex?: number;                      // Default z-index
  requiredData?: string[];              // Required professional fields
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create position config helper
 */
function createPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  unit: 'px' | '%' = '%'
): PositionConfig {
  return {
    x: { value: x, unit },
    y: { value: y, unit },
    width: { value: width, unit },
    height: { value: height, unit },
    visible: true,
  };
}

// =============================================================================
// MEDIA SECTIONS
// =============================================================================

const MEDIA_SECTIONS: SectionRegistryItem[] = [
  {
    id: 'signature-work',
    componentId: 'SignatureWork',
    label: 'Signature Work',
    description: 'Video showcase of professional work',
    category: 'media',
    component: SignatureWork,
    defaultPosition: createPosition(5, 35, 90, 40),
    allowMultiple: false, // Can add multiple videos
    zIndex: 1,
    requiredData: ['gallery'],
    defaultProps: {
      autoplay: false,
      controls: true,
      muted: false,
      loop: false,
    },
  },
  {
    id: 'signature-work-actions',
    componentId: 'SignatureWorkAndActions',
    label: 'Signature Work & Actions',
    description: 'Video showcase with sidebar (specialties, hours, actions)',
    category: 'media',
    component: SignatureWorkAndActions,
    defaultPosition: createPosition(0, 30, 100, 45),
    allowMultiple: false,
    zIndex: 1,
    requiredData: ['gallery'],
    defaultProps: {
      subSectionsConfig: [
        { id: 'video', visible: true, order: 0 },
        { id: 'specialties', visible: true, order: 1 },
        { id: 'business-hours', visible: true, order: 2 },
        { id: 'quick-actions', visible: true, order: 3 },
      ],
    },
  },
  {
    id: 'video-display',
    componentId: 'VideoDisplaySection',
    label: 'Video Display',
    description: 'Alternative video display section',
    category: 'media',
    component: VideoDisplaySection,
    defaultPosition: createPosition(5, 35, 90, 40),
    allowMultiple: false, // Can add multiple videos
    zIndex: 1,
    requiredData: ['gallery'],
    defaultProps: {
      autoplay: false,
      controls: true,
      muted: false,
      loop: false,
    },
  },
];

// =============================================================================
// PROMOTIONS SECTIONS
// =============================================================================

const PROMOTIONS_SECTIONS: SectionRegistryItem[] = [
  {
    id: 'current-promotions',
    componentId: 'CurrentPromotions',
    label: 'Current Promotions',
    description: 'Simple list of active promotional offers',
    category: 'content',
    component: CurrentPromotions,
    defaultPosition: createPosition(10, 45, 80, 30),
    allowMultiple: false,
    zIndex: 2,
    requiredData: ['promotions'],
  },
  {
    id: 'current-promotions-detailed',
    componentId: 'CurrentPromotionsDetailed',
    label: 'Current Promotions (Detailed)',
    description: 'Advanced promotions with grid/list toggle, filtering, and sorting',
    category: 'content',
    component: CurrentPromotionsDetailed,
    defaultPosition: createPosition(10, 45, 80, 40),
    allowMultiple: false,
    zIndex: 2,
    requiredData: ['promotions'],
    defaultProps: {
      maxItems: 8,
      showExpired: false,
    },
  },
];

// =============================================================================
// ACTION SECTIONS
// =============================================================================

const ACTION_SECTIONS: SectionRegistryItem[] = [
  {
    id: 'quick-actions',
    componentId: 'QuickActions',
    label: 'Quick Actions',
    description: 'Action buttons: Book, Save to Contacts, Save to Phone',
    category: 'actions',
    component: QuickActions,
    defaultPosition: createPosition(70, 5, 25, 15),
    allowMultiple: false,
    zIndex: 10, // High z-index for floating actions
    defaultProps: {
      layout: 'grid',
    },
  },
  {
    id: 'card-action-buttons',
    componentId: 'CardActionButtons',
    label: 'Card Action Buttons',
    description: 'Copy URL and Save as Image buttons',
    category: 'actions',
    component: CardActionButtons,
    defaultPosition: createPosition(75, 2, 20, 10),
    allowMultiple: false,
    zIndex: 10, // High z-index for floating actions
  },
];

// =============================================================================
// SECTION REGISTRY (Combined)
// =============================================================================

export const SECTION_REGISTRY: SectionRegistryItem[] = [
  ...CONTENT_SECTIONS,
  ...CONDENSED_CARD_SECTIONS,
  ...MEDIA_SECTIONS,
  ...PROMOTIONS_SECTIONS,
  ...ACTION_SECTIONS,
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get section by ID
 */
export function getSectionById(id: string): SectionRegistryItem | undefined {
  return SECTION_REGISTRY.find(s => s.id === id);
}

/**
 * Get sections by category
 */
export function getSectionsByCategory(category: SectionCategory): SectionRegistryItem[] {
  return SECTION_REGISTRY.filter(s => s.category === category);
}

/**
 * Get all categories
 */
export function getAllCategories(): SectionCategory[] {
  return ['content', 'media', 'actions', 'info'];
}

/**
 * Check if section can be added
 * Returns true if:
 * - Section allows multiple instances, OR
 * - Section doesn't exist in existing sections yet
 */
export function canAddSection(
  sectionType: string,
  existingSections: CondensedCardSectionInstance[]
): boolean {
  const registryItem = getSectionById(sectionType);
  if (!registryItem) return false;

  // If multiple instances allowed, always can add
  if (registryItem.allowMultiple) return true;

  // Otherwise, check if it already exists
  const exists = existingSections.some(s => s.sectionType === sectionType);
  return !exists;
}

/**
 * Get sections grouped by category
 */
export function getSectionsGroupedByCategory(): Record<SectionCategory, SectionRegistryItem[]> {
  return {
    content: getSectionsByCategory('content'),
    media: getSectionsByCategory('media'),
    actions: getSectionsByCategory('actions'),
    info: getSectionsByCategory('info'),
  };
}

/**
 * Get available sections for picker
 * Filters out sections that can't be added based on existing sections
 */
export function getAvailableSections(
  existingSections: CondensedCardSectionInstance[]
): SectionRegistryItem[] {
  return SECTION_REGISTRY.filter(item => canAddSection(item.id, existingSections));
}
