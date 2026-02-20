/**
 * Global Google Maps Type Declarations
 */

declare global {
  interface Window {
    google: {
      maps: {
        // Import library function for modern dynamic loading
        importLibrary: (library: string) => Promise<any>;

        GeocoderStatus: {
          OK: string;
        };
        Geocoder: new () => {
          geocode: (
            request: { address: string },
            callback: (results: any[], status: string) => void
          ) => void;
        };
        LatLngBounds: new () => {
          extend: (point: any) => void;
          isEmpty: () => boolean;
        };
        places: {
          PlacesServiceStatus: {
            OK: string;
          };
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: any,
              callback: (predictions: any[], status: string) => void
            ) => void;
          };
          PlacesService: new (element: HTMLElement) => {
            getDetails: (
              request: any,
              callback: (result: any, status: string) => void
            ) => void;
          };
        };
        marker: {
          AdvancedMarkerElement: new (options?: any) => {
            position: { lat: number; lng: number } | null;
            map: any | null;
            title: string | undefined;
            gmpClickable: boolean;
            content: HTMLElement | string | null | undefined;
            setMap: (map: any | null) => void;
            addEventListener: (type: string, handler: (event: any) => void) => void;
            removeEventListener: (type: string, handler: (event: any) => void) => void;
          };
        };
      };
    };
  }
}

export {};