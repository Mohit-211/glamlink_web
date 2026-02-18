/**
 * Google Maps Loader Service
 *
 * Prevents multiple Google Maps script loading by implementing a singleton pattern
 * with Promise-based loading state management.
 */

import type { GoogleMapsLoaderOptions, MapLoadingState } from '../types';

interface LoadingState {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadingState: LoadingState | null = null;
  private scriptElement: HTMLScriptElement | null = null;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  /**
   * Load Google Maps script with Promise-based API using async loading
   */
  load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    const {
      apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_VERSION || "weekly",
      libraries = ["places", "marker", "geometry"]
    } = options;

    // Check if running on server-side
    if (typeof window === 'undefined') {
      return Promise.resolve(); // Skip loading on server
    }

    // Check if already loaded
    if ((window as any).google?.maps) {
      return Promise.resolve();
    }

    // Check if already loading
    if (this.loadingState?.isLoading) {
      return this.loadingState.promise;
    }

    // Check if already failed
    if (this.loadingState?.error) {
      return Promise.reject(this.loadingState.error);
    }

    // Validate API key
    if (!apiKey) {
      const error = new Error('Google Maps API key not found in environment variables');
      this.setLoadingState(error);
      return Promise.reject(error);
    }

    // Create new loading state
    this.setLoadingState();

    // Build script URL with async loading parameter
    const librariesParam = libraries.join(',');
    const callbackName = `initGoogleMaps_${Date.now()}`;

    // Set up global callback
    (window as any)[callbackName] = () => {
      this.setLoaded();
      // Clean up callback after use
      delete (window as any)[callbackName];
    };

    // Fixed script URL - remove loading=async which can cause issues
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=${version}&libraries=${librariesParam}&callback=${callbackName}`;

    console.log('Loading Google Maps with URL:', scriptUrl);

    // Create and append script with async attributes
    this.scriptElement = document.createElement('script');
    this.scriptElement.src = scriptUrl;
    this.scriptElement.async = true;
    this.scriptElement.defer = true;

    this.scriptElement.onerror = () => {
      const error = new Error('Failed to load Google Maps script');
      this.setLoadingState(error);
      // Clean up callback if script fails
      delete (window as any)[callbackName];
    };

    // Add to document head
    try {
      document.head.appendChild(this.scriptElement);
    } catch (err) {
      const error = new Error('Failed to append Google Maps script to document');
      this.setLoadingState(error);
      // Clean up callback if script fails
      delete (window as any)[callbackName];
      return Promise.reject(error);
    }

    return this.loadingState?.promise || Promise.reject(new Error('Loading state not initialized'));
  }

  /**
   * Get current loading state
   */
  getLoadingState(): MapLoadingState {
    if (this.loadingState?.error) return 'error';
    if (this.loadingState?.isLoaded) return 'loaded';
    if (this.loadingState?.isLoading) return 'loading';
    return 'idle';
  }

  /**
   * Check if Google Maps is loaded
   */
  isLoaded(): boolean {
    return typeof window !== 'undefined' &&
           !!(window as any).google?.maps &&
           this.loadingState?.isLoaded === true;
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.loadingState?.isLoading === true;
  }

  /**
   * Get any loading error
   */
  getError(): Error | null {
    return this.loadingState?.error || null;
  }

  /**
   * Reset loading state (useful for testing or re-initialization)
   */
  reset(): void {
    if (this.scriptElement && document.head.contains(this.scriptElement)) {
      document.head.removeChild(this.scriptElement);
    }

    // Clean up any global callbacks
    const callbackPattern = /^initGoogleMaps_/;
    Object.keys(window).forEach(key => {
      if (callbackPattern.test(key)) {
        delete (window as any)[key];
      }
    });

    this.loadingState = null;
    this.scriptElement = null;
  }

  /**
   * Initialize loading state with Promise
   */
  private setLoadingState(error?: Error): void {
    if (this.loadingState) return; // Already initialized

    let resolve: () => void;
    let reject: (error: Error) => void;

    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.loadingState = {
      promise,
      resolve: resolve!,
      reject: reject!,
      isLoading: !error,
      isLoaded: false,
      error: error || null
    };

    if (error) {
      this.loadingState.reject(error);
    }
  }

  /**
   * Mark as successfully loaded
   */
  private setLoaded(): void {
    if (this.loadingState) {
      this.loadingState.isLoading = false;
      this.loadingState.isLoaded = true;
      this.loadingState.resolve();
    }
  }
}

/**
 * Export the singleton instance
 */
export const googleMapsLoader = GoogleMapsLoader.getInstance();

/**
 * Convenience function to load Google Maps
 */
export const loadGoogleMaps = (options?: GoogleMapsLoaderOptions): Promise<void> => {
  return googleMapsLoader.load(options);
};

// Export the class for testing or custom instances
export { GoogleMapsLoader };