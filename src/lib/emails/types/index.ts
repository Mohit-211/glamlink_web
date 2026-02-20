export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  estimatedDelivery: string;
}

export interface Brand {
  name: string;
  logo: string;
  website: string;
  supportEmail: string;
  tagline: string;
}

export interface TrackingParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
}

export interface Product {
  name: string;
  price: number;
  image: string;
  url: string;
}

export interface Coupon {
  code: string;
  discount: string;
  expiryDate: string;
  description: string;
}

export interface ThankYouEmailData {
  customer: Customer;
  order: Order;
  brand: Brand;
  tracking: TrackingParams;
  socialMedia: SocialMedia;
  recommendedProducts?: Product[];
  coupon?: Coupon;
}

export interface MagazineReleaseEmailData {
  customer: Customer;
  brand: Brand;
  tracking: TrackingParams;
  socialMedia: SocialMedia;
  magazine: {
    title: string;
    subtitle: string;
    issueNumber: number;
    issueDate: string;
    coverImage: string;
    previewUrl: string;
    highlights: string[];
  };
}

export interface UpcomingMagazineEmailData {
  customer: Customer;
  brand: Brand;
  tracking: TrackingParams;
  socialMedia: SocialMedia;
  upcoming: {
    title: string;
    subtitle: string;
    releaseDate: string;
    teaserImage: string;
    features: string[];
  };
}

// Section-based email types
export interface SecondaryCard {
  id: string;
  image: string;
  title: string;
  description: string;
  linkUrl: string;
  linkText?: string;
}

export interface PreviewCTASection {
  type: 'preview-cta';
  primaryImage: string;
  primaryTitle?: string;
  primaryDescription?: string;
  primaryLinkUrl?: string;
  primaryLinkText?: string;
  secondaryCards: SecondaryCard[];
}

export interface HeaderSection {
  type: 'header';
  logo?: string;
  title?: string;
  subtitle?: string;
}

export interface FooterSection {
  type: 'footer';
  copyrightText?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
}

