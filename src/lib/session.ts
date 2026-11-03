/**
 * The signed-in session (browser only).
 *
 * The API issues a 15-minute access token and keeps a 30-day refresh token in
 * an httpOnly cookie (`glamlink_refresh`) that JavaScript cannot read. The
 * access token lives in memory only, never in localStorage, so an injected
 * script cannot lift a long-lived credential. On every page load the session is
 * restored by calling the refresh endpoint, which reads the cookie.
 *
 * While someone is signed in, the access token is refreshed a minute before it
 * runs out, and again when the tab comes back to the foreground or the browser
 * goes back online, so a page left open (a payment, a card edit) never sends a
 * call without one.
 *
 * Server code must never call setSession: module state on the server is shared
 * between visitors.
 */
import { apiUrl } from "@/lib/config";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  account_type?: string;
  professional_type?: string;
  email_verified?: boolean;
}

export type SessionStatus = "loading" | "signed-in" | "signed-out";

export interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;
}

/** What the API's sign-in and refresh calls answer in `data`. */
export interface TokenPayload {
  access_token: string;
  access_token_expires_at: string;
  user?: SessionUser;
}

const isBrowser = typeof window !== "undefined";

/** Refresh this long before the access token runs out. */
const REFRESH_MARGIN_MS = 60_000;

let accessToken: string | null = null;
let expiresAt = 0;
let state: SessionState = { status: "loading", user: null };
let refreshInFlight: Promise<string | null> | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let watching = false;
const listeners = new Set<() => void>();

function setState(next: SessionState) {
  state = next;
  listeners.forEach((listener) => listener());
}

/**
 * When the access token runs out on this browser's clock: from its lifetime
 * (the JWT's exp - iat) when readable, so a device clock that is off can't make
 * every token look expired. Else the API's time, if it is still ahead.
 */
function localExpiry(payload: TokenPayload): number {
  try {
    const claims = JSON.parse(atob(payload.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof claims?.exp === "number" && typeof claims?.iat === "number" && claims.exp > claims.iat) {
      return Date.now() + (claims.exp - claims.iat) * 1000;
    }
  } catch {
    // Not a readable JWT: use the API's time below.
  }
  const stated = Date.parse(payload.access_token_expires_at);
  return stated > Date.now() ? stated : Date.now() + 14 * 60_000;
}

/** Refreshes a minute before the access token runs out (timers pause while a computer sleeps; see watchSession). */
function scheduleRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = null;
  if (!accessToken) return;
  const delay = Math.max(expiresAt - REFRESH_MARGIN_MS - Date.now(), 30_000);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    if (state.status === "signed-in") void refreshSession();
  }, delay);
}

/** Back in the foreground or online again with a stale token: refresh before the next call needs it. */
function watchSession() {
  if (watching) return;
  watching = true;
  const refreshIfStale = () => {
    if (state.status === "signed-in" && !peekAccessToken() && document.visibilityState !== "hidden") {
      void refreshSession();
    }
  };
  document.addEventListener("visibilitychange", refreshIfStale);
  window.addEventListener("focus", refreshIfStale);
  window.addEventListener("online", refreshIfStale);
}

/** Stores the token pair from login, verify-email or refresh. */
export function setSession(payload: TokenPayload) {
  if (!isBrowser) return;
  accessToken = payload.access_token;
  expiresAt = localExpiry(payload);
  scheduleRefresh();
  watchSession();
  setState({ status: "signed-in", user: payload.user ?? state.user });
}

/** Forgets the session locally (the cookie is cleared by the logout call). */
export function clearSession() {
  accessToken = null;
  expiresAt = 0;
  scheduleRefresh();
  setState({ status: "signed-out", user: null });
}

/** The current access token if it is still fresh, without refreshing. */
export function peekAccessToken(): string | null {
  return accessToken && Date.now() < expiresAt - REFRESH_MARGIN_MS ? accessToken : null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callRefresh(): Promise<Response> {
  return fetch(apiUrl("user/auth/refresh"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
}

/**
 * Gets a new access token from the refresh cookie. Concurrent callers share
 * one request. Resolves to null when there is no session.
 */
export function refreshSession(): Promise<string | null> {
  if (!isBrowser) return Promise.resolve(null);
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      let res = await callRefresh();
      // Another tab refreshed at the same moment: the cookie already holds the
      // rotated token, so one retry after a short pause succeeds.
      if (res.status === 409) {
        await wait(300);
        res = await callRefresh();
      }
      if (!res.ok) {
        clearSession();
        return null;
      }
      const body = await res.json();
      setSession(body.data as TokenPayload);
      return accessToken;
    } catch {
      // Network failure: keep whatever state we had; callers treat it as no token.
      if (state.status === "loading") setState({ status: "signed-out", user: null });
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/** A fresh access token, refreshing first when it is missing or about to expire. */
export async function getAccessToken(): Promise<string | null> {
  return peekAccessToken() ?? refreshSession();
}

/** Restores the session on page load. Safe to call more than once. */
export function initSession() {
  if (!isBrowser || state.status !== "loading" || refreshInFlight) return;
  void refreshSession();
}

/** For useSession (lib/useSession): subscribe to session changes. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The current session state (lib/useSession reads it for components). */
export const getSessionState = (): SessionState => state;

/** Waits until the first session restore has answered. */
export function sessionReady(): Promise<SessionState> {
  if (state.status !== "loading") return Promise.resolve(state);
  return new Promise((resolve) => {
    const unsubscribe = subscribe(() => {
      if (state.status !== "loading") {
        unsubscribe();
        resolve(state);
      }
    });
  });
}
