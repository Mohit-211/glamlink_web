'use client';

/**
 * Lock Management Components - Main Export
 * 
 * Centralized exports for all UI components in the lock management package.
 */

export { LockIndicator } from './LockIndicator';
export { LockCountdown } from './LockCountdown';
export { ActiveEditorsPanel } from './ActiveEditorsPanel';
export { LockWarningDialog } from './LockWarningDialog';
export { LockConflictAlert } from './LockConflictAlert';
export { InlineLockAlert, LockStatusAlert } from './InlineLockAlert';
export { LockGatedContent, SectionGatedContent } from './LockGatedContent';
export { LockDisplay } from './LockDisplay';
export { LockGatedEditor, SectionLockGatedEditor } from './LockGatedEditor';

export type {
  LockIndicatorProps
} from './LockIndicator';

export type {
  LockCountdownProps  
} from './LockCountdown';

export type {
  ActiveEditorsPanelProps,
  ActiveEditor
} from './ActiveEditorsPanel';

export type {
  LockWarningDialogProps
} from './LockWarningDialog';

export type {
  LockDisplayProps,
  LockDisplayRef
} from './LockDisplay';

export type {
  LockGatedEditorProps
} from './LockGatedEditor';