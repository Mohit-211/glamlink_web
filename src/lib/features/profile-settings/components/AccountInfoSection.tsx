"use client";

/**
 * AccountInfoSection - Displays email address with verification status
 */

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import SocialLoginConnections from "./SocialLoginConnections";

interface AccountInfoSectionProps {
  email: string | null | undefined;
  emailVerified?: boolean;
}

export default function AccountInfoSection({
  email,
  emailVerified = false,
}: AccountInfoSectionProps) {
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendVerification = async () => {
    setSendingVerification(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/send-verification", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }

      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification email");
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-400" />
          Account
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {/* Success Message */}
        {verificationSent && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Verification email sent! Please check your inbox.</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email with Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Email Address
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-gray-900">{email}</p>
              {emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                  <AlertCircle className="w-3 h-3" />
                  Unverified
                </span>
              )}
            </div>
            {!emailVerified && (
              <button
                onClick={handleSendVerification}
                disabled={sendingVerification}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingVerification ? "Sending..." : "Send Verification"}
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {emailVerified
              ? "Your email address is verified"
              : "Please verify your email address to access all features"}
          </p>
        </div>

        {/* Social Login Connections */}
        <SocialLoginConnections />
      </div>
    </div>
  );
}
