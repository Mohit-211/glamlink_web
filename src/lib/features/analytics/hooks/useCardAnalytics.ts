/**
 * useCardAnalytics Hook
 *
 * React hook for tracking digital card analytics events.
 * Provides convenience methods for tracking various user interactions.
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { cardAnalyticsService } from '../services';
import type { CardAnalyticsEventType } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseCardAnalyticsOptions {
  /** The professional's ID for this card */
  professionalId: string;
  /** Whether to track a card view on mount (default: true) */
  trackViewOnMount?: boolean;
}

export interface UseCardAnalyticsReturn {
  /** Track a generic event */
  trackEvent: (eventType: CardAnalyticsEventType) => Promise<void>;
  /** Track book/appointment button click */
  trackBookClick: () => Promise<void>;
  /** Track phone call button click */
  trackCallClick: () => Promise<void>;
  /** Track text/SMS button click */
  trackTextClick: () => Promise<void>;
  /** Track website link click */
  trackWebsiteClick: () => Promise<void>;
  /** Track Instagram link click */
  trackInstagramClick: () => Promise<void>;
  /** Track TikTok link click */
  trackTiktokClick: () => Promise<void>;
  /** Track save card as image action */
  trackSaveCard: () => Promise<void>;
  /** Track copy URL action */
  trackCopyUrl: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for tracking digital card analytics events.
 *
 * @example
 * ```tsx
 * function DigitalCard({ professional }) {
 *   const {
 *     trackBookClick,
 *     trackInstagramClick,
 *     trackSaveCard,
 *   } = useCardAnalytics({
 *     professionalId: professional.id,
 *     trackViewOnMount: true,
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={trackBookClick}>Book Now</button>
 *       <a onClick={trackInstagramClick} href={...}>Instagram</a>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCardAnalytics({
  professionalId,
  trackViewOnMount = true,
}: UseCardAnalyticsOptions): UseCardAnalyticsReturn {
  // Track if we've already tracked the view for this mount
  const hasTrackedView = useRef(false);

  // Track card view on mount (with deduplication)
  useEffect(() => {
    if (!trackViewOnMount || !professionalId || hasTrackedView.current) {
      return;
    }

    // Mark as tracked to prevent duplicate tracking on re-renders
    hasTrackedView.current = true;

    // Track the view (service handles session-based deduplication)
    cardAnalyticsService.trackCardView(professionalId).catch((error) => {
      console.error('[useCardAnalytics] Failed to track view:', error);
    });
  }, [professionalId, trackViewOnMount]);

  // Generic event tracker
  const trackEvent = useCallback(
    async (eventType: CardAnalyticsEventType): Promise<void> => {
      if (!professionalId) return;

      try {
        await cardAnalyticsService.trackEvent(eventType, professionalId);
      } catch (error) {
        console.error(`[useCardAnalytics] Failed to track ${eventType}:`, error);
      }
    },
    [professionalId]
  );

  // Convenience methods for each event type
  const trackBookClick = useCallback(
    () => trackEvent('book_click'),
    [trackEvent]
  );

  const trackCallClick = useCallback(
    () => trackEvent('call_click'),
    [trackEvent]
  );

  const trackTextClick = useCallback(
    () => trackEvent('text_click'),
    [trackEvent]
  );

  const trackWebsiteClick = useCallback(
    () => trackEvent('website_click'),
    [trackEvent]
  );

  const trackInstagramClick = useCallback(
    () => trackEvent('instagram_click'),
    [trackEvent]
  );

  const trackTiktokClick = useCallback(
    () => trackEvent('tiktok_click'),
    [trackEvent]
  );

  const trackSaveCard = useCallback(
    () => trackEvent('save_card'),
    [trackEvent]
  );

  const trackCopyUrl = useCallback(
    () => trackEvent('copy_url'),
    [trackEvent]
  );

  return {
    trackEvent,
    trackBookClick,
    trackCallClick,
    trackTextClick,
    trackWebsiteClick,
    trackInstagramClick,
    trackTiktokClick,
    trackSaveCard,
    trackCopyUrl,
  };
}

export default useCardAnalytics;
