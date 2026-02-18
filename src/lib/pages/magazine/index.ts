/**
 * Magazine Module
 *
 * Single-page magazine viewer with URL parameter navigation.
 *
 * @example
 * ```tsx
 * import { IssueViewer } from '@/lib/pages/magazine';
 *
 * export default function MagazinePage({ issue }) {
 *   return <IssueViewer issue={issue} />;
 * }
 * ```
 */

// Issue viewer components
export { IssueViewer, MagazineCTA } from './components/issue';
export { MagazineNavigation, ThumbnailNavigation, ThumbnailItem } from './components/issue/navigation';

// Home page components
export { MagazineListing, IssueCard } from './components/home';

// Hooks
export { usePageList, usePageNavigation, useThumbnailExtraction, extractThumbnailFromSection } from './hooks';
export { useKeyboardNavigation, usePageData } from './components/issue';

// Utilities (from sections)
export { normalizeImageFields, getBackgroundStyle, getBackgroundClass, getBackgroundProps } from './components/issue/sections';

// Types
export type {
  ViewerPage,
  ThumbnailNavigationProps,
  ThumbnailItemProps,
  PageNavigationState,
  MagazineViewerProps,
} from './types';
