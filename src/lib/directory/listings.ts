import { API_ORIGIN, API_URL } from "@/lib/config";
import type { GoogleListing } from "@/lib/api/types";
import { getProfessionalType, isProfessionalTypeId } from "./categories";
import type { DirectoryBusiness } from "./types";

/* Google's listings as the directory's cards: shared by the page's first answer (fetched on the server) and the
   visitor's searches (in the browser). */

/** The API answers its own photo link as a path or a full URL. */
export function apiLink(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/api/")) return `${API_ORIGIN}${url}`;
  return `${API_URL}/${url.replace(/^\/+/, "")}`;
}

/** A listing as a card. `searchedType`: the type the visitor searched for, which names the card; without one,
    Google's own type does ("Beauty salon"). */
export function toBusiness(listing: GoogleListing, searchedType: string | null): DirectoryBusiness {
  const type = isProfessionalTypeId(listing.type) ? listing.type : isProfessionalTypeId(searchedType) ? searchedType : null;
  const googleType = listing.type?.trim();
  return {
    id: listing.place_id,
    name: listing.name,
    professionalType: type,
    category: getProfessionalType(type)?.label ?? (googleType ? googleType.charAt(0).toUpperCase() + googleType.slice(1) : "Beauty + Wellness"),
    city: listing.city ?? "",
    state: listing.state ?? "",
    neighborhood: listing.address ?? undefined,
    rating: Number(listing.rating ?? 0),
    reviewCount: Number(listing.review_count ?? 0),
    imageUrl: apiLink(listing.photo_url),
    websiteUrl: listing.website || undefined,
    mapsUrl: listing.maps_url || `https://www.google.com/maps/place/?q=place_id:${listing.place_id}`,
    source: "google",
    // Claimed listings are left out by the API
    isClaimed: false,
  };
}

/** Where the directory's Google listings come from before anyone searches (the owner, Nov 3): Las Vegas, where most
    Glamlink professionals are. */
export const DEFAULT_LISTINGS_PLACE = {
  label: "Las Vegas, NV",
  lat: 36.1699,
  lng: -115.1398,
  count: 15,
} as const;
