"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface StatItem {
  icon?: string;
  image?: any;
  title: string;
  subtitle?: string;
  value: string;
}

interface StatsProps {
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    alignment?: string;
    fontStyle?: string;
    textDecoration?: string;
  };
  items: StatItem[];
  className?: string;
  itemClassName?: string;
  layout?: "grid" | "list";
  columns?: 1 | 2 | 3;
}

export default function Stats({ 
  title,
  titleTypography,
  items, 
  className = "",
  itemClassName = "",
  layout = "list",
  columns = 2
}: StatsProps) {
  if (!items || items.length === 0) return null;

  const gridCols = layout === "grid" 
    ? columns === 3 ? "lg:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : ""
    : "";

  // Build title classes with typography settings
  const getTitleClasses = () => {
    const classes = [];
    
    // Apply typography settings or defaults
    classes.push(titleTypography?.fontSize || "text-xl");
    classes.push(titleTypography?.fontWeight || "font-bold");
    classes.push(titleTypography?.fontFamily || "font-sans");
    classes.push(titleTypography?.color || "text-gray-900");
    
    // Handle alignment
    if (titleTypography?.alignment === "center") classes.push("text-center");
    else if (titleTypography?.alignment === "right") classes.push("text-right");
    else if (titleTypography?.alignment === "justify") classes.push("text-justify");
    
    // Handle style decorations
    if (titleTypography?.fontStyle === "italic") classes.push("italic");
    if (titleTypography?.textDecoration === "underline") classes.push("underline");
    else if (titleTypography?.textDecoration === "line-through") classes.push("line-through");
    
    classes.push("mb-4"); // Add margin bottom
    
    return classes.join(" ");
  };

  return (
    <div>
      {title && (
        <h3 className={getTitleClasses()}>
          {title}
        </h3>
      )}
      <div className={`${layout === "grid" ? `grid gap-4 ${gridCols}` : "space-y-3"} ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${itemClassName}`}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="text-2xl">{item.icon}</span>
            )}
            {item.image && !item.icon && (
              <div className="relative w-12 h-12 rounded">
                <Image 
                  src={getImageUrl(item.image) || "/images/placeholder.png"} 
                  alt={item.title || "Item"} 
                  fill 
                  className={`${getImageObjectFit(item.image) === "cover" ? "object-cover" : "object-contain"} rounded`}
                  style={{
                    objectPosition: getImageObjectPosition(item.image),
                  }}
                />
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-gray-600">{item.subtitle}</div>
              )}
            </div>
          </div>
          <div className="text-lg font-bold text-glamlink-gold">
            {item.value}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}