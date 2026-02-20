// Profile tabs configuration
export interface ProfileTabSubsection {
  id: string;           // Subsection identifier (e.g., 'dashboard', 'campaigns')
  title: string;        // Display name
  isVisible: boolean;   // Subsection visibility
}

export interface ProfileTabConfig {
  id: string;                       // Unique identifier (e.g., 'marketing', 'orders')
  name: string;                     // Display name for admin UI
  description: string;              // Explanation of what the tab contains
  isVisible: boolean;               // Tab visibility state
  subsections: ProfileTabSubsection[]; // Nested subsections with individual visibility
}

// Default profile tabs settings
export const defaultProfileTabs: ProfileTabConfig[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing dashboard, campaigns, attribution, and automations',
    isVisible: false,
    subsections: [
      { id: 'dashboard', title: 'Dashboard', isVisible: true },
      { id: 'campaigns', title: 'Campaigns', isVisible: true },
      { id: 'attribution', title: 'Attribution', isVisible: true },
      { id: 'automations', title: 'Automations', isVisible: true }
    ]
  },
  {
    id: 'orders',
    name: 'Orders',
    description: 'Order management and creation',
    isVisible: false,
    subsections: [
      { id: 'dashboard', title: 'All Orders', isVisible: true },
      { id: 'create', title: 'Create Order', isVisible: true }
    ]
  },
  {
    id: 'customers',
    name: 'Customers',
    description: 'Customer management and profiles',
    isVisible: false,
    subsections: [
      { id: 'dashboard', title: 'All Customers', isVisible: true },
      { id: 'add', title: 'Add Customer', isVisible: true }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial overview, payouts, transactions, and tax filing',
    isVisible: false,
    subsections: [
      { id: 'overview', title: 'Overview', isVisible: true },
      { id: 'payouts', title: 'Payouts', isVisible: true },
      { id: 'transactions', title: 'Transactions', isVisible: true },
      { id: 'tax', title: 'Tax Filing', isVisible: true }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Files and blog post management',
    isVisible: false,
    subsections: [
      { id: 'files', title: 'Files', isVisible: true },
      { id: 'blog', title: 'Blog Posts', isVisible: true }
    ]
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Profile and account settings',
    isVisible: false,
    subsections: [
      { id: 'profile', title: 'Profile', isVisible: true },
      { id: 'account', title: 'Account', isVisible: true },
      { id: 'security', title: 'Security', isVisible: true },
      { id: 'preferences', title: 'Preferences', isVisible: true },
      { id: 'verification', title: 'Business Verification', isVisible: true },
      { id: 'privacy', title: 'Privacy Settings', isVisible: true },
      { id: 'brand-settings', title: 'Brand Settings', isVisible: true },
      { id: 'professional', title: 'Professional Display', isVisible: true },
      { id: 'notifications', title: 'Notification Preferences', isVisible: true },
      { id: 'communication', title: 'Communication', isVisible: true },
      { id: 'support-bot', title: 'AI Support Bot', isVisible: true },
      { id: 'messages', title: 'Messages', isVisible: true },
      { id: 'account-management', title: 'Account Management', isVisible: true },
      { id: 'session', title: 'Session', isVisible: true }
    ]
  }
];
