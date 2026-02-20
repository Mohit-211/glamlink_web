import { TrackingParams } from '../types';

/**
 * Generates UTM parameters for email tracking
 * @param baseParams - Base tracking parameters
 * @param customContent - Optional custom content identifier
 * @returns URL search params string
 */
export function generateUTMParams(
  baseParams: TrackingParams,
  customContent?: string
): string {
  const params = new URLSearchParams({
    utm_source: baseParams.utm_source || 'email',
    utm_medium: baseParams.utm_medium || 'email',
    utm_campaign: baseParams.utm_campaign || 'general',
    utm_content: customContent || baseParams.utm_content || 'link'
  });
  
  return params.toString();
}

/**
 * Adds UTM parameters to a URL
 * @param url - The base URL
 * @param params - Tracking parameters
 * @param customContent - Optional custom content identifier
 * @returns Full URL with tracking parameters
 */
export function addUTMToUrl(
  url: string,
  params: TrackingParams,
  customContent?: string
): string {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  const utmParams = generateUTMParams(params, customContent);
  
  return `${url}${separator}${utmParams}`;
}

/**
 * Generates a Mailchimp-compatible tracking URL
 * @param url - The destination URL
 * @param campaignId - Mailchimp campaign ID
 * @returns Mailchimp tracking URL
 */
export function generateMailchimpTrackingUrl(
  url: string,
  campaignId?: string
): string {
  // Mailchimp will automatically replace these merge tags
  let trackingUrl = url;
  
  if (campaignId) {
    const separator = url.includes('?') ? '&' : '?';
    trackingUrl = `${url}${separator}mc_cid=*|CAMPAIGN_UID|*&mc_eid=*|UNIQID|*`;
  }
  
  return trackingUrl;
}

/**
 * Creates a Google Analytics event tracking pixel
 * @param analyticsId - Google Analytics ID (e.g., 'UA-XXXXX-Y')
 * @param category - Event category
 * @param action - Event action
 * @returns Tracking pixel URL
 */
export function createGATrackingPixel(
  analyticsId: string,
  category: string = 'email',
  action: string = 'open'
): string {
  const params = new URLSearchParams({
    v: '1',
    tid: analyticsId,
    cid: '${CLIENT_ID}', // This would be replaced by your email service
    t: 'event',
    ec: category,
    ea: action,
    cs: 'newsletter',
    cm: 'email',
    cn: 'campaign'
  });
  
  return `https://www.google-analytics.com/collect?${params.toString()}`;
}

/**
 * Generates default tracking parameters based on email type
 * @param emailType - Type of email being sent
 * @param campaignName - Optional campaign name
 * @returns Default tracking parameters
 */
export function getDefaultTrackingParams(
  emailType: string,
  campaignName?: string
): TrackingParams {
  const date = new Date().toISOString().split('T')[0];
  
  return {
    utm_source: 'email',
    utm_medium: 'email',
    utm_campaign: campaignName || `${emailType}_${date}`,
    utm_content: emailType
  };
}

/**
 * Validates tracking parameters
 * @param params - Tracking parameters to validate
 * @returns Validation result with any warnings
 */
export function validateTrackingParams(params: TrackingParams): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!params.utm_source) {
    warnings.push('utm_source is missing');
  }
  
  if (!params.utm_medium) {
    warnings.push('utm_medium is missing');
  }
  
  if (!params.utm_campaign) {
    warnings.push('utm_campaign is missing');
  }
  
  // Check for spaces in parameters (should be encoded)
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.includes(' ')) {
      warnings.push(`${key} contains spaces. Consider using hyphens or underscores.`);
    }
  });
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}