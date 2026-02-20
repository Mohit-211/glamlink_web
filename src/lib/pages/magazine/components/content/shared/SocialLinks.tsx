"use client";

import Image from "next/image";
import PDFTextLink from "../utils/PDFTextLink";
import { getImageUrl, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import TypographyWrapper, { TypographySettings } from "../utils/TypographyWrapper";

interface SocialLink {
  platform: string;
  url: any; // Can be string or link object with url, action, etc.
  label?: string;
}

interface SocialLinksProps {
  links?: SocialLink[] | {
    instagram?: any;
    website?: any;
    glamlinkProfile?: any;
  };
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  profileImage?: string | any; // Support image object with crop data
  profileImageWidth?: number;  // Width in pixels (default: 150)
  profileImageHeight?: number; // Height in pixels (default: 150)
  profileImageBorderColor?: string; // Border color (default: "#f5e6d3")
  socialHandle?: string; // Social media handle or username
  socialHandleTypography?: TypographySettings; // Typography settings for handle
  className?: string;
  containerClassName?: string;
  /** Analytics callback for link clicks */
  onLinkClick?: (linkType: string, url: string) => void;
}

// Helper to check if a field has a valid URL
function hasValidUrl(field: any): boolean {
  if (!field) return false;
  if (typeof field === 'string') return field.length > 0;
  if (typeof field === 'object' && field.url) return field.url.length > 0;
  return false;
}

// Get platform display name
function getPlatformName(platform: string, customLabel?: string): string {
  if (customLabel) return customLabel;
  
  const platformNames: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    website: "Website",
    glamlink: "View on Glamlink",
    custom: "Visit Link"
  };
  
  return platformNames[platform] || platform;
}

// Get platform-specific styling
function getPlatformStyles(platform: string): string {
  if (platform === 'glamlink') {
    return "bg-glamlink-teal text-white hover:bg-glamlink-teal-dark";
  }
  return "bg-black text-white hover:bg-gray-800";
}

// Helper to extract URL string from link object or string
function getUrlString(field: any): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field.url) return field.url;
  return '';
}

