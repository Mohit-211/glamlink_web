"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface ProRecommendation {
  proName?: string;
  quote?: string;
  proImage?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
}

interface ProductDetailsProps {
  // Product Info
  name?: string;
  productName?: string; // Alternative field name
  productNameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  brand?: string;
  brandName?: string; // Alternative field name
  brandNameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  
  // Pricing
  price?: string;
  originalPrice?: string;
  discount?: number;
  
  // Badges
  isBestseller?: boolean;
  bestsellerLabel?: string;
  
  // Main Content
  description?: string;
  image?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  imageAutoHeight?: boolean;
  
  // Features & Ingredients
  keyFeatures?: string[];
  keyFeaturesTitle?: string;
  keyFeaturesTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
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
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  
  // Reviews & Recommendations
  reviewHighlights?: string[];
  reviewHighlightsTitle?: string;
  reviewHighlightsTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  proRecommendation?: ProRecommendation;
  
  // Stats
  rating?: number;
  reviewCount?: number;
  unitsSold?: string;
  
  // Actions
  shopLink?: string;
  qrCode?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  
  // Legacy fields
  benefits?: string[]; // Keep for backward compatibility
  usage?: string;
  
  // Styling
  backgroundColor?: string;
  className?: string;
}

export default function ProductDetails({
  name,
  productName,
  productNameTypography,
  brand,
  brandName,
  brandNameTypography,
  price,
  originalPrice,
  discount,
  isBestseller,
  bestsellerLabel,
  description,
  image,
  imageAutoHeight,
  keyFeatures,
  keyFeaturesTitle,
  keyFeaturesTitleTypography,
  ingredients,
  ingredientsTitle,
  ingredientsTitleTypography,
  reviewHighlights,
  reviewHighlightsTitle,
  reviewHighlightsTitleTypography,
  proRecommendation,
  rating,
  reviewCount,
  unitsSold,
  shopLink,
  qrCode,
  benefits,
  usage,
  backgroundColor,
  className = ""
}: ProductDetailsProps) {
  const imageUrl = image ? getImageUrl(image) : null;
  const objectFit = image ? getImageObjectFit(image as any) : 'cover';
  const objectPosition = image ? getImageObjectPosition(image as any) : 'center';
  const displayBrand = brandName || brand;
  const displayName = productName || name; // Use productName if available, fallback to name
  const displayFeatures = keyFeatures || benefits; // Use keyFeatures if available, fallback to benefits
  
  // Helper function to build typography classes
  const getTypographyClasses = (typography: any, defaults: string = "") => {
    if (!typography) return defaults;
    const classes = [];
    if (typography.fontSize) classes.push(typography.fontSize);
    if (typography.fontFamily) classes.push(typography.fontFamily);
    if (typography.fontWeight) classes.push(typography.fontWeight);
    if (typography.fontStyle) classes.push(typography.fontStyle);
    if (typography.textDecoration) classes.push(typography.textDecoration);
    if (typography.color) classes.push(typography.color);
    if (typography.alignment === "center") classes.push("text-center");
    if (typography.alignment === "right") classes.push("text-right");
    if (typography.alignment === "justify") classes.push("text-justify");
    return classes.join(" ") || defaults;
  };
  
  // Determine background
  const backgroundStyle: React.CSSProperties = {};
  let backgroundClass = "bg-white";
  
  if (backgroundColor) {
    if (backgroundColor.startsWith("#") || backgroundColor.startsWith("rgb")) {
      backgroundStyle.backgroundColor = backgroundColor;
      backgroundClass = "";
    } else if (backgroundColor.startsWith("linear-gradient") || backgroundColor.startsWith("radial-gradient")) {
      backgroundStyle.background = backgroundColor;
      backgroundClass = "";
    } else if (backgroundColor.startsWith("bg-")) {
      backgroundClass = backgroundColor;
    }
  }
  
  return (
    <div className={`${backgroundClass} rounded-xl shadow-sm overflow-hidden ${className}`} style={backgroundStyle}>
      <div className="flex flex-col">
        {/* Image with badges */}
        {imageUrl && (
          imageAutoHeight ? (
            // Auto height mode: Natural aspect ratio
            <div className="relative w-full bg-gray-100">
              <img
                src={imageUrl}
                alt={displayName || "Product"}
                className="w-full h-auto"
                style={{
                  display: "block",
                  objectPosition
                }}
              />
              
              {/* Bestseller Badge */}
              {isBestseller && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-900 rounded-full text-sm font-bold shadow-lg">
                  <span className="text-base">⭐</span>
                  <span>{bestsellerLabel || 'BESTSELLER'}</span>
                </div>
              )}
              
              {/* Discount Badge */}
              {discount && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                  {discount}% OFF
                </div>
              )}
            </div>
          ) : (
            // Fixed height mode: Current behavior
            <div className="relative w-full h-64 md:h-96 bg-gray-100">
              <Image
                src={imageUrl}
                alt={displayName || "Product"}
                fill
                className="object-center"
                style={{ 
                  objectFit: objectFit as any,
                  objectPosition
                }}
              />
            
              {/* Bestseller Badge */}
              {isBestseller && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-900 rounded-full text-sm font-bold shadow-lg">
                  <span className="text-base">⭐</span>
                  <span>{bestsellerLabel || 'BESTSELLER'}</span>
                </div>
              )}
              
              {/* Discount Badge */}
              {discount && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                  {discount}% OFF
              </div>
              )}
            </div>
          )
        )}
        
        <div className="p-6">
          {/* Product Name */}
          {displayName && (
            <h3 className={`mb-2 ${getTypographyClasses(
              productNameTypography,
              "text-2xl font-bold text-gray-900"
            )}`}>
              {displayName}
            </h3>
          )}

          {/* Brand Name */}
          {displayBrand && (
            <p className={getTypographyClasses(
              brandNameTypography,
              "text-sm text-gray-600 uppercase tracking-wide mb-1"
            )}>
              {displayBrand}
            </p>
          )}
                    
          {/* Price & Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline gap-3">
              {price && (
                <span className="text-2xl font-bold text-glamlink-teal">
                  {price.startsWith('$') ? price : `$${price}`}
                </span>
              )}
              {originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice.startsWith('$') ? originalPrice : `$${originalPrice}`}
                </span>
              )}
            </div>
            {rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                {reviewCount && (
                  <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
                )}
              </div>
            )}
          </div>
          
          {/* Description */}
          {description && (
            <div 
              className="text-gray-700 mb-6 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          
          {/* Key Features */}
          {displayFeatures && displayFeatures.length > 0 && (
            <div className="mb-6">
              <h4 className={`mb-3 ${getTypographyClasses(
                keyFeaturesTitleTypography,
                "font-bold text-gray-900"
              )}`}>
                {keyFeaturesTitle || "Why We Love It:"}
              </h4>
              <ul className="space-y-2">
                {displayFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-900 mr-2">★</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Ingredients */}
          {ingredients && ingredients.length > 0 && (
            <div className="mb-6">
              <h4 className={`mb-3 ${getTypographyClasses(
                ingredientsTitleTypography,
                "font-bold text-gray-900"
              )}`}>
                {ingredientsTitle || "Key Ingredients:"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-900"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Pro Recommendation */}
          {proRecommendation && proRecommendation.quote && (
            <div className="mb-6 p-4 rounded-lg bg-glamlink-teal/5">
              <div className="flex items-start">
                {proRecommendation.proImage && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image
                      src={getImageUrl(proRecommendation.proImage)}
                      alt={proRecommendation.proName || "Professional"}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: getImageObjectPosition(proRecommendation.proImage as any)
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  {proRecommendation.proName && (
                    <div className="font-medium mb-1 text-gray-900">
                      {proRecommendation.proName}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 italic">
                    "{proRecommendation.quote}"
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Customer Reviews */}
          {reviewHighlights && reviewHighlights.length > 0 && (
            <div className="mb-6">
              <h4 className={`mb-3 ${getTypographyClasses(
                reviewHighlightsTitleTypography,
                "font-bold text-gray-900"
              )}`}>
                {reviewHighlightsTitle || "What Customers Say:"}
              </h4>
              <div className="space-y-2">
                {reviewHighlights.map((review, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">⭐</span>
                    <span className="text-sm text-gray-700 italic">"{review}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Stats */}
          {(unitsSold || (rating && !reviewCount)) && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {unitsSold && (
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-glamlink-teal">
                    {unitsSold}+
                  </div>
                  <div className="text-sm text-gray-600">Units Sold</div>
                </div>
              )}
              {rating && !reviewCount && (
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-glamlink-gold">
                    {rating} ⭐
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              )}
            </div>
          )}
          
          {/* How to Use (legacy) */}
          {usage && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-1">How to Use</h4>
              <p className="text-gray-700 text-sm">{usage}</p>
            </div>
          )}
          
          {/* CTA */}
          <div className="flex gap-4">
            {shopLink && (
              <Link
                href={shopLink}
                className="flex-1 text-center px-6 py-3 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-purple transition-colors font-medium"
              >
                Shop Now
              </Link>
            )}
            {qrCode && (
              <div className="w-24 h-24 bg-white rounded-lg p-2 border">
                <Image
                  src={getImageUrl(qrCode)}
                  alt="QR Code"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}