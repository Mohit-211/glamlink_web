import React, { useEffect, useMemo, useState } from "react";
import { GlamCardFormData } from "./GlamCardForm/types";

/* ================= TYPES ================= */

interface Props {
  data: GlamCardFormData;
  sticky?: boolean;
  mode?: "live" | "view";
}

/* ================= REUSABLE SECTION ================= */

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded-lg bg-[#E9EFF6] p-4">
    <p className="mb-2 text-xs font-semibold text-gray-700">{title}</p>
    <div className="rounded-lg bg-white p-4">{children}</div>
  </div>
);

/* ================= HELPERS ================= */

const formatTime = (time: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${m} ${ampm}`;
};

const parseArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return value.split(",").map((v) => v.trim());
  }
  return [];
};

const isFile = (v: any): v is File => v instanceof File;

/* ================= COMPONENT ================= */

const GlamCardLivePreview: React.FC<Props> = ({
  data,
  sticky = false,
  mode = "live",
}) => {
  if (!data) return null;

  const specialtiesArray = parseArray(data.specialties);
  const importantInfoArray = parseArray(data.important_info);

  // ────────────────────────────────────────────────
  // Normalize images → always array of { url: string, ... }
  // ────────────────────────────────────────────────
  const normalizedImages = useMemo(() => {
    const rawImages = data?.images || [];

    return rawImages.map((item: any, index: number) => {
      if (typeof item === "string") {
        return { url: item, sort_order: index };
      }
      return {
        ...item,
        url: item.file_uri || item.url || "",
        sort_order: item.sort_order ?? index,
      };
    });
  }, [data?.images]);

  const galleryMeta = data?.gallery_meta || [];

  const galleryPreviews = useMemo(
    () =>
      mode === "live"
        ? normalizedImages.map((item, idx) =>
            isFile(data?.images?.[idx]) ? URL.createObjectURL(data.images[idx]) : item.url
          )
        : normalizedImages.map((item) => item.url),
    [mode, normalizedImages, data?.images]
  );

  useEffect(() => {
    if (mode !== "live") return;
    return () => {
      galleryPreviews.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [galleryPreviews, mode]);

  /* ================= THUMBNAIL ================= */

  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);

  useEffect(() => {
    if (normalizedImages.length === 0) {
      setThumbnailIndex(null);
      return;
    }

    if (mode === "view") {
      const thumbIdx = normalizedImages.findIndex((img) => img.is_thumbnail === true);
      setThumbnailIndex(thumbIdx !== -1 ? thumbIdx : 0);
      return;
    }

    const metaIndex = galleryMeta.findIndex((g) => g.is_thumbnail);
    if (metaIndex !== -1 && galleryPreviews[metaIndex]) {
      setThumbnailIndex(metaIndex);
    } else {
      setThumbnailIndex(0);
    }
  }, [mode, normalizedImages, galleryMeta, galleryPreviews]);

  const otherIndexes = useMemo(
    () => normalizedImages.map((_, i) => i).filter((i) => i !== thumbnailIndex),
    [normalizedImages, thumbnailIndex]
  );

  /* ================= LOCATION ================= */

  const primaryLocation = useMemo(() => {
    return (
      data.locations?.find((l: any) => l.is_primary === true) ||
      data.locations?.[0]
    );
  }, [data.locations]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLocationId && primaryLocation?.id) {
      setSelectedLocationId(String(primaryLocation.id));
    }
  }, [primaryLocation?.id, selectedLocationId]);

  const selectedLocation = useMemo(() => {
    if (!data.locations?.length) return null;
    return (
      data.locations.find((l: any) => String(l.id) === selectedLocationId) ||
      primaryLocation
    );
  }, [data.locations, selectedLocationId, primaryLocation]);

  /* ================= RENDER ================= */

  return (
    <div className="h-90dvh flex flex-col">
      <div className="rounded-xl border bg-[#F4F7FB] p-4 shadow-md">
        <div className="mb-4 text-center">
          <h2 className="font-serif text-2xl tracking-widest">ACCESS</h2>
          <p className="text-[10px] uppercase text-gray-400">by glamlink</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-4">
            <Section title={`About ${data.name || "Your Name"}`}>
              <div className="flex gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                  {data?.profile_image && (
                    <img
                      src={
                        mode === "live" && isFile(data.profile_image)
                          ? URL.createObjectURL(data.profile_image)
                          : typeof data.profile_image === "string"
                          ? data.profile_image
                          : ""
                      }
                      className="h-full w-full object-cover"
                      alt="Profile"
                    />
                  )}
                </div>

                <div>
                  <p className="font-semibold">{data.name || "Your Name"}</p>
                  <p className="text-sm text-sky-600">
                    {data.professional_title || "Professional Title"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.business_name || "Business Name"}
                  </p>
                </div>
              </div>

              {data.bio && (
                <div
                  className="prose prose-sm mt-3"
                  dangerouslySetInnerHTML={{ __html: data.bio }}
                />
              )}
            </Section>

            {/* FEATURED WORK */}
            <Section title="Featured Work">
              {normalizedImages.length > 0 && thumbnailIndex !== null ? (
                <>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-gray-100">
                    <img
                      src={
                        mode === "live"
                          ? galleryPreviews[thumbnailIndex] || ""
                          : normalizedImages[thumbnailIndex]?.url || ""
                      }
                      className="h-full w-full object-cover"
                      alt="Featured work"
                      onError={(e) => console.error("Failed to load main image", e)}
                    />
                  </div>

                  {otherIndexes.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                      {otherIndexes.slice(0, 4).map((index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setThumbnailIndex(index)}
                          className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border hover:ring-2 hover:ring-pink-500"
                        >
                          <img
                            src={
                              mode === "live"
                                ? galleryPreviews[index] || ""
                                : normalizedImages[index]?.url || ""
                            }
                            className="h-full w-full object-cover"
                            alt={`Thumbnail ${index + 1}`}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.opacity = "0.4";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-xs text-gray-400">
                  Featured work will appear here
                </div>
              )}
            </Section>

            <Section title="Important Info">
              <ul className="text-sm space-y-1">
                {importantInfoArray.length ? (
                  importantInfoArray.map((info, i) => (
                    <li key={i}>• {info}</li>
                  ))
                ) : (
                  <li className="text-gray-400">
                    Important information will appear here
                  </li>
                )}
              </ul>
            </Section>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <Section title="Location">
              {data.locations?.length ? (
                <>
                  {data.locations.length > 1 && (
                    <select
                      className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                      value={selectedLocationId || ""}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                    >
                      {data.locations.map((loc: any) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.label || `Location ${loc.id}`}
                        </option>
                      ))}
                    </select>
                  )}

                  {selectedLocation ? (
                    <div className="space-y-3 text-sm">
                      {selectedLocation.business_name && (
                        <p className="font-semibold">{selectedLocation.business_name}</p>
                      )}

                      <p className="text-gray-700 leading-relaxed">
                        {selectedLocation.location_type === "exact_address"
                          ? selectedLocation.address?.trim() || "Address not provided"
                          : [
                              selectedLocation.city?.trim(),
                              selectedLocation.state?.trim(),
                              selectedLocation.area?.trim(),
                            ]
                              .filter(Boolean)
                              .join(", ") || "Location not fully set"}
                      </p>

                      {selectedLocation.phone && (
                        <p className="text-gray-600">📞 {selectedLocation.phone}</p>
                      )}

                      {selectedLocation.description && (
                        <p className="text-xs text-gray-500 italic">
                          {selectedLocation.description}
                        </p>
                      )}

                      {(() => {
                        let query = "";

                        if (selectedLocation.location_type === "exact_address") {
                          if (selectedLocation.address?.trim()) {
                            query = selectedLocation.address.trim();
                          }
                        } else {
                          const parts = [
                            selectedLocation.city?.trim(),
                            selectedLocation.state?.trim(),
                            selectedLocation.area?.trim(),
                          ].filter(Boolean);
                          if (parts.length) query = parts.join(", ");
                        }

                        if (!query) return null;

                        const zoom = selectedLocation.location_type === "exact_address" ? 15 : 12;
                        const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;

                        return (
                          <div className="mt-4 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <iframe
                              title="Business Location Map"
                              className="w-full h-48 sm:h-64"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              referrerPolicy="no-referrer-when-downgrade"
                              src={mapSrc}
                            />

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              </svg>
                              Get Directions
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No location details available
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Location details will appear here once set
                </p>
              )}
            </Section>

            <Section title="Hours">
              <ul className="space-y-1.5 text-sm">
                {data?.business_hour?.length ? (
                  data.business_hour.map((hour: any) => (
                    <li key={hour.day} className="flex justify-between">
                      <span className="font-medium text-gray-700">{hour.day}</span>
                      <span>
                        {hour.closed
                          ? "Closed"
                          : `${formatTime(hour.open_time)} – ${formatTime(hour.close_time)}`}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Business hours will appear here</li>
                )}
              </ul>
            </Section>

            <Section title="Specialties">
              <ul className="text-sm space-y-1">
                {specialtiesArray.length ? (
                  specialtiesArray.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))
                ) : (
                  <li className="text-gray-400">Your specialties will appear here</li>
                )}
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlamCardLivePreview;