"use client";

import { useState } from "react";

interface DownloadButtonProps {
  fileUrl: string;
  fileName?: string;
  label?: string;
  className?: string;
}

export default function DownloadButton({
  fileUrl,
  fileName,
  label = "Download",
  className = "",
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getDownloadName = () => {
    if (fileName) return fileName;
    try {
      const clean = fileUrl.split("?")[0];
      return clean.split("/").pop() || "download";
    } catch {
      return "download";
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getDownloadName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Direct download failed, falling back to opening file:", error);
      // Fallback: open in a new tab if fetch fails (e.g. CORS-blocked file host)
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
    >
      {isDownloading ? "Downloading..." : label}
    </button>
  );
}