/**
 * Digital Page Preview Components - Exports
 *
 * Central export point for all digital page preview components.
 * Each preview component handles a specific page type layout.
 */

// =============================================================================
// PREVIEW COMPONENTS
// =============================================================================

export { default as ImageWithCaptionPreview } from './image/ImageWithCaptionPreview';

// New layout preview components (Phase 1)
export { default as FullPageImagePreview } from './image/FullPageImagePreview';
export { default as ImageWithTitlePreview } from './image/ImageWithTitlePreview';
export { default as ImageWithCornerCaptionPreview } from './image/ImageWithCornerCaptionPreview';
export { default as ArticleStartHeroPreview } from './article/ArticleStartHeroPreview';

// Phase 2 preview components
export { default as ImageCenteredWithBorderPreview } from './image/ImageCenteredWithBorderPreview';
export { default as ImageWithTwoCaptionsPreview } from './image/ImageWithTwoCaptionsPreview';
export { default as ImageWithTwoCornerCaptionsPreview } from './image/ImageWithTwoCornerCaptionsPreview';

// Phase 3 preview components (Text-Heavy Layouts)
export { default as TwoColumnWithQuotePreview } from './article/TwoColumnWithQuotePreview';
export { default as ArticleTwoColumnTextPreview } from './article/ArticleTwoColumnTextPreview';

// Phase 4 preview components (Complex Multi-Image Layouts)
export { default as ArticleTwoImagesTopPreview } from './article/ArticleTwoImagesTopPreview';
export { default as ArticleImageCenterWithQuotePreview } from './article/ArticleImageCenterWithQuotePreview';
export { default as ArticleImagesDiagonalPreview } from './article/ArticleImagesDiagonalPreview';

// Phase 5 preview components (Custom Content Blocks)
export { default as PageImageWithCustomBlockPreview } from './article/PageImageWithCustomBlockPreview';

// Phase 6 preview components (Custom Layout - Composable Objects)
export { default as PageCustom } from './custom/PageCustom';

// Table of Contents preview component
export { default as TableOfContentsPreview } from './article/TableOfContentsPreview';

// Future exports:
// export { default as FullBleedImagePreview } from './FullBleedImagePreview';
// export { default as TextOnlyPreview } from './TextOnlyPreview';
// export { default as SplitLayoutPreview } from './SplitLayoutPreview';
// export { default as GalleryGridPreview } from './GalleryGridPreview';
