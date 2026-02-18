// Position configuration for a single breakpoint
export interface Position {
  bottom?: string;
  top?: string;
  left?: string;
  right?: string;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
}

// Responsive position configuration
export interface ResponsivePosition {
  default?: Position;  // mobile first (0px and up)
  sm?: Position;       // 640px and up
  md?: Position;       // 768px and up
  lg?: Position;       // 1024px and up
  xl?: Position;       // 1280px and up
  '2xl'?: Position;    // 1536px and up
  [key: string]: Position | undefined;  // Index signature for dynamic access
}

// Text placement configuration
export interface TextPlacement {
  verticalAlign?: 'top' | 'center' | 'bottom';
  horizontalAlign?: 'left' | 'center' | 'right';
  featuredPersonPosition?: Position | ResponsivePosition;
  featuredTitlePosition?: Position | ResponsivePosition;
  titlePosition?: Position | ResponsivePosition;
}

// Responsive height configuration
export interface ResponsiveHeight {
  default?: string;  // mobile first (0px and up)
  sm?: string;       // 640px and up
  md?: string;       // 768px and up
  lg?: string;       // 1024px and up
  xl?: string;       // 1280px and up
  '2xl'?: string;    // 1536px and up
  [key: string]: string | undefined;  // Index signature for dynamic access
}