"use client";

import { useState } from "react";
import { Pause, Play, Calendar, AlertTriangle } from "lucide-react";
import { PAUSE_REASONS } from "../config";
import type { UseAccountManagementReturn } from "../types";

interface PauseAccountProps extends UseAccountManagementReturn {}

export default function PauseAccount({
  pauseSettings,
  isPausing,
  pauseAccount,
  resumeAccount,
}: PauseAccountProps) {
  const [showPausedMessage, setShowPausedMessage] = useState(pauseSettings.showPausedMessage);
  const [preserveBookings, setPreserveBookings] = useState(pauseSettings.preserveBookings);
  const [pauseReason, setPauseReason] = useState(pauseSettings.pauseReason || '');
  const [pausedMessage, setPausedMessage] = useState(pauseSettings.pausedMessage || '');
  const [pausedUntil, setPausedUntil] = useState(pauseSettings.pausedUntil || '');

  const handlePause = async () => {
    await pauseAccount({
      isPaused: true,
      pausedAt: new Date().toISOString(),
      pausedUntil: pausedUntil || undefined,
      pauseReason,
      showPausedMessage,
      pausedMessage: pausedMessage || undefined,
      preserveBookings,
    });
  };

  const handleResume = async () => {
    await resumeAccount();
  };

  if (pauseSettings.isPaused) {
    return (
      <div className="space-y-6">
        {/* Paused Status */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Pause className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Your brand is currently paused</h3>
              <p className="text-sm text-amber-700 mt-1">
                Your brand won't appear in search results and customers can't book new appointments.
              </p>
              {pauseSettings.pausedUntil && (
                <p className="text-sm text-amber-700 mt-2">
                  Scheduled to resume on {new Date(pauseSettings.pausedUntil).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Resume Button */}
        <div className="flex justify-end">
          <button
            onClick={handleResume}
            disabled={isPausing}
            className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isPausing ? 'Resuming...' : 'Resume Brand'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Pause Your Brand</h3>
        <p className="text-sm text-gray-600">
          Temporarily hide your brand from search results without deleting anything. You can resume at any time.
        </p>
      </div>

      {/* What Happens When Paused */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">When paused:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Your brand won't appear in search results</li>
          <li>• Customers can't book new appointments</li>
          <li>• Your profile shows "temporarily unavailable"</li>
          <li>• All your data is preserved</li>
        </ul>
      </div>

      {/* Pause Until Date */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Pause until (optional)
        </label>
        <input
          type="date"
          value={pausedUntil}
          onChange={(e) => setPausedUntil(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty for indefinite pause</p>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Reason</label>
        <select
          value={pauseReason}
          onChange={(e) => setPauseReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal"
        >
          <option value="">Select a reason...</option>
          {PAUSE_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showPausedMessage}
            onChange={(e) => setShowPausedMessage(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-glamlink-teal focus:ring-glamlink-teal rounded"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">Show "temporarily unavailable" message</span>
            <p className="text-xs text-gray-500">Display a pause message on your profile</p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preserveBookings}
            onChange={(e) => setPreserveBookings(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-glamlink-teal focus:ring-glamlink-teal rounded"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">Keep existing bookings active</span>
            <p className="text-xs text-gray-500">Honor appointments made before pausing</p>
          </div>
        </label>
      </div>

      {/* Custom Message */}
      {showPausedMessage && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Custom pause message (optional)</label>
          <textarea
            value={pausedMessage}
            onChange={(e) => setPausedMessage(e.target.value)}
            placeholder="We're taking a short break and will be back soon!"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal"
          />
        </div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>While paused, new customers won't be able to find or book your services.</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handlePause}
          disabled={isPausing || !pauseReason}
          className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Pause className="w-4 h-4" />
          {isPausing ? 'Pausing...' : 'Pause Brand'}
        </button>
      </div>
    </div>
  );
}
