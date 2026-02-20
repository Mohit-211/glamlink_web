"use client";

interface SectionDividerProps {
  lineStyle?: "solid" | "dashed" | "dotted" | "double";
  lineColor?: string;
  lineWidth?: number;
  spacing?: "small" | "medium" | "large" | "none";
  className?: string;
}

export default function SectionDivider({
  lineStyle = "solid",
  lineColor = "border-gray-300",
  lineWidth = 1,
  spacing = "medium",
  className = ""
}: SectionDividerProps) {
  
  // Map spacing to Tailwind margin classes
  const spacingClasses = {
    none: "",
    small: "my-4",
    medium: "my-8",
    large: "my-12"
  };
  
  // Map line style to CSS style
  const borderStyles: Record<string, string> = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
    double: "border-double"
  };
  
  // Handle custom colors (hex/rgb) vs Tailwind classes
  const borderColorStyle: React.CSSProperties = {};
  let borderColorClass = lineColor;
  
  if (lineColor && (lineColor.startsWith("#") || lineColor.startsWith("rgb"))) {
    borderColorStyle.borderColor = lineColor;
    borderColorClass = "";
  }
  
  // Build border width style
  const borderWidthStyle = lineWidth > 1 ? { borderTopWidth: `${lineWidth}px` } : {};
  
  return (
    <hr 
      className={`
        border-t 
        ${borderStyles[lineStyle]} 
        ${borderColorClass} 
        ${spacingClasses[spacing]} 
        ${className}
      `}
      style={{
        ...borderColorStyle,
        ...borderWidthStyle
      }}
      aria-hidden="true"
    />
  );
}