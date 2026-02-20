"use client";

/**
 * TwoFactorSection - Manage two-factor authentication
 */

import { useState } from "react";
import { Shield, CheckCircle, AlertCircle, Key, Copy } from "lucide-react";
import { useTwoFactor } from "../useTwoFactor";
import type { TwoFactorMethod } from "../types";

export default function TwoFactorSection() {
  const {
    twoFactorEnabled,
    twoFactorMethod,
    backupCodes,
    isLoading,
    isEnabling,
    isDisabling,
    error,
    success,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
  } = useTwoFactor();

  const [showEnableModal, setShowEnableModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleEnable = async () => {
    await enableTwoFactor(selectedMethod, selectedMethod === "sms" ? phoneNumber : undefined);
    setShowEnableModal(false);
    setPhoneNumber("");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyAllCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedCode("all");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Two-Factor Authentication
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Two-Factor Authentication
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Two-factor authentication updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                {twoFactorEnabled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    <CheckCircle className="w-3 h-3" />
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                    Disabled
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {twoFactorEnabled
                  ? `Protecting your account with ${twoFactorMethod || "email"} verification`
                  : "Add an extra layer of security to your account"}
              </p>
            </div>

            {twoFactorEnabled ? (
              <button
                onClick={disableTwoFactor}
                disabled={isDisabling}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDisabling ? "Disabling..." : "Disable"}
              </button>
            ) : (
              <button
                onClick={() => setShowEnableModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-lg transition-colors"
              >
                Enable
              </button>
            )}
          </div>

          {/* Backup Codes */}
          {twoFactorEnabled && backupCodes.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  <h4 className="font-medium text-gray-900">Backup Codes</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyAllCodes}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedCode === "all" ? "Copied!" : "Copy All"}
                  </button>
                  <button
                    onClick={regenerateBackupCodes}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Save these codes in a safe place. You can use them to access your account if you lose your device.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 font-mono text-sm"
                  >
                    <span>{code}</span>
                    <button
                      onClick={() => copyCode(code)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enable Modal */}
      {showEnableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enable Two-Factor Authentication</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a verification method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="email"
                      checked={selectedMethod === "email"}
                      onChange={(e) => setSelectedMethod(e.target.value as TwoFactorMethod)}
                      className="text-glamlink-teal focus:ring-glamlink-teal"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-500">Receive codes via email</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="sms"
                      checked={selectedMethod === "sms"}
                      onChange={(e) => setSelectedMethod(e.target.value as TwoFactorMethod)}
                      className="text-glamlink-teal focus:ring-glamlink-teal"
                    />
                    <div>
                      <p className="font-medium text-gray-900">SMS</p>
                      <p className="text-xs text-gray-500">Receive codes via text message</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value="authenticator"
                      checked={selectedMethod === "authenticator"}
                      onChange={(e) => setSelectedMethod(e.target.value as TwoFactorMethod)}
                      className="text-glamlink-teal focus:ring-glamlink-teal"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Authenticator App</p>
                      <p className="text-xs text-gray-500">Use Google Authenticator or similar</p>
                    </div>
                  </label>
                </div>
              </div>

              {selectedMethod === "sms" && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEnable}
                disabled={isEnabling || (selectedMethod === "sms" && !phoneNumber)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-lg transition-colors disabled:opacity-50"
              >
                {isEnabling ? "Enabling..." : "Enable"}
              </button>
              <button
                onClick={() => setShowEnableModal(false)}
                disabled={isEnabling}
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
