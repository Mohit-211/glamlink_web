"use client";

import { useState, useEffect } from 'react';
import { PromosPageProps, isPromoActive } from '../config';
import { LoadingSpinner, ErrorMessage, EmptyState } from './ui';
import { FeaturedPromosGrid } from './PromoCard';
import PromoModal from './PromoModal';
import UserProCombinedDownloadDialog from '@/lib/components/modals/UserProCombinedDownloadPlain';
import { CUSTOM_MODAL_REGISTRY } from '@/lib/pages/admin/components/promos/config';

// Import custom modals
import ParieMedicalSpaDialog from './custom-modals/ParieMedicalSpaDialog';
import ThanksgivingGlamGiveawayDialog from './custom-modals/ThanksgivingGlamGiveawayDialog';

export default function PromosPage({ props }: { props: PromosPageProps }) {
  if (!props) {
    console.error('PromosPage: props is undefined');
    return null;
  }

  const { state, handlers } = props;
  const { promos, featuredPromos, isLoading, error, selectedPromo, isModalOpen } = state;

  // Download modal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Handle promo card click
  const handlePromoClick = (promo: any) => {
    if (handlers?.onPromoClick) {
      handlers.onPromoClick(promo);
    }
  };

  // Handle CTA click
  const handlePromoCtaClick = (promo: any, e: React.MouseEvent) => {
    // Check if this promo should open a modal (either standard or custom)
    if (promo.modalType === 'custom' && promo.customModalId) {
      // For custom modals, we delegate to the parent handler which will manage modal state
      if (handlers?.onPromoClick) {
        handlers.onPromoClick(promo);
      }
    } else if (promo.ctaText === "Enter Giveaway" || promo.ctaText === "Sign Up & Post") {
      // For standard modals with specific CTA text
      if (handlers?.onPromoClick) {
        handlers.onPromoClick(promo);
      }
    } else {
      // For other CTAs, use the existing handler (opens external link)
      if (handlers?.onCtaClick) {
        handlers.onCtaClick(promo);
      }
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    if (handlers?.onModalClose) {
      handlers.onModalClose();
    }
  };

  // Handle download modal
  const handleOpenDownloadModal = () => {
    setIsDownloadModalOpen(true);
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  // Custom modal component mapping
  const getCustomModalComponent = (customModalId: string) => {
    switch (customModalId) {
      case 'parie-medical-spa':
        return ParieMedicalSpaDialog;
      case 'thanksgiving-glam-giveaway':
        return ThanksgivingGlamGiveawayDialog;
      default:
        return null;
    }
  };

  // Loading state - handled by wrapper to avoid double loading experience
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="container mx-auto px-4 py-8">
  //         <LoadingSpinner size="lg" message="Loading amazing promos..." />
  //       </div>
  //     </div>
  //   );
  // }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // Filter for active featured promos
  const activeFeaturedPromos = featuredPromos.filter(p => p.featured && isPromoActive(p));

  // Console log promos for debugging
  console.log('All Promos:', promos);
  console.log('Featured Promos:', featuredPromos);
  console.log('Active Featured Promos:', activeFeaturedPromos);

  // Empty state - check ACTIVE promos, not all promos
  if (activeFeaturedPromos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="No Active Promotions"
            message="Check back soon for exciting offers and deals from your favorite beauty brands!"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Glamlink Launch Perks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exclusive deals and giveaways during our Vegas launch
          </p>
        </header>

        {/* Featured Promos Section */}
        <FeaturedPromosGrid
          promos={featuredPromos}
          onCardClick={handlePromoClick}
          onCtaClick={handlePromoCtaClick}
        />

        {/* Category Filter - COMMENTED OUT */}
        {/* <section className="mb-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>

            <div className="flex flex-wrap justify-center gap-2">
              {PROMO_CATEGORIES.map((category) => {
                const count = categoryCounts[category];
                const isActive = selectedCategory === category;
                const hasItems = count > 0;

                return (
                  <button
                    key={category}
                    onClick={() => hasItems && handleCategoryChange(category)}
                    disabled={!hasItems}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-glamlink-purple text-white shadow-lg transform scale-105'
                        : hasItems
                          ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    aria-label={`Filter by ${category} (${count} promos)`}
                  >
                    {category}
                    {count > 0 && (
                      <span className="ml-1 text-xs opacity-75">
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedCategory !== "All" && (
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredPromos.length}</span> promotions in{' '}
                <span className="font-semibold">{selectedCategory}</span>
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="ml-2 text-glamlink-purple hover:text-glamlink-purple/80 underline"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </section> */}

        
        {/* Tips Section - COMMENTED OUT */}
        {/* <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Tips for Shopping Promos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Act Fast</h4>
              <p className="text-sm text-gray-600">Limited time offers sell out quickly. Don't wait!</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Stay Updated</h4>
              <p className="text-sm text-gray-600">Check back regularly for new deals and offers.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Stack Savings</h4>
              <p className="text-sm text-gray-600">Look for combo deals and bundle offers.</p>
            </div>
          </div>
        </section> */}
      </div>

      {/* Conditional Modal Rendering */}
      {selectedPromo && isModalOpen && (
        <>
          {selectedPromo.modalType === 'custom' && selectedPromo.customModalId ? (
            /* Custom Modal */
            (() => {
              const CustomModalComponent = getCustomModalComponent(selectedPromo.customModalId);
              return CustomModalComponent ? (
                <CustomModalComponent
                  isOpen={isModalOpen}
                  onClose={handleModalClose}
                />
              ) : null;
            })()
          ) : (
            /* Standard Modal */
            <PromoModal
              props={{
                state: {
                  isOpen: isModalOpen,
                  promo: selectedPromo
                },
                handlers: {
                  onClose: handleModalClose,
                  onCtaClick: () => {
                    if (selectedPromo?.link) {
                      window.open(selectedPromo.link, '_blank', 'noopener,noreferrer');
                    }
                  },
                  onOpenDownloadModal: handleOpenDownloadModal
                },
                isDownloadModalOpen,
                closeDownloadModal: handleCloseDownloadModal
              }}
            />
          )}
        </>
      )}

      {/* Download Modal */}
      <UserProCombinedDownloadDialog
        isOpen={isDownloadModalOpen}
        onClose={handleCloseDownloadModal}
      />
    </div>
  );
}