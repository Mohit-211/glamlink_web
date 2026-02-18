/**
 * useMagazineAnalytics Hook
 *
 * React hook for tracking magazine analytics events.
 * Provides convenience methods for tracking various user interactions.
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { magazineAnalyticsService } from '../services';
import type { MagazineAnalyticsEventType, NavigationMethod } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseMagazineAnalyticsOptions {
  /** The magazine issue ID */
  issueId: string;
  /** Whether to track an issue view on mount (default: true) */
  trackViewOnMount?: boolean;
}

export interface UseMagazineAnalyticsReturn {
  /** Track a generic event */
  trackEvent: (
    eventType: MagazineAnalyticsEventType,
    context?: {
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }
  ) => Promise<void>;

  /** Track page/section view (with deduplication) */
  trackPageView: (
    pageId: number,
    sectionId?: string,
    sectionType?: string,
    sectionTitle?: string
  ) => Promise<boolean>;

  /** Track navigation between pages */
  trackNavigation: (
    fromPageId: number,
    toPageId: number,
    method: NavigationMethod
  ) => Promise<void>;

  /** Track section click from Table of Contents */
  trackSectionClick: (
    pageId: number,
    sectionId?: string,
    sectionType?: string
  ) => Promise<void>;

  /** Track CTA button click (basic) */
  trackCTAClick: () => Promise<void>;

  /** Track enhanced CTA button click with label and context */
  trackEnhancedCTAClick: (
    buttonLabel: string,
    buttonVariant?: 'primary' | 'secondary',
    sectionId?: string,
    sectionType?: string,
    pageId?: number,
    sectionTitle?: string
  ) => Promise<void>;

  /** Track external link click (social, website, email) */
  trackLinkClick: (
    linkType: 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other',
    linkUrl?: string,
    sectionId?: string,
    sectionType?: string,
    pageId?: number,
    sectionTitle?: string
  ) => Promise<void>;

  /** Track video play event */
  trackVideoPlay: (
    videoSource: 'youtube' | 'upload',
    sectionId?: string,
    sectionType?: string,
    pageId?: number,
    sectionTitle?: string
  ) => Promise<void>;

  /** Track PDF download */
  trackPdfDownload: () => Promise<void>;

