"use client";

interface Achievement {
  title: string;
  description?: string;
  icon?: string;
  titleTypography?: any;
  descriptionTypography?: any;
}

interface AchievementsGridProps {
  accolades?: (string | Achievement)[];
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  className?: string;
  bgClassName?: string;
  bgStyle?: any;
}

const iconMap: { [key: string]: string } = {
  trophy: "🏆",
  star: "⭐",
  medal: "🥇",
  award: "🎖️",
  sparkle: "✨",
  crown: "👑",
  shine: "🌟",
  badge: "🏅",
  heart: "❤️",
  fire: "🔥",
  rocket: "🚀",
  gem: "💎",
  check: "✅",
  celebration: "🎉",
  thumbsup: "👍",
  clap: "👏",
  target: "🎯",
  lightbulb: "💡",
  key: "🔑",
  gift: "🎁",
};

export default function AchievementsGrid({ 
  accolades, 
  title = "Achievements & Recognition",
  titleTypography,
  className = "",
  bgClassName = "bg-gradient-to-b from-gray-50 to-white",
  bgStyle
}: AchievementsGridProps) {
  if (!accolades || accolades.length === 0) return null;

  // Check if bgClassName is a gradient value or a Tailwind class
  const isGradient = bgClassName?.startsWith('linear-gradient') || bgClassName?.startsWith('radial-gradient');
  const isHexColor = bgClassName?.startsWith('#');
  
  // Build the appropriate style object
  const backgroundStyle = {
    ...bgStyle,
    ...(isGradient ? { background: bgClassName } : {}),
    ...(isHexColor ? { backgroundColor: bgClassName } : {})
  };
  
  // Only use bgClassName as a class if it's not a gradient or hex color
  const backgroundClass = !isGradient && !isHexColor ? bgClassName : '';

  return (
    <div className={`py-12 ${backgroundClass} ${className}`} style={backgroundStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {title && (
          <h3 className={`
            ${titleTypography?.fontSize || "text-3xl lg:text-4xl"}
            ${titleTypography?.fontFamily || "font-sans"}
            ${titleTypography?.fontWeight || "font-bold"}
            ${titleTypography?.fontStyle || ""}
            ${titleTypography?.textDecoration || ""}
            ${titleTypography?.color || "text-gray-900"}
            ${titleTypography?.alignment === "left" ? "text-left" : titleTypography?.alignment === "right" ? "text-right" : "text-center"}
            mb-12
          `}>
            {title}
          </h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {accolades.map((accolade, index) => {
            // Determine which icon to use
            let displayIcon = "🏆"; // Default icon

            if (typeof accolade === "object" && accolade.icon) {
              // Check if it's a predefined icon name or direct emoji
              displayIcon = iconMap[accolade.icon.toLowerCase()] || accolade.icon;
            }

            return (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-glamlink-teal/20 to-glamlink-purple/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[200px] border border-gray-100">
                  {/* Icon container with background circle */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/10 to-glamlink-purple/10 rounded-full blur-md" />
                    <div className="relative text-5xl lg:text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {displayIcon}
                    </div>
                  </div>

                  {/* Achievement text */}
                  <p className={`
                    ${typeof accolade === "object" && accolade.titleTypography?.fontSize || "text-lg"}
                    ${typeof accolade === "object" && accolade.titleTypography?.fontFamily || "font-sans"}
                    ${typeof accolade === "object" && accolade.titleTypography?.fontWeight || "font-semibold"}
                    ${typeof accolade === "object" && accolade.titleTypography?.fontStyle || ""}
                    ${typeof accolade === "object" && accolade.titleTypography?.textDecoration || ""}
                    ${typeof accolade === "object" && accolade.titleTypography?.color || "text-gray-800"}
                    text-center leading-relaxed
                  `}>
                    {typeof accolade === "string" ? accolade : accolade.title}
                  </p>

                  {/* Optional subtitle/description if using enhanced structure */}
                  {typeof accolade === "object" && accolade.description && (
                    <p className={`
                      ${accolade.descriptionTypography?.fontSize || "text-sm"}
                      ${accolade.descriptionTypography?.fontFamily || "font-sans"}
                      ${accolade.descriptionTypography?.fontWeight || "font-normal"}
                      ${accolade.descriptionTypography?.fontStyle || ""}
                      ${accolade.descriptionTypography?.textDecoration || ""}
                      ${accolade.descriptionTypography?.color || "text-gray-600"}
                      text-center mt-2
                    `}>
                      {accolade.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}