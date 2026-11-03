/**
 * The events a professional's or brand's page reports (backend handoff, section 10.17). The API keeps the same
 * list (`pageAnalytics.service.js`); the last five were added on Nov 3 with the new page.
 */
export type ProfileEvent =
  | "PAGE_VIEW"
  | "WEBSITE_CLICK"
  | "ACCESS_CARD_CLICK"
  | "PRODUCT_CLICK"
  | "BOOKING_CLICK"
  | "SOCIAL_CLICK"
  | "EMAIL_CLICK"
  | "PHONE_CLICK"
  | "SHARE_CLICK"
  | "MEDIA_CLICK"
  | "EDUCATION_CLICK"
  | "PODCAST_CLICK"
  | "JOURNAL_CLICK";

/**
 * Marks a link or button inside a ProfileTracker so its clicks are counted:
 * `<a {...trackAs("WEBSITE_CLICK", url)}>`. Plain data attributes, so server
 * components can use it too. On a wrapper (an `<li>` around a tile), it counts
 * clicks anywhere inside it.
 */
export const trackAs = (event: ProfileEvent, target?: string | number | null): Record<string, string> => ({
  "data-profile-event": event,
  ...(target !== undefined && target !== null ? { "data-profile-target": String(target) } : {}),
});
