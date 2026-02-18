'use client';

/**
 * StyledDigitalBusinessCardModal - Modal wrapper for styled digital business card
 *
 * Used on the /for-professionals listing page to display a professional's
 * styled digital card as a modal overlay when their card is clicked.
 *
 * Features:
 * - Portal-based modal for proper z-index stacking
 * - Backdrop blur with click-to-close
 * - Close button in top-right corner
 * - Scrollable content for long cards
 * - Escape key support for closing
 */

import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import StyledDigitalBusinessCard from './StyledDigitalBusinessCard';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

// =============================================================================
// TYPES
// =============================================================================

export interface StyledDigitalBusinessCardModalProps {
  /** Professional data to display */
  professional: Professional;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function StyledDigitalBusinessCardModal({
  professional,
  isOpen,
  onClose,
}: StyledDigitalBusinessCardModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * Handle escape key press to close modal
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  /**
   * Handle click outside modal content to close
   */
  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  /**
   * Set up escape key listener and prevent body scroll when modal is open
   */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Only render on client side (after hydration)
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Styled Digital Business Card with close button integrated */}
        <StyledDigitalBusinessCard
          professional={professional}
          className="rounded-xl"
          hideBorder={true}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
}
