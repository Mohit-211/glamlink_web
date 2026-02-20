"use client";

// Export types
export type ExportFormat = 'json' | 'csv' | 'zip';
export type ExportStatus = 'idle' | 'preparing' | 'ready' | 'downloading' | 'error';

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: string;
  status: ExportStatus;
  format: ExportFormat;
  downloadUrl?: string;
  expiresAt?: string;
  fileSize?: number;
  includedData: DataCategory[];
}

export type DataCategory =
  | 'profile'
  | 'brand'
  | 'products'
  | 'services'
  | 'portfolio'
  | 'reviews'
  | 'messages'
  | 'bookings'
  | 'analytics'
  | 'settings';

// Account status types
export type AccountStatus = 'active' | 'paused' | 'pending_deletion' | 'deleted';

export interface AccountPauseSettings {
  isPaused: boolean;
  pausedAt?: string;
  pausedUntil?: string;
  pauseReason?: string;
  showPausedMessage: boolean;
  pausedMessage?: string;
  preserveBookings: boolean;
}

// Deletion types
export interface AccountDeletionRequest {
  id: string;
  userId: string;
  requestedAt: string;
  scheduledDeletionAt: string;
  reason?: string;
  feedback?: string;
  status: 'pending' | 'cancelled' | 'completed';
}

// Transfer types
export type TransferStatus = 'idle' | 'pending' | 'accepted' | 'rejected' | 'expired';

export interface BrandTransferRequest {
  id: string;
  brandId: string;
  fromUserId: string;
  toEmail: string;
  toUserId?: string;
  status: TransferStatus;
  requestedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  message?: string;
}

// Hook return interface
export interface UseAccountManagementReturn {
  // Status
  accountStatus: AccountStatus;
  pauseSettings: AccountPauseSettings;
  deletionRequest: AccountDeletionRequest | null;
  transferRequest: BrandTransferRequest | null;

  // Loading states
  isLoading: boolean;
  isExporting: boolean;
  isPausing: boolean;
  isDeleting: boolean;
  isTransferring: boolean;
  error: string | null;

  // Data Export (Phase B)
  requestExport: (categories: DataCategory[], format: ExportFormat) => Promise<void>;
  downloadExport: (requestId: string) => Promise<void>;
  exportHistory: DataExportRequest[];

  // Account Pause (Phase A - Functional)
  pauseAccount: (settings: Partial<AccountPauseSettings>) => Promise<void>;
  resumeAccount: () => Promise<void>;

  // Account Deletion (Phase C)
  requestDeletion: (reason?: string, feedback?: string) => Promise<void>;
  cancelDeletion: () => Promise<void>;

  // Brand Transfer (Phase D)
  initiateTransfer: (toEmail: string, message?: string) => Promise<void>;
  cancelTransfer: () => Promise<void>;
}
