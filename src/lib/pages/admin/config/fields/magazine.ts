// ============================================
// MAGAZINE FIELDS CONFIGURATION
// ============================================

import { FieldConfig } from "@/lib/pages/admin/types";

// ============================================
// BASIC INFO TAB FIELDS
// ============================================
/**
 * Basic information fields for magazine issues
 * Includes general metadata, descriptions, and styling
 */
export const basicInfoFields: FieldConfig[] = [
  // Row 1: Issue ID, URL ID, Issue Number
  {
    name: 'id',
    label: 'Issue ID',
    type: 'text',
    required: true,
    disabled: true,
    placeholder: '2025-08-04',
    helperText: 'YYYY-MM-DD format recommended',
  },
  {
    name: 'urlId',
    label: 'URL ID',
    type: 'text',
    placeholder: 'issue-1',
    helperText: 'URL-friendly slug (optional)',
  },
  {
    name: 'issueNumber',
    label: 'Issue Number',
    type: 'number',
    required: true,
    min: 1,
    placeholder: '1'
  },

  // Row 2: Title
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Summer Glow Edition',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true
    }
  },

  // Row 3: Subtitle
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    required: true,
    placeholder: 'Your Guide to Radiant Summer Beauty',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true
    }
  },

  // Row 4: Issue Date
  {
    name: 'issueDate',
    label: 'Issue Date',
    type: 'date',
    required: true
  },

  // Row 5: Description (Rich Text)
  {
    name: 'description',
    label: 'Description',
    type: 'html',
    required: true,
    placeholder: 'Discover the latest in summer beauty trends...',
    helperText: 'Rich text description for listings and social previews'
  },

  // Row 6: Description Image
  {
    name: 'descriptionImage',
    label: 'Description Image',
    type: 'image',
    helperText: 'Image for listings and social media previews',
  },

  // Row 7: Editor's Note (Rich Text)
  {
    name: 'editorNote',
    label: "Editor's Note",
    type: 'html',
    placeholder: 'A message from the editor...',
    helperText: 'Optional editor message (appears in TOC)'
  },

  // Row 8: Editor's Note TOC Overrides
  {
    name: 'editorNoteTocTitle',
    label: 'TOC Title Override',
    type: 'text',
    placeholder: "Editor's Note",
    helperText: 'Custom title for table of contents'
  },
  {
    name: 'editorNoteTocSubtitle',
    label: 'TOC Subtitle Override',
    type: 'text',
    placeholder: '',
    helperText: 'Custom subtitle for table of contents'
  },

  // Row 9: Cover Quote (Rich Text)
  {
    name: 'coverQuote',
    label: 'Cover Quote',
    type: 'html',
    placeholder: 'A pull quote for the cover...',
    helperText: 'Optional pull quote with custom styling'
  },

  // Row 10: Cover Quote Position
  {
    name: 'coverQuotePosition',
    label: 'Quote Position',
    type: 'select',
    options: [
      { value: 'in-image', label: 'In Cover Image' },
      { value: 'above-description', label: 'Above Description' }
    ],
    helperText: 'Where to display the cover quote'
  },

  // Row 11: Publuu Link
  {
    name: 'publuuLink',
    label: 'Publuu Link',
    type: 'url',
    placeholder: 'https://publuucdn.com/...',
    helperText: 'Publuu digital magazine embed URL (optional)'
  },

  // Row 12: Background Colors
  {
    name: 'coverBackgroundColor',
    label: 'Cover Background Color',
    type: 'backgroundColor',
    helperText: 'Background color/gradient for cover section'
  },
  {
    name: 'tocBackgroundColor',
    label: 'TOC Background Color',
    type: 'backgroundColor',
    helperText: 'Background color/gradient for table of contents'
  },
  {
    name: 'editorNoteBackgroundColor',
    label: "Editor's Note Background Color",
    type: 'backgroundColor',
    helperText: "Background color/gradient for editor's note section"
  }
];

// ============================================
// COVER CONFIGURATION TAB FIELDS
// ============================================
/**
 * Cover configuration fields for magazine issues
 * Supports two display modes: HTML (magazine frame) and Background (full-bleed)
 */
