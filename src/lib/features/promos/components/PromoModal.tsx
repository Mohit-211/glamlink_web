"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PromoModalProps } from '../config';
import {
  getModalStatusBadge,
  getDiscountBadge,
  getCategoryBadge,
  getFeaturedBadge,
  getCTAButtonStyles,
  getCountdownStyles
} from './ui';

import {
  isPromoActive,
  isPromoExpired,
  getDaysRemaining,
  formatPromoDateRange,
  formatCountdownText
} from '../utils/promoHelpers';
import UserProCombinedDownloadDialog from '@/lib/components/modals/UserProCombinedDownloadPlain';

export default function PromoModal({ props }: { props: PromoModalProps }) {
  if (!props) {
    console.error('PromoModal: props is undefined');
    return null;
  }

  const { state, handlers, isDownloadModalOpen, closeDownloadModal } = props;
  const { isOpen, promo } = state;

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && handlers?.onClose) {
        handlers.onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scroll
    };
  }, [isOpen, handlers]);

  // Close modal on background click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && handlers?.onClose) {
      handlers.onClose();
    }
  };

  // Handle CTA click with download modal logic
  const handleCtaClick = () => {
    if (promo) {
      // Check if CTA text matches the specific actions that should trigger the download modal
      if (promo.ctaText === "Enter Giveaway" || promo.ctaText === "Sign Up & Post") {
        if (handlers?.onOpenDownloadModal) {
          handlers.onOpenDownloadModal();
        }
      } else if (promo.link && handlers?.onCtaClick) {
        // Use the existing handler for other promos
        handlers.onCtaClick();
      }
    }
  };

  if (!isOpen || !promo) {
    return null;
  }

  const isActive = isPromoActive(promo);
  const isExpired = isPromoExpired(promo);
  const daysRemaining = getDaysRemaining(promo);

  const statusBadge = getModalStatusBadge(promo);
  const topStatusBadge = promo.modalStatusBadge && promo.modalStatusBadge !== null ?
    { text: promo.modalStatusBadge, className: "px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full" } :
    statusBadge;
  const discountBadge = getDiscountBadge(promo.discount);
  const categoryBadge = getCategoryBadge(promo);
  const featuredBadge = getFeaturedBadge();
  const ctaButtonStyles = getCTAButtonStyles(isActive, isExpired);
  const countdownStyles = getCountdownStyles(daysRemaining);
  const countdownText = formatCountdownText(daysRemaining);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
      aria-describedby="promo-modal-description"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={handlers?.onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Badges at top */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 pointer-events-none">
          <div className={categoryBadge.className}>
            {categoryBadge.text}
          </div>
          <div className={topStatusBadge.className}>
            {topStatusBadge.text}
          </div>
        </div>

        {/* Discount badge */}
        {discountBadge && (
          <div className="absolute top-4 right-16 z-10 pointer-events-none">
            <div className={`${discountBadge.className} text-lg px-4 py-2`}>
              {discountBadge.text}
            </div>
          </div>
        )}

        {/* Hero Image */}
        <div className="relative h-64 md:h-80">
          <Image
            src={promo.image}
            alt={promo.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2
              id="promo-modal-title"
              className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg"
            >
              {promo.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {promo.modalContentHeader && promo.modalContentHeader !== null ? promo.modalContentHeader : "About This Offer"}
            </h3>
            <div
              id="promo-modal-description"
              className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: promo.description }}
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Validity Period */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-1">Valid Period</h4>
              <p className="text-sm text-gray-600">
                {formatPromoDateRange(promo.startDate, promo.endDate)}
              </p>
            </div>

            {/* Discount */}
            {promo.discount && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-1">Discount</h4>
                <p className="text-2xl font-bold text-green-600">
                  {typeof promo.discount === 'number' ? `${promo.discount}% OFF` : promo.discount.toUpperCase()}
                </p>
              </div>
            )}

            {/* Category */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-1">Category</h4>
              <p className="text-sm text-blue-700">{promo.category || 'General'}</p>
            </div>

            {/* Status */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-1">Status</h4>
              <div className={statusBadge.className}>
                {statusBadge.text}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex">
              <button
                className={ctaButtonStyles}
                onClick={handleCtaClick}
                disabled={!isActive || isExpired}
                aria-label={`${promo.ctaText} - ${promo.title}`}
              >
                {isExpired ? 'This Offer Has Expired' : !isActive ? 'Offer Coming Soon' : promo.ctaText}
              </button>
            </div>

            {!isActive && !isExpired && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                This offer starts on {new Date(promo.startDate).toLocaleDateString()}
              </p>
            )}

            {isExpired && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                This offer expired on {new Date(promo.endDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Terms and Conditions Placeholder */}
          <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-4">
            <p>Terms and conditions apply. If you have any questions, please contact <a href="mailto:support@glamlink.com" className="text-glamlink-teal">support@glamlink.com</a> for more info</p>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {isDownloadModalOpen && closeDownloadModal && (
        <UserProCombinedDownloadDialog
          isOpen={isDownloadModalOpen}
          onClose={closeDownloadModal}
        />
      )}
    </div>
  );
}

// Modal trigger component for opening the modal
export const PromoModalTrigger = ({
  promo,
  onOpen,
  children
}: {
  promo: any;
  onOpen: (promo: any) => void;
  children: React.ReactNode;
}) => {
  const handleClick = () => {
    onOpen(promo);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View details for ${promo.title}`}
    >
      {children}
    </div>
  );
};

// Modal management hook for easier usage
export const usePromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const openModal = (promo: any) => {
    setSelectedPromo(promo);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Delay clearing the selected promo to allow for close animation
    setTimeout(() => setSelectedPromo(null), 300);
  };

  const openDownloadModal = () => setIsDownloadModalOpen(true);
  const closeDownloadModal = () => setIsDownloadModalOpen(false);

  const handleCtaClick = () => {
    if (selectedPromo) {
      // Check if CTA text matches the specific actions that should trigger the download modal
      if (selectedPromo.ctaText === "Enter Giveaway" || selectedPromo.ctaText === "Sign Up & Post") {
        openDownloadModal();
      } else if (selectedPromo.link) {
        // Open link in new tab for other promos
        window.open(selectedPromo.link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return {
    isOpen,
    selectedPromo,
    isDownloadModalOpen,
    openModal,
    closeModal,
    openDownloadModal,
    closeDownloadModal,
    handleCtaClick
  };
};