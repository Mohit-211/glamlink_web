"use client";

/**
 * DeviceManagementSection - Manage logged-in devices/sessions
 */

import { useState } from "react";
import { Laptop, Smartphone, Monitor, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useDeviceManagement } from "../useDeviceManagement";

export default function DeviceManagementSection() {
  const {
    devices,
    isLoading,
    isRevoking,
    error,
    success,
    revokeDevice,
    revokeAllOtherDevices,
  } = useDeviceManagement();

  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false);
  const [revokingDeviceId, setRevokingDeviceId] = useState<string | null>(null);

  const handleRevokeDevice = async (deviceId: string) => {
    setRevokingDeviceId(deviceId);
    await revokeDevice(deviceId);
    setRevokingDeviceId(null);
  };

  const handleRevokeAll = async () => {
    await revokeAllOtherDevices();
    setShowRevokeAllConfirm(false);
  };

  const getDeviceIcon = (device: { browser: string; os: string }) => {
    const os = device.os.toLowerCase();
    if (os.includes("ios") || os.includes("iphone") || os.includes("ipad")) {
      return <Smartphone className="w-5 h-5 text-gray-400" />;
    } else if (os.includes("android")) {
      return <Smartphone className="w-5 h-5 text-gray-400" />;
    } else if (os.includes("mac")) {
      return <Laptop className="w-5 h-5 text-gray-400" />;
    } else {
      return <Monitor className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 5) return "Active now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Laptop className="w-5 h-5 text-gray-400" />
            Devices
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading devices...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-gray-400" />
              Devices
            </h2>
            {devices.filter((d) => !d.current).length > 0 && (
              <button
                onClick={() => setShowRevokeAllConfirm(true)}
                disabled={isRevoking}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors disabled:opacity-50"
              >
                Sign Out All Other Devices
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Device removed successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Device List */}
          {devices.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No devices found
            </p>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-4 border rounded-lg ${
                    device.current ? "border-glamlink-teal bg-glamlink-teal/5" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getDeviceIcon(device)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{device.name}</h3>
                          {device.current && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                              Current Device
                            </span>
                          )}
                        </div>

                        <div className="mt-1 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatLastActive(device.lastActive)}</span>
                          </div>

                          {device.location && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{device.location}</span>
                            </div>
                          )}

                          <div className="text-xs text-gray-400">
                            {device.browser} • {device.os} • {device.ipAddress}
                          </div>
                        </div>
                      </div>
                    </div>

                    {!device.current && (
                      <button
                        onClick={() => handleRevokeDevice(device.id)}
                        disabled={isRevoking && revokingDeviceId === device.id}
                        className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {isRevoking && revokingDeviceId === device.id ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This is a list of devices that have logged into your account. Remove any unrecognized devices.
            </p>
          </div>
        </div>
      </div>

      {/* Revoke All Confirmation Modal */}
      {showRevokeAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sign Out All Other Devices?</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              This will sign out all devices except this one. You'll need to sign in again on those devices.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleRevokeAll}
                disabled={isRevoking}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isRevoking ? "Signing Out..." : "Yes, Sign Out All"}
              </button>
              <button
                onClick={() => setShowRevokeAllConfirm(false)}
                disabled={isRevoking}
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