export interface TextSection {
  type: 'text';
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ButtonSection {
  type: 'button';
  text: string;
  url: string;
  alignment?: 'left' | 'center' | 'right';
  style?: 'primary' | 'secondary';
}

// New Editorial Section Types
export interface QuoteSection {
  type: 'quote';
  quote: string;
  author?: string;
  authorTitle?: string;
  style?: 'inline' | 'decorative';
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface AuthorSignatureSection {
  type: 'author-signature';
  authorName: string;
  authorTitle: string;
  authorImage?: string;
  authorBio?: string;
  socialLinks?: {
    platform: string;
    url: string;
    handle: string;
  }[];
  backgroundColor?: string;
}

export interface ProductRecommendationsSection {
  type: 'product-recommendations';
  title?: string;
  subtitle?: string;
  products: {
    id: string;
    name: string;
    category: string;
    image: string;
    price?: string;
    originalPrice?: string;
    link: string;
    badge?: string;
  }[];
  viewAllLink?: string;
  viewAllText?: string;
  layout?: 'grid' | 'list';
  backgroundColor?: string;
}

export interface TipsListSection {
  type: 'tips-list';
  title?: string;
  subtitle?: string;
  tips: {
    number: string;
    title: string;
    content: string;
    icon?: string;
  }[];
  style?: 'numbered' | 'bulleted' | 'checkmarks';
  backgroundColor?: string;
  accentColor?: string;
}

export interface SocialCTASection {
  type: 'social-cta';
  title?: string;
  subtitle?: string;
  description?: string;
  socialLinks: {
    platform: string;
    url: string;
    handle: string;
    icon?: string;
  }[];
  qrCode?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  style?: 'centered' | 'split';
}

// Commerce Section Types
export interface ProductShowcaseSection {
  type: 'product-showcase';
  title?: string;
  subtitle?: string;
  productName: string;
  productDescription: string;
  productImage: string;
  gallery?: string[];
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  badge?: string;
}

// Explore Items Section (new)
export interface ExploreItemsSection {
  type: 'explore-items';
  headerTitle?: string;
  searchPlaceholder?: string;
  searchHelpText?: string;
  popularSearchesTitle?: string;
  categories: {
    id: string;
    icon: string;
    title: string;
    description?: string;
  }[];
  modalType?: 'user' | 'pro';
}

// View Profiles Section (new)
export interface ViewProfilesSection {
  type: 'view-profiles';
  headerTitle?: string;
  subtitle?: string;
  profiles: {
    id: string;
    name: string;
    title: string;
    business?: string;
    image: string;
    specialties?: string[];
    badge?: string;
  }[];
  viewAllText?: string;
  viewAllLink?: string;
  modalType?: 'user' | 'pro';
  filterText?: string;
}

// Carousel Items Section (existing)
export interface CarouselItemsSection {
  type: 'carousel-items';
  headerTitle?: string;
  headerSubtitle?: string;
  items: {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    link: string;
  }[];
  viewAllLink: string;
  viewAllText?: string;
}

// Sign Up Steps Section (new)
export interface SignUpStepsSection {
  type: 'signup-steps';
  headerTitle?: string;
  subtitle?: string;
  steps: {
    id: string;
    title: string;
    description: string;
    image: string;
    ctaText?: string;
    ctaUrl?: string;
  }[];
}

// CTA Cards with Background Section (new)
export interface CTACardWithBackgroundSection {
  type: 'cta-cards-background';
  headerTitle?: string;
  subtitle?: string;
  cards: {
    id: string;
    title: string;
    description: string;
    image: string;
    linkText?: string;
    linkUrl?: string;
    gradientFrom?: string;
    gradientTo?: string;
  }[];
  viewAllText?: string;
  viewAllUrl?: string;
}

// App Download CTA Section (new)
export interface AppDownloadCTASection {
  type: 'app-download-cta';
  showUserSection?: boolean;
  showProSection?: boolean;
  userTitle?: string;
  userSubtitle?: string;
  userButtonText?: string;
  proTitle?: string;
  proSubtitle?: string;
  proButtonText?: string;
}

// Engagement Section Types
export interface RewardProgressSection {
  type: 'reward-progress';
  title?: string;
  subtitle?: string;
  currentPoints: number;
  nextMilestone: number;
  customerName?: string;
  milestones: {
    points: number;
    title: string;
    image: string;
    description?: string;
    achieved: boolean;
    current?: boolean;
  }[];
  progressMessage?: string;
  viewHistoryUrl?: string;
  backgroundColor?: string;
  progressColor?: string;
}

export interface MonthlyChallengeSection {
  type: 'monthly-challenge';
  title?: string;
  subtitle?: string;
  challengeName: string;
  challengeImage: string;
  description: string;
  deadline: string;
  totalReward: string;
  currentProgress: number;
  totalSteps: number;
  steps: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    reward?: string;
  }[];
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  status?: 'active' | 'completed' | 'upcoming';
}

export interface LeaderboardSection {
  type: 'leaderboard';
  title?: string;
  subtitle?: string;
  period?: string;
  entries: {
    rank: number;
    name: string;
    profileImage: string;
    points: number;
    badge?: string;
    isCurrentUser?: boolean;
    profileUrl?: string;
  }[];
  currentUserRank?: number;
  totalParticipants?: number;
  viewFullUrl?: string;
  backgroundColor?: string;
}

export interface SpecialOffersSection {
  type: 'special-offers';
  title?: string;
  subtitle?: string;
  featuredOffer: {
    title: string;
    description: string;
    image: string;
    originalPrice: string;
    discountedPrice: string;
    discountPercentage: string;
    coinCost?: string;
    expiryDate?: string;
    ctaText: string;
    ctaUrl: string;
    badge?: string;
  };
  secondaryOffers?: {
    id: string;
    title: string;
    image: string;
    coinCost: string;
    description: string;
    ctaUrl: string;
  }[];
  backgroundColor?: string;
  accentColor?: string;
  viewAllUrl?: string;
}

// Content Section Types
export interface FeaturedStoriesSection {
  type: 'featured-stories';
  title?: string;
  subtitle?: string;
  stories: {
    title: string;
    description: string;
    image: string;
    profileName: string;
    profileImage?: string;
    badge?: string;
    storyUrl?: string;
    profileUrl?: string;
  }[];
  gridColumns?: number;
  showBadges?: boolean;
  backgroundColor?: string;
  viewAllUrl?: string;
}

export interface StoryGridSection {
  type: 'story-grid';
  title?: string;
  subtitle?: string;
  stories: {
    profileName: string;
    profileImage?: string;
    image: string;
    caption?: string;
    storyType?: 'before-after' | 'tutorial' | 'product' | 'review' | 'post';
    timestamp?: string;
    likes?: number;
    comments?: number;
    views?: number;
    tags?: string[];
    isVideo?: boolean;
    storyUrl?: string;
    profileUrl?: string;
  }[];
  gridLayout?: 'instagram' | 'masonry' | 'uniform';
  showEngagement?: boolean;
  showTimestamp?: boolean;
  backgroundColor?: string;
  loadMoreUrl?: string;
}

export interface EventsListSection {
  type: 'events-list';
  title?: string;
  subtitle?: string;
  events: {
    title: string;
    date: string;
    location: string;
    description?: string;
    type?: string;
    price?: string;
    eventUrl?: string;
    registrationUrl?: string;
    image?: string;
    isVirtual?: boolean;
    capacity?: number;
    organizer?: string;
  }[];
  showType?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  viewAllUrl?: string;
  showImages?: boolean;
}

export interface PhotoGallerySection {
  type: 'photo-gallery';
  title?: string;
  subtitle?: string;
  photos: {
    image: string;
    title?: string;
    caption?: string;
    description?: string;
    alt?: string;
    photographer?: string;
    photoUrl?: string;
  }[];
  galleryLayout?: 'grid' | 'masonry' | 'carousel';
  columns?: number;
  showCaptions?: boolean;
  showCredits?: boolean;
  backgroundColor?: string;
  viewAllUrl?: string;
}

export interface CTAWithStatsSection {
  type: 'cta-with-stats';
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  stats: {
    value: string;
    label: string;
    icon?: string;
    color?: string;
  }[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  backgroundColor?: string;
  ctaBackgroundColor?: string;
  statsBackgroundColor?: string;
  showIcons?: boolean;
}

// Modern Section Types
export interface CircleImageGridSection {
  type: 'circle-image-grid';
  title?: string;
  subtitle?: string;
  description?: string;
  items: {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    description?: string;
    itemUrl?: string;
    badge?: string;
    price?: string;
    category?: string;
    isPopular?: boolean;
  }[];
  gridColumns?: number;
  showBadges?: boolean;
  showPrices?: boolean;
  backgroundColor?: string;
  accentColor?: string;
  viewAllUrl?: string;
}

export interface DarkCTAModalSection {
  type: 'dark-cta-modal';
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  heroImage?: string;
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  backgroundColor?: string;
  accentColor?: string;
  urgencyText?: string;
  badge?: string;
}

export interface InteractiveContentCardsSection {
  type: 'interactive-content-cards';
  title?: string;
  subtitle?: string;
  cards: {
    id: string;
    type: 'article' | 'video' | 'product' | 'tutorial' | 'event' | 'offer';
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    cardUrl?: string;
    author?: string;
    authorImage?: string;
    date?: string;
    duration?: string;
    price?: string;
    originalPrice?: string;
    badge?: string;
    category?: string;
    readTime?: string;
    isNew?: boolean;
    isFeatured?: boolean;
  }[];
  layout?: 'grid' | 'masonry' | 'slider';
  showCategories?: boolean;
  showAuthors?: boolean;
  showDates?: boolean;
  backgroundColor?: string;
  accentColor?: string;
  viewAllUrl?: string;
}

export type EmailSection = 
  | PreviewCTASection 
  | HeaderSection 
  | FooterSection 
  | TextSection 
  | ButtonSection
  | QuoteSection
  | AuthorSignatureSection
  | ProductRecommendationsSection
  | TipsListSection
  | SocialCTASection
  | ProductShowcaseSection
  | CarouselItemsSection
  | ExploreItemsSection
  | ViewProfilesSection
  | SignUpStepsSection
  | CTACardWithBackgroundSection
  | AppDownloadCTASection
  | RewardProgressSection
  | MonthlyChallengeSection
  | LeaderboardSection
  | SpecialOffersSection
  | FeaturedStoriesSection
  | StoryGridSection
  | EventsListSection
  | PhotoGallerySection
  | CTAWithStatsSection
  | CircleImageGridSection
  | DarkCTAModalSection
  | InteractiveContentCardsSection;

export interface SectionBasedEmailData {
  customer: Customer;
  brand: Brand;
  tracking: TrackingParams;
  socialMedia: SocialMedia;
  sections: EmailSection[];
}

export type EmailTemplateData = 
  | ThankYouEmailData 
  | MagazineReleaseEmailData 
  | UpcomingMagazineEmailData
  | SectionBasedEmailData;

export type EmailTemplateType = 'thank-you' | 'released-magazine' | 'upcoming-magazine' | 'section-based';

export interface EmailTemplate {
  type: EmailTemplateType;
  name: string;
  description: string;
  component: React.ComponentType<any>;
}

// Theme System Types
export interface EmailThemeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    text: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    text: string;
  };
  background: {
    body: string;
    email: string;
    section: string;
    alternateSection: string;
    footer: string;
    card: string;
    highlight: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    link: string;
    linkHover: string;
    muted: string;
    error: string;
    success: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
    primary: string;
    secondary: string;
  };
  button: {
    primary: {
      background: string;
      text: string;
      border: string;
      hoverBackground: string;
      hoverText: string;
      hoverBorder: string;
    };
    secondary: {
      background: string;
      text: string;
      border: string;
      hoverBackground: string;
      hoverText: string;
      hoverBorder: string;
    };
    tertiary: {
      background: string;
      text: string;
      border: string;
      hoverBackground: string;
      hoverText: string;
      hoverBorder: string;
    };
  };
  gradient: {
    primary: string;
    secondary: string;
    highlight: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  commerce: {
    price: string;
    originalPrice: string;
    discount: string;
    stock: string;
    outOfStock: string;
    rating: string;
  };
  badge: {
    new: string;
    sale: string;
    featured: string;
    trending: string;
    exclusive: string;
  };
  overlay: {
    dark: string;
    light: string;
    primary: string;
  };
}

export interface EmailThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  section: string;
  container: string;
}

export interface EmailThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
    display: string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface EmailTheme {
  name: string;
  description: string;
  colors: EmailThemeColors;
  spacing: EmailThemeSpacing;
  typography: EmailThemeTypography;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Updated section types to include theme reference
export interface SectionBasedEmailDataWithTheme extends SectionBasedEmailData {
  theme?: string; // Theme name or path to theme file
}

export type EmailTemplateDataWithTheme = EmailTemplateData | SectionBasedEmailDataWithTheme;