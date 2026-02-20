/**
 * Digital Page Editor - Field Configurations
 * Field definitions for digital page types
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type {
  DigitalPageData,
} from '@/lib/pages/admin/components/magazine/digital/editor/types';
import { defaultPageMap } from './defaults';

// =============================================================================
// IMAGE POSITION OPTIONS
// =============================================================================

export const IMAGE_POSITION_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'background', label: 'Background (Full Bleed)' },
  { value: 'center', label: 'Center' },
];

// =============================================================================
// TEXT ALIGNMENT OPTIONS
// =============================================================================

export const TEXT_ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

// =============================================================================
// IMAGE SIZE OPTIONS
// =============================================================================

export const IMAGE_SIZE_OPTIONS = [
  { value: 'small', label: 'Small (30%)' },
  { value: 'medium', label: 'Medium (50%)' },
  { value: 'large', label: 'Large (70%)' },
  { value: 'full', label: 'Full Width (100%)' },
];

// =============================================================================
// VERTICAL ALIGNMENT OPTIONS
// =============================================================================

export const VERTICAL_ALIGNMENT_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
];

// =============================================================================
// CONTENT MODE OPTIONS (for pages with quote/content block/digital card)
// =============================================================================

export const CONTENT_MODE_OPTIONS = [
  { value: 'quote', label: 'Quote' },
  { value: 'content-block', label: 'Content Block' },
  { value: 'digital-card', label: 'Digital Business Card' },
];

// =============================================================================
// IMAGE WITH CAPTION PAGE FIELDS
// =============================================================================

export const imageWithCaptionPageFields: FieldConfig[] = [
  // Content Section
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter page title...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'image',
    label: 'Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Upload or select an image for this page',
  },
  {
    name: 'caption',
    label: 'Caption',
    type: 'textarea',
    placeholder: 'Enter image caption...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },

  // Appearance Section
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Background color or gradient for the page',
  },

  // Layout Section
  {
    name: 'layout.imagePosition',
    label: 'Image Position',
    type: 'select',
    options: IMAGE_POSITION_OPTIONS,
    helperText: 'Where to position the image on the page',
  },
  {
    name: 'layout.textAlignment',
    label: 'Text Alignment',
    type: 'select',
    options: TEXT_ALIGNMENT_OPTIONS,
    helperText: 'Alignment for title, subtitle, and caption',
  },
  {
    name: 'layout.imageSize',
    label: 'Image Size',
    type: 'select',
    options: IMAGE_SIZE_OPTIONS,
    helperText: 'Size of the image relative to the page',
  },
  {
    name: 'layout.verticalAlignment',
    label: 'Vertical Alignment',
    type: 'select',
    options: VERTICAL_ALIGNMENT_OPTIONS,
    helperText: 'Vertical alignment of content',
  },
  {
    name: 'layout.contentPadding',
    label: 'Content Padding (px)',
    type: 'number',
    min: 0,
    max: 100,
    placeholder: '24',
    helperText: 'Padding around the content',
  },
];

// =============================================================================
// FULL BLEED IMAGE PAGE FIELDS
// =============================================================================

export const fullBleedImagePageFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Image will cover the entire page',
  },
  {
    name: 'title',
    label: 'Overlay Title',
    type: 'text',
    placeholder: 'Optional overlay text...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'layout.textAlignment',
    label: 'Text Position',
    type: 'select',
    options: TEXT_ALIGNMENT_OPTIONS,
  },
  {
    name: 'layout.verticalAlignment',
    label: 'Vertical Position',
    type: 'select',
    options: VERTICAL_ALIGNMENT_OPTIONS,
  },
];

// =============================================================================
// TEXT ONLY PAGE FIELDS
// =============================================================================

export const textOnlyPageFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter title...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'caption',
    label: 'Body Text',
    type: 'html',
    placeholder: 'Enter body content...',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
  {
    name: 'layout.textAlignment',
    label: 'Text Alignment',
    type: 'select',
    options: TEXT_ALIGNMENT_OPTIONS,
  },
  {
    name: 'layout.verticalAlignment',
    label: 'Vertical Alignment',
    type: 'select',
    options: VERTICAL_ALIGNMENT_OPTIONS,
  },
  {
    name: 'layout.contentPadding',
    label: 'Content Padding (px)',
    type: 'number',
    min: 0,
    max: 100,
  },
];

// =============================================================================
// CAPTION POSITION OPTIONS
// =============================================================================

export const CAPTION_POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

// =============================================================================
// IMAGE WIDTH OPTIONS (for centered image with border)
// =============================================================================

export const IMAGE_WIDTH_OPTIONS = [
  { value: '70%', label: '70%' },
  { value: '80%', label: '80%' },
  { value: '90%', label: '90%' },
];

// =============================================================================
// FULL PAGE IMAGE FIELDS (New)
// =============================================================================

export const fullPageImageFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Full Page Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Image will cover the entire page',
  },
];

// =============================================================================
// IMAGE WITH TITLE FIELDS (New)
// =============================================================================

export const imageWithTitleFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Main image displayed above the title',
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter title...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Page background color',
  },
];

// =============================================================================
// IMAGE WITH CORNER CAPTION FIELDS (New)
// =============================================================================

export const imageWithCornerCaptionFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Background Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Full page background image',
  },
  {
    name: 'useFullPageImage',
    label: 'Use Full Page Image',
    type: 'checkbox',
    helperText: 'When enabled, image fills entire page (respects PDF margin setting)',
  },
  {
    name: 'captionTitle',
    label: 'Caption Title',
    type: 'text',
    placeholder: 'e.g., SUN QUEEN',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'caption',
    label: 'Caption Text',
    type: 'textarea',
    placeholder: 'Enter caption text...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'captionPosition',
    label: 'Caption Position',
    type: 'select',
    options: CAPTION_POSITION_OPTIONS,
    helperText: 'Where to position the caption box',
  },
  {
    name: 'captionBackgroundColor',
    label: 'Caption Background Color',
    type: 'backgroundColor',
    helperText: 'Background color for caption box (default: transparent)',
  },
];

// =============================================================================
// IMAGE WITH TWO CORNER CAPTIONS FIELDS (New)
// =============================================================================

export const imageWithTwoCornerCaptionsFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Background Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Full page background image',
  },
  {
    name: 'useFullPageImage',
    label: 'Use Full Page Image',
    type: 'checkbox',
    helperText: 'When enabled, image fills entire page (respects PDF margin setting)',
  },
  // Caption 1
  {
    name: 'captionTitle',
    label: 'Caption 1 Title',
    type: 'text',
    placeholder: 'e.g., SUN QUEEN',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'caption',
    label: 'Caption 1 Text',
    type: 'textarea',
    placeholder: 'Enter caption text...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'captionPosition',
    label: 'Caption 1 Position',
    type: 'select',
    options: CAPTION_POSITION_OPTIONS,
    helperText: 'Where to position the first caption box',
  },
  {
    name: 'captionBackgroundColor',
    label: 'Caption 1 Background Color',
    type: 'backgroundColor',
    helperText: 'Background color for first caption box (default: transparent)',
  },
  // Caption 2
  {
    name: 'caption2Title',
    label: 'Caption 2 Title',
    type: 'text',
    placeholder: 'e.g., BEAUTY TIP',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'caption2',
    label: 'Caption 2 Text',
    type: 'textarea',
    placeholder: 'Enter second caption text...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'caption2Position',
    label: 'Caption 2 Position',
    type: 'select',
    options: CAPTION_POSITION_OPTIONS,
    helperText: 'Where to position the second caption box',
  },
  {
    name: 'caption2BackgroundColor',
    label: 'Caption 2 Background Color',
    type: 'backgroundColor',
    helperText: 'Background color for second caption box (default: transparent)',
  },
];

// =============================================================================
// ARTICLE START HERO FIELDS (New)
// =============================================================================

export const articleStartHeroFields: FieldConfig[] = [
  {
    name: 'heroImage',
    label: 'Hero Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Large image at the top of the article',
  },
  {
    name: 'title',
    label: 'Article Title',
    type: 'text',
    required: true,
    placeholder: 'Enter article title...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle / Deck',
    type: 'text',
    placeholder: 'Brief description or deck...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'articleContent',
    label: 'Article Content',
    type: 'html',
    placeholder: 'Enter article body text...',
    helperText: 'Article text displayed in 2 columns',
  },
  {
    name: 'dropCapEnabled',
    label: 'Enable Drop Cap',
    type: 'checkbox',
    helperText: 'Display first letter as large drop cap',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
];

// =============================================================================
// IMAGE CENTERED WITH BORDER FIELDS (Phase 2)
// =============================================================================

export const imageCenteredWithBorderFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Image will be centered with border around it',
  },
  {
    name: 'borderColor',
    label: 'Border Color',
    type: 'backgroundColor', // Uses backgroundColor field type for color picker
    helperText: 'Background/border color around the image',
  },
  {
    name: 'borderWidth',
    label: 'Border Width (px)',
    type: 'number',
    min: 20,
    max: 100,
    placeholder: '40',
    helperText: 'Width of the border in pixels',
  },
  {
    name: 'imageWidth',
    label: 'Image Width',
    type: 'select',
    options: IMAGE_WIDTH_OPTIONS,
    helperText: 'How much of the page width the image should take',
  },
];

// =============================================================================
// IMAGE WITH TWO CAPTIONS FIELDS (Phase 2)
// =============================================================================

export const imageWithTwoCaptionsFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Main Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Main image taking left side of the page',
  },
  {
    name: 'titleBox',
    label: 'Title Box Heading',
    type: 'text',
    placeholder: 'GO FOR GOLD',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'titleBoxContent',
    label: 'Title Box Content',
    type: 'textarea',
    placeholder: 'Description text...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'captionTitle',
    label: 'Caption Title',
    type: 'text',
    placeholder: 'BEAUTY NOTE',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'captionContent',
    label: 'Caption Content',
    type: 'textarea',
    placeholder: 'Product details and information...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Page background color',
  },
];

// =============================================================================
// TWO COLUMN WITH QUOTE FIELDS (Phase 3.1)
// =============================================================================

export const twoColumnWithQuoteFields: FieldConfig[] = [
  {
    name: 'articleTitle',
    label: 'Article Title',
    type: 'text',
    useTypography: true,
    placeholder: 'Enter article title...',
  },
  {
    name: 'byline',
    label: 'Byline',
    type: 'text',
    placeholder: 'BY AUTHOR NAME',
    useTypography: true,
  },
  {
    name: 'articleContent',
    label: 'Article Content',
    type: 'html',
    required: true,
    helperText: 'Main article text (will flow in two columns)',
    placeholder: 'Enter article body...',
  },
  // Content Mode Selector
  {
    name: 'contentMode',
    label: 'Content Type',
    type: 'select',
    options: CONTENT_MODE_OPTIONS,
    helperText: 'Choose what content to display between columns',
  },
  // Quote fields (show when contentMode === 'quote')
  {
    name: 'pullQuote',
    label: 'Pull Quote',
    type: 'textarea',
    placeholder: 'Main quote text...',
    helperText: 'Large quote that spans both columns',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'quote' },
  },
  {
    name: 'quoteContext',
    label: 'Quote Context',
    type: 'textarea',
    placeholder: 'Additional context or attribution...',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'quote' },
  },
  // Content block (show when contentMode === 'content-block')
  {
    name: 'customBlock',
    label: 'Content Block',
    type: 'content-block-selector',
    helperText: 'Select a content block to display',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'content-block' },
  },
  // Digital business card (show when contentMode === 'digital-card')
  {
    name: 'professionalId',
    label: 'Select Professional',
    type: 'professional-selector',
    helperText: 'Select a professional to display their business card',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'digital-card' },
  },
  // Position applies to all content types
  {
    name: 'quotePosition',
    label: 'Content Position (%)',
    type: 'number',
    min: 20,
    max: 80,
    placeholder: '50',
    helperText: 'Vertical position where content appears (default: 50%)',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
];

// =============================================================================
// ARTICLE TWO COLUMN TEXT FIELDS (Phase 3.2)
// =============================================================================

export const articleTwoColumnTextFields: FieldConfig[] = [
  {
    name: 'articleTitle',
    label: 'Article Title',
    type: 'text',
    useTypography: true,
    placeholder: 'Enter article title...',
  },
  {
    name: 'byline',
    label: 'Byline',
    type: 'text',
    placeholder: 'BY AUTHOR NAME',
  },
  {
    name: 'sidebarContent',
    label: 'Sidebar Content',
    type: 'html',
    helperText: 'Optional sidebar text (leave empty for no sidebar)',
    placeholder: 'Enter sidebar content...',
  },
  {
    name: 'sidebarBackgroundColor',
    label: 'Sidebar Background',
    type: 'backgroundColor', // Uses backgroundColor field type for color picker
    helperText: 'Background color for sidebar (default: #000000)',
  },
  {
    name: 'articleContent',
    label: 'Article Content',
    type: 'html',
    required: true,
    helperText: 'Main article body (first letter will be styled as drop cap)',
    placeholder: 'Enter article text...',
  },
  {
    name: 'showDropCap',
    label: 'Show Drop Cap',
    type: 'checkbox',
    helperText: 'Style first letter as large drop cap',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
];

// =============================================================================
// ARTICLE TWO IMAGES TOP FIELDS (Phase 4.1)
// =============================================================================

// Content mode options for pages that can have image, content block, or digital card
export const THIRD_CONTENT_MODE_OPTIONS = [
  { value: 'image', label: 'Image' },
  { value: 'content-block', label: 'Content Block' },
  { value: 'digital-card', label: 'Digital Business Card' },
];

export const articleTwoImagesTopFields: FieldConfig[] = [
  {
    name: 'mainImage',
    label: 'Main Image (Large)',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Large hero image on the left',
  },
  {
    name: 'secondImage',
    label: 'Second Image (Small)',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Smaller image on the right',
  },
  {
    name: 'secondImageCaption',
    label: 'Second Image Caption',
    type: 'textarea',
    placeholder: 'Caption for small image...',
  },
  {
    name: 'articleTitle',
    label: 'Article Title',
    type: 'text',
    required: true,
    useTypography: true,
    placeholder: 'MORE IS MORE',
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    useTypography: true,
    placeholder: 'Fall movies run a glamor crop',
  },
  {
    name: 'articleContent',
    label: 'Article Content',
    type: 'html',
    required: true,
    placeholder: 'Enter article text...',
  },
  // Content Mode Selector for third content area
  {
    name: 'contentMode',
    label: 'Third Content Type',
    type: 'select',
    options: THIRD_CONTENT_MODE_OPTIONS,
    helperText: 'Choose what content to display in the article',
  },
  // Image fields (show when contentMode === 'image')
  {
    name: 'thirdImage',
    label: 'Third Image',
    type: 'image',
    contentType: 'product',
    helperText: 'Optional image positioned in the article',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'image' },
  },
  {
    name: 'thirdImageCaption',
    label: 'Third Image Caption',
    type: 'textarea',
    placeholder: 'Caption for third image...',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'image' },
  },
  // Content block (show when contentMode === 'content-block')
  {
    name: 'customBlock',
    label: 'Content Block',
    type: 'content-block-selector',
    helperText: 'Select a content block to display',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'content-block' },
  },
  // Digital business card (show when contentMode === 'digital-card')
  {
    name: 'professionalId',
    label: 'Select Professional',
    type: 'professional-selector',
    helperText: 'Select a professional to display their business card',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'digital-card' },
  },
  {
    name: 'showDropCap',
    label: 'Show Drop Cap',
    type: 'checkbox',
    helperText: 'Style first letter as drop cap',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
];

// =============================================================================
// ARTICLE IMAGE CENTER WITH QUOTE FIELDS (Phase 4.2)
// =============================================================================

export const articleImageCenterWithQuoteFields: FieldConfig[] = [
  {
    name: 'heroImage',
    label: 'Hero Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Large centered image at top',
  },
  {
    name: 'imageWidth',
    label: 'Image Width',
    type: 'select',
    options: IMAGE_WIDTH_OPTIONS,
    helperText: 'Width of centered image',
  },
  {
    name: 'articleTitle',
    label: 'Article Title',
    type: 'text',
    required: true,
    useTypography: true,
    placeholder: 'LIGHTS UP',
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    useTypography: true,
    placeholder: 'Article description...',
  },
  {
    name: 'articleContent',
    label: 'Article Content',
    type: 'html',
    required: true,
    placeholder: 'Enter article text...',
  },
  // Content Mode Selector
  {
    name: 'contentMode',
    label: 'Content Type',
    type: 'select',
    options: CONTENT_MODE_OPTIONS,
    helperText: 'Choose what content to display between article sections',
  },
  // Quote fields (show when contentMode === 'quote')
  {
    name: 'pullQuote',
    label: 'Pull Quote',
    type: 'textarea',
    placeholder: 'SPARKLE TIME',
    helperText: 'Quote displayed between article sections',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'quote' },
  },
  {
    name: 'quoteContext',
    label: 'Quote Context',
    type: 'textarea',
    placeholder: 'Additional quote text...',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'quote' },
  },
  // Content block (show when contentMode === 'content-block')
  {
    name: 'customBlock',
    label: 'Content Block',
    type: 'content-block-selector',
    helperText: 'Select a content block to display',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'content-block' },
  },
  // Digital business card (show when contentMode === 'digital-card')
  {
    name: 'professionalId',
    label: 'Select Professional',
    type: 'professional-selector',
    helperText: 'Select a professional to display their business card',
    conditionalDisplay: { field: 'contentMode', operator: '===', value: 'digital-card' },
  },
  // Position applies to all content types
  {
    name: 'quotePosition',
    label: 'Content Position (%)',
    type: 'number',
    min: 20,
    max: 80,
    placeholder: '50',
    helperText: 'Vertical position where content appears (default: 50%)',
  },
  {
    name: 'showDropCap',
    label: 'Show Drop Cap',
    type: 'checkbox',
    helperText: 'Style first letter as drop cap',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
];

// =============================================================================
// ARTICLE IMAGES DIAGONAL FIELDS (Phase 4.3)
// =============================================================================

export const articleImagesDiagonalFields: FieldConfig[] = [
  // ===== TOP RIGHT CONTENT =====
  {
    name: 'topRightContentMode',
    label: 'Top Right Content Type',
    type: 'select',
    options: THIRD_CONTENT_MODE_OPTIONS,
    helperText: 'Choose what content to display in the top-right position',
  },
  // Image fields (show when topRightContentMode === 'image')
  {
    name: 'topRightImage',
    label: 'Top Right Image',
    type: 'image',
    contentType: 'product',
    helperText: 'Image floated to top-right',
    conditionalDisplay: { field: 'topRightContentMode', operator: '===', value: 'image' },
  },
  {
    name: 'topRightCaption',
    label: 'Top Right Caption',
    type: 'textarea',
    placeholder: 'Caption for top image...',
    conditionalDisplay: { field: 'topRightContentMode', operator: '===', value: 'image' },
  },
  // Content block (show when topRightContentMode === 'content-block')
  {
    name: 'topRightBlock',
    label: 'Top Right Content Block',
    type: 'content-block-selector',
    helperText: 'Select a content block for top-right position',
    conditionalDisplay: { field: 'topRightContentMode', operator: '===', value: 'content-block' },
  },
  // Digital business card (show when topRightContentMode === 'digital-card')
  {
    name: 'topRightProfessionalId',
    label: 'Top Right Professional',
    type: 'professional-selector',
    helperText: 'Select a professional for top-right business card',
    conditionalDisplay: { field: 'topRightContentMode', operator: '===', value: 'digital-card' },
  },

  // ===== ARTICLE CONTENT =====
  {
    name: 'articleTitle',
    label: 'Article Title',
    type: 'text',
    useTypography: true,
    placeholder: 'Enter article title...',
  },
  {
    name: 'byline',
    label: 'Byline',
    type: 'text',
    placeholder: 'BY AUTHOR NAME',
  },
  {
    name: 'articleContent',
    label: 'Article Content',
    type: 'html',
    required: true,
    helperText: 'Will flow in three columns around images/blocks',
    placeholder: 'Enter article text...',
  },

  // ===== BOTTOM LEFT CONTENT =====
  {
    name: 'bottomLeftContentMode',
    label: 'Bottom Left Content Type',
    type: 'select',
    options: THIRD_CONTENT_MODE_OPTIONS,
    helperText: 'Choose what content to display in the bottom-left position',
  },
  // Image fields (show when bottomLeftContentMode === 'image')
  {
    name: 'bottomLeftImage',
    label: 'Bottom Left Image',
    type: 'image',
    contentType: 'product',
    helperText: 'Image floated to bottom-left in columns',
    conditionalDisplay: { field: 'bottomLeftContentMode', operator: '===', value: 'image' },
  },
  {
    name: 'bottomLeftCaption',
    label: 'Bottom Left Caption',
    type: 'textarea',
    placeholder: 'Caption for bottom image...',
    conditionalDisplay: { field: 'bottomLeftContentMode', operator: '===', value: 'image' },
  },
  // Content block (show when bottomLeftContentMode === 'content-block')
  {
    name: 'bottomLeftBlock',
    label: 'Bottom Left Content Block',
    type: 'content-block-selector',
    helperText: 'Select a content block for bottom-left position',
    conditionalDisplay: { field: 'bottomLeftContentMode', operator: '===', value: 'content-block' },
  },
  // Digital business card (show when bottomLeftContentMode === 'digital-card')
  {
    name: 'bottomLeftProfessionalId',
    label: 'Bottom Left Professional',
    type: 'professional-selector',
    helperText: 'Select a professional for bottom-left business card',
    conditionalDisplay: { field: 'bottomLeftContentMode', operator: '===', value: 'digital-card' },
  },

  // ===== LAYOUT OPTIONS =====
  {
    name: 'imageSize',
    label: 'Content Size',
    type: 'select',
    options: [
      { value: 'small', label: 'Small (30%)' },
      { value: 'medium', label: 'Medium (40%)' },
      { value: 'large', label: 'Large (50%)' },
    ],
    helperText: 'Size of images/blocks',
  },
  {
    name: 'showDropCap',
    label: 'Show Drop Cap',
    type: 'checkbox',
    helperText: 'Style first letter as drop cap',
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
  },
];

// =============================================================================
// PAGE IMAGE WITH CUSTOM BLOCK FIELDS
// =============================================================================

export const pageImageWithCustomBlockFields: FieldConfig[] = [
  // Image Section
  {
    name: 'image',
    label: 'Image',
    type: 'image',
    required: true,
    contentType: 'product',
    helperText: 'Main image displayed at top of the page',
  },

  // Title Section
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter page title...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },

  // Page Background
  {
    name: 'backgroundColor',
    label: 'Page Background',
    type: 'backgroundColor',
    helperText: 'Background color for the page',
  },

  // Custom Block Section - uses special field type handled by ContentBlockSelectorField
  {
    name: 'customBlock',
    label: 'Content Block',
    type: 'content-block-selector',
    helperText: 'Select from existing sections or add a new content block',
  },

  // Block Container Styling
  {
    name: 'blockContainerStyle.backgroundColor',
    label: 'Block Background',
    type: 'backgroundColor',
    helperText: 'Background color for the content block area',
  },
  {
    name: 'blockContainerStyle.borderWidth',
    label: 'Border Width',
    type: 'number',
    min: 0,
    max: 10,
    placeholder: '0',
    helperText: 'Border width in pixels',
  },
  {
    name: 'blockContainerStyle.borderColor',
    label: 'Border Color',
    type: 'color',
    helperText: 'Border color for the content block area',
  },
  {
    name: 'blockContainerStyle.borderRadius',
    label: 'Border Radius',
    type: 'number',
    min: 0,
    max: 24,
    placeholder: '0',
    helperText: 'Border radius in pixels',
  },
  {
    name: 'blockContainerStyle.padding',
    label: 'Padding',
    type: 'number',
    min: 0,
    max: 48,
    placeholder: '16',
    helperText: 'Inner padding in pixels',
  },
  {
    name: 'blockContainerStyle.marginTop',
    label: 'Top Margin',
    type: 'number',
    min: 0,
    max: 48,
    placeholder: '16',
    helperText: 'Space above the content block',
  },
];

// =============================================================================
// PAGE CUSTOM FIELDS (Custom Layout with Objects)
// =============================================================================

export const pageCustomFields: FieldConfig[] = [
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Page background color',
  },
  {
    name: 'objects',
    label: 'Layout Objects',
    type: 'custom-layout-editor',
    helperText: 'Add and arrange Text, Image, and Spacer objects (max 30)',
  },
];

// =============================================================================
// TABLE OF CONTENTS FIELDS
// =============================================================================

export const tableOfContentsFields: FieldConfig[] = [
  {
    name: 'tocTitle',
    label: 'Header Title',
    type: 'text',
    placeholder: 'CONTENTS',
    helperText: 'Optional header text (e.g., "CONTENTS", "IN THIS ISSUE")',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'tocImagePlacement',
    label: 'Card Image Placement',
    type: 'select',
    options: [
      { value: 'top', label: 'Top (Default)' },
      { value: 'left', label: 'Left' },
    ],
    helperText: 'Position of images within all TOC cards (crop ratio adjusts automatically)',
  },
  {
    name: 'tocEntries',
    label: 'Table of Contents Entries',
    type: 'array',
    data: 'object',
    maxItems: 20,
    helperText: 'Add pages to display in the table of contents',
    itemSchema: [
      {
        name: 'image',
        label: 'Page Image',
        type: 'image',
        contentType: 'product',
        helperText: 'Preview image for this page',
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Page title...',
      },
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        placeholder: 'Description or section name...',
      },
      {
        name: 'pageNumber',
        label: 'Target Page',
        type: 'page-link-selector',
        required: true,
        placeholder: 'Select target page...',
        helperText: 'Select the page to navigate to in the PDF',
      },
    ],
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Page background color',
  },
];

// =============================================================================
// FIELD CONFIG MAPPING
// =============================================================================

export const digitalPageFieldConfigs: Record<string, FieldConfig[]> = {
  'image-with-caption': imageWithCaptionPageFields,
  'full-bleed-image': fullBleedImagePageFields,
  'text-only': textOnlyPageFields,
  // New layout types (Phase 1)
  'full-page-image': fullPageImageFields,
  'image-with-title': imageWithTitleFields,
  'image-with-corner-caption': imageWithCornerCaptionFields,
  'image-with-two-corner-captions': imageWithTwoCornerCaptionsFields,
  'article-start-hero': articleStartHeroFields,
  // Phase 2 layout types
  'image-centered-with-border': imageCenteredWithBorderFields,
  'image-with-two-captions': imageWithTwoCaptionsFields,
  // Phase 3 layout types (Text-Heavy)
  'two-column-with-quote': twoColumnWithQuoteFields,
  'article-two-column-text': articleTwoColumnTextFields,
  // Phase 4 layout types (Complex Multi-Image)
  'article-two-images-top': articleTwoImagesTopFields,
  'article-image-center-with-quote': articleImageCenterWithQuoteFields,
  'article-images-diagonal': articleImagesDiagonalFields,
  // Custom content block layout
  'page-image-with-custom-block': pageImageWithCustomBlockFields,
  // Custom layout (composable objects)
  'page-custom': pageCustomFields,
  // Table of contents layout
  'table-of-contents': tableOfContentsFields,
};

export const getFieldsForPageType = (pageType: string): FieldConfig[] => {
  return digitalPageFieldConfigs[pageType] || imageWithCaptionPageFields;
};

export const getDefaultDataForPageType = (pageType: string): Partial<DigitalPageData> => {
  const getDefault = defaultPageMap[pageType] || defaultPageMap['image-with-caption'];
  return getDefault();
};

// =============================================================================
// CANVAS INFO FIELDS
// =============================================================================
// Fields for the Canvas Editor tab - used when saving canvas versions

export const canvasInfoFields: FieldConfig[] = [
  {
    name: 'canvasName',
    label: 'Canvas Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Version 1, Final Draft',
    helperText: 'A descriptive name to identify this canvas version',
  },
  {
    name: 'canvasDescription',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Optional notes about this canvas version...',
    helperText: 'Add any notes about changes or purpose of this version',
  },
];
