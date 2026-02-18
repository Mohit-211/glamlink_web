// Types for the refactored magazine system with separate sections collection

// Section document in Firestore (separate collection)
export interface MagazineSectionDocument {
  id: string; // Required for compatibility with MagazineIssueSection
  issueId: string; // Foreign key to magazine issue
  order: number; // Position in the issue (0-indexed)
  type: "featured-story" | "product-showcase" | "provider-spotlight" | "trend-report" | "beauty-tips" | "transformation" | "catalog-section" | "founder-story" | "table-of-contents" | "cover-pro-feature" | "whats-new-glamlink" | "top-treatment" | "top-product-spotlight" | "maries-column" | "maries-corner" | "coin-drop" | "glamlink-stories" | "spotlight-city" | "pro-tips" | "event-roundup" | "whats-hot-whats-out" | "quote-wall" | "rising-star" | "magazine-closing"; // Match MagazineIssueSection type
  title: string;
  subtitle?: string;
  content: any; // Section-specific content structure
  
  // Collaboration fields
  lockedBy?: string | null; // User ID of current editor
  lockedByEmail?: string | null; // Email for display
  lockedByName?: string | null; // Display name
  lockedAt?: string | null; // ISO timestamp when locked
  lockExpiresAt?: string | null; // ISO timestamp when lock expires
  lockedTabId?: string | null; // Tab ID for multi-tab detection
  lockStatus?: SectionLockStatus; // Lock status for UI display
  
  // Metadata
  createdAt?: string; // ISO timestamp
  createdBy?: string; // User ID
  createdByEmail?: string;
  lastModified?: string; // ISO timestamp
  lastModifiedBy?: string; // User ID
  lastModifiedByEmail?: string;
  version?: number; // For optimistic locking
}

// Issue document without sections (refactored)
export interface MagazineIssueRefactored {
  id: string;
  urlId?: string;
  title: string;
  subtitle: string;
  featuredPerson?: string;
  featuredTitle?: string;
  issueNumber: number;
  issueDate: string;
  coverImage: string;
  coverImageAlt?: string;
  description?: string;
  editorNote?: string;
  featured: boolean;
  visible?: boolean;
  isEmpty?: boolean;
  
  // Section metadata (no actual sections array)
  sectionCount?: number;
  
  // Cover positioning (if applicable)
  featuredPersonIssueHeight?: any;
  textPlacement?: any;
  coverBackgroundImage?: string;
  useCoverBackground?: boolean;
  
  // Metadata
  createdAt?: string;
  createdBy?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  lastModifiedByEmail?: string;
  
  // Active editors tracking
  activeEditors?: string[]; // Array of user IDs currently editing sections
}

// Lock status for UI display
export interface SectionLockStatus {
  sectionId: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedByName?: string;
  lockedByEmail?: string;
  lockExpiresIn?: number; // seconds remaining
  canEdit: boolean; // true if current user can edit
  isExpired?: boolean; // true if lock is expired
}

// Section with lock status for UI
export interface MagazineSectionWithLock extends MagazineSectionDocument {
  lockStatus?: SectionLockStatus;
  isCurrentUserLock?: boolean;
  isMultiTabConflict?: boolean;
}

// Request/response types for API
export interface AcquireLockRequest {
  userId: string;
  userEmail: string;
  userName?: string;
  tabId?: string; // For multi-tab tracking
}

export interface AcquireLockResponse {
  success: boolean;
  message?: string;
  lockExpiresAt?: string;
  lockedBy?: string;
  lockedByName?: string;
  lockedByEmail?: string;
  lockedTabId?: string;
  isMultiTabConflict?: boolean;
  allowTransfer?: boolean;
  remainingSeconds?: number;
}

export interface ReleaseLockRequest {
  userId: string;
}

export interface TransferLockRequest {
  userId: string;
  newTabId: string;
  forceTransfer?: boolean;
}

export interface UpdateSectionOrderRequest {
  sections: Array<{
    id: string;
    order: number;
  }>;
}

// Batch operation types
export interface CreateSectionsFromTemplateRequest {
  issueId: string;
  sections: Array<Omit<MagazineSectionDocument, 'id' | 'issueId'>>;
  userId: string;
  userEmail: string;
}

// Migration helper types
export interface LegacyIssueWithSections {
  id: string;
  sections: any[]; // The old embedded sections array
  [key: string]: any; // Other issue fields
}

// Real-time collaboration events
export type CollaborationEventType = 
  | 'section_locked'
  | 'section_unlocked'
  | 'section_modified'
  | 'section_added'
  | 'section_deleted'
  | 'section_reordered';

export interface CollaborationEvent {
  type: CollaborationEventType;
  issueId: string;
  sectionId?: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  timestamp: string;
  metadata?: any;
}