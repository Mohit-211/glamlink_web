// Export all email sections by category
export * from './editorial';
export * from './commerce';
export * from './professional';
export * from './community';
export * from './location';

// Import existing sections for backwards compatibility
export { default as PreviewCTA } from './PreviewCTA';
export { default as CarouselItems } from './CarouselItems';