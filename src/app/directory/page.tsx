import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import GlamlinkDirectoryPage from "@/components/glamlinkDirectory/GlamlinkDirectoryPage";
import DirectoryMap, { mapView, type OtherCity } from "@/components/glamlinkDirectory/DirectoryMap";
import ExploreBrands from "@/components/glamlinkDirectory/ExploreBrands";
import { getDirectoryFilters, getGoogleListings, getMapPins, getProfiles } from "@/lib/api/public";
import type { MapPin, ProfessionalFilters, ProfileCard } from "@/lib/api/types";
import type { FeaturedProfile } from "@/lib/directory";
import { LAS_VEGAS_MAP, mapBounds, type CityMap } from "@/lib/directory/cityMap";
import { DEFAULT_LISTINGS_PLACE, toBusiness } from "@/lib/directory/listings";
import { profileHref } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Beauty + Wellness Directory",
  description:
    "Find beauty and wellness professionals near you. Search trusted estheticians, med spas and hair stylists across the U.S. on Glamlink.",
  alternates: {
    canonical: `${SITE_URL}/directory`,
  },
  openGraph: {
    title: "Glamlink Directory | Find Beauty + Wellness Professionals Near You",
    description: "Search trusted beauty and wellness professionals and businesses across the U.S.",
    url: `${SITE_URL}/directory`,
  },
};

const FEATURED_COUNT = 8;
const BRANDS_COUNT = 6;
const OTHER_CITIES = 4;

const asFeatured = (row: ProfileCard): FeaturedProfile => ({
  id: `profile-${row.id}`,
  name: row.name,
  title: row.tagline || row.category_label || row.specialty || "",
  city: row.city ?? "",
  state: row.state ?? "",
  imageUrl: row.image ?? "",
  featured: Boolean(row.is_featured),
  href: profileHref(row.slug),
});

/** Where else Glamlink has professionals: the cities with the most, leaving out the map's and those on it. */
function otherCities(map: CityMap, states: ProfessionalFilters["states"], onMap: MapPin[]): OtherCity[] {
  const key = (state: string | null, city: string | null) => `${state ?? ""}|${(city ?? "").toLowerCase()}`;
  const mapped = new Set([key(map.state, map.city), ...onMap.map((pin) => key(pin.state, pin.city))]);
  return states
    .flatMap((state) => state.cities.map((city) => ({ city: city.name, state: state.code ?? state.name, count: city.count })))
    .filter((place) => !mapped.has(key(place.state, place.city)))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    .slice(0, OTHER_CITIES);
}

export default async function DirectoryPage() {
  const map = LAS_VEGAS_MAP;
  // Google's map or the still: each shows its own box, and the pins are asked for in it
  const view = mapView(map);
  const [pins, filters, professionals, brands, listings] = await Promise.all([
    getMapPins(mapBounds(view.frame)),
    getDirectoryFilters("individual"),
    getProfiles({ type: "individual", sort: "recommended", limit: FEATURED_COUNT }),
    getProfiles({ type: "brand", sort: "recommended", limit: BRANDS_COUNT }),
    getGoogleListings({ lat: DEFAULT_LISTINGS_PLACE.lat, lng: DEFAULT_LISTINGS_PLACE.lng, limit: DEFAULT_LISTINGS_PLACE.count }),
  ]);

  return (
    <GlamlinkDirectoryPage
      map={
        <DirectoryMap
          map={map}
          view={view}
          pins={pins.rows}
          count={pins.rows.length > 0 ? pins.count : null}
          elsewhere={otherCities(map, filters?.states ?? [], pins.rows)}
        />
      }
      featured={professionals.rows.map(asFeatured)}
      popular={listings.slice(0, DEFAULT_LISTINGS_PLACE.count).map((listing) => toBusiness(listing, null))}
      popularPlace={DEFAULT_LISTINGS_PLACE.label}
      brands={<ExploreBrands brands={brands.rows} />}
    />
  );
}
