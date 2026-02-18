/**
 * Positioning Components
 *
 * Shared positioning components for layout editors:
 * - Magazine custom-layout editor
 * - Condensed card designer
 * - Any future positioning-based editors
 */

// Types
export type { DimensionValue, PositionConfig } from './types';
export {
  createDimension,
  formatDimension,
  createPositionConfig,
  positionToStyle,
  UNIT_OPTIONS,
} from './types';

// Components
export { DimensionInput } from './DimensionInput';
export type { DimensionInputProps } from './DimensionInput';

export { PositionSizeFields } from './PositionSizeFields';
export type { PositionSizeFieldsProps } from './PositionSizeFields';
