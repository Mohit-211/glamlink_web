"use client";

/**
 * VerificationStatus - Displays current verification status
 */

import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useVerificationStatus } from "../hooks/useVerificationStatus";
import {
  STATUS_LABELS,
  STATUS_COLORS,
} from "../config";
import type { VerificationStatus as VStatus } from "../types";

interface VerificationStatusProps {
  showStartButton?: boolean;
  compact?: boolean;
}

function StatusIcon({ status }: { status: VStatus }) {
  switch (status) {
    case "pending":
      return <Clock className="w-6 h-6 text-yellow-500" />;
    case "approved":
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case "rejected":
      return <XCircle className="w-6 h-6 text-red-500" />;
    default:
      return <AlertCircle className="w-6 h-6 text-gray-400" />;
  }
}

export default function VerificationStatus({
  showStartButton = true,
  compact = false,
}: VerificationStatusProps) {
  const { status, submission, isLoading, error, refetch } = useVerificationStatus();

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${compact ? "p-4" : "p-6"}`}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 ${compact ? "p-4" : "p-6"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Error loading verification status
              </p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Compact version for sidebars/headers
  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {STATUS_LABELS[status]}
            </p>
            {status === "none" && showStartButton && (
              <Link
                href="/profile/verification"
                className="text-xs text-glamlink-teal hover:underline"
              >
                Start verification
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${STATUS_COLORS[status].replace("text-", "bg-").replace("-800", "-50")}`}>
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Verification Status
            </h3>
            <p className={`text-sm ${STATUS_COLORS[status].split(" ")[1]}`}>
              {STATUS_LABELS[status]}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {status === "none" && (
          <>
            <p className="text-gray-600 mb-4">
              Verify your business to build trust with customers and unlock
              additional features. Verified businesses receive a badge displayed
              on their profile.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-glamlink-teal" />
                Display verified badge on your profile
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-glamlink-teal" />
                Build customer trust and credibility
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-glamlink-teal" />
                Priority in search results
              </li>
            </ul>
            {showStartButton && (
              <Link
                href="/profile/verification"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-glamlink-teal text-white font-medium rounded-lg hover:bg-glamlink-teal/90 transition-colors"
              >
                Get Verified
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </>
        )}

        {status === "pending" && submission && (
          <>
            <p className="text-gray-600 mb-4">
              Your verification request has been submitted and is currently being
              reviewed by our team. This typically takes 2-3 business days.
            </p>
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Review in Progress
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Submitted on{" "}
                    {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              <span>
                Business: <span className="font-medium">{submission.businessName}</span>
              </span>
            </div>
          </>
        )}

        {status === "approved" && submission && (
          <>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Verification Complete
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Your business has been verified. A badge is now displayed on
                    your profile.
                  </p>
                </div>
              </div>
            </div>
            {submission.reviewedAt && (
              <p className="text-sm text-gray-500">
                Verified on{" "}
                {new Date(submission.reviewedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </>
        )}

        {status === "rejected" && submission && (
          <>
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Verification Rejected
                  </p>
                  {submission.rejectionReason && (
                    <p className="text-sm text-red-700 mt-1">
                      {submission.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              You can submit a new verification request after addressing the
              issues mentioned above.
            </p>
            {showStartButton && (
              <Link
                href="/profile/verification"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-glamlink-teal text-white font-medium rounded-lg hover:bg-glamlink-teal/90 transition-colors"
              >
                Resubmit Verification
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
