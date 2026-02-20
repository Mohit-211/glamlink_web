"use client";

import Image from "next/image";
import styles from "./CardWithIconAnimated.module.css";

export interface CardWithIconAnimatedProps {
  title: string;
  description: string;
  icon: string;
  animation: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  hoverBorderColor?: string;
  isComingSoon?: boolean;
  dataCardType?: string;
}

export default function CardWithIconAnimated({
  title,
  description,
  icon,
  animation,
  bgColor = "bg-white",
  borderColor = "border-gray-200",
  textColor = "text-gray-900",
  hoverBorderColor = "hover:border-[#24bbcb]",
  isComingSoon = false,
  dataCardType,
}: CardWithIconAnimatedProps) {
  // Generate data-card-type from title if not provided
  const cardType = dataCardType || title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[&]/g, 'and');

  return (
    <div
      data-card-type={cardType}
      data-animation={animation}
      className={`${styles.card} rounded-2xl overflow-hidden border-2 ${borderColor} ${hoverBorderColor} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group flex flex-col sm:flex-row ${bgColor}`}
    >
      {/* Image - Top on mobile, Left side on desktop with unique animations */}
      <div className="relative w-full sm:w-40 lg:w-52 h-48 sm:h-auto sm:min-h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden order-1 sm:order-2">
        <div className={`${styles.iconWrapper} ${styles[animation]} relative w-full h-full`}>
          <Image
            src={icon}
            alt={title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 160px, 208px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.png';
            }}
          />
        </div>
      </div>
      
      {/* Text Content - Bottom on mobile, Right side on desktop */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative order-2 sm:order-1">
        {/* Teal accent bar on hover - left on desktop, top on mobile */}
        <div className="absolute left-0 sm:left-0 top-0 sm:top-0 bottom-auto sm:bottom-0 w-full sm:w-1 h-1 sm:h-full bg-[#24bbcb] transform scale-x-0 sm:scale-x-100 sm:scale-y-0 group-hover:scale-x-100 group-hover:sm:scale-y-100 transition-transform duration-300 origin-left sm:origin-center"></div>
        
        <h3 className={`text-2xl lg:text-3xl font-bold ${textColor} mb-3 group-hover:text-[#24bbcb] transition-colors duration-300`}>
          {title}
          {isComingSoon && (
            <span className="ml-3 text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full inline-block">
              Coming Soon
            </span>
          )}
        </h3>
        <p className={`${textColor} opacity-80 text-base lg:text-lg leading-relaxed`}>
          {description}
        </p>
      </div>
    </div>
  );
}