// Digital Business Card Export Components

export { default as CondensedCardView, CondensedCardView as CondensedCardViewComponent } from './CondensedCardView';
export type { CondensedCardViewProps } from './CondensedCardView';

export { default as SaveImageModal, SaveImageModal as SaveImageModalComponent } from './SaveImageModal';
export type { SaveImageModalProps } from './SaveImageModal';

export { default as CondensedCardPositionOverlay } from './CondensedCardPositionOverlay';
export type { CondensedCardPositionOverlayProps } from './CondensedCardPositionOverlay';

export { default as DraggablePositionOverlay, DraggablePositionOverlay as DraggablePositionOverlayComponent } from './DraggablePositionOverlay';

// Hook and utilities
export {
  useCondensedCardView,
  positionToStyle,
  formatDimension,
  getColorForIndex,
  extractVideoForSection,
  OVERLAY_COLORS,
} from './useCondensedCardView';
export type {
  UseCondensedCardViewProps,
  UseCondensedCardViewReturn,
  OverlayColor,
} from './useCondensedCardView';

// Unified image export hook - THE ONLY image export logic
export { useImageExport, default as useImageExportDefault } from './useImageExport';
export type {
  ImageExportDimensions,
  UseImageExportOptions,
  UseImageExportReturn,
} from './useImageExport';
