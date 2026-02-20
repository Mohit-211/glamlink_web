'use client';

import { usePrefersReducedMotion } from '../../hooks/accessibility/usePrefersReducedMotion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * Loading spinner component with reduced motion support.
 *
 * Shows a static hourglass icon for users who prefer reduced motion,
 * otherwise displays an animated spinner.
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" message="Loading..." />
 * ```
 */
export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Show static indicator for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className={`${sizeClasses[size]} flex items-center justify-center text-glamlink-purple`}>
          <span className="text-2xl" role="img" aria-label="Loading">

          </span>
        </div>
        {message && <p className="mt-4 text-gray-500">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`loading-spinner ${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-glamlink-purple`}
        role="status"
        aria-label="Loading"
      />
      {message && <p className="mt-4 text-gray-500">{message}</p>}
    </div>
  );
}
