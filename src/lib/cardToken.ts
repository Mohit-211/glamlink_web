/**
 * Card tokens for the logged-out Access purchase.
 *
 * `POST /businessCard` answers a `card_token` that proves the browser created
 * that draft card. It is valid for 24 hours and works only for that card. It is
 * sent as `x-card-token` on the plan, address, shipping and payment calls, and
 * when claiming the draft after signing in. Kept in sessionStorage: it is only
 * needed for the rest of this purchase in this tab.
 */
const key = (cardId: string | number) => `glamlink_card_token:${cardId}`;

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
    return sessionStorage.getItem(key(cardId));
  } catch {
    return null;
  }
}

export function clearCardToken(cardId: string | number) {
  try {
    sessionStorage.removeItem(key(cardId));
  } catch {
    // Nothing to clear.
  }
}

/** Header carrying the card token, or nothing when there is none. */
export function cardTokenHeader(cardId: string | number | null | undefined): Record<string, string> {
  const token = getCardToken(cardId);
  return token ? { "x-card-token": token } : {};
}
