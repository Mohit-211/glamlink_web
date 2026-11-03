/* =============================================================
   Signed-out handling.

   The API answers an ended session with 401 SESSION_EXPIRED (after a refresh
   also fails) or SIGN_IN_REQUIRED. When that happens on a call that needs a
   signed-in account, the person is sent to sign in and brought back to the
   page they were on.
   ============================================================= */
import { clearSession } from "@/lib/session";
import { claimPath, pendingClaim, rememberClaim } from "@/lib/cardToken";

let redirecting = false;

/** Where to send someone after they sign in (only paths on this site). */
export const safeNextPath = (next: string | null | undefined): string | null =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : null;

/** The sign-in page, returning to `next` (default: the current page). */
export const loginHref = (next?: string) => {
  const target =
    next ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  return `/login?next=${encodeURIComponent(target)}`;
};

/** A sign-in page link that keeps `next` (forgot password, register, back to sign in). */
export const withNext = (path: string, next: string | null | undefined) => {
  const safe = safeNextPath(next);
  return safe ? `${path}?next=${encodeURIComponent(safe)}` : path;
};

/** The draft card a `next` path claims (`/pricing?businessCardId=…&claim=1`), or null. */
export function claimedCardOf(next: string | null | undefined): string | null {
  const path = safeNextPath(next);
  if (!path) return null;
  try {
    const url = new URL(path, "https://glamlink.invalid");
    const cardId = url.searchParams.get("businessCardId");
    return url.pathname === "/pricing" && url.searchParams.get("claim") === "1" && cardId && /^\d+$/.test(cardId)
      ? cardId
      : null;
  } catch {
    return null;
  }
}

/**
 * When `next` claims a guest's draft, keeps that claim in this browser so it
 * survives the email links of sign-up, verification and password reset.
 */
export function keepClaimThroughSignIn(next: string | null | undefined, email?: string | null) {
  const cardId = claimedCardOf(next);
  if (cardId) rememberClaim(cardId, email);
}

/**
 * Where to go once signed in as `email`: `next` when given, else a draft
 * waiting to be claimed (see lib/cardToken), else the dashboard.
 */
export function afterSignInPath(next: string | null | undefined, email?: string | null): string {
  const safe = safeNextPath(next);
  if (safe) return safe;
  const claim = pendingClaim(email);
  return claim ? claimPath(claim.cardId) : "/dashboard";
}

/**
 * Forgets the session and sends the person to sign in. Safe to call from several
 * failing requests at once: only the first one redirects.
 */
export const handleSignedOut = () => {
  if (typeof window === "undefined") return;
  clearSession();
  if (redirecting || window.location.pathname.startsWith("/login")) return;
  redirecting = true;
  // Full navigation so no signed-in page state keeps running.
  window.location.replace(loginHref());
};
