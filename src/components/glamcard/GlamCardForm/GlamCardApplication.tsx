import React, { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import GlamCardLivePreview from "../GlamCardLivePreview";
import { initialGlamCardData } from "../initialGlamCardData";
import GlamCardForm from "./GlamCardForm";
import { GlamCardFormData, ProfessionalType } from "./types";
import { getFormDataFromSession } from "./Formdatasessionstorage";
import { getGooglePlaceForm } from "@/api/Api";
import { useSession } from "@/lib/useSession";

/**
 * The real, blank starting point for the form/submission. initialGlamCardData()
 * returns sample/demo content (e.g. "John Doe", a sample bio, sample images) that
 * is meant to make the live preview look populated — it must never be assigned
 * to the actual form state, or it would get submitted as real user data if the
 * user leaves a field untouched.
 */
const emptyGlamCardData: GlamCardFormData = {
  professional_type: "",
  name: "",
  business_name: "",
  professional_title: "",
  email: "",
  phone: "",
  booking_phone: "",
  bio: "",
  is_phone_visible: true,
  custom_handle: "",
  instagram_handle: "",
  website: "",
  primary_specialty: "",
  specialties: [],
  social_media: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
  other_links: [],
  featured_links: [],
  color_code: "",
  preferred_booking_methods: [],
  booking_link: "",
  important_info: [],
  business_hour: [],
  locations: [],
  profile_image: undefined as any,
  images: [],
  gallery_meta: [],
  elite_setup: false,
  excites_about_glamlink: [],
  biggest_pain_points: [],
};

const isEmptyValue = (value: any): boolean => {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && !(value instanceof File)) {
    return Object.values(value).every(isEmptyValue);
  }
  return false;
};

/**
 * Fills only the blank fields of the real form data with sample/demo values,
 * purely so the live preview has something to show. The real `data` state
 * (bound to the form inputs and submitted on save) is never touched by this —
 * as soon as the user types a real value, it takes precedence here too.
 */
const mergeForPreview = (
  data: GlamCardFormData,
  demoData: GlamCardFormData | null,
  keepAsIs: (keyof GlamCardFormData)[] = []
): GlamCardFormData => {
  if (!demoData) return data;
  const merged: any = { ...data };
  (Object.keys(demoData) as (keyof GlamCardFormData)[]).forEach((key) => {
    if (!keepAsIs.includes(key) && isEmptyValue(merged[key])) {
      merged[key] = demoData[key];
    }
  });
  return merged;
};

/**
 * Rebuilds a GlamCardFormData-shaped object from the raw payload saved to
 * sessionStorage (see formDataSessionStorage.ts). Fields that were
 * JSON.stringify'd before being appended to FormData need to be parsed back
 * into arrays/objects. File entries were only saved as {name, size, type}
 * metadata (not actual bytes), so profile_image/images can't be restored —
 * those are left empty and the user will need to re-upload them.
 */
const hydrateFromSessionPayload = (
  payload: Record<string, any>
): Partial<GlamCardFormData> => {
  const parseJson = (value: any) => {
    if (typeof value !== "string") return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  };

  return {
    professional_type: payload.professional_type === "brand" || payload.professional_type === "individual" ? payload.professional_type : "",
    claimed_place_id: payload.claimed_place_id || undefined,
    name: payload.name ?? "",
    email: payload.email ?? "",
    phone: payload.phone ?? "",
    business_name: payload.business_name ?? "",
    professional_title: payload.professional_title ?? "",
    bio: payload.bio ?? "",
    booking_link: payload.booking_link ?? "",
    elite_setup: payload.elite_setup === "true",
    primary_specialty: payload.primary_specialty ?? "",
    custom_handle: payload.custom_handle ?? "",
    website: payload.website ?? "",
    color_code: payload.color_code ?? "",
    is_phone_visible: payload.is_phone_visible !== "false",
    business_hour: parseJson(payload.business_hour) ?? [],
    other_links: parseJson(payload.other_links) ?? [],
    // Thumbnails were Files, so those can't come back (same as profile_image/
    // images below) — title/url/order/is_featured survive; backfill an id
    // for React keys since the wire payload never had one.
    featured_links: (parseJson(payload.featured_links) ?? []).map((link: any) => ({
      ...link,
      id: nanoid(),
    })),
    important_info: parseJson(payload.important_info) ?? [],
    excites_about_glamlink: parseJson(payload.excites_about_glamlink) ?? [],
    biggest_pain_points: parseJson(payload.biggest_pain_points) ?? [],
    specialties: parseJson(payload.specialties) ?? [],
    locations: parseJson(payload.locations) ?? [],
    gallery_meta: parseJson(payload.gallery_meta) ?? [],
    social_media: parseJson(payload.social_media) ?? {},
    preferred_booking_methods: parseJson(payload.preferred_booking_method) ?? [],

    // Files can't be restored from sessionStorage (only metadata was
    // saved) — left blank on purpose; user re-uploads these.
    profile_image: undefined,
    images: [],
  };
};

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * "Claim This Profile" on a Google listing in the directory opens /access?claim=<place id>. The listing's details
 * fill the fields the person hasn't filled, and its place id goes with the card for an admin to verify.
 */
