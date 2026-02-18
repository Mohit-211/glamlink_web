/**
 * Session Manager for Card Analytics
 *
 * Handles session ID generation and management for unique visitor tracking.
 * Sessions expire after 30 minutes of inactivity.
 */

import type { DeviceType } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

const SESSION_KEY = 'glamlink_card_session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface SessionData {
  id: string;
  lastActivity: number;
}

// =============================================================================
// SESSION ID MANAGEMENT
// =============================================================================

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

/**
 * Get the current session from localStorage
 */
function getStoredSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as SessionData;
    return session;
  } catch {
    return null;
  }
}

/**
 * Store session data in localStorage
 */
function storeSession(session: SessionData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors (private browsing, etc.)
  }
}

/**
 * Get or create a session ID
 *
 * - Returns existing session ID if still valid (within 30 min)
 * - Creates new session ID if expired or doesn't exist
 * - Updates last activity timestamp on each call
 */
export function getSessionId(): string {
  const now = Date.now();
  const stored = getStoredSession();

  // Check if session exists and is still valid
  if (stored && (now - stored.lastActivity) < SESSION_DURATION) {
    // Update last activity
    const updated: SessionData = {
      id: stored.id,
      lastActivity: now,
    };
    storeSession(updated);
    return stored.id;
  }

  // Create new session
  const newSession: SessionData = {
    id: generateSessionId(),
    lastActivity: now,
  };
  storeSession(newSession);
  return newSession.id;
}

/**
 * Check if this is a new session (first visit or expired)
 */
export function isNewSession(): boolean {
  const stored = getStoredSession();
  if (!stored) return true;

  const now = Date.now();
  return (now - stored.lastActivity) >= SESSION_DURATION;
}

/**
 * Clear the current session (for testing or logout)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore errors
  }
}

// =============================================================================
// DEVICE DETECTION
// =============================================================================

/**
 * Detect device type based on user agent and viewport
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  // Check for mobile keywords in user agent
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTabletUA = /ipad|tablet|playbook|silk/i.test(userAgent);

  // Combine UA detection with viewport width
  if (isTabletUA || (isMobileUA && width >= 768)) {
    return 'tablet';
  }

  if (isMobileUA || width < 768) {
    return 'mobile';
  }

  if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
}

/**
 * Get current viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

// =============================================================================
// CONTEXT HELPERS
// =============================================================================

/**
 * Get the current page URL
 */
export function getPageUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

/**
 * Get the referrer URL
 */
export function getReferrer(): string {
  if (typeof document === 'undefined') return '';
  return document.referrer || '';
}

/**
 * Get the user agent string
 */
export function getUserAgent(): string {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent;
}

// =============================================================================
// SESSION CONTEXT BUILDER
// =============================================================================

/**
 * Build complete session context for an analytics event
 */
export interface SessionContext {
  sessionId: string;
  deviceType: DeviceType;
  viewport: { width: number; height: number };
  pageUrl: string;
  referrer: string;
  userAgent: string;
}

/**
 * Get all session context data at once
 */
export function getSessionContext(): SessionContext {
  return {
    sessionId: getSessionId(),
    deviceType: getDeviceType(),
    viewport: getViewport(),
    pageUrl: getPageUrl(),
    referrer: getReferrer(),
    userAgent: getUserAgent(),
  };
}
