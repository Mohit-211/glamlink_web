import React, { useEffect, useMemo, useState } from "react";
import { GalleryMetaItem, GlamCardFormData } from "./GlamCardForm/types";

/* ================= TYPES ================= */

interface Props {
  data: GlamCardFormData;
  sticky?: boolean;
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
    return value.split(",").map(v => v.trim());
  }

  return [];
};

/* ================= COMPONENT ================= */

const GlamCardLivePreview: React.FC<Props> = ({ data, sticky = false }) => {
  if (!data) return null;

  const specialtiesArray = parseArray(data.specialties);
  const importantInfoArray = parseArray(data.important_info);

  const galleryMeta = data.gallery_meta || [];
  const images = data.images || [];

  /* ================= IMAGE PREVIEWS ================= */

  const galleryPreviews = useMemo(
    () => images.map(img => URL.createObjectURL(img)),
    [images]
  );

  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [galleryPreviews]);

  /* ================= THUMBNAIL ================= */

  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);

  useEffect(() => {
    const index =
      galleryMeta.findIndex(g => g.is_thumbnail) !== -1
        ? galleryMeta.findIndex(g => g.is_thumbnail)
        : 0;

    setThumbnailIndex(images[index] ? index : null);
  }, [galleryMeta, images]);

  const otherIndexes = galleryPreviews
    .map((_, i) => i)
    .filter(i => i !== thumbnailIndex);
const primaryLocation = useMemo(() => {
  return data.locations?.find(l => l.isPrimary) || data.locations?.[0];
}, [data.locations]);

  return (
    <div className={sticky ? "sticky top-6" : ""}>
      <div className="rounded-xl border bg-[#F4F7FB] p-4 shadow-md">
        {/* BRAND */}
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
                  {data.profile_image && (
                    <img
                      src={URL.createObjectURL(data.profile_image)}
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

            {/* ================= FEATURED WORK ================= */}

            <Section title="Featured Work">
              {galleryPreviews.length ? (
                <>
                  {/* MAIN IMAGE */}
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-gray-100">
                    {thumbnailIndex !== null && (
                      <img
                        src={galleryPreviews[thumbnailIndex]}
                        className="h-full w-full object-cover"
                        alt="Featured"
                      />
                    )}
                  </div>

                  {/* THUMB LIST */}
                  {otherIndexes.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {otherIndexes.slice(0, 4).map(index => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setThumbnailIndex(index)}
                          className="relative h-12 w-12 overflow-hidden rounded-md border hover:ring-2 hover:ring-pink-500"
                        >
                          <img
                            src={galleryPreviews[index]}
                            className="h-full w-full object-cover"
                            alt="Preview"
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
              <ul className="text-sm">
                {importantInfoArray.length ? (
                  importantInfoArray.map((info, i) => <li key={i}>• {info}</li>)
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
              {primaryLocation ? (
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">
                    {primaryLocation.business_name || "Business Name"}
                  </p>

                  <p className="text-gray-600">
                    {primaryLocation.type === "exact"
                      ? primaryLocation.address
                      : `${primaryLocation.city}, ${primaryLocation.state}`}
                  </p>

                  {primaryLocation.phone && (
                    <p className="text-gray-600">📞 {primaryLocation.phone}</p>
                  )}

                  {primaryLocation.description && (
                    <p className="text-xs text-gray-500">
                      {primaryLocation.description}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Business location will appear here
                </p>
              )}
            </Section>


            <Section title="Hours">
              <ul className="space-y-1 text-sm">
                {data?.business_hour?.map((hour: any) => (
                  <li key={hour.day} className="flex justify-between">
                    <span>{hour.day}</span>
                    <span className="font-medium">
                      {hour.closed
                        ? "Closed"
                        : `${formatTime(hour.open_time)} – ${formatTime(
                          hour.close_time
                        )}`}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Specialties">
              <ul className="text-sm">
                {specialtiesArray.length ? (
                  specialtiesArray.map((s, i) => <li key={i}>• {s}</li>)
                ) : (
                  <li className="text-gray-400">
                    Your specialties will appear here
                  </li>
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
