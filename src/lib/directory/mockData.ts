import type {
  DirectoryBusiness,
  FeaturedProfile,
  ProfessionalTypeId,
} from "./types";

/* ────────────────────────────────────────────────
   Mock data for the directory prototype.
   Replace with Google Places once the provider is connected.
───────────────────────────────────────────────── */

export const unsplash = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

export interface MockMetro {
  city: string;
  state: string;
  stateName: string;
  zipPrefixes: string[];
  lat: number;
  lng: number;
  neighborhoods: [string, string, string];
}

export const MOCK_METROS: MockMetro[] = [
  { city: "Miami", state: "FL", stateName: "Florida", zipPrefixes: ["331", "332"], lat: 25.7617, lng: -80.1918, neighborhoods: ["Brickell", "Wynwood", "Coral Gables"] },
  { city: "Los Angeles", state: "CA", stateName: "California", zipPrefixes: ["900", "901"], lat: 34.0522, lng: -118.2437, neighborhoods: ["West Hollywood", "Silver Lake", "Beverly Grove"] },
  { city: "New York", state: "NY", stateName: "New York", zipPrefixes: ["100", "101", "102"], lat: 40.7128, lng: -74.006, neighborhoods: ["SoHo", "Upper East Side", "Tribeca"] },
  { city: "Austin", state: "TX", stateName: "Texas", zipPrefixes: ["787"], lat: 30.2672, lng: -97.7431, neighborhoods: ["South Congress", "East Austin", "Downtown"] },
  { city: "Chicago", state: "IL", stateName: "Illinois", zipPrefixes: ["606"], lat: 41.8781, lng: -87.6298, neighborhoods: ["River North", "Lincoln Park", "Wicker Park"] },
  { city: "Las Vegas", state: "NV", stateName: "Nevada", zipPrefixes: ["889", "890", "891"], lat: 36.1699, lng: -115.1398, neighborhoods: ["Summerlin", "Henderson", "The Strip"] },
  { city: "Scottsdale", state: "AZ", stateName: "Arizona", zipPrefixes: ["852"], lat: 33.4942, lng: -111.9261, neighborhoods: ["Old Town", "North Scottsdale", "Kierland"] },
  { city: "Nashville", state: "TN", stateName: "Tennessee", zipPrefixes: ["372"], lat: 36.1627, lng: -86.7816, neighborhoods: ["The Gulch", "12 South", "East Nashville"] },
  { city: "Atlanta", state: "GA", stateName: "Georgia", zipPrefixes: ["303"], lat: 33.749, lng: -84.388, neighborhoods: ["Buckhead", "Midtown", "Inman Park"] },
];

const NAME_POOLS: Record<ProfessionalTypeId, string[]> = {
  esthetician: [
    "Lumière Skin Studio",
    "The Facial Bar",
    "Glow Theory Skincare",
    "Bare Skin Atelier",
    "Dewy Skin Co.",
    "Velvet Skin Lab",
    "Pure Ritual Esthetics",
    "The Radiance Room",
    "Skin by Sienna",
    "The Skin Edit",
  ],
  "med-spa": [
    "Aura Aesthetics & Med Spa",
    "Revive Medical Spa",
    "Contour Wellness Clinic",
    "Elevé Med Spa",
    "Halo Aesthetics",
    "Restore Skin + Body",
    "The Refined Clinic",
    "Luxe Laser & Aesthetics",
    "Nova Med Spa",
    "Serenity Aesthetic Center",
  ],
  "hair-stylist": [
    "Strand & Co. Salon",
    "The Color Loft",
    "Mane Society",
    "Blowout Bar & Salon",
    "Gloss Hair Studio",
    "Crown Collective",
    "Shear Artistry",
    "Golden Hour Hair",
    "Texture Studio",
    "Willow & Vine Salon",
  ],
};

