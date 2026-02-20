"use client";

import type { WhatsHotWhatsOutContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";

interface WhatsHotWhatsOutProps {
  content: WhatsHotWhatsOutContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; hot?: string; out?: string; hotItems?: string; outItems?: string };
}

export default function WhatsHotWhatsOut({ content, title, subtitle, backgroundColor }: WhatsHotWhatsOutProps) {
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
  const hotBgProps = getBackgroundProps(backgrounds?.hot);
  const outBgProps = getBackgroundProps(backgrounds?.out);
  const hotItemsBgProps = getBackgroundProps(backgrounds?.hotItems);
  const outItemsBgProps = getBackgroundProps(backgrounds?.outItems);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gradient-to-br from-red-50 via-white to-blue-50"}`} style={mainBgProps.style}>
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* What's Hot */}
          <div className={`rounded-2xl p-8 ${hotBgProps.className || "bg-gradient-to-br from-red-100 to-orange-50"}`} style={hotBgProps.style}>
            <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
              <span className="text-4xl mr-3">🔥</span>
              HOT
            </h3>
            <div className="space-y-4">
              {content.hotItems.map((item, index) => (
                <div key={index} className={`rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-shadow ${hotItemsBgProps.className || "bg-white"}`} style={hotItemsBgProps.style}>
                  <div className="text-2xl">{item.emoji || "✅"}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.item}</h4>
                    {item.reason && <p className="text-sm text-gray-600">{item.reason}</p>}
                  </div>
                  <div className="text-red-500 font-bold text-xl">IN</div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Out */}
          <div className={`rounded-2xl p-8 ${outBgProps.className || "bg-gradient-to-br from-blue-100 to-gray-50"}`} style={outBgProps.style}>
            <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
              <span className="text-4xl mr-3">❄️</span>
              NOT
            </h3>
            <div className="space-y-4">
              {content.outItems.map((item, index) => (
                <div key={index} className={`rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-shadow opacity-75 ${outItemsBgProps.className || "bg-white"}`} style={outItemsBgProps.style}>
                  <div className="text-2xl">{item.emoji || "❌"}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg line-through text-gray-600">{item.item}</h4>
                    {item.reason && <p className="text-sm text-gray-500">{item.reason}</p>}
                  </div>
                  <div className="text-blue-500 font-bold text-xl">OUT</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 italic">* Trends are subjective and meant for fun! Beauty is personal - do what makes YOU feel amazing! 💕</p>
        </div>
      </div>
    </div>
  );
}
