"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PromoCardProps } from '../config';
import {
  getPromoStatusBadge,
  getCardHoverStyles,
  getCTAButtonStyles,
  getResponsiveImageClasses,
  getCountdownStyles,
  getCardBackgroundGradient
} from './ui';
import {
  isPromoActive,
  isPromoExpired,
  getDaysRemaining,
  formatPromoDateRange,
  formatCountdownText
} from '../utils/promoHelpers';
// UserProCombinedDownloadDialog is now handled at the parent level

export default function PromoCard({ props }: { props: PromoCardProps }) {
  if (!props) {
    console.error('PromoCard: props is undefined');
    return null;
  }

  const { state, handlers } = props;
  const { promo, isActive, isExpired, daysRemaining, isFeatured } = state;

  const statusBadge = getPromoStatusBadge(promo);
  const cardHoverStyles = getCardHoverStyles(isActive);
  const ctaButtonStyles = getCTAButtonStyles(isActive, isExpired);
  const imageClasses = getResponsiveImageClasses();
  const backgroundGradient = getCardBackgroundGradient(promo.category || undefined);
  const countdownStyles = getCountdownStyles(daysRemaining);
  const countdownText = formatCountdownText(daysRemaining);

  const handleCardClick = () => {
    if (handlers?.onCardClick) {
      handlers.onCardClick(promo);
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when CTA is clicked
    if (isActive && !isExpired) {
      // Always delegate to parent handler - parent will determine modal type
      if (handlers?.onCtaClick) {
        handlers.onCtaClick(promo, e);
      }
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
        ${cardHoverStyles}
        ${backgroundGradient}
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Promo: ${promo.title}`}
    >
      {/* Top section removed - category and discount badges removed from card display */}

      {/* Promo Image */}
      <div className="relative">
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className={imageClasses}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={isFeatured}
        />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Status badge overlay on image */}
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <div className={statusBadge.className}>
            {statusBadge.text}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Subtitle */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
            {promo.title}
          </h3>
          {(promo.subtitle && promo.subtitle !== null) || countdownText ? (
            <div className="flex items-center justify-between">
              {promo.subtitle && promo.subtitle !== null && (
                <p className="text-sm font-medium text-gray-600">
                  {promo.subtitle}
                </p>
              )}
              {countdownText && (
                <div className={`text-sm ${countdownStyles}`}>
                  {countdownText}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Description Short */}
        {promo.descriptionShort && promo.descriptionShort !== null && (
          <p className="text-gray-700 text-sm leading-relaxed">
            {promo.descriptionShort}
          </p>
        )}

        {/* Date Range and CTA Button */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span>
            <span className="font-medium">Valid:</span> {formatPromoDateRange(promo.startDate, promo.endDate)}
          </span>
          <button
            className={ctaButtonStyles}
            onClick={handleCtaClick}
            disabled={!isActive || isExpired}
            aria-label={`${promo.ctaText} - ${promo.title}`}
          >
            {isExpired ? 'Expired' : !isActive ? 'Coming Soon' : promo.ctaText}
          </button>
        </div>
      </div>

      {/* SEO and Accessibility */}
      <div className="sr-only">
        <p>Promotion details: {promo.description}</p>
        <p>Valid from {formatPromoDateRange(promo.startDate, promo.endDate)}</p>
        <p>Status: {statusBadge.text}</p>
      </div>
    </div>
  );
}

// Helper component for displaying multiple cards in a grid
export const PromoCardGrid = ({
  promos,
  onCardClick,
  onCtaClick,
  maxItems
}: {
  promos: any[];
  onCardClick?: (promo: any) => void;
  onCtaClick?: (promo: any, e: React.MouseEvent) => void;
  maxItems?: number;
}) => {
  const displayPromos = maxItems ? promos.slice(0, maxItems) : promos;

  if (displayPromos.length === 0) {
    return (
      <div className="col-span-full">
        <div className="text-center py-12">
          <p className="text-gray-500">No promos available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {displayPromos.map((promo, index) => {
        const isActive = isPromoActive(promo);
        const isExpired = isPromoExpired(promo);
        const daysRemaining = getDaysRemaining(promo);

        return (
          <div
            key={promo.id || `promo-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PromoCard
              props={{
                state: {
                  promo,
                  isActive,
                  isExpired,
                  daysRemaining,
                  isFeatured: promo.featured || false
                },
                handlers: {
                  onCardClick,
                  onCtaClick
                }
              }}
            />
          </div>
        );
      })}
    </>
  );
};

// Featured promos grid component
export const FeaturedPromosGrid = ({
  promos,
  onCardClick,
  onCtaClick
}: {
  promos: any[];
  onCardClick?: (promo: any) => void;
  onCtaClick?: (promo: any, e: React.MouseEvent) => void;
}) => {
  // Debug: Log incoming promos
  console.log('FeaturedPromosGrid - All promos:', promos.map(p => ({
    id: p.id,
    title: p.title,
    featured: p.featured,
    startDate: p.startDate,
    endDate: p.endDate,
    isActive: isPromoActive(p)
  })));

  const featuredPromos = promos.filter(p => p.featured && isPromoActive(p));

  // Debug: Log filtered results
  console.log('FeaturedPromosGrid - Filtered featured promos:', featuredPromos.map(p => ({
    id: p.id,
    title: p.title,
    featured: p.featured,
    isActive: isPromoActive(p)
  })));

  if (featuredPromos.length === 0) {
    console.log('FeaturedPromosGrid - No featured promos found');
    return null;
  }

  return (
    <section className="mb-12">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PromoCardGrid
          promos={featuredPromos}
          onCardClick={onCardClick}
          onCtaClick={onCtaClick}
        />
      </div>
    </section>
  );
};

// Category promos grid component
export const CategoryPromosGrid = ({
  promos,
  category,
  onCardClick,
  onCtaClick
}: {
  promos: any[];
  category: string;
  onCardClick?: (promo: any) => void;
  onCtaClick?: (promo: any, e: React.MouseEvent) => void;
}) => {
  const categoryPromos = promos.filter(p =>
    (category === "All" || p.category === category) && isPromoActive(p)
  );

  if (categoryPromos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No promos available in {category} category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <PromoCardGrid
        promos={categoryPromos}
        onCardClick={onCardClick}
        onCtaClick={onCtaClick}
      />
    </div>
  );
};