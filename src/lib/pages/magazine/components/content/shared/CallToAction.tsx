"use client";

import Image from "next/image";
import MagazineLink from "../../shared/MagazineLink";

interface CallToActionProps {
  // Hero Section
  heroHeadline?: string;
  heroHeadlineTypography?: any;
  heroSubheadline?: string;
  heroSubheadlineTypography?: any;
  backgroundImage?: string;
  useOverlayStyle?: boolean;
  
  // How to Get Featured Section
  howToGetFeaturedTitle?: string;
  howToGetFeaturedTitleTypography?: any;
  bullets?: string[];
  
  // CTA Section (legacy names kept for compatibility)
  title?: string; // Legacy - maps to ctaHeadline
  ctaHeadline?: string;
  titleTypography?: any; // Legacy - maps to ctaHeadlineTypography
  ctaHeadlineTypography?: any;
  description?: string;
  buttonText?: string; // Legacy - maps to ctaButtonText
  ctaButtonText?: string;
  buttonLink?: string | any; // Legacy - maps to ctaButtonLink
  ctaButtonLink?: any;
  qrCode?: string; // Legacy - maps to ctaQrCode
  ctaQrCode?: string;
  tagline?: string; // Legacy - maps to ctaTagline
  ctaTagline?: string;
  taglineTypography?: any; // Legacy - maps to ctaTaglineTypography
  ctaTaglineTypography?: any;
  
  // Styling
  backgroundColor?: string;
  ctaBackgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  darkMode?: boolean;
  className?: string;

  // Analytics
  /** Analytics callback for CTA button clicks */
  onCtaClick?: (label: string) => void;
}

