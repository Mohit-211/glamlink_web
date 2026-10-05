'use client';

import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import GlamCardForm from '../glamcard/GlamCardForm/GlamCardForm';
import { AccessCardData } from './types';
import {
  BOOKING_METHODS,
  BookingMethod,
  BusinessHour,
  FeaturedLink,
  GlamCardFormData,
  Location,
} from '../glamcard/GlamCardForm/types';

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
      // GlamCardForm's buildFormData reads meta.file_type to tell existing
      // videos apart from existing images when saving.
      file_type: prev?.file_type ?? img?.file_type,
      caption: prev?.caption ?? img?.caption ?? '',
      is_thumbnail:
        prev?.is_thumbnail ?? Boolean(img?.is_thumbnail) ?? index === 0,
      sort_order: prev?.sort_order ?? img?.sort_order ?? index,
    };
  });
}

/* ================= API -> FORM NORMALIZERS ================= */

/** Many list fields can come back as a JSON string instead of an array/object. */
const parseJson = <T,>(value: any, fallback: T): T => {
  if (typeof value === 'string') {
    try {
      return (JSON.parse(value) ?? fallback) as T;
    } catch {
      return fallback;
    }
  }
  return (value ?? fallback) as T;
};

const toArray = (value: any): any[] => {
  const parsed = parseJson<any>(value, []);
  return Array.isArray(parsed) ? parsed : [];
};

/** Booleans can arrive as true/false, 1/0 or "true"/"false"/"1"/"0". */
const toBool = (value: any, fallback = false): boolean => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'string') return value === 'true' || value === '1';
  return Boolean(value);
};

const toNumberOrUndefined = (value: any): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const bySortOrder = (a: any, b: any) =>
  (toNumberOrUndefined(a?.sort_order) ?? 0) - (toNumberOrUndefined(b?.sort_order) ?? 0);

const toStringList = (value: any): string[] =>
  toArray(value)
    .map((item) =>
      typeof item === 'string' ? item : item?.name ?? item?.title ?? item?.value ?? ''
    )
    .filter((item) => typeof item === 'string' && item.trim() !== '');

/**
 * The form's checkboxes compare against BOOKING_METHODS exactly (note LINK
 * is "GO_tO_BOOKING_LINK"), while the API may return a differently cased
 * value such as "GO_TO_BOOKING_LINK" — match case-insensitively and map back
 * to the form's own constant so the right boxes show as checked.
 */
const normalizeBookingMethods = (value: any): BookingMethod[] => {
  const known = Object.values(BOOKING_METHODS) as BookingMethod[];
  let list = toArray(value);
  // A single bare value like "CALL_TEXT" (not a JSON array string).
  if (!list.length && typeof value === 'string' && value && !value.trim().startsWith('[')) {
    list = [value];
  }
  const result: BookingMethod[] = [];
  list.forEach((item) => {
    const match = known.find((m) => m.toLowerCase() === String(item).toLowerCase());
    if (match && !result.includes(match)) result.push(match);
  });
  return result;
};

/**
 * Locations come back snake_case (is_primary) with numeric ids and possibly
 * string coordinates; the form works with string ids and
 * isPrimary/isOpen/isSet. Saved locations are already confirmed, so they
 * show the ✓ (isSet) and only the primary one starts expanded.
 */
const normalizeLocations = (value: any): Location[] => {
  const list = toArray(value).slice().sort(bySortOrder);
  const hasPrimary = list.some((loc) => toBool(loc?.is_primary ?? loc?.isPrimary));

  return list.map((loc: any, index: number) => {
    // Drop the snake_case flag so it can't go stale against isPrimary on save.
    const { is_primary, isPrimary, ...rest } = loc ?? {};
    const primary = hasPrimary ? toBool(is_primary ?? isPrimary) : index === 0;
    const latitude = toNumberOrUndefined(loc?.latitude);
    const longitude = toNumberOrUndefined(loc?.longitude);
    return {
      ...rest,
      id: String(loc?.id ?? nanoid()),
      label: loc?.label ?? `Location ${index + 1}`,
      location_type: loc?.location_type === 'city_only' ? 'city_only' : 'exact_address',
      address: loc?.address ?? '',
      area: loc?.area ?? '',
      city: loc?.city ?? '',
      state: loc?.state ?? '',
      business_name: loc?.business_name ?? '',
      phone: loc?.phone ?? '',
      description: loc?.description ?? '',
      latitude,
      longitude,
      is_thumbnail: toBool(loc?.is_thumbnail),
      sort_order: toNumberOrUndefined(loc?.sort_order) ?? index,
      isPrimary: primary,
      isOpen: primary,
      isSet: latitude !== undefined && longitude !== undefined,
    } as Location;
  });
};

