'use client';
import { useState, useEffect, useCallback } from 'react';
import { Home, Briefcase, Plus, Trash2, Loader2, AlertCircle, X, MapPin } from 'lucide-react';
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
  'w-full rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition disabled:opacity-50';
/* ══════════════════════════════════════════════
   ADD ADDRESS MODAL
══════════════════════════════════════════════ */
interface AddAddressModalProps {
  onClose: () => void;
  onSaved: () => void;
}
function AddAddressModal({ onClose, onSaved }: AddAddressModalProps) {
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/25 backdrop-blur-sm"
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent">
              <MapPin className="h-4 w-4 text-primary" />
            </span>
            <p className="text-sm font-bold text-foreground">Add Delivery Address</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Form body */}
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
          {/* Address Line 1 */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
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
          {/* State ID / City ID — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
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
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                City<span className="text-red-500">*</span>
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
          {/* Postal code */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              value={form.postal_code}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  postal_code: e.target.value.replace(/\D/g, "").slice(0, 6),
                }))
              }
              placeholder="Enter 6 digit PIN code"
              inputMode="numeric"
              maxLength={6}
              disabled={saving}
              className={INPUT}
            />
          </div>
        </div>
        {/* Footer actions */}
        <div className="flex gap-3 px-5 pb-5 pt-2 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save Address'}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-full border border-border bg-secondary py-3 text-sm font-semibold text-foreground hover:bg-accent transition disabled:opacity-60"
          >
            Cancel
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Saved Addresses</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? 'Loading…' : `${addresses.length} address${addresses.length !== 1 ? 'es' : ''} saved`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {/* Fetch error */}
      {fetchError && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 mb-5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{fetchError}</span>
          <button onClick={fetchAddresses} className="ml-auto text-xs font-semibold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}
      {/* Delete error (surfaced at list level since delete can be triggered from any card) */}
      {deleteError && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 mb-5 text-sm text-red-700">
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
            <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-xl bg-secondary" />
                <div className="h-4 w-40 rounded bg-secondary" />
              </div>
              <div className="h-3 w-3/4 rounded bg-secondary mb-2 ml-10" />
              <div className="h-3 w-1/2 rounded bg-secondary ml-10" />
            </div>
          ))}
        </div>
      )}
      {/* Empty state */}
      {!loading && !fetchError && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent mb-4">
            <MapPin className="h-6 w-6 text-primary" />
          </span>
          <p className="text-sm font-semibold text-foreground">No addresses saved yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-5">
            Add a delivery address for your keychain orders.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
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
                className={`rounded-2xl border-2 bg-card shadow-[var(--shadow-soft)] overflow-hidden transition-all ${addr.is_default ? 'border-primary' : 'border-border'
                  }`}
              >
                {/* Summary */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-primary">
                        <Home className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{addr.address_line_1}</p>
                        {addr.is_default && (
                          <span className="text-[10px] font-semibold text-primary">Default address</span>
                        )}
                      </div>
                    </div>
                    {/* Quick actions — Edit + Delete, both available without opening edit mode first */}
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <button
                        onClick={() =>
                          isEditing
                            ? (setEditing(null), setEditForm(null), setEditError(null))
                            : openEdit(addr)
                        }
                        disabled={isDeleting}
                        className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition disabled:opacity-50"
                      >
                        {isEditing ? 'Close' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={isDeleting || (editSaving && isEditing)}
                        aria-label="Delete address"
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline underline-offset-2 transition disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        {isDeleting ? 'Removing…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pl-10">
                    {addr?.user_city?.name || addr.city_name}, {addr?.user_state?.name || addr.state_name} · {addr.postal_code}
                  </p>
                  {(addr.address_lat || addr.address_long) && (
                    <p className="text-xs text-muted-foreground/60 pl-10 mt-0.5">
                      {addr.address_lat}, {addr.address_long}
                    </p>
                  )}
                </div>
                {/* Inline edit */}
                {isEditing && editForm && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border pt-4 bg-secondary/20">
                    {editError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {editError}
                      </p>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Address Line 1</label>
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
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                          State
                        </label>
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
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                          City
                        </label>
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
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Postal Code</label>
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
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
                      >
                        {editSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                        {editSaving ? 'Saving…' : 'Save changes'}
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={isDeleting || editSaving}
                        className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-60"
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