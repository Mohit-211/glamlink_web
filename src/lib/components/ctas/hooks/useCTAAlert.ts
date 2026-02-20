'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicCTAAlert } from '@/lib/pages/admin/types/ctaAlert';

export interface UseCTAAlertReturn {
  config: PublicCTAAlert | null;
  isVisible: boolean;
  showModal: boolean;
  isLoading: boolean;
  handleDismiss: () => void;
  handleClick: () => void;
  handleCloseModal: () => void;
}

/**
 * Public hook for displaying CTA Alert banner
 *
 * Handles:
 * - Fetching active CTA config from API
 * - localStorage dismissal tracking
 * - Visibility logic (date-based + dismissal-based)
 * - Modal state management
 */
export function useCTAAlert(): UseCTAAlertReturn {
  const [config, setConfig] = useState<PublicCTAAlert | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active CTA Alert on mount
  useEffect(() => {
    const fetchActiveCTA = async () => {
      try {
        const response = await fetch('/api/cta-alert/active');
        const data = await response.json();

        if (data.success && data.data) {
          const ctaConfig = data.data as PublicCTAAlert;
          setConfig(ctaConfig);

          // Check localStorage for dismissal
          const dismissedTime = localStorage.getItem(ctaConfig.localStorageKey);

          if (dismissedTime) {
            const dismissedDate = new Date(dismissedTime);
            const now = new Date();
            const hoursDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60);

            // Show if enough time has passed since dismissal
            if (hoursDiff >= ctaConfig.dismissAfterHours) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          } else {
            // Never dismissed - show alert
            setIsVisible(true);
          }
        } else {
          // No active CTA
          setConfig(null);
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error fetching CTA Alert:', error);
        setConfig(null);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveCTA();
  }, []);

  // Handle dismiss (close button click)
  const handleDismiss = useCallback(() => {
    if (config) {
      // Store dismissal time in localStorage
      localStorage.setItem(config.localStorageKey, new Date().toISOString());
    }
    setIsVisible(false);
  }, [config]);

  // Handle CTA button click (opens modal)
  const handleClick = useCallback(() => {
    setShowModal(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    config,
    isVisible,
    showModal,
    isLoading,
    handleDismiss,
    handleClick,
    handleCloseModal,
  };
}
