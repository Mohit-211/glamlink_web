"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children" | "title"> & {
  /** The link to share: the page's canonical URL. */
  url: string;
  /** The share sheet's title. */
  title: string;
  /** The share sheet's text, when the platform shows one. */
  text?: string;
  label?: string;
};

/** Copies text where the Clipboard API is missing or refused (an insecure origin, an old browser). */
function copyWithSelection(text: string) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return copyWithSelection(url);
  }
}

/**
 * Shares a link through the device's share sheet, else copies it and says so.
 * Other attributes (a class, `data-*` for click counting) go on the button.
 */
export default function ShareButton({ url, title, text, label = "Share", className, ...rest }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // Closing the sheet is a choice, not a failure; anything else falls back to copying
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (await copyLink(url)) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } else {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <button type="button" onClick={share} className={cn("inline-flex items-center gap-2", className)} {...rest}>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Link copied" : label}</span>
    </button>
  );
}
