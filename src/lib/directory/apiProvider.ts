import { getGoogleListings } from "@/api/Api";
import { searchDirectoryProfessionals as searchDirectory } from "@/api/directory";
import type { GoogleListing } from "@/lib/api/types";
import { profileHref } from "@/lib/routes";
import { toBusiness } from "./listings";
import type {
  DirectoryLocation,
  DirectoryProvider,
  DirectorySearchParams,
  FeaturedProfile,
  GeoCoordinates,
} from "./types";

/*
 * The directory's searches on the API (backend handoff, 10.13): Google's listings
 * near a place (GET /directory/google, photos proxied so no key reaches the
 * browser) and Glamlink's own professionals near it (GET /directory/search). What
 * the page shows before a search is fetched on the server (app/directory/page.tsx).
 */

interface DirectoryRow {
  kind: "profile" | "listing";
  id: number;
  slug?: string | null;
  name: string;
  image?: string | null;
  tagline?: string | null;
  city?: string | null;
  state?: string | null;
  specialty?: string | null;
  distance_miles?: number | null;
}

const rows = <T>(data: unknown): T[] => {
  const d = data as { data?: T[] | { rows?: T[] } };
  if (Array.isArray(d?.data)) return d.data;
  return Array.isArray(d?.data?.rows) ? d.data.rows : [];
};

function toProfile(row: DirectoryRow): FeaturedProfile {
  const miles = row.distance_miles;
  return {
    id: `${row.kind}-${row.id}`,
    name: row.name,
    title: row.tagline || row.specialty || "",
    city: row.city ?? "",
    state: row.state ?? "",
    imageUrl: row.image ?? "",
    distanceLabel:
      typeof miles === "number" ? `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi away` : undefined,
    // Approved applicants without an account have no page yet
    href: row.kind === "profile" && row.slug ? profileHref(row.slug) : undefined,
  };
}

/** Where to search: the visitor's point, else the text they typed. */
const place = (params: Pick<DirectorySearchParams, "location" | "coordinates">) =>
  params.coordinates
    ? { lat: params.coordinates.lat, lng: params.coordinates.lng }
    : { location: params.location.trim() };

/** "Las Vegas, NV": the place most of the nearby listings sit in. */
function commonPlace(listings: GoogleListing[]): { city: string; state: string } | null {
  const counts = new Map<string, number>();
  listings.forEach((l) => {
    if (l.city && l.state) counts.set(`${l.city}|${l.state}`, (counts.get(`${l.city}|${l.state}`) ?? 0) + 1);
  });
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best) return null;
  const [city, state] = best[0].split("|");
  return { city, state };
}

export const apiDirectoryProvider: DirectoryProvider = {
  async searchBusinesses(params) {
    const where = place(params);
    const [google, ours] = await Promise.all([
      getGoogleListings({ ...where, type: params.professionalType ?? undefined }),
      searchDirectory({ ...where, limit: 12 }).catch(() => null),
    ]);
    const listings = rows<GoogleListing>(google);
    const found = commonPlace(listings);
    const location: DirectoryLocation = {
      label: params.coordinates ? (found ? `${found.city}, ${found.state}` : "your location") : params.location.trim(),
      city: found?.city,
      state: found?.state,
      coordinates: params.coordinates,
    };
    return {
      businesses: listings.map((listing) => toBusiness(listing, params.professionalType)),
      profiles: rows<DirectoryRow>(ours).map(toProfile),
      location,
    };
  },

  // The search itself names the place (from the listings found near the point),
  // so the visitor's point is used as it is: no extra Google call to name it.
  async reverseGeocode(coords: GeoCoordinates) {
    return { label: "Current location", coordinates: coords };
  },
};
