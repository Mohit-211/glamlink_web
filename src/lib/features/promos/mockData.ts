import { PromoItem } from './config';

// Generate a date string X days from now
const getDateFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Generate a date string X days ago
const getDateAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Mock promo data for development and testing
export const mockPromos: PromoItem[] = [
  {
    id: "parie-laser-removal-giveaway",
    title: "Laser Hair Removal Giveaway",
    subtitle: "Parie Medical Spa",
    descriptionShort: "Our latest cover in The Glamlink Edit, Parie Medical Spa, has teamed up with Glamlink to offer 1 winner a small area laser hair removal package.",
    description: `<p>Our latest cover in The Glamlink Edit, the beautiful Parie Medical Spa has teamed up with Glamlink to offer 1 winner a small area laser hair removal package.</p>
<h3 class="text-lg font-semibold text-gray-900 mb-2 mt-6">How to enter:</h3>
<ol class="list-decimal list-inside space-y-1 ml-4">
  <li>Download Glamink (user) or Glamlink Pro on the App Store. Sign up with code: <span class="font-semibold">glampariemedspa</span></li>
  <li>Follow <span class="font-semibold">@pariemedspa</span> on Glamlink</li>
  <li>Comment done "Parie" on their post</li>
</ol>
<p class="mt-4">Eligibility: 18+, must be a candidate for laser hair removal, no purchase necessary</p>

<p class="mt-4">Winner Announced Monday Nov 3</p>`,
    modalContentHeader: "About This Offer",
    image: "/images/free-laser-hair-removal.png",
    link: "https://linktr.ee/glamlink_app",
    ctaText: "Enter Giveaway",
    startDate: "2025-10-07",
    endDate: "2025-11-03", // Friday, November 3
    popupDisplay: "Laser Hair Removal Giveaway",
    visible: true,
    featured: true,
    category: "Giveaway Partnered with Parie Medical Spa",
    discount: undefined,
    modalStatusBadge: "Sign Up Now",
    modalCategoryBadge: "Giveaway",
    priority: 10,
    createdAt: getDateAgo(10),
    updatedAt: getDateAgo(1)
  },
  {
    id: "amazon-gift-card-giveaway",
    title: "$100 Amazon Gift Card Giveaway",
    subtitle: "Gift Card",
    descriptionShort: "Vegas Beauty & Wellness Professionals - your app is here!  Glamlink helps clients find you by location, services and specialty.  Be among the first 100 to earn a Founders Badge.  Every month we will be picking one winner for $100 Amazon Gift Card.",
    description: `<ol class="list-decimal list-inside space-y-1 ml-4">
  <li>Download Glamlink Pro on App Store</li>
  <li>Add at least 1 post, clip, photo album</li>
  <li>Set up your hours & services</li>
  <li>Add in-app booking or your own booking link at <a href="http://www.crm.glamlink.net" class="text-blue-600 hover:underline">www.crm.glamlink.net</a></li>
  <li>Share you joined Glamlink and tag <span class="font-semibold">@glamlink_app</span> on IG</li>
</ol>
<p class="mt-4">BONUS: Not only do you receive a Founders Badge but you can have the chance of being featured in our digital magazine, The Glamlink Edit.</p>
<p class="mt-4">Winner Announced Monday Nov 10</p>`,
    modalContentHeader: "How to enter",
    image: "/images/amazon_card_2.png",
    link: "https://linktr.ee/glamlink_app",
    ctaText: "Sign Up & Post",
    startDate: "2025-10-13",
    endDate: "2025-11-11",
    popupDisplay: "$100 Gift Card Giveaway",
    visible: true,
    featured: true,
    category: "Gift Cards",
    discount: undefined,
    modalStatusBadge: "Sign Up Now",
    modalCategoryBadge: "Giveaway",
    priority: 9,
    createdAt: getDateAgo(5),
    updatedAt: getDateAgo(1)
  }
];

// Helper function to get mock promos (can be filtered)
export const getMockPromos = (filters?: {
  featured?: boolean;
  visible?: boolean;
  category?: string;
  active?: boolean;
}): PromoItem[] => {
  let filtered = [...mockPromos];

  if (filters?.featured !== undefined) {
    filtered = filtered.filter(promo => promo.featured === filters.featured);
  }

  if (filters?.visible !== undefined) {
    filtered = filtered.filter(promo => promo.visible === filters.visible);
  }

  if (filters?.category && filters.category !== "All") {
    filtered = filtered.filter(promo => promo.category === filters.category);
  }

  if (filters?.active !== undefined) {
    const now = new Date();
    filtered = filtered.filter(promo => {
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      return filters.active ? (now >= startDate && now <= endDate) : true;
    });
  }

  // Sort by priority (highest first) then by end date (soonest ending first)
  return filtered.sort((a, b) => {
    const aPriority = a.priority || 0;
    const bPriority = b.priority || 0;
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
  });
};

// Get featured promos only
export const getMockFeaturedPromos = (): PromoItem[] => {
  return getMockPromos({ featured: true, visible: true, active: true });
};

// Get all active promos
export const getMockActivePromos = (): PromoItem[] => {
  return getMockPromos({ visible: true, active: true });
};

// Get promo by ID
export const getMockPromoById = (id: string): PromoItem | null => {
  return mockPromos.find(promo => promo.id === id) || null;
};