/** The events a professional's or brand's page reports (backend handoff, section 10.17). */
export type ProfileEvent =
  | "PAGE_VIEW"
  | "WEBSITE_CLICK"
  | "ACCESS_CARD_CLICK"
  | "PRODUCT_CLICK"
  | "BOOKING_CLICK"
  | "SOCIAL_CLICK"
  | "EMAIL_CLICK"
  | "PHONE_CLICK";

/**
 * Marks a link inside a ProfileTracker so its clicks are counted:
 * `<a {...trackAs("WEBSITE_CLICK", url)}>`. Plain data attributes, so server
 * components can use it too.
 */
export const trackAs = (event: ProfileEvent, target?: string | number | null): Record<string, string> => ({
  "data-profile-event": event,
  ...(target !== undefined && target !== null ? { "data-profile-target": String(target) } : {}),
});
