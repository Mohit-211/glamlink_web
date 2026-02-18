declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type AppType = 'pro' | 'user';
export type StoreType = 'apple' | 'google';

interface AppDownloadClickParams {
  app_type: AppType;
  store_type: StoreType;
  link_url: string;
  dialog_source?: string;
}

interface UserJourneyData {
  first_app_interest?: string;
  download_attempts?: {
    pro_apple?: number;
    pro_google?: number;
    user_apple?: number;
    user_google?: number;
  };
  user_journey_stage?: 'visitor' | 'interested' | 'clicked_download';
}

export interface CampaignTrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referral?: string;
  timestamp: string;
  source: string;
}

class AnalyticsService {
  private initialized = false;

  private ensureGtag() {
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return false;
    }
    return true;
  }

  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.ensureGtag()) return;

    try {
      window.gtag!('event', eventName, {
        ...parameters,
        send_to: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      });
      console.log(`Analytics Event: ${eventName}`, parameters);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Track campaign arrival with UTM parameters
   * This is called after UTM parameters are captured and stored
   */
  trackCampaignArrival(campaignData: CampaignTrackingData) {
    // Track the main campaign event
    this.trackEvent('campaign_arrival', {
      utm_source: campaignData.utm_source,
      utm_medium: campaignData.utm_medium,
      utm_campaign: campaignData.utm_campaign,
      utm_term: campaignData.utm_term,
      utm_content: campaignData.utm_content,
      has_gclid: !!campaignData.gclid,
      has_fbclid: !!campaignData.fbclid,
      referral: campaignData.referral,
      timestamp: campaignData.timestamp
    });

    // Set user properties for segmentation
    if (campaignData.utm_source) {
      this.setUserProperty('last_utm_source', campaignData.utm_source);
    }
    if (campaignData.utm_campaign) {
      this.setUserProperty('last_utm_campaign', campaignData.utm_campaign);
    }

    // Store campaign data in localStorage for attribution
    if (typeof window !== 'undefined') {
      try {
        const existingCampaigns = JSON.parse(
          localStorage.getItem('glamlink_campaigns') || '[]'
        );
        existingCampaigns.push(campaignData);
        
        // Keep only last 10 campaigns
        const recentCampaigns = existingCampaigns.slice(-10);
        localStorage.setItem('glamlink_campaigns', JSON.stringify(recentCampaigns));
      } catch (error) {
        console.error('Error storing campaign data:', error);
      }
    }
  }

  trackAppDownloadClick(params: AppDownloadClickParams) {
    this.updateUserJourney(params.app_type, params.store_type);
    
    this.trackEvent('app_download_click', {
      app_type: params.app_type,
      store_type: params.store_type,
      link_url: params.link_url,
      dialog_source: params.dialog_source || 'unknown',
      timestamp: new Date().toISOString(),
    });

    this.setUserProperty('last_download_click', `${params.app_type}_${params.store_type}`);
  }

  private updateUserJourney(appType: AppType, storeType: StoreType) {
    if (typeof window === 'undefined') return;

    try {
      const journeyData: UserJourneyData = JSON.parse(
        localStorage.getItem('glamlink_user_journey') || '{}'
      );

      if (!journeyData.first_app_interest) {
        journeyData.first_app_interest = new Date().toISOString();
      }

      if (!journeyData.download_attempts) {
        journeyData.download_attempts = {};
      }

      const attemptKey = `${appType}_${storeType}` as keyof typeof journeyData.download_attempts;
      journeyData.download_attempts[attemptKey] = 
        (journeyData.download_attempts[attemptKey] || 0) + 1;

      journeyData.user_journey_stage = 'clicked_download';

      localStorage.setItem('glamlink_user_journey', JSON.stringify(journeyData));

      this.trackEvent('user_journey_update', {
        stage: journeyData.user_journey_stage,
        total_attempts: Object.values(journeyData.download_attempts).reduce((a, b) => a + b, 0),
        days_since_first_interest: this.daysSince(journeyData.first_app_interest),
      });
    } catch (error) {
      console.error('Error updating user journey:', error);
    }
  }

  private daysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  setUserProperty(propertyName: string, value: string | number) {
    if (!this.ensureGtag()) return;

    try {
      window.gtag!('set', 'user_properties', {
        [propertyName]: value,
      });
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  trackPageView(url?: string) {
    if (!this.ensureGtag()) return;

    const pageUrl = url || window.location.pathname + window.location.search;
    
    window.gtag!('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, {
      page_path: pageUrl,
    });
  }

  getUserJourneyData(): UserJourneyData | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem('glamlink_user_journey');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clearUserJourneyData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('glamlink_user_journey');
  }

  /**
   * Get stored campaign data for attribution
   */
  getCampaignData(): CampaignTrackingData[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem('glamlink_campaigns');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get the most recent campaign data
   */
  getLastCampaign(): CampaignTrackingData | null {
    const campaigns = this.getCampaignData();
    return campaigns.length > 0 ? campaigns[campaigns.length - 1] : null;
  }
}

export const analytics = new AnalyticsService();

export default analytics;