// =============================================================================
// SECTIONS - COMPOSED SECTION COMPONENTS
// =============================================================================
// This directory contains section components that compose items/ components
// to create full card sections.
//
// Structure:
// - header/      → Header, name/title, branding sections
// - bio/         → Biography and about sections
// - content/     → Specialties, info, rating sections
// - media/       → Video and signature work sections
// - promotions/  → Promotional content sections
// - contact/     → Contact, hours, map sections
// - actions/     → Action buttons and card URL sections
// - QuickActions/ → Quick action buttons (existing folder)

// Header Components
export { Header, NameTitle, Branding } from './header';

// Bio Components
export { AboutMe, BioPreview, BioSimple } from './bio';

// Content Components
export { Specialties, ImportantInfo, Rating, OverviewStats } from './content';

// Media Components
export { SignatureWork, SignatureWorkAndActions, VideoDisplaySection } from './media';

// Promotion Components
export { CurrentPromotions, CurrentPromotionsDetailed } from './promotions';

// Contact Components
export { Contact, BusinessHours, MemoizedMapSection } from './contact';

// Action Components
export { CardActionButtons, CardUrl } from './actions';

// QuickActions (existing folder)
export { default as QuickActions } from './QuickActions';
