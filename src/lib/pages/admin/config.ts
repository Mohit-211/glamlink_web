// Admin Configuration and Type Definitions

export interface AdminStateInterface {
  activeTab: AdminTab;
  isLoading: boolean;
  error: string | null;
  stats: AdminStats;
}

export type AdminTab = 'overview' | 'products' | 'providers' | 'professionals' | 'training' | 'reviews' | 'settings' | 'profile' | 'brainstorm';

export interface AdminStats {
  totalProducts: number;
  totalProviders: number;
  totalProfessionals: number;
  totalTrainingPrograms: number;
  totalReviews: number;
}

export interface AdminTabConfig {
  key: AdminTab;
  label: string;
  icon: string;
  description: string;
}

// All available tabs
export const ALL_ADMIN_TABS: AdminTabConfig[] = [
  {
    key: 'overview',
    label: 'Overview',
    icon: 'ChartBarIcon',
    description: 'Dashboard overview and statistics'
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: 'UserIcon',
    description: 'Manage your brand profile'
  },
  {
    key: 'products',
    label: 'Products',
    icon: 'ShoppingBagIcon',
    description: 'Manage beauty products'
  },
  {
    key: 'providers',
    label: 'Providers',
    icon: 'UserGroupIcon',
    description: 'Manage certified providers'
  },
  {
    key: 'professionals',
    label: 'Professionals',
    icon: 'BriefcaseIcon',
    description: 'Manage beauty professionals'
  },
  {
    key: 'training',
    label: 'Training',
    icon: 'AcademicCapIcon',
    description: 'Manage training programs'
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: 'StarIcon',
    description: 'Manage customer reviews'
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'CogIcon',
    description: 'Database and system settings'
  },
  {
    key: 'brainstorm',
    label: 'Brainstorm',
    icon: 'LightBulbIcon',
    description: 'AI-powered ideas and research'
  }
];

// Function to get tabs based on user type
export function getAdminTabsForUser(email: string): AdminTabConfig[] {
  // Super admin sees only settings
  if (email === 'admin@glamlink.net') {
    return ALL_ADMIN_TABS.filter(tab => tab.key === 'settings');
  }
  
  // Brand owners see everything except settings
  return ALL_ADMIN_TABS.filter(tab => tab.key !== 'settings');
}

// Legacy export for backward compatibility
export const ADMIN_TABS = ALL_ADMIN_TABS;