"use client";

import Image from "next/image";
import Link from "next/link";
import type { EventRoundUpContent } from "../../../types";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface EventRoundUpProps {
  content: EventRoundUpContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; upcoming?: string; past?: string; cta?: string };
}

export default function EventRoundUp({ content, title, subtitle, backgroundColor }: EventRoundUpProps) {
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
  const upcomingBgProps = getBackgroundProps(backgrounds?.upcoming);
  const pastBgProps = getBackgroundProps(backgrounds?.past);
  const ctaBgProps = getBackgroundProps(backgrounds?.cta);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gradient-to-br from-glamlink-purple/5 to-glamlink-teal/5"}`} style={mainBgProps.style}>
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

        {/* Upcoming Events */}
        {content.upcomingEvents && content.upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-3">📅</span>
              Upcoming Events
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {content.upcomingEvents.map((event, index) => (
                <div key={index} className={`rounded-xl shadow-lg overflow-hidden ${upcomingBgProps.className || "bg-white"}`} style={upcomingBgProps.style}>
                  {event.image && (
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={getImageUrl(event.image) || "/images/placeholder.png"}
                        alt={event.title}
                        fill
                        className={getImageObjectFit(event.image) === "cover" ? "object-cover" : "object-contain"}
                        style={{
                          objectPosition: getImageObjectPosition(event.image),
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-3">{event.title}</h4>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="flex items-center">
                        <span className="mr-2">📅</span> {formatMagazineDate(event.date)}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">📍</span> {event.location}
                      </p>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    {event.registrationLink && (
                      <MagazineLink field={event.registrationLink} className="inline-block px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-purple transition-colors text-sm font-medium">
                        Register Now
                      </MagazineLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {content.pastEvents && content.pastEvents.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-3">✨</span>
              Recent Highlights
            </h3>
            <div className="space-y-6">
              {content.pastEvents.map((event, index) => (
                <div key={index} className={`rounded-lg p-6 shadow-sm ${pastBgProps.className || "bg-white"}`} style={pastBgProps.style}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold">{event.title}</h4>
                      <p className="text-sm text-gray-600">{formatMagazineDate(event.date)}</p>
                    </div>
                    {event.attendees && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-glamlink-teal">{event.attendees}+</p>
                        <p className="text-xs text-gray-600">Attendees</p>
                      </div>
                    )}
                  </div>

                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium mb-2">Key Highlights:</p>
                      <ul className="space-y-1">
                        {event.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className="flex items-start">
                            <span className="text-gray-900 mr-2">★</span>
                            <span className="text-sm text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.images && event.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {event.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative aspect-square rounded overflow-hidden">
                          <Image
                            src={getImageUrl(image) || "/images/placeholder.png"}
                            alt={`${event.title} - Image ${imgIndex + 1}`}
                            fill
                            className={getImageObjectFit(image) === "cover" ? "object-cover" : "object-contain"}
                            style={{
                              objectPosition: getImageObjectPosition(image),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`mt-12 text-center p-6 rounded-xl shadow-sm ${ctaBgProps.className || "bg-white"}`} style={ctaBgProps.style}>
          <p className="text-lg mb-4">Want to showcase your event?</p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-glamlink-purple text-white rounded-lg hover:bg-glamlink-teal transition-colors font-medium">
            Get Featured
          </Link>
        </div>
      </div>
    </div>
  );
}
