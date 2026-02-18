import { MagazineIssue, MagazineIssueSection } from "./magazine/core";

/**
 * Magazine Viewer Types
 *
 * Types specific to the single-page magazine viewer with URL parameter navigation
 */

// Page type for viewer navigation
export type ViewerPageType = 'cover' | 'toc' | 'editors-note' | 'section';

// Individual page in the viewer
export interface ViewerPage {
  pid: number;
  type: ViewerPageType;
  title: string;
  thumbnail: string | null;
  sectionData?: MagazineIssueSection; // Present for section pages
}

// Props for the main viewer component
export interface MagazineViewerProps {
  issue: MagazineIssue;
}

// Props for thumbnail navigation
export interface ThumbnailNavigationProps {
  pages: ViewerPage[];
  currentPid: number;
  onNavigate: (pid: number) => void;
}

// Props for individual thumbnail item
export interface ThumbnailItemProps {
  page: ViewerPage;
  isActive: boolean;
  onClick: () => void;
}

// Navigation state
export interface PageNavigationState {
  currentPid: number;
  navigateTo: (pid: number) => void;
  totalPages: number;
  goNext: () => void;
  goPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}
