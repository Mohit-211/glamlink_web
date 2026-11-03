"use client";

import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ProfileMedia } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { mediaLabel, mediaThumb, playerFor } from "./media";
import { trackAs } from "./profileEvents";

/*
 * A page's photos and videos as tiles that open a lightbox: photos whole, MP4s in
 * <video>, YouTube and Vimeo in their players. "strip" is the profile's row of
 * five (a swiped row on phones); "grid" is the "View all" page.
 */

const LAYOUT = {
  strip: {
    list: "no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0",
    item: "w-[40%] shrink-0 snap-start sm:w-auto",
    sizes: "(min-width: 1280px) 160px, (min-width: 1024px) 14vw, (min-width: 640px) 19vw, 40vw",
  },
  grid: {
    list: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-6",
    item: "",
    sizes: "(min-width: 1280px) 200px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  },
} as const;

function PlayMark({ large = false }: { large?: boolean }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <span
        className={cn(
          "flex items-center justify-center rounded-full border-2 border-overlay-foreground/90 bg-overlay/30 text-overlay-foreground backdrop-blur-[2px] transition-transform duration-300 group-hover:scale-110",
          large ? "h-14 w-14" : "h-11 w-11"
        )}
      >
        <Play className={cn("ml-0.5 fill-current", large ? "h-6 w-6" : "h-5 w-5")} />
      </span>
    </span>
  );
}

function Tile({ item, label, sizes, onOpen }: { item: ProfileMedia; label: string; sizes: string; onOpen: () => void }) {
  const thumb = mediaThumb(item);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      aria-haspopup="dialog"
      className="group relative block aspect-3/4 w-full overflow-hidden rounded-2xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      {...trackAs("MEDIA_CLICK", item.id)}
    >
      {thumb ? (
        <ApiImage
          src={thumb}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 bg-overlay/80" />
      )}
      {item.kind === "video" && <PlayMark />}
    </button>
  );
}

/** One item, as large as the lightbox allows. */
function Stage({ item }: { item: ProfileMedia }) {
  const alt = item.alt || item.caption || "";

  if (item.kind === "image") {
    return (
      <div className="relative h-full w-full">
        <ApiImage src={item.url} alt={alt} fill sizes="100vw" className="object-contain" />
      </div>
    );
  }

  const player = playerFor(item, { autoplay: true });
  if (!player) {
    return <p className="text-center text-sm text-overlay-foreground/80">This video can&apos;t play here.</p>;
  }
  if (player.type === "embed") {
    return (
      <div className="aspect-video w-full max-w-[min(100%,calc((100dvh-11rem)*16/9))] overflow-hidden rounded-xl bg-overlay">
        <iframe
          src={player.src}
          title={alt || "Video"}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
    );
  }
  return (
    <video
      src={player.src}
      poster={item.thumbnail ?? undefined}
      controls
      autoPlay
      playsInline
      className="max-h-full max-w-full rounded-xl bg-overlay"
    />
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: ProfileMedia[];
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const touchX = useRef<number | null>(null);
  const item = index === null ? null : (items[index] ?? null);
  const total = items.length;

  const step = (by: 1 | -1) => {
    if (index === null || total < 2) return;
    onIndex((index + by + total) % total);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    // A focused video seeks with the arrow keys
    if ((event.target as HTMLElement).tagName === "VIDEO") return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const onTouchStart = (event: TouchEvent) => {
    touchX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    const end = event.changedTouches[0]?.clientX;
    if (start === null || end === undefined || Math.abs(end - start) < 50) return;
    step(end < start ? 1 : -1);
  };

  const control =
    "flex h-11 w-11 items-center justify-center rounded-full bg-overlay-foreground/10 text-overlay-foreground transition-colors hover:bg-overlay-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay-foreground";

  return (
    <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        onKeyDown={onKeyDown}
        className="left-0 top-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-overlay/85 p-0 text-overlay-foreground shadow-none sm:max-w-none"
      >
        {item && index !== null && (
          <>
            <DialogTitle className="sr-only">{mediaLabel(item, index, total)}</DialogTitle>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-sm tabular-nums text-overlay-foreground/80" aria-hidden="true">
                {index + 1} / {total}
              </p>
              <DialogClose className={control}>
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
              onClick={(event) => event.target === event.currentTarget && onClose()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Stage key={`${item.source}-${item.id}`} item={item} />
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className={cn(control, "absolute left-3 top-1/2 hidden -translate-y-1/2 sm:flex")}
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className={cn(control, "absolute right-3 top-1/2 hidden -translate-y-1/2 sm:flex")}
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">Next</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex min-h-16 items-center justify-center gap-4 px-4 pb-5 pt-3 sm:px-6">
              {total > 1 && (
                <button type="button" onClick={() => step(-1)} className={cn(control, "sm:hidden")}>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Previous</span>
                </button>
              )}
              <p className="line-clamp-3 max-w-2xl flex-1 text-center text-sm leading-relaxed text-overlay-foreground/90 sm:flex-none">
                {item.caption}
              </p>
              {total > 1 && (
                <button type="button" onClick={() => step(1)} className={cn(control, "sm:hidden")}>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Next</span>
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function MediaGallery({
  items,
  layout = "strip",
  label = "Media & Images",
}: {
  items: ProfileMedia[];
  layout?: keyof typeof LAYOUT;
  label?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const style = LAYOUT[layout];

  return (
    <>
      <ul aria-label={label} className={style.list}>
        {items.map((item, index) => (
          <li key={`${item.source}-${item.id}`} className={style.item}>
            <Tile
              item={item}
              label={mediaLabel(item, index, items.length)}
              sizes={style.sizes}
              onOpen={() => setOpen(index)}
            />
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
