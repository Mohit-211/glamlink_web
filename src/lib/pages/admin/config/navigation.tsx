/**
 * Admin navigation configuration
 *
 * Defines sidebar navigation items and groups for the admin panel.
 * Badge keys are used to dynamically assign badge counts from hooks.
 */

import {
  HomeIcon,
  GiftIcon,
  StarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EmailIcon,
  ChartBarIcon,
} from '@/lib/pages/admin/components/shared/common';

// Messages Icon - inline since it's unique to navigation
const MessagesIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

// Settings icon - inline since it's unique to navigation
const SettingsIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/** Badge key types for dynamic badge assignment */
export type BadgeKey = 'messages' | 'formSubmissions';

/** Navigation item configuration without runtime state */
export interface NavItemConfig {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Key for dynamic badge counts from hooks */
  badgeKey?: BadgeKey;
}

/** Navigation group with items */
export interface NavGroupConfig {
  name: string;
  items: NavItemConfig[];
}

/**
 * Standalone navigation items (not in groups)
 * These appear at the top of the sidebar
 */
export const STANDALONE_NAVIGATION: NavItemConfig[] = [
  {
    name: "Overview",
    href: "/admin",
    icon: HomeIcon,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: MessagesIcon,
    badgeKey: 'messages',
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: ChartBarIcon,
  },
];

/**
 * Grouped navigation items
 * Each group has a collapsible header
 */
export const NAV_GROUPS: NavGroupConfig[] = [
  {
    name: "To Do",
    items: [
      {
        name: "Verification",
        href: "/admin/verification",
        icon: StarIcon,
      },
      {
        name: "Orders",
        href: "/admin/crm/orders",
        icon: DocumentTextIcon,
      },
    ],
  },
  {
    name: "Content",
    items: [
      {
        name: "Professionals",
        href: "/admin/professionals",
        icon: UserGroupIcon,
      },
      {
        name: "Promos",
        href: "/admin/promos",
        icon: GiftIcon,
      },
      {
        name: "Magazine",
        href: "/admin/magazine",
        icon: DocumentTextIcon,
      },
      {
        name: "Emails",
        href: "/admin/emails",
        icon: EmailIcon,
      },
      {
        name: "Form Submissions",
        href: "/admin/form-submissions",
        icon: StarIcon,
        badgeKey: 'formSubmissions',
      },
    ],
  },
  {
    name: "Settings",
    items: [
      {
        name: "Website Configuration",
        href: "/admin/content-settings",
        icon: SettingsIcon,
      },
      {
        name: "Profile Settings",
        href: "/admin/settings",
        icon: SettingsIcon,
      },
    ],
  },
];

/**
 * Default expanded state for navigation groups
 */
export const DEFAULT_EXPANDED_GROUPS: Record<string, boolean> = {
  'To Do': true,
  'Content': true,
  'Settings': true,
};
