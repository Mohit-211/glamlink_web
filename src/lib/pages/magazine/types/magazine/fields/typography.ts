// Base styling interface for all sections
export interface BaseSectionStyling {
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
  
  // Subtitle 2 content and styling
  subtitle2?: string;
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
}