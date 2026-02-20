"use client";

interface BackgroundWrapperProps {
  backgroundColor?: string | Record<string, string>;
  section?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function BackgroundWrapper({ 
  backgroundColor, 
  section = "main", 
  children, 
  className = "",
  style = {}
}: BackgroundWrapperProps) {
  // Parse background colors - improved logic
  const bgValue = (() => {
    if (!backgroundColor) return undefined;
    
    // If it's a string, use it directly
    if (typeof backgroundColor === "string") return backgroundColor;
    
    // If it's an object, try to get section-specific value
    if (typeof backgroundColor === "object") {
      const backgrounds = backgroundColor as Record<string, string>;
      // Try section-specific first, then fall back to main
      return backgrounds[section] || backgrounds.main || undefined;
    }
    
    return undefined;
  })();

  // Check if a value is a Tailwind class
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

  // Check if a value is a CSS gradient
  const isCSSGradient = (value?: string) => {
    if (!value) return false;
    return (
      value.startsWith("linear-gradient") ||
      value.startsWith("radial-gradient") ||
      value.startsWith("conic-gradient") ||
      value.startsWith("repeating-")
    );
  };

  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === "transparent") return {};
    
    // If it's a Tailwind class, use className
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    
    // If it's a gradient or any other CSS value, use inline style
    // This includes gradients, hex colors, rgb(), etc.
    return { style: { background: bgValue } };
  };

  const bgProps = getBackgroundProps(bgValue);

  // Debug logging in development
  if (process.env.NODE_ENV === 'development' && bgValue) {
    console.log('BackgroundWrapper Debug:', {
      section,
      bgValue,
      isTailwind: isTailwindClass(bgValue),
      isGradient: isCSSGradient(bgValue),
      bgProps
    });
  }

  return (
    <div 
      className={`${bgProps.className || ""} ${className}`} 
      style={{...bgProps.style, ...style}}
    >
      {children}
    </div>
  );
}