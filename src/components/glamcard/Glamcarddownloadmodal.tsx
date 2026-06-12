"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, X, Loader2 } from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import GlamCardLivePreview from "./GlamCardLivePreview";
import { GlamCardFormData } from "./GlamCardForm/types";
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
  // Stores base64 screenshots of each iframe (map) taken while they are still live in DOM
  const [iframeScreenshots, setIframeScreenshots] = useState<Map<HTMLIFrameElement, string>>(new Map());

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Force-load all lazy images when the modal opens.
  // Next.js lazy-loads images that are off-screen or in hidden containers,
  // so Signature Work gallery images never load until we trigger them here.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (!previewRef.current) return;
      const imgs = Array.from(previewRef.current.querySelectorAll<HTMLImageElement>("img"));
      imgs.forEach((img) => {
        // 1. Switch to eager so browser fetches immediately
        img.loading = "eager";

        // 2. Next.js puts real high-res URLs in srcset; src is often a tiny blur placeholder.
        //    Pick the largest srcset entry and use it as src so the full image loads.
        const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
        if (srcset) {
          const best = srcset
            .split(",")
            .map((s) => {
              const parts = s.trim().split(/\s+/);
              return { url: parts[0], width: parseInt(parts[1]) || 0 };
            })
            .sort((a, b) => b.width - a.width)[0];
          if (best?.url && !best.url.startsWith("data:")) {
            img.src = best.url;
          }
        }

        // 3. Handle explicit data-src / data-lazy-src lazy-load attributes
        const dataSrc = img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
        if (dataSrc) img.src = dataSrc;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // When modal opens, screenshot each iframe while it's still live.
  // This is the ONLY reliable way to capture Google Maps — we grab it before
  // html-to-image runs, then swap it in during download.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(async () => {
      if (!previewRef.current) return;
      const iframes = Array.from(previewRef.current.querySelectorAll<HTMLIFrameElement>("iframe"));
      if (iframes.length === 0) return;

      const screenshots = new Map<HTMLIFrameElement, string>();
      await Promise.all(iframes.map(async (iframe) => {
        try {
          const parent = iframe.parentElement;
          if (!parent) return;
          // Temporarily make iframe visible/accessible for capture
          const originalPointerEvents = iframe.style.pointerEvents;
          iframe.style.pointerEvents = "none";
          // Use toPng on the parent container which includes the iframe
       const dataUrl = await toPng(parent, {
  cacheBust: true,
  pixelRatio: 2,
  skipFonts: true,          // ← skips cross-origin stylesheet iteration (kills the SecurityError)
  fetchRequestInit: { mode: "cors" as RequestMode },
});
          screenshots.set(iframe, dataUrl);
          iframe.style.pointerEvents = originalPointerEvents;
        } catch {
          // iframe screenshot failed (cross-origin) — will use canvas fallback
        }
      }));
      setIframeScreenshots(screenshots);
    }, 1500); // wait 1.5s for Google Maps iframe to fully load its tiles
    return () => clearTimeout(timer);
  }, [isOpen]);

    const waitForImagesToLoad = async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );
  };

  /**
   * Converts an image URL to a base64 data URL.
   * First tries canvas (fastest), then blob fetch (handles CORS),
   * then falls back to the original src unchanged.
   */
  const toBase64DataUrl = (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const tryCanvas = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || 300;
            canvas.height = img.naturalHeight || 300;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/png");
            if (dataUrl === "data:,") return tryFetch();
            resolve(dataUrl);
          } catch {
            tryFetch();
          }
        };
        img.onerror = () => tryFetch();
        img.src = src + (src.includes("?") ? "&" : "?") + "_cb=" + Date.now();
      };

      const tryFetch = () => {
        fetch(src, { mode: "cors", cache: "no-cache" })
          .then((r) => {
            if (!r.ok) throw new Error("fetch failed");
            return r.blob();
          })
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(src);
            reader.readAsDataURL(blob);
          })
          .catch(() => resolve(src));
      };

      tryCanvas();
    });
  };

  /**
   * Replaces all <img> src with inline base64 data URLs so html-to-image
   * never hits cross-origin canvas taint. Returns a cleanup function.
   */
  const inlineAllImages = async (element: HTMLElement): Promise<() => void> => {
    const images = Array.from(element.querySelectorAll<HTMLImageElement>("img"));
    const restorations: { img: HTMLImageElement; originalSrc: string }[] = [];

    await Promise.all(
      images.map(async (img) => {
        const originalSrc = img.getAttribute("src") || "";
        if (!originalSrc || originalSrc.startsWith("data:")) return;
        const base64 = await toBase64DataUrl(originalSrc);
        restorations.push({ img, originalSrc });
        img.src = base64;
      })
    );

    return () => {
      restorations.forEach(({ img, originalSrc }) => {
        img.src = originalSrc;
      });
    };
  };

  const sanitizeUnsupportedColors = (element: HTMLElement) => {
    const all = element.querySelectorAll("*");
    const unsupportedColorRegex =
      /\b(lab|lch|oklch|oklab|color|display-p3|hwb)\s*\(/gi;

    const props = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderBottomColor",
      "borderLeftColor",
      "borderRightColor",
      "outlineColor",
      "boxShadow",
      "textShadow",
      "fill",
      "stroke",
    ] as const;

    all.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const computed = window.getComputedStyle(htmlEl);

      props.forEach((prop) => {
        const value = computed[prop];
        if (value && unsupportedColorRegex.test(value)) {
          (htmlEl.style as any)[prop] = prop.toLowerCase().includes("background")
            ? "#ffffff"
            : "#000000";
        }
        unsupportedColorRegex.lastIndex = 0;
      });
    });
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    const restorationMap: { video: HTMLVideoElement; placeholder: HTMLImageElement }[] = [];
    const iframeRestorationMap: { iframe: HTMLIFrameElement; placeholder: HTMLElement }[] = [];
    let restoreImages: (() => void) | null = null;
    const bgRestorationMap: { el: HTMLElement; originalBg: string }[] = [];
    const srcsetRestorationMap: { img: HTMLImageElement; srcset: string }[] = [];

    try {
      setIsDownloading(true);
      setErrorMsg(null);

      const element = previewRef.current;

      // Step 1: Wait for all images to load naturally
      await waitForImagesToLoad(element);

      // Step 2: Inline all <img> src as base64
      restoreImages = await inlineAllImages(element);
      await waitForImagesToLoad(element);

      // Step 3: Sanitize unsupported CSS color functions
      sanitizeUnsupportedColors(element);

      // Step 4: Replace <iframe> (Google Maps) with a screenshotted image.
      // Strategy: use html-to-image on the iframe's PARENT container BEFORE we remove it,
      // then replace the iframe with that screenshot image.
      // If that fails (cross-origin), fall back to a styled address card using data we have.
      const iframes = Array.from(element.querySelectorAll<HTMLIFrameElement>("iframe"));
      await Promise.all(iframes.map(async (iframe) => {
        const w = iframe.offsetWidth || 300;
        const h = iframe.offsetHeight || 200;
        const radius = getComputedStyle(iframe).borderRadius || "8px";
        const src = iframe.getAttribute("src") || "";

        // Extract lat/lng from Google Maps embed URL
        const pbMatch = src.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
        const qMatch = src.match(/[?&]q=(-?[\d.]+),(-?[\d.]+)/);
        const lat = pbMatch ? parseFloat(pbMatch[1]) : qMatch ? parseFloat(qMatch[1]) : null;
        const lng = pbMatch ? parseFloat(pbMatch[2]) : qMatch ? parseFloat(qMatch[2]) : null;

        let placeholder: HTMLElement;

        if (lat !== null && lng !== null) {
          // Use maps.geoapify.com static map — supports CORS, no API key needed for basic use
          const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${w * 2}&height=${h * 2}&center=lonlat:${lng},${lat}&zoom=15&marker=lonlat:${lng},${lat};color:%23e53e3e;size:medium&apiKey=YOUR_GEOAPIFY_KEY`;

          // Try fetching the static map as base64
          const base64Map = await toBase64DataUrl(
            `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=${w}x${h}&markers=${lat},${lng},red`
          );

          if (!base64Map.startsWith("http")) {
            const mapImg = document.createElement("img");
            mapImg.src = base64Map;
            mapImg.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${radius};display:block;`;
            placeholder = mapImg;
          } else {
            // All tile sources failed — draw a clean styled map placeholder on canvas
            const mapCanvas = document.createElement("canvas");
            mapCanvas.width = w;
            mapCanvas.height = h;
            const ctx = mapCanvas.getContext("2d")!;

            // Background — light map color
            ctx.fillStyle = "#f2efe9";
            ctx.roundRect(0, 0, w, h, 0);
            ctx.fill();

            // Draw some fake roads for visual resemblance
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 6;
            [[0, h * 0.45, w, h * 0.45], [0, h * 0.65, w, h * 0.65], [w * 0.3, 0, w * 0.3, h], [w * 0.7, 0, w * 0.7, h]].forEach(([x1,y1,x2,y2]) => {
              ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            });
            ctx.strokeStyle = "#e8e0d8";
            ctx.lineWidth = 2;
            [[0, h * 0.3, w, h * 0.3], [w * 0.15, 0, w * 0.15, h], [w * 0.55, 0, w * 0.55, h]].forEach(([x1,y1,x2,y2]) => {
              ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            });

            // Red pin marker at center
            const cx = w / 2, cy = h / 2;
            ctx.fillStyle = "#e53e3e";
            ctx.beginPath(); ctx.arc(cx, cy - 16, 12, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(cx, cy + 4); ctx.lineTo(cx - 10, cy - 10); ctx.lineTo(cx + 10, cy - 10); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(cx, cy - 16, 5, 0, Math.PI * 2); ctx.fill();

            // Border
            ctx.strokeStyle = "#d1d5db";
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, w, h);

            const mapImg = document.createElement("img");
            mapImg.src = mapCanvas.toDataURL("image/png");
            mapImg.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${radius};display:block;`;
            placeholder = mapImg;
          }
        } else {
          // No coords — plain grey placeholder
          const mapCanvas = document.createElement("canvas");
          mapCanvas.width = w; mapCanvas.height = h;
          const ctx = mapCanvas.getContext("2d")!;
          ctx.fillStyle = "#e8edf2";
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "#9ca3af";
          ctx.font = "13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Map View", w / 2, h / 2 + 5);
          const mapImg = document.createElement("img");
          mapImg.src = mapCanvas.toDataURL();
          mapImg.style.cssText = `width:${w}px;height:${h}px;border-radius:${radius};display:block;`;
          placeholder = mapImg;
        }

        // ✅ Priority: use the pre-captured screenshot taken when modal opened
        const savedScreenshot = iframeScreenshots.get(iframe);
        if (savedScreenshot) {
          const screenshotImg = document.createElement("img");
          screenshotImg.src = savedScreenshot;
          screenshotImg.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${radius};display:block;`;
          placeholder = screenshotImg;
        }

        iframeRestorationMap.push({ iframe, placeholder });
        iframe.parentNode!.replaceChild(placeholder, iframe);
      }));

      // Step 5: Replace <video> elements.
      // Strategy: the carousel already has thumbnail <img> elements next to each video.
      // Find those existing thumbnails and use them — much more reliable than frame extraction.
      // For videos with a poster attribute, convert poster to base64.
      // For videos with no poster and no nearby thumbnail, use a canvas placeholder.
      const videos = Array.from(element.querySelectorAll<HTMLVideoElement>("video"));

      await Promise.all(
        videos.map(
          (video) =>
            new Promise<void>(async (resolve) => {
              const w = video.offsetWidth;
              const h = video.offsetHeight;
              const radius = getComputedStyle(video).borderRadius;

              const img = document.createElement("img");
              img.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${radius};display:block;`;

              const poster = video.getAttribute("poster");

              const makeFallbackThumbnail = () => {
                const canvas = document.createElement("canvas");
                canvas.width = w || 160; canvas.height = h || 120;
                const ctx = canvas.getContext("2d")!;
                ctx.fillStyle = "#d1d5db";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#ffffff";
                const cx = canvas.width / 2, cy = canvas.height / 2;
                ctx.beginPath();
                ctx.moveTo(cx - 14, cy - 18);
                ctx.lineTo(cx + 22, cy);
                ctx.lineTo(cx - 14, cy + 18);
                ctx.closePath();
                ctx.fill();
                return canvas.toDataURL("image/png");
              };

              if (poster) {
                img.src = await toBase64DataUrl(poster);
              } else {
                // Look for a sibling/nearby <img> that acts as this video's thumbnail
                // (carousel components typically render an <img> alongside the <video>)
                const parent = video.parentElement;
                const nearbyImg = parent?.querySelector<HTMLImageElement>("img") ||
                  video.previousElementSibling as HTMLImageElement ||
                  video.nextElementSibling as HTMLImageElement;

                if (nearbyImg?.tagName === "IMG" && nearbyImg.naturalWidth > 0) {
                  // Use the already-loaded thumbnail image src directly
                  const nearbySrc = nearbyImg.getAttribute("src") || "";
                  img.src = nearbySrc.startsWith("data:") ? nearbySrc : await toBase64DataUrl(nearbySrc);
                } else {
                  // Last resort: try blob fetch, then fallback to placeholder
                  const videoSrc = video.currentSrc || video.src || video.querySelector("source")?.getAttribute("src") || "";
                  try {
                    if (!videoSrc) throw new Error("no src");
                    const resp = await fetch(videoSrc, { mode: "cors", cache: "no-cache" });
                    if (!resp.ok) throw new Error("fetch failed");
                    const blob = await resp.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const bv = document.createElement("video");
                    bv.muted = true; bv.playsInline = true; bv.preload = "auto";
                    await new Promise<void>((res, rej) => {
                      const t = setTimeout(() => rej(), 5000);
                      bv.onloadeddata = () => { clearTimeout(t); res(); };
                      bv.onerror = () => { clearTimeout(t); rej(); };
                      bv.src = blobUrl; bv.load();
                    });
                    bv.currentTime = 0.1;
                    await new Promise<void>((r) => setTimeout(r, 300));
                    const canvas = document.createElement("canvas");
                    canvas.width = bv.videoWidth || w; canvas.height = bv.videoHeight || h;
                    canvas.getContext("2d")!.drawImage(bv, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/png");
                    img.src = dataUrl === "data:," ? makeFallbackThumbnail() : dataUrl;
                    URL.revokeObjectURL(blobUrl);
                  } catch {
                    img.src = makeFallbackThumbnail();
                  }
                }
              }

              restorationMap.push({ video, placeholder: img });
              video.parentNode!.replaceChild(img, video);
              resolve();
            })
        )
      );

      await waitForImagesToLoad(element);

      // Step 6: Inline background-image CSS urls (covers hero/banner images in style attrs)
      const base64Cache = new Map<string, string>();
      const getCachedBase64 = async (url: string) => {
        if (base64Cache.has(url)) return base64Cache.get(url)!;
        const result = await toBase64DataUrl(url);
        base64Cache.set(url, result);
        return result;
      };

      const allEls = Array.from(element.querySelectorAll<HTMLElement>("*"));
      await Promise.all(
        allEls.map(async (el) => {
          const bg = el.style.backgroundImage || getComputedStyle(el).backgroundImage;
          const match = bg?.match(/url\(["']?([^"')]+)["']?\)/);
          if (match?.[1] && !match[1].startsWith("data:")) {
            bgRestorationMap.push({ el, originalBg: el.style.backgroundImage });
            el.style.backgroundImage = `url("${await getCachedBase64(match[1])}")`;
          }
        })
      );

      // Step 7: Strip srcset — Next.js <Image> uses srcset, which html-to-image
      // re-fetches internally, bypassing our base64 src swap and hitting CORS again.
      const allImgs = Array.from(element.querySelectorAll<HTMLImageElement>("img"));
      await Promise.all(
        allImgs.map(async (img) => {
          const ss = img.getAttribute("srcset");
          if (ss) {
            srcsetRestorationMap.push({ img, srcset: ss });
            img.removeAttribute("srcset");
            img.removeAttribute("data-srcset");
          }
          // Re-inline src for any lazy-loaded images missed in earlier pass
          const src = img.getAttribute("src") || "";
          if (src && !src.startsWith("data:")) {
            img.src = await getCachedBase64(src);
          }
        })
      );

      // Give browser time to paint all swapped srcs
      await new Promise((r) => setTimeout(r, 200));
      await waitForImagesToLoad(element);

      const fileName = `glam-card-${Date.now()}`;
      const options = {
        cacheBust: false,
        pixelRatio: 3,
        skipFonts: true,
        fetchRequestInit: { mode: "cors" as RequestMode, cache: "no-cache" as RequestCache },
      };

      if (format === "png") {
        const dataUrl = await toPng(element, options);
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const dataUrl = await toJpeg(element, { ...options, quality: 0.95 });
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong while generating the image.");
    } finally {
      // Restore <video> elements
      restorationMap.forEach(({ video, placeholder }) => {
        if (placeholder.parentNode) {
          placeholder.parentNode.replaceChild(video, placeholder);
        }
      });
      // Restore <iframe> elements
      iframeRestorationMap.forEach(({ iframe, placeholder }) => {
        if (placeholder.parentNode) {
          placeholder.parentNode.replaceChild(iframe, placeholder);
        }
      });
      // Restore background images
      bgRestorationMap.forEach(({ el, originalBg }) => {
        el.style.backgroundImage = originalBg;
      });
      // Restore srcset
      srcsetRestorationMap.forEach(({ img, srcset }) => {
        img.setAttribute("srcset", srcset);
      });
      // Restore original image srcs
      restoreImages?.();
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden">
        {/* drag handle (mobile) */}
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

        {/* Preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
          <div ref={previewRef}>
            <BusinessCardPage
              slug={datadownload?.business_card_link?.split("/").pop()}
              mode="download"
            />
          </div>
        </div>

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
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Downloading…
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlamCardDownloadModal;