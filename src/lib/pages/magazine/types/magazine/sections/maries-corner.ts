import { BaseSectionStyling } from '../fields/typography';
import { ImageFieldType } from '../fields/image';

export interface MariesCornerContent extends BaseSectionStyling {
  type: 'maries-corner';
  title?: string; // Section title (e.g., "Retinol: The Beauty Myth That's Aging Your Skin")
  tagline: string; // "Pro Tips for Lasting Lash Extensions"
  subtitle?: string; // Additional text below tagline
  subtitle2?: string; // Third line of subtitle text (optional)
  showAuthorInHeader?: boolean; // Show author info in header instead of quote section
  badgeText?: string; // Custom badge text (default: "FOUNDING PRO")
  badgeWidth?: 'auto' | 'fixed' | number; // Badge width control
  badgeFontSize?: string; // Badge font size (e.g., "text-xs", "text-sm")
  badgePadding?: string; // Badge padding (e.g., "px-2", "px-3", "px-4")
  
  // Header layout and typography
  headerLayout?: 'layout1' | 'layout2' | 'layout3' | 'custom'; // Preset layouts
  titleFontSize?: string; // e.g., "text-4xl", "text-5xl"
  titleFontFamily?: string; // e.g., "font-serif", "font-sans", "font-georgia"
  taglineFontSize?: string; // e.g., "text-xl", "text-2xl"
  taglineFontFamily?: string;
  subtitleFontSize?: string; // e.g., "text-sm", "text-base"
  subtitleFontFamily?: string;
  authorImageSize?: 'small' | 'medium' | 'large' | 'xl' | 'custom'; // Size of author image (preset or custom)
  authorImageWidth?: number; // Custom width in pixels (e.g., 300)
  authorImageHeight?: number; // Custom height in pixels (e.g., 300)
  authorBadgePosition?: 'bottom-center' | 'bottom-left' | 'bottom-right'; // Position of badge on author image
  authorImageBackground?: string; // Background color for author image (e.g., "bg-beige", "bg-gray-100")
  authorImagePosition?: string; // Image focal point position (e.g., "center", "top", "custom")
  authorImagePositionX?: number; // Custom horizontal position percentage (0-100)
  authorImagePositionY?: number; // Custom vertical position percentage (0-100)
  
  // Author name and description (displayed below badge)
  authorNameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  authorDescription?: string; // Brief description shown below the author name
  authorDescriptionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  
  // Quote styling
  quoteAlignment?: 'left' | 'center' | 'bottom-center'; // Position of quote on image
  quoteTextColor?: string; // e.g., "text-white", "text-gray-100"
  quoteStyle?: 'decorative' | 'inline'; // Large decorative quotes vs inline quotes
  
  // Drop cap styling for article
  enableDropCap?: boolean; // Enable large first letter
  dropCapStyle?: 'classic' | 'modern' | 'elegant'; // Drop cap style variant
  dropCapColor?: string; // Custom color for drop cap (e.g., "text-glamlink-purple")
  
  // Quote positioning
  quoteMarginTop?: number; // Margin top for quote block in pixels (can be negative to move up)
  
  // Layout settings
  enableSingleColumn?: boolean; // Use single column layout instead of two columns
  
  // Sidebar visibility controls
  showMariesPicks?: boolean; // Show/hide Marie's Picks section
  showSideStories?: boolean; // Show/hide numbered tips section
  showSocialLink?: boolean; // Show/hide social media section
  
  // Numbered tips customization
  numberedTipsTitle?: string; // Custom title for numbered tips section (use {count} for number)
  displayNumbers?: boolean; // Show/hide numbers next to tips
  
  mainStory: {
    title: string; // Large quote text
    articleTitle?: string; // Optional title for the article section
    articleVideoType?: 'none' | 'file' | 'youtube'; // Type of video source (default: 'none')
    articleVideo?: string; // Optional video file URL (Firebase Storage)
    articleVideoUrl?: string; // Optional YouTube video URL
    content: string; // Main article content
    backgroundImage?: ImageFieldType; // Background image for quote section
    authorImage?: ImageFieldType;
    authorName: string;
  };
  mariesPicks: {
    title: string;
    products: Array<{
      name: string;
      category: string;
      image: ImageFieldType;
      link?: string;
    }>;
  };
  sideStories: Array<{
    number: string;
    title: string;
    content: string;
  }>;
  photoGallery?: {
    title: string;
    photos: Array<{
      image: ImageFieldType;
      title?: string;
      description?: string;
    }>;
  };
  showPhotoGallery?: boolean; // Show/hide photo gallery section
  socialLink?: {
    platform: string;
    handle: string;
    followText?: string; // Custom follow text (e.g., "Follow Marie")
    qrCode?: string; // Custom QR code image URL, otherwise auto-generated
  };
}