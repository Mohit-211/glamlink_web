// Base Product type for magazine sections
export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients?: string[];
  benefits?: string[];
  inStock?: boolean;
  isSpotlight?: boolean;
  createdAt?: string;
}

// New section data types
export interface ClinicalTrial {
  id: string;
  productName: string;
  productId: string;
  brandName: string;
  brandId: string;
  duration: string;
  participants: number;
  results: {
    metric: string;
    improvement: string;
    timeframe: string;
  }[];
  dermatologistReview?: string;
  beforeAfterImages?: {
    before: string;
    after: string;
  };
  clinicalRating: number;
}

export interface UserGeneratedContent {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  contentType: "review" | "video" | "transformation" | "tutorial";
  title: string;
  content: string;
  mediaUrl?: string;
  productIds: string[];
  likes: number;
  comments: number;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface BeautyBoxSubscription {
  id: string;
  name: string;
  price: number;
  frequency: "monthly" | "quarterly" | "bi-annual";
  description: string;
  includedBrands: string[];
  productCount: number;
  personalizationLevel: "basic" | "advanced" | "ai-powered";
  benefits: string[];
  image: string;
}

export interface YouthTrendItem {
  id: string;
  name: string;
  category: string;
  price: number;
  trendingOn: string[]; // ['tiktok', 'instagram', 'youtube']
  ageGroup: "gen-alpha" | "gen-z" | "both";
  viralityScore: number;
  dupeFor?: string; // luxury product it's a dupe for
  image: string;
  brandName: string;
  brandId: string;
}

export interface SustainableProduct extends BaseProduct {
  sustainabilityScore: number;
  ecoFeatures: string[];
  carbonFootprint: string;
  refillable: boolean;
  packaging: string;
  certifications: string[];
  brandName: string;
  brandId: string;
}

export interface BeautyInvestment {
  productId: string;
  productName: string;
  price: number;
  costPerUse: number;
  longevityDays: number;
  roi: string;
  comparisons: {
    alternativeName: string;
    alternativePrice: number;
    savingsPerYear: number;
  }[];
}

export interface LiveCommerceEvent {
  id: string;
  title: string;
  hostName: string;
  hostImage: string;
  startTime: string;
  duration: string;
  productIds: string[];
  viewerCount: number;
  discountPercentage: number;
  status: "upcoming" | "live" | "ended";
  streamUrl?: string;
}