export const coverConfigurationFields: FieldConfig[] = [
  // Cover Display Mode Selector
  {
    name: 'coverDisplayMode',
    label: 'Cover Display Mode',
    type: 'select',
    required: true,
    options: [
      {
        value: 'html',
        label: 'HTML Cover (Magazine Frame)',
      },
      {
        value: 'background',
        label: 'Background Image',
      }
    ],
    helperText: 'HTML Cover: Image in magazine frame with positioned text. Background: Full-bleed with embedded text.'
  },

  // HTML Cover Mode Fields (conditional on coverDisplayMode === 'html')
  {
    name: 'coverImage',
    label: 'Cover Image',
    type: 'image',
    required: true,
    helperText: 'Main cover image for magazine frame',
    conditionalDisplay: { field: 'coverDisplayMode', operator: '===', value: 'html' }
  },
  {
    name: 'coverImageAlt',
    label: 'Cover Image Alt Text',
    type: 'text',
    required: true,
    placeholder: 'Description of cover image for accessibility',
    helperText: 'Accessibility description for screen readers',
    conditionalDisplay: { field: 'coverDisplayMode', operator: '===', value: 'html' }
  },

  // Note: coverPositioning requires custom PositionEditor component (not implemented)
  // For now, users can edit this in JSON mode
  // {
  //   name: 'coverPositioning',
  //   label: 'Cover Text Positioning',
  //   type: 'json',
  //   helperText: 'Visual positioning data for title/subtitle placement',
  //   conditionalDisplay: { field: 'coverDisplayMode', operator: '===', value: 'html' }
  // },

  // Background Image Mode Fields (conditional on coverDisplayMode === 'background')
  {
    name: 'coverBackgroundImage',
    label: 'Cover Background Image',
    type: 'image',
    required: true,
    helperText: 'Full-bleed background image with embedded text',
    conditionalDisplay: { field: 'coverDisplayMode', operator: '===', value: 'background' }
  }
];

// ============================================
// LEGACY: ALL FIELDS (for non-tabbed modals)
// ============================================
/**
 * Complete field list for magazine issues (backward compatible)
 * Used when custom tabs are not enabled
 */
export const magazineEditFields: FieldConfig[] = [
  {
    name: 'id',
    label: 'Issue ID',
    type: 'text',
    required: true,
    disabled: true,
    placeholder: '2025-08-04',
    helperText: 'Unique identifier for the issue (YYYY-MM-DD format recommended)'
  },
  {
    name: 'urlId',
    label: 'URL ID',
    type: 'text',
    placeholder: 'issue-1',
    helperText: 'URL-friendly identifier (optional, defaults to issue ID)'
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Summer Glow Edition',
    helperText: 'Main title of the magazine issue'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Your Guide to Radiant Summer Beauty',
    helperText: 'Subtitle or tagline for the issue'
  },
  {
    name: 'issueNumber',
    label: 'Issue Number',
    type: 'number',
    required: true,
    min: 1,
    placeholder: '1',
    helperText: 'Sequential issue number'
  },
  {
    name: 'issueDate',
    label: 'Issue Date',
    type: 'date',
    required: true,
    helperText: 'Publication date of the issue'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Discover the latest in summer beauty trends...',
    helperText: 'Brief description of the issue content'
  },
  {
    name: 'editorNote',
    label: "Editor's Note",
    type: 'textarea',
    placeholder: 'A message from the editor...',
    helperText: "Optional editor's note or introduction"
  },
  {
    name: 'publuuLink',
    label: 'Publuu Link',
    type: 'text',
    placeholder: 'https://publuucdn.com/...',
    helperText: 'Publuu digital magazine embed URL (optional)'
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    helperText: 'Active issues are shown in the main list. Inactive issues are hidden by default.'
  }
];

/**
 * Get default values for magazine fields
 */
export const getDefaultMagazineValues = (): Record<string, any> => {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0];

  return {
    id: dateString, // Default to current date as ID
    urlId: '',
    title: '',
    titleTypography: {
      fontSize: 'text-4xl md:text-5xl',
      fontFamily: 'font-sans',
      fontWeight: 'font-bold',
      alignment: 'left',
      color: 'text-gray-900'
    },
    subtitle: '',
    subtitleTypography: {
      fontSize: 'text-xl',
      fontFamily: 'font-sans',
      fontWeight: 'font-normal',
      alignment: 'left',
      color: 'text-gray-600'
    },
    issueNumber: 1,
    issueDate: dateString,
    description: '',
    editorNote: '',
    publuuLink: '',
    featured: false,
    visible: true,
    isEmpty: false,
    isActive: true, // New issues are active by default
    sections: []
  };
};

// ============================================
// THUMBNAILS TAB FIELDS
// ============================================
/**
 * Thumbnail navigation configuration
 * Single field that dynamically generates thumbnails for:
 * - 3 standard pages: Cover, TOC, Editor's Note
 * - Dynamic section thumbnails based on sections array
 */
export const thumbnailsFields: FieldConfig[] = [
  {
    name: 'thumbnailConfig',
    label: 'Thumbnail Navigation',
    type: 'thumbnailEditor',
    helperText: 'Configure thumbnails for magazine navigation. Upload custom images or use auto-extracted images from sections.'
  }
];

// ============================================
// MODAL TABS CONFIGURATION
// ============================================
/**
 * Custom tabs configuration for magazine create/edit modals
 */
export const magazineModalTabs = [
  {
    id: 'basic-info',
    label: 'Basic Info',
    fields: basicInfoFields
  },
  {
    id: 'cover-config',
    label: 'Cover Configuration',
    fields: coverConfigurationFields
  },
  {
    id: 'thumbnails',
    label: 'Thumbnails',
    fields: thumbnailsFields
  }
];
