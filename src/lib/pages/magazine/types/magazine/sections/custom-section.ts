// Typography interface for custom section

// Typography settings for section strip text
export interface SectionStripTextTypography {
  fontSize?: string;    // Tailwind class like 'text-xs', 'text-sm', etc.
  fontFamily?: string;  // Tailwind class like 'font-sans', 'font-serif', etc.
  fontWeight?: string;  // Tailwind class like 'font-normal', 'font-semibold', etc.
  color?: string;       // Tailwind class or hex color
}

// Section Strip configuration for corner/fixed position elements
export interface SectionStripConfig {
  enabled: boolean;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'inside-content' | 'after-content';
  insideBlockIndex?: number; // Which block to insert before (0-indexed) when position is 'inside-content'
  // Display orientation
  display?: 'regular' | 'vertical';  // Text orientation (regular or vertical)
  verticalAngle?: '90' | '-90';          // Rotation angle for vertical display (90 = bottom-to-top, -90 = top-to-bottom)
  // Background settings
  useBackground?: boolean;  // Whether to show a colored background container
  backgroundColor?: string;
  // Text typography (consolidated from individual fields)
  textTypography?: SectionStripTextTypography;
  // Legacy fields (for backwards compatibility)
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  padding?: number;
  borderRadius?: number;
  rotation?: number;  // Legacy: For diagonal strip effect (in degrees) - prefer display + verticalAngle
  width?: string;     // 'auto', '100%', or px value
  zIndex?: number;
}

// Content block configuration for dynamic components
export interface ContentBlock {
  id: string;
  type: string; // Component name like "CallToAction", "PhotoGallery", etc.
  category: string; // "shared", "cover-pro-feature", etc.
  props: Record<string, any>; // Dynamic props for the component
  enabled: boolean;
  order: number;
  
  // Grid layout control (for two-column and grid layouts)
  gridSpan?: "1" | "2" | "3" | "full"; // How many columns to span
  gridColumn?: "auto" | "1" | "2" | "3"; // Which column to start in
  gridRowSpan?: "1" | "2" | "3" | "auto"; // How many rows to span
  forceNewRow?: boolean; // Force this block to start on a new row
  alignSelf?: "auto" | "start" | "end" | "center" | "stretch"; // How to align this block in its grid cell
  
  // Flex columns layout control
  columnAssignment?: "1" | "2" | "3"; // Explicit column assignment for flex-columns layout

  // Float layout control
  floatDirection?: "left" | "right" | "none"; // Float direction for float-columns layout
  floatWidth?: string; // Width for floated elements (e.g., "250px", "30%")
  clearFloat?: boolean; // Whether to clear floats and start below floated content

  // Display visibility control
  displayMode?: "always" | "above-breakpoint" | "below-breakpoint"; // When to show this block

  // Background and styling settings for individual content blocks
  backgroundColor?: string; // Background color for this specific block
  backgroundWidth?: "content" | "full"; // Whether background extends full width
  borderWidth?: number; // Border width in pixels (default: 0)
  borderColor?: string; // Border color (default: transparent)
  borderRadius?: number; // Border radius in pixels (default: 0)
  padding?: number; // Padding in pixels (default: 0)
}

export interface CustomSectionContent {
  type: "custom-section";
  
  // URL slug for direct access
  urlSlug?: string;
  
  // Section metadata
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
  
  // Dynamic content blocks
  contentBlocks: ContentBlock[];
  
  // Layout settings
  layout?: "single-column" | "two-column" | "grid" | "masonry" | "flex-columns" | "float-columns";
  spacing?: "compact" | "normal" | "spacious";
  gridFlow?: "row" | "dense"; // Grid auto-flow setting for compact layouts (only for grid layouts)
  masonryColumns?: "2" | "3"; // Number of columns for masonry layout
  
  // Flex columns width settings (percentages)
  column1Width?: number; // Width percentage for column 1 in flex-columns layout
  column2Width?: number; // Width percentage for column 2 in flex-columns layout
  column3Width?: number; // Width percentage for column 3 in flex-columns layout

  // Float layout breakpoint control
  floatBreakpoint?: "always" | "xs" | "sm" | "md" | "lg" | "xl" | "never"; // Minimum screen size for float layout
  
  // Header layout options
  headerLayout?: "default" | "inline-right" | "inline-left";
  headerInlineComponent?: ContentBlock; // Component to show inline with header
  
  // Section-level styling
  sectionBackground?: string;
  sectionPadding?: string;
  sectionBorder?: boolean;
  
  // Typography overrides for section header (editor saves as titleTypography/subtitleTypography)
  titleTypography?: any;
  subtitleTypography?: any;
  // Direct font family settings from editor
  titleFontFamily?: string;
  subtitleFontFamily?: string;
  // Legacy names (backward compat)
  sectionTitleTypography?: any;
  sectionSubtitleTypography?: any;

  // Section Strip - element that appears in corners or fixed positions
  sectionStrip?: SectionStripConfig;
}