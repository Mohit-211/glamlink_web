'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isProDiscoveryMapSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import {
  PROFESSIONAL_CATEGORIES,
  professionalMatchesCategory,
} from '@/lib/config/professionalCategories';
import { calculateDistance } from '@/lib/features/google_maps';
import type { Coordinate } from '@/lib/features/google_maps';
import StyledDigitalBusinessCard from '@/lib/features/digital-cards/StyledDigitalBusinessCard';
import CategoryTabs from './CategoryTabs';
import ProMapDisplay from './ProMapDisplay';
import ProSearchDropdown from './ProSearchDropdown';

// 20 miles in kilometers
const SEARCH_RADIUS_KM = 32.19;

// Default center: Las Vegas
const LAS_VEGAS_CENTER: Coordinate = { lat: 36.1699, lng: -115.1398 };

interface ProDiscoveryMapSectionProps {
  section: HomeSection;
}

export function ProDiscoveryMapSection({ section }: ProDiscoveryMapSectionProps) {
  if (!isProDiscoveryMapSection(section)) return null;

  const { content } = section;

  // State
  const [selectedCategory, setSelectedCategory] = useState(content.defaultCategory || 'all');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state - separate "typing" from "applied"
  // searchQuery: what user is currently typing (for dropdown)
  // appliedSearchQuery: the search that was applied (for map filtering)
  // appliedSearchCenter: the location center that was applied (for filtering by radius)
  // mapViewCenter: where the map is centered (for initial view) - separate from filter
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedSearchCenter, setAppliedSearchCenter] = useState<Coordinate | null>(null); // null = show all pros
  const [mapViewCenter, setMapViewCenter] = useState<Coordinate | null>(LAS_VEGAS_CENTER); // default view = Las Vegas

  // Fetch professionals with locationData
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/professionals', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch professionals');
        }

        const data = await response.json();

        // Filter to only professionals with location data AND digital card enabled
        // Exclude professionals where hasDigitalCard is explicitly false
        const prosWithLocation = (data.data || []).filter(
          (pro: Professional) =>
            pro.hasDigitalCard !== false && (
              pro.locationData?.lat && pro.locationData?.lng ||
              (pro.locations && pro.locations.length > 0)
            )
        );

        setProfessionals(prosWithLocation);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('Failed to load professionals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Helper to get professional's coordinates
  const getProCoordinates = useCallback((pro: Professional): Coordinate | null => {
    if (pro.locationData?.lat && pro.locationData?.lng) {
      return { lat: pro.locationData.lat, lng: pro.locationData.lng };
    }
    if (pro.locations && pro.locations.length > 0) {
      const primary = pro.locations.find((loc) => loc.isPrimary) || pro.locations[0];
      if (primary.lat && primary.lng) {
        return { lat: primary.lat, lng: primary.lng };
      }
    }
    return null;
  }, []);

  // Handle search apply (when user presses Enter or clicks a result)
  // This is called by ProSearchDropdown
  const handleSearchApply = useCallback((query: string, center: Coordinate | null) => {
    setAppliedSearchQuery(query);
    setAppliedSearchCenter(center); // This filters professionals by radius
    setMapViewCenter(center); // This centers the map view
  }, []);

  // Handle search center change from dropdown (applies immediately)
  const handleSearchCenterChange = useCallback((center: Coordinate | null) => {
    // When a location is selected, apply it for filtering and map view
    setAppliedSearchCenter(center);
    setMapViewCenter(center);
  }, []);

  // Handle professional select from dropdown
  const handleProfessionalSelect = useCallback((pro: Professional) => {
    setSelectedPro(pro);
    // When selecting a professional, center map on their location (but don't filter)
    const coords = getProCoordinates(pro);
    if (coords) {
      setMapViewCenter(coords); // Center view on pro
      // Don't set appliedSearchCenter - we want to keep showing all pros
    }
  }, [getProCoordinates]);

  // Filter by category and APPLIED search (not typing search)
  // Map only updates based on applied values
  const filteredPros = useMemo(() => {
    let result = professionals;

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((pro) => professionalMatchesCategory(pro, selectedCategory));
    }

    // Location-based search (when we have an applied search center)
    if (appliedSearchCenter) {
      result = result.filter((pro) => {
        const proCoords = getProCoordinates(pro);
        if (!proCoords) return false;
        const distance = calculateDistance(appliedSearchCenter, proCoords);
        return distance <= SEARCH_RADIUS_KM;
      });
    }
    // Text search fallback (when no applied search center but have applied query)
    // Comprehensive search: name, specialty, title, location, phone, email,
    // importantInfo, and all business addresses
    else if (appliedSearchQuery.trim()) {
      const query = appliedSearchQuery.toLowerCase().trim();
      result = result.filter((pro) => {
        // Basic fields
        if (pro.name?.toLowerCase().includes(query)) return true;
        if (pro.specialty?.toLowerCase().includes(query)) return true;
        if (pro.title?.toLowerCase().includes(query)) return true;
        if (pro.location?.toLowerCase().includes(query)) return true;

        // Contact info
        if (pro.phone?.toLowerCase().includes(query)) return true;
        if (pro.email?.toLowerCase().includes(query)) return true;

        // Specialties array
        if (pro.specialties?.some((s) => s.toLowerCase().includes(query))) return true;

        // Important info array
        if (pro.importantInfo?.some((info) => info.toLowerCase().includes(query))) return true;

        // Single location data (legacy)
        if (pro.locationData?.address?.toLowerCase().includes(query)) return true;
        if (pro.locationData?.city?.toLowerCase().includes(query)) return true;
        if (pro.locationData?.state?.toLowerCase().includes(query)) return true;
        if (pro.locationData?.zipCode?.toLowerCase().includes(query)) return true;
        if (pro.locationData?.businessName?.toLowerCase().includes(query)) return true;

        // Multiple locations array
        if (pro.locations?.some((loc) => {
          if (loc.address?.toLowerCase().includes(query)) return true;
          if (loc.city?.toLowerCase().includes(query)) return true;
          if (loc.state?.toLowerCase().includes(query)) return true;
          if (loc.zipCode?.toLowerCase().includes(query)) return true;
          if (loc.businessName?.toLowerCase().includes(query)) return true;
          if (loc.label?.toLowerCase().includes(query)) return true;
          return false;
        })) return true;

        return false;
      });
    }

    return result;
  }, [professionals, selectedCategory, appliedSearchQuery, appliedSearchCenter, getProCoordinates]);

  // Handle marker click - memoized to prevent map reinitializing
  const handleMarkerClick = useCallback((pro: Professional) => {
    setSelectedPro(pro);
  }, []);

  // Handle close card panel
  const handleCloseCard = useCallback(() => {
    setSelectedPro(null);
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      {/* Title */}
      <div className="container mx-auto px-4 mb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="text-gray-600 text-lg">{content.subtitle}</p>
        )}
      </div>

      {/* Category Tabs - Hidden for now, using search bar only */}
      {/* {content.showCategories && (
        <div className="container mx-auto px-4 mb-4">
          <CategoryTabs
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      )} */}

      {/* Search Box with Autocomplete Dropdown */}
      {content.showSearch && (
        <div className="container mx-auto px-4 mb-6">
          <div className="max-w-md mx-auto">
            <ProSearchDropdown
              professionals={professionals}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchCenterChange={handleSearchCenterChange}
              onProfessionalSelect={handleProfessionalSelect}
              onSearchApply={handleSearchApply}
            />
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="container mx-auto px-4 mb-4">
        <p className="text-sm text-gray-500 text-center">
          Showing {filteredPros.length} professional{filteredPros.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && (
            <span>
              {' '}
              in{' '}
              <span className="font-medium text-glamlink-teal">
                {PROFESSIONAL_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Split Layout: Map | Card Panel */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div
            className="flex items-center justify-center bg-white rounded-lg border border-gray-200"
            style={{ height: content.mapHeight }}
          >
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading professionals...</p>
            </div>
          </div>
        ) : error ? (
          <div
            className="flex items-center justify-center bg-white rounded-lg border border-gray-200"
            style={{ height: content.mapHeight }}
          >
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-glamlink-teal hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Layout - Stacked full width */}
            <div className="lg:hidden flex flex-col gap-6">
              {/* Map - Full width, fixed height on mobile */}
              <div className="w-full h-[400px]">
                <ProMapDisplay
                  professionals={filteredPros}
                  onMarkerClick={handleMarkerClick}
                  selectedPro={selectedPro}
                  searchCenter={mapViewCenter}
                />
              </div>

              {/* Card Panel - Full width, auto height on mobile */}
              <div className="w-full bg-white rounded-lg border border-gray-200">
                {selectedPro ? (
                  <StyledDigitalBusinessCard
                    professional={selectedPro}
                    hideBorder
                    onClose={handleCloseCard}
                    forceMobileLayout
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        Select a Professional
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Tap a map marker to view their card
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout - Side by side */}
            <div
              className="hidden lg:flex lg:flex-row gap-6"
              style={{ height: content.mapHeight }}
            >
              {/* Map (60% on desktop) */}
              <div className="w-3/5 h-full">
                <ProMapDisplay
                  professionals={filteredPros}
                  onMarkerClick={handleMarkerClick}
                  selectedPro={selectedPro}
                  searchCenter={mapViewCenter}
                />
              </div>

              {/* Card Panel (40% on desktop) */}
              <div className="w-2/5 h-full overflow-y-auto bg-white rounded-lg border border-gray-200">
                {selectedPro ? (
                  <div className="h-full overflow-y-auto">
                    <StyledDigitalBusinessCard
                      professional={selectedPro}
                      hideBorder
                      onClose={handleCloseCard}
                      forceMobileLayout
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select a Professional
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Click on a map marker to view their digital card
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProDiscoveryMapSection;
