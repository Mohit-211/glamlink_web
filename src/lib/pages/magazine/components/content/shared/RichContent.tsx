"use client";

interface RichContentProps {
  title?: string;
  titleStyles?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
    tag?: string;
  };
  content: string;
  enableDropCap?: boolean;
  dropCapStyle?: "classic" | "modern" | "elegant";
  dropCapColor?: string;
  className?: string;
}

// Helper function to map Tailwind color classes to drop cap color classes
function getDropCapColorClass(colorClass: string): string {
  const colorMap: Record<string, string> = {
    "text-glamlink-purple": "drop-cap-color-purple",
    "text-glamlink-teal": "drop-cap-color-teal",
    "text-gray-900": "drop-cap-color-black",
    "text-gray-600": "drop-cap-color-gray",
  };
  return colorMap[colorClass] || "";
}

export default function RichContent({
  title,
  titleStyles = {},
  content,
  enableDropCap = false,
  dropCapStyle = "classic",
  dropCapColor,
  className = ""
}: RichContentProps) {
  if (!content && !title) return null;

  // Get tag from typography settings
  const HeadingTag = (titleStyles?.tag || "h2") as React.ElementType;

  return (
    <div className={className}>
      {title && (
        <HeadingTag
          className={`
            ${titleStyles.fontSize || "text-2xl"}
            ${titleStyles.fontFamily || "font-sans"}
            ${titleStyles.fontWeight || "font-bold"}
            ${titleStyles.fontStyle || ""}
            ${titleStyles.textDecoration || ""}
            ${titleStyles.color || "text-gray-900"}
            ${titleStyles.alignment === "center" ? "text-center" : titleStyles.alignment === "right" ? "text-right" : "text-left"}
            mb-4
          `}
        >
          {title}
        </HeadingTag>
      )}
      <div className="rich-content max-w-none">
        <div
          className={`
            whitespace-pre-wrap
            ${enableDropCap ? "drop-cap-container" : ""}
            ${enableDropCap ? `drop-cap-${dropCapStyle}` : ""}
            ${enableDropCap && dropCapColor ? getDropCapColorClass(dropCapColor) : ""}
          `}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}