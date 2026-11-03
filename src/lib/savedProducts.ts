import { deleteCookie, getConsent, readCookie, writeCookie } from "./consent";

/*
 * Products a visitor saved (the owner, Nov 3): their ids in a cookie, most recent first, kept only when the visitor
 * accepted cookies. The Shop reads the same cookie on the server for its Saved list (?saved=1).
 */

export const SAVED_COOKIE = "glamlink_saved";
/** A cookie holds about 4 KB; 50 ids stay far below it. */
export const SAVED_LIMIT = 50;
const SAVED_MAX_AGE = 60 * 60 * 24 * 365;
const CHANGED = "glamlink:saved";

/** "12.5.33" as ids; anything else in it is dropped. */
export function parseSaved(value: string | null | undefined): number[] {
  if (!value) return [];
  const ids = value.split(".").map(Number).filter((id) => Number.isInteger(id) && id > 0);
  return [...new Set(ids)].slice(0, SAVED_LIMIT);
}

let cache: { raw: string | null; ids: number[] } = { raw: null, ids: [] };

/** The saved ids, the same array while the cookie is unchanged (as useSyncExternalStore needs). */
export function getSavedIds(): number[] {
  const raw = readCookie(SAVED_COOKIE);
  if (raw !== cache.raw) cache = { raw, ids: parseSaved(raw) };
  return cache.ids;
}

const EMPTY: number[] = [];
export const getSavedIdsOnServer = () => EMPTY;

export function subscribeSaved(listener: () => void) {
  window.addEventListener(CHANGED, listener);
  return () => window.removeEventListener(CHANGED, listener);
}

const announce = () => window.dispatchEvent(new Event(CHANGED));

/** Saves or unsaves a product; false (nothing stored) until the visitor has accepted cookies. */
export function toggleSaved(id: number): boolean {
  if (getConsent() !== "all") return false;
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter((saved) => saved !== id) : [id, ...ids].slice(0, SAVED_LIMIT);
  if (next.length) writeCookie(SAVED_COOKIE, next.join("."), SAVED_MAX_AGE);
  else deleteCookie(SAVED_COOKIE);
  announce();
  return true;
}

/** Forgets every saved product: when the visitor rejects cookies. */
export function clearSaved() {
  deleteCookie(SAVED_COOKIE);
  announce();
}