  /** Track share action */
  trackShare: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for tracking magazine analytics events.
 *
 * @example
 * ```tsx
 * function MagazineViewer({ issue }) {
 *   const {
 *     trackPageView,
 *     trackNavigation,
 *     trackCTAClick,
 *   } = useMagazineAnalytics({
 *     issueId: issue.id,
 *     trackViewOnMount: true,
 *   });
 *
 *   // Track page view when page changes
 *   useEffect(() => {
 *     trackPageView(currentPid, section?.id, section?.type);
 *   }, [currentPid]);
 *
 *   const handleNext = () => {
 *     trackNavigation(currentPid, currentPid + 1, 'arrow');
 *     goToNextPage();
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleNext}>Next</button>
 *       <button onClick={trackCTAClick}>Get Started</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMagazineAnalytics({
  issueId,
  trackViewOnMount = true,
}: UseMagazineAnalyticsOptions): UseMagazineAnalyticsReturn {
  // Track if we've already tracked the issue view for this mount
  const hasTrackedView = useRef(false);

  // Track issue view on mount (with deduplication)
  useEffect(() => {
    if (!trackViewOnMount || !issueId || hasTrackedView.current) {
      return;
    }

    // Mark as tracked to prevent duplicate tracking on re-renders
    hasTrackedView.current = true;

    // Track the issue view (service handles session-based deduplication)
    magazineAnalyticsService.trackIssueView(issueId).catch((error) => {
      console.error('[useMagazineAnalytics] Failed to track issue view:', error);
    });
  }, [issueId, trackViewOnMount]);

  // Generic event tracker
  const trackEvent = useCallback(
    async (
      eventType: MagazineAnalyticsEventType,
      context?: {
        pageId?: number;
        sectionId?: string;
        sectionType?: string;
        sectionTitle?: string;
      }
    ): Promise<void> => {
      if (!issueId) return;

      try {
        await magazineAnalyticsService.trackEvent(eventType, issueId, context);
      } catch (error) {
        console.error(`[useMagazineAnalytics] Failed to track ${eventType}:`, error);
      }
    },
    [issueId]
  );

  // Track page view with deduplication
  const trackPageView = useCallback(
    async (
      pageId: number,
      sectionId?: string,
      sectionType?: string,
      sectionTitle?: string
    ): Promise<boolean> => {
      if (!issueId) return false;

      try {
        return await magazineAnalyticsService.trackPageView(
          issueId,
          pageId,
          sectionId,
          sectionType,
          sectionTitle
        );
      } catch (error) {
        console.error('[useMagazineAnalytics] Failed to track page view:', error);
        return false;
      }
    },
    [issueId]
  );

  // Track navigation
  const trackNavigation = useCallback(
    async (
      fromPageId: number,
      toPageId: number,
      method: NavigationMethod
    ): Promise<void> => {
      if (!issueId) return;

      try {
        await magazineAnalyticsService.trackNavigation(issueId, fromPageId, toPageId, method);
      } catch (error) {
        console.error('[useMagazineAnalytics] Failed to track navigation:', error);
      }
    },
    [issueId]
  );

  // Track section click
  const trackSectionClick = useCallback(
    async (
      pageId: number,
      sectionId?: string,
      sectionType?: string
    ): Promise<void> => {
      if (!issueId) return;

      try {
        await magazineAnalyticsService.trackSectionClick(issueId, pageId, sectionId, sectionType);
      } catch (error) {
        console.error('[useMagazineAnalytics] Failed to track section click:', error);
      }
    },
    [issueId]
  );

  // Track CTA click (basic)
  const trackCTAClick = useCallback(async (): Promise<void> => {
    if (!issueId) return;

    try {
      await magazineAnalyticsService.trackCTAClick(issueId);
    } catch (error) {
      console.error('[useMagazineAnalytics] Failed to track CTA click:', error);
    }
  }, [issueId]);

  // Track enhanced CTA click with label and context
  const trackEnhancedCTAClick = useCallback(
    async (
      buttonLabel: string,
      buttonVariant: 'primary' | 'secondary' = 'primary',
      sectionId?: string,
      sectionType?: string,
      pageId?: number,
      sectionTitle?: string
    ): Promise<void> => {
      console.log('[useMagazineAnalytics] trackEnhancedCTAClick called:', { issueId, buttonLabel, buttonVariant, sectionId, sectionType, pageId, sectionTitle });
      if (!issueId) {
        console.warn('[useMagazineAnalytics] No issueId - skipping CTA click tracking');
        return;
      }

      try {
        await magazineAnalyticsService.trackEnhancedCTAClick(issueId, buttonLabel, buttonVariant, {
          pageId,
          sectionId,
          sectionType,
          sectionTitle,
        });
        console.log('[useMagazineAnalytics] CTA click tracked successfully');
      } catch (error) {
        console.error('[useMagazineAnalytics] Failed to track enhanced CTA click:', error);
      }
    },
    [issueId]
  );

  // Track link click (social, website, email)
  const trackLinkClick = useCallback(
    async (
      linkType: 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other',
      linkUrl?: string,
      sectionId?: string,
      sectionType?: string,
      pageId?: number,
      sectionTitle?: string
    ): Promise<void> => {
      if (!issueId) return;

      try {
        await magazineAnalyticsService.trackLinkClick(issueId, linkType, linkUrl, {
          pageId,
          sectionId,
          sectionType,
          sectionTitle,
        });
      } catch (error) {
        console.error('[useMagazineAnalytics] Failed to track link click:', error);
      }
    },
    [issueId]
  );

  // Track video play
  const trackVideoPlay = useCallback(
    async (
      videoSource: 'youtube' | 'upload',
      sectionId?: string,
      sectionType?: string,
      pageId?: number,
      sectionTitle?: string
    ): Promise<void> => {
      if (!issueId) return;

      try {
        await magazineAnalyticsService.trackVideoPlay(issueId, videoSource, {
          pageId,
          sectionId,
          sectionType,
          sectionTitle,
        });
      } catch (error) {
        console.error('[useMagazineAnalytics] Failed to track video play:', error);
      }
    },
    [issueId]
  );

  // Track PDF download
  const trackPdfDownload = useCallback(async (): Promise<void> => {
    if (!issueId) return;

    try {
      await magazineAnalyticsService.trackPdfDownload(issueId);
    } catch (error) {
      console.error('[useMagazineAnalytics] Failed to track PDF download:', error);
    }
  }, [issueId]);

  // Track share
  const trackShare = useCallback(async (): Promise<void> => {
    if (!issueId) return;

    try {
      await magazineAnalyticsService.trackShare(issueId);
    } catch (error) {
      console.error('[useMagazineAnalytics] Failed to track share:', error);
    }
  }, [issueId]);

  return {
    trackEvent,
    trackPageView,
    trackNavigation,
    trackSectionClick,
    trackCTAClick,
    trackEnhancedCTAClick,
    trackLinkClick,
    trackVideoPlay,
    trackPdfDownload,
    trackShare,
  };
}

export default useMagazineAnalytics;
