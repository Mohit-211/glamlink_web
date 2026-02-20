"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { LocationData } from "@/lib/pages/for-professionals/types/professional";
import { Search, MapPin, Star, ChevronDown } from "lucide-react";

interface LocationSearchProps {
  locations: LocationData[];
  filteredLocations: LocationData[];
  selectedLocation: LocationData | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationSelect: (location: LocationData) => void;
  onShowAll: () => void;
  className?: string;
}

export default function LocationSearch({
  locations,
  filteredLocations,
  selectedLocation,
  searchQuery,
  onSearchChange,
  onLocationSelect,
  onShowAll,
  className = "",
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen && e.key === "ArrowDown") {
      setIsOpen(true);
      setFocusedIndex(0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredLocations.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredLocations.length) {
          onLocationSelect(filteredLocations[focusedIndex]);
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  }, [isOpen, focusedIndex, filteredLocations, onLocationSelect]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleLocationClick = (location: LocationData) => {
    onLocationSelect(location);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSearchChange(""); // Clear search after selection
  };

  const getLocationDisplayName = (location: LocationData) => {
    return location.label || location.businessName || location.address || "Unknown Location";
  };

  const getLocationAddress = (location: LocationData) => {
    const parts = [];
    if (location.address) parts.push(location.address);
    else {
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
    }
    return parts.join(", ");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search locations..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-transparent transition-all bg-white"
          aria-label="Search locations"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Toggle location dropdown"
        >
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* Show All Option */}
          {locations.length > 1 && (
            <button
              type="button"
              onClick={() => {
                onShowAll();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
            >
              <MapPin className="h-4 w-4 text-glamlink-teal" />
              <span className="font-medium text-glamlink-teal">
                Show All {locations.length} Locations
              </span>
            </button>
          )}

          {/* Filtered Locations List */}
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto"
            role="listbox"
            aria-label="Locations"
          >
            {filteredLocations.length === 0 ? (
              <li className="px-3 py-3 text-sm text-gray-500 text-center">
                No locations found
              </li>
            ) : (
              filteredLocations.map((location, index) => {
                const isSelected = selectedLocation?.id === location.id;
                const isFocused = focusedIndex === index;

                return (
                  <li key={location.id || index} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleLocationClick(location)}
                      className={`w-full px-3 py-2.5 text-left transition-colors ${
                        isFocused
                          ? "bg-glamlink-teal/10"
                          : isSelected
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {/* Primary Badge */}
                        {location.isPrimary ? (
                          <div className="flex-shrink-0 mt-0.5">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 mt-0.5">
                            <MapPin className="h-4 w-4 text-gray-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Location Name */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium truncate ${
                                location.isPrimary
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {getLocationDisplayName(location)}
                            </span>
                            {location.isPrimary && (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Primary
                              </span>
                            )}
                          </div>

                          {/* Address */}
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {getLocationAddress(location)}
                          </p>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <svg
                              className="h-4 w-4 text-glamlink-teal"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
