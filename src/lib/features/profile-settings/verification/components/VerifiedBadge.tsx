"use client";

/**
 * VerifiedBadge - Enhanced verified badge with tooltip
 */

import { useState } from "react";
import { CheckCircle, Shield, BadgeCheck } from "lucide-react";

type BadgeVariant = "default" | "shield" | "check";
type BadgeSize = "sm" | "md" | "lg";

interface VerifiedBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  showTooltip?: boolean;
  tooltipText?: string;
  className?: string;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const IconComponent = ({
  variant,
  className,
}: {
  variant: BadgeVariant;
  className: string;
}) => {
  switch (variant) {
    case "shield":
      return <Shield className={className} />;
    case "check":
      return <BadgeCheck className={className} />;
    default:
      return <CheckCircle className={className} />;
  }
};

export default function VerifiedBadge({
  variant = "default",
  size = "md",
  showTooltip = true,
  tooltipText = "Verified Business",
  className = "",
}: VerifiedBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconComponent
        variant={variant}
        className={`${sizeClasses[size]} text-glamlink-teal`}
      />

      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
            {tooltipText}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline verified badge for use in text
 */
export function VerifiedBadgeInline({
  size = "sm",
}: {
  size?: BadgeSize;
}) {
  return (
    <CheckCircle
      className={`${sizeClasses[size]} text-glamlink-teal inline-block ml-1`}
    />
  );
}

/**
 * Verified badge with label
 */
export function VerifiedBadgeWithLabel({
  size = "md",
  label = "Verified",
  className = "",
}: {
  size?: BadgeSize;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 bg-glamlink-teal/10 text-glamlink-teal rounded-full ${className}`}
    >
      <CheckCircle className={sizeClasses[size]} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
