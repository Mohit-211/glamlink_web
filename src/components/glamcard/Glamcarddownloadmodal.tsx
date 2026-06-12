"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, X, Loader2 } from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import BusinessCardPage from "../BusinessCardPage";

interface GlamCardDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  datadownload: any;
}

const GlamCardDownloadModal: React.FC<GlamCardDownloadModalProps> = ({
  isOpen,
  onClose,
  datadownload,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "jpg">("png");

  // ─── Lock body scroll when modal is open ────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ─── Force-load all lazy / Next.js images when modal opens ──────────────────
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (!previewRef.current) return;
      previewRef.current.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        img.loading = "eager";
        const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
        if (srcset) {
          const best = srcset
            .split(",")
            .map((s) => { const p = s.trim().split(/\s+/); return { url: p[0], w: parseInt(p[1]) || 0 }; })
            .sort((a, b) => b.w - a.w)[0];
          if (best?.url && !best.url.startsWith("data:")) img.src = best.url;
        }
        const dataSrc = img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
        if (dataSrc) img.src = dataSrc;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // ════════════════════════════════════════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════════════════════════════════════════

  /** Wait for every <img> inside element to finish loading. */
  const waitForImages = (element: HTMLElement) =>
    Promise.all(
      Array.from(element.querySelectorAll<HTMLImageElement>("img")).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // don't stall on broken images
          })
      )
    );

  /**
   * Convert any URL to a base64 data-URL.
   * 1. Canvas + crossOrigin (fastest, same-origin / CORS-enabled)
   * 2. fetch + blob → FileReader (handles more CORS scenarios)
   * 3. Original URL (last resort — html-to-image will try again)
   */
  const toDataUrl = (src: string): Promise<string> =>
    new Promise((resolve) => {
      // Attempt 1 — canvas
      const tryCanvas = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = img.naturalWidth || 300;
            c.height = img.naturalHeight || 300;
            c.getContext("2d")?.drawImage(img, 0, 0);
            const url = c.toDataURL("image/png"); // throws on tainted canvas
            if (url && url !== "data:,") return resolve(url);
            tryFetch();
          } catch {
            tryFetch(); // SecurityError from tainted canvas
          }
        };
        img.onerror = () => tryFetch();
        // cache-bust so the browser actually attaches CORS headers
        img.src = src + (src.includes("?") ? "&" : "?") + "_t=" + Date.now();
      };

      // Attempt 2 — fetch blob
      const tryFetch = () => {
        fetch(src, { mode: "cors", cache: "no-store" })
          .then((r) => { if (!r.ok) throw new Error(); return r.blob(); })
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(src);
            reader.readAsDataURL(blob);
          })
          .catch(() => resolve(src)); // give up — pass original src
      };

      tryCanvas();
    });

  /**
   * Replace every <img> src with an inline base64 data-URL.
   * Returns a cleanup function that restores the originals.
   */
  const inlineImages = async (element: HTMLElement): Promise<() => void> => {
    const restores: { img: HTMLImageElement; src: string }[] = [];
    await Promise.all(
      Array.from(element.querySelectorAll<HTMLImageElement>("img")).map(async (img) => {
        const orig = img.getAttribute("src") || "";
        if (!orig || orig.startsWith("data:")) return;
        const b64 = await toDataUrl(orig);
        restores.push({ img, src: orig });
        img.src = b64;
      })
    );
    return () => restores.forEach(({ img, src }) => { img.src = src; });
  };

  /** Draw a canvas-based map placeholder (used when Google Maps iframe can't be captured). */
  const drawMapCanvas = (w: number, h: number, lat: number | null, lng: number | null): string => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d")!;

    // Background
    ctx.fillStyle = "#f2efe9";
    ctx.fillRect(0, 0, w, h);

    // Fake roads
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 6;
    [[0, h * 0.45, w, h * 0.45], [0, h * 0.65, w, h * 0.65],
     [w * 0.3, 0, w * 0.3, h], [w * 0.7, 0, w * 0.7, h]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.strokeStyle = "#e8e0d8"; ctx.lineWidth = 2;
    [[0, h * 0.3, w, h * 0.3], [w * 0.15, 0, w * 0.15, h],
     [w * 0.55, 0, w * 0.55, h]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    if (lat !== null && lng !== null) {
      // Red pin
      const cx = w / 2, cy = h / 2;
      ctx.fillStyle = "#e53e3e";
      ctx.beginPath(); ctx.arc(cx, cy - 16, 12, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, cy + 4); ctx.lineTo(cx - 10, cy - 10); ctx.lineTo(cx + 10, cy - 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy - 16, 5, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = "#9ca3af"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Map View", w / 2, h / 2 + 5);
    }

    // Border
    ctx.strokeStyle = "#d1d5db"; ctx.lineWidth = 1; ctx.strokeRect(0, 0, w, h);
    return c.toDataURL("image/png");
  };

  /** Sanitize oklch / lab / lch colors that html-to-image's canvas can't render. */
  const sanitizeColors = (element: HTMLElement) => {
    const re = /\b(lab|lch|oklch|oklab|color|display-p3|hwb)\s*\(/gi;
    const props = ["color","backgroundColor","borderColor","borderTopColor","borderBottomColor",
      "borderLeftColor","borderRightColor","outlineColor","boxShadow","textShadow","fill","stroke"] as const;
    element.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const s = window.getComputedStyle(el);
      props.forEach((p) => {
        const v = s[p];
        if (v && re.test(v)) {
          (el.style as any)[p] = p.toLowerCase().includes("background") ? "#ffffff" : "#000000";
        }
        re.lastIndex = 0;
      });
    });
  };

  // ════════════════════════════════════════════════════════════════════════════
  //  DOWNLOAD
  // ════════════════════════════════════════════════════════════════════════════
  const handleDownload = async () => {
    if (!previewRef.current) return;

    // Track everything we mutate so we can restore on cleanup
    const videoRestores: { video: HTMLVideoElement; placeholder: HTMLElement }[] = [];
    const iframeRestores: { iframe: HTMLIFrameElement; placeholder: HTMLElement }[] = [];
    const bgRestores: { el: HTMLElement; orig: string }[] = [];
    const srcsetRestores: { img: HTMLImageElement; srcset: string }[] = [];
    let restoreImages: (() => void) | null = null;

    try {
      setIsDownloading(true);
      setErrorMsg(null);

      const el = previewRef.current;

      // ── STEP 1: Strip srcset FIRST ──────────────────────────────────────────
      // Must happen before inlining so html-to-image never re-fetches via srcset.
      el.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        const ss = img.getAttribute("srcset");
        if (ss) {
          srcsetRestores.push({ img, srcset: ss });
          img.removeAttribute("srcset");
          img.removeAttribute("data-srcset");
        }
      });

      // ── STEP 2: Inline all images as base64 (ALL screen sizes) ─────────────
      await waitForImages(el);
      restoreImages = await inlineImages(el);
      await waitForImages(el);

      // ── STEP 3: Inline background-image CSS URLs ────────────────────────────
      const b64Cache = new Map<string, string>();
      const cachedDataUrl = async (url: string) => {
        if (b64Cache.has(url)) return b64Cache.get(url)!;
        const r = await toDataUrl(url);
        b64Cache.set(url, r);
        return r;
      };

      await Promise.all(
        Array.from(el.querySelectorAll<HTMLElement>("*")).map(async (node) => {
          const bg = node.style.backgroundImage || getComputedStyle(node).backgroundImage;
          const m = bg?.match(/url\(["']?([^"')]+)["']?\)/);
          if (m?.[1] && !m[1].startsWith("data:")) {
            bgRestores.push({ el: node, orig: node.style.backgroundImage });
            node.style.backgroundImage = `url("${await cachedDataUrl(m[1])}")`;
          }
        })
      );

      // ── STEP 4: Re-inline any remaining non-base64 srcs ────────────────────
     // ── STEP 4: Re-inline any remaining non-base64 srcs ────────────────────
await Promise.all(
  Array.from(el.querySelectorAll<HTMLImageElement>("img")).map(async (img) => {
    const src = img.getAttribute("src") || "";
    if (src && !src.startsWith("data:")) {
      img.src = await cachedDataUrl(src);
    }
  })
);

      // ── STEP 5: Replace <iframe> (Google Maps etc.) with canvas placeholder ─
      // We intentionally do NOT try toPng on the iframe parent — Google Maps is
      // always cross-origin, and that call will always throw a SecurityError.
      // A clean canvas placeholder is reliable and looks good in the download.
      el.querySelectorAll<HTMLIFrameElement>("iframe").forEach((iframe) => {
        const w = iframe.offsetWidth || 300;
        const h = iframe.offsetHeight || 200;
        const radius = getComputedStyle(iframe).borderRadius || "8px";
        const src = iframe.getAttribute("src") || "";

        const pbMatch = src.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
        const qMatch = src.match(/[?&]q=(-?[\d.]+),(-?[\d.]+)/);
        const lat = pbMatch ? parseFloat(pbMatch[1]) : qMatch ? parseFloat(qMatch[1]) : null;
        const lng = pbMatch ? parseFloat(pbMatch[2]) : qMatch ? parseFloat(qMatch[2]) : null;

        const mapDataUrl = drawMapCanvas(w, h, lat, lng);
        const img = document.createElement("img");
        img.src = mapDataUrl;
        img.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${radius};display:block;`;

        iframeRestores.push({ iframe, placeholder: img });
        iframe.parentNode!.replaceChild(img, iframe);
      });

      // ── STEP 6: Replace <video> with thumbnail / poster / placeholder ───────
      await Promise.all(
        Array.from(el.querySelectorAll<HTMLVideoElement>("video")).map(async (video) => {
          const w = video.offsetWidth || 320;
          const h = video.offsetHeight || 180;
          const radius = getComputedStyle(video).borderRadius || "0px";

          const placeholder = document.createElement("img");
          placeholder.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${radius};display:block;`;

          const poster = video.getAttribute("poster");

          if (poster) {
            // Use poster image
            placeholder.src = await cachedDataUrl(poster);
          } else {
            // Look for a sibling thumbnail <img> the carousel renders
            const parent = video.parentElement;
            const nearbyImg = parent?.querySelector<HTMLImageElement>("img") ??
              (video.previousElementSibling instanceof HTMLImageElement ? video.previousElementSibling : null) ??
              (video.nextElementSibling instanceof HTMLImageElement ? video.nextElementSibling : null);

            if (nearbyImg && nearbyImg.naturalWidth > 0) {
              const nearbySrc = nearbyImg.getAttribute("src") || "";
              placeholder.src = nearbySrc.startsWith("data:") ? nearbySrc : await cachedDataUrl(nearbySrc);
            } else {
              // Canvas play-button placeholder
              const c = document.createElement("canvas");
              c.width = w; c.height = h;
              const ctx = c.getContext("2d")!;
              ctx.fillStyle = "#d1d5db"; ctx.fillRect(0, 0, w, h);
              const cx = w / 2, cy = h / 2;
              ctx.fillStyle = "#ffffff";
              ctx.beginPath(); ctx.moveTo(cx - 14, cy - 18); ctx.lineTo(cx + 22, cy); ctx.lineTo(cx - 14, cy + 18); ctx.closePath(); ctx.fill();
              placeholder.src = c.toDataURL("image/png");
            }
          }

          videoRestores.push({ video, placeholder });
          video.parentNode!.replaceChild(placeholder, video);
        })
      );

      // ── STEP 7: Sanitize unsupported CSS color functions ────────────────────
      sanitizeColors(el);

      // ── STEP 8: Final paint settle ──────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 200));
      await waitForImages(el);

      // ── STEP 9: Capture ─────────────────────────────────────────────────────
      const options = {
        cacheBust: true,   // ensure fresh CORS headers on any remaining fetches
        pixelRatio: 2,
        skipFonts: true,   // prevents cross-origin stylesheet SecurityErrors
      };

      const fileName = `glam-card-${Date.now()}`;

      if (format === "png") {
        const dataUrl = await toPng(el, options);
        triggerDownload(dataUrl, `${fileName}.png`);
      } else {
        const dataUrl = await toJpeg(el, { ...options, quality: 0.95 });
        triggerDownload(dataUrl, `${fileName}.jpg`);
      }

    } catch (err) {
      console.error("[GlamCard download]", err);
      setErrorMsg("Something went wrong while generating the image. Please try again.");
    } finally {
      // ── Restore everything ──────────────────────────────────────────────────
      videoRestores.forEach(({ video, placeholder }) => {
        placeholder.parentNode?.replaceChild(video, placeholder);
      });
      iframeRestores.forEach(({ iframe, placeholder }) => {
        placeholder.parentNode?.replaceChild(iframe, placeholder);
      });
      bgRestores.forEach(({ el, orig }) => { el.style.backgroundImage = orig; });
      srcsetRestores.forEach(({ img, srcset }) => { img.setAttribute("srcset", srcset); });
      restoreImages?.();
      setIsDownloading(false);
    }
  };

  const triggerDownload = (dataUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  };

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════════
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden">

        {/* Drag handle (mobile only) */}
        <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 mx-auto mt-3 mb-1 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Preview Your Digital Card
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
          <div ref={previewRef}>
            <BusinessCardPage
              slug={datadownload?.business_card_link?.split("/").pop()}
              mode="download"
            />
          </div>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="px-4 sm:px-6 py-2 bg-red-50 text-red-600 text-xs sm:text-sm text-center flex-shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as "png" | "jpg")}
              className="flex-1 sm:flex-initial border border-gray-300 rounded-lg px-2 py-2 sm:py-1 text-sm"
            >
              <option value="png">PNG (High Quality)</option>
              <option value="jpg">JPG (Smaller Size)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-gray-300 text-sm whitespace-nowrap disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold whitespace-nowrap disabled:opacity-70"
            >
              {isDownloading ? (
                <><Loader2 size={16} className="animate-spin" /> Downloading…</>
              ) : (
                <><Download size={16} /> Download</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlamCardDownloadModal;