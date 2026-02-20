'use client';

/**
 * LocationPrompt Component
 *
 * Banner component that prompts users to share their location.
 * Shows detected location after sharing or allows dismissing the prompt.
 */

import { useUserLocation, UserLocation } from '../hooks/useUserLocation';

// =============================================================================
// TYPES
// =============================================================================

interface LocationPromptProps {
  onLocationDetected?: (location: UserLocation) => void;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Location Pin Icon
 */
function LocationIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

/**
 * Close/X Icon
 */
function CloseIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/**
 * Loading Spinner
 */
function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/**
 * Check Icon
 */
function CheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function LocationPrompt({ onLocationDetected }: LocationPromptProps) {
  const {
    userLocation,
    isLoading,
    hasAsked,
    hasPermission,
    error,
    requestLocation,
    clearLocation,
    dismissPrompt,
  } = useUserLocation();

  // Notify parent when location is detected
  const handleRequestLocation = async () => {
    await requestLocation();
  };

  // If location detected and callback provided, call it
  if (userLocation && onLocationDetected) {
    onLocationDetected(userLocation);
  }

  // Don't show if user has dismissed and no location
  if (hasAsked && hasPermission === false) {
    return null;
  }

  // Show detected location banner
  if (userLocation) {
    return (
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-teal-100 rounded-full p-2">
              <CheckIcon className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Showing results near {userLocation.city}, {userLocation.state}
              </p>
              <p className="text-xs text-gray-500">
                Click any treatment to see local professionals
              </p>
            </div>
          </div>
          <button
            onClick={clearLocation}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // Show location request banner
  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
            <LocationIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Find beauty pros near you
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              Share your location to see professionals in your area
            </p>
            {error && (
              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestLocation}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                <span className="hidden sm:inline">Detecting...</span>
              </>
            ) : (
              <>
                <LocationIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Share Location</span>
                <span className="sm:hidden">Share</span>
              </>
            )}
          </button>

          <button
            onClick={dismissPrompt}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
