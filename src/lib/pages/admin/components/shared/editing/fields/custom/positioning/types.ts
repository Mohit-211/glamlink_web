/**
 * Positioning Types
 *
 * Shared types for dimension and position values used across
 * various layout editors (magazine custom layout, condensed card, etc.)
 */

// =============================================================================
// DIMENSION VALUE (supports px or %)
// =============================================================================

export interface DimensionValue {
  value: number;
  unit: 'px' | '%';
}

// =============================================================================
// POSITION CONFIG (x, y, width, height)
// =============================================================================

export interface PositionConfig {
  x: DimensionValue;
  y: DimensionValue;
  width: DimensionValue;
  height: DimensionValue;
  visible?: boolean;
  zIndex?: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a default DimensionValue
 */
export function createDimension(value: number, unit: 'px' | '%' = '%'): DimensionValue {
  return { value, unit };
}

/**
 * Format a DimensionValue to CSS string
 */
export function formatDimension(dim: DimensionValue): string {
  return `${dim.value}${dim.unit}`;
}

/**
 * Create a default PositionConfig
 */
export function createPositionConfig(
  x: number = 0,
  y: number = 0,
  width: number = 100,
  height: number = 100,
  unit: 'px' | '%' = '%'
): PositionConfig {
  return {
    x: createDimension(x, unit),
    y: createDimension(y, unit),
    width: createDimension(width, unit),
    height: createDimension(height, unit),
    visible: true,
  };
}

/**
 * Convert PositionConfig to CSS style object
 */
export function positionToStyle(config: PositionConfig): React.CSSProperties {
  return {
    position: 'absolute',
    left: formatDimension(config.x),
    top: formatDimension(config.y),
    width: formatDimension(config.width),
    height: formatDimension(config.height),
    ...(config.zIndex !== undefined && { zIndex: config.zIndex }),
  };
}

// =============================================================================
// UNIT OPTIONS
// =============================================================================

export const UNIT_OPTIONS = [
  { value: 'px', label: 'px' },
  { value: '%', label: '%' },
] as const;
