// Universal styling system for all magazine sections

export interface UniversalStyleSettings {
  // Header layout preset
  headerLayout?: 'layout1' | 'layout2' | 'layout3' | 'custom';
  
  // Title styling
  titleFontSize?: string;
  titleFontFamily?: string;
  titleFontWeight?: string;
  titleAlignment?: 'left' | 'center' | 'right';
  titleColor?: string;
  
  // Subtitle styling
  subtitleFontSize?: string;
  subtitleFontFamily?: string;
  subtitleFontWeight?: string;
  subtitleAlignment?: 'left' | 'center' | 'right';
  subtitleColor?: string;
  
  // Subtitle 2 styling
  subtitle2FontSize?: string;
  subtitle2FontFamily?: string;
  subtitle2FontWeight?: string;
  subtitle2Alignment?: 'left' | 'center' | 'right';
  subtitle2Color?: string;
  
  // Body text styling
  bodyFontSize?: string;
  bodyFontFamily?: string;
  bodyFontWeight?: string;
  bodyLineHeight?: string;
  bodyColor?: string;
  
  // Section-specific overrides can be added
}

export interface UniversalLayoutPreset {
  name: string;
  description: string;
  settings: UniversalStyleSettings;
}

// Universal layout presets that work for all sections
export const universalLayoutPresets: Record<string, UniversalLayoutPreset> = {
  layout1: {
    name: 'Classic Magazine',
    description: 'Traditional magazine styling with serif headlines',
    settings: {
      titleFontSize: 'text-4xl md:text-5xl',
      titleFontFamily: 'font-serif',
      titleAlignment: 'center',
      titleColor: 'text-gray-900',
      subtitleFontSize: 'text-xl md:text-2xl',
      subtitleFontFamily: 'font-sans',
      subtitleAlignment: 'center',
      subtitleColor: 'text-glamlink-purple',
      bodyFontSize: 'text-base',
      bodyFontFamily: 'font-serif',
      bodyLineHeight: 'leading-relaxed',
      bodyColor: 'text-gray-700'
    }
  },
  layout2: {
    name: 'Modern Editorial',
    description: 'Clean, modern styling with sans-serif fonts',
    settings: {
      titleFontSize: 'text-3xl md:text-4xl',
      titleFontFamily: 'font-sans',
      titleFontWeight: 'font-bold',
      titleAlignment: 'left',
      titleColor: 'text-gray-900',
      subtitleFontSize: 'text-lg md:text-xl',
      subtitleFontFamily: 'font-sans',
      subtitleFontWeight: 'font-light',
      subtitleAlignment: 'left',
      subtitleColor: 'text-gray-600',
      bodyFontSize: 'text-base',
      bodyFontFamily: 'font-sans',
      bodyFontWeight: 'font-normal',
      bodyLineHeight: 'leading-normal',
      bodyColor: 'text-gray-700'
    }
  },
  layout3: {
    name: 'Bold Impact',
    description: 'Eye-catching design with large, bold typography',
    settings: {
      titleFontSize: 'text-5xl md:text-6xl',
      titleFontFamily: 'font-sans',
      titleFontWeight: 'font-bold',
      titleAlignment: 'center',
      titleColor: 'text-glamlink-teal',
      subtitleFontSize: 'text-2xl md:text-3xl',
      subtitleFontFamily: 'font-sans',
      subtitleFontWeight: 'font-light',
      subtitleAlignment: 'center',
      subtitleColor: 'text-glamlink-purple',
      bodyFontSize: 'text-lg',
      bodyFontFamily: 'font-sans',
      bodyFontWeight: 'font-normal',
      bodyLineHeight: 'leading-relaxed',
      bodyColor: 'text-gray-800'
    }
  }
};

// Font size options for dropdowns
export const fontSizeOptions = [
  { value: 'text-xs', label: 'Extra Small' },
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Base' },
  { value: 'text-lg', label: 'Large' },
  { value: 'text-xl', label: 'Extra Large' },
  { value: 'text-2xl', label: '2X Large' },
  { value: 'text-3xl', label: '3X Large' },
  { value: 'text-4xl', label: '4X Large' },
  { value: 'text-5xl', label: '5X Large' },
  { value: 'text-6xl', label: '6X Large' },
  // Responsive variants
  { value: 'text-sm md:text-base', label: 'Small → Base' },
  { value: 'text-base md:text-lg', label: 'Base → Large' },
  { value: 'text-lg md:text-xl', label: 'Large → XL' },
  { value: 'text-xl md:text-2xl', label: 'XL → 2XL' },
  { value: 'text-2xl md:text-3xl', label: '2XL → 3XL' },
  { value: 'text-3xl md:text-4xl', label: '3XL → 4XL' },
  { value: 'text-4xl md:text-5xl', label: '4XL → 5XL' },
  { value: 'text-5xl md:text-6xl', label: '5XL → 6XL' }
];

