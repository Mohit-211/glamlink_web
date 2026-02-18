"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import TypographyWrapper from "../utils/TypographyWrapper";

interface StarProfileProps {
  starImage?: any;
  starName: string;
  starNameTypography?: any;
  starTitle?: string;
  starTitleTypography?: any;
  starTitle2?: string;
  starTitle2Typography?: any;
  bio?: string;
  bioTitle?: string;
  bioTitleTypography?: any;
  quote?: string;
  quoteTypography?: any;
  quoteAuthor?: string;
  quoteAuthorTypography?: any;
  quoteOverImage?: boolean;
  quoteBgClassName?: string;
  quoteBgStyle?: any;
  bioBgClassName?: string;
  bioBgStyle?: any;
}

export default function StarProfile({
  starImage,
  starName,
  starNameTypography,
  starTitle,
  starTitleTypography,
  starTitle2,
  starTitle2Typography,
  bio,
  bioTitle = "About",
  bioTitleTypography,
  quote,
  quoteTypography,
  quoteAuthor,
  quoteAuthorTypography,
  quoteOverImage,
  quoteBgClassName = "bg-gray-100/95",
  quoteBgStyle,
  bioBgClassName = "bg-white",
  bioBgStyle
}: StarProfileProps) {
  // Get tag from typography settings
  const bioTitleTag = bioTitleTypography?.tag || "h3";
  // Helper function to check if HTML content has meaningful text
  const hasContent = (htmlString?: string): boolean => {
    if (!htmlString || typeof htmlString !== 'string') return false;
    
    // Remove HTML tags and check if there's actual text
    const textContent = htmlString
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .trim(); // Remove whitespace
    
    return textContent.length > 0;
  };

  // Helper to check if a field has meaningful content
  const hasTextContent = (text?: string): boolean => {
    return !!(text && text.trim().length > 0);
  };
  // Build quote classes from typography settings
  const quoteClasses = [
    quoteTypography?.fontSize || "text-lg",
    quoteTypography?.fontFamily || "font-serif",
    quoteTypography?.fontWeight || "font-normal",
    quoteTypography?.fontStyle === "" ? "" : (quoteTypography?.fontStyle || "italic"),
    quoteTypography?.textDecoration || "",
    quoteTypography?.color || "text-gray-800"
  ].filter(Boolean).join(" ");

  // Extract the quote color for the quote marks
  const quoteColor = quoteTypography?.color || "text-gray-800";
  const quoteMarkClasses = `absolute text-4xl ${quoteColor} opacity-50`;

  // Build quote author classes from typography settings
  const quoteAuthorClasses = [
    quoteAuthorTypography?.fontSize || "text-base",
    quoteAuthorTypography?.fontFamily || "font-sans",
    quoteAuthorTypography?.fontWeight || "font-normal",
    quoteAuthorTypography?.fontStyle || "",
    quoteAuthorTypography?.textDecoration || "",
    quoteAuthorTypography?.color || "text-gray-600",
    quoteAuthorTypography?.alignment === "right" ? "text-right" : 
    quoteAuthorTypography?.alignment === "center" ? "text-center" : "text-left",
    "mt-3"
  ].filter(Boolean).join(" ");

  // Build bio title classes from typography settings
  const bioTitleClasses = [
    bioTitleTypography?.fontSize || "text-2xl",
    bioTitleTypography?.fontFamily || "font-sans",
    bioTitleTypography?.fontWeight || "font-semibold",
    bioTitleTypography?.fontStyle || "",
    bioTitleTypography?.textDecoration || "",
    bioTitleTypography?.color || "text-gray-900",
    "mb-3 relative z-10"
  ].filter(Boolean).join(" ");

  // Render bio title with dynamic heading tag
  const renderBioTitle = () => {
    if (!bioTitle) return null;
    
    switch (bioTitleTag) {
      case 'h1':
        return <h1 className={bioTitleClasses}>{bioTitle}</h1>;
      case 'h2':
        return <h2 className={bioTitleClasses}>{bioTitle}</h2>;
      case 'h4':
        return <h4 className={bioTitleClasses}>{bioTitle}</h4>;
      case 'h5':
        return <h5 className={bioTitleClasses}>{bioTitle}</h5>;
      case 'h6':
        return <h6 className={bioTitleClasses}>{bioTitle}</h6>;
      case 'h3':
      default:
        return <h3 className={bioTitleClasses}>{bioTitle}</h3>;
    }
  };

  return (
    <>
      {/* Star decorations */}
      <div className="absolute top-0 left-0 text-gray-200 opacity-30 text-6xl">★</div>
      <div className="absolute top-20 right-10 text-gray-200 opacity-30 text-4xl">✦</div>
      <div className="absolute bottom-10 left-20 text-gray-200 opacity-30 text-5xl">★</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        {quoteOverImage && quote && starImage ? (
          // Full-width image with quote card overlay layout
          <>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={getImageUrl(starImage)}
                  alt={starName}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  style={{
                    objectPosition: getImageObjectPosition(starImage),
                  }}
                />

                {/* Quote Card Overlay - positioned at bottom */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center p-8">
                  <div
                    className={`${
                      quoteBgClassName?.startsWith('#') || quoteBgClassName === 'transparent' || !quoteBgClassName || quoteBgClassName.trim() === ''
                        ? ''
                        : 'rounded-xl p-6 relative max-w-md shadow-2xl backdrop-blur-sm '
                    }${quoteBgClassName || ''}`} 
                    style={{
                      ...quoteBgStyle,
                      ...(quoteBgClassName?.startsWith('#') ? { background: quoteBgClassName } : {}),
                      ...(quoteBgClassName === 'transparent' ? { background: 'transparent' } : {})
                    }}
                  >
                    <div className={`${quoteMarkClasses} top-2 left-2`}>"</div>
                    <blockquote className={`${quoteClasses} pl-2 sm:pl-6 md:pl-8 pr-2 sm:pr-4`}>{quote}</blockquote>
                    {quoteAuthor && <p className={quoteAuthorClasses}>— {quoteAuthor}</p>}
                    <div className={`${quoteMarkClasses} bottom-2 right-2`}>"</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Card below the image if it exists */}
            {(hasContent(bio) || hasTextContent(bioTitle)) && (
              <div className="mt-8 max-w-3xl mx-auto">
                <div
                  className={`${
                    bioBgClassName?.startsWith('#') || bioBgClassName === 'transparent' || !bioBgClassName || bioBgClassName.trim() === ''
                      ? ''
                      : 'rounded-xl shadow-lg p-6 relative overflow-hidden '
                  }${bioBgClassName || ''}`} 
                  style={{
                    ...bioBgStyle,
                    ...(bioBgClassName?.startsWith('#') ? { background: bioBgClassName } : {}),
                    ...(bioBgClassName === 'transparent' ? { background: 'transparent' } : {})
                  }}
                >
                  <div className="absolute top-0 right-0 text-gray-100 text-8xl opacity-50">★</div>
                  {renderBioTitle()}
                  {hasContent(bio) && bio && (
                    <div 
                      className="rich-content text-gray-700 leading-relaxed relative z-10"
                      dangerouslySetInnerHTML={{ __html: bio }}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Stacked layout - bio always below image
          <>
            {/* Image Section - Full Width */}
            {starImage && (
              <div className="relative">
                <div className={`relative rounded-lg overflow-hidden shadow-xl ${!hasContent(bio) && !quote ? "max-w-2xl mx-auto" : ""}`}>
                  <Image
                    src={getImageUrl(starImage)}
                    alt={starName}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    style={{
                      objectPosition: getImageObjectPosition(starImage),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bio and Quote Section - Below Image */}
            {(hasContent(bio) || quote) && (
              <div className="mt-8 space-y-6 max-w-4xl mx-auto">
                {/* Bio Card - only show if bio or bioTitle exists */}
                {(hasContent(bio) || hasTextContent(bioTitle)) && (
                  <div
                    className={`${
                      bioBgClassName?.startsWith('#') || bioBgClassName === 'transparent' || !bioBgClassName || bioBgClassName.trim() === ''
                        ? ''
                        : 'rounded-xl shadow-lg p-6 relative overflow-hidden '
                    }${bioBgClassName || ''}`}
                    style={{
                      ...bioBgStyle,
                      ...(bioBgClassName?.startsWith('#') ? { background: bioBgClassName } : {}),
                      ...(bioBgClassName === 'transparent' ? { background: 'transparent' } : {})
                    }}
                  >
                    <div className="absolute top-0 right-0 text-gray-100 text-8xl opacity-50">★</div>
                    {renderBioTitle()}
                    {hasContent(bio) && bio && (
                      <div
                        className="rich-content text-gray-700 leading-relaxed relative z-10"
                        dangerouslySetInnerHTML={{ __html: bio }}
                      />
                    )}
                  </div>
                )}

                {/* Quote Box - only show if quote exists and not overlaid on image */}
                {quote && !quoteOverImage && (
                  <div
                    className={`${
                      quoteBgClassName?.startsWith('#') || quoteBgClassName === 'transparent' || !quoteBgClassName || quoteBgClassName.trim() === ''
                        ? ''
                        : 'rounded-xl p-6 relative '
                    }${quoteBgClassName || ''}`}
                    style={{
                      ...quoteBgStyle,
                      ...(quoteBgClassName?.startsWith('#') ? { background: quoteBgClassName } : {}),
                      ...(quoteBgClassName === 'transparent' ? { background: 'transparent' } : {})
                    }}
                  >
                    <div className={`${quoteMarkClasses} top-2 left-2`}>"</div>
                    <blockquote className={`${quoteClasses} pl-2 sm:pl-6 md:pl-8 pr-2 sm:pr-4`}>{quote}</blockquote>
                    {quoteAuthor && <p className={quoteAuthorClasses}>— {quoteAuthor}</p>}
                    <div className={`${quoteMarkClasses} bottom-2 right-2`}>"</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Name and Title - Full Width Below Grid */}
        <div className="mt-8 text-center">
          <TypographyWrapper
            as="h1"
            settings={starNameTypography}
            defaultSettings={{
              fontSize: "text-4xl lg:text-5xl",
              fontFamily: "font-sans",
              fontWeight: "font-bold",
              color: "text-glamlink-teal"
            }}
          >
            {starName}
          </TypographyWrapper>
          {starTitle && (
            <TypographyWrapper
              as="p"
              settings={starTitleTypography}
              className="mt-4"
              defaultSettings={{
                fontSize: "text-xl",
                fontFamily: "font-sans",
                fontWeight: "font-normal",
                color: "text-gray-600"
              }}
            >
              {starTitle}
            </TypographyWrapper>
          )}
          {starTitle2 && (
            <TypographyWrapper
              as="p"
              settings={starTitle2Typography}
              className="mt-2"
              defaultSettings={{
                fontSize: "text-2xl",
                fontFamily: "font-sans",
                fontWeight: "font-medium",
                color: "text-gray-900"
              }}
            >
              {starTitle2}
            </TypographyWrapper>
          )}
        </div>
      </div>
    </>
  );
}