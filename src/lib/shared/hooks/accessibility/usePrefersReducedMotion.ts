'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion.
 *
 * Uses the `prefers-reduced-motion` media query to respect user preferences
 * for reduced animations and motion effects.
 *
 * @returns true if user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = usePrefersReducedMotion();
 *
 *   return (
 *     <div className={prefersReducedMotion ? '' : 'animate-spin'}>
 *       {prefersReducedMotion ? 'Static' : 'Animated'}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
