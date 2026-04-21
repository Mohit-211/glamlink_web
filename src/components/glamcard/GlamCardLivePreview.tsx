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

/* ================= REUSABLE SECTION BOX ================= */

/**
 * SectionBox — gradient-bordered rounded wrapper
 * titleAlign="left"   → bold left-aligned title (e.g. "About …")
 * titleAlign="center" → title with horizontal rules on each side
 */
const SectionBox: React.FC<{
  title: string;
  titleAlign?: "left" | "center";
  children: React.ReactNode;
}> = ({ title, titleAlign = "left", children }) => (
  <div
    className="rounded-2xl p-[3px]   "
    // style={{ background: "linear-gradient(135deg, #a8edea, #c3cfe2, #a8edea)" }}
  >
    <div
  className="rounded-2xl p-4 h-full"
  style={{
    background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)"
  }}
>
      {titleAlign === "center" ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="flex-1 h-px bg-gray-400/60" />
          <p className="text-sm font-bold tracking-wide text-gray-800 whitespace-nowrap">
            {title}
          </p>
          <span className="flex-1 h-px bg-gray-400/60" />
        </div>
      ) : (
        <p className="mb-3 text-sm font-bold tracking-wide text-gray-800">
          {title}
        </p>
      )}
      <div className="rounded-xl bg-white p-4 shadow-sm">{children}</div>
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

/* ================= TEAL DOT BULLET LIST ================= */

