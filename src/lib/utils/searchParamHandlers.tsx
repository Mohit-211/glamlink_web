"use client";

import { useEffect } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import analytics, { CampaignTrackingData } from "@/lib/services/analytics";

// Dynamically import dialogs to avoid loading them unless needed
const UserDownloadDialog = dynamic(
  () => import("@/lib/components/modals/UserDownloadDialog"),
  { ssr: false }
);

const ProDownloadDialog = dynamic(
  () => import("@/lib/components/modals/ProDownloadDialog"),
  { ssr: false }
);

const UserProCombinedDownloadDialog = dynamic(
  () => import("@/lib/components/modals/UserProCombinedDownloadDialog"),
  { ssr: false }
);

interface ModalState {
  showUserDialog: boolean;
  showProDialog: boolean;
  showCombinedDialog: boolean;
}

/**
 * Handles modal display based on search parameters
 * @param searchParams - The URL search parameters
 * @param onModalStateChange - Callback when modal state changes
 */
export function useModalSearchParams(
  searchParams: ReadonlyURLSearchParams,
  onModalStateChange?: (state: ModalState) => void
) {
  useEffect(() => {
    const modalType = searchParams.get('modal');
    
    if (modalType) {
      // Track modal parameter usage for analytics
      analytics.trackEvent('modal_param_used', {
        category: 'engagement',
        label: modalType,
        value: 1
      });

      // Update modal state
      const newState: ModalState = {
        showUserDialog: modalType === 'user',
        showProDialog: modalType === 'pro',
        showCombinedDialog: modalType === 'user-and-pro'
      };
      
      onModalStateChange?.(newState);
    }
  }, [searchParams, onModalStateChange]);
}

/**
 * Process tracking arrival cookie if present
 * This is set by middleware after capturing UTM parameters
 */
function processTrackingArrival() {
  if (typeof document === 'undefined') return;
  
  // Check for tracking arrival cookie
  const cookies = document.cookie.split(';');
  const trackingCookie = cookies.find(c => c.trim().startsWith('glamlink_track_arrival='));
  
  if (trackingCookie) {
    try {
      const value = decodeURIComponent(trackingCookie.split('=')[1]);
      const trackingData: CampaignTrackingData = JSON.parse(value);
      
      // Track the campaign arrival
      analytics.trackCampaignArrival(trackingData);
      
      // Clear the cookie after processing
      document.cookie = 'glamlink_track_arrival=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } catch (error) {
      console.error('Error processing tracking arrival:', error);
    }
  }
}

/**
 * Get UTM parameters from cookies (set by middleware)
 */
function getUTMFromCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  
  const cookies = document.cookie.split(';');
  const utmData: Record<string, string> = {};
  
  // Check for the main tracking cookie
  const trackingCookie = cookies.find(c => c.trim().startsWith('glamlink_tracking='));
  if (trackingCookie) {
    try {
      const value = decodeURIComponent(trackingCookie.split('=')[1]);
      return JSON.parse(value);
    } catch {
      // Fall back to individual cookies
    }
  }
  
  // Fall back to individual UTM cookies
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmParams.forEach(param => {
    const cookie = cookies.find(c => c.trim().startsWith(`${param}=`));
    if (cookie) {
      utmData[param] = decodeURIComponent(cookie.split('=')[1]);
    }
  });
  
  return utmData;
}

/**
 * Handles analytics tracking based on search parameters
 * Now also processes UTM data from cookies (set by middleware)
 */
export function useAnalyticsSearchParams(searchParams: ReadonlyURLSearchParams) {
  useEffect(() => {
    // Process any tracking arrival cookie set by middleware
    processTrackingArrival();
    
    // Get UTM data from cookies (already captured by middleware)
    const utmData = getUTMFromCookies();
    
    // If we have UTM data from cookies, we know the user came from a campaign
    // The actual tracking already happened in processTrackingArrival
    // This is just for any additional client-side processing
    if (Object.keys(utmData).length > 0) {
      console.log('Campaign attribution active:', utmData);
    }

    // Track any remaining referral sources that aren't UTM
    const ref = searchParams.get('ref');
    if (ref) {
      analytics.trackEvent('referral_arrival', {
        category: 'traffic',
        label: ref,
        value: 1
      });
    }
  }, [searchParams]);
}

/**
 * Clears specific search parameters from the URL
 * @param params - Array of parameter names to clear
 */
export function clearSearchParams(params: string[]) {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    params.forEach(param => url.searchParams.delete(param));
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Modal wrapper component that handles search param-based modals
 */
interface SearchParamModalsProps {
  modalState: ModalState;
  onClose: () => void;
}

export function SearchParamModals({ modalState, onClose }: SearchParamModalsProps) {
  if (!modalState.showUserDialog && !modalState.showProDialog && !modalState.showCombinedDialog) {
    return null;
  }

  return (
    <>
      {modalState.showUserDialog && (
        <UserDownloadDialog isOpen={modalState.showUserDialog} onClose={onClose} />
      )}
      {modalState.showProDialog && (
        <ProDownloadDialog isOpen={modalState.showProDialog} onClose={onClose} />
      )}
      {modalState.showCombinedDialog && (
        <UserProCombinedDownloadDialog isOpen={modalState.showCombinedDialog} onClose={onClose} />
      )}
    </>
  );
}

/**
 * Combined hook for all search param functionality
 * @param searchParams - The URL search parameters
 * @returns Object with modal state and handlers
 */
export function useSearchParamHandlers(searchParams: ReadonlyURLSearchParams) {
  // Track analytics
  useAnalyticsSearchParams(searchParams);
  
  // Return utilities for the component to use
  return {
    clearModalParam: () => clearSearchParams(['modal']),
    clearAllTrackingParams: () => clearSearchParams(['modal', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']),
    getUTMData: getUTMFromCookies
  };
}

/**
 * Export UTM data getter for use in other components
 */
export { getUTMFromCookies };