import { createHmac } from "node:crypto";
import type { MapFrame } from "./cityMap";

/*
 * Google's Static Maps for the directory hero (server only: it signs with a secret).
 *
 * Cost (the owner, Nov 3: "cost optimization is really important"): the cheapest of Google's maps, one billed load
 * per page view, no script. Every visitor gets the same address, so browsers keep the picture between visits.
 *
 *   GOOGLE_MAPS_STATIC_KEY       a key with the Maps Static API on, restricted to the site's addresses (HTTP
 *                                referrers). Without it the directory shows its USGS still instead.
 *   GOOGLE_MAPS_SIGNING_SECRET   the "URL signing secret" from the Maps Static API's Credentials page. With it each
 *                                address is signed, and once the key's "unsigned requests" quota is set to 0, the
 *                                key draws only the site's own maps: a copied key costs nothing.
 */

const ENDPOINT = "https://maps.googleapis.com";
const PATH = "/maps/api/staticmap";

/** Quieter terrain: no businesses' and transit's labels, so the professionals' pins stand out. */
const STYLES = ["feature:poi|visibility:off", "feature:transit|visibility:off"];

/** Google's signature: an HMAC-SHA1 of the path and query, keyed with the URL-safe base64 secret. */
function sign(pathAndQuery: string, secret: string) {
  const key = Buffer.from(secret.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  return createHmac("sha1", key).update(pathAndQuery).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");
}

/** The map's image address, or null without a key (the caller shows the still). */
export function staticMapUrl(frame: MapFrame): string | null {
  const key = process.env.GOOGLE_MAPS_STATIC_KEY;
  if (!key) return null;
  const query = [
    ["center", `${frame.center.lat},${frame.center.lng}`],
    ["zoom", String(frame.zoom)],
    ["size", `${frame.width}x${frame.height}`],
    // Twice the pixels for sharp screens, at the price of one load
    ["scale", "2"],
    ["maptype", "terrain"],
    ["language", "en"],
    ["region", "us"],
    ...STYLES.map((style) => ["style", style]),
    ["key", key],
  ]
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join("&");
  const pathAndQuery = `${PATH}?${query}`;
  const secret = process.env.GOOGLE_MAPS_SIGNING_SECRET;
  return `${ENDPOINT}${pathAndQuery}${secret ? `&signature=${sign(pathAndQuery, secret)}` : ""}`;
}
