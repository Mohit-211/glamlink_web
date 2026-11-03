import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mapMarkers, type CityMap, type MapFrame } from "@/lib/directory/cityMap";
import { staticMapUrl } from "@/lib/directory/staticMap";
import type { MapPin } from "@/lib/api/types";
import { listHref } from "@/lib/searchParams";
import MapMarkers from "./MapMarkers";

export interface OtherCity {
  city: string;
  /** Two-letter state, or the place as written outside the U.S. states. */
  state: string;
  count: number;
}

/** The picture the hero shows: Google's map when the site has a key for it, else the still (lib/directory/cityMap.ts). */
export function mapView(map: CityMap): { frame: MapFrame; google: string | null } {
  const google = staticMapUrl(map.google);
  return { frame: google ? map.google : map.still, google };
}

interface DirectoryMapProps {
  map: CityMap;
  view: ReturnType<typeof mapView>;
  pins: MapPin[];
  /** Every professional on the map, when the API said (it sends at most 100 pins). */
  count: number | null;
  /** Where else Glamlink has professionals, most first. */
  elsewhere: OtherCity[];
}

const professionalsHref = (state: string, city: string) => listHref("/professionals", { state, city });

/**
 * The directory hero's visual: the city's terrain map with a photo pin for each Glamlink professional, and links to
 * the city's and the other cities' professionals. Nothing covers Google's logo and attribution in the picture's
 * bottom corners, as Google's terms ask: the count sits under the map.
 */
export default function DirectoryMap({ map, view, pins, count, elsewhere }: DirectoryMapProps) {
  const { frame, google } = view;
  const markers = mapMarkers(frame, pins);
  const cityHref = professionalsHref(map.state, map.city);
  const shown = count ?? pins.length;

  return (
    <figure className="w-full max-w-xl lg:max-w-none">
      <div
        className="relative overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-large"
        style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
      >
        {google ? (
          // Straight from Google: their terms don't allow keeping or re-serving the picture
          <Image src={google} alt={`Terrain map of ${map.label}`} fill unoptimized preload className="object-cover" />
        ) : (
          <>
            <Image
              src={map.still.image}
              alt={`Terrain map of ${map.label}`}
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, (min-width: 640px) 576px, 100vw"
              className="object-cover"
            />
            {/* The same teal cast as the other heroes' photos */}
            <div aria-hidden="true" className="absolute inset-0 bg-primary/15 mix-blend-color" />
            <p className="absolute right-2 top-2 rounded-md bg-card/85 px-1.5 py-0.5 text-xs text-muted-foreground">
              Map: {map.still.credit}
            </p>
          </>
        )}

        <MapMarkers markers={markers} city={map.city} cityHref={cityHref} />
      </div>

      <figcaption className="mt-4 space-y-2 text-sm">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="eyebrow">On Glamlink</span>
          <span className="font-semibold">
            {shown > 0 ? `${shown} professional${shown === 1 ? "" : "s"} in ${map.city}` : `Professionals in ${map.city}`}
          </span>
          <Link href={cityHref} className="link-glamlink inline-flex items-center gap-1">
            See all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
        {elsewhere.length > 0 && (
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Also in</span>
            {elsewhere.map((place) => (
              <Link
                key={`${place.state}|${place.city}`}
                href={professionalsHref(place.state, place.city)}
                className="chip rounded-full px-3 py-1 text-xs"
              >
                {place.city}
                <span className="ml-1 opacity-70">{place.count}</span>
              </Link>
            ))}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
