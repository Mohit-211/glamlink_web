/**
 * Section Props Configuration for Condensed Card Editor
 *
 * @deprecated Import from '@/lib/features/digital-cards/config/section-props' instead.
 *
 * This file now re-exports from the modular section-props directory
 * to maintain backward compatibility. All new code should import
 * directly from section-props.
 *
 * Structure:
 * - SECTION_TITLE_OPTIONS: Title, typography, alignment (visible to all users)
 * - SECTION_PROPS_CONFIG: Inner section-specific options (visible to all users)
 * - SECTION_ADMIN_OPTIONS: Admin-only options (z-index, position, styling)
 */

// Re-export everything from the new modular structure
export * from './section-props';
