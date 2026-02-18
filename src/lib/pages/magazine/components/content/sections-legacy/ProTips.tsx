"use client";

import Image from "next/image";
import Link from "next/link";
import MagazineLink from "../../shared/MagazineLink";
import type { ProTipsContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";

interface ProTipsProps {
  content: ProTipsContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; author?: string; tips?: string; cta?: string };
}

export default function ProTips({ content, title, subtitle, backgroundColor }: ProTipsProps) {
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
  return (
    <div className={`py-12 px-8 ${mainBgProps.className || ""}`} style={mainBgProps.style}>
      <div className="max-w-4xl mx-auto">
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

        {/* Topic */}
        {content.topic && (
          <div className="text-center mb-12">
            <p className={`text-xl ${styles.subtitleColor || "text-glamlink-purple"}`}>{content.topic}</p>
          </div>
        )}

        {/* Author Info */}
        {content.authorName && (
          <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
            {content.authorImage && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image src={content.authorImage} alt={content.authorName} fill className="object-cover" />
              </div>
            )}
            <div>
              <h3 className="font-bold">{content.authorName}</h3>
              {content.authorTitle && <p className="text-gray-600 text-sm">{content.authorTitle}</p>}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="space-y-8">
          {content.tips.map((tip, index) => (
            <div key={index} className="border-l-4 border-glamlink-teal pl-6">
              <div className="flex items-start gap-4">
                {tip.icon && <div className="text-3xl flex-shrink-0">{tip.icon}</div>}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">
                    {index + 1}. {tip.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{tip.content}</p>
                  {tip.proTip && (
                    <div className="bg-glamlink-gold/10 rounded-lg p-4 border border-glamlink-gold/30">
                      <p className="text-sm font-medium text-glamlink-gold mb-1">PRO TIP:</p>
                      <p className="text-sm text-gray-700">{tip.proTip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {content.callToAction && (
          <div className="mt-12 text-center">
            <MagazineLink field={content.callToAction.link} className="inline-block px-8 py-3 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-purple transition-colors font-medium">
              {content.callToAction.text}
            </MagazineLink>
          </div>
        )}
      </div>
    </div>
  );
}
