"use client";

import { useState } from "react";
import { Shield, Check, X, Download, AlertCircle, Smartphone } from "lucide-react";
import type { TwoFactorStatus, TwoFactorSetupData, TwoFactorMethod } from "../types";
import { TWO_FACTOR_METHODS } from "../config";

interface TwoFactorAuthProps {
  twoFactorStatus: TwoFactorStatus | null;
  isEnabling2FA: boolean;
  setupData: TwoFactorSetupData | null;
  enable2FA: (method: TwoFactorMethod) => Promise<TwoFactorSetupData>;
  verify2FA: (code: string) => Promise<boolean>;
  disable2FA: (code: string) => Promise<void>;
  regenerateBackupCodes: () => Promise<string[]>;
  error: string | null;
}

export default function TwoFactorAuth({
  twoFactorStatus,
  isEnabling2FA,
  setupData,
  enable2FA,
  verify2FA,
  disable2FA,
  error,
}: TwoFactorAuthProps) {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleEnableClick = async (method: TwoFactorMethod) => {
    setVerificationError(null);
    try {
      await enable2FA(method);
      setShowSetupModal(true);
    } catch (err) {
      console.error("Error enabling 2FA:", err);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const success = await verify2FA(verificationCode);
      if (success) {
        setShowSetupModal(false);
        setVerificationCode("");
      } else {
        setVerificationError("Invalid code. Please try again.");
      }
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable = async () => {
    if (!disableCode) {
      return;
    }

    setIsDisabling(true);
    setVerificationError(null);

    try {
      await disable2FA(disableCode);
      setShowDisableModal(false);
      setDisableCode("");
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Failed to disable 2FA");
    } finally {
      setIsDisabling(false);
    }
  };

  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;

    const content = `Glamlink 2FA Backup Codes\n\nGenerated: ${new Date().toLocaleDateString()}\n\nIMPORTANT: Save these codes in a secure location. Each code can only be used once.\n\n${setupData.backupCodes.join("\n")}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glamlink-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Status Display */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Add an extra layer of security to your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          {twoFactorStatus?.enabled ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <Check className="w-3 h-3" />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
              <X className="w-3 h-3" />
              Not Enabled
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Enabled State */}
      {twoFactorStatus?.enabled ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Method:</span>
            <span className="font-medium text-gray-900 capitalize">
              {twoFactorStatus.method?.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Enabled on:</span>
            <span className="font-medium text-gray-900">
              {twoFactorStatus.enabledAt
                ? new Date(twoFactorStatus.enabledAt).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Backup codes remaining:</span>
            <span className="font-medium text-gray-900">
              {twoFactorStatus.backupCodesRemaining}
            </span>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowDisableModal(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-lg transition-colors"
            >
              Disable 2FA
            </button>
          </div>
        </div>
      ) : (
        /* Disabled State - Show Method Selection */
        <div className="space-y-2 pt-2">
          <p className="text-sm text-gray-700 mb-3">Choose a method:</p>
          {TWO_FACTOR_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleEnableClick(method.id)}
              disabled={isEnabling2FA || method.id !== "authenticator"}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-glamlink-teal hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{method.name}</span>
                    {method.recommended && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-glamlink-teal text-white rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
              <span className="text-sm text-glamlink-teal font-medium">Set Up</span>
            </button>
          ))}
        </div>
      )}

      {/* Setup Modal */}
      {showSetupModal && setupData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Set Up Two-Factor Authentication
                </h3>
                <button
                  onClick={() => {
                    setShowSetupModal(false);
                    setVerificationCode("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Step 1: Scan QR Code */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Step 1: Scan this QR code
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Use Google Authenticator, Authy, or any TOTP authenticator app
                  </p>
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <img src={setupData.qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                {/* Manual Entry */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Can't scan? Enter this key manually:
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-900 break-all">
                    {setupData.secret}
                  </div>
                </div>

                {/* Step 2: Verify Code */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Step 2: Enter verification code
                  </h4>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
                  />
                  {verificationError && (
                    <p className="mt-2 text-sm text-red-600">{verificationError}</p>
                  )}
                </div>

                {/* Backup Codes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Step 3: Save backup codes
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Save these codes in a secure location. Each can only be used once.
                  </p>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-1">
                    {setupData.backupCodes.map((code, index) => (
                      <div key={index} className="font-mono text-sm text-gray-900">
                        {code}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={downloadBackupCodes}
                    className="mt-2 flex items-center gap-2 text-sm text-glamlink-teal hover:text-glamlink-teal/80 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Codes
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="flex-1 px-4 py-2 bg-glamlink-teal text-white rounded-lg font-medium hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Verifying..." : "Enable 2FA"}
                  </button>
                  <button
                    onClick={() => {
                      setShowSetupModal(false);
                      setVerificationCode("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Disable 2FA</h3>
                <button
                  onClick={() => {
                    setShowDisableModal(false);
                    setDisableCode("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> Disabling 2FA will make your account less secure.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your 2FA code or backup code to confirm:
                  </label>
                  <input
                    type="text"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value)}
                    placeholder="000000 or XXXX-XXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
                  />
                  {verificationError && (
                    <p className="mt-2 text-sm text-red-600">{verificationError}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleDisable}
                    disabled={isDisabling || !disableCode}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDisabling ? "Disabling..." : "Disable 2FA"}
                  </button>
                  <button
                    onClick={() => {
                      setShowDisableModal(false);
                      setDisableCode("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
