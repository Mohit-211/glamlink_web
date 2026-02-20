"use client";

import Image from "next/image";
import { useState } from "react";

interface SocialFollowProps {
  socialLink?: {
    followText?: string;
    handle?: string;
    qrCode?: string;
    platform?: string;
  };
  backgroundColor?: string;
  className?: string;
}

// Helper function to handle background styles
function getBackgroundStyle(backgroundColor?: string): string {
  if (!backgroundColor || backgroundColor === "transparent") {
    return "bg-transparent";
  }
  
  // Check if it's a Tailwind class
  if (backgroundColor.startsWith("bg-")) {
    return backgroundColor;
  }
  
  // Otherwise, we'll use inline styles
  return "";
}

function getInlineBackgroundStyle(backgroundColor?: string): React.CSSProperties {
  if (!backgroundColor || backgroundColor === "transparent" || backgroundColor.startsWith("bg-")) {
    return {};
  }
  
  // Handle hex, rgb, or gradient values
  return { background: backgroundColor };
}

export default function SocialFollow({ socialLink, backgroundColor, className = "" }: SocialFollowProps) {
  const [imageError, setImageError] = useState(false);
  
  if (!socialLink) return null;

  // Validate if the qrCode value is a valid URL
  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Check if qrCode should be treated as a URL for QR generation
  const isUrl = socialLink.qrCode && isValidUrl(socialLink.qrCode);

  // Check if it's a valid image path (starts with / or is a full URL)
  const isValidImagePath = socialLink.qrCode && (
    socialLink.qrCode.startsWith("/") || 
    socialLink.qrCode.startsWith("http://") || 
    socialLink.qrCode.startsWith("https://")
  );

  // Generate QR code from URL or use existing image path
  const qrCodeSrc = isUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(socialLink.qrCode!)}&size=120x120` 
    : isValidImagePath ? socialLink.qrCode : null;

  const bgClass = getBackgroundStyle(backgroundColor);
  const inlineStyles = getInlineBackgroundStyle(backgroundColor);
  
  return (
    <div 
      className={`rounded-lg p-6 ${bgClass || 'bg-gray-50'} ${className}`}
      style={inlineStyles}
    >
      {socialLink.followText && (
        <h3 className="text-2xl font-bold mb-1 text-gray-900 text-left">
          {socialLink.platform === "Custom"
            ? socialLink.followText
            : `${socialLink.followText} on ${socialLink.platform || "Glamlink"}`
          }
        </h3>
      )}
      {socialLink.handle && (
        <p className="text-sm text-gray-700 mb-4 text-left">
          {socialLink.followText ? `@${socialLink.handle}` : socialLink.handle}
        </p>
      )}
      {socialLink.qrCode && !imageError ? (
        qrCodeSrc ? (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-3 inline-block border border-gray-200">
              <Image
                src={qrCodeSrc}
                alt="QR Code"
                width={120}
                height={120}
                className="rounded"
                unoptimized={!!isUrl} // Skip Next.js optimization for external QR API
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
            <p className="text-sm text-red-500">Invalid QR Code URL</p>
            <p className="text-xs text-gray-500 mt-1">Please enter a valid URL (starting with http:// or https://)</p>
          </div>
        )
      ) : imageError ? (
        <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
          <p className="text-sm text-red-500">QR Code could not be loaded</p>
          <p className="text-xs text-gray-500 mt-1">Please check the URL and try again</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 italic">Enter a URL to generate QR Code</p>
        </div>
      )}
    </div>
  );
}