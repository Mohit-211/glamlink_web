'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  /** Total number of items in the list */
  itemCount: number;
  /** Callback when navigation occurs */
  onNavigate?: (index: number) => void;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
  /** Callback when Enter key is pressed on a focused item */
  onEnter?: (index: number) => void;
  /** Whether keyboard navigation is enabled */
  enabled?: boolean;
}

interface UseKeyboardNavigationReturn {
  /** Currently focused item index (null if none) */
  focusedIndex: number | null;
  /** Set the focused index manually */
  setFocusedIndex: (index: number | null) => void;
  /** Key event handler to attach to container */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Refs array for list items */
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Whether user is actively navigating */
  isNavigating: boolean;
}

/**
 * Hook for keyboard navigation through a list of items.
 *
 * Keyboard controls:
 * - ArrowUp: Move focus to previous item
 * - ArrowDown: Move focus to next item
 * - Home (Ctrl): Jump to first item
 * - End (Ctrl): Jump to last item
 * - Escape: Clear focus
 * - Enter: Trigger action on focused item
 *
 * @example
 * ```tsx
 * function ItemList({ items }) {
 *   const { focusedIndex, handleKeyDown, itemRefs } = useKeyboardNavigation({
 *     itemCount: items.length,
 *     onEnter: (index) => selectItem(items[index]),
 *   });
 *
 *   return (
 *     <div onKeyDown={handleKeyDown} tabIndex={0}>
 *       {items.map((item, index) => (
 *         <div
 *           key={item.id}
 *           ref={(el) => (itemRefs.current[index] = el)}
 *           className={focusedIndex === index ? 'focused' : ''}
 *         >
 *           {item.name}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useKeyboardNavigation({
  itemCount,
  onNavigate,
  onEscape,
  onEnter,
  enabled = true,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Focus the item element when focusedIndex changes
  useEffect(() => {
    if (focusedIndex !== null && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
      onNavigate?.(focusedIndex);
    }
  }, [focusedIndex, onNavigate]);

  // Reset refs array when item count changes
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, itemCount);
  }, [itemCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled || itemCount === 0) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setIsNavigating(true);
          setFocusedIndex((prev) => {
            if (prev === null) {
              // Start from the last item
              return itemCount - 1;
            }
            return Math.max(0, prev - 1);
          });
          break;

        case 'ArrowDown':
          e.preventDefault();
          setIsNavigating(true);
          setFocusedIndex((prev) => {
            if (prev === null) {
              // Start from the first item
              return 0;
            }
            return Math.min(itemCount - 1, prev + 1);
          });
          break;

        case 'Home':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setIsNavigating(true);
            setFocusedIndex(0);
          }
          break;

        case 'End':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setIsNavigating(true);
            setFocusedIndex(itemCount - 1);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setIsNavigating(false);
          setFocusedIndex(null);
          onEscape?.();
          break;

        case 'Enter':
          if (focusedIndex !== null) {
            e.preventDefault();
            onEnter?.(focusedIndex);
          }
          break;
      }
    },
    [enabled, itemCount, focusedIndex, onEscape, onEnter]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    itemRefs,
    isNavigating,
  };
}
