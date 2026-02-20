"use client";

import { YouthTrendItem } from "../../../types";
import Image from "next/image";
import Link from "next/link";

interface GenZTrendsProps {
  trends?: YouthTrendItem[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; cards?: string };
}

export default function GenZTrends({ trends, isLoading, backgroundColor }: GenZTrendsProps) {
  // Parse background colors
  const backgrounds = typeof backgroundColor === "object" ? backgroundColor : { main: backgroundColor };

  // Check if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    return value && (value.startsWith("bg-") || value.includes(" bg-") || value.includes("from-") || value.includes("to-"));
  };

  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === "transparent") return {};
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    return { style: { background: bgValue } };
  };

  const mainBgProps = getBackgroundProps(backgrounds?.main);
  const cardsBgProps = getBackgroundProps(backgrounds?.cards);
  // Mock data for when no trends are provided
  const mockTrends: YouthTrendItem[] = [
    {
      id: "trend-1",
      name: "Glass Skin Serum",
      category: "skincare",
      price: 12.99,
      trendingOn: ["tiktok", "instagram"],
      ageGroup: "gen-z",
      viralityScore: 9.2,
      dupeFor: "SK-II Facial Treatment Essence",
      image: "/images/placeholder.png",
      brandName: "GlowLab",
      brandId: "brand-1",
    },
    {
      id: "trend-2",
      name: "Color-Changing Lip Oil",
      category: "makeup",
      price: 8.99,
      trendingOn: ["tiktok", "youtube"],
      ageGroup: "both",
      viralityScore: 8.7,
      image: "/images/placeholder.png",
      brandName: "TrendyBeauty",
      brandId: "brand-2",
    },
    {
      id: "trend-3",
      name: "Bubble Clay Mask",
      category: "skincare",
      price: 15.99,
      trendingOn: ["instagram", "youtube"],
      ageGroup: "gen-alpha",
      viralityScore: 8.5,
      image: "/images/placeholder.png",
      brandName: "FunBeauty",
      brandId: "brand-3",
    },
    {
      id: "trend-4",
      name: "Glitter Freckles Kit",
      category: "makeup",
      price: 6.99,
      trendingOn: ["tiktok"],
      ageGroup: "gen-z",
      viralityScore: 9.0,
      image: "/images/placeholder.png",
      brandName: "SparkleStudio",
      brandId: "brand-4",
    },
    {
      id: "trend-5",
      name: "Strawberry Milk Toner",
      category: "skincare",
      price: 11.99,
      trendingOn: ["instagram", "tiktok"],
      ageGroup: "both",
      viralityScore: 8.3,
      dupeFor: "Glow Recipe Watermelon Toner",
      image: "/images/placeholder.png",
      brandName: "KBeauty Express",
      brandId: "brand-5",
    },
    {
      id: "trend-6",
      name: "Holographic Hair Tinsel",
      category: "haircare",
      price: 4.99,
      trendingOn: ["tiktok", "youtube"],
      ageGroup: "gen-alpha",
      viralityScore: 7.8,
      image: "/images/placeholder.png",
      brandName: "GlitterGang",
      brandId: "brand-6",
    },
  ];

  const displayTrends = trends && trends.length > 0 ? trends : mockTrends;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "tiktok":
        return "🎵";
      case "instagram":
        return "📸";
      case "youtube":
        return "🎬";
      default:
        return "📱";
    }
  };

  const getAgeGroupBadge = (ageGroup: string) => {
    switch (ageGroup) {
      case "gen-alpha":
        return { text: "Gen Alpha", color: "bg-purple-100 text-purple-700" };
      case "gen-z":
        return { text: "Gen Z", color: "bg-pink-100 text-pink-700" };
      case "both":
        return { text: "All Ages", color: "bg-blue-100 text-blue-700" };
      default:
        return { text: ageGroup, color: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className={mainBgProps.className || ""} style={mainBgProps.style}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gen Z & Gen Alpha Trending Now</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Viral beauty products and affordable dupes loved by the next generation</p>
      </div>

      {/* Trends Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTrends.map((trend) => {
          const ageGroupBadge = getAgeGroupBadge(trend.ageGroup);

          return (
            <div key={trend.id} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${cardsBgProps.className || "bg-white"}`} style={cardsBgProps.style}>
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <Image src={trend.image} alt={trend.name} fill className="object-cover" />
                {/* Virality Score Badge */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold">🔥 {trend.viralityScore}/10</div>
              </div>

              <div className="p-4">
                {/* Age Group Badge */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ageGroupBadge.color}`}>{ageGroupBadge.text}</span>
                </div>

                {/* Product Name & Brand */}
                <h3 className="font-semibold text-gray-900 mb-1">{trend.name}</h3>
                <Link href={`/brand/${trend.brandId}`} className="text-sm text-gray-600 hover:text-blue-600">
                  by {trend.brandName}
                </Link>

                {/* Price & Dupe Info */}
                <div className="mt-3">
                  <div className="text-2xl font-bold text-gray-900">${trend.price}</div>
                  {trend.dupeFor && <p className="text-xs text-green-600 font-medium mt-1">💸 Dupe for {trend.dupeFor}</p>}
                </div>

                {/* Trending On Platforms */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Trending on:</span>
                  <div className="flex gap-1">
                    {trend.trendingOn.map((platform) => (
                      <span key={platform} className="text-lg" title={platform}>
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="mt-2 text-xs text-gray-500 uppercase tracking-wide">{trend.category}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Want to see more trending products from your favorite creators?</p>
        <Link href="/brand" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors">
          Explore All Brands
        </Link>
      </div>
    </div>
  );
}
