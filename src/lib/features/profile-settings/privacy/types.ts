"use client";

// Enum types
export type ProfileVisibility = 'public' | 'private' | 'unlisted';
export type SearchVisibility = 'visible' | 'hidden';

// Main settings interface
export interface PrivacySettings {
  // Profile Visibility
  profileVisibility: ProfileVisibility;
  searchVisibility: SearchVisibility;

  // Activity & Status
  showActivityStatus: boolean;
  showLastActive: boolean;

  // Contact Information
  hideEmail: boolean;
  hidePhone: boolean;
  hideAddress: boolean;
  showCityOnly: boolean;

  // Social & Engagement
  allowMessages: boolean;
  allowReviews: boolean;
  showReviewCount: boolean;

  // Analytics
  hideFromAnalytics: boolean;
}

// Configuration types
export interface VisibilityOption {
  value: ProfileVisibility;
  label: string;
  description: string;
  icon: string;
}

export interface PrivacySetting {
  id: keyof PrivacySettings;
  label: string;
  description: string;
  type: 'toggle' | 'select';
  options?: VisibilityOption[];
  warning?: string;
}

export interface PrivacyCategory {
  id: string;
  name: string;
  description: string;
  settings: PrivacySetting[];
}

// Hook return type
export interface UsePrivacyReturn {
  settings: PrivacySettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateSetting: <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => Promise<void>;
}
