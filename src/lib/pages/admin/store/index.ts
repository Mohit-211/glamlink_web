// Export all slices
export { default as promosReducer } from './slices/promosSlice';
export { default as professionalsReducer } from './slices/professionalsSlice';
export { default as magazineReducer } from './slices/magazineSlice';

// Export actions from promos slice with namespace
export * as promosActions from './slices/promosSlice';

// Export actions from professionals slice with namespace
export * as professionalsActions from './slices/professionalsSlice';

// Export actions from magazine slice with namespace
export * as magazineActions from './slices/magazineSlice';