// Font family options for dropdowns (CLEAN - no weights mixed in)
// Uses named font classes defined in tailwind.config.ts fontFamily
export const fontFamilyOptions = [
  { value: 'font-sans', label: 'Sans Serif' },
  { value: 'font-serif', label: 'Serif' },
  { value: 'font-mono', label: 'Monospace' },
  // Custom fonts (using named classes from tailwind.config.ts)
  { value: 'font-georgia', label: 'Georgia' },
  { value: 'font-playfair', label: 'Playfair Display' },
  { value: 'font-merriweather', label: 'Merriweather' },
  { value: 'font-montserrat', label: 'Montserrat' },
  { value: 'font-roboto', label: 'Roboto' },
  { value: 'font-lato', label: 'Lato' },
  { value: 'font-red-hat-display', label: 'Red Hat Display' },
  { value: 'font-corsiva', label: 'Monotype Corsiva' },
];

// Font weight options (SEPARATE dropdown)
export const fontWeightOptions = [
  { value: 'font-thin', label: 'Thin' },
  { value: 'font-extralight', label: 'Extra Light' },
  { value: 'font-light', label: 'Light' },
  { value: 'font-normal', label: 'Normal' },
  { value: 'font-medium', label: 'Medium' },
  { value: 'font-semibold', label: 'Semibold' },
  { value: 'font-bold', label: 'Bold' },
  { value: 'font-extrabold', label: 'Extra Bold' },
  { value: 'font-black', label: 'Black' }
];

// Text alignment options
export const alignmentOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

// Text color options
export const textColorOptions = [
  { value: 'text-gray-900', label: 'Black' },
  { value: 'text-gray-800', label: 'Dark Gray' },
  { value: 'text-gray-700', label: 'Gray' },
  { value: 'text-gray-600', label: 'Medium Gray' },
  { value: 'text-gray-500', label: 'Light Gray' },
  { value: 'text-white', label: 'White' },
  { value: 'text-glamlink-teal', label: 'Teal (Primary)' },
  { value: 'text-glamlink-purple', label: 'Purple (Secondary)' },
  { value: 'text-blue-600', label: 'Blue' },
  { value: 'text-green-600', label: 'Green' },
  { value: 'text-red-600', label: 'Red' },
  { value: 'text-yellow-600', label: 'Yellow' }
];

// Line height options
export const lineHeightOptions = [
  { value: 'leading-none', label: 'None (1)' },
  { value: 'leading-tight', label: 'Tight (1.25)' },
  { value: 'leading-snug', label: 'Snug (1.375)' },
  { value: 'leading-normal', label: 'Normal (1.5)' },
  { value: 'leading-relaxed', label: 'Relaxed (1.625)' },
  { value: 'leading-loose', label: 'Loose (2)' }
];

// Helper function to get layout preset
export function getUniversalLayoutPreset(layoutName?: string): UniversalStyleSettings {
  if (!layoutName || layoutName === 'custom') {
    return {};
  }
  return universalLayoutPresets[layoutName]?.settings || {};
}

// Helper function to merge custom settings with preset
export function mergeUniversalStyleSettings(
  content: any,
  preset: UniversalStyleSettings
): UniversalStyleSettings {
  return {
    titleFontSize: content.titleFontSize || preset.titleFontSize || 'text-3xl md:text-4xl',
    titleFontFamily: content.titleFontFamily || preset.titleFontFamily || 'font-serif',
    titleFontWeight: content.titleFontWeight || preset.titleFontWeight || 'font-bold',
    titleAlignment: content.titleAlignment || preset.titleAlignment || 'center',
    titleColor: content.titleColor || preset.titleColor || 'text-gray-900',
    subtitleFontSize: content.subtitleFontSize || preset.subtitleFontSize || 'text-lg md:text-xl',
    subtitleFontFamily: content.subtitleFontFamily || preset.subtitleFontFamily || 'font-sans',
    subtitleFontWeight: content.subtitleFontWeight || preset.subtitleFontWeight || 'font-medium',
    subtitleAlignment: content.subtitleAlignment || preset.subtitleAlignment || 'center',
    subtitleColor: content.subtitleColor || preset.subtitleColor || 'text-gray-600',
    subtitle2FontSize: content.subtitle2FontSize || preset.subtitle2FontSize || content.subtitleFontSize || preset.subtitleFontSize || 'text-base',
    subtitle2FontFamily: content.subtitle2FontFamily || preset.subtitle2FontFamily || content.subtitleFontFamily || preset.subtitleFontFamily || 'font-sans',
    subtitle2FontWeight: content.subtitle2FontWeight || preset.subtitle2FontWeight || 'font-normal',
    subtitle2Alignment: content.subtitle2Alignment || preset.subtitle2Alignment || content.subtitleAlignment || preset.subtitleAlignment || 'center',
    subtitle2Color: content.subtitle2Color || preset.subtitle2Color || content.subtitleColor || preset.subtitleColor || 'text-gray-500',
    bodyFontSize: content.bodyFontSize || preset.bodyFontSize || 'text-base',
    bodyFontFamily: content.bodyFontFamily || preset.bodyFontFamily || 'font-sans',
    bodyFontWeight: content.bodyFontWeight || preset.bodyFontWeight || 'font-normal',
    bodyLineHeight: content.bodyLineHeight || preset.bodyLineHeight || 'leading-normal',
    bodyColor: content.bodyColor || preset.bodyColor || 'text-gray-700'
  };
}

// Helper to get text alignment class
export function getAlignmentClass(alignment?: string): string {
  switch (alignment) {
    case 'left': return 'text-left';
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
}