const DotList: React.FC<{ items: string[]; placeholder: string }> = ({
  items,
  placeholder,
}) => (
  <ul className="space-y-1.5 text-sm">
    {items.length ? (
      items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-teal-400 flex-shrink-0" />
          <span className="text-gray-700">{item}</span>
        </li>
      ))
    ) : (
      <li className="text-gray-400 text-xs">{placeholder}</li>
    )}
  </ul>
);

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
  console.log(data, "data");

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const specialtiesArray = parseArray(data.specialties);
  const importantInfoArray = parseArray(data.important_info);

  
  /* ================= DOWNLOAD ================= */

  const handleDownload = async () => {
    console.log("Downloading...");
    setIsDownloadModalOpen(false);
  };

  /* ================= PROFILE IMAGE ================= */

  const profileImageUrl = useMemo(() => {
    if (!data?.profile_image) return "";
    if (mode === "live" && isFile(data.profile_image))
      return URL.createObjectURL(data.profile_image);
    if (typeof data.profile_image === "string") return data.profile_image;
    return "";
  }, [data?.profile_image, mode]);

  useEffect(() => {
    return () => {
      if (profileImageUrl?.startsWith("blob:"))
        URL.revokeObjectURL(profileImageUrl);
    };
  }, [profileImageUrl]);

  /* ================= IMAGE NORMALIZATION ================= */

  const normalizedImages = useMemo(() => {
    const rawImages = data?.images || [];
    return rawImages.map((item: any, index: number) => {
      if (typeof item === "string") return { url: item, sort_order: index };
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

  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(0);

 useEffect(() => {
  if (!normalizedImages.length) {
    setThumbnailIndex(null);
    return;
  }

  // 👉 only set if not already selected
  if (thumbnailIndex === null) {
    const metaIndex = galleryMeta.findIndex((g) => g.is_thumbnail);
    setThumbnailIndex(metaIndex !== -1 ? metaIndex : 0);
  }
}, [normalizedImages, galleryMeta, thumbnailIndex]);

 const otherIndexes = useMemo(
  () => normalizedImages.map((_, i) => i),
  [normalizedImages]
);

  /* ================= LOCATION ================= */

  const primaryLocation = useMemo(
    () =>
      data.locations?.find((l: any) => l.is_primary) || data.locations?.[0],
    [data.locations]
  );

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!selectedLocationId && primaryLocation?.id)
      setSelectedLocationId(String(primaryLocation.id));
  }, [primaryLocation?.id, selectedLocationId]);

  const selectedLocation = useMemo(() => {
    if (!data.locations?.length) return null;
    return (
      data.locations.find(
        (l: any) => String(l.id) === selectedLocationId
      ) || primaryLocation
    );
  }, [data.locations, selectedLocationId, primaryLocation]);

  /* ================= MAP SRC ================= */

  const mapQuery = useMemo(() => {
    if (!selectedLocation) return "";
    if (selectedLocation.location_type === "exact_address")
      return selectedLocation.address?.trim() || "";
    return (
      [
        selectedLocation.city?.trim(),
        selectedLocation.state?.trim(),
        selectedLocation.area?.trim(),
      ]
        .filter(Boolean)
        .join(", ") || ""
    );
  }, [selectedLocation]);

  const mapZoom =
    selectedLocation?.location_type === "exact_address" ? 15 : 12;
  const mapSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        mapQuery
      )}&z=${mapZoom}&output=embed`
    : "";

  /* ================= RENDER ================= */

  return (
    <div className={`${mode !== "download" ? "h-90dvh" : ""} flex flex-col`}>

      {/* ===== OUTER CARD — teal gradient border ===== */}
     <div className="p-4 bg-[#F4F9FF] min-h-screen flex items-center justify-center">
  
  {/* Gradient Border */}
  <div
    className="p-[2px] rounded-2xl"
    style={{
      background:
        "linear-gradient(135deg, #2dd4bf, #a8edea 50%, #2dd4bf)",
    }}
  >
    {/* Inner Card */}
    <div className="rounded-2xl bg-[#F4F9FF] p-6 shadow-sm">
          {/* ===== TOP ACTION BUTTONS (view mode only) ===== */}
          {mode === "view" && (
            <div className="flex justify-end gap-2 mb-3">
              <button
                onClick={onCopyLink}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
              >
                🔗
              </button>
              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
              >
                ⬇️
              </button>
              <button
                onClick={onClose}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
              >
                ✕
              </button>
            </div>
          )}

          {/* ===== LOGO ===== */}
          <div className="mb-6 text-center">
            <div className="flex justify-center items-center">
              <Image src={Logo} alt="access image" width={200} height={200} />
            </div>
          </div>

          {/* ===== TWO COLUMN GRID ===== */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


            {/* ---- LEFT COLUMN ---- */}
            <div className="flex flex-col gap-5">

              {/* ABOUT */}
              <SectionBox
                title={`About ${data.name || "Your Name"}`}
                titleAlign="left"
              >
                <div className="flex gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200 ring-2 ring-white shadow flex-shrink-0">
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
                    <p className="font-bold text-gray-800">
                      {data.name || "Your Name"}
                    </p>
                    <p className="text-sm text-sky-500 font-medium">
                      {data.professional_title || "Professional Title"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.business_name || "Business Name"}
                    </p>
                  </div>
                </div>
                {data.bio && (
                  <div
                    className="prose prose-sm mt-4 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: data.bio }}
                  />
                )}
              </SectionBox>

              {/* SIGNATURE WORK */}
              <SectionBox title="Signature Work" titleAlign="center">
                {normalizedImages.length > 0 && thumbnailIndex !== null ? (
                  <>
                    <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-gray-100 shadow-sm">
                      {normalizedImages[thumbnailIndex]?.file_type ===
                      "video" ? (
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
  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
    {otherIndexes.slice(0, 4).map((index) => (
      <button
        key={index}
        onClick={() => setThumbnailIndex(index)}
        className={`h-14 w-14 overflow-hidden rounded-lg border shadow-sm flex-shrink-0
          ${thumbnailIndex === index ? "ring-2 ring-teal-500" : "hover:ring-2 hover:ring-teal-400"}
        `}
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
              </SectionBox>
            </div>

            {/* ---- RIGHT COLUMN ---- */}
            <div className="flex flex-col gap-5">

              {/* LOCATION + BUSINESS HOURS — SAME GRADIENT BOX */}
              <div
                className="rounded-2xl p-[3px]   "
                // style={{
                //   background:
                //     "linear-gradient(135deg, #a8edea, #c3cfe2, #a8edea)",
                // }}
              >
                <div
  className="rounded-2xl p-4 h-full"
  style={{
    background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)"

  }}
>

                  {/* MAP AREA */}
                  <div>
                    {data.locations?.length ? (
                      <>
                        {data.locations.length > 1 && (
                          <select
                            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                            value={selectedLocationId || ""}
                            onChange={(e) =>
                              setSelectedLocationId(e.target.value)
                            }
                          >
                            {data.locations.map((loc: any) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.label || `Location ${loc.id}`}
                              </option>
                            ))}
                          </select>
                        )}

                        {selectedLocation && (
                          <div className="text-sm mb-3 space-y-1">
                            {selectedLocation.business_name && (
                              <p className="font-semibold text-gray-800">
                                {selectedLocation.business_name}
                              </p>
                            )}
                            <p className="text-gray-600 leading-relaxed">
                              {selectedLocation.location_type ===
                              "exact_address"
                                ? selectedLocation.address?.trim() ||
                                  "Address not provided"
                                : [
                                    selectedLocation.city?.trim(),
                                    selectedLocation.state?.trim(),
                                    selectedLocation.area?.trim(),
                                  ]
                                    .filter(Boolean)
                                    .join(", ") || "Location not fully set"}
                            </p>
                            {selectedLocation.phone && (
                              <p className="text-gray-600">
                                📞 {selectedLocation.phone}
                              </p>
                            )}
                            {selectedLocation.description && (
                              <p className="text-xs text-gray-500 italic">
                                {selectedLocation.description}
                              </p>
                            )}
                          </div>
                        )}

                        {mapSrc ? (
                          <div className="relative rounded-xl overflow-hidden shadow-sm">
                            <iframe
                              title="Business Location Map"
                              className="w-full h-48 sm:h-52"
                              style={{ border: 0, display: "block" }}
                              loading="lazy"
                              allowFullScreen
                              referrerPolicy="no-referrer-when-downgrade"
                              src={mapSrc}
                            />
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                mapQuery
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 text-sm whitespace-nowrap"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              </svg>
                              Get Directions
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Map will appear here once location is set
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        Location details will appear here once set
                      </p>
                    )}
                  </div>

                  {/* BUSINESS HOURS — inside same box */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 mt-3">
                      <span className="flex-1 h-px bg-gray-400/60" />
                      <p className="text-sm font-bold tracking-wide text-gray-800 whitespace-nowrap">
                        Business Hours
                      </p>
                      <span className="flex-1 h-px bg-gray-400/60" />
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <ul className="space-y-1.5 text-sm">
                        {data?.business_hour && data.business_hour.length ? (
                          data.business_hour.map(
                            (hour: any, index: number) => {
                              const open = hour.open_time
                                ? formatTime(hour.open_time)
                                : "Closed";
                              const close = hour.close_time
                                ? formatTime(hour.close_time)
                                : "";
                              const timeText =
                                open && close && open !== "Closed"
                                  ? `${open} - ${close}`
                                  : open;
                              return (
                                <li
                                  key={hour.id ?? index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-teal-400 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    {hour.note ? hour.note : timeText}
                                  </span>
                                </li>
                              );
                            }
                          )
                        ) : (
                          <li className="text-gray-400 text-xs">
                            Business hours will appear here
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>

              {/* SPECIALTIES */}
              <SectionBox title="Specialties" titleAlign="center">
                <div className="flex justify-between items-start gap-4">
                  <DotList
                    items={specialtiesArray}
                    placeholder="Your specialties will appear here"
                  />
                  {/* {data?.qr_code_url && (
                    <img
                      src={data.qr_code_url}
                      alt="QR Code"
                      className="w-16 h-16 rounded-md border border-gray-200 flex-shrink-0"
                    />
                  )} */}
                </div>
              </SectionBox>

            </div>
          </div>

          {/* ===== IMPORTANT INFO — FULL WIDTH ===== */}
          <div
            className="rounded-2xl p-[3px] mt-5 "
            // style={{
            //   background:
            //     "linear-gradient(135deg, #a8edea, #c3cfe2, #a8edea)",
            // }}
          >
            <div
  className="rounded-2xl p-4"
  style={{
    background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)"
  }}
>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex-1 h-px bg-gray-400/60" />
                <p className="text-sm font-bold tracking-wide text-gray-800 whitespace-nowrap">
                  Important Info
                </p>
                <span className="flex-1 h-px bg-gray-400/60" />
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <DotList
                  items={importantInfoArray}
                  placeholder="Important information will appear here"
                />
              </div>
            </div>
          </div>

          {/* ===== CTA BUTTON ===== */}
          {/* <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-[2px] bg-teal-400" />
            <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-2.5 rounded-md text-sm font-bold tracking-widest transition-colors whitespace-nowrap uppercase">
              DM ON INSTAGRAM
            </button>
            <div className="flex-1 h-[2px] bg-teal-400" />
          </div> */}

          {/* ===== SOCIAL ICONS ===== */}
          {/* <div className="flex justify-end gap-2 mt-4">
            <div className="w-9 h-9 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-sm font-bold text-gray-600">
              G
            </div>
            <div className="w-9 h-9 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-base">
              📷
            </div>
            <div className="w-9 h-9 rounded-lg border border-gray-900 bg-gray-900 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
              </svg>
            </div>
          </div> */}

        </div>
      </div>
</div>
      {/* ===== DOWNLOAD MODAL ===== */}
      <GlamCardDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        datadownload={data}
      />
    </div>
  );
};

export default GlamCardLivePreview;