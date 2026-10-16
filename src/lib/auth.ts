/* =============================================================
   Signed-out handling.

   The API answers an ended session with 401 SESSION_EXPIRED (after a refresh
   also fails) or SIGN_IN_REQUIRED. When that happens on a call that needs a
   signed-in account, the person is sent to sign in and brought back to the
   page they were on.
   ============================================================= */
import { clearSession } from "@/lib/session";

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
