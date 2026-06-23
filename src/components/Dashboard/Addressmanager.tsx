'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import { Address, SAMPLE_ADDRESSES } from './types';

const EMPTY_FORM = { label: '', street: '', city: '', state: '', zip: '', country: '' };

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const inputCls =
    'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition';

  const labelCls = 'block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5';

  const openAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setIsAdding(false);
    setForm({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
    });
  };

  const handleSave = () => {
    if (!form.label || !form.street) return;
    if (isAdding) {
      setAddresses((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form, isDefault: prev.length === 0 },
      ]);
      setIsAdding(false);
    } else if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
      setEditingId(null);
    }
    setForm(EMPTY_FORM);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Addresses</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          disabled={isFormOpen}
          className="btn-primary !px-4 !py-2 !text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add address
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="card-glamlink !hover:transform-none space-y-4 border-primary/30">
          <h3 className="text-sm font-semibold text-foreground">
            {isAdding ? 'New address' : 'Edit address'}
          </h3>

          <div className="grid gap-3">
            <div>
              <label className={labelCls}>Label</label>
              <input className={inputCls} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home, Studio, Office…" />
            </div>
            <div>
              <label className={labelCls}>Street address</label>
              <input className={inputCls} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="123 Main St, Apt 4" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <input className={inputCls} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>ZIP / PIN</label>
                <input className={inputCls} value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="400001" />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input className={inputCls} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="India" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button onClick={handleCancel} className="btn-outline !px-4 !py-2 !text-xs flex items-center gap-1.5">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button onClick={handleSave} className="btn-primary !px-4 !py-2 !text-xs flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Save address
            </button>
          </div>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !isFormOpen ? (
        <div className="card-glamlink !hover:transform-none flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No addresses saved</p>
          <p className="text-xs text-muted-foreground mt-1">Add an address to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
              <div className="flex items-start gap-4 px-5 py-4">
                {/* Icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent mt-0.5">
                  <MapPin className="h-5 w-5 text-accent-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Star className="h-2.5 w-2.5" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.zip}<br />
                    {addr.country}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefault(addr.id)}
                      disabled={isFormOpen}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-primary transition-colors disabled:opacity-40"
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(addr)}
                    disabled={isFormOpen}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(addr.id)}
                    disabled={isFormOpen}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Delete confirm */}
              {deleteConfirm === addr.id && (
                <div className="border-t border-red-100 bg-red-50 px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <p className="text-xs text-red-700 font-medium flex-1">Remove this address permanently?</p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Keep
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}