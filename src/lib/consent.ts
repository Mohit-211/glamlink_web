/*
 * The visitor's cookie choice (the owner, Nov 3): a banner with Accept all and Reject.
 *
 *   all        saved products (lib/savedProducts.ts), Google Analytics through Tag Manager, and personalized ads
 *   necessary  only what the site needs to work: signing in, and this choice itself. Google's tags then run
 *              without cookies (consent mode, set in app/layout.tsx before Tag Manager loads) and ads are not
 *              personalized; saving products asks for Accept.
 *
 * The choice is a cookie, read in the browser only, so pages stay static.
 */

export type Consent = "all" | "necessary";

export const CONSENT_COOKIE = "glamlink_consent";
/** Half a year, then the banner asks again. */
const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;

const CHANGED = "glamlink:consent";
const OPEN = "glamlink:cookie-settings";

/** Why the banner was opened: "save" when a visitor tried to save a product without having accepted. */
export type CookieSettingsReason = "save" | "settings";

/** A cookie's value from the browser, or null. */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const found = document.cookie.split("; ").find((pair) => pair.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : null;
}

export function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function getConsent(): Consent | null {
  const value = readCookie(CONSENT_COOKIE);
  return value === "all" || value === "necessary" ? value : null;
}

type ConsentWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
};

/** Tells Google's tags (Tag Manager, Analytics, AdSense) what the visitor chose, without a reload. */
function tellGoogle(choice: Consent) {
  const w = window as ConsentWindow;
  const state = choice === "all" ? "granted" : "denied";
  w.gtag?.("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  w.adsbygoogle = w.adsbygoogle || [];
  w.adsbygoogle.requestNonPersonalizedAds = choice === "all" ? 0 : 1;
}

export function setConsent(choice: Consent) {
  writeCookie(CONSENT_COOKIE, choice, CONSENT_MAX_AGE);
  tellGoogle(choice);
  window.dispatchEvent(new CustomEvent(CHANGED, { detail: choice }));
}

export function subscribeConsent(listener: () => void) {
  window.addEventListener(CHANGED, listener);
  return () => window.removeEventListener(CHANGED, listener);
}

/** Opens the cookie banner again: the footer's Cookie settings, or a Save without consent. */
export function openCookieSettings(reason: CookieSettingsReason = "settings") {
  window.dispatchEvent(new CustomEvent<CookieSettingsReason>(OPEN, { detail: reason }));
}

export function onCookieSettings(listener: (reason: CookieSettingsReason) => void) {
  const handle = (event: Event) => listener((event as CustomEvent<CookieSettingsReason>).detail);
  window.addEventListener(OPEN, handle);
  return () => window.removeEventListener(OPEN, handle);
}

/**
 * Google's consent mode defaults, run in <head> before Tag Manager: denied until the visitor accepts (or granted
 * when they already did). AdSense also gets non-personalized ads until then.
 */
export const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
var glamlinkAccepted = /(?:^|; )${CONSENT_COOKIE}=all(?:;|$)/.test(document.cookie);
var glamlinkState = glamlinkAccepted ? "granted" : "denied";
window.gtag("consent", "default", {
  ad_storage: glamlinkState,
  ad_user_data: glamlinkState,
  ad_personalization: glamlinkState,
  analytics_storage: glamlinkState,
  functionality_storage: "granted",
  security_storage: "granted",
  wait_for_update: 500
});
window.adsbygoogle = window.adsbygoogle || [];
window.adsbygoogle.requestNonPersonalizedAds = glamlinkAccepted ? 0 : 1;
`;
