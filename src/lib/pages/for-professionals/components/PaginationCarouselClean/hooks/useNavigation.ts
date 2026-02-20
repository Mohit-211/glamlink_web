import { useState, useCallback } from "react";

export interface UseNavigationReturn {
  desktop: {
    currentIndex: number;
    visibleGroupIndex: number;
    isTransitioning: boolean;
  };
  tablet: {
    tabletIndex: number;
    tabletGroupIndex: number;
    isTabletTransitioning: boolean;
  };
  drag: {
    isDragging: boolean;
    dragStartX: number;
    dragCurrentX: number;
  };
  actions: {
    // Desktop
    handlePrevious: () => void;
    handleNext: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;

    // Tablet
    handleTabletPrevious: () => void;
    handleTabletNext: () => void;
    canTabletGoPrevious: boolean;
    canTabletGoNext: boolean;

    // Drag (optional)
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleMouseLeave: () => void;

    // Lifecycle
    resetNavigation: () => void;
  };
}

/**
 * Custom hook for managing carousel navigation across desktop, tablet, and mobile breakpoints
 * Handles group-based shifting for smooth carousel experience
 *
 * @param totalItems - Total number of items in the carousel
 * @param enableDrag - Whether drag navigation is enabled
 * @returns Object with navigation state and action handlers
 */
export function useNavigation(
  totalItems: number,
  enableDrag: boolean
): UseNavigationReturn {
  // Desktop carousel state (xl+) - shows 3 cards at a time
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleGroupIndex, setVisibleGroupIndex] = useState(0); // 0 for cards 0-2, 1 for cards 3-5
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Tablet carousel state (md-lg) - shows 2 cards at a time
  const [tabletIndex, setTabletIndex] = useState(0);
  const [tabletGroupIndex, setTabletGroupIndex] = useState(0); // 0: cards 0-1, 1: cards 2-3, 2: cards 4-5
  const [isTabletTransitioning, setIsTabletTransitioning] = useState(false);

  // Drag state (optional feature)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);

  // Navigation state helpers
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - 1;
  const canTabletGoPrevious = tabletIndex > 0;
  const canTabletGoNext = tabletIndex < totalItems - 1;

  // Desktop carousel navigation handlers (xl+)
  const handlePrevious = useCallback(() => {
    if (isTransitioning || currentIndex <= 0) return;

    setIsTransitioning(true);

    // Check if we need to shift the carousel
    // Shift happens when moving from first card of a group (indices 3, 6, 9)
    if (currentIndex % 3 === 0 && currentIndex > 0) {
      // Calculate which group to show
      const newGroupIndex = Math.floor((currentIndex - 1) / 3);
      setVisibleGroupIndex(newGroupIndex);
      setCurrentIndex(currentIndex - 1);
    } else {
      // Just move to the previous card without shifting
      setCurrentIndex((prev) => prev - 1);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, currentIndex]);

  const handleNext = useCallback(() => {
    if (isTransitioning || currentIndex >= totalItems - 1) return;

    setIsTransitioning(true);

    // Check if we need to shift the carousel
    // Shift happens when moving from last card of a group (indices 2, 5, 8, 11)
    if ((currentIndex + 1) % 3 === 0 && currentIndex < totalItems - 1) {
      // Calculate which group to show
      const newGroupIndex = Math.floor((currentIndex + 1) / 3);
      setVisibleGroupIndex(newGroupIndex);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Just move to the next card without shifting
      setCurrentIndex((prev) => prev + 1);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, currentIndex, totalItems]);

  // Tablet carousel navigation handlers (md-lg)
  const handleTabletPrevious = useCallback(() => {
    if (isTabletTransitioning || tabletIndex <= 0) return;

    setIsTabletTransitioning(true);

    // Check if we need to shift the carousel
    // Shift happens when moving from first card of a 2-card group (indices 2, 4, 6, 8, 10)
    if (tabletIndex % 2 === 0 && tabletIndex > 0) {
      // Calculate which group to show
      const newGroupIndex = Math.floor((tabletIndex - 1) / 2);
      setTabletGroupIndex(newGroupIndex);
      setTabletIndex(tabletIndex - 1);
    } else {
      // Just move to the previous card without shifting
      setTabletIndex((prev) => prev - 1);
    }

    setTimeout(() => {
      setIsTabletTransitioning(false);
    }, 500);
  }, [isTabletTransitioning, tabletIndex]);

  const handleTabletNext = useCallback(() => {
    if (isTabletTransitioning || tabletIndex >= totalItems - 1) return;

    setIsTabletTransitioning(true);

    // Check if we need to shift the carousel
    // Shift happens when moving from last card of a 2-card group (indices 1, 3, 5, 7, 9, 11)
    if ((tabletIndex + 1) % 2 === 0 && tabletIndex < totalItems - 1) {
      // Calculate which group to show
      const newGroupIndex = Math.floor((tabletIndex + 1) / 2);
      setTabletGroupIndex(newGroupIndex);
      setTabletIndex(tabletIndex + 1);
    } else {
      // Just move to the next card without shifting
      setTabletIndex((prev) => prev + 1);
    }

    setTimeout(() => {
      setIsTabletTransitioning(false);
    }, 500);
  }, [isTabletTransitioning, tabletIndex, totalItems]);

  // Drag handlers (optional feature)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
  }, [enableDrag]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableDrag || !isDragging) return;

    const currentX = e.clientX;
    setDragCurrentX(currentX);

    const dragDistance = currentX - dragStartX;
    const threshold = 172;

    if (dragDistance > threshold && canGoPrevious) {
      handlePrevious();
      setDragStartX(currentX);
    } else if (dragDistance < -threshold && canGoNext) {
      handleNext();
      setDragStartX(currentX);
    }
  }, [enableDrag, isDragging, dragStartX, canGoPrevious, canGoNext, handlePrevious, handleNext]);

  const handleMouseUp = useCallback(() => {
    if (!enableDrag || !isDragging) return;
    setIsDragging(false);
  }, [enableDrag, isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (!enableDrag) return;
    setIsDragging(false);
  }, [enableDrag]);

  // Reset all navigation indices to 0
  const resetNavigation = useCallback(() => {
    setCurrentIndex(0);
    setVisibleGroupIndex(0);
    setTabletIndex(0);
    setTabletGroupIndex(0);
  }, []);

  return {
    desktop: {
      currentIndex,
      visibleGroupIndex,
      isTransitioning,
    },
    tablet: {
      tabletIndex,
      tabletGroupIndex,
      isTabletTransitioning,
    },
    drag: {
      isDragging,
      dragStartX,
      dragCurrentX,
    },
    actions: {
      // Desktop
      handlePrevious,
      handleNext,
      canGoPrevious,
      canGoNext,

      // Tablet
      handleTabletPrevious,
      handleTabletNext,
      canTabletGoPrevious,
      canTabletGoNext,

      // Drag
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,

      // Lifecycle
      resetNavigation,
    },
  };
}
