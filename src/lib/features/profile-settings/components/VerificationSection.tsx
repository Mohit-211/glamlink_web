"use client";

/**
 * VerificationSection - Verification status display for settings page
 */

import Link from "next/link";
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useVerificationStatus } from "../verification/hooks/useVerificationStatus";
import { STATUS_LABELS, STATUS_COLORS } from "../verification/config";

export default function VerificationSection() {
  const { status, submission, isLoading } = useVerificationStatus();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Business Verification</h2>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-glamlink-teal" />
          Loading verification status...
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "approved":
        return "Your business is verified and displays a verified badge on your profile.";
      case "pending":
        return "Your verification request is being reviewed. This typically takes 2-3 business days.";
      case "rejected":
        return submission?.rejectionReason || "Your verification request was rejected. You can resubmit after addressing the issues.";
      default:
        return "Verify your business to build trust with customers and unlock additional features.";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Business Verification</h2>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Status Display */}
      <div className="flex items-start gap-3 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="text-sm text-gray-700">{getStatusMessage()}</p>

          {status === "approved" && submission?.reviewedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Verified on {new Date(submission.reviewedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}

          {status === "pending" && submission?.submittedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Submitted on {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Benefits (for non-verified users) */}
      {status === "none" && (
        <div className="bg-glamlink-teal/5 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-glamlink-teal mb-2">Benefits of verification:</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-3.5 h-3.5 text-glamlink-teal flex-shrink-0" />
              Display verified badge on your profile
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-3.5 h-3.5 text-glamlink-teal flex-shrink-0" />
              Build customer trust and credibility
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-3.5 h-3.5 text-glamlink-teal flex-shrink-0" />
              Priority placement in search results
            </li>
          </ul>
        </div>
      )}

      {/* Action Button */}
      <Link
        href="/profile/verification"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-glamlink-teal hover:text-glamlink-teal/80 transition-colors"
      >
        {status === "none" ? "Get Verified" : "View Details"}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
