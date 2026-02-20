'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface UseVirtualizedListOptions {
  /** Total number of items in the list */
  itemCount: number;
  /** Number of items to render above/below the visible area */
  overscan?: number;
  /** Minimum item height estimate for initial render */
  estimatedItemHeight?: number;
  /** Enable virtualization only when item count exceeds this threshold */
  threshold?: number;
}

interface UseVirtualizedListReturn {
  /** Container ref to attach to the scrollable element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Range of visible items (start, end indices) */
  visibleRange: { start: number; end: number };
  /** Whether virtualization is active */
  isVirtualized: boolean;
  /** Callback to scroll to a specific index */
  scrollToIndex: (index: number) => void;
}

/**
 * Hook for virtualizing large lists to improve performance.
 *
 * Uses scroll position to track which items should be rendered,
 * with overscan to pre-render items just outside the viewport.
 *
 * @example
 * ```tsx
 * function ItemList({ items }) {
 *   const { containerRef, visibleRange, isVirtualized } = useVirtualizedList({
 *     itemCount: items.length,
 *     overscan: 5,
 *     threshold: 50,
 *   });
 *
 *   return (
 *     <div ref={containerRef} style={{ height: '500px', overflow: 'auto' }}>
 *       {items.map((item, index) => {
 *         if (isVirtualized && (index < visibleRange.start || index > visibleRange.end)) {
 *           return <div key={item.id} style={{ height: '60px' }} />; // Placeholder
 *         }
 *         return <ItemComponent key={item.id} item={item} />;
 *       })}
 *     </div>
 *   );
 * }
 * ```
 */
export function useVirtualizedList({
  itemCount,
  overscan = 5,
  estimatedItemHeight = 80,
  threshold = 100,
}: UseVirtualizedListOptions): UseVirtualizedListReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: itemCount });

  // Only virtualize if we have more items than the threshold
  const isVirtualized = itemCount > threshold;

  // Update visible range based on scroll position
  const updateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isVirtualized) {
      setVisibleRange({ start: 0, end: itemCount });
      return;
    }

    const { scrollTop, clientHeight } = container;

    // Calculate which items should be visible
    const visibleStart = Math.floor(scrollTop / estimatedItemHeight);
    const visibleEnd = Math.ceil((scrollTop + clientHeight) / estimatedItemHeight);

    // Apply overscan
    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(itemCount - 1, visibleEnd + overscan);

    setVisibleRange({ start, end });
  }, [isVirtualized, itemCount, estimatedItemHeight, overscan]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVirtualized) return;

    // Initial calculation
    updateVisibleRange();

    // Use passive scroll listener for better performance
    const handleScroll = () => {
      requestAnimationFrame(updateVisibleRange);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isVirtualized, updateVisibleRange]);

  // Update range when item count changes
  useEffect(() => {
    updateVisibleRange();
  }, [itemCount, updateVisibleRange]);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const targetScrollTop = index * estimatedItemHeight;
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });
  }, [estimatedItemHeight]);

  return {
    containerRef,
    visibleRange,
    isVirtualized,
    scrollToIndex,
  };
}

/**
 * Get placeholder style for virtualized list items.
 * Use this to create invisible placeholders for items outside the visible range.
 *
 * @param height - Height of the placeholder in pixels
 * @returns CSS properties for the placeholder
 *
 * @example
 * ```tsx
 * <div style={getPlaceholderStyle(80)} aria-hidden="true" />
 * ```
 */
export function getPlaceholderStyle(height: number = 80): React.CSSProperties {
  return {
    height: `${height}px`,
    minHeight: `${height}px`,
  };
}
