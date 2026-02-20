// ============================================
// PREVIEW COMPONENTS CONFIGURATION
// ============================================

import type { MagazineIssue } from '@/lib/pages/magazine/types';

/**
 * Props interface for all preview components
 */
export interface PreviewComponentProps {
  issue: Partial<MagazineIssue>;
  onNavigate?: (pageNumber: number) => void;
}

/**
 * Configuration for a single preview component
 */
export interface IssuePreviewComponent {
  id: string;
  label: string;
  component: React.ComponentType<PreviewComponentProps>;
}

// Import preview components
import CoverPreview from '../components/magazine/web/preview/CoverPreview';
import TableOfContentsPreview from '../components/magazine/web/preview/TableOfContentsPreview';
import EditorsNotePreview from '../components/magazine/web/preview/EditorsNotePreview';
import ThumbnailNavigationPreview from '../components/magazine/web/preview/ThumbnailNavigationPreview';

/**
 * List of available preview components for magazine issues
 * Used to populate the preview dropdown in the Default and Preview tabs
 *
 * To add a new preview:
 * 1. Create the preview component in /components/magazine/web/preview/
 * 2. Import it here
 * 3. Add to this array with unique id and label
 */
export const issuePreviewComponents: IssuePreviewComponent[] = [
  { id: 'cover', label: 'Cover', component: CoverPreview },
  { id: 'toc', label: 'Table of Contents', component: TableOfContentsPreview },
  { id: 'editors-note', label: "Editor's Note", component: EditorsNotePreview },
  { id: 'thumbnail-nav', label: 'Thumbnail Navigation', component: ThumbnailNavigationPreview }
];
