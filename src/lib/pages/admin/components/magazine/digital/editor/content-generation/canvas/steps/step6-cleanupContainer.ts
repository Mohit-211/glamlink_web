/**
 * Step 6: Cleanup Container
 *
 * Clean up the container and React root.
 * Uses timeouts to avoid errors during cleanup.
 */

import ReactDOM from 'react-dom/client';

// =============================================================================
// TYPES
// =============================================================================

/** Container context for cleanup */
export interface ContainerContext {
  container: HTMLDivElement;
  root: ReactDOM.Root;
}

// =============================================================================
// FUNCTION
// =============================================================================

/**
 * Clean up the container and React root
 * Uses timeouts to avoid errors during cleanup
 */
export function cleanupContainer(context: ContainerContext | null): void {
  if (!context) return;

  const { container, root } = context;

  // Unmount React root
  if (root) {
    setTimeout(() => {
      try {
        root.unmount();
      } catch (e) {
        // Ignore unmount errors
      }
    }, 100);
  }

  // Remove container from DOM
  if (container?.parentNode) {
    setTimeout(() => {
      try {
        container.parentNode?.removeChild(container);
      } catch (e) {
        // Ignore removal errors
      }
    }, 500);
  }
}