/**
 * The form edits business hours as free-text notes ({ note }), same as on
 * create. The API can also return structured rows ({ day, open_time,
 * close_time, is_closed }) — fold those into a readable note so nothing
 * shows blank.
 */
const normalizeBusinessHours = (value: any): BusinessHour[] =>
  toArray(value)
    .map((item: any): BusinessHour | null => {
      if (typeof item === 'string') return item.trim() ? { note: item } : null;
      if (item?.note) return { note: String(item.note) };
      if (item?.day) {
        const hours =
          item.open_time && item.close_time
            ? `${item.open_time} - ${item.close_time}`
            : toBool(item.is_closed)
              ? 'Closed'
              : '';
        return { note: [item.day, hours].filter(Boolean).join(': ') };
      }
      return null;
    })
    .filter((item): item is BusinessHour => item !== null);

/**
 * Gallery media stays as the server objects ({ id, file_type, file_uri,
 * thumbnail_uri, ... }) — MediaAndProfileForm renders those directly and
 * GlamCardForm sends them back as existing ids, so nothing has to be
 * re-uploaded. Sorted by sort_order, with url/type/thumbnail aliases added.
 */
const normalizeImages = (value: any): any[] =>
  toArray(value)
    .filter((item) => item && (typeof item === 'string' || item.file_uri || item.url))
    .slice()
    .sort(bySortOrder)
    .map((item: any, index: number) => {
      if (typeof item === 'string') return item;
      return {
        ...item,
        type: item.file_type,
        url: item.file_uri ?? item.url,
        thumbnail: item.thumbnail_uri || null,
        sort_order: toNumberOrUndefined(item.sort_order) ?? index,
      };
    });

const normalizeFeaturedLinks = (value: any): FeaturedLink[] =>
  toArray(value)
    .slice()
    .sort(bySortOrder)
    .map((link: any, index: number) => ({
      ...link,
      // The API doesn't return an id per link (it's positional on the wire) —
      // back one in for React keys / local editing.
      id: link?.id ?? nanoid(),
      title: link?.title ?? '',
      url: link?.url ?? '',
      image: link?.image ?? link?.thumbnail_url ?? link?.image_url ?? undefined,
      sort_order: toNumberOrUndefined(link?.sort_order) ?? index + 1,
      is_featured: toBool(link?.is_featured),
    }));

/**
 * Maps the access-card API response into the GlamCardFormData shape the
 * create form (GlamCardForm) works with, so edit mode renders the exact same
 * fields pre-filled. Text fields that are null stay null — the inputs render
 * them as empty and buildFormData skips them on save.
 */
const normalize = (raw: AccessCardData | null | undefined): GlamCardFormData => {
  const base: any = raw && typeof raw === 'object' ? raw : {};

  const socialRaw = parseJson<any>(base.social_media, {});
  const social_media =
    socialRaw && typeof socialRaw === 'object' && !Array.isArray(socialRaw)
      ? Object.fromEntries(
          Object.entries(socialRaw).map(([key, val]) => [key, val ?? ''])
        )
      : {};

  const images = normalizeImages(base.images);
  // `images` and `gallery_meta` are paired by index in MediaAndProfileForm,
  // so the meta is built from the already-sorted images array.
  const gallery_meta = syncGalleryMeta(images, base.gallery_meta);

  return {
    ...base,
    bio: base.bio ?? '',
    specialties: toStringList(base.specialties),
    social_media,
    other_links: toArray(base.other_links).map((link: any) => ({
      title: link?.title ?? '',
      url: link?.url ?? '',
    })),
    featured_links: normalizeFeaturedLinks(base.featured_links),
    locations: normalizeLocations(base.locations),
    images,
    gallery_meta,
    business_hour: normalizeBusinessHours(base.business_hour),
    preferred_booking_methods: normalizeBookingMethods(
      base.preferred_booking_methods ?? base.preferred_booking_method
    ),
    important_info: toStringList(base.important_info),
    excites_about_glamlink: toStringList(base.excites_about_glamlink),
    biggest_pain_points: toStringList(base.biggest_pain_points),
    is_phone_visible: toBool(base.is_phone_visible, true),
    offer_promotion: toBool(base.offer_promotion),
    elite_setup: toBool(base.elite_setup),
  } as GlamCardFormData;
};

export default function EditAccessCard({ cardId, cardData, onSave, onCancel }: Props) {
  const [data, setData] = useState<GlamCardFormData>(() => normalize(cardData));

  // Re-populate the form whenever a fresh API record arrives (dashboard
  // refetch, or a different card opened) — not only on the first render.
  const lastSource = useRef(cardData);
  useEffect(() => {
    if (lastSource.current === cardData) return;
    lastSource.current = cardData;
    setData(normalize(cardData));
  }, [cardId, cardData]);

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
