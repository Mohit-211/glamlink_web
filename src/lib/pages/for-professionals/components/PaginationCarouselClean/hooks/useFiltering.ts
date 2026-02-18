import { useState, useMemo, useEffect } from "react";
import { Professional } from "../../../types/professional";
import { SortBy, SortDirection } from "../types";

export interface UseFilteringReturn {
  state: {
    searchQuery: string;
    sortBy: SortBy;
    sortDirection: SortDirection;
    selectedSpecialties: string[];
    selectedLocations: string[];
    currentPage: number;
    pageInput: string;
  };
  actions: {
    setSearchQuery: (query: string) => void;
    setSortBy: (sortBy: SortBy) => void;
    setSortDirection: (direction: SortDirection) => void;
    toggleSpecialty: (specialty: string) => void;
    toggleLocation: (location: string) => void;
    setCurrentPage: (page: number) => void;
    setPageInput: (input: string) => void;
    handlePageInputChange: (value: string) => void;
    handlePageInputBlur: () => void;
  };
  results: {
    uniqueSpecialties: string[];
    uniqueLocations: string[];
    filteredAndSortedPros: Professional[];
    currentPagePros: Professional[];
    totalPages: number;
  };
}

/**
 * Custom hook for filtering, sorting, and paginating professional data
 *
 * @param allPros - All professional data from API
 * @param cardsPerPage - Number of cards to show per page
 * @param enablePagination - Whether pagination is enabled
 * @returns Object with filter state, actions, and computed results
 */
export function useFiltering(
  allPros: Professional[],
  cardsPerPage: number,
  enablePagination: boolean
): UseFilteringReturn {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("none");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  // Get unique values for filters
  const uniqueSpecialties = useMemo(
    () => [...new Set(allPros.map((pro) => pro.specialty))].sort(),
    [allPros]
  );

  const uniqueLocations = useMemo(
    () => [...new Set(allPros.map((pro) => pro.location))].sort(),
    [allPros]
  );

  // Filter and sort pros
  const filteredAndSortedPros = useMemo(() => {
    console.log("=% FILTER START: Starting filtering with", allPros.length, "professionals");
    console.log("=% FILTER INPUT: allPros:", allPros);
    console.log("=% FILTER STATE: searchQuery:", searchQuery);
    console.log("=% FILTER STATE: selectedSpecialties:", selectedSpecialties);
    console.log("=% FILTER STATE: selectedLocations:", selectedLocations);

    let filtered = allPros;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const beforeFilter = filtered.length;
      filtered = filtered.filter((pro) =>
        pro.name.toLowerCase().includes(query) ||
        pro.specialty.toLowerCase().includes(query) ||
        pro.location.toLowerCase().includes(query) ||
        (pro.instagram && pro.instagram.toLowerCase().includes(query))
      );
      console.log("=% FILTER SEARCH: Search query '" + query + "' filtered from", beforeFilter, "to", filtered.length);
    }

    // Specialty filter
    if (selectedSpecialties.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((pro) => selectedSpecialties.includes(pro.specialty));
      console.log("=% FILTER SPECIALTY: Specialty filter applied:", selectedSpecialties, "- filtered from", beforeFilter, "to", filtered.length);
    }

    // Location filter
    if (selectedLocations.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((pro) => selectedLocations.includes(pro.location));
      console.log("=% FILTER LOCATION: Location filter applied:", selectedLocations, "- filtered from", beforeFilter, "to", filtered.length);
    }

    // Sort
    if (sortBy === "none") {
      // Return filtered array sorted by order first, then name
      const orderSorted = [...filtered].sort((a, b) => {
        // Handle null/undefined order values - they should come last
        const aOrder = a.order === null || a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
        const bOrder = b.order === null || b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;

        // Primary sort by order
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        // Secondary sort by name
        return a.name.localeCompare(b.name);
      });

      console.log("=% SORT NONE: Applied order-based sorting, first 5:", orderSorted.slice(0, 5).map(p => `${p.name}(${p.order})`));
      return orderSorted;
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      // For all sorts, maintain order precedence within the same sort criteria
      // Get order-based comparison as fallback
      const aOrder = a.order === null || a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
      const bOrder = b.order === null || b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
      const orderComparison = aOrder - bOrder;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "location") {
        comparison = a.location.localeCompare(b.location);
      } else if (sortBy === "rating") {
        comparison = (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "experience") {
        comparison = b.yearsExperience - a.yearsExperience;
      }

      // Use sort comparison first, then order as tiebreaker, then name as final tiebreaker
      if (comparison === 0) {
        // Primary criteria equal, use order as tiebreaker
        if (orderComparison === 0) {
          // Order also equal, use name as final tiebreaker
          return a.name.localeCompare(b.name);
        }
        return orderComparison;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    console.log("=% FILTER RESULT: Final filtered count:", filtered.length);
    console.log("=% FILTER FINAL: Final filtered professionals:", filtered);
    return sorted;
  }, [allPros, searchQuery, sortBy, sortDirection, selectedSpecialties, selectedLocations]);

  const totalPages = enablePagination ? Math.ceil(filteredAndSortedPros.length / cardsPerPage) : 1;

  // Get current page pros
  const currentPagePros = useMemo(() => {
    console.log("=% PAGINATION START: Total filtered:", filteredAndSortedPros.length, "Total pages:", totalPages, "Current page:", currentPage);

    if (enablePagination) {
      // Pagination mode: show cardsPerPage per page
      const start = (currentPage - 1) * cardsPerPage;
      const end = start + cardsPerPage;
      const pagePros = filteredAndSortedPros.slice(start, end);
      console.log("=% PAGINATION SLICE: Pagination mode - start:", start, "end:", end, "showing:", pagePros.length, "professionals");
      console.log("=% PAGINATION SLICE: Current page professionals:", pagePros);
      return pagePros;
    } else {
      // No pagination: show up to 12 profiles in continuous carousel
      const pagePros = filteredAndSortedPros.slice(0, 12);
      console.log("=% PAGINATION SLICE: No pagination mode - showing first", pagePros.length, "professionals");
      console.log("=% PAGINATION SLICE: Current page professionals:", pagePros);
      return pagePros;
    }
  }, [filteredAndSortedPros, currentPage, cardsPerPage, enablePagination, totalPages]);

  // Helper functions for filter toggles
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handlePageInputBlur = () => {
    const pageNum = parseInt(pageInput);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setPageInput(currentPage.toString());
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setPageInput("1");
  }, [searchQuery, sortBy, sortDirection, selectedSpecialties, selectedLocations]);

  return {
    state: {
      searchQuery,
      sortBy,
      sortDirection,
      selectedSpecialties,
      selectedLocations,
      currentPage,
      pageInput,
    },
    actions: {
      setSearchQuery,
      setSortBy,
      setSortDirection,
      toggleSpecialty,
      toggleLocation,
      setCurrentPage,
      setPageInput,
      handlePageInputChange,
      handlePageInputBlur,
    },
    results: {
      uniqueSpecialties,
      uniqueLocations,
      filteredAndSortedPros,
      currentPagePros,
      totalPages,
    },
  };
}
