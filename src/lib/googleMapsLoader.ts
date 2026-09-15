/**
 * @react-google-maps/api loads the Google Maps script as a single global
 * singleton (keyed by `id`, default "script-loader"). Every useJsApiLoader /
 * useLoadScript call in the app MUST pass the exact same options object
 * (in particular the same `libraries` array reference) or the library
 * throws once two components with different options try to load at the
 * same time. Import these shared constants everywhere instead of declaring
 * local `libraries` arrays.
 */
export const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];
export const GOOGLE_MAPS_LOADER_ID = "glamlink-google-maps-script";
