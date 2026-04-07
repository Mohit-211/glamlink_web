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
  // data: GlamCardFormData;
  datadownload:any
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

  // Prevent scrolling behind modal
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Wait for all images in the preview to load
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

  // Fix unsupported CSS colors (for Tailwind / modern CSS)
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

    try {
      setIsDownloading(true);
      setErrorMsg(null);

      const element = previewRef.current;

      // Wait for all images to load
      await waitForImagesToLoad(element);

      // Sanitize unsupported CSS colors
      sanitizeUnsupportedColors(element);

      const fileName = `glam-card-${Date.now()}`;

      // Exclude videos to prevent tainted canvas
      const filterFn = (node: HTMLElement) => node.tagName !== "VIDEO";

      if (format === "png") {
        const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 3, filter: filterFn });
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const dataUrl = await toJpeg(element, { cacheBust: true, quality: 0.95, pixelRatio: 3, filter: filterFn });
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong while generating the image.");
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
            {/* <GlamCardLivePreview data={data} mode="download" sticky={false} /> */}
                         <BusinessCardPage slug={datadownload?.business_card_link.split('/').pop()} mode="download" />

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
            <label className="text-sm text-gray-600 font-medium">Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as "png" | "jpg")}
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