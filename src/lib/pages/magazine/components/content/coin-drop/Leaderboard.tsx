"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import { getAlignmentClass } from "../../../config/universalStyles";

interface LeaderboardUser {
  name: string;
  nameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  coins: number;
  coinsText?: string;
  coinsTextTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  image?: any;
  badge?: string;
  badgeTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
}

interface LeaderboardProps {
  users?: LeaderboardUser[];
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
  showTopOnly?: boolean;
  topCount?: number;
}

export default function Leaderboard({ 
  users,
  title = "🏆 This Month's Top Earners",
  titleTypography = {},
  className = "",
  backgroundColor = "bg-white",
  showTopOnly = true,
  topCount = 3
}: LeaderboardProps) {
  if (!users || users.length === 0) return null;

  const displayUsers = showTopOnly ? users.slice(0, topCount) : users;
  const medals = ["🥇", "🥈", "🥉"];

  // Title typography
  const titleFontSize = titleTypography.fontSize || "text-2xl md:text-3xl";
  const titleFontFamily = titleTypography.fontFamily || "font-sans";
  const titleFontWeight = titleTypography.fontWeight || "font-bold";
  const titleFontStyle = titleTypography.fontStyle || "";
  const titleTextDecoration = titleTypography.textDecoration || "";
  const titleAlignment = titleTypography.alignment || "center";
  const titleColor = titleTypography.color || "text-gray-900";

  return (
    <div className={`rounded-xl p-8 ${backgroundColor} ${className}`}>
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
      
      <div className={`grid ${topCount === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"} gap-6`}>
        {displayUsers.map((user, index) => (
          <div 
            key={index} 
            className="text-center p-6 bg-gradient-to-b from-glamlink-gold/20 to-white rounded-lg"
          >
            {index < 3 && (
              <div className="text-4xl mb-3">
                {medals[index]}
              </div>
            )}
            
            {user.image && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                <Image 
                  src={getImageUrl(user.image) || "/images/placeholder.png"} 
                  alt={user.name} 
                  fill 
                  className={getImageObjectFit(user.image) === "cover" ? "object-cover" : "object-contain"}
                  style={{
                    objectPosition: getImageObjectPosition(user.image),
                  }}
                />
              </div>
            )}
            
            <h4 className={`
              ${user.nameTypography?.fontSize || "text-base"}
              ${user.nameTypography?.fontFamily || "font-sans"}
              ${user.nameTypography?.fontWeight || "font-bold"}
              ${user.nameTypography?.fontStyle || ""}
              ${user.nameTypography?.textDecoration || ""}
              ${user.nameTypography?.color || "text-gray-900"}
              mb-1
            `}>{user.name}</h4>
            
            <div className={`
              ${user.coinsTextTypography?.fontSize || "text-2xl"}
              ${user.coinsTextTypography?.fontFamily || "font-sans"}
              ${user.coinsTextTypography?.fontWeight || "font-bold"}
              ${user.coinsTextTypography?.fontStyle || ""}
              ${user.coinsTextTypography?.textDecoration || ""}
              ${user.coinsTextTypography?.color || "text-glamlink-gold"}
            `}>
              {user.coinsText || `${user.coins} 🥯`}
            </div>
            
            {user.badge && (
              <div className={`
                ${user.badgeTypography?.fontSize || "text-xs"}
                ${user.badgeTypography?.fontFamily || "font-sans"}
                ${user.badgeTypography?.fontWeight || "font-medium"}
                ${user.badgeTypography?.fontStyle || ""}
                ${user.badgeTypography?.textDecoration || ""}
                ${user.badgeTypography?.color || "text-glamlink-purple"}
                mt-2 inline-block px-3 py-1 bg-glamlink-purple/20 rounded-full
              `}>
                {user.badge}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!showTopOnly && users.length > displayUsers.length && (
        <div className="mt-6 space-y-2">
          {users.slice(displayUsers.length).map((user, index) => (
            <div 
              key={index + displayUsers.length} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-600">
                  #{index + displayUsers.length + 1}
                </span>
                {user.image && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image 
                      src={getImageUrl(user.image) || "/images/placeholder.png"} 
                      alt={user.name} 
                      fill 
                      className={getImageObjectFit(user.image) === "cover" ? "object-cover" : "object-contain"}
                      style={{
                        objectPosition: getImageObjectPosition(user.image),
                      }}
                    />
                  </div>
                )}
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="font-bold text-glamlink-gold">
                {user.coins} 🥯
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}