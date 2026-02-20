"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ConnectedApp } from "../types";
import { OAUTH_PROVIDERS } from "../config";

interface ConnectedAppsProps {
  connectedApps: ConnectedApp[];
  isLoadingApps: boolean;
  disconnectApp: (appId: string) => Promise<void>;
  error: string | null;
}

export default function ConnectedApps({
  connectedApps,
  isLoadingApps,
  disconnectApp,
  error,
}: ConnectedAppsProps) {
  const [disconnectingAppId, setDisconnectingAppId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDisconnect = async (appId: string, providerName: string) => {
    if (
      !confirm(
        `Are you sure you want to disconnect ${providerName}? You may need this to sign in.`
      )
    ) {
      return;
    }

    setDisconnectingAppId(appId);
    setSuccessMessage(null);

    try {
      await disconnectApp(appId);
      setSuccessMessage(`${providerName} disconnected successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error disconnecting app:', err);
    } finally {
      setDisconnectingAppId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoadingApps) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading connected apps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Connected Apps</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          OAuth providers connected to your account
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Apps List */}
      <div className="space-y-3">
        {connectedApps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No connected apps</p>
            <p className="text-sm mt-1">You can connect OAuth providers when signing in</p>
          </div>
        ) : (
          connectedApps.map((app) => {
            const provider = OAUTH_PROVIDERS[app.provider];

            return (
              <div
                key={app.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                {/* Provider Icon/Logo */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ backgroundColor: `${provider.color}20` }}
                >
                  <span className="text-lg font-bold" style={{ color: provider.color }}>
                    {provider.name[0]}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{app.email}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>Connected: {formatDate(app.connectedAt)}</span>
                    <span>Last used: {formatDate(app.lastUsed)}</span>
                  </div>
                </div>

                {/* Actions */}
                {connectedApps.length > 1 ? (
                  <button
                    onClick={() => handleDisconnect(app.id, provider.name)}
                    disabled={disconnectingAppId === app.id}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {disconnectingAppId === app.id ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                ) : (
                  <span className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg">
                    Primary
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {connectedApps.length === 1 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> You cannot disconnect your only sign-in method. Add another
            provider first.
          </p>
        </div>
      )}
    </div>
  );
}
