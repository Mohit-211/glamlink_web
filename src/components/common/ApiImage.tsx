"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { API_ORIGIN, SITE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

/*
 * Images from the API, sized by the API: /images/<file>?w=<width> answers a WebP
 * at most that wide (backend handoff, section 10.8), so the browser downloads a
 * 400 px tile instead of the original upload. Files in subfolders (QR codes) and
 * GIFs are served as they are. Other remote hosts (YouTube thumbnails, Google
 * photos) load unoptimized; the site's own files go through next/image as usual.
 */

const apiImageLoader = ({ src, width }: ImageLoaderProps) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  return url.toString();
};

function isApiResizable(src: string) {
  if (!API_ORIGIN || !src.startsWith(`${API_ORIGIN}/images/`)) return false;
  const file = new URL(src).pathname.slice("/images/".length);
  return file.length > 0 && !file.includes("/") && !/\.gif$/i.test(file);
}

function isOwnImage(src: string) {
  return src.startsWith("/") || src.startsWith(`${SITE_URL}/`);
}

type ApiImageProps = Omit<ImageProps, "src" | "loader"> & {
  src: string | null | undefined;
  /** Shown instead of the image when there is none. */
  placeholderClassName?: string;
};

export default function ApiImage({ src, alt, className, placeholderClassName, fill, ...props }: ApiImageProps) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground/50",
          fill && "absolute inset-0",
          placeholderClassName
        )}
      >
        <ImageIcon className="h-8 w-8" />
      </div>
    );
  }

  if (isApiResizable(src)) {
    return <Image src={src} alt={alt} fill={fill} loader={apiImageLoader} className={className} {...props} />;
  }

  if (isOwnImage(src)) {
    // The site's own files by path, so they are optimized from disk, not fetched back over HTTP
    const path = src.startsWith(SITE_URL) ? src.slice(SITE_URL.length) || "/" : src;
    return <Image src={path} alt={alt} fill={fill} className={className} {...props} />;
  }

  return <Image src={src} alt={alt} fill={fill} unoptimized className={className} {...props} />;
}
