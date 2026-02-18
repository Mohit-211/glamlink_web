'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  isActive: boolean;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
  /** Whether to auto-focus the first element when activated */
  autoFocus?: boolean;
}

/**
 * Hook for trapping focus within a container element.
 *
 * Features:
 * - Traps Tab/Shift+Tab cycling within container
 * - Stores previously focused element and restores on deactivation
 * - Handles Escape key to trigger close callback
 * - Auto-focuses first focusable element when activated
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const { containerRef, handleKeyDown } = useFocusTrap({
 *     isActive: isOpen,
 *     onEscape: onClose,
 *   });
 *
 *   return (
 *     <div ref={containerRef} onKeyDown={handleKeyDown} role="dialog">
 *       ... modal content ...
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap({ isActive, onEscape, autoFocus = true }: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when trap activates
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Return focus when trap deactivates
  useEffect(() => {
    if (!isActive && previousFocusRef.current) {
      // Small delay to ensure the modal is fully closed
      const timer = setTimeout(() => {
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Focus first focusable element when trap activates
  useEffect(() => {
    if (isActive && autoFocus && containerRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements(containerRef.current!);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isActive, autoFocus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    // Handle Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
      return;
    }

    // Handle Tab key for focus trapping
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: go to last if on first
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: go to first if on last
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [isActive, onEscape]);

  return { containerRef, handleKeyDown };
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => {
      // Filter out elements that are not visible
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }
  );
}
