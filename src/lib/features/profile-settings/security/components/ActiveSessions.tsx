"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Session } from "../types";
import { DEVICE_ICONS } from "../config";

interface ActiveSessionsProps {
  sessions: Session[];
  isLoadingSessions: boolean;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllOtherSessions: () => Promise<void>;
  error: string | null;
}

export default function ActiveSessions({
  sessions,
  isLoadingSessions,
  revokeSession,
  revokeAllOtherSessions,
  error,
}: ActiveSessionsProps) {
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getDeviceIcon = (deviceType: Session['deviceType']) => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Active now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    setSuccessMessage(null);

    try {
      await revokeSession(sessionId);
      setSuccessMessage('Session signed out successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error revoking session:', err);
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('Are you sure you want to sign out all other devices?')) {
      return;
    }

    setRevokingAll(true);
    setSuccessMessage(null);

    try {
      await revokeAllOtherSessions();
      setSuccessMessage('All other sessions signed out successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error revoking all sessions:', err);
    } finally {
      setRevokingAll(false);
    }
  };

  if (isLoadingSessions) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading sessions...</span>
        </div>
      </div>
    );
  }

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Devices currently signed in to your account
          </p>
        </div>
        {otherSessions.length > 0 && (
          <button
            onClick={handleRevokeAll}
            disabled={revokingAll}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {revokingAll ? 'Signing Out...' : 'Sign Out All Others'}
          </button>
        )}
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

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No active sessions found</p>
          </div>
        ) : (
          sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.deviceType);
            return (
              <div
                key={session.id}
                className={`flex items-start gap-4 p-4 border rounded-lg ${
                  session.isCurrent
                    ? 'border-glamlink-teal bg-glamlink-teal/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <DeviceIcon className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {session.browser} on {session.os}
                    </h4>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-glamlink-teal text-white rounded">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {session.location} • {session.ipAddress.split('.').slice(0, 2).join('.')}.x.x
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatLastActive(session.lastActive)}</p>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revokingSessionId === session.id}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {revokingSessionId === session.id ? 'Signing Out...' : 'Sign Out'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
