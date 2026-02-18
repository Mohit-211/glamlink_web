"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { LoginEvent } from "../types";
import { LOGIN_STATUS_COLORS } from "../config";

interface LoginHistoryProps {
  loginHistory: LoginEvent[];
  isLoadingHistory: boolean;
}

export default function LoginHistory({ loginHistory, isLoadingHistory }: LoginHistoryProps) {
  const getStatusIcon = (status: LoginEvent['status']) => {
    switch (status) {
      case 'success':
        return CheckCircle2;
      case 'failed':
        return XCircle;
      case 'blocked':
        return AlertTriangle;
    }
  };

  const getStatusLabel = (status: LoginEvent['status']) => {
    switch (status) {
      case 'success':
        return 'Successful';
      case 'failed':
        return 'Failed';
      case 'blocked':
        return 'Blocked';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let relativeTime = '';
    if (diffMins < 1) relativeTime = 'Just now';
    else if (diffMins < 60) relativeTime = `${diffMins}m ago`;
    else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
    else relativeTime = `${diffDays}d ago`;

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    return { relativeTime, formattedDate };
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading login history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Login History</h3>
        <p className="text-sm text-gray-500 mt-0.5">Recent sign-in activity on your account</p>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {loginHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No login history available</p>
          </div>
        ) : (
          loginHistory.map((event) => {
            const StatusIcon = getStatusIcon(event.status);
            const { relativeTime, formattedDate } = formatTimestamp(event.timestamp);

            return (
              <div key={event.id} className="flex gap-4">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${LOGIN_STATUS_COLORS[event.status]}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  {loginHistory[loginHistory.length - 1].id !== event.id && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {getStatusLabel(event.status)} sign-in
                        </span>
                        <span className="text-xs text-gray-400">{relativeTime}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {event.browser} on {event.deviceType}
                      </p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                      {event.failureReason && (
                        <p className="text-sm text-red-600 mt-1">Reason: {event.failureReason}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
