export const ALLOWED_PURCHASE_TYPES = [
  "NFC_ONLY",
  "NFC_WITH_SUBSCRIPTION",
  "SUBSCRIPTION_ONLY",
] as const;

export type PurchaseType = typeof ALLOWED_PURCHASE_TYPES[number];

export interface PurchasePayload {
  business_id: string | number;
  allowedPurchaseTypes: PurchaseType[];
  addressId?: string;
  newAddress?: Record<string, any>;
}

/**
 * Checks if a purchase type requires selecting a shipping address first.
 */
export function requiresAddress(type: PurchaseType): boolean {
  return type === 'NFC_ONLY' || type === 'NFC_WITH_SUBSCRIPTION';
}