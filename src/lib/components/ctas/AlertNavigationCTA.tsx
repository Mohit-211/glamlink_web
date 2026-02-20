"use client";

import { useCTAAlert } from "./hooks/useCTAAlert";
import DynamicCTAModal from "./DynamicCTAModal";

/**
 * AlertNavigationCTA - Dynamic CTA alert banner
 *
 * This component fetches its configuration from the API instead of using
 * hardcoded config files. The configuration is managed through the admin
 * panel at /admin/content-settings (CTA Alerts tab).
 *
 * Features:
 * - Fetches active CTA config from API
 * - Date-based visibility (only shows within start/end dates)
 * - localStorage-based dismissal (reappears after configured hours)
 * - Dynamic modal rendering (standard HTML or custom components)
 * - Fully admin-configurable
 */
export default function AlertNavigationCTA() {
  const {
    config,
    isVisible,
    showModal,
    isLoading,
    handleDismiss,
    handleClick,
    handleCloseModal,
  } = useCTAAlert();

  // Don't render anything while loading or if not visible
  if (isLoading || !isVisible || !config) {
    return null;
  }

  return (
    <>
      {/* Alert Banner */}
      <div className={`${config.backgroundColor} py-4 px-4 relative`}>
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-4 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close alert"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Message and CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center pr-8">
          <p className={`${config.textColor} text-sm sm:text-base font-medium`}>
            {config.message}
          </p>
          <button
            onClick={handleClick}
            className={`${config.buttonBackgroundColor} ${config.buttonTextColor} px-4 py-1.5 rounded-full text-sm sm:text-base font-medium ${config.buttonHoverColor} transition-colors duration-200 whitespace-nowrap`}
          >
            {config.buttonText}
          </button>
        </div>
      </div>

      {/* Dynamic Modal */}
      <DynamicCTAModal
        isOpen={showModal}
        onClose={handleCloseModal}
        config={config}
      />
    </>
  );
}
