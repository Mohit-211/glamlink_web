/**
 * Condensed Card Section Components
 *
 * Central export point for all condensed card section components.
 * Includes both new sections (HeaderAndBio, Map, Footer) and existing sections
 * (Header, NameTitle, Rating, etc.).
 */

// =============================================================================
// NEW SECTIONS (Phase 2)
// =============================================================================

export { default as HeaderAndBio } from './HeaderAndBio';
export { default as FooterSection } from './FooterSection';
export { default as CustomSection } from './CustomSection';
export { default as ContentContainer } from './ContentContainer';
export { default as QuickActionsLine } from './QuickActionsLine';
export { default as DropshadowContainer } from './DropshadowContainer';

// =============================================================================
// MAP SECTIONS (moved to map/ subdirectory)
// =============================================================================

export { MapSection, MapWithHours, MapAndContentContainer } from './map';

// =============================================================================
// EXISTING SECTIONS (from ../../sections/)
// =============================================================================

export { Header, NameTitle, Branding } from '../../sections/header';
export { Specialties, ImportantInfo, Rating } from '../../sections/content';
export { Contact } from '../../sections/contact';
export { CardUrl } from '../../sections/actions';
