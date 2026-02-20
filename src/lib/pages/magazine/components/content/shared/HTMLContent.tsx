"use client";

interface HTMLContentProps {
  content?: string;
  contentTypography?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    alignment?: string;
    fontStyle?: string;
    textDecoration?: string;
  };
  className?: string;
}

export default function HTMLContent({
  content = "<div>Custom HTML</div>",
  contentTypography,
  className = ""
}: HTMLContentProps) {
  if (!content) return null;

  return (
    <div className={className}>
      <div
        className={`
          ${contentTypography?.fontSize || "text-base"}
          ${contentTypography?.fontWeight || "font-normal"}
          ${contentTypography?.fontFamily || "font-sans"}
          ${contentTypography?.color || "text-gray-900"}
          ${contentTypography?.alignment === "center" ? "text-center" :
            contentTypography?.alignment === "right" ? "text-right" :
            contentTypography?.alignment === "justify" ? "text-justify" : ""}
          ${contentTypography?.fontStyle === "italic" ? "italic" : ""}
          ${contentTypography?.textDecoration === "underline" ? "underline" : ""}
          ${contentTypography?.textDecoration === "line-through" ? "line-through" : ""}
        `}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}