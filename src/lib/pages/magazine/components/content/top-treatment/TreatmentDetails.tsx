"use client";

interface TreatmentStat {
  icon?: string;
  label?: string;
  labelTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
  };
  value?: string;
  valueTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
  };
  backgroundColor?: string;
}

interface TreatmentDetailsProps {
  name?: string;
  nameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  // Legacy props for backward compatibility
  duration?: string;
  price?: string;
  frequency?: string;
  // New treatment stats array
  treatmentStats?: TreatmentStat[];
  description?: string;
  descriptionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
  };
  benefitsTitle?: string;
  benefitsTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
  };
  benefits?: string[];
  process?: string[];
  aftercare?: string[];
  treatmentBackground?: string;
  className?: string;
}

export default function TreatmentDetails({ name, nameTypography, duration, price, frequency, treatmentStats, description, descriptionTypography, benefitsTitle, benefitsTitleTypography, benefits, process, aftercare, treatmentBackground, className = "" }: TreatmentDetailsProps) {
  // Build legacy stats from individual props if treatmentStats not provided
  const stats = treatmentStats || ([duration && { icon: "⏱️", label: "Duration", value: duration }, frequency && { icon: "📅", label: "Frequency", value: frequency }, price && { icon: "💰", label: "Price Range", value: price }].filter(Boolean) as TreatmentStat[]);

  // Helper function to build typography classes
  const getTypographyClasses = (typography: any) => {
    if (!typography) return "";
    const classes = [];
    if (typography.fontSize) classes.push(typography.fontSize);
    if (typography.fontFamily) classes.push(typography.fontFamily);
    if (typography.fontWeight) classes.push(typography.fontWeight);
    if (typography.fontStyle) classes.push(typography.fontStyle);
    if (typography.textDecoration) classes.push(typography.textDecoration);
    if (typography.color) classes.push(typography.color);
    if (typography.alignment === "center") classes.push("text-center");
    if (typography.alignment === "right") classes.push("text-right");
    if (typography.alignment === "justify") classes.push("text-justify");
    return classes.join(" ");
  };

  // Determine background styles
  const backgroundStyle: React.CSSProperties = {};
  let backgroundClass = "bg-transparent"; // Default to transparent

  if (treatmentBackground && treatmentBackground !== "") {
    if (treatmentBackground.startsWith("#") || treatmentBackground.startsWith("rgb")) {
      backgroundStyle.backgroundColor = treatmentBackground;
      backgroundClass = ""; // Clear the default class
    } else if (treatmentBackground.startsWith("linear-gradient") || treatmentBackground.startsWith("radial-gradient")) {
      backgroundStyle.background = treatmentBackground;
      backgroundClass = ""; // Clear the default class
    } else if (treatmentBackground.startsWith("bg-")) {
      // It's a Tailwind class
      backgroundClass = treatmentBackground;
    } else if (treatmentBackground === "transparent") {
      // Explicitly handle transparent
      backgroundClass = "bg-transparent";
    }
  }

  // Only add rounded corners and shadow if there's a visible background
  const containerStyles = backgroundClass === "bg-transparent" ? `${backgroundClass} ${className}` : `${backgroundClass} rounded-xl shadow-sm p-6 ${className}`;

  return (
    <div className={containerStyles} style={backgroundStyle}>
      {name && <h3 className={`mb-4 ${getTypographyClasses(nameTypography) || "text-2xl font-bold text-gray-900"}`}>{name}</h3>}

      {/* Treatment Stats Cards */}
      {benefits && benefits.length > 0 && (
        <div className="mb-6">
          <h4 className={`mb-3 ${getTypographyClasses(benefitsTitleTypography) || "text-lg font-semibold text-gray-900"}`}>{benefitsTitle || "Benefits"}</h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-glamlink-teal mr-2">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.length > 0 && (
        <div className={`grid gap-4 mb-6 ${stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}`}>
          {stats.map((stat, index) => {
            const cardBackground: React.CSSProperties = {};
            let cardBgClass = "bg-gray-50";

            if (stat.backgroundColor) {
              if (stat.backgroundColor.startsWith("#") || stat.backgroundColor.startsWith("rgb")) {
                cardBackground.background = stat.backgroundColor;
                cardBgClass = "";
              } else if (stat.backgroundColor.startsWith("linear-gradient") || stat.backgroundColor.startsWith("radial-gradient")) {
                cardBackground.background = stat.backgroundColor;
                cardBgClass = "";
              } else if (stat.backgroundColor.startsWith("bg-")) {
                // It's a Tailwind class
                cardBgClass = stat.backgroundColor;
              }
            }

            return (
              <div key={index} className={`text-center p-3 rounded-lg ${cardBgClass}`} style={cardBackground}>
                {stat.icon && <div className="text-2xl mb-1">{stat.icon}</div>}
                {stat.label && <div className={`${getTypographyClasses(stat.labelTypography) || "text-sm"} text-gray-900`}>{stat.label}</div>}
                {stat.value && <div className={`${getTypographyClasses(stat.valueTypography) || "font-bold"} text-gray-900`}>{stat.value}</div>}
              </div>
            );
          })}
        </div>
      )}

      {description && <p className={`mb-6 leading-relaxed ${getTypographyClasses(descriptionTypography) || "text-gray-700"}`}>{description}</p>}

      {process && process.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Treatment Process</h4>
          <ol className="space-y-3">
            {process.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-glamlink-purple text-white rounded-full flex items-center justify-center text-sm font-medium">{index + 1}</span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {aftercare && aftercare.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Aftercare</h4>
          <ul className="space-y-2">
            {aftercare.map((care, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-500 mt-0.5">⚠️</span>
                <span className="text-gray-700">{care}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