export default function CallToAction({
  // Hero Section
  heroHeadline,
  heroHeadlineTypography,
  heroSubheadline,
  heroSubheadlineTypography,
  backgroundImage,
  useOverlayStyle = false,
  
  // How to Get Featured
  howToGetFeaturedTitle,
  howToGetFeaturedTitleTypography,
  bullets,
  
  // CTA Section (with legacy support)
  title,
  ctaHeadline,
  titleTypography,
  ctaHeadlineTypography,
  description,
  buttonText,
  ctaButtonText,
  buttonLink,
  ctaButtonLink,
  qrCode,
  ctaQrCode,
  tagline,
  ctaTagline,
  taglineTypography,
  ctaTaglineTypography,
  
  backgroundColor,
  ctaBackgroundColor,
  textColor = "text-gray-900",
  darkMode = false,
  className = "",
  onCtaClick,
}: CallToActionProps) {
  // Support legacy field names
  const displayCtaHeadline = ctaHeadline || title;
  const displayCtaHeadlineTypography = ctaHeadlineTypography || titleTypography;
  const displayCtaButtonText = ctaButtonText || buttonText;
  const displayCtaButtonLink = ctaButtonLink || buttonLink;
  const displayCtaQrCode = ctaQrCode || qrCode;
  const displayCtaTagline = ctaTagline || tagline;
  const displayCtaTaglineTypography = ctaTaglineTypography || taglineTypography;
  
  // Check if we have hero content (Join Movement style)
  const hasHeroContent = heroHeadline || heroSubheadline || backgroundImage || bullets?.length;
  
  // Determine text colors based on overlay/dark mode
  const isOverlayActive = useOverlayStyle !== false && (backgroundImage || hasHeroContent);
  const finalTextColor = (darkMode === true || isOverlayActive) ? "text-white" : "text-gray-900";
  const finalButtonColor = (darkMode === true || isOverlayActive) ? "bg-white text-gray-900" : "bg-glamlink-teal text-white";
  const goldColor = "text-glamlink-gold";
  
  // Helper function to convert alignment values to Tailwind classes
  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case "center": return "text-center";
      case "left": return "text-left";
      case "right": return "text-right";
      case "justify": return "text-justify";
      default: return "";
    }
  };
  
  // If no content at all, return null
  if (!hasHeroContent && !displayCtaHeadline && !description && !displayCtaButtonText && !displayCtaQrCode) return null;
  
  // Helper function to apply background color
  const getBackgroundStyle = (bgColor?: string) => {
    if (!bgColor) return {};
    
    // Check if it's a Tailwind class
    if (bgColor.startsWith('bg-') || bgColor.includes(' bg-') || bgColor.includes('from-') || bgColor.includes('to-')) {
      return { className: bgColor };
    }
    
    // Check if it's a gradient
    if (bgColor.startsWith('linear-gradient') || bgColor.startsWith('radial-gradient')) {
      return { style: { background: bgColor } };
    }
    
    // Otherwise treat as a color value (hex, rgb, etc.)
    return { style: { backgroundColor: bgColor } };
  };
  
  const bgProps = getBackgroundStyle(backgroundColor);
  const ctaBgProps = getBackgroundStyle(ctaBackgroundColor);
  
  // Render hero style if we have hero content
  if (hasHeroContent) {
    // Determine the background style to use
    let backgroundStyle = {};
    if (backgroundImage) {
      backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else if (bgProps.style) {
      backgroundStyle = bgProps.style;
    }
    
    return (
      <div 
        className={`relative flex items-center justify-center py-8 px-8 ${bgProps.className || ''} ${className}`}
        style={backgroundStyle}
      >
        {/* Overlay for better text readability */}
        {useOverlayStyle && <div className="absolute inset-0 bg-black/40" />}
        
        <div className={`relative max-w-4xl mx-auto text-center px-4 ${finalTextColor}`}>
          {heroHeadline && (
            <h1 className={`
              ${heroHeadlineTypography?.fontSize || 'text-5xl md:text-7xl'}
              ${heroHeadlineTypography?.fontFamily || 'font-sans'}
              ${heroHeadlineTypography?.fontWeight || 'font-bold'}
              ${heroHeadlineTypography?.fontStyle || ''}
              ${heroHeadlineTypography?.textDecoration || ''}
              ${heroHeadlineTypography?.color || finalTextColor}
              ${getAlignmentClass(heroHeadlineTypography?.alignment) || 'text-center'}
              mb-6
            `}>
              {heroHeadline}
            </h1>
          )}
          
          {heroSubheadline && (
            <p className={`
              ${heroSubheadlineTypography?.fontSize || 'text-xl md:text-2xl'}
              ${heroSubheadlineTypography?.fontFamily || 'font-sans'}
              ${heroSubheadlineTypography?.fontWeight || 'font-normal'}
              ${heroSubheadlineTypography?.fontStyle || ''}
              ${heroSubheadlineTypography?.textDecoration || ''}
              ${heroSubheadlineTypography?.color || finalTextColor}
              ${getAlignmentClass(heroSubheadlineTypography?.alignment) || 'text-center'}
              mb-12 opacity-90
            `}>
              {heroSubheadline}
            </p>
          )}
          
          {/* Bullets */}
          {bullets && bullets.length > 0 && (
            <div className="mb-12 max-w-2xl mx-auto">
              {howToGetFeaturedTitle && (
                <h3 className={`
                  ${howToGetFeaturedTitleTypography?.fontSize || 'text-2xl'}
                  ${howToGetFeaturedTitleTypography?.fontFamily || 'font-sans'}
                  ${howToGetFeaturedTitleTypography?.fontWeight || 'font-bold'}
                  ${howToGetFeaturedTitleTypography?.fontStyle || ''}
                  ${howToGetFeaturedTitleTypography?.textDecoration || ''}
                  ${howToGetFeaturedTitleTypography?.color || finalTextColor}
                  ${getAlignmentClass(howToGetFeaturedTitleTypography?.alignment) || 'text-center'}
                  mb-6
                `}>
                  {howToGetFeaturedTitle}
                </h3>
              )}
              <div className="space-y-4">
                {bullets.map((bullet, index) => (
                  <div key={index} className="flex items-start text-left gap-3">
                    <span className={`text-2xl flex-shrink-0 ${goldColor}`}>
                      {index + 1}.
                    </span>
                    <p className="text-lg flex-1 break-words">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* CTA Section */}
          {(displayCtaHeadline || displayCtaQrCode || displayCtaButtonLink) && (
            <div 
              className={`rounded-2xl p-8 ${
                isOverlayActive ? "bg-gray-50/10 backdrop-blur-md" : (ctaBgProps.className || "")
              }`}
              style={!isOverlayActive ? ctaBgProps.style : undefined}
            >
              <CallToActionContent
                ctaHeadline={displayCtaHeadline}
                ctaHeadlineTypography={displayCtaHeadlineTypography}
                description={description}
                ctaButtonText={displayCtaButtonText}
                ctaButtonLink={displayCtaButtonLink}
                ctaQrCode={displayCtaQrCode}
                ctaTagline={displayCtaTagline}
                ctaTaglineTypography={displayCtaTaglineTypography}
                darkMode={isOverlayActive}
                finalTextColor={finalTextColor}
                finalButtonColor={finalButtonColor}
                getAlignmentClass={getAlignmentClass}
                onCtaClick={onCtaClick}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Otherwise render simple CTA style
  // For simple CTA, use ctaBackgroundColor if provided, otherwise use backgroundColor
  const simpleBgProps = ctaBackgroundColor ? ctaBgProps : bgProps;
  
  return (
    <div 
      className={`text-center py-8 px-8 ${simpleBgProps.className || ''} ${className}`}
      style={simpleBgProps.style || {}}
    >
      <CallToActionContent
        ctaHeadline={displayCtaHeadline}
        ctaHeadlineTypography={displayCtaHeadlineTypography}
        description={description}
        ctaButtonText={displayCtaButtonText}
        ctaButtonLink={displayCtaButtonLink}
        ctaQrCode={displayCtaQrCode}
        ctaTagline={displayCtaTagline}
        ctaTaglineTypography={displayCtaTaglineTypography}
        darkMode={darkMode}
        finalTextColor={finalTextColor}
        finalButtonColor={finalButtonColor}
        getAlignmentClass={getAlignmentClass}
        onCtaClick={onCtaClick}
      />
    </div>
  );
}

// CTA Content Component (extracted for reuse)
function CallToActionContent({
  ctaHeadline,
  ctaHeadlineTypography,
  description,
  ctaButtonText,
  ctaButtonLink,
  ctaQrCode,
  ctaTagline,
  ctaTaglineTypography,
  darkMode,
  finalTextColor,
  finalButtonColor,
  getAlignmentClass,
  onCtaClick,
}: any) {
  // Debug: Log what button text we have
  console.log('[CallToActionContent] Button text received:', { ctaButtonText, hasOnCtaClick: !!onCtaClick });

  return (
    <>
      {ctaHeadline && (
        <h3 className={`
          ${ctaHeadlineTypography?.fontSize || 'text-2xl md:text-3xl'}
          ${ctaHeadlineTypography?.fontFamily || 'font-sans'}
          ${ctaHeadlineTypography?.fontWeight || 'font-bold'}
          ${ctaHeadlineTypography?.fontStyle || ''}
          ${ctaHeadlineTypography?.textDecoration || ''}
          ${ctaHeadlineTypography?.color || finalTextColor}
          ${getAlignmentClass(ctaHeadlineTypography?.alignment) || 'text-center'}
          mb-6
        `}>
          {ctaHeadline}
        </h3>
      )}
      
      {description && (
        <p className={`mb-6 ${finalTextColor} opacity-90`}>{description}</p>
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {ctaQrCode && (() => {
          // Validate that it's a proper URL before rendering
          const isValidUrl = (() => {
            try {
              // Must start with http:// or https:// and be a valid URL
              if (!ctaQrCode.startsWith('http://') && !ctaQrCode.startsWith('https://')) {
                // Check if it's a valid relative path (starts with /)
                if (ctaQrCode.startsWith('/')) return true;
                return false;
              }
              new URL(ctaQrCode);
              return true;
            } catch {
              return false;
            }
          })();

          // Don't render QR code for invalid URLs
          if (!isValidUrl) {
            return null;
          }

          const isExternalUrl = ctaQrCode.startsWith('http://') || ctaQrCode.startsWith('https://');
          const qrCodeSrc = isExternalUrl
            ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(ctaQrCode)}&size=200x200`
            : ctaQrCode;

          return (
            <div className="p-4 rounded-lg shadow-lg bg-gray-50">
              <div className="relative w-48 h-48">
                <Image
                  src={qrCodeSrc}
                  alt="Scan to join Glamlink"
                  fill
                  className="object-contain"
                  unoptimized={isExternalUrl}
                />
              </div>
            </div>
          );
        })()}
        
        <div className="flex flex-col items-center gap-4">
          {ctaButtonText && ctaButtonLink && (
            <MagazineLink
              field={typeof ctaButtonLink === 'object' ? ctaButtonLink : { url: ctaButtonLink, action: 'link' }}
              className={`px-8 py-4 ${finalButtonColor} rounded-full text-lg font-bold hover:opacity-90 transition-opacity shadow-lg`}
              onClick={() => {
                console.log('[CallToAction] Button clicked! Passing label:', ctaButtonText);
                onCtaClick?.(ctaButtonText);
              }}
            >
              {ctaButtonText}
            </MagazineLink>
          )}
          {ctaTagline && (
            <p className={`
              ${ctaTaglineTypography?.fontSize || 'text-sm'}
              ${ctaTaglineTypography?.fontFamily || 'font-sans'}
              ${ctaTaglineTypography?.fontWeight || 'font-normal'}
              ${ctaTaglineTypography?.fontStyle || ''}
              ${ctaTaglineTypography?.textDecoration || ''}
              ${ctaTaglineTypography?.color || (darkMode ? 'text-white' : 'text-gray-600')}
              ${getAlignmentClass(ctaTaglineTypography?.alignment) || 'text-center'}
              ${darkMode ? 'opacity-90' : ''}
            `}>
              {ctaTagline}
            </p>
          )}
        </div>
      </div>
    </>
  );
}