"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationCarouselCleanProps } from "./types";
import { Professional } from "../../types/professional";
import SearchBar from "./components/SearchBar";
import SortDropdown from "./components/SortDropdown";
import FilterDropdown from "./components/FilterDropdown";
import PaginationControls from "./components/PaginationControls";
import StyledDigitalBusinessCardModal from "@/lib/features/digital-cards/StyledDigitalBusinessCardModal";
import ProfessionalCard from "./components/ProfessionalCard";
import { useAPI } from "./hooks/useAPI";
import { useFiltering } from "./hooks/useFiltering";
import { useNavigation } from "./hooks/useNavigation";

// Feature flags
const ENABLE_DRAG = false; // Set to true to enable drag navigation
const ENABLE_PAGINATION = true; // Set to true to show max 12 profiles with pagination

export default function PaginationCarouselClean({ cardsPerPage = 6, title, subtitle }: PaginationCarouselCleanProps) {
  // Custom hooks (data → filtering → navigation pipeline)
  const { allPros, isLoading } = useAPI(ENABLE_PAGINATION);

  const { state: filterState, actions: filterActions, results: filterResults } =
    useFiltering(allPros, cardsPerPage, ENABLE_PAGINATION);

  const { desktop, tablet, drag, actions: navActions } =
    useNavigation(filterResults.currentPagePros.length, ENABLE_DRAG);

  // Modal state (stays in main component)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);

  // Dropdown state - only one dropdown can be open at a time
  const [openDropdown, setOpenDropdown] = useState<"sort" | "filter" | null>(null);

  const handleCardClick = (pro: Professional) => {
    //console.log("Card clicked:", pro);
    if (!pro.hasDigitalCard) return; // Only open modal if hasDigitalCard is true
    setSelectedPro(pro);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPro(null);
  };

  // Reset navigation when filters change
  useEffect(() => {
    navActions.resetNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterState.searchQuery,
    filterState.sortBy,
    filterState.sortDirection,
    filterState.selectedSpecialties,
    filterState.selectedLocations,
    // Note: navActions is intentionally excluded - we only want to reset when filter VALUES change,
    // not when the actions object reference changes (which happens every render)
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative py-12 bg-white overflow-x-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glamlink-teal mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading professionals...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no professionals
  if (allPros.length === 0) {
    return (
      <section className="relative py-12 bg-white overflow-x-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600">
                {filterState.searchQuery || filterState.selectedSpecialties.length > 0 || filterState.selectedLocations.length > 0
                  ? "Try adjusting your search or filters to find professionals."
                  : "No professionals are available at the moment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 bg-white overflow-x-hidden">
      <div className="container-custom relative z-10">
        {/* Header Section */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="text-glamlink-teal">{title}</span>
              </h2>
            )}
            {subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-700">{subtitle}</h3>
            )}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
          <SearchBar searchQuery={filterState.searchQuery} setSearchQuery={filterActions.setSearchQuery} />
          <SortDropdown
            sortBy={filterState.sortBy}
            sortDirection={filterState.sortDirection}
            setSortBy={filterActions.setSortBy}
            setSortDirection={filterActions.setSortDirection}
            isOpen={openDropdown === "sort"}
            setIsOpen={(open) => setOpenDropdown(open ? "sort" : null)}
          />
          <FilterDropdown
            selectedSpecialties={filterState.selectedSpecialties}
            selectedLocations={filterState.selectedLocations}
            uniqueSpecialties={filterResults.uniqueSpecialties}
            uniqueLocations={filterResults.uniqueLocations}
            toggleSpecialty={filterActions.toggleSpecialty}
            toggleLocation={filterActions.toggleLocation}
            isOpen={openDropdown === "filter"}
            setIsOpen={(open) => setOpenDropdown(open ? "filter" : null)}
          />
        </div>

        {/* Results count */}
        <div className="text-center">
          <p className="text-gray-600">
            Showing {filterResults.currentPagePros.length} of {filterResults.filteredAndSortedPros.length} professionals
            {filterState.searchQuery && ` matching "${filterState.searchQuery}"`}
          </p>
        </div>

        {/* Desktop Carousel Container - xl and above */}
        <div
          className="hidden xl:block relative max-w-6xl mx-auto"
          {...(ENABLE_DRAG
            ? {
                onMouseDown: navActions.handleMouseDown,
                onMouseMove: navActions.handleMouseMove,
                onMouseUp: navActions.handleMouseUp,
                onMouseLeave: navActions.handleMouseLeave,
                style: {
                  cursor: drag.isDragging ? "grabbing" : "grab",
                  userSelect: drag.isDragging ? "none" : "auto",
                },
              }
            : {})}
        >
          <div className="mx-auto px-8 pt-12 pb-2 m-2 xl:max-w-[1080px]">
            {/* 3-Card Viewport - show exactly 3 cards */}
            <div className="relative overflow-hidden -mt-4 p-1">
              <div
                className={`flex gap-6 pt-4 ${ENABLE_DRAG && drag.isDragging ? "" : "transition-transform duration-500 ease-in-out"}`}
                style={{
                  transform:
                    desktop.visibleGroupIndex === 0
                      ? "translateX(0)"
                      : typeof window !== "undefined" && window.innerWidth >= 1280
                      ? `translateX(-${desktop.visibleGroupIndex * 1032}px)` // xl: fixed cards (3 * 320px + 2 * 24px)
                      : `translateX(calc(-100% - 24px))`, // md-lg: responsive cards
                }}
              >
                {/* Current page professional cards */}
                {filterResults.currentPagePros.map((pro, index) => {
                  const isCenterCard = index === desktop.currentIndex;

                  return (
                    <div
                      key={`carousel-${pro.id}`}
                      className={`w-full md:w-[calc((100%-48px)/3)] xl:w-80 flex-shrink-0 transition-all duration-500 ease-in-out ${
                        isCenterCard ? "transform -translate-y-4" : ""
                      }`}
                    >
                      <div className={`${isCenterCard ? "ring-2 ring-glamlink-teal rounded-2xl shadow-2xl" : ""}`}>
                        <ProfessionalCard
                          professional={pro}
                          onClick={() => handleCardClick(pro)}
                          featured={pro.featured}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Add empty cards to ensure we always have at least 6 slots for proper shifting */}
                {filterResults.currentPagePros.length < 6 && Array.from({ length: 6 - filterResults.currentPagePros.length }).map((_, i) => <div key={`empty-${i}`} className="w-full md:w-[calc((100%-48px)/3)] xl:w-80 flex-shrink-0"></div>)}
              </div>
            </div>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={navActions.handlePrevious}
              disabled={!navActions.canGoPrevious}
              className={`${navActions.canGoPrevious ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-110 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"} p-3 rounded-full transition-all duration-300`}
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={navActions.handleNext}
              disabled={!navActions.canGoNext}
              className={`${navActions.canGoNext ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-110 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"} p-3 rounded-full transition-all duration-300`}
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Page Navigation Controls */}
          {ENABLE_PAGINATION && filterResults.totalPages > 1 && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <PaginationControls
                currentPage={filterState.currentPage}
                totalPages={filterResults.totalPages}
                pageInput={filterState.pageInput}
                setCurrentPage={(page) => {
                  filterActions.setCurrentPage(page);
                  navActions.resetNavigation();
                }}
                setPageInput={filterActions.setPageInput}
                handlePageInputChange={filterActions.handlePageInputChange}
                handlePageInputBlur={filterActions.handlePageInputBlur}
              />
            </div>
          )}
        </div>

        {/* Tablet Carousel - md to lg */}
        <div className="hidden md:block xl:hidden relative max-w-4xl mx-auto">
          <div className="mx-auto px-8 pt-12 pb-2">
            {/* 2-Card Viewport - show exactly 2 cards */}
            <div className="relative overflow-hidden -mt-4 p-1">
              <div
                className="flex gap-6 pt-4 transition-transform duration-500 ease-in-out"
                style={{
                  transform: tablet.tabletGroupIndex === 0 ? "translateX(0)" : `translateX(calc(-${tablet.tabletGroupIndex * 100}% - ${tablet.tabletGroupIndex * 24}px))`,
                }}
              >
                {/* Current page professional cards */}
                {filterResults.currentPagePros.map((pro, index) => {
                  const isActiveCard = index === tablet.tabletIndex;

                  return (
                    <div
                      key={`tablet-${pro.id}`}
                      className={`w-[calc((100%-24px)/2)] flex-shrink-0 transition-all duration-500 ease-in-out ${
                        isActiveCard ? "transform -translate-y-4" : ""
                      }`}
                    >
                      <div className={`${isActiveCard ? "ring-2 ring-glamlink-teal rounded-2xl shadow-2xl" : ""}`}>
                        <ProfessionalCard
                          professional={pro}
                          onClick={() => handleCardClick(pro)}
                          featured={pro.featured}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Add empty cards to ensure we always have at least 6 slots for proper shifting */}
                {filterResults.currentPagePros.length < 6 && Array.from({ length: 6 - filterResults.currentPagePros.length }).map((_, i) => <div key={`tablet-empty-${i}`} className="w-[calc((100%-24px)/2)] flex-shrink-0"></div>)}
              </div>
            </div>
          </div>

          {/* Tablet Carousel Navigation Buttons */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={navActions.handleTabletPrevious}
              disabled={!navActions.canTabletGoPrevious}
              className={`${navActions.canTabletGoPrevious ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-110 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"} p-3 rounded-full transition-all duration-300`}
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={navActions.handleTabletNext}
              disabled={!navActions.canTabletGoNext}
              className={`${navActions.canTabletGoNext ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-110 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"} p-3 rounded-full transition-all duration-300`}
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Tablet Page Navigation Controls */}
          {ENABLE_PAGINATION && filterResults.totalPages > 1 && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <PaginationControls
                currentPage={filterState.currentPage}
                totalPages={filterResults.totalPages}
                pageInput={filterState.pageInput}
                setCurrentPage={(page) => {
                  filterActions.setCurrentPage(page);
                  navActions.resetNavigation();
                }}
                setPageInput={filterActions.setPageInput}
                handlePageInputChange={filterActions.handlePageInputChange}
                handlePageInputBlur={filterActions.handlePageInputBlur}
              />
            </div>
          )}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden p-1">
            <div
              className="flex transition-transform duration-500 ease-in-out pt-4"
              style={{
                transform: `translateX(-${desktop.currentIndex * 100}%)`,
              }}
            >
              {filterResults.currentPagePros.map((pro, index) => {
                const isActiveCard = index === desktop.currentIndex;

                return (
                  <div
                    key={`mobile-${pro.id}`}
                    className={`w-full flex-shrink-0 px-4 transition-all duration-500 ease-in-out ${
                      isActiveCard ? "transform -translate-y-4" : ""
                    }`}
                  >
                    <div className={`${isActiveCard ? "ring-2 ring-glamlink-teal rounded-2xl shadow-2xl" : ""}`}>
                      <ProfessionalCard
                        professional={pro}
                        onClick={() => handleCardClick(pro)}
                        featured={pro.featured}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation - Centered Below */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={navActions.handlePrevious}
              disabled={!navActions.canGoPrevious}
              className={`${navActions.canGoPrevious ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"} p-2 rounded-full transition-all duration-300`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={navActions.handleNext} disabled={!navActions.canGoNext} className={`${navActions.canGoNext ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"} p-2 rounded-full transition-all duration-300`} aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Page Navigation Controls */}
          {ENABLE_PAGINATION && filterResults.totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <PaginationControls
                currentPage={filterState.currentPage}
                totalPages={filterResults.totalPages}
                pageInput={filterState.pageInput}
                setCurrentPage={(page) => {
                  filterActions.setCurrentPage(page);
                  navActions.resetNavigation();
                }}
                setPageInput={filterActions.setPageInput}
                handlePageInputChange={filterActions.handlePageInputChange}
                handlePageInputBlur={filterActions.handlePageInputBlur}
              />
            </div>
          )}
        </div>

        {/* Styled Digital Business Card Modal */}
        {selectedPro && (
          <StyledDigitalBusinessCardModal
            professional={selectedPro}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </section>
  );
}
