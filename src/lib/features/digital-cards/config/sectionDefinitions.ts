/**
 * Section Definitions for Condensed Card Designer
 *
 * Contains the configuration definitions for all section types.
 * Separated from sectionRegistry.ts for better maintainability.
 */

import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import type { SectionRegistryItem } from './sectionRegistry';

// Import content section components
import { Header, NameTitle, Branding } from '../components/sections/header';
import { AboutMe, BioPreview } from '../components/sections/bio';
import { Specialties, ImportantInfo, Rating, OverviewStats } from '../components/sections/content';
import { Contact, BusinessHours } from '../components/sections/contact';
import { CardUrl } from '../components/sections/actions';

// Import condensed card section components
import HeaderAndBio from '../components/condensed/sections/HeaderAndBio';
import FooterSection from '../components/condensed/sections/FooterSection';
import CustomSection from '../components/condensed/sections/CustomSection';
import ContentContainer from '../components/condensed/sections/ContentContainer';
import QuickActionsLine from '../components/condensed/sections/QuickActionsLine';
import DropshadowContainer from '../components/condensed/sections/DropshadowContainer';

// Import map-related condensed card section components
import MapSection from '../components/condensed/sections/map/MapSection';
import MapWithHours from '../components/condensed/sections/map/MapWithHours';
import MapAndContentContainer from '../components/condensed/sections/map/MapAndContentContainer';

// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Create position config helper
 */
function createPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  unit: 'px' | '%' = '%'
): PositionConfig {
  return {
    x: { value: x, unit },
    y: { value: y, unit },
    width: { value: width, unit },
    height: { value: height, unit },
    visible: true,
  };
}

// =============================================================================
// CONTENT SECTIONS
// =============================================================================

