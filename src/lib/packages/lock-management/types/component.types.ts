/**
 * Component Types for Lock Management UI
 * 
 * Defines prop interfaces and types for React components in the lock management system.
 */

import { ReactNode } from 'react';
import { LockStatus, LockError, TabInfo } from './lock.types';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Lock Indicator Component Props
export interface LockIndicatorProps extends BaseComponentProps {
  lockStatus: LockStatus | null;
  variant?: 'compact' | 'detailed' | 'minimal';
  showCountdown?: boolean;
  showUserInfo?: boolean;
  showActions?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  
  // Event handlers
  onExtendLock?: () => void | Promise<void>;
  onTransferLock?: () => void | Promise<void>;
  onRequestRelease?: () => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  
  // Customization
  colors?: {
    locked: string;
    warning: string;
    expired: string;
    conflict: string;
  };
  
  // State
  isExtending?: boolean;
  isTransferring?: boolean;
  isRefreshing?: boolean;
}

// Active Editors Panel Props
export interface ActiveEditorsPanelProps extends BaseComponentProps {
  resourceId: string;
  collection: string;
  refreshInterval?: number;          // Milliseconds
  maxEditorsShown?: number;
  showAvatars?: boolean;
  showLastActivity?: boolean;
  showSections?: boolean;            // Show which sections they're editing
  compact?: boolean;
  
  // Event handlers
  onEditorClick?: (userId: string, userEmail: string) => void;
  onRefresh?: () => void;
  
  // Data
  editors?: ActiveEditor[];
}

export interface ActiveEditor {
  userId: string;
  userEmail: string;
  userName?: string;
  avatar?: string;
  lastActivity: string;
  editingSection?: string;
  lockExpiresAt?: string;
  tabId?: string;
}

// Lock Warning Dialog Props
export interface LockWarningDialogProps extends BaseComponentProps {
  isOpen: boolean;
  lockStatus: LockStatus | null;
  conflictType: 'user_conflict' | 'multi_tab_conflict' | 'expired_lock';
  
  // Actions
  onTransfer?: () => void | Promise<void>;
  onWaitForRelease?: () => void | Promise<void>;
  onForceAcquire?: () => void | Promise<void>; // Admin only
  onCancel: () => void;
  onRetry?: () => void | Promise<void>;
  
  // Customization
  title?: string;
  message?: string;
  showCountdown?: boolean;
  canTransfer?: boolean;
  canForce?: boolean;                // Admin override
  
  // State
  isProcessing?: boolean;
  processingAction?: 'transfer' | 'force' | 'retry';
}

// Lock Countdown Component Props
export interface LockCountdownProps extends BaseComponentProps {
  expiresAt: string;
  warningThreshold?: number;         // Seconds before showing warning
  format?: 'short' | 'long' | 'minimal';
  showIcon?: boolean;
  showProgress?: boolean;            // Show progress bar
  
  // Event handlers
  onWarning?: (secondsRemaining: number) => void;
  onExpired?: () => void;
  onTick?: (secondsRemaining: number) => void;
  
  // Styling
  warningColor?: string;
  expiredColor?: string;
  normalColor?: string;
}

// Lock Status Badge Props
export interface LockStatusBadgeProps extends BaseComponentProps {
  status: 'locked' | 'unlocked' | 'warning' | 'expired' | 'conflict';
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  tooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

// Lock Manager Provider Props (Context Provider)
export interface LockManagerProviderProps extends BaseComponentProps {
  defaultConfig?: {
    lockDuration?: number;
    refreshInterval?: number;
    autoRefresh?: boolean;
    showNotifications?: boolean;
  };
  
  // Event handlers
  onLockAcquired?: (lockStatus: LockStatus) => void;
  onLockReleased?: (resourceId: string, collection: string) => void;
  onLockConflict?: (conflict: LockError) => void;
  onLockExpiring?: (lockStatus: LockStatus, secondsRemaining: number) => void;
}

// Lock Manager Context Type
export interface LockManagerContextType {
  // Global lock state
  activeLocks: Map<string, LockStatus>;
  
  // Actions
  acquireLock: (resourceId: string, collection: string, options?: any) => Promise<boolean>;
  releaseLock: (resourceId: string, collection: string) => Promise<boolean>;
  extendLock: (resourceId: string, collection: string) => Promise<boolean>;
  transferLock: (resourceId: string, collection: string, newTabId: string) => Promise<boolean>;
  
  // Utilities
  getLockStatus: (resourceId: string, collection: string) => LockStatus | null;
  isLocked: (resourceId: string, collection: string) => boolean;
  canEdit: (resourceId: string, collection: string) => boolean;
  
  // Configuration
  config: Required<LockManagerProviderProps['defaultConfig']>;
  updateConfig: (newConfig: Partial<LockManagerProviderProps['defaultConfig']>) => void;
}

// Hook return types
export interface UseLockReturn {
  // Lock state
  lockStatus: LockStatus | null;
  hasLock: boolean;
  isLocked: boolean;
  canEdit: boolean;
  
  // Actions
  acquireLock: () => Promise<boolean>;
  releaseLock: () => Promise<boolean>;
  extendLock: () => Promise<boolean>;
  transferLock: (newTabId?: string) => Promise<boolean>;
  
  // Status
  isAcquiring: boolean;
  isReleasing: boolean;
  isExtending: boolean;
  isTransferring: boolean;
  
  // Errors
  error: LockError | null;
  clearError: () => void;
  
  // Multi-tab
  isMultiTabConflict: boolean;
  allowTransfer: boolean;
  conflictingTabId?: string;
}

export interface UseMultiTabDetectionReturn {
  currentTabId: string;
  isMultiTab: boolean;
  conflictingTabs: TabInfo[];
  canTransfer: boolean;
  
  // Actions
  transferToCurrentTab: () => Promise<boolean>;
  clearConflict: () => void;
  
  // Utilities
  isOtherTabEditing: (section?: string) => boolean;
  getConflictSummary: () => string;
}

export interface UseLockIndicatorReturn {
  // Display data
  displayText: string;
  timeRemaining: string;
  warningLevel: 'none' | 'warning' | 'urgent' | 'expired';
  statusColor: string;
  
  // State flags
  shouldShowWarning: boolean;
  shouldBlink: boolean;
  isExpired: boolean;
  
  // Actions
  refresh: () => void;
  formatTime: (seconds: number) => string;
}

// Event handler types
export type LockEventHandler = (event: {
  type: string;
  resourceId: string;
  collection: string;
  lockStatus?: LockStatus;
  error?: LockError;
}) => void;

export type LockActionHandler = () => void | Promise<void>;

// Style variants
export type LockIndicatorVariant = 'compact' | 'detailed' | 'minimal' | 'badge';
export type LockStatusColor = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Animation types
export interface LockAnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export type LockTransition = 'fade' | 'slide' | 'scale' | 'bounce' | 'none';

// Multi-Tab Conflict Detection Types
export interface MultiTabStatus {
  isOtherTabEditing: boolean;
  conflictingTabId?: string;
  conflictingSection?: string;
  conflictingSince?: Date;
  canContinue: boolean;
}