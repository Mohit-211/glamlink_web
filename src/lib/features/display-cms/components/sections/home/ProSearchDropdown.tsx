'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, X, MapPin, User, Sparkles } from 'lucide-react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

// =============================================================================
// TYPES
// =============================================================================

interface Coordinate {
  lat: number;
  lng: number;
}

interface LocationResult {
  name: string;
  lat: number;
  lng: number;
  count: number;
}

interface SearchResult {
  type: 'location' | 'professional' | 'specialty';
  id: string;
  label: string;
  sublabel?: string;
  count?: number;
  data: LocationResult | Professional | string;
}

interface ProSearchDropdownProps {
  professionals: Professional[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchCenterChange: (center: Coordinate | null) => void;
  onProfessionalSelect: (pro: Professional) => void;
  /** Called when search is applied (Enter pressed or result clicked) */
  onSearchApply?: (query: string, center: Coordinate | null) => void;
  placeholder?: string;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract unique locations from professionals with counts
 */
const extractUniqueLocations = (pros: Professional[]): LocationResult[] => {
  const locations = new Map<string, LocationResult>();

  pros.forEach((pro) => {
    // Try to get city from locationData first, then parse from location string
    let city = pro.locationData?.city;
    let state = pro.locationData?.state;
    let lat = pro.locationData?.lat || 0;
    let lng = pro.locationData?.lng || 0;

    // Fallback to parsing location string
    if (!city && pro.location) {
      const parts = pro.location.split(',').map((p) => p.trim());
      if (parts.length >= 1) {
        city = parts[0];
      }
      if (parts.length >= 2) {
        // Extract state from "City, STATE" or "City, State ZIP"
        const statePart = parts[1].split(' ')[0];
        if (statePart && statePart.length <= 3) {
          state = statePart;
        }
      }
    }

    // Also check locations array
    if (!city && pro.locations && pro.locations.length > 0) {
      const primary = pro.locations.find((loc) => loc.isPrimary) || pro.locations[0];
      city = primary.city;
      state = primary.state;
      lat = primary.lat;
      lng = primary.lng;
    }

    if (city) {
      const key = state ? `${city}, ${state}` : city;
      const existing = locations.get(key);

      if (existing) {
        existing.count++;
        // Update coordinates if we have better ones
        if (lat && lng && (!existing.lat || !existing.lng)) {
          existing.lat = lat;
          existing.lng = lng;
        }
      } else {
        locations.set(key, {
          name: key,
          count: 1,
          lat,
          lng,
        });
      }
    }
  });

  return Array.from(locations.values()).sort((a, b) => b.count - a.count);
};

/**
 * Check if a professional matches the search query
 * Searches: name, specialty, specialties, title, location, phone, email,
 * importantInfo, and all business addresses (locationData + locations array)
 */
const professionalMatchesQuery = (pro: Professional, q: string): boolean => {
  // Basic fields
  if (pro.name?.toLowerCase().includes(q)) return true;
  if (pro.specialty?.toLowerCase().includes(q)) return true;
  if (pro.title?.toLowerCase().includes(q)) return true;
  if (pro.location?.toLowerCase().includes(q)) return true;

  // Contact info
  if (pro.phone?.toLowerCase().includes(q)) return true;
  if (pro.email?.toLowerCase().includes(q)) return true;

  // Specialties array
  if (pro.specialties?.some((s) => s.toLowerCase().includes(q))) return true;

  // Important info array
  if (pro.importantInfo?.some((info) => info.toLowerCase().includes(q))) return true;

  // Single location data (legacy)
  if (pro.locationData?.address?.toLowerCase().includes(q)) return true;
  if (pro.locationData?.city?.toLowerCase().includes(q)) return true;
  if (pro.locationData?.state?.toLowerCase().includes(q)) return true;
  if (pro.locationData?.zipCode?.toLowerCase().includes(q)) return true;
  if (pro.locationData?.businessName?.toLowerCase().includes(q)) return true;

  // Multiple locations array
  if (pro.locations?.some((loc) => {
    if (loc.address?.toLowerCase().includes(q)) return true;
    if (loc.city?.toLowerCase().includes(q)) return true;
    if (loc.state?.toLowerCase().includes(q)) return true;
    if (loc.zipCode?.toLowerCase().includes(q)) return true;
    if (loc.businessName?.toLowerCase().includes(q)) return true;
    if (loc.label?.toLowerCase().includes(q)) return true;
    return false;
  })) return true;

  return false;
};

/**
 * Get search results from professionals based on query
 */
const getSearchResults = (
  query: string,
  professionals: Professional[]
): SearchResult[] => {
  if (!query.trim() || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // 1. Match Locations (city/state only for location grouping)
  const uniqueLocations = extractUniqueLocations(professionals);
  const matchingLocations = uniqueLocations.filter((loc) =>
    loc.name.toLowerCase().includes(q)
  );
  matchingLocations.slice(0, 5).forEach((loc) => {
    results.push({
      type: 'location',
      id: `loc-${loc.name}`,
      label: loc.name,
      count: loc.count,
      data: loc,
    });
  });

  // 2. Match Professionals by comprehensive search
  // (name, phone, email, address, importantInfo, specialties, etc.)
  const matchingPros = professionals.filter((pro) =>
    professionalMatchesQuery(pro, q)
  );
  matchingPros.slice(0, 5).forEach((pro) => {
    results.push({
      type: 'professional',
      id: `pro-${pro.id}`,
      label: pro.name || 'Unknown',
      sublabel: pro.specialty || pro.title,
      data: pro,
    });
  });

  // 3. Match Specialties
  const specialtyMap = new Map<string, number>();
  professionals.forEach((pro) => {
    // Check single specialty field
    if (pro.specialty?.toLowerCase().includes(q)) {
      const count = specialtyMap.get(pro.specialty) || 0;
      specialtyMap.set(pro.specialty, count + 1);
    }
    // Check specialties array
    pro.specialties?.forEach((s) => {
      if (s.toLowerCase().includes(q)) {
        const count = specialtyMap.get(s) || 0;
        specialtyMap.set(s, count + 1);
      }
    });
  });

  Array.from(specialtyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([specialty, count]) => {
      results.push({
        type: 'specialty',
        id: `spec-${specialty}`,
        label: specialty,
        count,
        data: specialty,
      });
    });

  return results;
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProSearchDropdown({
  professionals,
  searchQuery,
  onSearchChange,
  onSearchCenterChange,
  onProfessionalSelect,
  onSearchApply,
  placeholder = 'Search by name, specialty, or location...',
}: ProSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const justSelectedRef = useRef(false); // Track if we just selected a result

  // Calculate search results
  const searchResults = useMemo(
    () => getSearchResults(searchQuery, professionals),
    [searchQuery, professionals]
  );

  // Group results by type
  const groupedResults = useMemo(() => {
    const locations = searchResults.filter((r) => r.type === 'location');
    const pros = searchResults.filter((r) => r.type === 'professional');
    const specialties = searchResults.filter((r) => r.type === 'specialty');
    return { locations, pros, specialties };
  }, [searchResults]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    return [
      ...groupedResults.locations,
      ...groupedResults.pros,
      ...groupedResults.specialties,
    ];
  }, [groupedResults]);

  // Handle result selection (called when clicking a result or pressing Enter)
  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      let newCenter: Coordinate | null = null;
      let newQuery = '';

      switch (result.type) {
        case 'location': {
          const loc = result.data as LocationResult;
          newCenter = { lat: loc.lat, lng: loc.lng };
          newQuery = result.label;
          onSearchCenterChange(newCenter);
          onSearchChange(newQuery);
          break;
        }
        case 'professional': {
          const pro = result.data as Professional;
          newQuery = pro.name || '';
          // Get pro coordinates for centering
          if (pro.locationData?.lat && pro.locationData?.lng) {
            newCenter = { lat: pro.locationData.lat, lng: pro.locationData.lng };
          } else if (pro.locations && pro.locations.length > 0) {
            const primary = pro.locations.find((loc) => loc.isPrimary) || pro.locations[0];
            if (primary.lat && primary.lng) {
              newCenter = { lat: primary.lat, lng: primary.lng };
            }
          }
          onProfessionalSelect(pro);
          onSearchChange(newQuery);
          break;
        }
        case 'specialty': {
          newQuery = result.data as string;
          newCenter = null;
          onSearchChange(newQuery);
          onSearchCenterChange(null);
          break;
        }
      }

      // Notify parent that search was applied (for map update)
      if (onSearchApply) {
        onSearchApply(newQuery, newCenter);
      }

      // Mark that we just selected - prevents dropdown from reopening
      justSelectedRef.current = true;
      setIsOpen(false);
      setFocusedIndex(-1);
    },
    [onSearchChange, onSearchCenterChange, onProfessionalSelect, onSearchApply]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle Enter key - select focused result or first result
      if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults.length > 0) {
          // If an item is focused, select it; otherwise select the first result
          const indexToSelect = focusedIndex >= 0 ? focusedIndex : 0;
          handleResultSelect(flatResults[indexToSelect]);
        }
        return;
      }

