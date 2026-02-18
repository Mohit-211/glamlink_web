"use client";

import React from 'react';

interface SneakPeek {
  title?: string;
  teaser?: string;
  releaseDate?: string;
  backgroundColor?: string;
}

interface SneakPeeksProps {
  peeks?: SneakPeek[];
  title?: string;
  titleIcon?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
    tag?: string;
  };
  sneakPeeksGlobalBackgroundColor?: string;
  className?: string;
}

export default function SneakPeeks({
  peeks,
  title = "Coming Soon",
  titleIcon = "👀",
  titleTypography,
  sneakPeeksGlobalBackgroundColor,
  className = ""
}: SneakPeeksProps) {
  // Get tag from typography settings
  const titleTag = titleTypography?.tag || "h3";
  if (!peeks || peeks.length === 0) return null;
  
  // Helper function to determine if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    if (!value) return false;
    return (
      value.startsWith("bg-") || 
      value.includes(" bg-") || 
      value.includes("from-") || 
      value.includes("to-") ||
      value.includes("via-")
    );
  };

  // Helper function to get background styling with fallback
  const getBackgroundStyle = (bgColor?: string, fallback?: string) => {
    // Use individual color first, then global, then default
    const color = bgColor || fallback || "bg-white/80";
    
    if (color === "transparent") {
      return { className: "bg-transparent", style: {} };
    }
    
    // If it's a Tailwind class, use className
    if (isTailwindClass(color)) {
      return { className: color, style: {} };
    }
    
    // Otherwise use inline style (for gradients, hex colors, etc.)
    return { className: "", style: { background: color } };
  };
  
  // Build title classes from typography settings
  const titleClasses = [
    titleTypography?.fontSize || "text-lg md:text-xl",
    titleTypography?.fontFamily || "font-[Roboto,sans-serif]",
    titleTypography?.fontWeight || "font-bold",
    titleTypography?.fontStyle || "",
    titleTypography?.textDecoration || "",
    titleTypography?.color || "text-glamlink-teal",
    "mb-8 flex items-center"
  ].join(" ");
  
  
  // Render the heading with dynamic tag
  const renderHeading = () => {
    const content = (
      <>
        {titleIcon && <span className="text-3xl mr-3">{titleIcon}</span>}
        {title}
      </>
    );
    
    switch (titleTag) {
      case 'h1':
        return <h1 className={titleClasses}>{content}</h1>;
      case 'h2':
        return <h2 className={titleClasses}>{content}</h2>;
      case 'h4':
        return <h4 className={titleClasses}>{content}</h4>;
      case 'h5':
        return <h5 className={titleClasses}>{content}</h5>;
      case 'h6':
        return <h6 className={titleClasses}>{content}</h6>;
      case 'h3':
      default:
        return <h3 className={titleClasses}>{content}</h3>;
    }
  };
  
  return (
    <div className={`${className}`}>
      {renderHeading()}
      
      <div className="space-y-4">
        {peeks.map((peek, index) => {
          // Use individual card background first, then global background
          const bgProps = getBackgroundStyle(peek.backgroundColor, sneakPeeksGlobalBackgroundColor);
          return (
          <div key={index} className={`backdrop-blur rounded-lg p-6 border-l-4 border-glamlink-purple ${bgProps.className}`} style={bgProps.style}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                {peek.title && (
                  <h4 className="text-lg font-bold mb-2 text-gray-900">{peek.title}</h4>
                )}
                {peek.releaseDate && (
                  <span className="block sm:hidden text-sm text-gray-900 mb-2">
                    {peek.releaseDate}
                  </span>
                )}
                {peek.teaser && (
                  <p className="text-gray-900">{peek.teaser}</p>
                )}
              </div>
              {peek.releaseDate && (
                <span className="hidden sm:block ml-0 sm:ml-4 text-sm text-gray-900 whitespace-nowrap">
                  {peek.releaseDate}
                </span>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}