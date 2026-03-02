import React, { useEffect, useMemo, useState } from "react";
import { GlamCardFormData } from "./GlamCardForm/types";
import Logo from "../../../public/assets/ACCESS-3.png";
import Image from "next/image";
import GlamCardDownloadModal from "./Glamcarddownloadmodal";

/* ================= TYPES ================= */

interface Props {
  data: GlamCardFormData;
  sticky?: boolean;
  mode?: "live" | "view" | "download";
  onClose?: () => void;
  onDownload?: () => void;
  onCopyLink?: () => void;
  
}

/* ================= REUSABLE SECTION ================= */

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded-xl bg-[#E9EFF6] p-4 transition hover:shadow-md">
    <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
      {title}
    </p>
    <div className="rounded-xl bg-white p-4 shadow-sm">
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

/* ================= VIDEO PREVIEW ================= */

const VideoPreview: React.FC<{
  video: File | string;
  mode: "live" | "view";
}> = ({ video, mode }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const videoSrc =
    mode === "live" && video instanceof File
      ? URL.createObjectURL(video)
      : typeof video === "string"
      ? video
      : "";

  useEffect(() => {
    return () => {
      if (videoSrc.startsWith("blob:")) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  if (!videoSrc) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-md">
      <video
        ref={videoRef}
        src={videoSrc}
        className="h-full w-full object-cover"
        controls={isPlaying}
      />

      {!isPlaying && (
        <div
          onClick={() => {
            videoRef.current?.play();
            setIsPlaying(true);
          }}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 backdrop-blur-sm transition"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl transition hover:scale-110">
            <svg viewBox="0 0 24 24" fill="black" className="ml-1 h-8 w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENT ================= */

const GlamCardLivePreview: React.FC<Props> = ({
  data,
  sticky = false,
  mode,
  onClose,
  onDownload,
  onCopyLink,
}) => {
  if (!data) return null;
  console.log(data,"data")
   const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const specialtiesArray = parseArray(data.specialties);
  const importantInfoArray = parseArray(data.important_info);

  /* ================= PROFILE IMAGE FIX ================= */
const handleDownload = async () => {
    // Your existing download logic (e.g. html2canvas, jsPDF, API call, etc.)
    console.log("Downloading...");
    setIsDownloadModalOpen(false); // optionally close after download
  };
  const profileImageUrl = useMemo(() => {
    if (!data?.profile_image) return "";
    if (mode === "live" && isFile(data.profile_image)) {
      return URL.createObjectURL(data.profile_image);
    }
    if (typeof data.profile_image === "string") {
      return data.profile_image;
    }
    return "";
  }, [data?.profile_image, mode]);

  useEffect(() => {
    return () => {
      if (profileImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  /* ================= IMAGE NORMALIZATION ================= */

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
            isFile(data?.images?.[idx])
              ? URL.createObjectURL(data.images[idx])
              : item.url
          )
        : normalizedImages.map((item) => item.url),
    [mode, normalizedImages, data?.images]
  );

  useEffect(() => {
    if (mode !== "live") return;
    return () => {
      galleryPreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [galleryPreviews, mode]);

  /* ================= THUMBNAIL ================= */

  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!normalizedImages.length) {
      setThumbnailIndex(null);
      return;
    }

    const metaIndex = galleryMeta.findIndex((g) => g.is_thumbnail);
    setThumbnailIndex(metaIndex !== -1 ? metaIndex : 0);
  }, [normalizedImages, galleryMeta]);

  const otherIndexes = useMemo(
    () => normalizedImages.map((_, i) => i).filter((i) => i !== thumbnailIndex),
    [normalizedImages, thumbnailIndex]
  );

  /* ================= LOCATION ================= */

  const primaryLocation = useMemo(() => {
    return (
      data.locations?.find((l: any) => l.is_primary) ||
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
console.log(data?.business_hour)
console.log(data)

  return (
    <div className={`${mode !== "download" ? "h-90dvh" : ""} flex flex-col`}>
      <div className="rounded-xl border bg-[#F4F7FB] p-4 shadow-md">

        {/* ================= TOP ACTION BUTTONS ================= */}
        {mode==="view"&&(
        <div className="flex justify-end gap-2 mb-3">
          <button onClick={onCopyLink} className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50">
            🔗
          </button>
          <button    onClick={() => setIsDownloadModalOpen(true)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50">
            ⬇️
          </button>
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50">
            ✕
          </button>
        </div>)
}

        {/* ================= LOGO ================= */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center">
            <Image src={Logo} alt="access image" width={200} height={200} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-5">
            <Section title={`About ${data.name || "Your Name"}`}>
              <div className="flex gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200 ring-2 ring-white shadow">
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
                  <p className="font-semibold text-gray-800">
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
                  className="prose prose-sm mt-4"
                  dangerouslySetInnerHTML={{ __html: data.bio }}
                />
              )}
            </Section>

            {/* FEATURED WORK */}
           <Section title="Featured Work">
  {normalizedImages.length > 0 && thumbnailIndex !== null ? (
    <>
      <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-gray-100 shadow-sm">
        {normalizedImages[thumbnailIndex]?.file_type === "video" ? (
          <video
            src={galleryPreviews[thumbnailIndex]}
            className="h-full w-full object-cover"
            controls
          />
        ) : (
          <img
            src={galleryPreviews[thumbnailIndex]}
            className="h-full w-full object-cover transition hover:scale-105 duration-300"
            alt="Featured work"
          />
        )}
      </div>

      {otherIndexes.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {otherIndexes.slice(0, 4).map((index) => (
            <button
              key={index}
              onClick={() => setThumbnailIndex(index)}
              className="h-14 w-14 overflow-hidden rounded-lg border shadow-sm hover:ring-2 hover:ring-pink-400 transition"
            >
              {normalizedImages[index]?.file_type === "video" ? (
                <video
                  src={galleryPreviews[index]}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={galleryPreviews[index]}
                  className="h-full w-full object-cover"
                  alt={`Thumbnail ${index + 1}`}
                />
              )}
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
          <div className="space-y-5">

            {/* ---- LOCATION ---- */}
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

            {/* HOURS  */}
           <Section title="Hours">
 <ul className="space-y-1.5 text-sm">
  {data?.business_hour && data.business_hour.length ? (
    data.business_hour.map((hour: any, index: number) => {
      const open = hour.open_time ? formatTime(hour.open_time) : "Closed";
      const close = hour.close_time ? formatTime(hour.close_time) : "";
      const timeText = open && close && open !== "Closed" ? `${open} - ${close}` : open;
      
      return (
        <li key={hour.id ?? index} className="flex flex-col space-y-1">
          <span className="font-medium text-gray-700">{hour.day}</span>
          <span className="text-gray-500">
            {timeText} {hour.note ? `(${hour.note})` : ""}
          </span>
        </li>
      );
    })
  ) : (
    <li className="text-gray-400">
      Business hours will appear here
    </li>
  )}
</ul>
</Section>

            {/* SPECIALTIES */}
            <Section title="Specialties">
              <ul className="text-sm space-y-1">
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

        {/* SEND TEXT DIVIDER */}
        {/* <div className="flex items-center gap-4 mt-8">
          <div className="flex-1 h-[1px] bg-teal-400"></div>
          <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm font-semibold">
            SEND TEXT
          </button>
          <div className="flex-1 h-[1px] bg-teal-400"></div>
        </div> */}

        {/* SOCIAL */}
        {/* <div className="flex justify-end gap-4 mt-6 text-xl text-teal-600">
          <span></span>
          <span>📷</span>
        </div> */}
        
      </div>
      <GlamCardDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        datadownload={data}     />
    </div>

  );
};

export default GlamCardLivePreview;