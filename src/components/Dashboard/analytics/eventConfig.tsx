import React from 'react';
import {
  BookOpen,
  CalendarCheck,
  ExternalLink,
  Eye,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Link2,
  Mail,
  MapPin,
  Monitor,
  MousePointerClick,
  Phone,
  Share2,
  Smartphone,
  Star,
  Tablet,
  Tag,
  UserPlus,
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from 'react-icons/fa';
import type { AnalyticsEventType } from './types';
import { capitalize } from './analyticsHelpers';

type IconComponent = React.ComponentType<{ className?: string }>;

interface EventConfig {
  /** Short label for breakdowns ("Website"). */
  label: string;
  /** Activity-feed label ("Website Click"). */
  activityLabel: string;
  icon: IconComponent;
}

export const EVENT_CONFIG: Record<AnalyticsEventType, EventConfig> = {
  ACCESS_CARD_VIEW: { label: 'Card View', activityLabel: 'Card View', icon: Eye },
  WEBSITE_CLICK: { label: 'Website', activityLabel: 'Website Click', icon: Globe },
  BOOKING_CLICK: { label: 'Booking', activityLabel: 'Booking Click', icon: CalendarCheck },
  PHONE_CLICK: { label: 'Phone', activityLabel: 'Phone Click', icon: Phone },
  EMAIL_CLICK: { label: 'Email', activityLabel: 'Email Click', icon: Mail },
  SHARE_CLICK: { label: 'Share', activityLabel: 'Share Click', icon: Share2 },
  SAVE_CONTACT_CLICK: { label: 'Save Contact', activityLabel: 'Save Contact', icon: UserPlus },
  CONNECT_CLICK: { label: 'Connect', activityLabel: 'Connect Click', icon: Link2 },
  INSTAGRAM_CLICK: { label: 'Instagram', activityLabel: 'Instagram Click', icon: FaInstagram },
  TIKTOK_CLICK: { label: 'TikTok', activityLabel: 'TikTok Click', icon: FaTiktok },
  FACEBOOK_CLICK: { label: 'Facebook', activityLabel: 'Facebook Click', icon: FaFacebookF },
  LINKEDIN_CLICK: { label: 'LinkedIn', activityLabel: 'LinkedIn Click', icon: FaLinkedinIn },
  YOUTUBE_CLICK: { label: 'YouTube', activityLabel: 'YouTube Click', icon: FaYoutube },
  OTHER_LINK_CLICK: { label: 'Other Links', activityLabel: 'Other Link Click', icon: ExternalLink },
  FEATURED_LINK_CLICK: { label: 'Featured Links', activityLabel: 'Featured Link Click', icon: Star },
  JOURNAL_CLICK: { label: 'Journal', activityLabel: 'Journal Click', icon: BookOpen },
  LOCATION_CLICK: { label: 'Location', activityLabel: 'Location Click', icon: MapPin },
  IMAGE_CLICK: { label: 'Images', activityLabel: 'Image Click', icon: ImageIcon },
  PROMOTION_CLICK: { label: 'Promotions', activityLabel: 'Promotion Click', icon: Tag },
};

/** "SOME_NEW_CLICK" → "Some New Click" for event types the UI doesn't know yet. */
const humanize = (type: string): string =>
  type
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map(capitalize)
    .join(' ');

export const getEventConfig = (type: string): EventConfig => {
  const known = EVENT_CONFIG[type as AnalyticsEventType];
  if (known) return known;
  const activityLabel = humanize(type) || 'Event';
  return {
    label: activityLabel.replace(/ Click$/, ''),
    activityLabel,
    icon: MousePointerClick,
  };
};

const DEVICE_ICONS: Record<string, IconComponent> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export const getDeviceIcon = (type: string | null | undefined): IconComponent =>
  DEVICE_ICONS[(type ?? '').toLowerCase()] ?? HelpCircle;

export const getDeviceLabel = (type: string | null | undefined): string =>
  capitalize((type || 'unknown').toLowerCase());
