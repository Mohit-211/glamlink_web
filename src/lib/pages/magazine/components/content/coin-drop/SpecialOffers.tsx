"use client";

import { getAlignmentClass } from "../../../config/universalStyles";

interface SpecialOffer {
  title: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  description: string;
  descriptionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  discount?: string;
  discountTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  minCoins?: number;
  minCoinsText?: string;
  minCoinsTextTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  endsIn?: string;
  endsInTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
}

interface SpecialOffersProps {
  offers?: SpecialOffer[];
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  className?: string;
  backgroundColor?: string;
}

export default function SpecialOffers({ 
  offers,
  title = "⚡ Limited Time Offers",
  titleTypography = {},
  className = "",
  backgroundColor = "bg-white"
}: SpecialOffersProps) {
  if (!offers || offers.length === 0) return null;

  // Title typography
  const titleFontSize = titleTypography.fontSize || "text-2xl md:text-3xl";
  const titleFontFamily = titleTypography.fontFamily || "font-sans";
  const titleFontWeight = titleTypography.fontWeight || "font-bold";
  const titleFontStyle = titleTypography.fontStyle || "";
  const titleTextDecoration = titleTypography.textDecoration || "";
  const titleAlignment = titleTypography.alignment || "left";
  const titleColor = titleTypography.color || "text-gray-900";

  return (
    <div className={`border-2 border-gradient-to-r from-glamlink-purple to-glamlink-teal rounded-xl p-8 ${backgroundColor} ${className}`}>
      <h3 className={`
        ${titleFontSize}
        ${titleFontFamily}
        ${titleFontWeight}
        ${titleFontStyle}
        ${titleTextDecoration}
        ${getAlignmentClass(titleAlignment)}
        ${titleColor}
        mb-6
      `}>{title}</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {offers.map((offer, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-r from-glamlink-purple/10 to-glamlink-teal/10 rounded-lg p-4 border border-glamlink-purple/20"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className={`
                ${offer.titleTypography?.fontSize || "text-base"}
                ${offer.titleTypography?.fontFamily || "font-sans"}
                ${offer.titleTypography?.fontWeight || "font-bold"}
                ${offer.titleTypography?.fontStyle || ""}
                ${offer.titleTypography?.textDecoration || ""}
                ${offer.titleTypography?.color || "text-gray-900"}
              `}>{offer.title}</h4>
              {offer.endsIn && (
                <span className={`
                  ${offer.endsInTypography?.fontSize || "text-xs"}
                  ${offer.endsInTypography?.fontFamily || "font-sans"}
                  ${offer.endsInTypography?.fontWeight || "font-medium"}
                  ${offer.endsInTypography?.fontStyle || ""}
                  ${offer.endsInTypography?.textDecoration || ""}
                  ${offer.endsInTypography?.color || "text-glamlink-purple"}
                  bg-glamlink-purple/20 px-2 py-1 rounded
                `}>
                  Ends in {offer.endsIn}
                </span>
              )}
            </div>
            
            <p className={`
              ${offer.descriptionTypography?.fontSize || "text-sm"}
              ${offer.descriptionTypography?.fontFamily || "font-sans"}
              ${offer.descriptionTypography?.fontWeight || "font-normal"}
              ${offer.descriptionTypography?.fontStyle || ""}
              ${offer.descriptionTypography?.textDecoration || ""}
              ${offer.descriptionTypography?.color || "text-gray-700"}
              mb-3
            `}>{offer.description}</p>
            
            <div className="flex items-center justify-between">
              {offer.discount && (
                <span className={`
                  ${offer.discountTypography?.fontSize || "text-base"}
                  ${offer.discountTypography?.fontFamily || "font-sans"}
                  ${offer.discountTypography?.fontWeight || "font-bold"}
                  ${offer.discountTypography?.fontStyle || ""}
                  ${offer.discountTypography?.textDecoration || ""}
                  ${offer.discountTypography?.color || "text-glamlink-purple"}
                `}>
                  {offer.discount}
                </span>
              )}
              {offer.minCoins && (
                <span className={`
                  ${offer.minCoinsTextTypography?.fontSize || "text-sm"}
                  ${offer.minCoinsTextTypography?.fontFamily || "font-sans"}
                  ${offer.minCoinsTextTypography?.fontWeight || "font-normal"}
                  ${offer.minCoinsTextTypography?.fontStyle || ""}
                  ${offer.minCoinsTextTypography?.textDecoration || ""}
                  ${offer.minCoinsTextTypography?.color || "text-gray-600"}
                `}>
                  {offer.minCoinsText || `Min: ${offer.minCoins} 🥯`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}