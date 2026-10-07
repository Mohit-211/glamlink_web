import {
  BarChart3,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  MapPin,
  PenLine,
  QrCode,
  Receipt,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'my-card'
  | 'edit-card'
  | 'analytics'
  | 'payment-history'
  | 'qr-code'
  | 'subscription-plans'
  | 'addresses'
  | 'change-password';

export interface NavItem {
  id: TabId;
  label: string;
  /** Shown under the page title in the header. */
  description: string;
  icon: LucideIcon;
}

export interface NavGroup {
  /** Omitted for the top-level "Overview" entry. */
  label?: string;
  items: NavItem[];
}

// Every entry maps to a tab that PaymentDashboard already renders.
export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', description: 'Your Glamlink at a glance', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Access Card',
    items: [
      { id: 'my-card', label: 'My Access Card', description: 'View and share your public card', icon: CreditCard },
      { id: 'edit-card', label: 'Edit Card', description: 'Update your card details', icon: PenLine },
      { id: 'qr-code', label: 'QR Code', description: 'Share your card in person', icon: QrCode },
      { id: 'analytics', label: 'Analytics', description: 'Views, clicks and visitors', icon: BarChart3 },
    ],
  },
  {
    label: 'Billing',
    items: [
      { id: 'subscription-plans', label: 'Plans', description: 'View or upgrade your plan', icon: Sparkles },
      { id: 'payment-history', label: 'Payment History', description: 'Receipts and subscriptions', icon: Receipt },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'addresses', label: 'Addresses', description: 'Manage saved shipping addresses', icon: MapPin },
      { id: 'change-password', label: 'Change Password', description: 'Keep your account secure', icon: KeyRound },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const findNavItem = (id: TabId): NavItem => NAV_ITEMS.find((n) => n.id === id) ?? NAV_ITEMS[0];

export const findNavGroupLabel = (id: TabId): string | undefined =>
  NAV_GROUPS.find((g) => g.items.some((i) => i.id === id))?.label;

export const getInitials = (name?: string | null): string =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'GL';
