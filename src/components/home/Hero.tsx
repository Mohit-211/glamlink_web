"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { searchBusinessCard, getBusinessCardBySlug } from "@/api/Api";
import GlamCardLivePreview from "../glamcard/GlamCardLivePreview";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ================= SEQUENTIAL SEARCH ================= */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProfessionals([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let result: any[] = [];

        // 1️⃣ Search by specialty
        const specialtyRes = await searchBusinessCard({
          specialty: debouncedQuery,
        });

        result = specialtyRes?.data?.data || specialtyRes?.data || [];

        // 2️⃣ If empty → search by location
        if (!result.length) {
          const locationRes = await searchBusinessCard({
            location: debouncedQuery,
          });
          result = locationRes?.data?.data || locationRes?.data || [];
        }

        // 3️⃣ If empty → search by name
        if (!result.length) {
          const nameRes = await searchBusinessCard({
            name: debouncedQuery,
          });
          result = nameRes?.data?.data || nameRes?.data || [];
        }

        setProfessionals(result);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  /* ================= FETCH FULL PROFILE BY SLUG ================= */
  const handleSelectProfessional = async (pro: any) => {
    try {
      setShowDropdown(false);
      setSearchQuery(pro.name);

      // 🔥 Send slug to API
      const res = await getBusinessCardBySlug(pro.slug);

      const fullData = res?.data?.data || res?.data;

      setSelectedProfessional(fullData);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };
useEffect(() => {
  if (selectedProfessional?.locations?.length) {
    const primaryIndex = selectedProfessional.locations.findIndex(
      (loc: any) => loc.is_primary
    );

    setSelectedLocationIndex(
      primaryIndex !== -1 ? primaryIndex : 0
    );
  }
}, [selectedProfessional]);

  /* ================= RENDER ================= */
console.log(selectedProfessional?.locations[0],"selectedProfessional.location")
  return (
    <section className="pt-40 pb-20 bg-white">
      <div className="container-glamlink">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="section-heading text-3xl sm:text-4xl mb-3">
            Discover Beauty Professionals Near You
          </h1>

          <p className="section-subheading mb-6">
            Browse by location or speciality
          </p>

          {/* ================= SEARCH ================= */}
          <div className="flex justify-center mb-4 relative">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full rounded-full border border-border px-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              {/* ================= DROPDOWN ================= */}
              {showDropdown && searchQuery && (
                <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg max-h-80 overflow-y-auto z-50 text-left">
                  {loading ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      Searching...
                    </p>
                  ) : professionals.length > 0 ? (
                    <>
                      <p className="px-4 py-2 text-xs font-semibold text-gray-400">
                        PROFESSIONALS ({professionals.length})
                      </p>

                      {professionals.map((pro: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => handleSelectProfessional(pro)}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-t"
                        >
                          <p className="text-sm font-medium">
                            {pro.name || "Unnamed"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pro.specialty || "No specialty"}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {selectedProfessional
              ? "1 professional selected"
              : `Showing ${professionals.length} professionals`}
          </p>
        </div>

        {/* ================= MAP + CARD ================= */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* MAP */}
    <div className="lg:col-span-2 rounded-xl border overflow-hidden p-4">
  {(() => {
    const locations = selectedProfessional?.locations || [];

    let location =
      locations[selectedLocationIndex] ||
      locations[0];

    let query = "";
    let zoom = 12;

    if (location) {
      if (location.location_type === "exact_address") {
        if (location.address?.trim()) {
          query = location.address.trim();
          zoom = 15;
        }
      } else {
        const parts = [
          location.city?.trim(),
          location.state?.trim(),
        ].filter(Boolean);

        if (parts.length) {
          query = parts.join(", ");
          zoom = 12;
        }
      }
    }

    if (!query) {
      query = "Las Vegas";
      zoom = 12;
    }

    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
      query
    )}&z=${zoom}&output=embed`;

    return (
      <>
        {/* 🔥 Show dropdown only if more than 1 location */}
        {locations.length > 1 && (
          <div className="mb-3">
            <select
              value={selectedLocationIndex}
              onChange={(e) =>
                setSelectedLocationIndex(
                  Number(e.target.value)
                )
              }
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {locations.map((loc: any, index: number) => (
                <option key={index} value={index}>
                  {loc.label || `Location ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            title="Business Location Map"
            className="w-full h-48 sm:h-64"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          />

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              query
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
          >
            Get Directions
          </a>
        </div>
      </>
    );
  })()}
</div>



          {/* LIVE CARD */}
          <div className="lg:col-span-2 h-[420px] rounded-xl border overflow-y-auto bg-white p-4">
            {selectedProfessional ? (
              <GlamCardLivePreview
                data={selectedProfessional}
                mode="view"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Search className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  Select a Professional
                </p>
                <p className="text-xs text-muted-foreground">
                  Click a professional to view their digital card
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
