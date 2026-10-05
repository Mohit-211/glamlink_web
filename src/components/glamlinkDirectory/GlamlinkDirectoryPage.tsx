"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  directoryProvider,
  getProfessionalType,
  isProfessionalTypeId,
  PROFESSIONAL_TYPES,
  type DirectoryBusiness,
  type FeaturedProfile,
  type ProfessionalTypeId,
} from "@/lib/directory";
import { useDirectorySearch } from "@/hooks/useDirectorySearch";
import DirectoryHero from "./DirectoryHero";
import DirectorySearch from "./DirectorySearch";
import FeaturedProfiles from "./FeaturedProfiles";
import DirectoryResults from "./DirectoryResults";
import ClaimProfileModal from "./ClaimProfileModal";
import DirectoryCTA, { CLAIM_PROFILE_HREF } from "./DirectoryCTA";
import { directoryThemeStyle } from "./directoryTheme";

export default function GlamlinkDirectoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type");
  const initialLocation = searchParams.get("location") ?? "";

  const [professionalType, setProfessionalType] = useState<ProfessionalTypeId | "">(
    isProfessionalTypeId(initialType) ? initialType : ""
  );
  const [location, setLocation] = useState(initialLocation);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [featured, setFeatured] = useState<FeaturedProfile[]>([]);
  const [claimTarget, setClaimTarget] = useState<DirectoryBusiness | null>(null);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const { state, search, loadPopular } = useDirectorySearch();

  /* Initial load: featured profiles + results (from URL or nationwide picks). */
  useEffect(() => {
    directoryProvider.getFeaturedProfiles().then(setFeatured).catch(() => setFeatured([]));

    if (initialLocation.trim()) {
      search({
        professionalType: isProfessionalTypeId(initialType) ? initialType : null,
        location: initialLocation,
      });
    } else {
      loadPopular();
    }
    // Only on mount — later searches are user-driven.
  }, []);

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
    document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = () => {
    const trimmed = location.trim();
    if (!trimmed) {
      setSearchError("Enter a city, state or ZIP to search.");
      locationInputRef.current?.focus();
      return;
    }

    setSearchError(null);
    syncUrl(professionalType, trimmed);
    search({ professionalType: professionalType || null, location: trimmed });
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
          const resolved = await directoryProvider.reverseGeocode({
            lat: coords.latitude,
            lng: coords.longitude,
          });
          if (resolved) setLocation(resolved.label);
          else setSearchError("We couldn't find your city. Enter a city, state or ZIP instead.");
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
    loadPopular();
  };

  const handleRetry = () => {
    if (state.mode === "search" && state.params) search(state.params);
    else loadPopular();
  };

  const handleConfirmClaim = (business: DirectoryBusiness) => {
    setClaimTarget(null);
    // Prototype: hand off to the existing Glamlink application flow.
    router.push(`${CLAIM_PROFILE_HREF}?claim=${encodeURIComponent(business.id)}`);
  };

  /* "Estheticians near Miami, FL" */
  const searchedType = getProfessionalType(state.params?.professionalType);
  const typeLabel = searchedType?.pluralLabel ?? "Beauty + wellness professionals";
  const criteriaLabel =
    state.mode === "search"
      ? `${typeLabel} near ${state.location?.label ?? state.params?.location ?? ""}`
      : "Top-rated beauty + wellness businesses";

  return (
    <div className="overflow-x-clip" style={directoryThemeStyle}>
      <DirectoryHero>
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

      <FeaturedProfiles profiles={featured} />

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

      <DirectoryCTA />

      <ClaimProfileModal
        business={claimTarget}
        onOpenChange={(open) => !open && setClaimTarget(null)}
        onConfirm={handleConfirmClaim}
      />
    </div>
  );
}
