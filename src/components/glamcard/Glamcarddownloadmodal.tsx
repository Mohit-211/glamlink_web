import React, { useEffect, useRef, useState } from "react";
import { Download, X, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import GlamCardLivePreview from "./GlamCardLivePreview";
import { GlamCardFormData } from "./GlamCardForm/types";
 import { toPng, toJpeg } from "html-to-image";

interface GlamCardDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GlamCardFormData;
}

const GlamCardDownloadModal: React.FC<GlamCardDownloadModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "jpg">("png");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const waitForImagesToLoad = async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );
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
        // Reset to a safe fallback — tweak these as needed
        (htmlEl.style as any)[prop] = prop.toLowerCase().includes("background")
          ? "#ffffff"
          : "#000000";
      }
      // reset regex lastIndex since it's global
      unsupportedColorRegex.lastIndex = 0;
    });
  });
};
const handleDownload = async () => {
  if (!previewRef.current) return;

  setIsDownloading(true);
  setErrorMsg(null);

  try {
    const element = previewRef.current;

    await waitForImagesToLoad(element);

    // ✅ Sanitize modern CSS colors html2canvas can't parse
    sanitizeUnsupportedColors(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: format === "jpg" ? "#ffffff" : null,
      logging: false,
    });

    const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
    const quality = format === "jpg" ? 0.92 : 1.0;
    const dataUrl = canvas.toDataURL(mimeType, quality);

    const link = document.createElement("a");
    link.download = `glam_card.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Canvas error:", error);
    setErrorMsg("Image conversion failed. Check console.");
  } finally {
    setIsDownloading(false);
  }
};
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Preview Your Digital Card
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div ref={previewRef}>
            <GlamCardLivePreview
              data={data}
              mode="download"
              sticky={false}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="px-6 py-2 bg-red-50 text-red-600 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Format:
            </label>
            <select
              value={format}
              onChange={(e) =>
                setFormat(e.target.value as "png" | "jpg")
              }
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value="png">PNG (High Quality)</option>
              <option value="jpg">JPG (Smaller Size)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold"
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