export const CONTENT_SECTIONS: SectionRegistryItem[] = [
  {
    id: 'header',
    componentId: 'Header',
    label: 'Header',
    description: 'Profile image with social links and action buttons',
    category: 'content',
    component: Header,
    defaultPosition: createPosition(0, 0, 100, 35),
    allowMultiple: false,
    zIndex: 0,
    requiredData: ['name', 'profileImage'],
    defaultProps: {
      showActionButtons: false, // Don't show action buttons in static export
    },
  },
  {
    id: 'nameTitle',
    componentId: 'NameTitle',
    label: 'Name & Title',
    description: 'Professional name, title, and business name',
    category: 'content',
    component: NameTitle,
    defaultPosition: createPosition(0, 32, 100, 15),
    allowMultiple: false,
    zIndex: 1,
    requiredData: ['name'],
  },
  {
    id: 'rating',
    componentId: 'Rating',
    label: 'Rating',
    description: 'Star rating and review count',
    category: 'info',
    component: Rating,
    defaultPosition: createPosition(0, 45, 100, 5),
    allowMultiple: false,
    zIndex: 2,
  },
  {
    id: 'specialties',
    componentId: 'Specialties',
    label: 'Specialties',
    description: 'Professional specialties/tags',
    category: 'content',
    component: Specialties,
    defaultPosition: createPosition(0, 50, 100, 8),
    allowMultiple: false,
    zIndex: 3,
    defaultProps: {
      maxItems: 4,
    },
  },
  {
    id: 'importantInfo',
    componentId: 'ImportantInfo',
    label: 'Important Info',
    description: 'Key information for clients (e.g., By appointment only, Cash preferred)',
    category: 'content',
    component: ImportantInfo,
    defaultPosition: createPosition(10, 30, 80, 20),
    allowMultiple: false,
    zIndex: 2,
    requiredData: ['importantInfo'],
    defaultProps: {
      hideTitle: false,
      maxItems: 10,
    },
  },
  {
    id: 'contact',
    componentId: 'Contact',
    label: 'Contact Info',
    description: 'Location, phone, email, website, Instagram',
    category: 'info',
    component: Contact,
    defaultPosition: createPosition(0, 58, 100, 25),
    allowMultiple: false,
    zIndex: 4,
  },
  {
    id: 'cardUrl',
    componentId: 'CardUrl',
    label: 'Card URL',
    description: 'Digital card URL display',
    category: 'info',
    component: CardUrl,
    defaultPosition: createPosition(0, 85, 100, 8),
    allowMultiple: false,
    zIndex: 5,
  },
  {
    id: 'branding',
    componentId: 'Branding',
    label: 'GLAMLINK Branding',
    description: 'GLAMLINK footer branding',
    category: 'info',
    component: Branding,
    defaultPosition: createPosition(0, 93, 100, 7),
    allowMultiple: false,
    zIndex: 6,
  },
  {
    id: 'about-me',
    componentId: 'AboutMe',
    label: 'About Me',
    description: 'Professional bio, location map, specialties, and business hours',
    category: 'content',
    component: AboutMe,
    defaultPosition: createPosition(0, 0, 100, 50),
    allowMultiple: false,
    zIndex: 7,
    requiredData: ['bio'],
    defaultProps: {
      showMap: true,
      showContact: true,
      showHours: true,
      showAddressOverlay: true,
    },
  },
  {
    id: 'bio-preview',
    componentId: 'BioPreview',
    label: 'Bio Preview',
    description: 'Truncated professional bio with read-more toggle',
    category: 'content',
    component: BioPreview,
    defaultPosition: createPosition(10, 50, 80, 20),
    allowMultiple: false,
    zIndex: 2,
    requiredData: ['bio'],
    defaultProps: {
      maxLength: 200,
    },
  },
  {
    id: 'overview-stats',
    componentId: 'OverviewStats',
    label: 'Overview Stats',
    description: 'Professional stats: experience, rating, services count, promotions',
    category: 'info',
    component: OverviewStats,
    defaultPosition: createPosition(10, 40, 80, 20),
    allowMultiple: false,
    zIndex: 2,
    requiredData: [],
  },
  {
    id: 'business-hours',
    componentId: 'BusinessHours',
    label: 'Business Hours',
    description: 'Operating hours in table format',
    category: 'info',
    component: BusinessHours,
    defaultPosition: createPosition(10, 75, 80, 15),
    allowMultiple: false,
    zIndex: 2,
    requiredData: ['businessHours'],
  },
];

// =============================================================================
// CONDENSED CARD SECTIONS
// =============================================================================

