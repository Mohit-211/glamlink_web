import { BaseSectionStyling } from '../fields/typography';

export interface TopProductSpotlightContent extends BaseSectionStyling {
  type: 'top-product-spotlight';
  productName: string;
  productNameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  productImage: string;
  brandName: string;
  brandNameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  keyFeatures?: string[];
  keyFeaturesTitle?: string;
  keyFeaturesTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  ingredients?: string[];
  ingredientsTitle?: string;
  ingredientsTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  isBestseller?: boolean;
  bestsellerLabel?: string;
  proRecommendation?: {
    proName: string;
    proImage?: string;
    quote: string;
  };
  reviewHighlights?: string[];
  reviewHighlightsTitle?: string;
  reviewHighlightsTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  unitsSold?: number;
  rating?: number;
  reviewCount?: number;
  shopLink?: string;
  qrCode?: string;
  similarProducts?: {
    id: string;
    name: string;
    image: string;
    price: number;
    link?: string;
  }[];
  similarProductsTitle?: string;
  similarProductsTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    alignment?: string;
  };
  ctaButtonText?: string;
  ctaButtonLink?: string | { url: string; action?: 'link' | 'pro-popup' | 'user-popup' };
}