      if (!isOpen && e.key === 'ArrowDown') {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [isOpen, flatResults, focusedIndex, handleResultSelect]
  );

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedEl = listRef.current.querySelector(
        `[data-index="${focusedIndex}"]`
      );
      if (focusedEl) {
        focusedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when typing (but not after selecting a result)
  useEffect(() => {
    // Skip reopening if we just selected a result
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setFocusedIndex(-1);
  }, [searchQuery, searchResults.length]);

  // Render icon for result type
  const renderIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'location':
        return <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />;
      case 'professional':
        return <User className="w-4 h-4 text-gray-400 flex-shrink-0" />;
      case 'specialty':
        return <Sparkles className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
  };

  // Render a single result item
  const renderResultItem = (result: SearchResult, index: number) => {
    const isFocused = index === focusedIndex;

    return (
      <button
        key={result.id}
        data-index={index}
        onClick={() => handleResultSelect(result)}
        className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors ${
          isFocused ? 'bg-glamlink-teal/10' : 'hover:bg-gray-50'
        }`}
        role="option"
        aria-selected={isFocused}
      >
        {renderIcon(result.type)}
        <div className="flex-1 min-w-0">
          <span className="block truncate text-sm text-gray-900">
            {result.label}
          </span>
          {result.sublabel && (
            <span className="block truncate text-xs text-gray-500">
              {result.sublabel}
            </span>
          )}
        </div>
        {result.count !== undefined && (
          <span className="text-xs text-gray-400 flex-shrink-0">
            ({result.count})
          </span>
        )}
      </button>
    );
  };

  // Calculate running index for flat navigation
  let runningIndex = 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal outline-none transition-colors"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              onSearchCenterChange(null);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {/* Locations */}
          {groupedResults.locations.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Locations ({groupedResults.locations.length})
                </span>
              </div>
              {groupedResults.locations.map((result) => {
                const item = renderResultItem(result, runningIndex);
                runningIndex++;
                return item;
              })}
            </div>
          )}

          {/* Professionals */}
          {groupedResults.pros.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Professionals ({groupedResults.pros.length})
                </span>
              </div>
              {groupedResults.pros.map((result) => {
                const item = renderResultItem(result, runningIndex);
                runningIndex++;
                return item;
              })}
            </div>
          )}

          {/* Specialties */}
          {groupedResults.specialties.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Specialties ({groupedResults.specialties.length})
                </span>
              </div>
              {groupedResults.specialties.map((result) => {
                const item = renderResultItem(result, runningIndex);
                runningIndex++;
                return item;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
