/**
 * Analytics Utilities - Central Export
 */

// Session management
export {
  getSessionId,
  isNewSession,
  clearSession,
  getDeviceType,
  getViewport,
  getPageUrl,
  getReferrer,
  getUserAgent,
  getSessionContext,
  type SessionContext,
} from './sessionManager';

// UTM link generation
export {
  generateUTMLink,
  generateCustomUTMLink,
  generateAllUTMLinks,
  generateUTMLinksGrouped,
  extractUTMParams,
  getCleanCardUrl,
} from './utmLinkGenerator';
