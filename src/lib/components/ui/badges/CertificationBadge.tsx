interface CertificationBadgeProps {
  level: string;
  className?: string;
}

/**
 * CertificationBadge component for displaying certification levels
 * @param level - The certification level (platinum, gold, silver, bronze)
 * @param className - Additional CSS classes
 */
export function CertificationBadge({ level, className = "" }: CertificationBadgeProps) {
  const levelClasses: Record<string, string> = {
    platinum: "bg-gray-800 text-white",
    gold: "bg-yellow-500 text-white",
    silver: "bg-gray-400 text-white",
    bronze: "bg-orange-600 text-white",
  };
  
  const badgeClass = levelClasses[level.toLowerCase()] || levelClasses.bronze;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass} ${className}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}