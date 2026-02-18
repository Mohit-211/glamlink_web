"use client";

/**
 * VerificationTab - Admin tab for managing verification submissions
 */

import { useState } from "react";
import {
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useVerificationAPI } from "./useVerificationAPI";
import VerificationReviewModal from "./VerificationReviewModal";
import type { VerificationSubmission } from "@/lib/features/profile-settings/verification/types";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  BUSINESS_TYPE_LABELS,
} from "@/lib/features/profile-settings/verification/config";

function StatusBadge({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
    </span>
  );
}

function StatBadge({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{value}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default function VerificationTab() {
  const {
    filteredSubmissions,
    isLoading,
    error,
    lastUpdated,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    fetchSubmissions,
    updateSubmissionStatus,
    isSaving,
  } = useVerificationAPI();

  const [selectedSubmission, setSelectedSubmission] =
    useState<VerificationSubmission | null>(null);

  const handleApprove = async (notes?: string) => {
    if (!selectedSubmission) return;
    await updateSubmissionStatus(selectedSubmission.id, {
      status: "approved",
      reviewNotes: notes,
    });
  };

  const handleReject = async (reason: string, notes?: string) => {
    if (!selectedSubmission) return;
    await updateSubmissionStatus(selectedSubmission.id, {
      status: "rejected",
      rejectionReason: reason,
      reviewNotes: notes,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Business Verification
              </h2>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated:{" "}
                  {new Date(lastUpdated).toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-3">
          <StatBadge
            icon={AlertCircle}
            label="Total"
            value={stats.total}
            color="bg-gray-100 text-gray-700"
          />
          <StatBadge
            icon={Clock}
            label="Pending"
            value={stats.pending}
            color="bg-yellow-100 text-yellow-700"
          />
          <StatBadge
            icon={CheckCircle}
            label="Approved"
            value={stats.approved}
            color="bg-green-100 text-green-700"
          />
          <StatBadge
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            color="bg-red-100 text-red-700"
          />
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name or owner..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      Loading submissions...
                    </p>
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No submissions found</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {submission.businessName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {submission.city}, {submission.state}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {submission.ownerFullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {BUSINESS_TYPE_LABELS[submission.businessType]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(submission.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-glamlink-teal hover:bg-glamlink-teal/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <VerificationReviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
