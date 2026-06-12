import React, { useEffect, useMemo, useState } from "react";
import { GlamCardFormData } from "./GlamCardForm/types";
import Logo from "../../../public/assets/ACCESS-3.png";
import Image from "next/image";
import {
  Instagram,
  Globe,
  Linkedin,
  Youtube,
  Facebook,
  Music2,
  ExternalLink,
  Download,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import GlamCardDownloadModal from "./Glamcarddownloadmodal";

/* ================= VCF GENERATOR ================= */
export function generateVCF(data: GlamCardFormData) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.name || ""};;;;`,
    `FN:${data.name || ""}`,
    `ORG:${data.business_name || ""}`,
    `TITLE:${data.professional_title || ""}`,
    `TEL;TYPE=CELL:${data.phone || ""}`,
    `EMAIL:${data.email || ""}`,
    `URL:${data.website || ""}`,
    "END:VCARD",
  ].join("\r\n");
}
function downloadVCF(data: GlamCardFormData) {
  console.log(data, "data")
  const vcf = generateVCF(data);
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.name || "contact").replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
const SectionBox: React.FC<{
  title: string;
  titleAlign?: "left" | "center";
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, titleAlign = "left", icon, children }) => (
  <div className="rounded-2xl p-[2px]" style={{ background: "linear-gradient(135deg, #23B9CD33, #a8edea55)" }}>
    <div
      className="rounded-2xl p-3 sm:p-4 h-full"
      style={{ background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)" }}
    >
      {titleAlign === "center" ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="flex-1 h-px bg-gray-400/60" />
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-[#23B9CD]">{icon}</span>}
            <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">
              {title}
            </p>
          </div>
          <span className="flex-1 h-px bg-gray-400/60" />
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-3">
          {icon && <span className="text-[#23B9CD]">{icon}</span>}
          <p className="text-xs font-bold tracking-wider text-gray-700 uppercase">{title}</p>
        </div>
      )}
      <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm">{children}</div>
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
const DotList: React.FC<{ items: any[]; placeholder: string }> = ({ items, placeholder }) => (
  <ul className="space-y-2 text-sm">
    {items.length ? (
      items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-[#23B9CD] flex-shrink-0" />
          <span className="text-gray-700 leading-snug">
            {typeof item === "string" ? item : item?.note || item?.text || ""}
          </span>
        </li>
      ))
    ) : (
      <li className="text-gray-400 text-xs italic">{placeholder}</li>
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

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(0);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const specialtiesArray = parseArray(data.specialties);
  console.log(specialtiesArray, "specialtiesArray")
  const importantInfoArray = parseArray(data.important_info);

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
      if (profileImageUrl?.startsWith("blob:")) URL.revokeObjectURL(profileImageUrl);
    };
  }, [profileImageUrl]);

  /* ================= IMAGE NORMALIZATION ================= */
  const normalizedImages = useMemo(() => {
    const rawImages = data?.images || [];
    return rawImages.map((item: any, index: number) => {
      if (typeof item === "string")
        return { url: item, file_type: "image", thumbnail_uri: "", sort_order: index };
      const fileType =
        item.file_type ||
        (item instanceof File && item.type.startsWith("video/") ? "video" : "image");
      const resolvedFileType =
        fileType === "image" &&
          (item.file_uri || item.url || "").match(/\.(mp4|mov|webm|avi|mkv)$/i)
          ? "video"
          : fileType;
      return {
        ...item,
        url: item.file_uri || item.url || "",
        thumbnail_uri: item.thumbnail_uri || "",
        file_type: resolvedFileType,
        sort_order: item.sort_order ?? index,
      };
    });
  }, [data?.images]);

  /* ================= DEDUPLICATE ================= */
  const deduplicatedImages = useMemo(() => {
    const properVideoUrls = new Set(
      normalizedImages
        .filter((img) => img.file_type === "video" && img.thumbnail_uri)
        .map((img) => img.url)
    );
    return normalizedImages.filter(
      (img) =>
        !(img.file_type === "video" && !img.thumbnail_uri && properVideoUrls.has(img.url))
    );
  }, [normalizedImages]);

  const galleryMeta = data?.gallery_meta || [];

  /* ================= GALLERY PREVIEWS ================= */
  const galleryPreviews = useMemo(
    () =>
      mode === "live"
        ? normalizedImages.map((item, idx) => {
          const raw = data?.images?.[idx];
          return isFile(raw) ? URL.createObjectURL(raw) : item.url;
        })
        : normalizedImages.map((item) => item.url),
    [mode, normalizedImages, data?.images]
  );

  /* ================= THUMBNAIL PREVIEWS ================= */
  const thumbnailPreviews = useMemo(
    () =>
      normalizedImages.map((item, idx) => {
        const meta = galleryMeta[idx];
        if (item.file_type === "video") {
          if (meta?.thumbnail_file instanceof File)
            return URL.createObjectURL(meta.thumbnail_file);
          if (item.thumbnail_uri) return item.thumbnail_uri;
        }
        return item.thumbnail_uri || galleryPreviews[idx];
      }),
    [normalizedImages, galleryMeta, galleryPreviews]
  );

  useEffect(() => {
    if (mode !== "live") return;
    return () => {
      galleryPreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      thumbnailPreviews.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [galleryPreviews, thumbnailPreviews, mode]);

  /* ================= THUMBNAIL INDEX ================= */
  useEffect(() => {
    if (!normalizedImages.length) {
      setThumbnailIndex(null);
      return;
    }
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
    () => data.locations?.find((l: any) => l.is_primary) || data.locations?.[0],
    [data.locations]
  );

  useEffect(() => {
    if (!selectedLocationId && primaryLocation?.id)
      setSelectedLocationId(String(primaryLocation.id));
  }, [primaryLocation?.id, selectedLocationId]);

  const selectedLocation = useMemo(() => {
    if (!data.locations?.length) return null;
    return (
      data.locations.find((l: any) => String(l.id) === selectedLocationId) ||
      primaryLocation
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

  const mapZoom = selectedLocation?.location_type === "exact_address" ? 15 : 12;
  const mapSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${mapZoom}&output=embed`
    : "";

  /* ================= SOCIAL MEDIA ================= */
  const socialMedia = useMemo(() => {
    if (!data?.social_media) return {};
    if (typeof data.social_media === "string") {
      try { return JSON.parse(data.social_media); } catch { return {}; }
    }
    return data.social_media;
  }, [data.social_media]);

  /* ================= ALL INSTAGRAM HANDLES ================= */
  const allInstagramHandles = useMemo(() => {
    const handles: { key: string; url: string }[] = [];
    if (socialMedia?.instagram) handles.push({ key: "instagram", url: socialMedia.instagram });
    let i = 1;
    while (socialMedia?.[`instagram${i}`]) {
      handles.push({ key: `instagram${i}`, url: socialMedia[`instagram${i}`] });
      i++;
    }
    return handles;
  }, [socialMedia]);

  /* ================= OTHER LINKS ================= */
  const otherLinks = useMemo(() => {
    if (!data?.other_links) return [];
    if (typeof data.other_links === "string") {
      try { return JSON.parse(data.other_links); } catch { return []; }
    }
    return Array.isArray(data.other_links) ? data.other_links : [];
  }, [data.other_links]);

  /* ================= PREFERRED BOOKING METHODS ================= */
  const preferredBookingMethods = useMemo(() => {
    const val = (data as any)?.preferred_booking_method;
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : val.split(",").map((v) => v.trim());
      } catch {
        return val.split(",").map((v) => v.trim());
      }
    }
    return [];
  }, [(data as any)?.preferred_booking_method]);

  const handleCopyLink = async () => {
    const link = data?.business_card_qr;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  /* ================= SOCIAL ICONS LIST ================= */
  const hasSocials =
    data?.website ||
    allInstagramHandles.length > 0 ||
    socialMedia?.facebook ||
    socialMedia?.linkedin ||
    socialMedia?.youtube ||
    socialMedia?.tiktok;

  /* ================= RENDER ================= */
  console.log(selectedLocation, "selectedLocation")
  return (
    <div className={`${mode !== "download" ? "min-h-screen" : ""} flex flex-col bg-[#F0F7FF]`}>

      {/* ===== MOBILE STICKY TOP BAR (view mode) ===== */}
      {mode === "view" && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm lg:hidden">
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="access" width={90} height={28} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadVCF(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#23B9CD] text-white text-xs font-semibold shadow transition active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                <polyline points="9 21 9 13 15 13 15 21" />
              </svg>
              Save
            </button>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-[#23B9CD]/10 text-[#23B9CD] transition active:scale-95"
            >
              <QrCode size={15} strokeWidth={2.5} />
            </button>
            {/* <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-[#23B9CD]/10 text-[#23B9CD] transition active:scale-95"
            >
              <Download size={15} strokeWidth={2.5} />
            </button> */}
          </div>
        </div>
      )}

      <div className="px-3 py-4 sm:px-5 sm:py-6 lg:p-6 flex flex-col items-center">
        <div
          className="w-full max-w-lg lg:max-w-3xl p-[2px] rounded-2xl"
          style={{ background: "linear-gradient(135deg, #23B9CD, #a8edea 50%, #23B9CD)" }}
        >
          <div className="rounded-2xl bg-[#F4F9FF] p-4 sm:p-6 shadow-sm">

            {/* ===== LOGO (desktop / non-view) ===== */}
            <div className={`mb-5 text-center ${mode === "view" ? "hidden lg:flex justify-center" : "flex justify-center"}`}>
              <Image src={Logo} alt="access image" width={160} height={160} />
            </div>

            {/* ===== DESKTOP TOP ACTIONS ===== */}
            {mode === "view" && (
              <div className="hidden lg:flex justify-end gap-2 mb-3">
                <button
                  onClick={() => downloadVCF(data)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#23B9CD] hover:bg-[#1ea8b5] text-white text-sm font-medium shadow-md transition-colors whitespace-nowrap"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="9 21 9 13 15 13 15 21" />
                    <polyline points="9 7 12 7" />
                  </svg>
                  Save Contact
                </button>
                <button onClick={() => setIsQrModalOpen(true)} className="h-10 w-10 flex items-center justify-center rounded-full bg-[#23B9CD] text-white shadow-lg hover:bg-[#1ea8b5] transition-all duration-200">
                  <QrCode size={18} strokeWidth={2.5} />
                </button>
                {/* <button onClick={() => setIsDownloadModalOpen(true)} className="h-10 w-10 flex items-center justify-center rounded-full bg-[#23B9CD] text-white shadow-lg hover:bg-[#1ea8b5] transition-all duration-200">
                  <Download size={18} strokeWidth={2.5} />
                </button> */}
              </div>
            )}

            {/* ===== MOBILE HERO: PROFILE CARD ===== */}
            <div className="lg:hidden mb-4">
              <div
                className="relative rounded-2xl overflow-hidden shadow-md"
                style={{ background: "linear-gradient(135deg, #23B9CD 0%, #0e8fa0 100%)" }}
              >
                {/* bg pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white translate-x-8 -translate-y-8" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white -translate-x-6 translate-y-6" />
                </div>

                <div className="relative flex items-center gap-4 p-4">
                  {/* avatar */}
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white/20 border-2 border-white shadow-lg flex-shrink-0">
                    {data?.profile_image ? (
                      <img
                        src={
                          mode === "live" && isFile(data.profile_image)
                            ? URL.createObjectURL(data.profile_image)
                            : typeof data.profile_image === "string"
                              ? data.profile_image
                              : ""
                        }
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {(data.name || "?")[0]}
                      </div>
                    )}
                  </div>
                  {/* info */}
                  <div className="flex-1 min-w-0 text-white">
                    <p className="font-bold text-white text-lg leading-tight truncate">
                      {data.name || "Your Name"}
                    </p>
                    <p className="text-white/90 text-sm font-medium mt-0.5 truncate">
                      {data.professional_title || "Professional Title"}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5 truncate">
                      {data.business_name || "Business Name"}
                    </p>

                    {/* quick social row */}
                    {/* {hasSocials && (
                      <div className="flex items-center gap-2 mt-2">
                        {data?.website && (
                          <a href={data.website} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <Globe className="w-3.5 h-3.5 text-white" />
                          </a>
                        )}
                        {allInstagramHandles[0] && (
                          <a href={allInstagramHandles[0].url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <Instagram className="w-3.5 h-3.5 text-white" />
                          </a>
                        )}
                        {socialMedia?.facebook && (
                          <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <Facebook className="w-3.5 h-3.5 text-white" />
                          </a>
                        )}
                        {socialMedia?.youtube && (
                          <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <Youtube className="w-3.5 h-3.5 text-white" />
                          </a>
                        )}
                        {socialMedia?.tiktok && (
                          <a href={socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <Music2 className="w-3.5 h-3.5 text-white" />
                          </a>
                        )}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== DESKTOP / TABLET TWO-COL ===== */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-5">
              {/* ---- LEFT COLUMN ---- */}
              <div className="flex flex-col gap-5">
                {/* ABOUT */}
                <SectionBox title={`About ${data.name || "Your Name"}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-28 w-28 overflow-hidden rounded-full bg-gray-200 ring-2 ring-white shadow flex items-center justify-center">
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
                    <div className="mt-3">
                      <p className="font-bold text-gray-800">{data.name || "Your Name"}</p>
                      <p className="text-sm text-[#24bbcb] font-medium">{data.professional_title || "Professional Title"}</p>
                      <p className="text-xs text-gray-500">{data.business_name || "Business Name"}</p>
                    </div>
                  </div>
                  {data.bio && (
                    <div className="prose prose-sm mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: data.bio }} />
                  )}
                </SectionBox>

                {/* SIGNATURE WORK */}
                <SectionBox title="Signature Work" titleAlign="center">
                  {normalizedImages.length > 0 && thumbnailIndex !== null ? (
                    <>
                      <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-gray-100 shadow-sm">
                        {normalizedImages[thumbnailIndex]?.file_type === "video" ? (
                          <video src={galleryPreviews[thumbnailIndex]} poster={thumbnailPreviews[thumbnailIndex]} className="h-full w-full object-cover" controls />
                        ) : (
                          <img src={normalizedImages[thumbnailIndex]?.thumbnail_uri || galleryPreviews[thumbnailIndex]} className="h-full w-full object-cover transition hover:scale-105 duration-300" alt="Featured work" />
                        )}
                      </div>
                      {otherIndexes.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto p-1">
                          {otherIndexes?.map((index) => (
                            <button key={index} onClick={() => setThumbnailIndex(index)} className={`relative h-14 w-14 overflow-hidden rounded-lg border shadow-sm flex-shrink-0 ${thumbnailIndex === index ? "ring-2 ring-teal-500" : "hover:ring-2 hover:ring-teal-400"}`}>
                              <img src={thumbnailPreviews[index]} className="h-full w-full object-cover" alt={`Thumbnail ${index + 1}`} />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center text-xs text-gray-400">Featured work will appear here</div>
                  )}
                </SectionBox>
              </div>

              {/* ---- RIGHT COLUMN ---- */}
              <div className="flex flex-col gap-5">
                {/* LOCATION + HOURS desktop */}
                <div className="rounded-2xl p-[2px]" style={{ background: "linear-gradient(135deg, #23B9CD33, #a8edea55)" }}>
                  <div className="rounded-2xl p-4 h-full" style={{ background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)" }}>
                    {data.locations?.length ? (
                      <>
                        {data.locations.length > 1 && (
                          <select className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" value={selectedLocationId || ""} onChange={(e) => setSelectedLocationId(e.target.value)}>
                            {data.locations.map((loc: any) => (
                              <option key={loc.id} value={loc.id}>{loc.label || `Location ${loc.id}`}</option>
                            ))}
                          </select>
                        )}
                        {selectedLocation && (
                          <div className="text-sm mb-3 space-y-1">
                            {selectedLocation.business_name && <p className="font-semibold text-gray-800">{selectedLocation.business_name}</p>}
                            <p className="text-gray-600 leading-relaxed">
                              {selectedLocation.location_type === "exact_address"
                                ? selectedLocation.address?.trim() || "Address not provided"
                                : [selectedLocation.city?.trim(), selectedLocation.state?.trim(), selectedLocation.area?.trim()].filter(Boolean).join(", ") || "Location not fully set"}
                            </p>
                            {(selectedLocation?.phone || data.phone) && data.is_phone_visible && (
  <p className="text-gray-600">📞 {selectedLocation.phone || data.phone}</p>
)}
                            {selectedLocation.description && <p className="text-xs text-gray-500 italic">{selectedLocation.description}</p>}
                          </div>
                        )}
                        {mapSrc ? (
                          <div className="relative rounded-xl overflow-hidden shadow-sm">
                            <iframe title="Business Location Map" className="w-full h-48 sm:h-52" style={{ border: 0, display: "block" }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={mapSrc} />
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 text-sm whitespace-nowrap">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                              Get Directions
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Map will appear here once location is set</p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Location details will appear here once set</p>
                    )}

                    {/* BUSINESS HOURS desktop */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 mt-3">
                        <span className="flex-1 h-px bg-gray-400/60" />
                        <p className="text-sm font-bold tracking-wide text-gray-800 whitespace-nowrap">Business Hours</p>
                        <span className="flex-1 h-px bg-gray-400/60" />
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        {data.business_hour.length !== 0 ? (
                          <ul className="space-y-1.5 text-sm">
                            {data.business_hour.map((hour: any, index: number) => {
                              const open = hour.open_time ? formatTime(hour.open_time) : "Closed";
                              const close = hour.close_time ? formatTime(hour.close_time) : "";
                              const timeText = open && close && open !== "Closed" ? `${open} - ${close}` : open;
                              return (
                                <li key={hour.id ?? index} className="flex items-start gap-2">
                                  <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-teal-400 flex-shrink-0" />
                                  <span className="text-gray-700">{hour.note ? hour.note : timeText}</span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <ul className="space-y-1.5 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-teal-400 flex-shrink-0" />
                              <span className="text-gray-700">Appointment on request</span>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SPECIALTIES desktop */}
                <SectionBox title="Specialties" titleAlign="center">
                  <DotList items={specialtiesArray} placeholder="Your specialties will appear here" />
                </SectionBox>
              </div>
            </div>

            {/* ===== MOBILE: STACKED SECTIONS ===== */}
            <div className="lg:hidden flex flex-col gap-3">

              {/* BIO */}
              {data.bio && (
                <SectionBox title="About" icon={<span className="text-[10px]">✦</span>}>
                  <div className="prose prose-sm text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: data.bio }} />
                </SectionBox>
              )}

              {/* GALLERY — full-width swipeable feel */}
              {normalizedImages.length > 0 && thumbnailIndex !== null && (
                <SectionBox title="Signature Work" titleAlign="center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                    {normalizedImages[thumbnailIndex]?.file_type === "video" ? (
                      <video src={galleryPreviews[thumbnailIndex]} poster={thumbnailPreviews[thumbnailIndex]} className="h-full w-full object-cover" controls />
                    ) : (
                      <img src={normalizedImages[thumbnailIndex]?.thumbnail_uri || galleryPreviews[thumbnailIndex]} className="h-full w-full object-cover" alt="Featured work" />
                    )}

                    {/* prev / next arrows */}
                    {normalizedImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setThumbnailIndex((prev) => ((prev ?? 0) - 1 + normalizedImages.length) % normalizedImages.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white active:scale-90 transition"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => setThumbnailIndex((prev) => ((prev ?? 0) + 1) % normalizedImages.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white active:scale-90 transition"
                        >
                          <ChevronRight size={16} />
                        </button>
                        {/* dot indicators */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {normalizedImages.slice(0, 8).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setThumbnailIndex(i)}
                              className={`rounded-full transition-all ${i === thumbnailIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* thumbnail strip */}
                  {normalizedImages.length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none">
                      {normalizedImages.slice(0, 8).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setThumbnailIndex(index)}
                          className={`relative h-12 w-12 overflow-hidden rounded-lg border flex-shrink-0 snap-start transition-all ${thumbnailIndex === index ? "ring-2 ring-[#23B9CD] border-[#23B9CD]" : "border-gray-200 opacity-70"}`}
                        >
                          <img src={thumbnailPreviews[index]} className="h-full w-full object-cover" alt={`Thumb ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </SectionBox>
              )}

              {/* LOCATION */}
              {data.locations?.length > 0 && (
                <SectionBox title="Location" titleAlign="center" icon={<MapPin size={12} />}>
                  {data.locations.length > 1 && (
                    <select
                      className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                      value={selectedLocationId || ""}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                    >
                      {data.locations.map((loc: any) => (
                        <option key={loc.id} value={loc.id}>{loc.label || `Location ${loc.id}`}</option>
                      ))}
                    </select>
                  )}
                  {selectedLocation && (
                    <div className="mb-3 space-y-1">
                      {selectedLocation.business_name && <p className="font-semibold text-gray-800 text-sm">{selectedLocation.business_name}</p>}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedLocation.location_type === "exact_address"
                          ? selectedLocation.address?.trim() || "Address not provided"
                          : [selectedLocation.city?.trim(), selectedLocation.state?.trim(), selectedLocation.area?.trim()].filter(Boolean).join(", ")}
                      </p>
                     {(selectedLocation?.phone || data.phone) && data.is_phone_visible && (
  <p className="text-gray-600">📞 {selectedLocation.phone || data.phone}</p>
)}
                    </div>
                  )}
                  {mapSrc ? (
                    <div className="relative rounded-xl overflow-hidden shadow-sm">
                      <iframe title="Business Location Map" className="w-full h-40" style={{ border: 0, display: "block" }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={mapSrc} />
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs whitespace-nowrap active:scale-95 transition"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                        Get Directions
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Map will appear once location is set</p>
                  )}
                </SectionBox>
              )}

              {/* BUSINESS HOURS mobile */}
              <SectionBox title="Business Hours" titleAlign="center" icon={<Clock size={12} />}>
                {data.business_hour.length !== 0 ? (
                  <ul className="space-y-2 text-sm">
                    {data.business_hour.map((hour: any, index: number) => {
                      const open = hour.open_time ? formatTime(hour.open_time) : "Closed";
                      const close = hour.close_time ? formatTime(hour.close_time) : "";
                      const timeText = open && close && open !== "Closed" ? `${open} – ${close}` : open;
                      return (
                        <li key={hour.id ?? index} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-[#23B9CD] flex-shrink-0" />
                          <span className="text-gray-700">{hour.note ? hour.note : timeText}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#23B9CD] flex-shrink-0" />
                      <span className="text-gray-700">Appointment on request</span>
                    </li>
                  </ul>
                )}
              </SectionBox>

              {/* SPECIALTIES mobile  */}
              {specialtiesArray.length > 0 && (
                <SectionBox title="Specialties" titleAlign="center">
                  <DotList items={specialtiesArray} placeholder="Your specialties will appear here" />
                </SectionBox>
              )}
            </div>

            {/* ===== IMPORTANT INFO (shared) ===== */}
            {importantInfoArray.length > 0 && (
              <div className="rounded-2xl p-[2px] mt-3" style={{ background: "linear-gradient(135deg, #23B9CD33, #a8edea55)" }}>
                <div className="rounded-2xl p-3 sm:p-4" style={{ background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex-1 h-px bg-gray-400/60" />
                    <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">Important Info</p>
                    <span className="flex-1 h-px bg-gray-400/60" />
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm">
                    <DotList items={importantInfoArray} placeholder="Important information will appear here" />
                  </div>
                </div>
              </div>
            )}

            {/* ===== PRESS & FEATURES ===== */}
            {otherLinks.filter((l: any) => l?.url).length > 0 && (
              <div className="rounded-2xl p-[2px] mt-3" style={{ background: "linear-gradient(135deg, #23B9CD33, #a8edea55)" }}>
                <div className="rounded-2xl p-3 sm:p-4" style={{ background: "linear-gradient(135deg, #e6edf5 0%, #d6e0eb 100%)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex-1 h-px bg-gray-400/60" />
                    <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">Press & Features</p>
                    <span className="flex-1 h-px bg-gray-400/60" />
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm space-y-2">
                    {otherLinks.filter((link: any) => link?.url).map((link: { title: string; url: string }, index: number) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition hover:border-teal-300 hover:bg-teal-50 active:scale-[0.98]">
                        <ExternalLink className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        <span className="truncate font-medium">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== CONNECT BUTTON ===== */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-teal-400" />
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex items-center gap-2 bg-[#23B9CD] hover:bg-[#1ea8b5] active:scale-95 text-white px-7 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all whitespace-nowrap uppercase shadow-md shadow-[#23B9CD]/30"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                CONNECT
              </button>
              <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-teal-400" />
            </div>

            {/* ===== SOCIAL ICONS (desktop only — mobile shown in hero) ===== */}
         <div className="flex justify-center lg:justify-end flex-wrap gap-4 mt-3">
  {data?.website && (
    <a
      href={data.website}
      target="_blank"
      rel="noopener noreferrer"
      title={data.website}
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Globe className="w-5 h-5 text-gray-500 hover:text-teal-600 transition" />
    </a>
  )}

  {allInstagramHandles.map(({ key, url }) => (
    <a
      key={key}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Instagram className="w-5 h-5 text-gray-500 hover:text-pink-600 transition" />
    </a>
  ))}

  {socialMedia?.facebook && (
    <a
      href={socialMedia.facebook}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Facebook className="w-5 h-5 text-gray-500 hover:text-blue-600 transition" />
    </a>
  )}

  {socialMedia?.linkedin && (
    <a
      href={socialMedia.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Linkedin className="w-5 h-5 text-gray-500 hover:text-blue-700 transition" />
    </a>
  )}

  {socialMedia?.youtube && (
    <a
      href={socialMedia.youtube}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Youtube className="w-5 h-5 text-gray-500 hover:text-red-600 transition" />
    </a>
  )}

  {socialMedia?.tiktok && (
    <a
      href={socialMedia.tiktok}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Music2 className="w-5 h-5 text-gray-500 hover:text-black transition" />
    </a>
  )}
</div>


          </div>
        </div>
      </div>

      {/* ===== BOOKING MODAL — bottom-sheet on mobile ===== */}
      {isBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-5 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />

            <div className="flex justify-between items-center mb-1">
              <p className="text-base font-bold text-gray-800">How would you like to connect?</p>
              <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">✕</button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Choose your preferred booking method</p>

            <div className="flex flex-col gap-2.5">
              {/* BOOK VIA LINK */}
              {preferredBookingMethods.includes("GO_TO_BOOKING_LINK") && (
                <a
                  href={data.booking_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!data.booking_link) e.preventDefault(); }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors active:scale-[0.98] ${data.booking_link ? "border-gray-200 hover:bg-gray-50" : "border-gray-200 opacity-50 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 text-lg">🔗</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Book via Link</p>
                    <p className="text-xs text-gray-500">{data.booking_link ? "Visit booking page" : "Not configured"}</p>
                  </div>
                </a>
              )}

              {/* CALL / TEXT */}
              {preferredBookingMethods.includes("CALL_TEXT") && (
                <a
                  href={data.phone ? `tel:${data.phone}` : "#"}
                  onClick={(e) => { if (!data.phone) e.preventDefault(); }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors active:scale-[0.98] ${data.phone ? "border-gray-200 hover:bg-gray-50" : "border-gray-200 opacity-50 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">📞</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Call / Text</p>
                    <p className="text-xs text-gray-500">{data.phone || "Not configured"}</p>
                  </div>
                </a>
              )}

              {/* INSTAGRAM */}
              {preferredBookingMethods.includes("DM_INSTAGRAM") && (
                allInstagramHandles.length > 0 ? (
                  allInstagramHandles.map(({ key, url }, idx) => (
                    <a
                      key={key}
                      href={url.startsWith("http") ? url : `https://ig.me/m/${url.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 text-lg">📸</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          DM on Instagram{allInstagramHandles.length > 1 ? ` ${idx + 1}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{url}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 opacity-50 cursor-not-allowed">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 text-lg">📸</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">DM on Instagram</p>
                      <p className="text-xs text-gray-500">Not configured</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== DOWNLOAD MODAL ===== */}
      <GlamCardDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        datadownload={data}
      />

      {/* ===== QR CODE MODAL — bottom-sheet on mobile ===== */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-5 w-full sm:max-w-md sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">Business Card QR Code</h3>
              <button onClick={() => setIsQrModalOpen(false)} className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">✕</button>
            </div>

            {data?.business_card_qr ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-2xl border-2 border-[#23B9CD]/20 bg-[#F4F9FF]">
                    <img src={data.business_card_qr} alt="Business Card QR" className="w-52 h-52 sm:w-64 sm:h-64 object-contain rounded-lg" />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Business Card Link</label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                    <a href={data.business_card_qr} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-sm text-teal-700 hover:underline">
                      {data.business_card_qr}
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#23B9CD] text-white hover:bg-[#1ea8b5] active:scale-95 transition-all whitespace-nowrap"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">QR Code not available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlamCardLivePreview;