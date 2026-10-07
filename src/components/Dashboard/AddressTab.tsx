'use client';
import { useState, useEffect, useCallback } from 'react';
import { Home, Plus, Trash2, Loader2, AlertCircle, X, MapPin, Pencil, CheckCircle2 } from 'lucide-react';
import { message } from "antd";
import {
  addNewAddress,
  getAllUserAddress,
  editAddress,
  deleteAddress,
  getAllStates,
  getCitiesByState,
} from '../../api/Api';
import { EmptyState, PageHeader, btn, field } from './shell/ui';
/* ─── Types ─── */
interface Address {
  user_state?: { id: number; name: string };
  user_city?: { id: number; name: string };
  id: string | number;
  address_line_1: string;
  address_lat?: number;
  address_long?: number;
  state_id: number;
  city_id: number;
  postal_code: string;
  city_name?: string;
  state_name?: string;
  is_default?: boolean;
}
interface NewFormState {
  address_line_1: string;
  address_lat: string;
  address_long: string;
  state_id: string;
  city_id: string;
  postal_code: string;
}
const EMPTY_FORM: NewFormState = {
  address_line_1: '',
  address_lat: '',
  address_long: '',
  state_id: '',
  city_id: '',
  postal_code: '',
};
interface StateItem {
  id: number;
  name: string;
}
interface CityItem {
  id: number;
  name: string;
}
const INPUT = field.input;
const LABEL = field.label;
/* ══════════════════════════════════════════════
   ADD ADDRESS MODAL
══════════════════════════════════════════════ */
interface AddAddressModalProps {
  onClose: () => void;
  onSaved: () => void;
}
export function AddAddressModal({ onClose, onSaved }: AddAddressModalProps) {
  const [form, setForm] = useState<NewFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const set = (key: keyof NewFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getAllStates();
        setStates(res?.data?.all_state || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStates();
  }, []);
  useEffect(() => {
    if (!form.state_id) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await getCitiesByState(form.state_id);
        setCities(res?.data?.all_city || res?.all_city || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCities();
  }, [form.state_id]);
  async function handleSubmit() {
    if (
      !form.address_line_1.trim() ||
      !form.state_id ||
      !form.city_id ||
      !form.postal_code.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        address_line_1: form.address_line_1.trim(),
        ...(form.address_lat && {
          address_lat: parseFloat(form.address_lat),
        }),
        ...(form.address_long && {
          address_long: parseFloat(form.address_long),
        }),
        state_id: parseInt(form.state_id),
        city_id: parseInt(form.city_id),
        postal_code: form.postal_code.trim(),
      };
      const response = await addNewAddress(payload);
      if (response?.success === false) {
        setError(
          response?.message ||
          "Please enter a valid address, city, state and PIN code."
        );
        return;
      }
      message.success("Address added successfully.");
      await onSaved();
      onClose();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message === "Address validation failed: Unable to find a valid city, state or 5-digit zip. Please check the accuracy of the submitted address."
          ? "Please enter a valid address, city, state and Postal Code"
          : error?.response?.data?.message;
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  }
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 p-0 backdrop-blur-sm sm:p-4"
    >
      <div className="w-full overflow-hidden rounded-t-2xl border border-border bg-card shadow-large duration-200 animate-in slide-in-from-bottom-4 sm:max-w-md sm:rounded-2xl sm:slide-in-from-bottom-0">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-base font-semibold text-foreground">Add address</p>
              <p className="text-xs text-muted-foreground">Used for shipping your NFC keychain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className={btn.icon + ' h-8 w-8'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Form body */}
        <div className="max-h-[65vh] space-y-3.5 overflow-y-auto p-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
          {/* Address Line 1 */}
          <div>
            <label className={LABEL}>
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              value={form.address_line_1}
              onChange={set('address_line_1')}
              placeholder="e.g. 3730 S Las Vegas Blvd"
              disabled={saving}
              className={INPUT}
            />
          </div>
          {/* State / City — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={form.state_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    state_id: e.target.value,
                    city_id: "",
                  }))
                }
                disabled={saving}
                className={INPUT}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={String(state.id)}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={form.city_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    city_id: e.target.value,
                  }))
                }
                disabled={!form.state_id || saving}
                className={INPUT}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={String(city.id)}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Zip code */}
          <div>
            <label className={LABEL}>
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              value={form.postal_code}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  postal_code: e.target.value.toUpperCase(),
                }))
              }
              placeholder="Enter ZIP Code"
              maxLength={10}
              disabled={saving}
              className={INPUT}
            />
          </div>
        </div>
        {/* Footer actions */}
        <div className="flex gap-3 border-t border-border px-5 pb-5 pt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className={btn.outline + ' flex-1'}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={btn.primary + ' flex-1'}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════
   ADDRESS TAB