const fromGooglePlace = (prev: GlamCardFormData, place: any): GlamCardFormData => {
  const form = place?.form ?? {};
  const digits = String(form.phone ?? "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  const location = form.locations?.[0];
  return {
    ...prev,
    claimed_place_id: place.place_id,
    business_name: prev.business_name || place.name || "",
    phone: prev.phone || (digits.length === 10 ? digits : ""),
    website: prev.website || form.website || "",
    // The bio editor holds HTML, and the card's bio is at most 80 characters of text
    bio: prev.bio || (form.bio ? `<p>${escapeHtml(String(form.bio).slice(0, 80))}</p>` : ""),
    business_hour: prev.business_hour?.length ? prev.business_hour : (form.business_hours ?? []).slice(0, 14),
    locations: prev.locations?.length || !location?.address
      ? prev.locations
      : [{
          id: nanoid(),
          label: location.label || place.name || "Location 1",
          location_type: "exact_address",
          address: location.address,
          area: "",
          city: location.city || "",
          state: location.state || "",
          phone: "",
          description: "",
          isPrimary: true,
          isOpen: true,
          isSet: true,
        }],
  };
};

const GlamCardApplication: React.FC = () => {
  const [data, setData] = useState<GlamCardFormData>(emptyGlamCardData);
  const [demoData, setDemoData] = useState<GlamCardFormData | null>(null);
  const session = useSession();
  const [claim, setClaim] = useState<{ name: string; claimed: boolean } | null>(null);

  // A signed-in person is a professional or a brand already: start from that
  const accountType = session.user?.professional_type;
  useEffect(() => {
    if (accountType !== "individual" && accountType !== "brand") return;
    setData((prev) => (prev.professional_type ? prev : { ...prev, professional_type: accountType as ProfessionalType }));
  }, [accountType]);

  // Claiming a Google listing (/access?claim=<place id>)
  useEffect(() => {
    const placeId = new URLSearchParams(window.location.search).get("claim");
    if (!placeId) return;
    let cancelled = false;
    getGooglePlaceForm(placeId)
      .then((res) => {
        const place = res?.data;
        if (cancelled || !place?.place_id) return;
        setClaim({ name: place.name, claimed: !!place.claimed });
        if (!place.claimed) setData((prev) => fromGooglePlace(prev, place));
      })
      .catch(() => {
        // The listing can't be read (no Google key, or Google failed): the form still works without it.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const storedPayload = getFormDataFromSession();

    if (storedPayload) {
      // A saved payload already exists in this session — prefill from it
      // instead of starting blank.
      const hydrated = hydrateFromSessionPayload(storedPayload);
      setData((prev) => ({ ...prev, ...hydrated } as GlamCardFormData));
    }

    // Demo/sample content used only to make the live preview look populated —
    // it never touches the real `data` state above.
    initialGlamCardData().then((result) => {
      setDemoData(result);
    });
  }, []);

  // Locations are optional: the preview borrows the demo location (Las Vegas) only until the person
  // adds or removes one. After that it shows exactly their list, so none means no location block.
  const [locationsTouched, setLocationsTouched] = useState(false);
  useEffect(() => {
    if (data.locations !== emptyGlamCardData.locations) setLocationsTouched(true);
  }, [data.locations]);

  const previewData = useMemo(
    () => mergeForPreview(data, demoData, locationsTouched ? ["locations"] : []),
    [data, demoData, locationsTouched]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* FORM — stacked full-width on mobile; sticky side column from lg up */}
      <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <div className="rounded-xl border bg-card p-3 sm:p-6 shadow-soft lg:h-full lg:overflow-y-auto">
          {claim && (
            <div role="status" className="mb-6 rounded-xl border border-primary/20 bg-tint p-4 text-sm">
              {claim.claimed ? (
                <p>
                  <strong>{claim.name}</strong> has already been claimed. You can still create your own profile below.
                </p>
              ) : (
                <p>
                  You&apos;re claiming <strong>{claim.name}</strong> from Google. We filled in what Google knows: check
                  it, add the rest, and create your profile. We verify claims before the Google listing leaves the
                  directory.
                </p>
              )}
            </div>
          )}
          <GlamCardForm data={data} setData={setData} />
        </div>
      </div>

      {/* PREVIEW — natural height, scrolls with page */}
      <div className="w-full lg:w-1/2">
        <GlamCardLivePreview data={previewData} mode="live" />
      </div>
    </div>
  );
};

export default GlamCardApplication;