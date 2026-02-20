import { NextRequest, NextResponse } from 'next/server';

/**
 * UTM and tracking parameter definitions
 */
export const UTM_PARAMS = [
  'utm_source',
  'utm_medium', 
  'utm_campaign',
  'utm_term',
  'utm_content'
] as const;

export const OTHER_TRACKING_PARAMS = [
  'gclid',     // Google Ads
  'fbclid',    // Facebook
  'msclkid',   // Microsoft Ads
  'twclid',    // Twitter Ads
  'li_fat_id', // LinkedIn
  'mc_cid',    // Mailchimp
  'mc_eid',    // Mailchimp
  'ref'        // General referral
] as const;

// Functional parameters that should be preserved in the URL
export const FUNCTIONAL_PARAMS = [
  'modal',
  'tab',
  'view',
  'filter',
  'sort',
  'page',
  'q'  // search query
] as const;

export type UTMParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type TrackingParams = UTMParams & {
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  twclid?: string;
  li_fat_id?: string;
  mc_cid?: string;
  mc_eid?: string;
  ref?: string;
};

/**
 * Extract UTM and tracking parameters from URL
 */
export function extractTrackingParams(url: URL): TrackingParams {
  const params: TrackingParams = {};
  
  // Extract UTM parameters
  UTM_PARAMS.forEach(param => {
    const value = url.searchParams.get(param);
    if (value) {
      params[param as keyof UTMParams] = value;
    }
  });
  
  // Extract other tracking parameters
  OTHER_TRACKING_PARAMS.forEach(param => {
    const value = url.searchParams.get(param);
    if (value) {
      params[param as keyof TrackingParams] = value;
    }
  });
  
  return params;
}

/**
 * Extract functional parameters that should remain in the URL
 */
export function extractFunctionalParams(url: URL): Record<string, string> {
  const params: Record<string, string> = {};
  
  FUNCTIONAL_PARAMS.forEach(param => {
    const value = url.searchParams.get(param);
    if (value) {
      params[param] = value;
    }
  });
  
  // Also preserve any custom parameters that aren't tracking-related
  url.searchParams.forEach((value, key) => {
    const isTracking = [...UTM_PARAMS, ...OTHER_TRACKING_PARAMS].includes(key as any);
    const isFunctional = FUNCTIONAL_PARAMS.includes(key as any);
    
    // Keep parameters that are neither tracking nor already captured functional params
    if (!isTracking && !isFunctional && !params[key]) {
      // Only keep if it looks like a legitimate parameter (basic validation)
      if (key.length < 50 && value.length < 200 && /^[a-zA-Z0-9_-]+$/.test(key)) {
        params[key] = value;
      }
    }
  });
  
  return params;
}

/**
 * Store tracking parameters in cookies
 */
export function storeTrackingParams(
  response: NextResponse,
  params: TrackingParams,
  options?: {
    maxAge?: number; // in seconds, default 7 days
    domain?: string;
  }
) {
  const maxAge = options?.maxAge || 60 * 60 * 24 * 7; // 7 days default
  
  // Store as a single JSON cookie for easier management
  if (Object.keys(params).length > 0) {
    response.cookies.set({
      name: 'glamlink_tracking',
      value: JSON.stringify(params),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
      ...(options?.domain && { domain: options.domain })
    });
    
    // Also set individual cookies for specific UTM params (for backwards compatibility)
    UTM_PARAMS.forEach(param => {
      const value = params[param as keyof UTMParams];
      if (value) {
        response.cookies.set({
          name: param,
          value,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge,
          path: '/',
          ...(options?.domain && { domain: options.domain })
        });
      }
    });
  }
}

/**
 * Get tracking parameters from cookies
 */
export function getTrackingParamsFromCookies(request: NextRequest): TrackingParams {
  const trackingCookie = request.cookies.get('glamlink_tracking');
  
  if (trackingCookie?.value) {
    try {
      return JSON.parse(trackingCookie.value);
    } catch {
      // Fall back to individual cookie reading
    }
  }
  
  // Fall back to reading individual cookies
  const params: TrackingParams = {};
  
  UTM_PARAMS.forEach(param => {
    const value = request.cookies.get(param)?.value;
    if (value) {
      params[param as keyof UTMParams] = value;
    }
  });
  
  return params;
}

/**
 * Build a clean URL with only functional parameters
 */
export function buildCleanUrl(
  originalUrl: URL,
  functionalParams: Record<string, string>
): URL {
  const cleanUrl = new URL(originalUrl.origin + originalUrl.pathname);
  
  // Add back only the functional parameters
  Object.entries(functionalParams).forEach(([key, value]) => {
    cleanUrl.searchParams.set(key, value);
  });
  
  return cleanUrl;
}

/**
 * Check if URL has tracking parameters that need cleaning
 */
export function hasTrackingParams(url: URL): boolean {
  const allTrackingParams = [...UTM_PARAMS, ...OTHER_TRACKING_PARAMS];
  return allTrackingParams.some(param => url.searchParams.has(param));
}

/**
 * Format tracking parameters for analytics
 */
export function formatTrackingForAnalytics(params: TrackingParams): Record<string, any> {
  const formatted: Record<string, any> = {
    timestamp: new Date().toISOString(),
    source: 'server_middleware'
  };
  
  // Add UTM parameters
  if (params.utm_source) formatted.utm_source = params.utm_source;
  if (params.utm_medium) formatted.utm_medium = params.utm_medium;
  if (params.utm_campaign) formatted.utm_campaign = params.utm_campaign;
  if (params.utm_term) formatted.utm_term = params.utm_term;
  if (params.utm_content) formatted.utm_content = params.utm_content;
  
  // Add click IDs for attribution
  if (params.gclid) formatted.gclid = params.gclid;
  if (params.fbclid) formatted.fbclid = params.fbclid;
  if (params.msclkid) formatted.msclkid = params.msclkid;
  
  // Add referral
  if (params.ref) formatted.referral = params.ref;
  
  return formatted;
}