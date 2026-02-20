"use client";

import React from 'react';

interface Tip {
  title?: string;
  description?: string;
  icon?: string;
  link?: string;
  backgroundColor?: string;
}

interface TipsListProps {
  tips?: Tip[];
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
  numbered?: boolean;
  tipsGlobalBackgroundColor?: string;
  className?: string;
}

export default function TipsList({
  tips,
  title = "Pro Tips",
  titleIcon = "💡",
  titleTypography,
  numbered = false,
  tipsGlobalBackgroundColor,
  className = ""
}: TipsListProps) {
  // Get tag from typography settings
  const titleTag = titleTypography?.tag || "h3";
  if (!tips || tips.length === 0) return null;
  
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
    <div className={`mb-16 ${className}`}>
      {renderHeading()}
      
      <div className="grid md:grid-cols-3 gap-6">
        {tips.map((tip, index) => {
          // Use individual card background first, then global background
          const bgProps = getBackgroundStyle(tip.backgroundColor, tipsGlobalBackgroundColor);
          return (
          <div key={index} className={`rounded-lg p-6 ${bgProps.className}`} style={bgProps.style}>
            {/* Icon or number */}
            <div className="text-2xl mb-3">
              {numbered ? (
                <span className="flex w-10 h-10 items-center justify-center rounded-full bg-glamlink-purple text-white font-bold">
                  {index + 1}
                </span>
              ) : (
                tip.icon || "💫"
              )}
            </div>
            
            {/* Title */}
            {tip.title && (
              <h4 className="font-bold mb-2 text-gray-900">{tip.title}</h4>
            )}
            
            {/* Description */}
            {tip.description && (
              <p className="text-sm text-gray-600">{tip.description}</p>
            )}
            
            {/* Optional link */}
            {tip.link && (
              <a 
                href={tip.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-glamlink-teal hover:text-glamlink-purple transition-colors font-medium"
              >
                Learn more →
              </a>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}