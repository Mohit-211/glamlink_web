"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareProductButtonProps {
  url: string;
  title: string;
}

const ShareProductButton = ({ url, title }: ShareProductButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // User cancelled the share sheet, or share isn't supported for
        // this content — fall through to the clipboard copy instead.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy Error:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </button>
  );
};

export default ShareProductButton;
