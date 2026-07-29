'use client';
import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Plus,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Nfc,
  Check,
} from 'lucide-react';
import { getAllUserAddress } from '@/api/Api';
import { PurchaseType } from './Purchasetypes';
import { AddAddressModal } from './AddressTab';

const FEATURES_NFC_WITH_SUBSCRIPTION = [
  'Unlimited digital access card',
  'Shareable link & QR code',
  'Physical NFC card shipped to you',
  'Tap-to-share in person',
];

const FEATURES_NFC_ONLY = [
  'Physical NFC card preloaded with your access card link',
  'Tap-to-share in person, no app needed',
  'No recurring monthly fees',
  'Ships in 5–7 business days',
];

type Address = {
  id: string;
  address_line_1?: string;
  user_city?: { name: string };
  user_state?: { name: string };
  city_name?: string;
  state_name?: string;
  postal_code?: string;
  full_name?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  is_default?: boolean;
};

type SubscriptionNfcModalProps = {
  open: boolean;
  businessCardId?: string;
  purchaseType?: PurchaseType;
  onClose: () => void;
  onConfirm: (payload: {
    businessCardId?: string;
    addressId: string;
    purchaseType: PurchaseType;
  }) => Promise<void> | void;
};

export default function SubscriptionNfcModal({
  open,
  businessCardId,
  purchaseType = 'NFC_WITH_SUBSCRIPTION',
  onClose,
  onConfirm,
}: SubscriptionNfcModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isNfcOnly = purchaseType === 'NFC_ONLY';

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      setLoadError('');
      const res = await getAllUserAddress();
      const raw = res?.addresses ?? res?.data ?? res ?? [];
      const list: Address[] = Array.isArray(raw) ? raw : [];
      setAddresses(list);
      const preselect = list.find((a) => a.is_default) ?? list[0];
      if (preselect) setSelectedAddressId(String(preselect.id));
      return list;
    } catch (err: any) {
      setLoadError(
        err?.response?.data?.message || 'Could not load saved addresses.'
      );
      return [];
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    setSelectedAddressId(null);
    setShowAddModal(false);
    setSubmitError('');
    setSubmitSuccess(false);

    let cancelled = false;
    (async () => {
      const list = await fetchAddresses();
      if (cancelled) return;
      if (!list.length) setShowAddModal(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const canSubmit = !!selectedAddressId;

  const handleConfirm = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await onConfirm({
        businessCardId,
        addressId: selectedAddressId as string,
        purchaseType,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const features = isNfcOnly ? FEATURES_NFC_ONLY : FEATURES_NFC_WITH_SUBSCRIPTION;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">
            {isNfcOnly ? 'Buy Physical NFC Card' : 'Subscription + NFC Card'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {submitSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="text-sm font-medium text-foreground">
                {isNfcOnly ? 'Order confirmed' : 'Order & subscription confirmed'}
              </p>
              <p className="text-xs text-muted-foreground">
                We'll ship your NFC card to the selected address.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Dynamic Pricing Summary */}
              <div className="mb-4 space-y-2 rounded-xl border border-primary/30 bg-accent px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-accent-foreground">
                    <Nfc className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">NFC Physical Card</p>
                    <p className="text-xs text-muted-foreground">One-time purchase</p>
                  </div>
                  <p className="ml-auto text-sm font-bold text-foreground">$39.99</p>
                </div>

                {/* Show Subscription line item ONLY if not NFC_ONLY */}
                {!isNfcOnly && (
                  <div className="flex items-center gap-3 border-t border-primary/20 pt-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-accent-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Subscription</p>
                      <p className="text-xs text-muted-foreground">Billed monthly, cancel anytime</p>
                    </div>
                    <p className="ml-auto text-sm font-bold text-foreground">
                      $4.99<span className="text-[11px] font-normal text-muted-foreground">/mo</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Feature List */}
              <ul className="mb-4 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Where should we ship your NFC card?
              </p>

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {loadError && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      {loadError}
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {addresses.map((addr) => {
                        const streetAddress = addr.address_line_1 || addr.line1 || '';
                        const cityName = addr.user_city?.name || addr.city_name || addr.city || '';
                        const stateName = addr.user_state?.name || addr.state_name || addr.state || '';
                        const zipCode = addr.postal_code || addr.pincode || '';

                        return (
                          <label
                            key={addr.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-xs transition-colors ${
                              selectedAddressId === String(addr.id)
                                ? 'border-primary bg-accent'
                                : 'border-border hover:bg-secondary/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="subscription-nfc-address"
                              className="mt-0.5"
                              checked={selectedAddressId === String(addr.id)}
                              onChange={() => setSelectedAddressId(String(addr.id))}
                            />
                            <div>
                              <p className="font-medium text-foreground">
                                {streetAddress}{' '}
                                {addr.is_default && (
                                  <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="mt-0.5 text-muted-foreground">
                                {[cityName, stateName, zipCode].filter(Boolean).join(', ')}
                              </p>
                              {addr.phone && (
                                <p className="mt-0.5 text-muted-foreground">{addr.phone}</p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add a new address
                  </button>
                </>
              )}

              {submitError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  {submitError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Button - Dynamically adjusts label based on purchaseType */}
        {!submitSuccess && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canSubmit || submitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNfcOnly ? 'Pay $39.99' : 'Pay $39.99 + $4.99/month'}
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddAddressModal
          onClose={() => setShowAddModal(false)}
          onSaved={async () => {
            await fetchAddresses();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}