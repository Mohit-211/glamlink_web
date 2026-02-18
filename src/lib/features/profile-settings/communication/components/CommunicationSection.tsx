"use client";

import { useCommunication } from "../hooks";

export default function CommunicationSection() {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    updateContactMethod,
    addContactMethod,
    removeContactMethod,
    setPrimaryContact,
    updateBookingSettings,
    pauseBookings,
    resumeBookings,
    updateAutoReply,
  } = useCommunication();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const primaryContact = settings.contactMethods.find(m => m.isPrimary);
  const { booking, autoReply } = settings;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Communication</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage how customers can contact you and book appointments
        </p>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Contact Methods Summary */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Contact Methods</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Primary: {primaryContact?.method.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.contactMethods.length} method(s) enabled
                </p>
              </div>
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={isSaving}
              >
                Manage
              </button>
            </div>
          </div>
        </div>

        {/* Booking Status Summary */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Booking Status</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {booking.status === 'accepting' && '✓ Accepting Bookings'}
                  {booking.status === 'paused' && '⏸ Paused'}
                  {booking.status === 'by_request' && '✋ By Request Only'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {booking.leadTime} hour lead time • {booking.maxAdvanceBooking} days advance
                </p>
              </div>
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={isSaving}
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Auto-Reply Summary */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Auto-Reply</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {autoReply.enabled ? '✓ Enabled' : '✗ Disabled'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Trigger: {autoReply.trigger.replace('_', ' ')}
                </p>
              </div>
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={isSaving}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
