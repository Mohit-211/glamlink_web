"use client";

import { useState, useCallback } from 'react';
import { PromoItem, PromosPageHandlersType } from '../config';
import PromosPage from './PromosPage';

interface PromosPageClientProps {
  promos: PromoItem[];
  featuredPromos: PromoItem[];
  error?: string | null;
}

export default function PromosPageClient({
  promos,
  featuredPromos,
  error
}: PromosPageClientProps) {
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle promo card click
  const handlePromoClick = useCallback((promo: PromoItem) => {
    console.log('Promo clicked:', promo.title);
    setSelectedPromo(promo);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPromo(null);
  }, []);

  // Handle CTA click
  const handleCtaClick = useCallback((promo: PromoItem, e?: React.MouseEvent) => {
    console.log('CTA clicked for promo:', promo.title);

    // Prevent default behavior if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Open link in new tab if available
    if (promo.link) {
      window.open(promo.link, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No link available for promo:', promo.title);
    }
  }, []);

  // Handler object for components
  const handlers: PromosPageHandlersType = {
    onPromoClick: handlePromoClick,
    onModalClose: handleModalClose,
    onCtaClick: handleCtaClick
  };

  // Don't render anything if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PromosPage
      props={{
        state: {
          promos,
          featuredPromos,
          isLoading: false, // Content is already loaded on server
          error: null,
          selectedPromo,
          isModalOpen
        },
        handlers
      }}
    />
  );
}