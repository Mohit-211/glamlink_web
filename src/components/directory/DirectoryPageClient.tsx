"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, SearchX, Compass } from "lucide-react";
import { getCompaniesList, getCompanyCategoryLabel, getCompanyLocation } from "@/lib/companies";
import {
  getDirectoryProfessionals,
  getProfessionalLocation,
  DirectoryProfessional,
} from "@/lib/directoryProfessionals";
import { Company } from "@/types/company";
import DirectorySearch from "./DirectorySearch";
import DirectoryFilters, { DirectoryTab } from "./DirectoryFilters";
import ProfessionalDirectoryCard from "./ProfessionalDirectoryCard";
import CompanyDirectoryCard from "./CompanyDirectoryCard";
import DirectorySkeleton from "./DirectorySkeleton";
import EmptyState from "./EmptyState";

const SEARCH_DEBOUNCE_MS = 250;
const PAGE_SIZE = 9;

type Entry =
  | { kind: "professional"; id: string; name: string; specialty: string; location: string; data: DirectoryProfessional }
  | { kind: "company"; id: string; name: string; specialty: string; location: string; data: Company };

const DirectoryPageClient = () => {
  const [professionals, setProfessionals] = useState<DirectoryProfessional[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [activeTab, setActiveTab] = useState<DirectoryTab>("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortAZ, setSortAZ] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      try {
        const [companyRows, professionalRows] = await Promise.all([
          getCompaniesList(),
          getDirectoryProfessionals(),
        ]);
        setCompanies(companyRows);
        setProfessionals(professionalRows);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeTab, selectedLocation, selectedSpecialty, sortAZ]);

  const allEntries: Entry[] = useMemo(() => {
    const professionalEntries: Entry[] = professionals.map((p) => ({
      kind: "professional",
      id: `pro-${p.id}`,
      name: p.name,
      specialty: p.specialty || p.professional_title || "",
      location: getProfessionalLocation(p),
      data: p,
    }));
    const companyEntries: Entry[] = companies.map((c) => ({
      kind: "company",
      id: `co-${c.id}`,
      name: c.name,
      specialty: getCompanyCategoryLabel(c),
      location: getCompanyLocation(c),
      data: c,
    }));
    return [...professionalEntries, ...companyEntries];
  }, [professionals, companies]);

  const locations = useMemo(
    () =>
      Array.from(new Set(allEntries.map((e) => e.location).filter(Boolean))).sort(),
    [allEntries]
  );
  const specialties = useMemo(
    () =>
      Array.from(new Set(allEntries.map((e) => e.specialty).filter(Boolean))).sort(),
    [allEntries]
  );

  const tabCounts = useMemo(() => {
    const counts: Partial<Record<DirectoryTab, number>> = {
      all: allEntries.length,
      professionals: professionals.length,
    };
    for (const company of companies) {
      counts[company.category] = (counts[company.category] || 0) + 1;
    }
    return counts;
  }, [allEntries.length, professionals.length, companies]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredEntries = useMemo(() => {
    let result = allEntries;

    if (activeTab === "professionals") {
      result = result.filter((e) => e.kind === "professional");
    } else if (activeTab !== "all") {
      result = result.filter(
        (e) => e.kind === "company" && e.data.category === activeTab
      );
    }

    if (selectedLocation) {
      result = result.filter((e) => e.location === selectedLocation);
    }
    if (selectedSpecialty) {
      result = result.filter((e) => e.specialty === selectedSpecialty);
    }

    if (normalizedQuery) {
      result = result.filter((e) => {
        const haystack = [e.name, e.specialty, e.location]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    return [...result].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAZ ? cmp : -cmp;
    });
  }, [allEntries, activeTab, selectedLocation, selectedSpecialty, normalizedQuery, sortAZ]);

  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEntries.length;
  const hasActiveFilters =
    !!normalizedQuery || !!selectedLocation || !!selectedSpecialty || activeTab !== "all";

  const clearAllFilters = () => {
    setSearchInput("");
    setSelectedLocation("");
    setSelectedSpecialty("");
    setActiveTab("all");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      {/* <section className="relative overflow-hidden bg-[#fafafa]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 12% 15%, rgba(36,187,203,0.10), transparent 45%), radial-gradient(circle at 90% 85%, rgba(36,187,203,0.07), transparent 50%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6 pt-28 pb-14 md:pt-32 md:pb-16">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[.2em] uppercase text-[#24bbcb] font-medium mb-5 bg-[#24bbcb]/8 px-3.5 py-1.5 rounded-full">
            <Sparkles className="h-3 w-3" />
            Glamlink Directory
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] leading-[1.08] tracking-tight text-gray-900 max-w-2xl">
            Directory
          </h1>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-gray-500 font-light max-w-xl">
            Discover professionals, brands, software companies, manufacturers,
            and other businesses in the beauty industry.
          </p>

          <div className="mt-8 max-w-2xl">
            <DirectorySearch
              value={searchInput}
              onChange={setSearchInput}
              isSearching={isSearching}
              resultCount={normalizedQuery ? filteredEntries.length : undefined}
            />
          </div>
        </div>
      </section> */}

      {/* ── RESULTS ── */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-6 py-12 md:py-16">
        <div className="mb-8">
          <DirectoryFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabCounts={tabCounts}
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            sortAZ={sortAZ}
            onToggleSort={() => setSortAZ((s) => !s)}
          />
        </div>

        {loading ? (
          <DirectorySkeleton />
        ) : allEntries.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="The directory is empty right now."
            description="Check back soon — professionals and companies will appear here as they join Glamlink."
          />
        ) : filteredEntries.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={
              normalizedQuery
                ? `No results match "${searchQuery}"`
                : "No listings match these filters."
            }
            description="Try a different keyword, or clear your filters to browse everything."
            action={{ label: "Clear all filters", onClick: clearAllFilters }}
          />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleEntries.map((entry) =>
                entry.kind === "professional" ? (
                  <ProfessionalDirectoryCard key={entry.id} professional={entry.data} />
                ) : (
                  <CompanyDirectoryCard key={entry.id} company={entry.data} />
                )
              )}
            </div>

            <div className="flex flex-col items-center gap-4 mt-10">
              <p className="text-[12px] text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-700">{visibleEntries.length}</span> of{" "}
                <span className="font-medium text-gray-700">{filteredEntries.length}</span>{" "}
                {filteredEntries.length === 1 ? "listing" : "listings"}
                {hasActiveFilters && ` (of ${allEntries.length} total)`}
              </p>
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 px-6 py-2.5 hover:border-[#24bbcb] hover:text-[#24bbcb] transition-colors duration-200"
                >
                  Load More
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default DirectoryPageClient;
