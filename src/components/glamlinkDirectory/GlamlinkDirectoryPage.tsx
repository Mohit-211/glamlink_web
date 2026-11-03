"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  directoryProvider,
  getProfessionalType,
  isProfessionalTypeId,
  PROFESSIONAL_TYPES,
  type DirectoryBusiness,
  type FeaturedProfile,
  type GeoCoordinates,
  type ProfessionalTypeId,
} from "@/lib/directory";
import { useDirectorySearch } from "@/hooks/useDirectorySearch";
import DirectoryHero from "./DirectoryHero";
import DirectorySearch from "./DirectorySearch";
import ExploreHeading from "./ExploreHeading";
import FeaturedProfiles from "./FeaturedProfiles";
import DirectoryResults from "./DirectoryResults";
import ClaimProfileModal from "./ClaimProfileModal";
import DirectoryCTA from "./DirectoryCTA";

interface GlamlinkDirectoryPageProps {
  /** The hero's map of a city's Glamlink professionals (rendered on the server). */
  map: ReactNode;
  /** Glamlink professionals, featured first: the first part of Explore Professionals before a search. */
  featured: FeaturedProfile[];
  /** Google's listings around the default place, shown until the visitor searches. */
  popular: DirectoryBusiness[];
  /** "Las Vegas, NV": where `popular` comes from. */
  popularPlace: string;
  /** The Explore Brands section (rendered on the server). */
  brands: ReactNode;
}

/**
 * A search in the page's URL (a shared link, or back from a page), run once on arrival. Apart from the page, so
 * reading the URL doesn't keep the rest of it from rendering on the server.
 */
function UrlSearch({ onSearch }: { onSearch: (type: ProfessionalTypeId | "", location: string) => void }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const location = searchParams.get("location") ?? "";
  const done = useRef(false);

  // Only the URL the visitor arrived with: the page's own searches write theirs into it too
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (location.trim()) onSearch(isProfessionalTypeId(type) ? type : "", location);
  }, [type, location, onSearch]);

  return null;
}

/**
 * The directory (/directory, the owner's Nov 3 layout): the hero with the search beside a map of a city's
 * professionals, then Explore Professionals (Glamlink's own, then Google's listings) and Explore Brands, each
 * with a button to the full list.
 */
