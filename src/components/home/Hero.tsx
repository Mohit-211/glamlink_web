"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, UserCheck, AlertCircle } from "lucide-react";
import { searchBusinessCard, getBusinessCardBySlug, getBusinessProfile } from "@/api/Api";
import GlamCardLivePreview from "../glamcard/GlamCardLivePreview";
import ProfessionalsMap from "./ProfessionalsMap";
import BusinessCardPage from "../BusinessCardPage";

// ─── Leaflet types (loaded dynamically) ───────────────────────────────────────
declare global {
  interface Window {
    L: any;
  }
}

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [mapProfessionals, setMapProfessionals] = useState<any[]>([]);

  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectedMarkerRef = useRef<any>(null);
  const leafletLoadedRef = useRef(false);
  console.log(mapProfessionals, "mapProfessionals")
  // ─── Load Leaflet CSS + JS dynamically ───────────────────────────────────────


  // ─── Init Leaflet map ─────────────────────────────────────────────────────────


  // ─── When a professional is selected, fly to their location + highlight marker ─
  useEffect(() => {
    if (!selectedProfessional || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    const locations = selectedProfessional?.locations || [];
    const loc = locations[selectedLocationIndex] || locations[0];
    if (!loc) return;

    const lat = parseFloat(loc.latitude || loc.lat);
    const lng = parseFloat(loc.longitude || loc.lng || loc.lon);

    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 15, { duration: 1.2 });

      // Remove previous selected marker
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.remove();
        selectedMarkerRef.current = null;
      }

      // Add a highlighted marker for selected professional
      const selectedIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative; width:46px; height:56px; display:flex; flex-direction:column; align-items:center;">
            <div style="
              width: 46px; height: 46px;
              background: #17a9b7;
              border-radius: 50%;
              box-shadow: 0 6px 20px rgba(36,187,203,0.65);
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
              border: 2.5px solid rgba(255,255,255,0.6);
            ">
              <span style="
                color: #fff;
                font-size: 17px;
                font-weight: 700;
                font-family: 'DM Sans', sans-serif;
                line-height: 1;
                letter-spacing: -0.02em;
              ">${selectedProfessional.name?.charAt(0)?.toUpperCase() || "?"}</span>
            </div>
            <div style="
              width: 0; height: 0;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 12px solid #17a9b7;
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [46, 56],
        iconAnchor: [23, 56],
        popupAnchor: [0, -58],
      });

      const marker = L.marker([lat, lng], { icon: selectedIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;font-weight:600;color:#17a9b7;">${selectedProfessional.name}</div>`,
          { closeButton: false }
        )
        .openPopup();

      selectedMarkerRef.current = marker;
    } else {
      // Fallback: geocode via display string
      const parts = [loc.address, loc.city, loc.state].filter(Boolean);
      if (!parts.length) return;
      const query = parts.join(", ");
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then((r) => r.json())
        .then((results) => {
          if (results?.[0]) {
            map.flyTo([parseFloat(results[0].lat), parseFloat(results[0].lon)], 14, { duration: 1.2 });
          }
        })
        .catch(() => { });
    }
  }, [selectedProfessional, selectedLocationIndex]);

  // ─── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Debounce ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─── Sequential search ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery) {
      setProfessionals([]);
      setShowDropdown(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        let result: any[] = [];

        const specialtyRes = await searchBusinessCard({ specialty: debouncedQuery });
        result = specialtyRes?.data?.data || specialtyRes?.data || [];

        if (!result.length) {
          const locationRes = await searchBusinessCard({ location: debouncedQuery });
          result = locationRes?.data?.data || locationRes?.data || [];
        }

        if (!result.length) {
          const nameRes = await searchBusinessCard({ name: debouncedQuery });
          result = nameRes?.data?.data || nameRes?.data || [];
        }

        setProfessionals(result);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  // ─── Select → fetch full profile ─────────────────────────────────────────────
  const handleSelectProfessional = async (pro: any) => {
    try {
      setShowDropdown(false);
      setSearchQuery(pro.name || "");

      const res = await getBusinessCardBySlug(pro.slug);
      const fullData = res?.data?.data || res?.data;
      setSelectedProfessional(fullData);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  // ─── Set primary location index ───────────────────────────────────────────────
  useEffect(() => {
    if (selectedProfessional?.locations?.length) {
      const primaryIdx = selectedProfessional.locations.findIndex(
        (loc: any) => loc.is_primary
      );
      setSelectedLocationIndex(primaryIdx >= 0 ? primaryIdx : 0);
    }
  }, [selectedProfessional]);

  // ─── Fetch mapProfessionals ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const data = await getBusinessProfile();
        const filtered = (data?.data || []).filter((pro: any) => pro.is_details === true);
        setMapProfessionals(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  // ─── Location selector for selected professional ──────────────────────────────
  const locations = selectedProfessional?.locations || [];
  console.log(locations, "locations")
  const address = "7575 S Rainbow Blvd"
  // ─── Avatar initial helper ───────────────────────────────────────────────────
  const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "?";
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    if (!mapProfessionals.length) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Pick the first professional with a valid location
    const proWithLocation = mapProfessionals.find(
      (pro) => pro.locations && pro.locations.length > 0
    );
    if (!proWithLocation) return;

    const loc = proWithLocation.locations[0]; // first location
    const address = loc.address?.trim() || [loc.city, loc.state].filter(Boolean).join(", ");

    if (!address) return;

    // Geocode dynamically
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data[0]) return;

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        const marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${address}</b>`)
          .openPopup();

        markersRef.current.push(marker);

        // Center map on this dynamic pin
        map.setView([lat, lon], 15);
      })
      .catch((err) => console.error("Geocode error:", err));
  }, [mapInstanceRef.current, mapProfessionals]);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pro-dropdown {
          animation: dropdownIn 0.18s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .pro-dropdown::-webkit-scrollbar { width: 4px; }
        .pro-dropdown::-webkit-scrollbar-track { background: transparent; }
        .pro-dropdown::-webkit-scrollbar-thumb {
          background: rgba(36, 187, 203, 0.25);
          border-radius: 99px;
        }

        /* Leaflet popup custom style */
        .glam-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 28px rgba(36,187,203,0.15), 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid rgba(36,187,203,0.2);
          padding: 10px 14px;
        }
        .glam-popup .leaflet-popup-tip {
          background: white;
        }
        .glam-popup .leaflet-popup-content {
          margin: 0;
        }

        /* Fix Leaflet z-index in Next.js */
        .leaflet-container {
          z-index: 0;
        }
      `}</style>

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
        <div className="px-5 md:px-8">

          {/* Hero text block */}
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-2xl md:text-5xl tracking-tight text-gray-900 mb-5 leading-tight">
              Discover Beauty Professionals Near You
              <br className="hidden sm:block" />
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse by location or specialty
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto mb-6" ref={dropdownRef}>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-[#24bbcb]" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => searchQuery && setShowDropdown(true)}
                  className="w-full pl-14 pr-6 py-4.5 bg-white border border-gray-200 rounded-full text-base shadow-sm 
                             focus:outline-none focus:border-[#24bbcb]/60 focus:ring-4 focus:ring-[#24bbcb]/15 
                             transition-all duration-200 placeholder:text-gray-400"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              {/* Dropdown */}
              {showDropdown && searchQuery && (
                <div
                  className="pro-dropdown absolute mt-3 w-full z-50 overflow-hidden p-3 md:p-4"
                  style={{
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(36,187,203,0.18)",
                    borderRadius: "18px",
                    boxShadow: "0 8px 40px rgba(36,187,203,0.10), 0 2px 12px rgba(0,0,0,0.07)",
                    maxHeight: "340px",
                    overflowY: "auto",
                    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-10 gap-2.5">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#24bbcb" }} />
                      <span style={{ fontSize: "13px", color: "#8a9aaa", letterSpacing: "0.01em" }}>
                        Finding professionals…
                      </span>
                    </div>
                  ) : professionals.length > 0 ? (
                    <>
                      <div
                        className="flex items-center gap-1.5 px-[18px] py-3"
                        style={{ borderBottom: "1px solid rgba(36,187,203,0.10)" }}
                      >
                        <UserCheck size={13} style={{ color: "#24bbcb", flexShrink: 0 }} />
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#24bbcb",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}>
                          Professionals
                        </span>
                        <span className="ml-auto" style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#aabbcc",
                          background: "rgba(36,187,203,0.08)",
                          borderRadius: "99px",
                          padding: "1px 8px",
                        }}>
                          {professionals.length}
                        </span>
                      </div>

                      {professionals.map((pro, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectProfessional(pro)}
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="w-full text-left flex items-center gap-3 px-[18px] py-3"
                          style={{
                            background: hoveredIndex === i ? "rgba(36,187,203,0.05)" : "transparent",
                            border: "none",
                            borderBottom: i < professionals.length - 1
                              ? "1px solid rgba(0,0,0,0.04)"
                              : "none",
                            cursor: "pointer",
                            transform: hoveredIndex === i ? "translateX(2px)" : "translateX(0)",
                            transition: "background 0.14s ease, transform 0.12s ease",
                          }}
                        >
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: hoveredIndex === i ? "rgba(36,187,203,0.15)" : "rgba(36,187,203,0.08)",
                            border: `1.5px solid ${hoveredIndex === i ? "rgba(36,187,203,0.4)" : "rgba(36,187,203,0.15)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all 0.14s",
                          }}>
                            <span style={{
                              fontSize: "13px", fontWeight: 600,
                              color: hoveredIndex === i ? "#17a9b7" : "#5ac8d4",
                              letterSpacing: "-0.01em",
                            }}>
                              {getInitial(pro.name)}
                            </span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: "14px", fontWeight: 500,
                              color: hoveredIndex === i ? "#17a9b7" : "#1a2533",
                              letterSpacing: "-0.01em",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              transition: "color 0.14s",
                            }}>
                              {pro.name || "—"}
                            </div>
                            <div style={{
                              fontSize: "12px", color: "#9aaabb", fontWeight: 400,
                              marginTop: "1px",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                              {pro.primary_specialty || "—"}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-10">
                      <AlertCircle size={20} style={{ color: "#d0dce8" }} />
                      <span style={{ fontSize: "13px", color: "#9aaabb" }}>No professionals found</span>
                      <span style={{ fontSize: "12px", color: "#c0ccd8" }}>Try a different name or specialty</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {selectedProfessional
                ? "Professional selected — view profile below"
                : `Showing ${mapProfessionals.length} professional${mapProfessionals.length !== 1 ? "s" : ""} on map`}
            </p>
          </div>

          {/* Map + Preview grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">

            {/* ── Map panel (Leaflet, multi-marker) ── */}
            <div className="rounded-2xl border border-gray-200/80 overflow-hidden bg-white shadow-sm h-[400px] md:h-[700px] flex flex-col">
              {/* Location selector when a professional is selected and has multiple locations */}
              {locations.length > 1 && (
                <div className="p-4 border-b bg-gray-50/50">
                  <select
                    value={selectedLocationIndex}
                    onChange={(e) => setSelectedLocationIndex(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-[#24bbcb]/30 focus:border-[#24bbcb]/60 transition"
                  >
                    {locations.map((loc: any, idx: number) => (
                      <option key={idx} value={idx}>
                        {loc.label || loc.city || `Location ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Map container */}
              <div className="relative flex-1">
                <ProfessionalsMap
                  professionals={mapProfessionals} // your Hero state
                  onSelectProfessional={(pro) => setSelectedProfessional(pro)} // updates preview
                />
              </div>
            </div>

            {/* Live preview panel */}
            <div className="rounded-2xl border border-gray-200/80 overflow-hidden bg-white shadow-sm h-[400px] md:h-[700px] flex flex-col">
              {selectedProfessional ? (
                <div className="flex-1 overflow-y-auto">
                  {/* <GlamCardLivePreview data={selectedProfessional} mode="view" /> */}
                  <BusinessCardPage slug={selectedProfessional?.business_card_link.split('/').pop()} mode="view" />

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-[#24bbcb]/10 flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-[#24bbcb]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Select a Professional
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Search above or browse curated talent to see their digital card instantly
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;