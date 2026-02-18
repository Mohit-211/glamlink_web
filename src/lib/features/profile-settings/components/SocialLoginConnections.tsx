"use client";

/**
 * SocialLoginConnections - Manage social login provider connections
 */

import { useState } from "react";
import { CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react";
import { useSocialLogin } from "../useSocialLogin";
import type { SocialProvider } from "../types";

// Provider icons (using emojis for simplicity)
const PROVIDER_CONFIG = {
  "google.com": {
    name: "Google",
    icon: "🔍", // Google logo emoji
    color: "bg-red-50 border-red-200 text-red-700",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  "facebook.com": {
    name: "Facebook",
    icon: "📘", // Facebook logo emoji
    color: "bg-blue-50 border-blue-200 text-blue-700",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  "apple.com": {
    name: "Apple",
    icon: "🍎", // Apple logo emoji
    color: "bg-gray-50 border-gray-300 text-gray-900",
    buttonColor: "bg-gray-900 hover:bg-gray-800",
  },
} as const;

export default function SocialLoginConnections() {
  const {
    connections,
    isLoading,
    isConnecting,
    isDisconnecting,
    error,
    success,
    connectProvider,
    disconnectProvider,
  } = useSocialLogin();

  const [disconnectingProvider, setDisconnectingProvider] = useState<SocialProvider | null>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleConnect = async (provider: SocialProvider) => {
    await connectProvider(provider);
  };

  const handleDisconnectClick = (provider: SocialProvider) => {
    setDisconnectingProvider(provider);
    setShowDisconnectConfirm(true);
  };

  const confirmDisconnect = async () => {
    if (disconnectingProvider) {
      await disconnectProvider(disconnectingProvider);
      setShowDisconnectConfirm(false);
      setDisconnectingProvider(null);
    }
  };

  if (isLoading) {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading connections...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="w-4 h-4 text-gray-400" />
          <h3 className="font-medium text-gray-900">Connected Accounts</h3>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Connection updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-3">
          Link your social accounts for quick sign-in
        </p>

        <div className="space-y-2">
          {connections.map((connection) => {
            const config = PROVIDER_CONFIG[connection.provider];
            const isProcessing = isConnecting || isDisconnecting;

            return (
              <div
                key={connection.provider}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  connection.connected
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{config.name}</p>
                      {connection.connected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    {connection.connected && connection.email && (
                      <p className="text-xs text-gray-500 mt-0.5">{connection.email}</p>
                    )}
                  </div>
                </div>

                {connection.connected ? (
                  <button
                    onClick={() => handleDisconnectClick(connection.provider)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(connection.provider)}
                    disabled={isProcessing}
                    className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${config.buttonColor}`}
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            <strong>Note:</strong> You must have at least one sign-in method. Add a password in the Security section before disconnecting all social accounts.
          </p>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && disconnectingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Disconnect {PROVIDER_CONFIG[disconnectingProvider].name}?
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              You won't be able to sign in with {PROVIDER_CONFIG[disconnectingProvider].name} anymore. Make sure you have another way to access your account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDisconnect}
                disabled={isDisconnecting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDisconnecting ? "Disconnecting..." : "Yes, Disconnect"}
              </button>
              <button
                onClick={() => {
                  setShowDisconnectConfirm(false);
                  setDisconnectingProvider(null);
                }}
                disabled={isDisconnecting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
