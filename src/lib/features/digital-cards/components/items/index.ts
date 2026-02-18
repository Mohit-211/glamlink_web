// =============================================================================
// ITEMS - ATOMIC DISPLAY COMPONENTS
// =============================================================================
// This directory contains the source-of-truth display components that sections
// should import and compose, rather than reimplementing display logic.
//
// Structure:
// - media/       → Video, image, gallery, and thumbnail components
// - promotions/  → Promotional item and card components
// - lists/       → Bullet lists and specialties displays
// - maps/        → Google Maps display components
// - QrCodeDisplay.tsx → Standalone QR code utility

// Media Components
export {
  ImageDisplay,
  GalleryThumbnail,
  ThumbnailWithPlayButton,
  VideoDisplay,
  VideoDisplayLegacy,
  isVideoItem,
  isVideoUrl,
} from './media';

// Promotion Components
export {
  PromoItem,
  SimplePromoCard,
} from './promotions';

// List Components
export {
  BulletListDisplay,
  SpecialitiesDisplay,
  SimpleSpecialtiesDisplay,
} from './lists';
export type { BulletListDisplayProps } from './lists';

// QR Code (standalone utility)
export { QrCodeDisplay, isValidUrl, getQrCodeUrl } from './QrCodeDisplay';
export type { QrCodeDisplayProps } from './QrCodeDisplay';

// Maps (existing folder)
export * from './maps';
