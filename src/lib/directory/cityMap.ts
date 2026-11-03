import type { StaticImageData } from "next/image";
import type { MapBounds } from "@/lib/api/public";
import type { MapPin } from "@/lib/api/types";
import lasVegasTerrain from "../../../public/directory/las-vegas-terrain.png";

/*
 * The directory hero's map (the owner, Nov 3): a terrain view of one city with a pin
 * for each Glamlink professional there. Las Vegas for now, where most of them are;
 * ideally the visitor's own city later, which is a new entry here.
 *
 * Two pictures of the same place, both Web Mercator:
 *   google  Google's Static Maps terrain image (lib/directory/staticMap.ts), once the
 *           site has a key for it. One map load per view, the cheapest of Google's maps.
 *   still   a still from USGS The National Map (public domain, USGSTopo) shipped with
 *           the site, shown while there is no key. Redraw it from
 *           basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/export with
 *           the box from `mercatorBox` (bboxSR and imageSR 3857, 1280×1120).
 * The pins are placed with the shown picture's own center and zoom, so they land where
 * it shows the place.
 */

/** What a picture of the map shows: `center` and `zoom` at `width` × `height` CSS pixels. */
export interface MapFrame {
  center: { lat: number; lng: number };
  /** Web Mercator zoom: whole for Google, fractional for the still. */
  zoom: number;
  width: number;
  height: number;
}

export interface CityMap {
  city: string;
  /** Two-letter state, as the Professionals page filters it. */
  state: string;
  label: string;
  google: MapFrame;
  still: MapFrame & { image: StaticImageData; credit: string };
}

export const LAS_VEGAS_MAP: CityMap = {
  city: "Las Vegas",
  state: "NV",
  label: "Las Vegas, NV",
  google: { center: { lat: 36.13, lng: -115.17 }, zoom: 11, width: 640, height: 560 },
  still: {
    center: { lat: 36.13, lng: -115.17 },
    zoom: 10.6,
    width: 640,
    height: 560,
    image: lasVegasTerrain,
    credit: "USGS The National Map",
  },
};

const EARTH_RADIUS = 6378137;
const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

/** Web Mercator metres (EPSG:3857) of a point. */
const mercator = (lat: number, lng: number) => ({
  x: EARTH_RADIUS * toRadians(lng),
  y: EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + toRadians(lat) / 2)),
});

/** The frame's box in Web Mercator metres: what the picture shows. */
export function mercatorBox(frame: MapFrame) {
  const metresPerPixel = (2 * Math.PI * EARTH_RADIUS) / (256 * 2 ** frame.zoom);
  const { x, y } = mercator(frame.center.lat, frame.center.lng);
  const halfWidth = (frame.width / 2) * metresPerPixel;
  const halfHeight = (frame.height / 2) * metresPerPixel;
  return { minX: x - halfWidth, minY: y - halfHeight, maxX: x + halfWidth, maxY: y + halfHeight };
}

/** The frame's box in degrees, to ask the API for the pins inside it. */
export function mapBounds(frame: MapFrame): MapBounds {
  const box = mercatorBox(frame);
  const lat = (y: number) => toDegrees(2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2);
  const lng = (x: number) => toDegrees(x / EARTH_RADIUS);
  const round = (n: number) => Math.round(n * 10000) / 10000;
  return { north: round(lat(box.maxY)), south: round(lat(box.minY)), east: round(lng(box.maxX)), west: round(lng(box.minX)) };
}

/** Where a point sits on the picture, in percent from its left and top edges; null outside it. */
export function mapPosition(frame: MapFrame, lat: number, lng: number): { x: number; y: number } | null {
  const box = mercatorBox(frame);
  const { x, y } = mercator(lat, lng);
  const left = ((x - box.minX) / (box.maxX - box.minX)) * 100;
  const top = ((box.maxY - y) / (box.maxY - box.minY)) * 100;
  if (left < 0 || left > 100 || top < 0 || top > 100) return null;
  return { x: left, y: top };
}

/** Pins this close (in the map's CSS pixels) share one marker: a photo pin is about 44 pixels wide. */
const MERGE_PIXELS = 40;
/** Markers stay this far (in percent) from the edges, so a photo near the border isn't cut off. */
const EDGE = { x: 6, y: 14 };

export interface MapMarker {
  /** Percent from the left and top edges: where the marker's point touches the map. */
  x: number;
  y: number;
  /** Featured professionals first, as the API orders them. */
  pins: MapPin[];
}

/** The pins as markers: those that would overlap are grouped, at the first one's place. */
export function mapMarkers(frame: MapFrame, pins: MapPin[]): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const pin of pins) {
    const at = mapPosition(frame, pin.latitude, pin.longitude);
    if (!at) continue;
    const near = markers.find(
      (m) => Math.hypot(((m.x - at.x) / 100) * frame.width, ((m.y - at.y) / 100) * frame.height) < MERGE_PIXELS
    );
    if (near) near.pins.push(pin);
    else markers.push({ ...at, pins: [pin] });
  }
  const clamp = (n: number, edge: number) => Math.min(100 - edge, Math.max(edge, n));
  // The topmost marker drawn first, so a lower one's photo covers the pointer above it
  return markers.map((m) => ({ ...m, x: clamp(m.x, EDGE.x), y: clamp(m.y, EDGE.y) })).sort((a, b) => a.y - b.y);
}
