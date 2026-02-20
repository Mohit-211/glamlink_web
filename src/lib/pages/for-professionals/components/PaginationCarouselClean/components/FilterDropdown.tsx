import { Filter, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface FilterDropdownProps {
  selectedSpecialties: string[];
  selectedLocations: string[];
  uniqueSpecialties: string[];
  uniqueLocations: string[];
  toggleSpecialty: (specialty: string) => void;
  toggleLocation: (location: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function FilterDropdown({
  selectedSpecialties,
  selectedLocations,
  uniqueSpecialties,
  uniqueLocations,
  toggleSpecialty,
  toggleLocation,
  isOpen,
  setIsOpen,
}: FilterDropdownProps) {
  const [activeTab, setActiveTab] = useState<"specialty" | "location">("specialty");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const activeFiltersCount = 
    selectedSpecialties.length + 
    selectedLocations.length;

  const clearAllFilters = () => {
    selectedSpecialties.forEach(s => toggleSpecialty(s));
    selectedLocations.forEach(l => toggleLocation(l));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-glamlink-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-lg z-50 w-[400px]">
          {/* Filter Tabs */}
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setActiveTab("specialty")}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === "specialty"
                  ? "text-glamlink-teal border-b-2 border-glamlink-teal"
                  : "text-gray-900 hover:text-gray-700"
              }`}
            >
              Specialty{selectedSpecialties.length > 0 && ` (${selectedSpecialties.length})`}
            </button>
            <button
              onClick={() => setActiveTab("location")}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === "location"
                  ? "text-glamlink-teal border-b-2 border-glamlink-teal"
                  : "text-gray-900 hover:text-gray-700"
              }`}
            >
              Location{selectedLocations.length > 0 && ` (${selectedLocations.length})`}
            </button>
          </div>

          {/* Filter Content */}
          <div className="max-h-[300px] overflow-y-auto p-4">
            {activeTab === "specialty" && (
              <div className="space-y-2">
                {uniqueSpecialties.map(specialty => (
                  <label key={specialty} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                      className="w-4 h-4 text-glamlink-teal border-gray-300 rounded focus:ring-glamlink-teal"
                    />
                    <span className="text-sm text-gray-900">{specialty}</span>
                  </label>
                ))}
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-2">
                {uniqueLocations.map(location => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleLocation(location)}
                      className="w-4 h-4 text-glamlink-teal border-gray-300 rounded focus:ring-glamlink-teal"
                    />
                    <span className="text-sm text-gray-900">{location}</span>
                  </label>
                ))}
              </div>
            )}

          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}