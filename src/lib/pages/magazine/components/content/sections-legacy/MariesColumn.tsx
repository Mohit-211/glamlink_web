"use client";

import Image from "next/image";
import { MariesColumnContent } from "../../../types";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";

interface MariesColumnProps {
  content: MariesColumnContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; author?: string; article?: string };
}

export default function MariesColumn({ content, title, subtitle, backgroundColor }: MariesColumnProps) {
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
  const authorBgProps = getBackgroundProps(backgrounds?.author);
  const articleBgProps = getBackgroundProps(backgrounds?.article);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gradient-to-br from-glamlink-purple/5 to-glamlink-teal/5"}`} style={mainBgProps.style}>
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

        {/* Author Bio */}
        <div className={`flex items-center gap-4 mb-8 p-6 rounded-lg shadow-sm ${authorBgProps.className || "bg-white"}`} style={authorBgProps.style}>
          {content.authorImage && (
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image src={content.authorImage} alt="Marie" fill className="object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold">Marie Marks</h3>
            <p className="text-gray-600">Founder & CEO, Glamlink</p>
          </div>
        </div>

        {/* Column Content */}
        <article className={`rounded-2xl shadow-lg p-8 lg:p-12 ${articleBgProps.className || "bg-white"}`} style={articleBgProps.style}>
          <h3 className={`${styles.subtitleFontSize || "text-3xl"} font-bold mb-6 ${styles.subtitleColor || "text-gray-900"}`}>{content.title}</h3>

          {content.subtitle && <p className="text-xl text-gray-600 mb-8 italic">{content.subtitle}</p>}

          {/* Opening Quote */}
          {content.openingQuote && <blockquote className="text-lg italic border-l-4 border-glamlink-purple pl-6 mb-8 text-gray-700">"{content.openingQuote}"</blockquote>}

          {/* Main Content */}
          <div className="rich-content max-w-none">
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.mainContent }} />
          </div>

          {/* Key Takeaways */}
          {content.keyTakeaways && content.keyTakeaways.length > 0 && (
            <div className="mt-8 p-6 bg-glamlink-teal/5 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Key Takeaways:</h4>
              <ul className="space-y-3">
                {content.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-glamlink-teal font-bold mr-3">{index + 1}.</span>
                    <span className="text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {content.actionItems && content.actionItems.length > 0 && (
            <div className="mt-8 p-6 bg-glamlink-gold/10 rounded-lg">
              <h4 className="text-xl font-bold mb-4">This Week's Challenge:</h4>
              <ul className="space-y-3">
                {content.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 rounded text-glamlink-teal" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Closing Thought */}
          {content.closingThought && (
            <div className="mt-8 p-6 text-center bg-gradient-to-r from-glamlink-purple/10 to-glamlink-teal/10 rounded-lg">
              <p className="text-lg italic text-gray-700">{content.closingThought}</p>
            </div>
          )}

          {/* Signature */}
          <div className="mt-8 text-right">
            <div className="inline-block">
              {content.signatureImage ? <Image src={content.signatureImage} alt="Marie's signature" width={150} height={60} /> : <div className="text-2xl font-script text-glamlink-purple">Marie</div>}
              <p className="text-sm text-gray-600 mt-2">Founder & CEO, Glamlink</p>
            </div>
          </div>
        </article>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Have a topic you'd like Marie to cover?{" "}
            <a href="mailto:marie@glamlink.com" className="text-glamlink-teal hover:text-glamlink-purple transition-colors">
              Send your suggestions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
