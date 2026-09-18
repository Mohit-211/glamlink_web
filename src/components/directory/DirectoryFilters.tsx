"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowDownAZ, ArrowUpZA, X } from "lucide-react";
import { CompanyCategory } from "@/types/company";
import { COMPANY_CATEGORY_FILTERS } from "@/lib/companies";

export type DirectoryTab = "all" | "professionals" | CompanyCategory;

const TABS: { value: DirectoryTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "professionals", label: "Professionals" },
  ...COMPANY_CATEGORY_FILTERS,
];

interface DirectoryFiltersProps {
  activeTab: DirectoryTab;
  onTabChange: (tab: DirectoryTab) => void;
  tabCounts: Partial<Record<DirectoryTab, number>>;
  locations: string[];
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  specialties: string[];
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  sortAZ: boolean;
  onToggleSort: () => void;
}

const DirectoryFilters = ({
  activeTab,
  onTabChange,
  tabCounts,
  locations,
  selectedLocation,
  onLocationChange,
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
  sortAZ,
  onToggleSort,
}: DirectoryFiltersProps) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const activeFilterCount = (selectedLocation ? 1 : 0) + (selectedSpecialty ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Category pills — horizontally scrollable on mobile */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const count = tabCounts[tab.value];
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-full border transition-colors duration-150 whitespace-nowrap ${
                  active
                    ? "bg-[#24bbcb] border-[#24bbcb] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#24bbcb]/50 hover:text-[#24bbcb]"
                }`}
              >
                {tab.label}
                {typeof count === "number" && (
                  <span
                    className={`text-[11px] ${active ? "text-white/80" : "text-gray-400"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPanelOpen((o) => !o)}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-full border transition-colors duration-150 ${
            panelOpen || activeFilterCount > 0
              ? "border-[#24bbcb] text-[#24bbcb] bg-[#24bbcb]/5"
              : "border-gray-200 text-gray-600 hover:border-[#24bbcb]/50 hover:text-[#24bbcb]"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-[#24bbcb] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Location / specialty / sort panel */}
      {panelOpen && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-[#fafafa] p-4">
          {locations.length > 0 && (
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="text-[13px] rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:outline-none focus:border-[#24bbcb]"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          )}

          {specialties.length > 0 && (
            <select
              value={selectedSpecialty}
              onChange={(e) => onSpecialtyChange(e.target.value)}
              className="text-[13px] rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:outline-none focus:border-[#24bbcb]"
            >
              <option value="">All specialties &amp; industries</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onToggleSort}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:border-[#24bbcb] hover:text-[#24bbcb] transition-colors"
          >
            {sortAZ ? <ArrowDownAZ className="h-3.5 w-3.5" /> : <ArrowUpZA className="h-3.5 w-3.5" />}
            {sortAZ ? "A–Z" : "Z–A"}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                onLocationChange("");
                onSpecialtyChange("");
              }}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-red-500 transition-colors ml-auto"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectoryFilters;
