"use client";

import type { FormEvent, RefObject } from "react";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import type { ProfessionalType, ProfessionalTypeId } from "@/lib/directory";
import ProfessionalTypeSelect from "./ProfessionalTypeSelect";

interface DirectorySearchProps {
  professionalTypes: ProfessionalType[];
  professionalType: ProfessionalTypeId | "";
  location: string;
  onProfessionalTypeChange: (value: ProfessionalTypeId | "") => void;
  onLocationChange: (value: string) => void;
  onSubmit: () => void;
  onUseMyLocation: () => void;
  isSearching?: boolean;
  isLocating?: boolean;
  error?: string | null;
  locationInputRef?: RefObject<HTMLInputElement | null>;
}

export default function DirectorySearch({
  professionalTypes,
  professionalType,
  location,
  onProfessionalTypeChange,
  onLocationChange,
  onSubmit,
  onUseMyLocation,
  isSearching = false,
  isLocating = false,
  error,
  locationInputRef,
}: DirectorySearchProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      id="directory-search"
      role="search"
      aria-label="Search the Glamlink directory"
      onSubmit={handleSubmit}
      className="scroll-mt-28 w-full"
    >
      <div className="rounded-3xl lg:rounded-full border border-border/80 bg-white p-2 shadow-large">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-0">
          {/* PROFESSIONAL TYPE */}
          <div className="lg:w-[236px] lg:shrink-0">
            <ProfessionalTypeSelect
              professionalTypes={professionalTypes}
              value={professionalType}
              onChange={onProfessionalTypeChange}
            />
          </div>

          <span className="hidden lg:block h-10 w-px bg-border" aria-hidden="true" />
          <span className="lg:hidden mx-4 h-px bg-border" aria-hidden="true" />

          {/* LOCATION */}
          <div className="flex items-center gap-3 rounded-2xl lg:rounded-full px-4 py-2.5 lg:py-2 lg:flex-[1.2] hover:bg-muted/60 focus-within:bg-muted/60 transition-colors">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <label className="flex-1 min-w-0 cursor-text">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </span>
              <input
                ref={locationInputRef}
                type="text"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="City, State or ZIP"
                autoComplete="address-level2"
                aria-invalid={!!error}
                aria-describedby={error ? "directory-search-error" : undefined}
                className="w-full bg-transparent text-sm sm:text-[15px] font-medium text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal outline-none"
              />
            </label>
            <button
              type="button"
              onClick={onUseMyLocation}
              disabled={isLocating}
              title="Use my location"
              aria-label="Use my location"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors disabled:opacity-70"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <LocateFixed className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline lg:hidden">
                {isLocating ? "Locating…" : "Use my location"}
              </span>
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSearching}
            className="btn-primary mt-1 lg:mt-0 lg:ml-1 h-12 lg:h-14 w-full lg:w-auto lg:px-8 text-[15px] disabled:opacity-80"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="w-5 h-5" aria-hidden="true" />
            )}
            Search
          </button>
        </div>
      </div>

      <p
        id="directory-search-error"
        role="alert"
        className={`px-5 pt-3 text-sm text-red-600 ${error ? "" : "sr-only"}`}
      >
        {error}
      </p>
    </form>
  );
}
