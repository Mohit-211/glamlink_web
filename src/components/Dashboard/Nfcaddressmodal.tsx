'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Plus, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getAllUserAddress } from '../../api/Api';
import { AddAddressModal } from './AddressTab';
import { PurchaseType } from './Purchasetypes';

type Address = {
  id: string;
  address_line_1: string;
  user_state?: any;
  user_city?: any;
  city_name?: string;
  state_name?: string;
  postal_code: string;
  address_lat?: number;
  address_long?: number;
  is_default?: boolean;
};

type NfcAddressModalProps = {
  open: boolean;
  purchaseType: PurchaseType | null;
  businessId: string | number;
  onClose: () => void;
  onConfirm: (payload: { type: PurchaseType; addressId: string }) => Promise<void> | void;
};

export default function NfcAddressModal({
  open,
  purchaseType,
  businessId,
  onClose,
  onConfirm,
}: NfcAddressModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      setLoadError(err?.response?.data?.message || 'Could not load saved addresses.');
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

  if (!open || !purchaseType) return null;

  const handleSubmit = async () => {
    if (!selectedAddressId || submitting) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      await onConfirm({
        type: purchaseType,
        addressId: selectedAddressId,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">
            {purchaseType === 'NFC_WITH_SUBSCRIPTION'
              ? 'Buy NFC Card + Subscription'
              : 'Buy NFC Card'}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {submitSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="text-sm font-medium text-foreground">Order request received</p>
              <p className="text-xs text-muted-foreground">
                We'll ship your NFC card to the selected address and notify you once it's on the way.
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
              <p className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
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
                      {addresses.map((addr) => (
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
                            name="nfc-address"
                            className="mt-0.5"
                            checked={selectedAddressId === String(addr.id)}
                            onChange={() => setSelectedAddressId(String(addr.id))}
                          />
                          <div>
                            <p className="font-medium text-foreground">{addr.address_line_1}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {addr?.user_city?.name || addr.city_name}, {addr?.user_state?.name || addr.state_name} · {addr.postal_code}
                            </p>
                          </div>
                        </label>
                      ))}
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

        {!submitSuccess && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedAddressId || submitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Continue to order
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