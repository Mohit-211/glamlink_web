// =============================================================================
// MEDIA DISPLAY COMPONENTS
// =============================================================================
// Components for displaying images, videos, thumbnails, and galleries.

export { default as ImageDisplay } from './ImageDisplay';
export { default as GalleryThumbnail } from './GalleryThumbnail';
export { default as ThumbnailWithPlayButton } from './ThumbnailWithPlayButton';

// VideoDisplay folder - main video player component
export { default as VideoDisplay } from './VideoDisplay';
export { isVideoItem, isVideoUrl } from './VideoDisplay/useVideo';

// Legacy standalone video display (used by VideoDisplaySection)
export { default as VideoDisplayLegacy } from './VideoDisplayLegacy';