export default function GlamlinkDirectoryPage({ map, featured, popular, popularPlace, brands }: GlamlinkDirectoryPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [professionalType, setProfessionalType] = useState<ProfessionalTypeId | "">("");
  const [location, setLocation] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [claimTarget, setClaimTarget] = useState<DirectoryBusiness | null>(null);

  const locationInputRef = useRef<HTMLInputElement>(null);
  // "Use my location": the point, kept while the box still shows its label
  const myLocation = useRef<{ label: string; coordinates: GeoCoordinates } | null>(null);
  const { state, search, clear } = useDirectorySearch(popular);

  const runUrlSearch = useCallback(
    (type: ProfessionalTypeId | "", loc: string) => {
      setProfessionalType(type);
      setLocation(loc);
      search({ professionalType: type || null, location: loc });
    },
    [search]
  );

  const syncUrl = useCallback(
    (type: ProfessionalTypeId | "", loc: string) => {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (loc) params.set("location", loc);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const scrollToResults = () => {
    document.getElementById("explore-professionals")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = () => {
    const trimmed = location.trim();
    if (!trimmed) {
      setSearchError("Enter a city, state or ZIP to search.");
      locationInputRef.current?.focus();
      return;
    }

    setSearchError(null);
    const here = myLocation.current?.label === trimmed ? myLocation.current.coordinates : undefined;
    // A point is not shareable as text: the URL keeps the place only when one was typed
    syncUrl(professionalType, here ? "" : trimmed);
    search({ professionalType: professionalType || null, location: trimmed, coordinates: here });
    scrollToResults();
  };

  const handleUseMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setSearchError("Location isn't available in this browser. Enter a city, state or ZIP instead.");
      return;
    }

    setIsLocating(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const point = { lat: coords.latitude, lng: coords.longitude };
          const resolved = await directoryProvider.reverseGeocode(point);
          if (resolved) {
            myLocation.current = { label: resolved.label, coordinates: resolved.coordinates ?? point };
            setLocation(resolved.label);
          } else setSearchError("We couldn't find your city. Enter a city, state or ZIP instead.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setSearchError(
          error.code === error.PERMISSION_DENIED
            ? "Location access was blocked. Enter a city, state or ZIP instead."
            : "We couldn't determine your location. Enter a city, state or ZIP instead."
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  const handleModifySearch = () => {
    document.getElementById("directory-search")?.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus after the smooth scroll starts so mobile keyboards don't jump the page.
    window.setTimeout(() => locationInputRef.current?.focus({ preventScroll: true }), 400);
  };

  const handleClearSearch = () => {
    setProfessionalType("");
    setLocation("");
    setSearchError(null);
    syncUrl("", "");
    clear();
  };

  const handleRetry = () => {
    if (state.mode === "search") search(state.params);
  };

  // The Access form, filled from the Google listing; an admin verifies the claim.
  const handleConfirmClaim = (business: DirectoryBusiness) => {
    setClaimTarget(null);
    router.push(`/access?claim=${encodeURIComponent(business.id)}#create-profile`);
  };

  /* "Estheticians near Miami, FL" */
  const searchedPlace = state.mode === "search" ? (state.location?.label ?? state.params.location) : "";
  const typeLabel = getProfessionalType(state.params?.professionalType)?.pluralLabel ?? "Beauty + wellness businesses";
  const criteriaLabel = state.mode === "search" ? `${typeLabel} near ${searchedPlace}` : `Popular in ${popularPlace}`;
  const nearby = state.mode === "search" && state.status === "success" ? state.profiles : [];

  return (
    <div className="overflow-x-clip">
      <Suspense fallback={null}>
        <UrlSearch onSearch={runUrlSearch} />
      </Suspense>

      <DirectoryHero map={map}>
        <DirectorySearch
          professionalTypes={PROFESSIONAL_TYPES}
          professionalType={professionalType}
          location={location}
          onProfessionalTypeChange={setProfessionalType}
          onLocationChange={(value) => {
            setLocation(value);
            if (searchError) setSearchError(null);
          }}
          onSubmit={handleSubmit}
          onUseMyLocation={handleUseMyLocation}
          isSearching={state.status === "loading" && state.mode === "search"}
          isLocating={isLocating}
          error={searchError}
          locationInputRef={locationInputRef}
        />
      </DirectoryHero>

      <section
        id="explore-professionals"
        aria-labelledby="explore-professionals-heading"
        className="scroll-mt-24 py-16 md:py-24"
      >
        <div className="container-glamlink">
          <ExploreHeading
            id="explore-professionals-heading"
            title="Explore Professionals"
            subtitle="Glamlink's professionals, each with their own page, and more beauty and wellness businesses from Google."
            href="/professionals"
            label="Explore all professionals"
          />

          <div className="mt-10 md:mt-12">
            {nearby.length > 0 ? (
              <FeaturedProfiles
                profiles={nearby}
                title={`Glamlink professionals near ${searchedPlace || "you"}`}
                subtitle="Professionals with a Glamlink page, nearest first."
              />
            ) : (
              <FeaturedProfiles profiles={featured} />
            )}
          </div>

          <div className="mt-16 border-t border-border/60 pt-16 md:mt-20 md:pt-20">
            <DirectoryResults
              status={state.status}
              mode={state.mode}
              businesses={state.businesses}
              criteriaLabel={criteriaLabel}
              onModifySearch={handleModifySearch}
              onClearSearch={handleClearSearch}
              onRetry={handleRetry}
              onClaim={setClaimTarget}
            />
          </div>
        </div>
      </section>

      {brands}

      <DirectoryCTA />

      <ClaimProfileModal
        business={claimTarget}
        onOpenChange={(open) => !open && setClaimTarget(null)}
        onConfirm={handleConfirmClaim}
      />
    </div>
  );
}
