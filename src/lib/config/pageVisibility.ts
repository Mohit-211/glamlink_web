// Page visibility configuration
export interface PageConfig {
  path: string;
  name: string;
  description: string;
  isVisible: boolean;
}

// Default page visibility settings
export const defaultPageVisibility: PageConfig[] = [
  {
    path: "/for-clients",
    name: "For Clients",
    description: "Information for beauty service clients",
    isVisible: false,
  },
  {
    path: "/for-professionals",
    name: "For Professionals",
    description: "Resources for beauty professionals",
    isVisible: false,
  },
  {
    path: "/for-professionals/[id]",
    name: "Professional Detail Pages (Legacy)",
    description: "Individual professional profile pages at /for-professionals/[id] (deprecated)",
    isVisible: true,
  },
  {
    path: "/[id]",
    name: "Professional Detail Pages",
    description: "Individual professional profile pages (Digital Business Cards) at root level",
    isVisible: true,
  },
  {
    path: "/[id]/edit",
    name: "Professional Edit Pages",
    description: "Professional edit pages accessed via magic link",
    isVisible: true,
  },
  {
    path: "/apply/featured",
    name: "Get Featured",
    description: "Application for featured placement in Glamlink magazine",
    isVisible: true,
  },
  {
    path: "/apply/digital-card",
    name: "Get Digital Card",
    description: "Application for professional digital business card",
    isVisible: true,
  },
  {
    path: "/magazine",
    name: "Magazine",
    description: "Magazine viewing experience with thumbnail navigation",
    isVisible: true,
  },
  {
    path: "/magazine/[id]",
    name: "Magazine Issue Pages",
    description: "Individual magazine issue pages with single-page navigation",
    isVisible: true,
  },
  {
    path: "/promos",
    name: "Promos",
    description: "Promotional campaigns and special offers",
    isVisible: true,
  },
  {
    path: "/services",
    name: "Services",
    description: "Browse all beauty and wellness services",
    isVisible: true,
  },
  {
    path: "/services/[treatment]",
    name: "Treatment Pages",
    description: "Individual treatment pages with professional listings",
    isVisible: true,
  },
  {
    path: "/services/location/[location]",
    name: "Location Pages",
    description: "City directory pages showing local professionals",
    isVisible: true,
  },
  {
    path: "/services/[treatment]/[location]",
    name: "Treatment + Location Pages",
    description: "Treatment pages filtered by location (e.g., Lip Blush in Las Vegas)",
    isVisible: true,
  },
  {
    path: "/faqs",
    name: "FAQs",
    description: "Frequently asked questions",
    isVisible: false,
  },
  {
    path: "/terms",
    name: "Terms of Service",
    description: "Legal terms and conditions",
    isVisible: false,
  },
  {
    path: "/privacy",
    name: "Privacy Policy",
    description: "Privacy and data protection policy",
    isVisible: false,
  },
];

// Pages that should always be accessible
export const alwaysVisiblePages = ["/", "/profile/login", "/profile/signup", "/admin", "/brand", "/profile", "/image-analysis", "/api", "/promos", "/media"];
