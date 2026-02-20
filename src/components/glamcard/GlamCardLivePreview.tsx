"use client";

import React, { useMemo } from "react";
import { GlamCardFormData } from "./GlamCardForm/types";

interface Props {
  data: GlamCardFormData;
  mode?: "live" | "view";
}

const GlamCardLivePreview: React.FC<Props> = ({ data, mode = "live" }) => {
  if (!data) return null;

  /* Primary Location */
  const primaryLocation = useMemo(
    () =>
      data.locations?.find((l) => l.isPrimary) ||
      data.locations?.[0],
    [data.locations]
  );

  /* Profile Image */
  const profileSrc = useMemo(() => {
    if (!data.profile_image) return null;
    if (mode === "live" && data.profile_image instanceof File) {
      return URL.createObjectURL(data.profile_image);
    }
    return typeof data.profile_image === "string"
      ? data.profile_image
      : null;
  }, [data.profile_image, mode]);

  /* Gallery */
  const images = useMemo(() => {
    if (!data.images) return [];
    return data.images.map((file: File) =>
      mode === "live"
        ? URL.createObjectURL(file)
        : ""
    );
  }, [data.images, mode]);

  const mainImageSrc = images[0] || null;

  /* Map */
  const mapQuery = useMemo(() => {
    if (!primaryLocation) return "";
    return [
      primaryLocation.area,
      primaryLocation.city,
      primaryLocation.state,
    ]
      .filter(Boolean)
      .join(", ");
  }, [primaryLocation]);

  const mapEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        mapQuery
      )}&z=14&output=embed`
    : "";

  return (
    <div className="styled-digital-business-card bg-gray-50 p-3">
      {/* 1st Backdrop */}
      <div className="bg-white overflow-hidden">
        {/* 2nd Backdrop */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: "4px solid #14b8a6",
            background:
              "linear-gradient(135deg, #f5f7fa 0%, #e5e7eb 100%)",
          }}
        >
          <div className="p-4">

            {/* HEADER (exact spacing) */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-semibold tracking-wide text-gray-900">
                GLAMLINK iD
              </h1>
              <p className="text-sm text-teal-500">
                Digital Card Preview
              </p>
            </div>

            {/* INNER WHITE SHADOW CARD */}
            <div
              className="mt-4 bg-white rounded-xl p-4"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {/* TWO COLUMN GRID */}
              <div className="grid grid-cols-2 gap-6">

                {/* LEFT COLUMN */}
                <div className="space-y-6">

                  {/* ABOUT */}
                  <div className="bg-white rounded-2xl border shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                      About {data.name || "Professional"}
                    </h2>

                    <div className="flex items-center gap-3 mb-4">
                      {profileSrc ? (
                        <img
                          src={profileSrc}
                          className="w-14 h-14 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-200" />
                      )}

                      <div>
                        <p className="font-semibold text-gray-900">
                          {data.name}
                        </p>
                        <p className="text-sm text-teal-600">
                          {data.professional_title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {primaryLocation?.city}
                        </p>
                      </div>
                    </div>

                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html:
                          data.bio ||
                          "Add your bio to preview.",
                      }}
                    />
                  </div>

                  {/* SIGNATURE WORK */}
                  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-700">
                      Signature Work
                    </h2>

                    {mainImageSrc ? (
                      <div className="h-[420px]">
                        <img
                          src={mainImageSrc}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-[420px] flex items-center justify-center bg-gray-100 text-gray-500">
                        Signature preview
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                  {/* MAP */}
                  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                      <h2 className="text-sm font-semibold text-gray-700">
                        Location
                      </h2>
                      <p className="text-sm text-gray-600">
                        {primaryLocation?.city ||
                          "Location not set"}
                      </p>
                    </div>

                    {mapEmbedUrl ? (
                      <div className="h-[220px]">
                        <iframe
                          src={mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="h-[220px] bg-gray-100 flex items-center justify-center text-gray-500">
                        Map preview
                      </div>
                    )}
                  </div>

                  {/* HOURS */}
                  <div className="bg-white rounded-2xl border shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">
                      Business Hours
                    </h2>

                    {data.business_hour?.length ? (
                      data.business_hour.map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm"
                        >
                          <span>{h.day}</span>
                          <span>
                            {h.closed
                              ? "Closed"
                              : `${h.open_time} - ${h.close_time}`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Not set
                      </p>
                    )}
                  </div>

                  {/* SPECIALTIES */}
                  <div className="bg-white rounded-2xl border shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">
                      Specialties
                    </h2>

                    {data.specialties?.length ? (
                      data.specialties.map((s, i) => (
                        <p key={i} className="text-sm">
                          • {s}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        None
                      </p>
                    )}
                  </div>

                  {/* IMPORTANT INFO */}
                  <div className="bg-white rounded-2xl border shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">
                      Important Info
                    </h2>

                    {data.important_info?.length ? (
                      data.important_info.map(
                        (info, i) => (
                          <p
                            key={i}
                            className="text-sm"
                          >
                            • {info}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 text-sm">
                        None
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button className="w-full bg-teal-600 text-white font-semibold py-3 rounded-full shadow hover:bg-teal-700 transition">
                SEND TEXT
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GlamCardLivePreview;