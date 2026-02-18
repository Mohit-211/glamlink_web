"use client";

import { useCommunication } from "../hooks";
import { BOOKING_STATUS_OPTIONS, CANCELLATION_POLICIES } from "../config";

export default function BookingSettings() {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    updateBookingSettings,
    pauseBookings,
    resumeBookings,
  } = useCommunication();

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  const { booking } = settings;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Settings</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Booking Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Status
          </label>
          <div className="grid grid-cols-1 gap-3">
            {BOOKING_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateBookingSettings({ status: option.value })}
                className={`p-4 text-left rounded-md border-2 transition-colors ${
                  booking.status === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isSaving}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Lead Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Time (hours)
          </label>
          <input
            type="number"
            value={booking.leadTime}
            onChange={(e) => updateBookingSettings({ leadTime: parseInt(e.target.value) })}
            min={0}
            max={168}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum hours before a booking can be made
          </p>
        </div>

        {/* Max Advance Booking */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Advance Booking (days)
          </label>
          <input
            type="number"
            value={booking.maxAdvanceBooking}
            onChange={(e) => updateBookingSettings({ maxAdvanceBooking: parseInt(e.target.value) })}
            min={1}
            max={365}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum days in advance customers can book
          </p>
        </div>

        {/* Deposit */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={booking.requireDeposit}
              onChange={(e) => updateBookingSettings({ requireDeposit: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSaving}
            />
            <span className="text-sm font-medium text-gray-700">Require Deposit</span>
          </label>
        </div>

        {/* Instant Booking */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={booking.instantBooking}
              onChange={(e) => updateBookingSettings({ instantBooking: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSaving}
            />
            <span className="text-sm font-medium text-gray-700">Allow Instant Booking</span>
          </label>
        </div>

        {/* Cancellation Policy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cancellation Policy
          </label>
          <select
            value={booking.cancellationPolicy}
            onChange={(e) => updateBookingSettings({ cancellationPolicy: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSaving}
          >
            {CANCELLATION_POLICIES.map((policy) => (
              <option key={policy.value} value={policy.value}>
                {policy.label} - {policy.description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
