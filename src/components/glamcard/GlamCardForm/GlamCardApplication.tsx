import React, { useEffect, useState } from "react";
import GlamCardLivePreview from "../GlamCardLivePreview";
import { initialGlamCardData } from "../initialGlamCardData";
import GlamCardForm from "./GlamCardForm";
import { GlamCardFormData } from "./types";
import { getFormDataFromSession } from "./Formdatasessionstorage";

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
    name: payload.name ?? "",
    email: payload.email ?? "",
    phone: payload.phone ?? "",
    business_name: payload.business_name ?? "",
    professional_title: payload.professional_title ?? "",
    bio: payload.bio ?? "",
    booking_link: payload.booking_link ?? "",
    offer_promotion: payload.offer_promotion,
    elite_setup: payload.elite_setup === "true",
    primary_specialty: payload.primary_specialty ?? "",
    custom_handle: payload.custom_handle ?? "",
    website: payload.website ?? "",
    promotion_details: payload.promotion_details ?? "",
    is_phone_visible: payload.is_phone_visible !== "false",

    business_hour: parseJson(payload.business_hour) ?? [],
    other_links: parseJson(payload.other_links) ?? [],
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

const GlamCardApplication: React.FC = () => {
  const [data, setData] = useState<GlamCardFormData>({} as GlamCardFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPayload = getFormDataFromSession();

    if (storedPayload) {
      // A saved payload already exists in this session — prefill from it
      // instead of loading the default/demo data.
      const hydrated = hydrateFromSessionPayload(storedPayload);
      setData((prev) => ({ ...prev, ...hydrated } as GlamCardFormData));
      setLoading(false);
      return;
    }

    initialGlamCardData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex gap-8 items-start">
      {/* LEFT — form, sticky, scrollable, height matches preview */}
      <div className="w-1/2 sticky top-0 h-screen overflow-hidden">
        <div className="h-full rounded-xl border bg-white p-6 shadow overflow-y-auto">
          <GlamCardForm data={data} setData={setData} />
        </div>
      </div>

      {/* RIGHT — preview, natural height, scrolls with page */}
      <div className="w-1/2">
        <GlamCardLivePreview data={data} mode="live" />
                     {/* <BusinessCardPage slug={data?.business_card_link.split('/').pop()} mode="view" /> */}

      </div>
    </div>
  );
};

export default GlamCardApplication;