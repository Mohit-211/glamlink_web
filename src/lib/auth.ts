/* =============================================================
   Shared auth-session helpers.

   The backend can report a missing/invalid token with an HTTP 200 and a
   body like { success: true, status: 400, message: "Token Not Found" },
   so this is detected from the response BODY, not from `success` or the
   HTTP status alone. Only that specific message triggers a logout — every
   other 400 is left for the caller to handle as before.
   ============================================================= */

const TOKEN_NOT_FOUND_MESSAGE = "token not found";

const isTokenNotFoundBody = (body: any): boolean =>
  !!body &&
  typeof body === "object" &&
  Number(body.status ?? body.statusCode) === 400 &&
  typeof body.message === "string" &&
  body.message.trim().toLowerCase() === TOKEN_NOT_FOUND_MESSAGE;

/**
 * True when `payload` (or a response it's wrapped in — e.g. an axios
 * response's `data`, or a nested `data`/`response` object) is the
 * "Token Not Found" auth failure.
 */
export const isTokenNotFoundResponse = (payload: any, depth = 0): boolean => {
  if (!payload || typeof payload !== "object" || depth > 3) return false;
  if (isTokenNotFoundBody(payload)) return true;
  return (
    isTokenNotFoundResponse(payload.data, depth + 1) ||
    isTokenNotFoundResponse(payload.response, depth + 1)
  );
};

/** Removes every auth/user/session value the app keeps in browser storage. */
export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // Storage can be unavailable (private mode / blocked) — nothing to clear.
  }
};

let redirecting = false;

/**
 * Logs the user out locally and sends them to /login. Safe to call from
 * several failing requests at once — only the first one redirects.
 */
export const handleTokenExpired = () => {
  if (typeof window === "undefined") return;
  clearAuthStorage();
  // Lets the Header (and anything else listening) drop its logged-in state.
  window.dispatchEvent(new Event("auth-change"));

  if (redirecting || window.location.pathname.startsWith("/login")) return;
  redirecting = true;
  // Full navigation (not router.push) so no authenticated page state or
  // in-flight requests keep using the invalid token.
  window.location.replace("/login");
};

/** Marker for the rejection the API layer raises after a forced logout. */
export class TokenExpiredError extends Error {
  isTokenExpired = true;
  constructor() {
    super("Session expired. Please log in again.");
    this.name = "TokenExpiredError";
  }
}
