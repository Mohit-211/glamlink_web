/**
 * Section Props Configuration - Title Options
 *
 * Title options that apply to all sections with titles.
 * These are shown in the "Section Options" panel.
 *
 * The showCustomTitle checkbox gates all other title options.
 * When unchecked, no title is shown. When checked, title options appear.
 */

import { UnifiedPropField } from './types';

// =============================================================================
// SECTION TITLE OPTIONS (visible to all users)
// =============================================================================

export const SECTION_TITLE_OPTIONS: UnifiedPropField[] = [
  {
    key: 'showCustomTitle',
    label: 'Create Custom Title',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Add a custom title above this section',
  },
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    defaultValue: '',
    placeholder: 'Enter section title...',
    helperText: 'Custom title displayed above the section content',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleAlignment',
    label: 'Title Alignment',
    type: 'select',
    defaultValue: 'center-with-lines',
    options: [
      { value: 'center-with-lines', label: 'Center with Lines' },
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
    helperText: 'How the title is aligned within the section',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleFontFamily',
    label: 'Font Family',
    type: 'select',
    defaultValue: '',
    options: [
      { value: '', label: 'Default' },
      { value: 'font-sans', label: 'Sans Serif' },
      { value: 'font-serif', label: 'Serif' },
      { value: 'font-mono', label: 'Monospace' },
      { value: 'font-georgia', label: 'Georgia' },
      { value: 'font-playfair', label: 'Playfair Display' },
      { value: 'font-merriweather', label: 'Merriweather' },
      { value: 'font-montserrat', label: 'Montserrat' },
      { value: 'font-roboto', label: 'Roboto' },
      { value: 'font-lato', label: 'Lato' },
      { value: 'font-red-hat-display', label: 'Red Hat Display' },
      { value: 'font-corsiva', label: 'Monotype Corsiva' },
    ],
    group: 'titleTypography',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleFontSize',
    label: 'Font Size (px)',
    type: 'number',
    defaultValue: 16,
    min: 10,
    max: 48,
    step: 1,
    group: 'titleTypography',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleFontWeight',
    label: 'Font Weight',
    type: 'select',
    defaultValue: '600',
    options: [
      { value: '400', label: 'Normal' },
      { value: '500', label: 'Medium' },
      { value: '600', label: 'Semi-Bold' },
      { value: '700', label: 'Bold' },
    ],
    group: 'titleTypography',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleColor',
    label: 'Title Color',
    type: 'color',
    defaultValue: '#1f2937',
    group: 'titleTypography',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleTextTransform',
    label: 'Text Transform',
    type: 'select',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'lowercase', label: 'lowercase' },
      { value: 'capitalize', label: 'Capitalize' },
    ],
    group: 'titleTypography',
    showWhen: (props) => props.showCustomTitle === true,
  },
  {
    key: 'titleLetterSpacing',
    label: 'Letter Spacing (px)',
    type: 'number',
    defaultValue: 0,
    min: -2,
    max: 10,
    step: 0.5,
    group: 'titleTypography',
    showWhen: (props) => props.showCustomTitle === true,
  },
];
