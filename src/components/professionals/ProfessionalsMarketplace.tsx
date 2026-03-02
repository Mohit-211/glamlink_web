"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Instagram,
  CalendarDays,
  BadgeCheck,
  X,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessProfile } from "@/api/Api";
import GlamCardLivePreview from "../glamcard/GlamCardLivePreview";
import BusinessCardPage from "../BusinessCardPage";


/* ================= TYPES ================= */

interface Professional {
  // business_card_link: any;
  locations: any;
  profile_image: string;
  id: number;
  name: string;
  professional_title?: string;
  location?: string;
  specialty?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  badge?: string;
  instagram?: string;
  is_founder?: boolean;
  role?: string;
  is_details?: boolean;
}

/* ================= HELPERS ================= */

const resolveFounderBadge = (pro: Professional): string | undefined => {
  if (pro.is_founder) return "Founder";
  return undefined;
};

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Location", value: "location" },
];

/* ================= PROFESSIONAL CARD ================= */

const ProfessionalCard = ({
  pro,
  onCardClick,
}: {
  pro: Professional;
  onCardClick: (pro: Professional) => void;
}) => {
  const founderBadge = resolveFounderBadge(pro);

  return (
    <div
      onClick={() => pro.is_details && onCardClick(pro)}
      className={`group rounded-[22px] overflow-hidden bg-white border-2 border-[#24bbcb]/30 shadow-md hover:shadow-xl hover:border-[#24bbcb] transition-all duration-300 flex flex-col select-none ${
        pro.is_details ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={pro?.profile_image || "https://via.placeholder.com/400x500?text=No+Image"}
          alt={pro.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {founderBadge && (
          <span className="absolute top-3 left-3 bg-[#24bbcb] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md tracking-wide">
            {founderBadge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{pro.name}</h3>

        <p className="text-gray-500 text-sm -mt-1">
          {pro.professional_title || "Beauty Expert"}
        </p>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1.5 text-[#24bbcb] shrink-0" />
          {pro?.locations?.[0]?.city},&nbsp;{pro?.locations?.[0]?.state}
        </div>

        {pro.instagram && (
          <div className="flex items-center text-sm text-[#24bbcb]">
            <Instagram className="w-4 h-4 mr-1.5 shrink-0" />
            <span>{pro.instagram}</span>
          </div>
        )}

        {(pro.specialty || pro.professional_title) && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 bg-[#24bbcb]/10 text-[#24bbcb] text-xs font-medium px-3 py-1.5 rounded-full border border-[#24bbcb]/20">
              <BadgeCheck className="w-3.5 h-3.5" />
              {pro.specialty || pro.professional_title}
            </span>
          </div>
        )}

        <Button
          onClick={(e) => e.stopPropagation()}
          className="mt-auto w-full bg-[#24bbcb] hover:bg-[#1ea8b5] text-white rounded-full py-5 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 gap-2"
        >
          <CalendarDays className="w-4 h-4" />
          Book Now
        </Button>
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const ProfessionalsMarketplace = () => {
  const [activeSort, setActiveSort] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  /* Close dropdowns on outside click using refs */
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  /* Filter state */
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"specialty" | "location">("specialty");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  /* GlamCardLivePreview state */
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
/* ================= MAPPER ================= */

const mapProToGlamCardData = (pro: Professional): any => ({
  // Identity
  name: pro.name || "",
  professional_title: pro.professional_title || "Beauty Expert",
  profile_image: pro.profile_image || "",
  profileImage: pro.profile_image || "",
  instagram: pro.instagram || "",
  location: pro.location || pro.locations?.[0]?.city
    ? `${pro.locations?.[0]?.city}, ${pro.locations?.[0]?.state}`
    : "",
  specialty: pro.specialty || pro.professional_title || "",
  role: pro.role || "",
  is_founder: pro.is_founder || false,
  locations: pro.locations || [],

  // GlamCardFormData required fields with safe defaults
  offer_promotion: false,
  promotion_details: "",
  booking_link: "",
  bio: "",
  services: [],
  gallery: [],
  certifications: [],
  availability: [],
  social_links: {},
  phone: "",
  email: "",
  website: "",
  years_of_experience: "",
  languages: [],
  payment_methods: [],
  // Add any other required fields from GlamCardFormData here with defaults
});
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const data = await getBusinessProfile();
        setProfessionals(data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load professionals.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [professionals, searchQuery, selectedSpecialties, selectedLocations]);

  const filteredProfessionals = professionals
    .filter((pro) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = pro.name?.toLowerCase().includes(q);
        const cityMatch = pro.locations?.[0]?.city?.toLowerCase().includes(q);
        const stateMatch = pro.locations?.[0]?.state?.toLowerCase().includes(q);
        const titleMatch = pro.professional_title?.toLowerCase().includes(q);
        if (!nameMatch && !cityMatch && !stateMatch && !titleMatch) return false;
      }
      if (selectedSpecialties.length > 0) {
        const proSpecialty = pro.specialty || pro.professional_title || "Beauty Expert";
        if (!selectedSpecialties.includes(proSpecialty)) return false;
      }
      if (selectedLocations.length > 0) {
        const proLocation = pro.locations?.[0]?.city
          ? `${pro.locations[0].city}, ${pro.locations[0].state}`
          : null;
        if (!proLocation || !selectedLocations.includes(proLocation)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.is_founder && !b.is_founder) return -1;
      if (!a.is_founder && b.is_founder) return 1;
      let valA = "";
      let valB = "";
      if (activeSort === "name") {
        valA = a.name?.toLowerCase() || "";
        valB = b.name?.toLowerCase() || "";
      } else if (activeSort === "location") {
        valA = (a.locations?.[0]?.city || "").toLowerCase();
        valB = (b.locations?.[0]?.city || "").toLowerCase();
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  /* Derive unique specialties and locations from data */
  const allSpecialties = Array.from(
    new Set(
      professionals
        .map((p) => p.specialty || p.professional_title || "Beauty Expert")
        .filter(Boolean)
    )
  ).sort();
console.log(allSpecialties,"")
  const allLocations = Array.from(
    new Set(
      professionals
        .map((p) =>
          p.locations?.[0]?.city
            ? `${p.locations[0].city}, ${p.locations[0].state}`
            : null
        )
        .filter(Boolean) as string[]
    )
  ).sort();

  const totalPages = Math.ceil(filteredProfessionals.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstCard, indexOfLastCard);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
console.log(professionals,"professionalsprofessionals")
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/70 to-white">
      <div className="container-glamlink px-5 md:px-8">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl tracking-tight text-gray-900 mb-5">
            <span className="text-[#24bbcb]">Meet the Professionals</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our verified beauty experts ready to transform your look.
          </p>
        </div>

        {/* Search & Sort */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-3 items-center">

            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#24bbcb] transition shadow-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:border-[#24bbcb] transition whitespace-nowrap"
              >
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                {/* FIX 1: Clean label — no "undefined" when nothing selected */}
                {activeSort
                  ? `Sort by ${sortOptions.find((o) => o.value === activeSort)?.label}`
                  : "Sort by"}
                {/* FIX 2: Only show arrow when a sort is active */}
                {activeSort && (
                  sortDir === "asc"
                    ? <ArrowUp className="w-4 h-4 text-[#24bbcb]" />
                    : <ArrowDown className="w-4 h-4 text-[#24bbcb]" />
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {sortOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 min-w-[160px] overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (activeSort === option.value) {
                          setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                        } else {
                          setActiveSort(option.value);
                          setSortDir("asc");
                        }
                        setSortOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <span>{option.label}</span>
                      {activeSort === option.value && (
                        sortDir === "asc"
                          ? <ArrowUp className="w-4 h-4 text-[#24bbcb]" />
                          : <ArrowDown className="w-4 h-4 text-[#24bbcb]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters Button */}
            <div className="relative" ref={filterRef}>
              <Button
                variant="outline"
                onClick={() => setFilterOpen((o) => !o)}
                className={`rounded-full px-4 py-3 h-auto text-sm font-medium transition ${
                  filterOpen || selectedSpecialties.length > 0 || selectedLocations.length > 0
                    ? "border-[#24bbcb] text-[#24bbcb]"
                    : ""
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedSpecialties.length + selectedLocations.length) > 0 && (
                  <span className="ml-1.5 bg-[#24bbcb] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedSpecialties.length + selectedLocations.length}
                  </span>
                )}
              </Button>

              {/* Filter Panel */}
              {filterOpen && (
                <div
                  className="absolute top-full mt-2 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 w-72"
                >
                  {/* Tabs */}
                  <div className="flex border-b border-gray-100">
                    {(["specialty", "location"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFilterTab(tab)}
                        className={`flex-1 py-3 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
                          activeFilterTab === tab
                            ? "border-[#24bbcb] text-[#24bbcb]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab === "specialty" ? "Specialty" : "Location"}
                      </button>
                    ))}
                  </div>

                  {/* FIX 3: Checkbox List — changed <label onClick> to <div onClick> to prevent double-toggle */}
                  <div className="max-h-64 overflow-y-auto py-2">
                    {(activeFilterTab === "specialty" ? allSpecialties : allLocations).map((item) => {
                      const selected =
                        activeFilterTab === "specialty"
                          ? selectedSpecialties.includes(item)
                          : selectedLocations.includes(item);

                      const toggle = () => {
                        if (activeFilterTab === "specialty") {
                          setSelectedSpecialties((prev) =>
                            prev.includes(item)
                              ? prev.filter((s) => s !== item)
                              : [...prev, item]
                          );
                        } else {
                          setSelectedLocations((prev) =>
                            prev.includes(item)
                              ? prev.filter((l) => l !== item)
                              : [...prev, item]
                          );
                        }
                      };

                      return (
                        <div
                          key={item}
                          onClick={toggle}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer select-none"
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition ${
                              selected
                                ? "bg-[#24bbcb] border-[#24bbcb]"
                                : "border-gray-300"
                            }`}
                          >
                            {selected && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                viewBox="0 0 10 10"
                              >
                                <path
                                  d="M1.5 5l2.5 2.5 4.5-4.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  {(selectedSpecialties.length + selectedLocations.length) > 0 && (
                    <div className="border-t border-gray-100 p-3 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedSpecialties([]);
                          setSelectedLocations([]);
                        }}
                        className="text-xs text-gray-500 hover:text-red-500 transition"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="text-center py-10 text-gray-500">Loading professionals...</div>
        )}
        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Empty state */}
            {currentProfessionals.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium">No professionals found.</p>
                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
              </div>
            )}

            {/* Grid */}
            {currentProfessionals.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                {currentProfessionals.map((pro) => (
                  <ProfessionalCard
                    key={pro.id}
                    pro={pro}
                    onCardClick={(p) => setSelectedPro(p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-[#24bbcb] text-white shadow"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selectedPro && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPro(null)}
          >
            <div
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPro(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
             {/* <GlamCardLivePreview data={mapProToGlamCardData(selectedPro)} mode="view" /> */}
             <BusinessCardPage slug={selectedPro?.business_card_link.split('/').pop()} mode="view" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProfessionalsMarketplace;