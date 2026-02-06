import React, { useEffect, useState } from "react";
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
    <p className="mb-2 text-xs font-semibold text-gray-700">
      {title}
    </p>
    <div className="rounded-lg bg-white p-4">
      {children}
    </div>
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

const parseArray = (
  value: string | string[] | undefined
): string[] => {
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

const GlamCardLivePreview: React.FC<Props> = ({
  data,
  sticky = false,
}) => {
  if (!data) return null;

  const specialtiesArray = parseArray(data.specialties);
  const importantInfoArray = parseArray(data.important_info);

  const gallery_meta: GalleryMetaItem[] = data.gallery_meta || [];

  // ⭐ NEW: local thumbnail state for LIVE PREVIEW
  const [thumbnail, setThumbnail] = useState<GalleryMetaItem | null>(
    null
  );

  // ⭐ NEW: sync thumbnail from gallery
  useEffect(() => {
    const selected =
      gallery_meta.find(g => g.is_thumbnail) || gallery_meta[0];
    setThumbnail(selected || null);
  }, [gallery_meta]);

  const otherImages = gallery_meta.filter(
    g => g.id !== thumbnail?.id
  );

  return (
    <div className={sticky ? "sticky top-6" : ""}>
      <div className="rounded-xl border bg-[#F4F7FB] p-4 shadow-md">
        {/* BRAND */}
        <div className="mb-4 text-center">
          <h2 className="font-serif text-2xl tracking-widest">
            ACCESS
          </h2>
          <p className="text-[10px] uppercase text-gray-400">
            by glamlink
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-4">
            <Section title={`About ${data.name || "Your Name"}`}>
              <div className="flex gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                  {data.profileImage && (
                    <img
                      src={data.profileImage}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <p className="font-semibold">
                    {data.name || "Your Name"}
                  </p>
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
              {gallery_meta.length ? (
                <>
                  {/* MAIN THUMBNAIL */}
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 border">
                    {thumbnail && (
                      <img
                        src={thumbnail.src}
                        className="h-full w-full object-cover"
                        alt="Featured thumbnail"
                      />
                    )}
                  </div>

                  {/* CLICKABLE PREVIEWS */}
                  {otherImages.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {otherImages.slice(0, 4).map(img => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setThumbnail(img)} // ⭐ CLICK → SET THUMBNAIL
                          className="relative h-12 w-12 overflow-hidden rounded-md border hover:ring-2 hover:ring-pink-500"
                        >
                          <img
                            src={img.src}
                            className="h-full w-full object-cover"
                            alt="Featured option"
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
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                Google Map Preview
              </div>
            </Section>

            <Section title="Hours">
              <ul className="space-y-1 text-sm">
                {/* {(data?.business_hour ?? data.business_hours ?? []).map(
                  (hour: any) => (
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
                  )
                )} */}
              </ul>
            </Section>

            <Section title="Specialties">
              <ul className="text-sm">
                {specialtiesArray.length ? (
                  specialtiesArray.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))
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
