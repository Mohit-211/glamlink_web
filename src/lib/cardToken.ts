/**
 * Card tokens for the logged-out Access purchase.
 *
 * `POST /businessCard` answers a `card_token` that proves the browser created
 * that draft card. It is valid for 24 hours and works only for that card. It is
 * sent as `x-card-token` on the plan, address, shipping and payment calls, and
 * when claiming the draft after signing in. Kept in sessionStorage: it is only
 * needed for the rest of this purchase in this tab.
 *
 * A guest whose email already has an account signs in to claim the draft. That
 * can take an email link (verify the email, set or reset the password), which
 * opens a new tab without this tab's storage. So when a guest is sent to sign
 * in, the claim is also kept in localStorage until the token runs out: after
 * signing in anywhere in this browser, the person is brought back to it.
 */
const key = (cardId: string | number) => `glamlink_card_token:${cardId}`;
const CLAIM_KEY = "glamlink_pending_claim";

interface StoredClaim {
  cardId: string;
  token: string;
  /** When the card token runs out (ms). */
  expiresAt: number;
  /** The draft's email, lower case, when known: only that account is brought back to it. */
  email: string | null;
}

const normalEmail = (email?: string | null) => email?.trim().toLowerCase() || null;

/** When a card token runs out: its JWT `exp`, or 24 hours from now when it can't be read. */
function tokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload?.exp === "number") return payload.exp * 1000;
  } catch {
    // Not a readable JWT: assume the full lifetime.
  }
  return Date.now() + 24 * 3600_000;
}

function readClaim(): StoredClaim | null {
  try {
    const raw = localStorage.getItem(CLAIM_KEY);
    if (!raw) return null;
    const claim = JSON.parse(raw) as StoredClaim;
    if (claim?.cardId && claim.token && claim.expiresAt > Date.now()) return claim;
    localStorage.removeItem(CLAIM_KEY);
  } catch {
    // Storage blocked or unreadable: no claim.
  }
  return null;
}

export function saveCardToken(cardId: string | number, token: string) {
  try {
    sessionStorage.setItem(key(cardId), token);
  } catch {
    // Storage blocked: the purchase continues in this page's memory only.
  }
}

export function getCardToken(cardId: string | number | null | undefined): string | null {
  if (cardId === null || cardId === undefined || cardId === "") return null;
  try {
    const token = sessionStorage.getItem(key(cardId));
    if (token) return token;
  } catch {
    // Fall back to a pending claim below.
  }
  const claim = readClaim();
  return claim && claim.cardId === String(cardId) ? claim.token : null;
}

export function clearCardToken(cardId: string | number) {
  try {
    sessionStorage.removeItem(key(cardId));
  } catch {
    // Nothing to clear.
  }
  clearPendingClaim(cardId);
}

/** Header carrying the card token, or nothing when there is none. */
export function cardTokenHeader(cardId: string | number | null | undefined): Record<string, string> {
  const token = getCardToken(cardId);
  return token ? { "x-card-token": token } : {};
}

/* ── The claim kept through sign-in ─────────────────────────────────────── */

/** The page that claims draft `cardId` for the signed-in account, then offers the plans. */
export const claimPath = (cardId: string | number) =>
  `/pricing?businessCardId=${encodeURIComponent(String(cardId))}&claim=1`;

/**
 * Keeps the claim of draft `cardId` for after sign-in, in this browser, while
 * its card token lasts. `email` is the draft's email when known.
 */
export function rememberClaim(cardId: string | number, email?: string | null) {
  const token = getCardToken(cardId);
  if (!token) return;
  const before = readClaim();
  const claim: StoredClaim = {
    cardId: String(cardId),
    token,
    expiresAt: tokenExpiry(token),
    email: normalEmail(email) ?? (before?.cardId === String(cardId) ? before.email : null),
  };
  try {
    localStorage.setItem(CLAIM_KEY, JSON.stringify(claim));
  } catch {
    // Storage blocked: the claim works in this tab only.
  }
}

/**
 * The draft waiting to be claimed, or null. Given the signed-in email, a claim
 * made for another email is not offered.
 */
export function pendingClaim(email?: string | null): { cardId: string } | null {
  const claim = readClaim();
  if (!claim) return null;
  const signedIn = normalEmail(email);
  if (claim.email && signedIn && claim.email !== signedIn) return null;
  return { cardId: claim.cardId };
}

/** Forgets the kept claim (of `cardId` only, when given). */
export function clearPendingClaim(cardId?: string | number) {
  const claim = readClaim();
  if (!claim || (cardId !== undefined && claim.cardId !== String(cardId))) return;
  try {
    localStorage.removeItem(CLAIM_KEY);
  } catch {
    // Nothing to clear.
  }
}