export default function SocialLinks({
  links,
  title,
  titleTypography,
  profileImage,
  profileImageWidth,
  profileImageHeight,
  profileImageBorderColor,
  socialHandle,
  socialHandleTypography,
  className = "",
  containerClassName = "",
  onLinkClick,
}: SocialLinksProps) {
  if (!links) return null;
  
  // Debug logging for social links rendering
  console.log('📱 SocialLinks component rendering:', {
    hasLinks: !!links,
    isArray: Array.isArray(links),
    linkCount: Array.isArray(links) ? links.length : Object.keys(links).length
  });
  
  // Build title classes from typography settings
  const titleClasses = title ? [
    titleTypography?.fontSize || "text-xl",
    titleTypography?.fontFamily || "font-sans",
    titleTypography?.fontWeight || "font-semibold",
    titleTypography?.fontStyle || "",
    titleTypography?.textDecoration || "",
    titleTypography?.color || "text-gray-900",
    titleTypography?.alignment === "left" ? "text-left" : 
      titleTypography?.alignment === "right" ? "text-right" : 
      titleTypography?.alignment === "center" ? "text-center" : "text-center",
    "mb-4"
  ].filter(Boolean).join(" ") : "";

  // Handle array format (new custom section format)
  if (Array.isArray(links)) {
    const validLinks = links.filter(link => {
      // Check if url exists (as string or object with url property)
      const hasUrl = link.url && (typeof link.url === 'string' ? link.url : link.url.url);
      return hasUrl && link.platform;
    });
    
    if (validLinks.length === 0) return null;
    
    return (
      <div className={`py-8 ${containerClassName}`}>
        <div className="max-w-4xl mx-auto">
          {title && (
            <h3 className={titleClasses}>{title}</h3>
          )}
          {profileImage && (
            <div className="flex justify-center mb-6">
              <div 
                className="relative rounded-full p-1 mx-auto"
                style={{ 
                  backgroundColor: profileImageBorderColor || '#f5e6d3',
                  width: `${profileImageWidth || 150}px`,
                  height: `${profileImageHeight || 150}px`
                }}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={getImageUrl(profileImage) || "/images/placeholder.png"}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    style={{
                      objectPosition: getImageObjectPosition(profileImage),
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {socialHandle && (
            <div className="mb-4">
              <TypographyWrapper
                settings={socialHandleTypography}
                defaultSettings={{
                  fontSize: "text-lg",
                  fontFamily: "font-sans",
                  fontWeight: "font-medium",
                  color: "text-gray-700",
                  alignment: "center"
                }}
                as="div"
              >
                {socialHandle}
              </TypographyWrapper>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {validLinks.map((link, index) => (
              <span
                key={index}
                onClick={() => onLinkClick?.(link.platform, getUrlString(link.url))}
              >
                <PDFTextLink
                  field={link.url}
                  className={`px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all ${getPlatformStyles(link.platform)} ${className}`}
                  target={link.platform === 'glamlink' ? '_self' : '_blank'}
                  pdfText="JOIN GLAMLINK"
                  pdfHref="https://linktr.ee/glamlink_app"
                >
                  <span className="font-medium">{getPlatformName(link.platform, link.label)}</span>
                </PDFTextLink>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Handle legacy object format (for backward compatibility)
  const hasAnyValidLinks = 
    hasValidUrl(links.instagram) || 
    hasValidUrl(links.website) || 
    hasValidUrl(links.glamlinkProfile);

  if (!hasAnyValidLinks) return null;
  
  // Debug logging for legacy format
  console.log('📱 SocialLinks rendering legacy object format:', {
    instagram: hasValidUrl(links.instagram),
    website: hasValidUrl(links.website),
    glamlinkProfile: hasValidUrl(links.glamlinkProfile)
  });

  return (
    <div className={`py-8 ${containerClassName}`}>
      <div className="max-w-4xl mx-auto px-8">
        {title && (
          <h3 className={titleClasses}>{title}</h3>
        )}
        {profileImage && (
          <div className="flex justify-center mb-6">
            <div 
              className="relative rounded-full p-1 mx-auto"
              style={{ 
                backgroundColor: profileImageBorderColor || '#f5e6d3',
                width: `${profileImageWidth || 150}px`,
                height: `${profileImageHeight || 150}px`
              }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={getImageUrl(profileImage) || "/images/placeholder.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  style={{
                    objectPosition: getImageObjectPosition(profileImage),
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {socialHandle && (
          <div className="mb-4">
            <TypographyWrapper
              settings={socialHandleTypography}
              defaultSettings={{
                fontSize: "text-lg",
                fontFamily: "font-sans",
                fontWeight: "font-medium",
                color: "text-gray-700",
                alignment: "center"
              }}
              as="div"
            >
              {socialHandle}
            </TypographyWrapper>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {hasValidUrl(links.instagram) && (
            <span onClick={() => onLinkClick?.('instagram', getUrlString(links.instagram))}>
              <PDFTextLink
                field={links.instagram}
                className={`px-6 py-2 bg-black text-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-gray-800 ${className}`}
                pdfText="JOIN GLAMLINK"
                pdfHref="https://linktr.ee/glamlink_app"
              >
                <span className="font-medium">Instagram</span>
              </PDFTextLink>
            </span>
          )}
          {hasValidUrl(links.website) && (
            <span onClick={() => onLinkClick?.('website', getUrlString(links.website))}>
              <PDFTextLink
                field={links.website}
                className={`px-6 py-2 bg-black text-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-gray-800 ${className}`}
                pdfText="JOIN GLAMLINK"
                pdfHref="https://linktr.ee/glamlink_app"
              >
                <span className="font-medium">Website</span>
              </PDFTextLink>
            </span>
          )}
          {hasValidUrl(links.glamlinkProfile) && (
            <span onClick={() => onLinkClick?.('glamlink', getUrlString(links.glamlinkProfile))}>
              <PDFTextLink
                field={links.glamlinkProfile}
                className={`px-6 py-2 bg-glamlink-teal text-white rounded-full shadow-md hover:shadow-lg transition-shadow hover:bg-glamlink-teal-dark ${className}`}
                target="_self"
                pdfText="JOIN GLAMLINK"
                pdfHref="https://linktr.ee/glamlink_app"
              >
                <span className="font-medium">View on Glamlink</span>
              </PDFTextLink>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}