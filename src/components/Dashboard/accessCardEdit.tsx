'use client';

import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { AccessCardData } from './types';

interface Props {
  cardId: string | number; // e.g. 130 — pass this in from the parent (route param, etc.)
  cardData: AccessCardData;
  onSave: (updated: AccessCardData) => void;
  onCancel: () => void;
}

export default function EditAccessCard({ cardId, cardData, onSave, onCancel }: Props) {
  const normalize = (raw: AccessCardData): AccessCardData => {
    let specialties = (raw as any)?.specialties;
    if (typeof specialties === 'string') {
      try {
        specialties = JSON.parse(specialties);
      } catch {
        specialties = [];
      }
    }
    if (!Array.isArray(specialties)) specialties = [];

    let social_media = (raw as any)?.social_media;
    if (typeof social_media === 'string') {
      try {
        social_media = JSON.parse(social_media);
      } catch {
        social_media = {};
      }
    }
    if (!social_media || typeof social_media !== 'object') social_media = {};

    return { ...raw, specialties, social_media };
  };

  // Prefill form state directly from the cardData passed in on open
  const [form, setForm] = useState<AccessCardData>(normalize(cardData));
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof AccessCardData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('GlamlinkaccessToken');

      const formData = new FormData();

      const primitiveFields = [
        'name',
        'professional_title',
        'business_name',
        'bio',
        'email',
        'phone',
        'website',
        'booking_link',
        'custom_handle',
      ] as const;

      primitiveFields.forEach((field) => {
        const value = form[field];
        if (value !== undefined && value !== null) {
          formData.append(field, String(value));
        }
      });

      formData.append('is_phone_visible', String(form.is_phone_visible ?? true));
      formData.append('specialties', JSON.stringify(form.specialties ?? []));
      formData.append('social_media', JSON.stringify(form.social_media ?? {}));

      const res = await fetch(
        `https://node.glamlink.net:5000/api/v1/businessCard/updateBusinessCard/${cardId}`,
        {
          method: 'PUT', // change to 'PATCH' if your backend expects that
          headers: {
            'x-access-token': token || '',
            role_id: String(7),
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update GlamCard');
      }

      const updated = await res.json();
      onSave(updated?.data ?? form);
    } catch (error) {
      console.error('ERROR 👉', error);
      alert('Failed to update Business Card');
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (trimmed && !form.specialties.includes(trimmed)) {
      set('specialties', [...form.specialties, trimmed]);
    }
    setNewSpecialty('');
  };

  const removeSpecialty = (s: string) =>
    set('specialties', form.specialties.filter((x) => x !== s));

  const setSocial = (platform: string, url: string) =>
    set('social_media', { ...form.social_media, [platform]: url });

  const inputCls =
    'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition';

  const labelCls = 'block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Edit Access Card</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Update your public-facing card details</p>
        </div>
        
      </div>

      {/* Grid layout */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* ── Personal Info ── */}
        <div className="card-glamlink space-y-4 !hover:transform-none">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Personal Info</h3>

          <div>
            <label className={labelCls}>Full Name</label>
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
          </div>

          <div>
            <label className={labelCls}>Professional Title</label>
            <input className={inputCls} value={form.professional_title} onChange={(e) => set('professional_title', e.target.value)} placeholder="e.g. Makeup Artist" />
          </div>

          <div>
            <label className={labelCls}>Business Name</label>
            <input className={inputCls} value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="e.g. Glam Studio" />
          </div>

          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              className={`${inputCls} min-h-[120px] resize-y`}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Tell clients about yourself…"
            />
          </div>
        </div>

        {/* ── Contact Info ── */}
        <div className="card-glamlink space-y-4 !hover:transform-none">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Contact Info</h3>

          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
          </div>

          <div>
            <label className={labelCls}>Phone</label>
            <div className="flex gap-2 items-center">
              <input
                className={`${inputCls} flex-1`}
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+1 (000) 000-0000"
              />
              <button
                type="button"
                onClick={() => set('is_phone_visible', !form.is_phone_visible)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                  form.is_phone_visible
                    ? 'bg-accent border-primary/20 text-accent-foreground'
                    : 'border-border text-muted-foreground hover:bg-secondary'
                }`}
                title={form.is_phone_visible ? 'Phone visible' : 'Phone hidden'}
              >
                {form.is_phone_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {form.is_phone_visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>

          <div>
            <label className={labelCls}>Website</label>
            <input className={inputCls} type="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yourwebsite.com" />
          </div>

          <div>
            <label className={labelCls}>Booking Link</label>
            <input className={inputCls} type="url" value={form.booking_link} onChange={(e) => set('booking_link', e.target.value)} placeholder="https://booking-link.com" />
          </div>

          <div>
            <label className={labelCls}>Custom Handle</label>
            <input className={inputCls} value={form.custom_handle} onChange={(e) => set('custom_handle', e.target.value)} placeholder="@yourhandle" />
          </div>
        </div>

        {/* ── Specialties ── */}
        <div className="card-glamlink space-y-4 !hover:transform-none">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Specialties</h3>

          {/* Existing pills */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {(form.specialties ?? []).length === 0 && (
              <p className="text-[12px] text-muted-foreground">No specialties added yet.</p>
            )}
            {(form.specialties ?? []).map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                {s}
                <button onClick={() => removeSpecialty(s)} className="ml-1 hover:text-red-500 transition-colors" aria-label={`Remove ${s}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add new */}
          <div className="flex gap-2">
            <input
              className={`${inputCls} flex-1`}
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
              placeholder="e.g. Red Carpet"
            />
            <button
              onClick={addSpecialty}
              className="flex-shrink-0 flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>

        {/* ── Social Media ── */}
        <div className="card-glamlink space-y-4 !hover:transform-none">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Social Media</h3>

          <div>
            <label className={labelCls}>Instagram URL</label>
            <input
              className={inputCls}
              type="url"
              value={form.social_media.instagram || ''}
              onChange={(e) => setSocial('instagram', e.target.value)}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>

          <div>
            <label className={labelCls}>TikTok URL</label>
            <input
              className={inputCls}
              type="url"
              value={form.social_media.tiktok || ''}
              onChange={(e) => setSocial('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@yourhandle"
            />
          </div>

          <div>
            <label className={labelCls}>Facebook URL</label>
            <input
              className={inputCls}
              type="url"
              value={form.social_media.facebook || ''}
              onChange={(e) => setSocial('facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className={labelCls}>YouTube URL</label>
            <input
              className={inputCls}
              type="url"
              value={form.social_media.youtube || ''}
              onChange={(e) => setSocial('youtube', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-end gap-3">
        <button onClick={onCancel} className="btn-outline !px-5 !py-2.5 !text-sm">Cancel</button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary !px-5 !py-2.5 !text-sm flex items-center gap-2 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}