// Components
export { PrivacySection, PrivacyToggle, VisibilitySelector } from "./components";

// Hooks
export { usePrivacy } from "./hooks/usePrivacy";

// Types
export type {
  PrivacySettings,
  ProfileVisibility,
  SearchVisibility,
  UsePrivacyReturn,
  VisibilityOption,
  PrivacySetting,
  PrivacyCategory,
} from "./types";

// Config
export { VISIBILITY_OPTIONS, PRIVACY_CATEGORIES, DEFAULT_PRIVACY_SETTINGS } from "./config";
