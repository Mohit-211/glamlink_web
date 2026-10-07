// Single source of truth for whether the signed-in user may change an Access Card.
//
// The decision is based ONLY on the card's `plan_type` from the business-card API
// (businessCard/getMyBusinessCard → data[n].plan_type). Never derive it from
// status / is_active / subscription_status / nfc_status, and never cache it —
// always pass the latest card object so an upgrade unlocks editing on refetch.
import { useMemo } from 'react';
import { toast } from 'sonner';

export type AccessCardPlanType = 'free' | 'subscription_only' | 'nfc_only' | 'nfc_with_subscription';

/**
 * Plans that include editing. Mirrors the existing plan rules: editing is a Pro
 * (subscription) feature, so `nfc_only` (free listing + keychain) stays read-only
 * alongside `free`. Anything unknown or missing is treated as not editable.
 */
const EDITABLE_PLAN_TYPES: ReadonlySet<AccessCardPlanType> = new Set(['subscription_only', 'nfc_with_subscription']);

const KNOWN_PLAN_TYPES: ReadonlySet<string> = new Set(['free', 'subscription_only', 'nfc_only', 'nfc_with_subscription']);

export const ACCESS_CARD_UPGRADE_MESSAGE =
  'Editing your Access Card is available with a paid plan. Please upgrade your plan to make changes.';

export interface AccessCardPermissions {
  /** Normalized plan_type, or null when missing/unrecognized. */
  planType: AccessCardPlanType | null;
  isFreePlan: boolean;
  /** False while loading, for free / non-editing plans, and when plan_type is missing. */
  canEditAccessCard: boolean;
  /** True while the card (and so the plan) hasn't loaded yet. */
  isLoading: boolean;
}

export function getAccessCardPlanType(card: unknown): AccessCardPlanType | null {
  const raw = (card as { plan_type?: unknown } | null | undefined)?.plan_type;
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  return KNOWN_PLAN_TYPES.has(value) ? (value as AccessCardPlanType) : null;
}

export function getAccessCardPermissions(card: unknown, options: { loading?: boolean } = {}): AccessCardPermissions {
  const isLoading = !!options.loading;
  const planType = isLoading ? null : getAccessCardPlanType(card);
  return {
    planType,
    isFreePlan: planType === 'free',
    canEditAccessCard: !isLoading && planType !== null && EDITABLE_PLAN_TYPES.has(planType),
    isLoading,
  };
}

/** React wrapper — recomputes whenever the card object (i.e. the latest API data) changes. */
export function useAccessCardPermissions(card: unknown, options: { loading?: boolean } = {}): AccessCardPermissions {
  const loading = !!options.loading;
  return useMemo(() => getAccessCardPermissions(card, { loading }), [card, loading]);
}

/** Shows the upgrade message, with an "Upgrade plan" action when a plans destination is available. */
export function showAccessCardUpgradeMessage(onUpgrade?: () => void) {
  toast.error(ACCESS_CARD_UPGRADE_MESSAGE, {
    id: 'access-card-upgrade-required',
    ...(onUpgrade ? { action: { label: 'Upgrade plan', onClick: onUpgrade } } : {}),
  });
}

/**
 * Guard for every Access Card edit / mutation entry point. Call it FIRST in the
 * handler — before opening modals, preparing form data, uploading or calling an API:
 *
 *   if (!ensureCanEditAccessCard(card, { onUpgrade })) return;
 */
export function ensureCanEditAccessCard(
  card: unknown,
  options: { loading?: boolean; onUpgrade?: () => void; silent?: boolean } = {}
): boolean {
  const { canEditAccessCard } = getAccessCardPermissions(card, options);
  if (!canEditAccessCard && !options.silent) showAccessCardUpgradeMessage(options.onUpgrade);
  return canEditAccessCard;
}
