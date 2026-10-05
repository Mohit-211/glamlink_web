import { MOCK_BUSINESSES, MOCK_FEATURED_PROFILES, MOCK_METROS, type MockMetro } from "./mockData";
import type {
  DirectoryBusiness,
  DirectoryLocation,
  DirectoryProvider,
  GeoCoordinates,
} from "./types";

/* ────────────────────────────────────────────────
   Mock directory provider.
   Mirrors what a Google Places integration will do — resolve the
   location, search by professional type, rank by prominence — using
   local data and a small artificial latency.
───────────────────────────────────────────────── */

const MOCK_LATENCY_MS = 450;
const POPULAR_LIMIT = 8;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const metroLabel = (metro: MockMetro) => `${metro.city}, ${metro.state}`;

const toLocation = (metro: MockMetro, zip?: string): DirectoryLocation => ({
  label: metroLabel(metro),
  city: metro.city,
  state: metro.state,
  zip,
  coordinates: { lat: metro.lat, lng: metro.lng },
});

/** Ranks like Google "prominence": rating weighted by review volume. */
const prominence = (b: DirectoryBusiness) => b.rating * Math.log10(b.reviewCount + 10);

interface ResolvedArea {
  location: DirectoryLocation;
  metros: MockMetro[];
}

/** Resolves "City, ST", "City", "ST", "State name" or a 5-digit ZIP. */
function resolveArea(input: string): ResolvedArea | null {
  const query = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (!query) return null;

  const zip = query.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1];
  if (zip) {
    const metro = MOCK_METROS.find((m) => m.zipPrefixes.some((p) => zip.startsWith(p)));
    return metro ? { location: toLocation(metro, zip), metros: [metro] } : null;
  }

  // "Miami, FL", "Miami FL", "Miami Florida" and "Miami" all resolve to the city.
  const normalized = query.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  const byCity = MOCK_METROS.find((m) => {
    const city = m.city.toLowerCase();
    if (!normalized.startsWith(city)) return false;
    const rest = normalized.slice(city.length).trim();
    return !rest || rest === m.state.toLowerCase() || rest === m.stateName.toLowerCase();
  });
  if (byCity) return { location: toLocation(byCity), metros: [byCity] };

  const stateMetros = MOCK_METROS.filter(
    (m) => m.state.toLowerCase() === query || m.stateName.toLowerCase() === query
  );
  if (stateMetros.length) {
    const { stateName, state } = stateMetros[0];
    return { location: { label: stateName, state }, metros: stateMetros };
  }

  return null;
}

function distanceKm(a: GeoCoordinates, b: GeoCoordinates) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export const mockDirectoryProvider: DirectoryProvider = {
  async searchBusinesses({ professionalType, location }) {
    await wait(MOCK_LATENCY_MS);

    const area = resolveArea(location);
    if (!area) return { businesses: [], location: null };

    const cities = new Set(area.metros.map(metroLabel));
    const businesses = MOCK_BUSINESSES.filter(
      (b) =>
        cities.has(`${b.city}, ${b.state}`) &&
        (!professionalType || b.professionalType === professionalType)
    ).sort((a, b) => prominence(b) - prominence(a));

    return { businesses, location: area.location };
  },

  async getPopularBusinesses() {
    await wait(MOCK_LATENCY_MS);

    // One standout per metro, rotating professional types and skipping repeat names.
    const types = ["esthetician", "med-spa", "hair-stylist"] as const;
    const usedNames = new Set<string>();
    return MOCK_METROS.map((metro, i) => {
      const pick = MOCK_BUSINESSES.filter(
        (b) => b.city === metro.city && b.professionalType === types[i % types.length]
      )
        .sort((a, b) => prominence(b) - prominence(a))
        .find((b) => !usedNames.has(b.name));
      if (pick) usedNames.add(pick.name);
      return pick;
    })
      .filter((b): b is DirectoryBusiness => !!b)
      .slice(0, POPULAR_LIMIT);
  },

  async getFeaturedProfiles() {
    return MOCK_FEATURED_PROFILES;
  },

  async reverseGeocode(coords) {
    const nearest = [...MOCK_METROS].sort(
      (a, b) => distanceKm(coords, a) - distanceKm(coords, b)
    )[0];
    return nearest ? toLocation(nearest) : null;
  },
};
