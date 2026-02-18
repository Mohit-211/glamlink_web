"use client";

import Image from "next/image";
import type { QuoteWallContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";

interface QuoteWallProps {
  content: QuoteWallContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; featured?: string; quotes?: string };
}

export default function QuoteWall({ content, title, subtitle, backgroundColor }: QuoteWallProps) {
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
  const featuredBgProps = getBackgroundProps(backgrounds?.featured);
  const quotesBgProps = getBackgroundProps(backgrounds?.quotes);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gradient-to-br from-glamlink-purple/10 to-glamlink-teal/10"}`} style={mainBgProps.style}>
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

        {/* Theme */}
        {content.theme && (
          <div className="text-center mb-12">
            <p className={`text-lg ${styles.subtitleColor || "text-gray-600"}`}>{content.theme}</p>
          </div>
        )}

        {/* Featured Quote */}
        {content.quotes.find((q) => q.featured) && (
          <div className="mb-12">
            {content.quotes
              .filter((q) => q.featured)
              .map((quote, index) => (
                <div key={index} className={`rounded-2xl shadow-xl p-8 lg:p-12 text-center ${featuredBgProps.className || "bg-white"}`} style={featuredBgProps.style}>
                  <div className="text-6xl text-glamlink-gold mb-4">"</div>
                  <blockquote className="text-2xl lg:text-3xl font-light text-gray-800 mb-6 italic">{quote.text}</blockquote>
                  <div className="flex items-center justify-center gap-4">
                    {quote.authorImage && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image src={quote.authorImage} alt={quote.author} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg">{quote.author}</p>
                      {quote.authorTitle && <p className="text-gray-600">{quote.authorTitle}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Quote Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {content.quotes
            .filter((q) => !q.featured)
            .map((quote, index) => (
              <div key={index} className={`rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow ${quotesBgProps.className || "bg-white"}`} style={quotesBgProps.style}>
                <div className="text-3xl text-glamlink-teal mb-3">"</div>
                <blockquote className="text-lg text-gray-700 mb-4 italic">{quote.text}</blockquote>
                <div className="flex items-center gap-3">
                  {quote.authorImage && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={quote.authorImage} alt={quote.author} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{quote.author}</p>
                    {quote.authorTitle && <p className="text-xs text-gray-600">{quote.authorTitle}</p>}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Have an inspiring quote to share?{" "}
            <a href="mailto:quotes@glamlink.com" className="text-glamlink-teal hover:text-glamlink-purple transition-colors">
              Send it to us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
