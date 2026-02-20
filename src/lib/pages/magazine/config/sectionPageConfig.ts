// Configuration for section page breaks and PDF generation
export interface SectionPageConfig {
  sectionId?: string;
  sectionType?: string;
  sectionTitle?: string;
  maxHeightMm?: number; // Maximum height in mm for A4 (default 250mm to leave margins)
  forcePageBreak?: boolean; // Always start this section on a new page
  keepTogether?: boolean; // Try to keep section on single page if possible
  estimatedPages?: number; // Calculated number of pages
  customBreakPoints?: number[]; // Array of pixel heights where to break (for HTML preview)
  customBreakPointsMm?: number[]; // Array of mm heights where to break (for PDF generation)
  autoBreak?: boolean; // Automatically calculate page breaks (default true)
  pdfWidthPx?: number; // PDF width in pixels (default 792px)
  cutRemainingContent?: boolean; // Cut content after the last page break
  includeFooterPages?: boolean; // Include page numbers in PDF (default true)
  includeMainBackground?: boolean; // Include/extend main background color in PDF (default false)
  pdfBackgroundColor?: string; // Background color for PDF pages (default white)
  canvasHeightOverride?: number; // Force canvas capture height in pixels (0 or undefined = auto)
}

// Default configurations for different section types
export const DEFAULT_SECTION_CONFIGS: Record<string, Partial<SectionPageConfig>> = {
  'cover': {
    maxHeightMm: 297, // Full page for cover
    forcePageBreak: false, // Cover is always first
    keepTogether: true,
    autoBreak: true
  },
  'table-of-contents': {
    maxHeightMm: 250,
    forcePageBreak: true, // TOC on new page
    keepTogether: false, // Can span multiple pages
    autoBreak: true
  },
  'featured-story': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'rising-star': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'cover-pro-feature': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'whats-new-glamlink': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'top-treatment': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'top-product-spotlight': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'maries-corner': {
    maxHeightMm: 250,
    forcePageBreak: true,
    keepTogether: false,
    autoBreak: true
  },
  'default': {
    maxHeightMm: 250,
    forcePageBreak: false,
    keepTogether: false,
    autoBreak: true
  }
};

// Storage key for localStorage
export const getConfigStorageKey = (issueId: string) => 
  `magazine-section-configs-${issueId}`;

// Save configurations to localStorage
export const saveSectionConfigs = (
  issueId: string, 
  configs: Record<string, SectionPageConfig>
): void => {
  const key = getConfigStorageKey(issueId);
  localStorage.setItem(key, JSON.stringify(configs));
};

// Load configurations from localStorage
export const loadSectionConfigs = (
  issueId: string
): Record<string, SectionPageConfig> | null => {
  const key = getConfigStorageKey(issueId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse section configs:', e);
    }
  }
  return null;
};

// Get config for a specific section
export const getSectionConfig = (
  sectionType: string,
  sectionId?: string,
  issueId?: string
): SectionPageConfig => {
  // Try to load saved configs first
  if (issueId) {
    const savedConfigs = loadSectionConfigs(issueId);
    if (savedConfigs) {
      const key = sectionId || sectionType;
      if (savedConfigs[key]) {
        return savedConfigs[key];
      }
    }
  }
  
  // Fall back to defaults
  const defaultConfig = DEFAULT_SECTION_CONFIGS[sectionType] || DEFAULT_SECTION_CONFIGS.default;
  return {
    sectionType,
    sectionId,
    ...defaultConfig,
    autoBreak: true
  } as SectionPageConfig;
};

// A4 page dimensions in mm
export const A4_DIMENSIONS = {
  width: 210,
  height: 297,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 15,
  marginRight: 15,
  contentHeight: 257, // 297 - 20 - 20
  contentWidth: 180   // 210 - 15 - 15
};

// Convert pixels to mm (assuming 96 DPI)
export const pixelsToMm = (pixels: number): number => {
  // 1 inch = 25.4mm, 96 pixels = 1 inch
  return (pixels / 96) * 25.4;
};

// Convert mm to pixels (assuming 96 DPI)
export const mmToPixels = (mm: number): number => {
  // 1 inch = 25.4mm, 96 pixels = 1 inch
  return (mm / 25.4) * 96;
};