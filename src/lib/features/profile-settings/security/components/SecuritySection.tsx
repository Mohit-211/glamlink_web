"use client";

import { Shield, AlertCircle } from "lucide-react";
import TwoFactorAuth from "./TwoFactorAuth";
import ActiveSessions from "./ActiveSessions";
import LoginHistory from "./LoginHistory";
import ConnectedApps from "./ConnectedApps";
import type { UseSecuritySettingsReturn } from "../types";

interface SecuritySectionProps extends UseSecuritySettingsReturn {}

export default function SecuritySection(props: SecuritySectionProps) {
  const { isLoading, error } = props;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Security Settings
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading security settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-400" />
          Security Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account security and access</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Global Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Two-Factor Authentication */}
        <div>
          <TwoFactorAuth
            twoFactorStatus={props.twoFactorStatus}
            isEnabling2FA={props.isEnabling2FA}
            setupData={props.setupData}
            enable2FA={props.enable2FA}
            verify2FA={props.verify2FA}
            disable2FA={props.disable2FA}
            regenerateBackupCodes={props.regenerateBackupCodes}
            error={props.error}
          />
        </div>

        <div className="border-t border-gray-200" />

        {/* Active Sessions */}
        <div>
          <ActiveSessions
            sessions={props.sessions}
            isLoadingSessions={props.isLoadingSessions}
            revokeSession={props.revokeSession}
            revokeAllOtherSessions={props.revokeAllOtherSessions}
            error={props.error}
          />
        </div>

        <div className="border-t border-gray-200" />

        {/* Login History */}
        <div>
          <LoginHistory
            loginHistory={props.loginHistory}
            isLoadingHistory={props.isLoadingHistory}
          />
        </div>

        <div className="border-t border-gray-200" />

        {/* Connected Apps */}
        <div>
          <ConnectedApps
            connectedApps={props.connectedApps}
            isLoadingApps={props.isLoadingApps}
            disconnectApp={props.disconnectApp}
            error={props.error}
          />
        </div>
      </div>
    </div>
  );
}