export const CONDENSED_CARD_SECTIONS: SectionRegistryItem[] = [
  {
    id: 'headerAndBio',
    componentId: 'HeaderAndBio',
    label: 'Header and Bio',
    description: 'Circular profile image with name, title, business, and bio',
    category: 'content',
    component: HeaderAndBio,
    defaultPosition: createPosition(0, 0, 100, 40),
    allowMultiple: false,
    zIndex: 1,
    requiredData: ['profileImage', 'name'],
    defaultProps: {
      bioItalic: true,
      showVerifiedBadge: true,
      imageSize: 80,
      nameFontSize: '1.25rem',
      titleFontSize: '1rem',
      bioFontSize: '0.875rem',
    },
  },
  {
    id: 'map',
    componentId: 'MapSection',
    label: 'Map',
    description: 'Google Maps location display',
    category: 'info',
    component: MapSection,
    defaultPosition: createPosition(0, 40, 100, 25),
    allowMultiple: false,
    zIndex: 1,
    requiredData: ['locationData'],
    defaultProps: {
      showAddressOverlay: false,
      showAddressBelowMap: false,
    },
  },
  {
    id: 'mapWithHours',
    componentId: 'MapWithHours',
    label: 'Map with Hours',
    description: 'Map with business hours below',
    category: 'info',
    component: MapWithHours,
    defaultPosition: createPosition(0, 40, 100, 35),
    allowMultiple: false,
    zIndex: 1,
    requiredData: ['locationData', 'businessHours'],
    defaultProps: {
      showAddressOverlay: false,
    },
  },
  {
    id: 'footer',
    componentId: 'FooterSection',
    label: 'Footer',
    description: 'Glamlink app link + social media icons (Instagram, TikTok, Website)',
    category: 'info',
    component: FooterSection,
    defaultPosition: createPosition(0, 90, 100, 10),
    allowMultiple: false,
    zIndex: 10,
    defaultProps: {
      iconSize: 32,
      spacing: 24,
    },
  },
  {
    id: 'quick-actions-line',
    componentId: 'QuickActionsLine',
    label: 'Quick Actions (Line)',
    description: 'Horizontal clickable images with decorative lines (up to 3 images)',
    category: 'actions',
    component: QuickActionsLine,
    defaultPosition: createPosition(0, 85, 100, 8),
    allowMultiple: false,
    zIndex: 8,
    defaultProps: {
      button1Image: '',
      button1Url: '',
      button2Image: '',
      button2Url: '',
      button3Image: '',
      button3Url: '',
      imageSize: 32,
      showDecorativeLines: true,
      buttonSpacing: 12,
    },
  },
  {
    id: 'custom',
    componentId: 'CustomSection',
    label: 'Custom Section',
    description: 'Compose with Text, Image, and Link objects',
    category: 'content',
    component: CustomSection,
    defaultPosition: createPosition(0, 0, 100, 20),
    allowMultiple: false, // Can add multiple custom sections
    zIndex: 5,
    defaultProps: {},
  },
  {
    id: 'contentContainer',
    componentId: 'ContentContainer',
    label: 'Content with Container',
    description: 'Wrap any section in a styled container with customizable title',
    category: 'content',
    component: ContentContainer,
    defaultPosition: createPosition(10, 10, 80, 30),
    allowMultiple: false,
    zIndex: 5,
    defaultProps: {
      title: '',
      titleAlignment: 'center-with-lines',
      titleTypography: {},
      innerSectionType: null,
      innerSectionProps: {},
      containerBackground: '#ffffff',
      borderRadius: 12,
      padding: 16,
      sectionBackground: '#ffffff',
      sectionBorderRadius: 8,
      sectionPadding: 12,
    },
  },
  {
    id: 'mapAndContentContainer',
    componentId: 'MapAndContentContainer',
    label: 'Map with Content Container',
    description: 'Google Map at top with styled content container below',
    category: 'content',
    component: MapAndContentContainer,
    defaultPosition: createPosition(5, 5, 90, 50),
    allowMultiple: false,
    zIndex: 5,
    requiredData: ['locationData'],
    defaultProps: {
      // Map settings
      mapHeight: 150,
      mapBorderRadius: 8,
      showAddressOverlay: false,
      // Title settings
      title: '',
      titleAlignment: 'center-with-lines',
      titleTypography: {},
      // Inner section
      innerSectionType: null,
      innerSectionProps: {},
      // Outer container styling
      containerBackground: '#ffffff',
      borderRadius: 12,
      padding: 16,
      // Inner section styling
      sectionBackground: '#ffffff',
      sectionBorderRadius: 8,
      sectionPadding: 12,
    },
  },
  {
    id: 'dropshadowContainer',
    componentId: 'DropshadowContainer',
    label: 'Dropshadow Container',
    description: 'Styled container with customizable drop shadow effect',
    category: 'content',
    component: DropshadowContainer,
    defaultPosition: createPosition(10, 10, 80, 30),
    allowMultiple: false,
    zIndex: 5,
    defaultProps: {
      // Shadow properties
      shadowOffsetX: 4,
      shadowOffsetY: 4,
      shadowBlur: 12,
      shadowSpread: 0,
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      // Border properties - default to NO border (just dropshadow)
      borderColor: '#e5e7eb',
      borderWidth: 0,
      // Container properties
      containerBackground: '#ffffff',
      borderRadius: 12,
    },
  },
];