══════════════════════════════════════════════ */
export function AddressTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editStates, setEditStates] = useState<StateItem[]>([]);
  const [editCities, setEditCities] = useState<CityItem[]>([]);
  const [editing, setEditing] = useState<string | number | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewFormState> | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  /* ── fetch ── */
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAllUserAddress();
      setAddresses(data?.addresses ?? data?.data ?? data ?? []);
    } catch {
      setFetchError('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  /* ── open edit ── */
  async function openEdit(addr: Address) {
    setEditing(addr.id);
    setEditError(null);
    setEditForm({
      address_line_1: addr.address_line_1,
      address_lat: addr.address_lat?.toString() ?? '',
      address_long: addr.address_long?.toString() ?? '',
      state_id: addr.state_id.toString(),
      city_id: addr.city_id.toString(),
      postal_code: addr.postal_code,
    });
    // Fetch states
    try {
      const statesRes = await getAllStates();
      setEditStates(statesRes?.data?.all_state ?? []);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
    // Fetch cities for this state
    try {
      const citiesRes = await getCitiesByState(addr.state_id.toString());
      setEditCities(citiesRes?.data?.all_city || citiesRes?.all_city || []);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  }
  /* ── handle state change in edit mode ── */
  const handleEditStateChange = async (stateId: string) => {
    setEditForm(prev => prev ? { ...prev, state_id: stateId, city_id: '' } : null);
    if (!stateId) {
      setEditCities([]);
      return;
    }
    try {
      const res = await getCitiesByState(stateId);
      setEditCities(res?.data?.all_city || res?.all_city || []);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };
  /* ── save edit ── */
  async function handleSaveEdit(addressId: string | number) {
    if (!editForm) return;
    if (
      !editForm.address_line_1?.trim() ||
      !editForm.state_id ||
      !editForm.city_id ||
      !editForm.postal_code?.trim()
    ) {
      setEditError("Please fill in all required fields.");
      return;
    }
    setEditSaving(true);
    setEditError(null);
    try {
      const payload = {
        address_line_1: editForm.address_line_1,
        ...(editForm.address_lat && {
          address_lat: parseFloat(editForm.address_lat),
        }),
        ...(editForm.address_long && {
          address_long: parseFloat(editForm.address_long),
        }),
        state_id: parseInt(editForm.state_id),
        city_id: parseInt(editForm.city_id),
        postal_code: editForm.postal_code,
      };
      const response = await editAddress(addressId, payload);
      if (response?.success === false) {
        setEditError(
          response?.message ||
          "Please enter a valid address, city, state and PIN code."
        );
        return;
      }
      message.success("Address updated successfully.");
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === addressId
            ? {
              ...a,
              ...payload,
            }
            : a
        )
      );
      setEditing(null);
      setEditForm(null);
    } catch (error: any) {
      setEditError(
        error?.response?.data?.message ||
        error?.message ||
        "Please enter a valid address, city, state and PIN code."
      );
    } finally {
      setEditSaving(false);
    }
  }
  /* ── delete ──
     Fixed: this previously never set/cleared `deletingId`, so the button's
     loading state never actually rendered and there was nothing stopping a
     double-click from firing two deletes at once. Also now callable
     straight from the card (not just from inside edit mode), with a confirm
     step first since it's a destructive action. */
  const handleDelete = async (addressId: string | number) => {
    if (deletingId) return; // guard against double-clicks / concurrent deletes
    const confirmed = window.confirm('Remove this address? This can’t be undone.');
    if (!confirmed) return;

    setDeletingId(addressId);
    setDeleteError(null);
    try {
      const res = await deleteAddress(addressId);
      if (res?.success !== false) {
        setAddresses((prev) => prev.filter((item) => item.id !== addressId));
        if (editing === addressId) {
          setEditing(null);
          setEditForm(null);
        }
        message.success("Address deleted successfully.");
      } else {
        setDeleteError(res?.message || "Failed to delete address.");
      }
    } catch (error: any) {
      console.error("Delete Error:", error);
      setDeleteError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete address. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };
  /* ── after modal saves ── */
  async function handleSaved() {
    await fetchAddresses();
  }
  /* ─────────────────────────────────────────── */
  return (
    <div>
      <PageHeader
        title="Addresses"
        description={
          loading
            ? 'Shipping addresses for your NFC keychain orders.'
            : `${addresses.length} saved address${addresses.length !== 1 ? 'es' : ''} · used for NFC keychain orders.`
        }
        actions={
          addresses.length > 0 || loading ? (
            <button onClick={() => setShowModal(true)} className={btn.primary}>
              <Plus className="h-4 w-4" /> Add address
            </button>
          ) : undefined
        }
      />
      {/* Fetch error */}
      {fetchError && (
        <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{fetchError}</span>
          <button onClick={fetchAddresses} className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-red-50">
            Retry
          </button>
        </div>
      )}
      {/* Delete error (surfaced at list level since delete can be triggered from any card) */}
      {deleteError && (
        <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="text-xs font-semibold underline underline-offset-2">
            Dismiss
          </button>
        </div>
      )}
      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 h-10 w-10 rounded-xl bg-secondary" />
              <div className="mb-2 h-4 w-3/4 rounded bg-secondary" />
              <div className="h-3 w-1/2 rounded bg-secondary" />
            </div>
          ))}
        </div>
      )}
      {/* Empty state */}
      {!loading && !fetchError && addresses.length === 0 && (
        <EmptyState
          bordered
          icon={MapPin}
          title="No addresses saved yet"
          message="Add a shipping address so we know where to send your NFC keychain."
          action={
            <button onClick={() => setShowModal(true)} className={btn.primary}>
              <Plus className="h-4 w-4" /> Add your first address
            </button>
          }
        />
      )}
      {/* Address cards */}
      {!loading && addresses.length > 0 && (
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {addresses.map(addr => {
            const isEditing = editing === addr.id;
            const isDeleting = deletingId === addr.id;
            const cityLine = [addr?.user_city?.name || addr.city_name, addr?.user_state?.name || addr.state_name]
              .filter(Boolean)
              .join(', ');
            return (
              <div
                key={addr.id}
                className={`min-w-0 overflow-hidden rounded-2xl border bg-card transition-colors ${isEditing ? 'sm:col-span-2' : ''} ${addr.is_default ? 'border-primary/50' : 'border-border'
                  }`}
              >
                {/* Summary */}
                <div className="flex items-start gap-3.5 p-5">
                  <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${addr.is_default ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                      }`}
                  >
                    <Home className="h-4.5 w-4.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    {addr.is_default && (
                      <span className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                        <CheckCircle2 className="h-3 w-3" /> Default
                      </span>
                    )}
                    <p className="break-words text-sm font-semibold text-foreground">{addr.address_line_1}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cityLine}{cityLine && addr.postal_code ? ' · ' : ''}{addr.postal_code}
                    </p>
                    {(addr.address_lat || addr.address_long) && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                        {addr.address_lat}, {addr.address_long}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card actions */}
                {!isEditing && (
                  <div className="flex items-center gap-2 border-t border-border px-5 py-3">
                    <button
                      onClick={() => openEdit(addr)}
                      disabled={isDeleting}
                      className={btn.chip}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={isDeleting}
                      aria-label="Delete address"
                      className={btn.danger}
                    >
                      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      {isDeleting ? 'Removing…' : 'Delete'}
                    </button>
                  </div>
                )}

                {/* Inline edit */}
                {isEditing && editForm && (
                  <div className="space-y-4 border-t border-border bg-secondary/30 px-5 pb-5 pt-4">
                    {editError && (
                      <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {editError}
                      </p>
                    )}
                    <div>
                      <label className={LABEL}>Address line 1</label>
                      <input
                        value={editForm.address_line_1 ?? ''}
                        onChange={e => setEditForm(f => f && ({ ...f, address_line_1: e.target.value }))}
                        placeholder="Address Line 1"
                        disabled={editSaving}
                        className={INPUT}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className={LABEL}>State</label>
                        <select
                          value={editForm.state_id ?? ""}
                          onChange={(e) => handleEditStateChange(e.target.value)}
                          disabled={editSaving}
                          className={INPUT}
                        >
                          <option value="">Select State</option>
                          {editStates.map((state) => (
                            <option key={state.id} value={String(state.id)}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={LABEL}>City</label>
                        <select
                          value={editForm.city_id ?? ""}
                          onChange={(e) =>
                            setEditForm((prev) =>
                              prev
                                ? {
                                  ...prev,
                                  city_id: e.target.value,
                                }
                                : null
                            )
                          }
                          disabled={!editForm.state_id || editSaving}
                          className={INPUT}
                        >
                          <option value="">Select City</option>
                          {editCities.map((city) => (
                            <option key={city.id} value={String(city.id)}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={LABEL}>Postal code</label>
                        <input
                          value={editForm.postal_code ?? ''}
                          onChange={e => setEditForm(f => f && ({ ...f, postal_code: e.target.value }))}
                          placeholder="89158"
                          disabled={editSaving}
                          className={INPUT}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={isDeleting || editSaving}
                        className={btn.danger + ' mr-auto'}
                      >
                        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        {isDeleting ? 'Removing…' : 'Remove'}
                      </button>
                      <button
                        onClick={() => { setEditing(null); setEditForm(null); setEditError(null); }}
                        disabled={editSaving}
                        className={btn.outline}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(addr.id)}
                        disabled={editSaving || isDeleting}
                        className={btn.primary}
                      >
                        {editSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editSaving ? 'Saving…' : 'Save changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Add address modal */}
      {showModal && (
        <AddAddressModal
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
