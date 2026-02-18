'use client';

/**
 * Cleanup Container
 *
 * Utilities for cleaning up off-screen containers and React roots.
 */

import type ReactDOM from 'react-dom/client';
import type { ContainerContext } from '../types';

// =============================================================================
// CLEANUP FUNCTIONS
// =============================================================================

/**
 * Clean up a React root safely
 *
 * Uses timeout to avoid errors during cleanup
 */
export function cleanupReactRoot(root: ReactDOM.Root | null): void {
  if (!root) return;

  setTimeout(() => {
    try {
      root.unmount();
    } catch (e) {
      // Ignore unmount errors
    }
  }, 100);
}

/**
 * Remove container from DOM safely
 *
 * Uses timeout to ensure React cleanup completes first
 */
export function removeContainer(container: HTMLDivElement | null): void {
  if (!container?.parentNode) return;

  setTimeout(() => {
    try {
      container.parentNode?.removeChild(container);
    } catch (e) {
      // Ignore removal errors
    }
  }, 500);
}

/**
 * Clean up the container and React root
 *
 * Uses timeouts to avoid errors during cleanup
 *
 * @param context - Container context with container and root
 */
export function cleanupContainer(context: ContainerContext | null): void {
  if (!context) return;

  const { container, root } = context;

  // Unmount React root first
  cleanupReactRoot(root);

  // Then remove container from DOM
  removeContainer(container);
}

/**
 * Clean up container by element reference
 *
 * Alternative API when you only have the container and root separately
 */
export function cleanupContainerAndRoot(
  container: HTMLDivElement | null,
  root: ReactDOM.Root | null
): void {
  cleanupReactRoot(root);
  removeContainer(container);
}
