"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthorAvatar from "@/components/blogs/AuthorAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { MapMarker } from "@/lib/directory/cityMap";
import { profileHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface MapMarkersProps {
  markers: MapMarker[];
  /** "Las Vegas", for the group list's link to the city's professionals. */
  city: string;
  cityHref: string;
}

/** A professional's photo in a round pin, its point on the place. */
function PinFace({ name, image, count }: { name: string; image: string | null; count?: number }) {
  return (
    <span className="relative block transition-transform duration-200 group-hover:-translate-y-0.5">
      <AuthorAvatar
        name={name}
        image={image}
        size={44}
        className="size-9! text-sm shadow-medium ring-[3px] ring-card sm:size-11!"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-full -mt-1.5 size-2.5 -translate-x-1/2 rotate-45 bg-card shadow-soft"
      />
      {count && count > 1 && (
        <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground ring-2 ring-card">
          {count}
        </span>
      )}
    </span>
  );
}

/**
 * The pins on the directory hero's map: one professional's opens their page; a group (people close enough to
 * overlap) opens a list of them.
 */
export default function MapMarkers({ markers, city, cityHref }: MapMarkersProps) {
  return (
    <ul aria-label={`Glamlink professionals on the map of ${city}`} className="absolute inset-0">
      {markers.map((marker) => {
        const [first] = marker.pins;
        const group = marker.pins.length > 1;
        return (
          <li
            key={first.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+6px)] hover:z-20 focus-within:z-20"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            {group ? (
              <Popover>
                <PopoverTrigger
                  aria-label={`${marker.pins.length} professionals here: ${marker.pins.map((p) => p.name).join(", ")}`}
                  className="group block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  <PinFace name={first.name} image={first.image} count={marker.pins.length} />
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={12} className="w-72 rounded-2xl p-2">
                  <p className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {marker.pins.length} professionals here
                  </p>
                  <ul className="max-h-64 overflow-y-auto">
                    {marker.pins.map((pin) => (
                      <li key={pin.id}>
                        <Link
                          href={profileHref(pin.slug)}
                          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
                        >
                          <AuthorAvatar name={pin.name} image={pin.image} size={36} className="text-sm" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{pin.name}</span>
                            {pin.specialty && (
                              <span className="block truncate text-xs text-muted-foreground">{pin.specialty}</span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={cityHref}
                    className="link-glamlink mt-1 flex items-center gap-1 border-t border-border px-2 pb-1 pt-2.5 text-sm"
                  >
                    All professionals in {city}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                href={profileHref(first.slug)}
                aria-label={[first.name, first.specialty].filter(Boolean).join(", ")}
                className="group block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <PinFace name={first.name} image={first.image} />
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background shadow-medium",
                    "opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  )}
                >
                  {first.name}
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
