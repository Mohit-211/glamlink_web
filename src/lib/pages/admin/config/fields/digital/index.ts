/**
 * Digital Page Editor - Central Export File
 * Exports all field configurations, default values, and example data
 */

// Re-export everything from defaults
export {
  // Default value functions
  getDefaultFullPageImage,
  getDefaultImageWithTitle,
  getDefaultImageWithCornerCaption,
  getDefaultImageWithTwoCornerCaptions,
  getDefaultArticleStartHero,
  getDefaultImageCenteredWithBorder,
  getDefaultImageWithTwoCaptions,
  getDefaultImageWithCaptionPage,
  getDefaultFullBleedImagePage,
  getDefaultTextOnlyPage,
  getDefaultTwoColumnWithQuote,
  getDefaultArticleTwoColumnText,
  getDefaultArticleTwoImagesTop,
  getDefaultArticleImageCenterWithQuote,
  getDefaultArticleImagesDiagonal,
  getDefaultPageImageWithCustomBlock,
  getDefaultPageCustom,
  getDefaultTableOfContents,
  // Example data functions
  getExampleFullPageImage,
  getExampleImageWithTitle,
  getExampleImageWithCornerCaption,
  getExampleArticleStartHero,
  getExampleImageCenteredWithBorder,
  getExampleImageWithTwoCaptions,
  getExampleImageWithCaptionPage,
  getExampleFullBleedImagePage,
  getExampleTextOnlyPage,
  getExampleDataForPageType,
  // Page type mappings
  defaultPageMap,
} from './defaults';

// Re-export everything from previews
export {
  // Options
  IMAGE_POSITION_OPTIONS,
  TEXT_ALIGNMENT_OPTIONS,
  IMAGE_SIZE_OPTIONS,
  VERTICAL_ALIGNMENT_OPTIONS,
  CAPTION_POSITION_OPTIONS,
  IMAGE_WIDTH_OPTIONS,
  // Field configurations
  imageWithCaptionPageFields,
  fullBleedImagePageFields,
  textOnlyPageFields,
  fullPageImageFields,
  imageWithTitleFields,
  imageWithCornerCaptionFields,
  imageWithTwoCornerCaptionsFields,
  articleStartHeroFields,
  imageCenteredWithBorderFields,
  imageWithTwoCaptionsFields,
  twoColumnWithQuoteFields,
  articleTwoColumnTextFields,
  articleTwoImagesTopFields,
  articleImageCenterWithQuoteFields,
  articleImagesDiagonalFields,
  pageImageWithCustomBlockFields,
  pageCustomFields,
  tableOfContentsFields,
  // Canvas fields
  canvasInfoFields,
  // Field config mapping
  digitalPageFieldConfigs,
  getFieldsForPageType,
  getDefaultDataForPageType,
} from './previews';
