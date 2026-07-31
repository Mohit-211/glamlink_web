'use client';

import React, { useState } from 'react';
import GlamCardForm from '../glamcard/GlamCardForm/GlamCardForm';
import { AccessCardData } from './types';
import { GlamCardFormData } from '../glamcard/GlamCardForm/types';

interface Props {
  cardId: string | number;
  cardData: AccessCardData | null | undefined;
  onSave: (updated: AccessCardData) => void;
  onCancel: () => void;
}

/**
 * Keeps `gallery_meta` in sync with `images` by id.
 *
 * `images` is the source of truth for WHICH images exist (server objects:
 * { id, file_type, file_uri, thumbnail_uri, is_thumbnail, sort_order, ... }).
 * `gallery_meta` carries UI-only metadata per image (caption, is_thumbnail,
 * sort_order) that the gallery grid renders from.
 *
 * Call this ANY time `images` changes (add, remove, reorder) — including
 * inside upload/remove handlers in the media form — passing the previous
 * `gallery_meta` so existing captions/thumbnail flags are preserved instead
 * of being reset. Without this, `images` and `gallery_meta` can drift apart:
 * e.g. removing an image drops it from `images` but leaves a stale entry in
 * `gallery_meta`, or uploading a new image adds it to `images` but no
 * matching `gallery_meta` entry gets created — either way the gallery loop
 * (which iterates one and looks up the other) ends up rendering fewer
 * images than actually exist.
 */
export function syncGalleryMeta(images: any[], existingMeta: any[] = []) {
  const safeImages = Array.isArray(images) ? images : [];
  const safeMeta = Array.isArray(existingMeta) ? existingMeta : [];
  const metaById = new Map(safeMeta.map((m) => [String(m?.id), m]));

  return safeImages.map((img, index) => {
    const id = String(img?.id ?? `img-${index}`);
    const prev = metaById.get(id);
    return {
      id,
      caption: prev?.caption ?? img?.caption ?? '',
      is_thumbnail:
        prev?.is_thumbnail ?? Boolean(img?.is_thumbnail) ?? index === 0,
      sort_order: prev?.sort_order ?? img?.sort_order ?? index,
    };
  });
}

/**
 * Maps the (smaller) AccessCardData shape you get on the dashboard into the
 * full GlamCardFormData shape GlamCardForm expects, filling in sane defaults
 * for fields AccessCardData doesn't carry (media, locations, booking prefs, etc).
 *
 * NOTE: if your AccessCardData fetch doesn't include profile_image / images /
 * locations / primary_specialty / preferred_booking_methods, the required-field
 * validation in GlamCardForm will block save until those are filled in on the
 * form. You may want to fetch the FULL card record (same shape used on create)
 * before opening edit, rather than the trimmed AccessCardData.
 */
const normalize = (raw: AccessCardData | null | undefined): GlamCardFormData => {
  const base: any = raw && typeof raw === 'object' ? raw : {};

  let specialties = base.specialties;
  if (typeof specialties === 'string') {
    try {
      specialties = JSON.parse(specialties);
    } catch {
      specialties = [];
    }
  }
  if (!Array.isArray(specialties)) specialties = [];

  let social_media = base.social_media;
  if (typeof social_media === 'string') {
    try {
      social_media = JSON.parse(social_media);
    } catch {
      social_media = {};
    }
  }
  if (!social_media || typeof social_media !== 'object') social_media = {};

  let other_links = base.other_links;
  if (typeof other_links === 'string') {
    try {
      other_links = JSON.parse(other_links);
    } catch {
      other_links = [];
    }
  }
  if (!Array.isArray(other_links)) other_links = [];

  // preferred_booking_method(s) can also come back from the API as a JSON
  // string (e.g. '["GO_TO_BOOKING_LINK"]') rather than an actual array —
  // parse it the same way as specialties/social_media/other_links above,
  // instead of just checking Array.isArray (which fails on a raw string).
  let preferred_booking_methods =
    base.preferred_booking_methods ?? base.preferred_booking_method;
  if (typeof preferred_booking_methods === 'string') {
    try {
      preferred_booking_methods = JSON.parse(preferred_booking_methods);
    } catch {
      preferred_booking_methods = [];
    }
  }
  if (!Array.isArray(preferred_booking_methods)) preferred_booking_methods = [];

  // The API returns `images` as an array of server objects but does NOT
  // return a `gallery_meta` field on its own — synthesize/sync it here so
  // the gallery has metadata (caption, is_thumbnail, sort_order) to render,
  // preserving any gallery_meta the API did happen to send.
  const rawImages = Array.isArray(base.images) ? base.images : [];
  const gallery_meta = syncGalleryMeta(rawImages, base.gallery_meta);

  // AccessCardData (the trimmed dashboard shape) doesn't carry these fields —
  // every one of them gets iterated/spread somewhere downstream (locations list,
  // gallery grid, booking-method checkboxes, business-hour rows, etc.), so they
  // MUST default to real arrays/objects here rather than come through as undefined.
  return {
    ...base,
    specialties,
    social_media,
    other_links,
    locations: Array.isArray(base.locations) ? base.locations : [],
    images: rawImages,
    gallery_meta,
    business_hour: Array.isArray(base.business_hour) ? base.business_hour : [],
    preferred_booking_methods,
    important_info: Array.isArray(base.important_info) ? base.important_info : [],
    excites_about_glamlink: Array.isArray(base.excites_about_glamlink)
      ? base.excites_about_glamlink
      : [],
    biggest_pain_points: Array.isArray(base.biggest_pain_points)
      ? base.biggest_pain_points
      : [],
  } as GlamCardFormData;
};

export default function EditAccessCard({ cardId, cardData, onSave, onCancel }: Props) {
  const [data, setData] = useState<GlamCardFormData>(normalize(cardData));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Edit Access Card</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your public-facing card details
        </p>
      </div>

      <GlamCardForm
        data={data}
        setData={setData}
        mode="edit"
        cardId={cardId}
        onCancel={onCancel}
        onSuccess={(result) => onSave(result ?? (data as unknown as AccessCardData))}
      />
    </div>
  );
}