const IMAGE_POOLS: Record<ProfessionalTypeId, string[]> = {
  esthetician: [
    "1570172619644-dfd03ed5d881",
    "1616394584738-fc6e612e71b9",
    "1512290923902-8a9f81dc236c",
    "1596178060671-7a80dc8059ea",
    "1617897903246-719242758050",
    "1515377905703-c4788e51af15",
  ],
  "med-spa": [
    "1552693673-1bf958298935",
    "1540555700478-4be289fbecef",
    "1521590832167-7bcbfaa6381f",
    "1600334129128-685c5582fd35",
    "1544161515-4ab6ce6db874",
    "1633681926022-84c23e8cb2d6",
  ],
  "hair-stylist": [
    "1562322140-8baeececf3df",
    "1559599101-f09722fb4948",
    "1595476108010-b4d1f102b1b1",
    "1560066984-138dadb4c035",
    "1600948836101-f9ffda59d250",
    "1522337360788-8b13dee7a37e",
    "1527799820374-dcf8d9d4a388",
    "1585747860715-2ba37e788b70",
  ],
};

const RESULTS_PER_METRO = 6;

/** Small deterministic hash so mock ratings stay stable across renders. */
function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

const slugify = (value: string) =>
  value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function buildBusinesses(): DirectoryBusiness[] {
  const types = Object.keys(NAME_POOLS) as ProfessionalTypeId[];

  return MOCK_METROS.flatMap((metro, metroIndex) =>
    types.flatMap((type) => {
      const names = NAME_POOLS[type];
      const images = IMAGE_POOLS[type];

      return Array.from({ length: RESULTS_PER_METRO }, (_, k) => {
        const name = names[(metroIndex * 3 + k) % names.length];
        const seed = hash(`${name}-${metro.city}`);

        return {
          id: `mock_${slugify(`${name}-${metro.city}-${metro.state}`)}`,
          name,
          professionalType: type,
          city: metro.city,
          state: metro.state,
          neighborhood: metro.neighborhoods[k % metro.neighborhoods.length],
          rating: Math.round((4.3 + (seed % 7) / 10) * 10) / 10,
          reviewCount: 38 + (seed % 860),
          imageUrl: unsplash(images[(metroIndex + k) % images.length], 640),
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name} ${metro.city} ${metro.state}`
          )}`,
          source: "google" as const,
          isClaimed: false,
        };
      });
    })
  );
}

export const MOCK_BUSINESSES: DirectoryBusiness[] = buildBusinesses();

export const MOCK_FEATURED_PROFILES: FeaturedProfile[] = [
  { id: "fp-simone-laurent", name: "Simone Laurent", title: "Medical Esthetician", city: "Miami", state: "FL", featuredIn: "Expert Takes", imageUrl: unsplash("1580489944761-15a19d654956", 600) },
  { id: "fp-ava-moreno", name: "Ava Moreno", title: "Celebrity Hair Stylist", city: "Los Angeles", state: "CA", featuredIn: "The Beauty Vault", imageUrl: unsplash("1494790108377-be9c29b29330", 600) },
  { id: "fp-nia-okafor", name: "Nia Okafor", title: "Licensed Esthetician & Founder", city: "Atlanta", state: "GA", featuredIn: "Editorial", imageUrl: unsplash("1531123897727-8f129e1688ce", 600) },
  { id: "fp-claire-whitman", name: "Claire Whitman, RN", title: "Aesthetic Nurse Injector", city: "Scottsdale", state: "AZ", featuredIn: "Expert Takes", imageUrl: unsplash("1508214751196-bcfd4ca60f91", 600) },
  { id: "fp-lumen-aesthetics", name: "Lumen Aesthetics", title: "Med Spa", city: "Las Vegas", state: "NV", featuredIn: "Editorial", imageUrl: unsplash("1633681926022-84c23e8cb2d6", 600) },
  { id: "fp-maya-chen", name: "Maya Chen", title: "Med Spa Founder", city: "New York", state: "NY", featuredIn: "Editorial", imageUrl: unsplash("1573496359142-b8d87734a5a2", 600) },
  { id: "fp-jordan-ellis", name: "Jordan Ellis", title: "Master Colorist", city: "Austin", state: "TX", featuredIn: "The Beauty Vault", imageUrl: unsplash("1438761681033-6461ffad8d80", 600) },
  { id: "fp-amara-brooks", name: "Amara Brooks", title: "Wellness & Lymphatic Specialist", city: "Nashville", state: "TN", featuredIn: "Expert Takes", imageUrl: unsplash("1519699047748-de8e457a634e", 600) },
  { id: "fp-sofia-ramirez", name: "Sofia Ramirez", title: "Brow & Lash Artist", city: "Chicago", state: "IL", featuredIn: "The Beauty Vault", imageUrl: unsplash("1531746020798-e6953c6e8e04", 600) },
];
