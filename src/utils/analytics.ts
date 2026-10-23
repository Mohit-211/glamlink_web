import { trackAccessCardEventApi } from "@/api/Api";

/* ============================= */
/* 📌 Types */
/* ============================= */
// Must match the event types the backend accepts.
export type AnalyticsEventType =
  | "ACCESS_CARD_VIEW"
  // Contact / business actions
  | "WEBSITE_CLICK"
  | "BOOKING_CLICK"
  | "PHONE_CLICK"
  | "EMAIL_CLICK"
  | "SHARE_CLICK"
  | "SAVE_CONTACT_CLICK"
  | "CONNECT_CLICK"
  // Social media
  | "INSTAGRAM_CLICK"
  | "TIKTOK_CLICK"
  | "FACEBOOK_CLICK"
  | "LINKEDIN_CLICK"
  | "YOUTUBE_CLICK"
  // Links
  | "OTHER_LINK_CLICK"
  | "FEATURED_LINK_CLICK"
  | "JOURNAL_CLICK"
  // Location
  | "LOCATION_CLICK"
  // Media
  | "IMAGE_CLICK"
  // Promotion
  | "PROMOTION_CLICK";

export interface TrackEventParams {
  businessCardId: number;
  eventType: AnalyticsEventType;
  eventTarget?: string | null;
  metadata?: Record<string, unknown>;
}

const VISITOR_ID_KEY = "glamlink_visitor_id";
const SESSION_ID_KEY = "glamlink_session_id";

const isDev = process.env.NODE_ENV === "development";
const warn = (...args: unknown[]) => {
  if (isDev) console.warn("[analytics]", ...args);
};

/* ============================= */
/* 📌 IDs */
/* ============================= */
const uuid = (): string => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // fall through (randomUUID is unavailable on non-secure origins)
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

// Fallback when storage throws (private mode), so IDs stay stable for this page load.
const memoryIds: Record<string, string> = {};

const getOrCreateId = (
  getStorage: () => Storage,
  key: string,
  prefix: string
): string => {
  if (typeof window === "undefined") return "";
  try {
    const storage = getStorage();
    const existing = storage.getItem(key);
    if (existing) return existing;
    const id = `${prefix}_${uuid()}`;
    storage.setItem(key, id);
    return id;
  } catch {
    if (!memoryIds[key]) memoryIds[key] = `${prefix}_${uuid()}`;
    return memoryIds[key];
  }
};

export const getVisitorId = (): string =>
  getOrCreateId(() => window.localStorage, VISITOR_ID_KEY, "visitor");

export const getSessionId = (): string =>
  getOrCreateId(() => window.sessionStorage, SESSION_ID_KEY, "session");

/* ============================= */
/* 📌 Track (fire-and-forget) */
/* ============================= */
// Never await this. The request itself lives in src/api/Api.tsx (trackAccessCardEventApi).
export const trackEvent = ({
  businessCardId,
  eventType,
  eventTarget = null,
  metadata = {},
}: TrackEventParams): void => {
  if (typeof window === "undefined") return;
  try {
    if (!businessCardId) return;

    trackAccessCardEventApi({
      business_card_id: businessCardId,
      event_type: eventType,
      event_target: eventTarget || null,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      metadata,
    }).catch((err) => warn("request failed", err));
  } catch (err) {
    warn("trackEvent failed", err);
  }
};
