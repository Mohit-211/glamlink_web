<<<<<<< HEAD
import React, { useEffect, useMemo, useRef, useState } from "react";
=======
﻿import React, { useEffect, useMemo, useRef, useState } from "react";
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
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
  Share2,
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  Play,
  Send,
  Link2,
  ArrowUpRight,
} from "lucide-react";
import GlamCardDownloadModal from "./Glamcarddownloadmodal";
/* ================= VIDEO THUMBNAIL GENERATOR ================= */
/**
 * Generates a JPEG data URL from a video's first safely-seekable frame.
 * Needed because Safari (macOS/iOS) does not reliably render a preview
 * frame for <video> without an explicit poster.
 */
function generateVideoThumbnail(
  videoUrl: string,
  seekTime: number = 0.1,
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!videoUrl || typeof document === "undefined") {
      resolve(null);
      return;
    }
    try {
      const video = document.createElement("video");
      if (!videoUrl.startsWith("blob:") && !videoUrl.startsWith("data:")) {
        video.crossOrigin = "anonymous";
      }
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      (video as any).webkitPlaysInline = true;
      video.src = videoUrl;

      let settled = false;
      const finish = (result: string | null) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        video.removeAttribute("src");
        video.load();
        resolve(result);
      };

      const captureFrame = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 240;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            finish(null);
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          finish(dataUrl);
        } catch {
          // Tainted canvas (CORS) or other draw failure — fall back gracefully.
          finish(null);
        }
      };

      video.addEventListener("loadedmetadata", () => {
        const duration = video.duration;
        const target =
          isFinite(duration) && duration > 0 && duration < seekTime
            ? Math.max(duration / 2, 0.01)
            : seekTime;
        try {
          video.currentTime = target;
        } catch {
          captureFrame();
        }
      });
      video.addEventListener("seeked", captureFrame);
      video.addEventListener("error", () => finish(null));

      const timeoutId = window.setTimeout(() => finish(null), 5000);

      video.load();
    } catch {
      resolve(null);
    }
  });
}
/* ================= VCF GENERATOR ================= */
export function generateVCF(data: GlamCardFormData) {
  const fullName = (data.name || "").trim();
  const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
  const lastName = rest.join(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName || ""};;;`,
    `FN:${fullName}`,
    `ORG:${data.business_name || ""}`,
    `TITLE:${data.professional_title || ""}`,
    `TEL;TYPE=CELL:${data.phone || ""}`,
    `EMAIL:${data.email || ""}`,
    `URL:${data.website || ""}`,
    "END:VCARD",
  ].join("\r\n");
}
function downloadVCF(data: GlamCardFormData) {
  console.log(data, "data");
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
  <div
    className="rounded-2xl p-[2px]"
    style={{ background: "linear-gradient(135deg, var(--accent-faint), var(--accent-light))" }}
  >
    <div
      className="rounded-2xl p-3 sm:p-4 h-full"
      style={{
        background: "linear-gradient(135deg, var(--panel-start) 0%, var(--panel-end) 100%)",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
      }}
    >
      {titleAlign === "center" ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="flex-1 h-px bg-gray-400/60" />
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-[var(--accent)]">{icon}</span>}
            <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">
              {title}
            </p>
          </div>
          <span className="flex-1 h-px bg-gray-400/60" />
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-3">
          {icon && <span className="text-[var(--accent)]">{icon}</span>}
          <p className="text-xs font-bold tracking-wider text-gray-700 uppercase">
            {title}
          </p>
        </div>
      )}
      <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm" style={{
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
      }}>{children}</div>
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
/** Default Glamlink accent — used whenever the Access Card has no valid color_code. */
<<<<<<< HEAD
const DEFAULT_ACCENT_COLOR = "#24bbcb";
=======
const DEFAULT_ACCENT_COLOR = "#23B9CD";
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
const isValidHexColor = (value: unknown): value is string =>
  typeof value === "string" &&
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
/** Expands `rgb(a)` from a hex color, e.g. for `rgba(...)` glows/tints derived from color_code. */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const hexToRgba = (hex: string, alpha: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
/** Darkens (negative percent) or lightens (positive percent) a hex color — used for hover/gradient shades derived from color_code. */
const shadeColor = (hex: string, percent: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const mix = (c: number) => Math.round((t - c) * p) + c;
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};
/* ================= TEAL DOT BULLET LIST ================= */
const DotList: React.FC<{ items: any[]; placeholder: string }> = ({
  items,
  placeholder,
}) => (
  <ul className="space-y-2 text-sm">
    {items.length ? (
      items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          {/* <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" /> */}
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
/* ================= BLACK PILL TAG LIST ================= */
const TagList: React.FC<{ items: any[] }> = ({ items }) => {
  const display = items.length ? items : [""];
  return (
    <div className="flex flex-wrap gap-2">
      {display.map((item, i) => (
        <span
          key={i}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-black min-w-[2.5rem] min-h-[1.5rem]"
        >
          {typeof item === "string" ? item : item?.note || item?.text || ""}
        </span>
      ))}
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
  console.log(data, "datata")
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(0);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const specialtiesArray = parseArray(data.specialties);
  console.log(specialtiesArray, "specialtiesArray");
  const importantInfoArray = parseArray(data.important_info);
  console.log(importantInfoArray,"importantInfoArray")
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
    return rawImages?.map((item: any, index: number) => {
      if (typeof item === "string")
        return {
          url: item,
          file_type: "image",
          thumbnail_uri: "",
          sort_order: index,
        };
      const fileType =
        item.file_type ||
        (item instanceof File && item.type.startsWith("video/")
          ? "video"
          : "image");
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
        .map((img) => img.url),
    );
    return normalizedImages.filter(
      (img) =>
        !(
          img.file_type === "video" &&
          !img.thumbnail_uri &&
          properVideoUrls.has(img.url)
        ),
    );
  }, [normalizedImages]);
  const galleryMeta = data?.gallery_meta || [];
  /* ================= GALLERY PREVIEWS ================= */
  const galleryPreviews = useMemo(
    () =>
      mode === "live"
        ? normalizedImages?.map((item, idx) => {
          const raw = data?.images?.[idx];
          return isFile(raw) ? URL.createObjectURL(raw) : item.url;
        })
        : normalizedImages?.map((item) => item.url),
    [mode, normalizedImages, data?.images],
  );
  /* ================= THUMBNAIL PREVIEWS ================= */
  const thumbnailPreviews = useMemo(
    () =>
      normalizedImages?.map((item, idx) => {
        const meta = galleryMeta[idx];
        if (item.file_type === "video") {
          if (meta?.thumbnail_file instanceof File)
            return URL.createObjectURL(meta.thumbnail_file);
          if (item.thumbnail_uri) return item.thumbnail_uri;
        }
        return item.thumbnail_uri || galleryPreviews[idx];
      }),
    [normalizedImages, galleryMeta, galleryPreviews],
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
  /* ================= VIDEO THUMBNAIL CACHE ================= */
  const [videoThumbCache, setVideoThumbCache] = useState<Record<string, string>>(
    {},
  );
  const attemptedVideoUrlsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    let cancelled = false;
    normalizedImages.forEach((item, idx) => {
      if (item.file_type !== "video" || item.thumbnail_uri) return;
      const videoUrl = galleryPreviews[idx];
      if (!videoUrl || attemptedVideoUrlsRef.current.has(videoUrl)) return;
      attemptedVideoUrlsRef.current.add(videoUrl);
      generateVideoThumbnail(videoUrl).then((thumb) => {
        if (cancelled || !thumb) return;
        setVideoThumbCache((prev) => ({ ...prev, [videoUrl]: thumb }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, [normalizedImages, galleryPreviews]);
  /** First preference: backend thumbnail_uri, second: cached/generated thumbnail. */
  const getVideoThumbSrc = (index: number): string | null => {
    const item = normalizedImages[index];
    if (!item) return null;
    if (item.thumbnail_uri) return item.thumbnail_uri;
    const videoUrl = galleryPreviews[index];
    if (videoUrl && videoThumbCache[videoUrl]) return videoThumbCache[videoUrl];
    return null;
  };
  const renderThumbImage = (index: number, altPrefix: string) => {
    const item = normalizedImages[index];
    if (item?.file_type === "video") {
      const thumbSrc = getVideoThumbSrc(index);
      return (
        <div className="relative h-full w-full bg-gray-700">
          {thumbSrc ? (
            <img
              src={thumbSrc}
              className="h-full w-full object-cover"
              alt={`${altPrefix} ${index + 1}`}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <Play size={14} className="text-white fill-white" />
          </div>
        </div>
      );
    }
    return (
      <img
        src={thumbnailPreviews[index]}
        className="h-full w-full object-cover"
        alt={`${altPrefix} ${index + 1}`}
      />
    );
  };
  /* ================= LOCATION ================= */
  const primaryLocation = useMemo(
    () => data.locations?.find((l: any) => l.is_primary) || data.locations?.[0],
    [data.locations],
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
      try {
        return JSON.parse(data.social_media);
      } catch {
        return {};
      }
    }
    return data.social_media;
  }, [data.social_media]);
  /* ================= ALL INSTAGRAM HANDLES ================= */
  const allInstagramHandles = useMemo(() => {
    const handles: { key: string; url: string }[] = [];
    if (socialMedia?.instagram)
      handles.push({ key: "instagram", url: socialMedia.instagram });
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
      try {
        return JSON.parse(data.other_links);
      } catch {
        return [];
      }
    }
    return Array.isArray(data.other_links) ? data.other_links : [];
  }, [data.other_links]);
  /* ================= FEATURED LINKS ================= */
  const featuredLinks = useMemo(() => {
    let value = data?.featured_links;
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch {
        value = [];
      }
    }
    if (!Array.isArray(value)) return [];
    const filtered = value.filter((link: any) => link?.url);
    // Position always follows the server's sort_order (falling back to
    // array position for a link that doesn't have one yet, e.g. brand-new
    // and not yet saved/reordered through the API) — is_featured no longer
    // forces it to the top, it's shown as a "Featured" tag on the card
    // instead, wherever it falls in that order.
    return [...filtered].sort((a: any, b: any) => {
      const aOrder = a?.sort_order ?? filtered.indexOf(a);
      const bOrder = b?.sort_order ?? filtered.indexOf(b);
      return aOrder - bOrder;
    });
  }, [data.featured_links]);
  /* Theme accent for the whole card — sourced from the Access Card's
     color_code, falling back to the default Glamlink accent when
     missing/invalid so the card never breaks on a bad value. Exposed to
     every section below (including the standalone SectionBox component)
     as CSS custom properties on the outermost wrapper, so nothing in this
     file hardcodes a color — see `cardColorVars` near the JSX return. */
  const cardColor = useMemo(
    () =>
      isValidHexColor(data?.color_code)
        ? data.color_code.trim()
        : DEFAULT_ACCENT_COLOR,
    [data?.color_code],
  );
  /* Resolves a thumbnail for both a persisted URL and a pending File (this
     component doubles as the live preview during editing, where a newly
     selected thumbnail is still a raw File). Object URLs are created once
     per featuredLinks change and revoked together, same pattern as the
     gallery preview cache above. */
  const featuredLinkThumbSrcs = useMemo(() => {
    const map = new Map<any, string>();
    featuredLinks.forEach((link: any) => {
      if (link?.thumbnail_file instanceof File) {
        map.set(link, URL.createObjectURL(link.thumbnail_file));
      }
    });
    return map;
  }, [featuredLinks]);
  useEffect(() => {
    return () => {
      featuredLinkThumbSrcs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [featuredLinkThumbSrcs]);
  const getFeaturedLinkThumbnailSrc = (link: any): string | undefined =>
    featuredLinkThumbSrcs.get(link) ||
    link?.image ||
    link?.thumbnail_url ||
    link?.image_url ||
    undefined;
  /* ================= PREFERRED BOOKING METHODS ================= */
  const preferredBookingMethods = useMemo(() => {
    const val = (data as any)?.preferred_booking_method;
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed)
          ? parsed
          : val.split(",").map((v) => v.trim());
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
  const handleShare = async () => {
    const link = data?.business_card_link;
    if (!link) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.name || "Business Card",
          url: link,
        });
      } catch (error) {
        // user cancelled share or share failed silently
      }
    } else {
      handleCopyLink();
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
  const socialIconStyle = {
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
  };
  /* Raised, premium button look for the Connect section icons only. */
  const connectIconStyle = {
    boxShadow:
      "0 6px 14px rgba(15, 23, 42, 0.12), 0 2px 4px rgba(15, 23, 42, 0.08)",
  };
  /* Every dynamic color used below (including inside the standalone
     SectionBox component, which has no props/access to `cardColor`)
     resolves through these CSS custom properties instead of a hardcoded
     hex, so picking a new color_code re-themes the entire card with no
     per-element wiring. Pre-mixing the alpha variants here (rather than
     relying on Tailwind's opacity modifier on a `var(...)` value, which it
     can't compute) keeps every consumer a plain, JIT-safe literal class
     like `bg-[var(--accent)]`. */
  const cardColorLight = shadeColor(cardColor, 55);
  const cardColorVars = {
    "--accent": cardColor,
    "--accent-strong": shadeColor(cardColor, -14),
    "--accent-deep": shadeColor(cardColor, -25),
    "--accent-soft": hexToRgba(cardColor, 0.35),
    "--accent-faint": hexToRgba(cardColor, 0.12),
    "--accent-border": hexToRgba(cardColor, 0.4),
    // Pastel partner for the two-tone gradient borders — a lighter tint of
    // the same accent instead of a fixed mint, so the gradient stays
    // monochromatic no matter which color_code is picked.
    "--accent-light": hexToRgba(cardColorLight, 0.45),
    // Panel background (SectionBox, Important Info, Press & Features,
    // Featured Links) — was a fixed blue-gray gradient that clashed with
    // any non-teal color_code; now a near-white tint of the accent itself,
    // so the panel background always matches the chosen theme.
    "--panel-start": shadeColor(cardColor, 90),
    "--panel-end": shadeColor(cardColor, 78),
  } as React.CSSProperties;
  return (
    <div
      className={`${mode !== "download" ? "min-h-screen" : ""} flex flex-col`}
      style={cardColorVars}
    >
      {/* ===== MOBILE STICKY TOP BAR (view mode) ===== */}
      {mode === "view" && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm lg:hidden">
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="access" width={90} height={28} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadVCF(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-xs font-semibold shadow transition active:scale-95"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                <polyline points="9 21 9 13 15 13 15 21" />
              </svg>
              Save
            </button>
             <button
                  onClick={handleShare}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-strong)] transition-all duration-200" style={socialIconStyle}
                >
                  <Share2 size={12} strokeWidth={2.5} />
                </button>
            {/* <button
              onClick={() => setIsQrModalOpen(true)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--accent-faint)] text-[var(--accent)] transition active:scale-95"
            >
              <QrCode size={15} strokeWidth={2.5} />
            </button> */}
          </div>
        </div>
      )}
      <div className="px-3 py-4 sm:px-5 sm:py-6 lg:p-6 flex flex-col items-center">
        <div
          className="w-full max-w-lg lg:max-w-2xl p-[2px] rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${cardColor}, ${cardColorLight} 50%, ${cardColor})`,
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div className="rounded-2xl bg-[#FFFFFF] p-4 sm:p-6 shadow-sm">
            {/* ===== LOGO (desktop / non-view) ===== */}
            <div
              className={`mb-5 text-center ${mode === "view" ? "hidden lg:flex justify-center" : "flex justify-center"}`}
            >
              <Image src={Logo} alt="access image" width={160} height={160} />
            </div>
            {/* ===== DESKTOP TOP ACTIONS ===== */}
            {mode === "view" && (
              <div className="hidden lg:flex justify-end gap-2 mb-3">
                <button
                  onClick={() => downloadVCF(data)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white text-sm font-medium shadow-md transition-colors whitespace-nowrap" style={socialIconStyle}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="9 21 9 13 15 13 15 21" />
                    <polyline points="9 7 12 7" />
                  </svg>
                  Save Contact
                </button>
                <button
                  onClick={handleShare}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-strong)] transition-all duration-200" style={socialIconStyle}
                >
                  <Share2 size={18} strokeWidth={2.5} />
                </button>
              </div>
            )}
            {/* ===== HERO: PROFILE CARD ===== */}
            <div className="mb-4">
              <div
                className="relative rounded-2xl overflow-hidden shadow-md"
                style={{
<<<<<<< HEAD
                  background: "#24bbcb",
=======
                  background: `linear-gradient(135deg, ${cardColor} 0%, ${shadeColor(cardColor, -25)} 100%)`,
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
                }}
              >
                {/* bg pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white translate-x-8 -translate-y-8" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white -translate-x-6 translate-y-6" />
                </div>
                <div className="flex items-center gap-4 p-4">
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
                  </div>
                </div>
              </div>
            </div>
            {/* ===== STACKED SECTIONS ===== */}
            <div className="flex flex-col gap-3">
              {/* BIO */}
              {data.bio && (
                <SectionBox
                  title="About"
                  icon={<span className="text-[10px]">✦</span>}
                >
                  <div
                    className="prose prose-sm text-gray-700 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.bio }}
                  />
                </SectionBox>
              )}
              {normalizedImages.length > 0 && thumbnailIndex !== null && (
                <SectionBox title="Gallery" titleAlign="center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                    {normalizedImages[thumbnailIndex]?.file_type === "video" ? (
                      <video
                        key={galleryPreviews[thumbnailIndex]}
                        controls
                        playsInline
                        preload="metadata"
                        webkit-playsinline="true"
                        controlsList="nodownload"
                        poster={getVideoThumbSrc(thumbnailIndex) || undefined}
                        className="h-full w-full object-cover"
                      >
                        <source
                          src={galleryPreviews[thumbnailIndex]}
                          type="video/mp4"
                        />
                        {/* Your browser does not support video. */}
                      </video>
                    ) : (
                      <img
                        src={
                          normalizedImages[thumbnailIndex]?.thumbnail_uri ||
                          galleryPreviews[thumbnailIndex]
                        }
                        className="h-full w-full object-cover"
                        alt="Featured work"
                      />
                    )}
                    {/* prev / next arrows */}
                    {normalizedImages.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setThumbnailIndex(
                              (prev) =>
                                ((prev ?? 0) - 1 + normalizedImages.length) %
                                normalizedImages.length,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white active:scale-90 transition"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setThumbnailIndex(
                              (prev) =>
                                ((prev ?? 0) + 1) % normalizedImages.length,
                            )
                          }
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
                          className={` h-12 w-12 overflow-hidden rounded-lg border flex-shrink-0 snap-start transition-all ${thumbnailIndex === index ? "ring-2 ring-[var(--accent)] border-[var(--accent)]" : "border-gray-200"}`}
                        >
                          {renderThumbImage(index, "Thumb")}
                        </button>
                      ))}
                    </div>
                  )}
                </SectionBox>
              )}
              {/* LOCATION */}
              {data.locations?.length > 0 && (
                <SectionBox
                  title="Location"
                  titleAlign="center"
                  icon={<MapPin size={12} />}
                >
                  {data.locations.length > 1 && (
                    <select
                      className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)] bg-white"
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
                  {selectedLocation && (
                    <div className="mb-3 space-y-1">
                     {data.locations.length === 1 &&
                              selectedLocation.label && (
                                <p className="font-semibold text-gray-800">
                                  {selectedLocation.label}
                                </p>
                              )}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedLocation.location_type === "exact_address"
                          ? selectedLocation.address?.trim() ||
                          "Address not provided"
                          : [
                            selectedLocation.city?.trim(),
                            selectedLocation.state?.trim(),
                            selectedLocation.area?.trim(),
                          ]
                            .filter(Boolean)
                            .join(", ")}
                      </p>
                      {(data.phone || selectedLocation?.phone) &&
                        data.is_phone_visible && (
                          <p className="text-gray-600">
                            📞 {selectedLocation.phone || data.phone}
                          </p>
                        )}
                    </div>
                  )}
                  {mapSrc ? (
                    <div className="relative rounded-xl overflow-hidden shadow-sm">
                      <iframe
                        title="Business Location Map"
                        className="w-full h-40"
                        style={{ border: 0, display: "block" }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={mapSrc}
                      />
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs whitespace-nowrap active:scale-95 transition"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
                      Map will appear once location is set
                    </p>
                  )}
                </SectionBox>
              )}
              {/* BUSINESS HOURS mobile */}
              <SectionBox
                title="Business Hours"
                titleAlign="center"
                icon={<Clock size={12} />}
              >
                {data.business_hour.length !== 0 ? (
                  <ul className="space-y-2 text-sm">
                    {data.business_hour.map((hour: any, index: number) => {
                      const open = hour.open_time
                        ? formatTime(hour.open_time)
                        : "Closed";
                      const close = hour.close_time
                        ? formatTime(hour.close_time)
                        : "";
                      const timeText =
                        open && close && open !== "Closed"
                          ? `${open} – ${close}`
                          : open;
                      return (
                        <li
                          key={hour.id ?? index}
                          className="flex items-start gap-2.5"
                        >
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                          <span className="text-gray-700">
                            {hour.note ? hour.note : timeText}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                      <span className="text-gray-700">
                        Appointment on request
                      </span>
                    </li>
                  </ul>
                )}
              </SectionBox>
              {/* SPECIALTIES mobile */}
              {specialtiesArray.length > 0 && (
                <SectionBox title="Specialties" titleAlign="center">
                  <DotList
                    items={specialtiesArray}
                    placeholder="Your specialties will appear here"
                  />
                </SectionBox>
              )}
            </div>
            {/* ===== IMPORTANT INFO (shared) ===== */}
            {importantInfoArray.length !==0 &&
            <div
              className="rounded-2xl p-[2px] mt-3"
              style={{
                background: "linear-gradient(135deg, var(--accent-faint), var(--accent-light))",
              }}
            >
              <div
                className="rounded-2xl p-3 sm:p-4"
                style={{
                  background:
                    "linear-gradient(135deg, var(--panel-start) 0%, var(--panel-end) 100%)",
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex-1 h-px bg-gray-400/60" />
                  <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">
                    Important Info
                  </p>
                  <span className="flex-1 h-px bg-gray-400/60" />
                </div>
                <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm" style={{
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
                }}>
                  <DotList items={importantInfoArray}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            }
            {/* ===== PRESS & FEATURES ===== */}
            {otherLinks.filter((l: any) => l?.url).length > 0 && (
              <div
                className="rounded-2xl p-[2px] mt-3"
                style={{
                  background: "linear-gradient(135deg, var(--accent-faint), var(--accent-light))",
                }}
              >
                <div
                  className="rounded-2xl p-3 sm:p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--panel-start) 0%, var(--panel-end) 100%)",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex-1 h-px bg-gray-400/60" />
                    <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">
                      Press & Features
                    </p>
                    <span className="flex-1 h-px bg-gray-400/60" />
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm space-y-2" style={{
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
                  }}>
                    {otherLinks
                      .filter((link: any) => link?.url)
                      .map(
                        (
                          link: { title: string; url: string },
                          index: number,
                        ) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition hover:border-[var(--accent)] hover:bg-[var(--accent-faint)] active:scale-[0.98]" style={socialIconStyle}
                          >
                            <ExternalLink className="h-4 w-4 text-[var(--accent)] flex-shrink-0" />
                            <span className="truncate font-medium">
                              {link.title}
                            </span>
                          </a>
                        ),
                      )}
                  </div>
                </div>
              </div>
            )}
            {/* ===== FEATURED LINKS =====
                Every accent color here resolves through the CSS custom
                properties set on the outer wrapper (cardColorVars, derived
                from the Access Card's color_code) — no hardcoded hex, so a
                new color re-themes the whole section automatically. */}
            {featuredLinks.length > 0 && (
              <div
                className="rounded-2xl p-[2px] mt-3"
                style={{
                  background: "linear-gradient(135deg, var(--accent-faint), var(--accent-light))",
                }}
              >
                <div
                  className="rounded-2xl p-3 sm:p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--panel-start) 0%, var(--panel-end) 100%)",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex-1 h-px bg-gray-400/60" />
                    <p className="text-xs font-bold tracking-wider text-gray-700 uppercase whitespace-nowrap">
                      Featured Links
                    </p>
                    <span className="flex-1 h-px bg-gray-400/60" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {featuredLinks.map((link: any, index: number) => {
                      const thumbSrc = getFeaturedLinkThumbnailSrc(link);
                      const description: string = link?.description || "";
                      let hostname = "";
                      try {
                        hostname = new URL(link.url).hostname.replace(
                          /^www\./,
                          "",
                        );
                      } catch {
                        hostname = "";
                      }
                      const subtext = description || hostname;
                      return (
                        <a
                          key={link?.id ?? index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex items-center gap-3 sm:gap-4 rounded-2xl bg-white p-3.5 sm:p-4 border border-gray-200/70 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent-border)] active:scale-[0.98] active:translate-y-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_1px_rgba(15,23,42,0.04),0_8px_16px_-4px_rgba(15,23,42,0.12),0_20px_40px_-14px_rgba(15,23,42,0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_2px_rgba(15,23,42,0.05),0_14px_24px_-4px_var(--accent-soft),0_28px_56px_-14px_rgba(15,23,42,0.24)]"
                        >
                          {/* thumbnail */}
                          <div className="relative flex-shrink-0">
                            <div
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center"
                              style={{
                                background: "var(--accent-faint)",
                                boxShadow: "inset 0 0 0 1px var(--accent-border)",
                              }}
                            >
                              {thumbSrc ? (
                                <img
                                  src={thumbSrc}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Link2 className="w-5 h-5 text-[var(--accent)]" />
                              )}
                            </div>
                            {link?.is_featured && (
                              <span className="absolute -top-1.5 -left-1.5 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm ring-2 ring-white whitespace-nowrap">
                                Featured
                              </span>
                            )}
                          </div>
                          {/* title + description */}
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                              {link.title}
                            </p>
                            {subtext && (
                              <p className="text-xs sm:text-[13px] text-gray-500 leading-snug mt-1 line-clamp-2">
                                {subtext}
                              </p>
                            )}
                          </div>
                          {/* action */}
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center transition-colors duration-200 group-hover:bg-[var(--accent)]">
                            <ArrowUpRight
                              className="w-4 h-4 text-gray-400 transition-colors duration-200 group-hover:text-white"
                              strokeWidth={2.25}
                            />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {/* ===== CONNECT BUTTON ===== */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-[var(--accent)]" />
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] active:scale-95 text-white px-7 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all whitespace-nowrap uppercase shadow-md" style={{
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.7)",
                }}
              >
                <Send className="w-4 h-4" strokeWidth={2.5} />
                CONNECT
              </button>
              <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-[var(--accent)]" />
            </div>
            {/* ===== SOCIAL ICONS ===== */}
            <div className="flex justify-center flex-wrap gap-4 sm:gap-5 mt-4">
              {data?.website && (
                <div className="flex flex-col items-center gap-1.5">
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={data.website}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={connectIconStyle}
                  >
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors duration-300" />
                  </a>
                  <span className="text-[11px] font-medium text-gray-500">Website</span>
                </div>
              )}
              {allInstagramHandles.map(({ key, url }, idx) => (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={url}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={connectIconStyle}
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors duration-300" />
                  </a>
                  <span className="text-[11px] font-medium text-gray-500">
                    {idx > 0 ? `Instagram ${idx + 1}` : "Instagram"}
                  </span>
                </div>
              ))}
              {socialMedia?.facebook && (
                <div className="flex flex-col items-center gap-1.5">
                  <a
                    href={socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={connectIconStyle}
                  >
                    <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors duration-300" />
                  </a>
                  <span className="text-[11px] font-medium text-gray-500">Facebook</span>
                </div>
              )}
              {socialMedia?.linkedin && (
                <div className="flex flex-col items-center gap-1.5">
                  <a
                    href={socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={connectIconStyle}
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors duration-300" />
                  </a>
                  <span className="text-[11px] font-medium text-gray-500">LinkedIn</span>
                </div>
              )}
              {socialMedia?.youtube && (
                <div className="flex flex-col items-center gap-1.5">
                  <a
                    href={socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="YouTube"
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={connectIconStyle}
                  >
                    <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors duration-300" />
                  </a>
                  <span className="text-[11px] font-medium text-gray-500">YouTube</span>
                </div>
              )}
              {socialMedia?.tiktok && (
                <div className="flex flex-col items-center gap-1.5">
                  <a
                    href={socialMedia.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={connectIconStyle}
                  >
                    <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors duration-300" />
                  </a>
                  <span className="text-[11px] font-medium text-gray-500">TikTok</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ===== BOOKING MODAL ===== */}
      {isBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-5 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-base font-bold text-gray-800">
                How would you like to connect?
              </p>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Choose your preferred booking method
            </p>
            <div className="flex flex-col gap-2.5">
              {preferredBookingMethods.includes("GO_TO_BOOKING_LINK") && (
                <a
                  href={data.booking_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!data.booking_link) e.preventDefault();
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors active:scale-[0.98] ${data.booking_link ? "border-gray-200 hover:bg-gray-50" : "border-gray-200 opacity-50 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0 text-lg">
                    🔗
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Book via Link
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.booking_link
                        ? "Visit booking page"
                        : "Not configured"}
                    </p>
                  </div>
                </a>
              )}
              {preferredBookingMethods.includes("CALL_TEXT") && (
                <a
                  href={data.phone ? `tel:${data.phone}` : "#"}
                  onClick={(e) => {
                    if (!data.phone) e.preventDefault();
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors active:scale-[0.98] ${data.phone ? "border-gray-200 hover:bg-gray-50" : "border-gray-200 opacity-50 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
                    📞
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Call / Text
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.phone || "Not configured"}
                    </p>
                  </div>
                </a>
              )}
              {preferredBookingMethods.includes("DM_INSTAGRAM") &&
                (allInstagramHandles.length > 0 ? (
                  allInstagramHandles.map(({ key, url }, idx) => (
                    <a
                      key={key}
                      href={
                        url.startsWith("http")
                          ? url
                          : `https://ig.me/m/${url.replace(/^@/, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 text-lg">
                        📸
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          DM on Instagram
                          {allInstagramHandles.length > 1 ? ` ${idx + 1}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {url}
                        </p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 opacity-50 cursor-not-allowed">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 text-lg">
                      📸
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        DM on Instagram
                      </p>
                      <p className="text-xs text-gray-500">Not configured</p>
                    </div>
                  </div>
                ))}
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
      {/* ===== QR CODE MODAL ===== */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-5 w-full sm:max-w-md sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">
                Business Card QR Code
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>
            {data?.business_card_qr ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-2xl border-2 border-[var(--accent-border)] bg-[#F4F9FF]">
                    <img
                      src={data.business_card_qr}
                      alt="Business Card QR"
                      className="w-52 h-52 sm:w-64 sm:h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Business Card Link
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                    <a
                      href={data.business_card_qr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 truncate text-sm text-[var(--accent-deep)] hover:underline"
                    >
                      {data.business_card_qr}
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] active:scale-95 transition-all whitespace-nowrap"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                QR Code not available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default GlamCardLivePreview;
