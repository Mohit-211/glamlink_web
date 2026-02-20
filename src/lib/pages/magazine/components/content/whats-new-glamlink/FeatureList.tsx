"use client";

interface Feature {
  icon?: string;
  title: string;
  description: string;
  availability?: string;
  backgroundColor?: string;
}

interface FeatureListProps {
  features?: Feature[];
  globalBackgroundColor?: string;
  className?: string;
}

export default function FeatureList({ features, globalBackgroundColor, className = "" }: FeatureListProps) {
  if (!features || features.length === 0) return null;

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

  // Helper function to get background styling
  const getBackgroundStyle = (bgColor?: string, fallback?: string) => {
    // Use the provided color, or fall back to global, or default to white
    const color = bgColor || fallback || "bg-white";
    
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

  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {features.map((feature, index) => {
        // Use individual card background if set, otherwise use global background
        const bgProps = getBackgroundStyle(feature.backgroundColor, globalBackgroundColor);
        
        return (
          <div
            key={index}
            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow ${bgProps.className}`}
            style={bgProps.style}
          >
            {feature.icon && <div className="text-4xl mb-4">{feature.icon}</div>}
            <h4 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h4>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            {feature.availability && (
              <span className="inline-block px-3 py-1 bg-white text-black rounded-full text-sm">
                {feature.availability}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}