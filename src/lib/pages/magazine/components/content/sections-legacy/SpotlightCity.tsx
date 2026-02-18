"use client";

import Image from "next/image";
import Link from "next/link";
import MagazineLink from "../../shared/MagazineLink";
import type { SpotlightCityContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface SpotlightCityProps {
  content: SpotlightCityContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; pros?: string; trends?: string; events?: string };
}

export default function SpotlightCity({ content, title, subtitle, backgroundColor }: SpotlightCityProps) {
  // Get merged style settings
  const styles = mergeUniversalStyleSettings(content, getUniversalLayoutPreset(content.headerLayout));

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
  const prosBgProps = getBackgroundProps(backgrounds?.pros);
  const trendsBgProps = getBackgroundProps(backgrounds?.trends);
  const eventsBgProps = getBackgroundProps(backgrounds?.events);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gradient-to-br from-gray-50 to-white"}`} style={mainBgProps.style}>
      <div className="max-w-6xl mx-auto">
        {/* Header with dynamic styling */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2
                className={`
                ${styles.titleFontSize || "text-3xl md:text-4xl"} 
                ${styles.titleFontFamily || "font-serif"}
                ${styles.titleFontWeight || "font-bold"}
                ${getAlignmentClass(styles.titleAlignment)}
                ${styles.titleColor || "text-gray-900"}
                mb-2
              `}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`
                ${styles.subtitleFontSize || "text-lg md:text-xl"} 
                ${styles.subtitleFontFamily || "font-sans"}
                ${styles.subtitleFontWeight || "font-medium"}
                ${getAlignmentClass(styles.subtitleAlignment)}
                ${styles.subtitleColor || "text-gray-600"}
              `}
              >
                {subtitle}
              </p>
            )}
            {content.subtitle2 && (
              <p
                className={`
                ${styles.subtitle2FontSize || "text-base"} 
                ${styles.subtitle2FontFamily || "font-sans"}
                ${styles.subtitle2FontWeight || "font-normal"}
                ${getAlignmentClass(styles.subtitle2Alignment)}
                ${styles.subtitle2Color || "text-gray-500"}
                mt-1
              `}
              >
                {content.subtitle2}
              </p>
            )}
          </div>
        )}

        {/* City name as feature */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h3 className={`text-3xl font-bold ${styles.titleColor || "text-glamlink-teal"}`}>{content.cityName}</h3>
            {content.description && <p className="text-lg text-gray-600 mt-2">{content.description}</p>}
          </div>
        </div>

        {/* City Hero Image */}
        {content.cityImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-xl">
            <Image
              src={getImageUrl(content.cityImage) || "/images/placeholder.png"}
              alt={content.cityName}
              fill
              className={getImageObjectFit(content.cityImage) === "cover" ? "object-cover" : "object-contain"}
              style={{
                objectPosition: getImageObjectPosition(content.cityImage),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-2xl font-bold">{content.cityName}</h3>
            </div>
          </div>
        )}

        {/* Top Local Pros */}
        {content.topPros && content.topPros.length > 0 && (
          <div className="mb-12">
            <h3 className={`${styles.subtitleFontSize || "text-2xl"} font-bold mb-6 ${styles.subtitleColor || "text-gray-900"}`}>Top Local Pros</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {content.topPros.map((pro, index) => (
                <MagazineLink key={index} field={pro.link} className="group">
                  <div className={`rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${prosBgProps.className || "bg-white"}`} style={prosBgProps.style}>
                    {pro.image && (
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={getImageUrl(pro.image) || "/images/placeholder.png"}
                          alt={pro.name}
                          fill
                          className={`${getImageObjectFit(pro.image) === "cover" ? "object-cover" : "object-contain"} group-hover:scale-105 transition-transform`}
                          style={{
                            objectPosition: getImageObjectPosition(pro.image),
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-1">{pro.name}</h4>
                      <p className="text-glamlink-teal text-sm mb-2">{pro.specialty}</p>
                      {pro.achievement && <p className="text-xs text-gray-600 italic">"{pro.achievement}"</p>}
                    </div>
                  </div>
                </MagazineLink>
              ))}
            </div>
          </div>
        )}

        {/* Local Trends */}
        {content.trends && content.trends.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">What's Trending in {content.cityName}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.trends.map((trend, index) => (
                <div key={index} className={`rounded-lg p-4 border border-gray-200 ${trendsBgProps.className || "bg-white"}`} style={trendsBgProps.style}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold">{trend.name}</h4>
                    {trend.popularity && (
                      <span className={`text-xs px-2 py-1 rounded-full ${trend.popularity === "hot" ? "bg-red-100 text-red-600" : trend.popularity === "trending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600"}`}>
                        {trend.popularity === "hot" ? "🔥 Hot" : trend.popularity === "trending" ? "📈 Trending" : "✨ Emerging"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{trend.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Events */}
        {content.localEvents && content.localEvents.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {content.localEvents.map((event, index) => (
                <div key={index} className={`rounded-lg p-6 shadow-sm border-l-4 border-glamlink-teal ${eventsBgProps.className || "bg-white"}`} style={eventsBgProps.style}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {event.date}</p>
                        <p>📍 {event.location}</p>
                        {event.description && <p className="mt-2">{event.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
