"use client";

import React, { useMemo } from "react";
import { GlamCardFormData } from "./GlamCardForm/types";

interface Props {
  data: GlamCardFormData;
  mode?: "live" | "view";
}

const GlamCardLivePreview: React.FC<Props> = ({ data, mode = "live" }) => {
  if (!data) return null;

  /* ───────────── Primary Location ───────────── */
  const primaryLocation = useMemo(
    () =>
      data.locations?.find((l) => l.isPrimary === true) || data.locations?.[0],
    [data.locations]
  );

  /* ───────────── Profile Image ───────────── */
  const profileSrc = useMemo(() => {
    if (!data.profile_image) return null;
    if (mode === "live" && data.profile_image instanceof File) {
      return URL.createObjectURL(data.profile_image);
    }
    return typeof data.profile_image === "string" ? data.profile_image : null;
  }, [data.profile_image, mode]);

  /* ───────────── Gallery Images ───────────── */
  const images = useMemo(() => {
    return data.images
      .map((file: File, i: number) => ({
        url: mode === "live" ? URL.createObjectURL(file) : "",
        is_thumbnail: data.gallery_meta?.[i]?.is_thumbnail ?? false,
        order: data.gallery_meta?.[i]?.sort_order ?? i,
      }))
      .sort((a, b) => a.order - b.order);
  }, [data.images, data.gallery_meta, mode]);

  const mainImageSrc = useMemo(() => {
    if (images.length === 0) return null;
    const thumb = images.find((img) => img.is_thumbnail);
    return thumb ? thumb.url : images[0].url;
  }, [images]);

  /* ───────────── Map Query ───────────── */
  const mapQuery = useMemo(() => {
    if (!primaryLocation) return "";
    if (
      primaryLocation.location_type === "exact_address" &&
      primaryLocation.address
    ) {
      return primaryLocation.address;
    }
    const parts = [
      primaryLocation.area,
      primaryLocation.city,
      primaryLocation.state,
    ].filter(Boolean);
    return parts.join(", ");
  }, [primaryLocation]);

  const mapEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        mapQuery
      )}&z=14&output=embed`
    : "";

  return (
    <div className="w-full max-w-[760px] mx-auto bg-white rounded-[28px] overflow-hidden shadow-xl border border-teal-300/40">
      {/* HEADER */}
      <div className="text-center pt-6 pb-4 border-b bg-gradient-to-r from-teal-50 to-cyan-50">
        <h1 className="text-4xl font-semibold tracking-wide text-gray-900">
          ACCESS
        </h1>
        <p className="text-sm text-teal-500 mt-1">by glamlink</p>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-6 bg-gradient-to-b from-white to-teal-50/30">
        {/* ABOUT + MAP */}
        <div className="grid grid-cols-2 gap-6">
          {/* ABOUT */}
          <div className="bg-white rounded-2xl border shadow-sm p-5 h-full">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              About {data.name || "Professional"}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              {profileSrc ? (
                <img
                  src={profileSrc}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200" />
              )}

              <div>
                <p className="font-semibold text-gray-900">
                  {data.name || "Your Name"}
                </p>
                <p className="text-sm text-teal-600">
                  {data.professional_title || "Professional"}
                </p>
                <p className="text-xs text-gray-500">
                  {primaryLocation?.city || ""}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1.5">
              {data.bio ? (
                <div dangerouslySetInnerHTML={{ __html: data.bio }} />
              ) : (
                <>
                  <p>Professional for over 10+ years</p>
                  <p>Located in your city</p>
                  <p>
                    {data.specialties?.join(" | ") || "Services not specified"}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* MAP */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b">
              <h2 className="text-sm font-semibold text-gray-700">Location</h2>
              <p className="text-sm text-gray-600">
                {primaryLocation?.area ||
                  primaryLocation?.city ||
                  "Location not set"}
              </p>
            </div>

            {mapEmbedUrl ? (
              <div className="relative h-[220px]">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="h-[220px] bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                Map preview
              </div>
            )}
          </div>
        </div>

        {/* SIGNATURE + RIGHT STACK */}
        <div className="grid grid-cols-2 gap-6">
          {/* SIGNATURE IMAGE */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden h-full">
            <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-700">
              Signature Work
            </h2>

            {mainImageSrc ? (
              <div className="relative h-[420px]">
                <img
                  src={mainImageSrc}
                  alt="Signature work"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-[420px] flex items-center justify-center bg-gray-100 text-gray-500">
                Signature preview
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5 h-full">
            {/* HOURS */}
            <div className="bg-white rounded-2xl border shadow-sm p-4 flex-1">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Business Hours
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.business_hour?.length ? (
                  data.business_hour.map((h, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{h.day}</span>
                      <span className="font-medium">
                        {h.closed
                          ? "Closed"
                          : `${h.open_time} - ${h.close_time}`}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">Not set</li>
                )}
              </ul>
            </div>

            {/* SPECIALTIES */}
            <div className="bg-white rounded-2xl border shadow-sm p-4 flex-1">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Specialties
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.specialties?.length ? (
                  data.specialties.map((s, i) => <li key={i}>• {s}</li>)
                ) : (
                  <li className="text-gray-500">None</li>
                )}
              </ul>
            </div>

            {/* IMPORTANT INFO */}
            <div className="bg-white rounded-2xl border shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Important Info
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.important_info?.length ? (
                  data.important_info.map((info, i) => (
                    <li key={i}>• {info}</li>
                  ))
                ) : (
                  <li className="text-gray-500">None</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 py-5 px-6 text-center">
        <button className="w-full bg-white text-teal-700 font-semibold py-3 rounded-full shadow hover:shadow-md transition">
          SEND TEXT
        </button>

        <div className="flex justify-center gap-6 mt-4 text-white text-xl">
          <span>g</span>
          <span>📷</span>
        </div>
      </div>
    </div>
  );
};

export default GlamCardLivePreview;
