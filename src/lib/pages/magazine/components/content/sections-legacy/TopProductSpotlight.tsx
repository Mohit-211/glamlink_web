"use client";

import Image from "next/image";
import { TopProductSpotlightContent } from "../../../types";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset } from "../../../config/universalStyles";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import { SectionHeader, BackgroundWrapper, CallToAction } from "../shared";
import { ProductDetails, SimilarProducts } from "../top-product-spotlight";
import { useMagazineAnalytics } from "@/lib/features/analytics/hooks/useMagazineAnalytics";

interface TopProductSpotlightProps {
  content: TopProductSpotlightContent;
  title?: string;
  subtitle?: string;
  backgroundColor?:
    | string
    | {
        main?: string;
        productInfo?: string;
        features?: string;
        reviews?: string;
        similarProducts?: string;
        similarProductCards?: string;
      };
  /** Issue ID for analytics tracking */
  issueId?: string;
}

export default function TopProductSpotlight({ content, title, subtitle, backgroundColor, issueId }: TopProductSpotlightProps) {
  // Analytics tracking
  const { trackEnhancedCTAClick } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  // Handle CTA click tracking
  const handleCtaClick = (label: string) => {
    if (issueId) {
      trackEnhancedCTAClick(label, 'primary', 'top-product-spotlight', 'top-product-spotlight');
    }
  };

  // Get merged style settings
  const styles = mergeUniversalStyleSettings(content, getUniversalLayoutPreset(content.headerLayout));

  return (
    <BackgroundWrapper backgroundColor={backgroundColor} className="py-6 px-4 md:py-12 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <SectionHeader
            title={title}
            subtitle={subtitle}
            subtitle2={content.subtitle2}
            titleStyles={{
              fontSize: styles.titleFontSize,
              fontFamily: styles.titleFontFamily,
              fontWeight: styles.titleFontWeight,
              alignment: styles.titleAlignment,
              color: styles.titleColor,
            }}
            subtitleStyles={{
              fontSize: styles.subtitleFontSize,
              fontFamily: styles.subtitleFontFamily,
              fontWeight: styles.subtitleFontWeight,
              alignment: styles.subtitleAlignment,
              color: styles.subtitleColor,
            }}
          />
        )}

        {/* Main Product Showcase */}
        <BackgroundWrapper backgroundColor={backgroundColor} section="productInfo" className="rounded-2xl shadow-xl overflow-hidden">
          {/* Product Image with badges */}
          <div className="relative">
            {getImageObjectFit(content.productImage) === "cover" ? (
              <div className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[16/9]">
                <Image
                  src={getImageUrl(content.productImage)}
                  alt={content.productName}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: getImageObjectPosition(content.productImage),
                  }}
                />
              </div>
            ) : (
              <Image
                src={getImageUrl(content.productImage)}
                alt={content.productName}
                width={1200}
                height={800}
                className="w-full h-auto"
                style={{
                  objectPosition: getImageObjectPosition(content.productImage),
                }}
              />
            )}

            {/* Badges */}
            {content.isBestseller && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-900 rounded-full text-sm font-bold shadow-lg">
                <span className="text-base">⭐</span>
                <span>{content.bestsellerLabel || "BESTSELLER"}</span>
              </div>
            )}
            {content.discount && <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">{content.discount}% OFF</div>}
          </div>

          {/* Product Details */}
          <div className="p-4 md:p-8 lg:p-12">
            {/* Use ProductDetails component */}
            <ProductDetails
              name={content.productName}
              brand={content.brandName}
              price={`$${content.price}`}
              description={content.description}
              ingredients={content.ingredients}
              benefits={content.keyFeatures}
              rating={typeof content.rating === "string" ? parseFloat(content.rating) : content.rating}
              reviewCount={typeof content.reviewCount === "string" ? parseInt(content.reviewCount) : content.reviewCount}
            />

            {/* Pro Recommendation */}
            {content.proRecommendation && (
              <div className="mb-6 p-4 rounded-lg bg-glamlink-teal/5">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  {content.proRecommendation.proImage && (
                    <div className="relative w-16 h-16 md:w-12 md:h-12 rounded-full overflow-hidden mb-3 md:mb-0 md:mr-3">
                      <Image
                        src={getImageUrl(content.proRecommendation.proImage)}
                        alt={content.proRecommendation.proName}
                        fill
                        className="object-contain"
                        style={{
                          objectPosition: getImageObjectPosition(content.proRecommendation.proImage),
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <div className="font-medium mb-1 text-gray-900">{content.proRecommendation.proName}</div>
                    <p className="text-sm text-gray-600 italic">"{content.proRecommendation.quote}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            {content.reviewHighlights && (
              <BackgroundWrapper backgroundColor={backgroundColor} section="reviews" className="mb-6">
                <h4
                  className={`
                  ${content.reviewHighlightsTitleTypography?.fontSize || "text-base"}
                  ${content.reviewHighlightsTitleTypography?.fontFamily || "font-sans"}
                  ${content.reviewHighlightsTitleTypography?.fontWeight || "font-bold"}
                  ${content.reviewHighlightsTitleTypography?.fontStyle || ""}
                  ${content.reviewHighlightsTitleTypography?.color || "text-gray-900"}
                  ${content.reviewHighlightsTitleTypography?.alignment || ""}
                  mb-3
                `}
                >
                  {content.reviewHighlightsTitle || "What Customers Say:"}
                </h4>
                <div className="space-y-2">
                  {content.reviewHighlights.map((review, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      <span className="text-sm text-gray-700 italic">"{review}"</span>
                    </div>
                  ))}
                </div>
              </BackgroundWrapper>
            )}

            {/* Stats */}
            {(content.unitsSold || content.rating) && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {content.unitsSold && (
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className="text-2xl font-bold text-glamlink-teal">{content.unitsSold}+</div>
                    <div className="text-sm text-gray-600">Units Sold</div>
                  </div>
                )}
                {content.rating && (
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <div className="text-2xl font-bold text-glamlink-gold">{content.rating} ⭐</div>
                    <div className="text-sm text-gray-600">Rating ({content.reviewCount} reviews)</div>
                  </div>
                )}
              </div>
            )}

            {/* Shop Now CTA */}
            <div className="flex gap-4">
              {content.shopLink && (
                <MagazineLink field={{ url: content.shopLink, action: "link" }} className="flex-1 text-center px-6 py-3 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-purple transition-colors font-medium">
                  Shop Now
                </MagazineLink>
              )}
              {content.qrCode && (
                <div className="w-24 h-24 bg-white rounded-lg p-2 border">
                  <Image src={getImageUrl(content.qrCode)} alt="QR Code" width={80} height={80} className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>
        </BackgroundWrapper>

        {/* Similar Products */}
        {content.similarProducts && content.similarProducts.length > 0 && (
          <BackgroundWrapper backgroundColor={backgroundColor} section="similarProducts" className="mt-12">
            <h3
              className={`
              ${content.similarProductsTitleTypography?.fontSize || "text-2xl"}
              ${content.similarProductsTitleTypography?.fontFamily || "font-sans"}
              ${content.similarProductsTitleTypography?.fontWeight || "font-bold"}
              ${content.similarProductsTitleTypography?.fontStyle || ""}
              ${content.similarProductsTitleTypography?.color || "text-gray-900"}
              ${content.similarProductsTitleTypography?.alignment || ""}
              mb-6
            `}
            >
              {content.similarProductsTitle || "You Might Also Like"}
            </h3>

            <SimilarProducts
              products={content.similarProducts.map((product) => ({
                name: product.name,
                price: typeof product.price === "number" ? product.price.toString() : product.price,
                image: product.image,
                link: product.link,
              }))}
            />
          </BackgroundWrapper>
        )}

        {/* Bottom CTA */}
        {content.ctaButtonText && content.ctaButtonLink && (
          <div className="mt-12">
            <CallToAction
              title=""
              description=""
              buttonText={content.ctaButtonText}
              buttonLink={typeof content.ctaButtonLink === "string" ? content.ctaButtonLink : content.ctaButtonLink?.url}
              backgroundColor="bg-transparent"
              textColor="text-gray-900"
              buttonColor="bg-glamlink-teal text-white hover:bg-glamlink-teal-dark"
              className="text-center"
              onCtaClick={handleCtaClick}
            />
          </div>
        )}
      </div>
    </BackgroundWrapper>
  );
}
