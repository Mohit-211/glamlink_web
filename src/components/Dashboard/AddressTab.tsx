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
const INPUT =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50';
const LABEL = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground';
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
      <div className="w-full overflow-hidden rounded-t-3xl border border-border bg-card duration-200 animate-in slide-in-from-bottom-4 sm:max-w-md sm:rounded-3xl sm:slide-in-from-bottom-0">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Add Delivery Address</p>
              <p className="text-[12px] text-muted-foreground">Used for shipping physical orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary"
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
            className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex flex-1 items-center justify-center gap-2 !rounded-xl !py-2.5 !text-sm disabled:opacity-60"
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
    <div className="max-w-lg">
      {/* Header row with + button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Saved Addresses</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {loading ? 'Loading…' : `${addresses.length} address${addresses.length !== 1 ? 'es' : ''} saved`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-1.5 !rounded-full !px-4 !py-2.5 !text-sm"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {/* Fetch error */}
      {fetchError && (
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{fetchError}</span>
          <button onClick={fetchAddresses} className="ml-auto text-xs font-semibold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}
      {/* Delete error (surfaced at list level since delete can be triggered from any card) */}
      {deleteError && (
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="ml-auto text-xs font-semibold underline underline-offset-2">
            Dismiss
          </button>
        </div>
      )}
      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse rounded-3xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-secondary" />
                <div className="h-4 w-40 rounded bg-secondary" />
              </div>
              <div className="mb-2 ml-[52px] h-3 w-3/4 rounded bg-secondary" />
              <div className="ml-[52px] h-3 w-1/2 rounded bg-secondary" />
            </div>
          ))}
        </div>
      )}
      {/* Empty state */}
      {!loading && !fetchError && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/20 py-14 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <MapPin className="h-6 w-6 text-primary" />
          </span>
          <p className="text-sm font-semibold text-foreground">No addresses saved yet</p>
          <p className="mb-5 mt-1 text-xs text-muted-foreground">
            Add a delivery address for your keychain orders.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 !rounded-full !px-5 !py-2.5 !text-sm"
          >
            <Plus className="h-4 w-4" /> Add your first address
          </button>
        </div>
      )}
      {/* Address cards */}
      {!loading && addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map(addr => {
            const isEditing = editing === addr.id;
            const isDeleting = deletingId === addr.id;
            return (
              <div
                key={addr.id}
                className={`overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-soft)] transition-all ${addr.is_default ? 'border-primary/60 ring-1 ring-primary/20' : 'border-border'
                  }`}
              >
                {/* Summary */}
                <div className="flex items-start gap-3.5 p-5">
                  <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${addr.is_default ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'
                      }`}
                  >
                    <Home className="h-4.5 w-4.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{addr.address_line_1}</p>
                      {addr.is_default && (
                        <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <CheckCircle2 className="h-3 w-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {addr?.user_city?.name || addr.city_name}, {addr?.user_state?.name || addr.state_name} · {addr.postal_code}
                    </p>
                    {(addr.address_lat || addr.address_long) && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                        {addr.address_lat}, {addr.address_long}
                      </p>
                    )}
                  </div>

                  {/* Quick actions — icon buttons, both available without opening edit mode first */}
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <button
                      onClick={() =>
                        isEditing
                          ? (setEditing(null), setEditForm(null), setEditError(null))
                          : openEdit(addr)
                      }
                      disabled={isDeleting}
                      aria-label={isEditing ? 'Close edit form' : 'Edit address'}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition disabled:opacity-50 ${isEditing ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent hover:text-primary'
                        }`}
                    >
                      {isEditing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={isDeleting || (editSaving && isEditing)}
                      aria-label="Delete address"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Inline edit */}
                {isEditing && editForm && (
                  <div className="space-y-3.5 border-t border-border bg-secondary/20 px-5 pb-5 pt-4">
                    {editError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {editError}
                      </p>
                    )}
                    <div>
                      <label className={LABEL}>Address Line 1</label>
                      <input
                        value={editForm.address_line_1 ?? ''}
                        onChange={e => setEditForm(f => f && ({ ...f, address_line_1: e.target.value }))}
                        placeholder="Address Line 1"
                        disabled={editSaving}
                        className={INPUT}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>
                    <div>
                      <label className={LABEL}>Postal Code</label>
                      <input
                        value={editForm.postal_code ?? ''}
                        onChange={e => setEditForm(f => f && ({ ...f, postal_code: e.target.value }))}
                        placeholder="89158"
                        disabled={editSaving}
                        className={INPUT}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSaveEdit(addr.id)}
                        disabled={editSaving || isDeleting}
                        className="btn-primary flex flex-1 items-center justify-center gap-1.5 !rounded-xl !py-2.5 !text-xs disabled:opacity-60"
                      >
                        {editSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                        {editSaving ? 'Saving…' : 'Save changes'}
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={isDeleting || editSaving}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        {isDeleting ? 'Removing…' : 'Remove'}
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