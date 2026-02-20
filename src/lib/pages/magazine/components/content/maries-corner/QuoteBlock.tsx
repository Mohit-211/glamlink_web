"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface QuoteBlockProps {
  quote: string;
  author?: string | React.ReactNode;
  authorTitle?: string;
  quoteStyle?: "inline" | "decorative";
  quoteTextColor?: string;
  quoteAlignment?: string;
  backgroundImage?: any;
  className?: string;
  authorComponent?: React.ReactNode;
  marginTop?: number;
}

export default function QuoteBlock({ quote, author, authorTitle, quoteStyle = "decorative", quoteTextColor, quoteAlignment = "left", backgroundImage, className = "", authorComponent, marginTop = 0 }: QuoteBlockProps) {
  const hasBackground = backgroundImage && getImageUrl(backgroundImage);

  const content = (
    <div className={`${quoteAlignment === "center" ? "text-center" : quoteAlignment === "bottom-center" ? "text-center" : "text-left"} ${className}`}>
      <blockquote className="sm:mb-6">
        {quoteStyle === "inline" ? (
          <p className={`text-lg sm:text-2xl md:text-3xl font-serif leading-relaxed ${quoteTextColor || (hasBackground ? "text-white" : "text-gray-800")}`}>"{quote}"</p>
        ) : (
          <div className="relative">
            <span className={`absolute -top-4 -left-2 text-4xl sm:text-5xl md:text-6xl font-serif ${hasBackground ? "text-white/30" : "text-glamlink-purple/20"}`}>"</span>
            <p className={`text-lg sm:text-2xl md:text-3xl italic font-serif leading-relaxed pl-6 sm:pl-8 pr-6 sm:pr-8 ${quoteTextColor || (hasBackground ? "text-white" : "text-gray-800")}`}>{quote}</p>
            <span className={`absolute -bottom-6 sm:-bottom-8 right-0 text-4xl sm:text-5xl md:text-6xl font-serif rotate-180 ${hasBackground ? "text-white/30" : "text-glamlink-purple/20"}`}>"</span>
          </div>
        )}
      </blockquote>

      {/* Author attribution with proper spacing */}
      {(author || authorTitle) && (
        <div className={`${quoteStyle === "decorative" ? "mt-8 sm:mt-10" : "sm:mt-4"} ${quoteAlignment === "center" ? "text-center" : "text-right"}`}>
          {author && typeof author === "string" && <p className={`font-medium ${quoteTextColor || (hasBackground ? "text-white" : "text-gray-800")}`}>— {author}</p>}
          {authorTitle && <p className={`text-sm ${hasBackground ? "text-white/80" : "text-gray-600"} mt-1`}>{authorTitle}</p>}
        </div>
      )}

      {/* Custom author component */}
      {authorComponent}
    </div>
  );

  if (hasBackground) {
    return (
      <>
        {/* Mobile/Tablet - No margin top */}
        <div className="relative rounded-lg overflow-hidden lg:hidden">
          <Image
            src={getImageUrl(backgroundImage)}
            alt="Background"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{
              objectPosition: getImageObjectPosition(backgroundImage),
            }}
          />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/30" />
            <div className={`relative h-full flex ${quoteAlignment === "bottom-center" ? "flex-col justify-end" : "flex-col justify-center"} p-4 sm:p-6 md:p-8`}>{quote ? content : null}</div>
          </div>
        </div>

        {/* Desktop - With margin top */}
        <div className="relative rounded-lg overflow-hidden hidden lg:block" style={{ marginTop: `${marginTop}px` }}>
          <Image
            src={getImageUrl(backgroundImage)}
            alt="Background"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{
              objectPosition: getImageObjectPosition(backgroundImage),
            }}
          />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/30" />
            <div className={`relative h-full flex ${quoteAlignment === "bottom-center" ? "flex-col justify-end" : "flex-col justify-center"} p-4 sm:p-6 md:p-8`}>{quote ? content : null}</div>
          </div>
        </div>
      </>
    );
  }

  // When no background image, wrap content with margin-top only on desktop
  return (
    <>
      {/* Mobile/Tablet - No margin top */}
      <div className="lg:hidden">{quote ? content : null}</div>

      {/* Desktop - With margin top */}
      <div className="hidden lg:block" style={{ marginTop: `${marginTop}px` }}>
        {quote ? content : null}
      </div>
    </>
  );
}
