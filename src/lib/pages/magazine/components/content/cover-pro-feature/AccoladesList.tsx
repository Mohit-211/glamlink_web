"use client";

import React from 'react';
import TypographyWrapper, { TypographySettings } from '../utils/TypographyWrapper';

interface AccoladesListProps {
  accolades?: string[];
  accoladesTypography?: TypographySettings;
  title?: string;
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
  className?: string;
}

export default function AccoladesList({
  accolades,
  accoladesTypography,
  title = "Key Achievements",
  titleTypography,
  className = ""
}: AccoladesListProps) {
  // Get tag from typography settings
  const titleTag = titleTypography?.tag || "h3";
  if (!accolades || accolades.length === 0) return null;

  // Build title classes from typography settings
  const titleClasses = [
    titleTypography?.fontSize || "text-2xl",
    titleTypography?.fontFamily || "font-sans",
    titleTypography?.fontWeight || "font-bold",
    titleTypography?.fontStyle || "",
    titleTypography?.textDecoration || "",
    titleTypography?.color || "text-gray-900",
    "mb-4"
  ].filter(Boolean).join(" ");

  // Render the heading with dynamic tag
  const renderHeading = () => {
    if (!title) return null;
    
    switch (titleTag) {
      case 'h1':
        return <h1 className={titleClasses}>{title}</h1>;
      case 'h2':
        return <h2 className={titleClasses}>{title}</h2>;
      case 'h4':
        return <h4 className={titleClasses}>{title}</h4>;
      case 'h5':
        return <h5 className={titleClasses}>{title}</h5>;
      case 'h6':
        return <h6 className={titleClasses}>{title}</h6>;
      case 'h3':
      default:
        return <h3 className={titleClasses}>{title}</h3>;
    }
  };

  return (
    <div className={`mb-12 ${className}`}>
      {renderHeading()}
      <ul className="space-y-2" style={{ paddingLeft: '2rem' }}>
        {accolades.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-glamlink-teal mr-1 sm:mr-2 flex-shrink-0">★</span>
            <TypographyWrapper
              settings={accoladesTypography}
              defaultSettings={{
                fontSize: "text-base",
                fontFamily: "font-sans",
                fontWeight: "font-normal",
                color: "text-gray-700"
              }}
              as="span"
            >
              {item}
            </TypographyWrapper>
          </li>
        ))}
      </ul>
    </div>
  );
}