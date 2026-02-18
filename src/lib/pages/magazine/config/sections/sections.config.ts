import { MagazineSectionId, SectionConfig } from "../../types/magazine";

export const MAGAZINE_SECTIONS: Record<MagazineSectionId, SectionConfig> = {
  "trending-profiles": {
    id: "trending-profiles",
    title: "Trending Profiles",
    description: "Discover top-rated beauty professionals making waves in the industry",
    icon: "⭐",
    businessValue: "Drives provider bookings and brand awareness through social proof",
  },
  "new-products": {
    id: "new-products",
    title: "New Products",
    description: "Fresh arrivals from top beauty brands in the last 30 days",
    icon: "✨",
    businessValue: "Showcases latest inventory to drive immediate purchase decisions",
  },
  "product-highlights": {
    id: "product-highlights",
    title: "Product Highlights",
    description: "Featured products handpicked for their exceptional quality and innovation",
    icon: "💎",
    businessValue: "Promotes high-margin spotlight products for increased revenue",
  },
  "beauty-lab": {
    id: "beauty-lab",
    title: "Beauty Lab: Clinical Trials",
    description: "Real-time clinical testing results with scientific data and dermatologist reviews",
    icon: "💊",
    businessValue: "Clinical skincare market projected to reach $62.4B by 2034",
  },
  "ugc-spotlight": {
    id: "ugc-spotlight",
    title: "UGC Spotlight",
    description: "Real customer reviews, transformations, and video testimonials",
    icon: "📱",
    businessValue: "UGC is 8.7x more powerful than influencer content for conversions",
  },
  "beauty-box": {
    id: "beauty-box",
    title: "Beauty Box Subscriptions",
    description: "Monthly curated selections with AI-powered personalization",
    icon: "📦",
    businessValue: "Subscription businesses grow 5-8x faster than traditional models",
  },
  "gen-z-trends": {
    id: "gen-z-trends",
    title: "Gen Alpha & Gen Z Trends",
    description: "Teen-approved products, TikTok trends, and affordable dupes",
    icon: "🌟",
    businessValue: "Gen Alpha households drive 49% of skincare growth",
  },
  "ai-advisor": {
    id: "ai-advisor",
    title: "AI Beauty Advisor",
    description: "Virtual skin analysis and personalized product recommendations",
    icon: "🤖",
    businessValue: "77% of professionals see AI as key for personalization",
  },
  sustainable: {
    id: "sustainable",
    title: "Sustainable Beauty",
    description: "Eco-friendly products, refillables, and zero-waste routines",
    icon: "🌱",
    businessValue: "67.7% value sustainability, 56.2% will pay premium",
  },
  investment: {
    id: "investment",
    title: "Beauty Investment Calculator",
    description: "Track ROI, cost-per-use, and product longevity ratings",
    icon: "💰",
    businessValue: "Helps justify premium purchases and builds customer lifetime value",
  },
  "live-commerce": {
    id: "live-commerce",
    title: "Live Commerce Hub",
    description: "Live shopping events, demonstrations, and flash sales",
    icon: "🛍️",
    businessValue: "Social commerce to reach $79.64 billion by 2025",
  },
  science: {
    id: "science",
    title: "Beauty Science Simplified",
    description: "Ingredient insights, myth-busting, and research summaries",
    icon: "🔬",
    businessValue: "Clinical positioning drives purchase decisions and trust",
  },
  "multi-gen": {
    id: "multi-gen",
    title: "Multi-Generational Beauty",
    description: "Family-friendly routines and age-appropriate recommendations",
    icon: "👨‍👩‍👧‍👦",
    businessValue: "Expands market reach to entire households",
  },
};

// Default sections to show
export const DEFAULT_SECTIONS: MagazineSectionId[] = ["trending-profiles", "new-products", "product-highlights"];

// Maximum sections that can be selected
export const MAX_SECTIONS = 3;
