"use client";

/**
 * VerificationReviewModal - Modal for reviewing verification submissions
 */

import { useState } from "react";
import {
  X,
  ExternalLink,
  FileText,
  Image,
  CheckCircle,
  XCircle,
  Loader2,
  Building,
  User,
  MapPin,
  Calendar,
  Globe,
  AtSign,
} from "lucide-react";
import type {
  VerificationSubmission,
  VerificationDocument,
} from "@/lib/features/profile-settings/verification/types";
import {
  BUSINESS_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/features/profile-settings/verification/config";

interface VerificationReviewModalProps {
  submission: VerificationSubmission;
  onClose: () => void;
  onApprove: (notes?: string) => Promise<void>;
  onReject: (reason: string, notes?: string) => Promise<void>;
  isSaving: boolean;
}

function DocumentLink({ doc }: { doc: VerificationDocument | undefined }) {
  if (!doc) return <span className="text-gray-400">Not provided</span>;

  const isImage = doc.mimeType.startsWith("image/");

  return (
    <a
      href={doc.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-glamlink-teal hover:underline"
    >
      {isImage ? (
        <Image className="w-4 h-4" />
      ) : (
        <FileText className="w-4 h-4" />
      )}
      <span className="truncate max-w-[200px]">{doc.fileName}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <dt className="text-xs text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900">{value || "—"}</dd>
      </div>
    </div>
  );
}

export default function VerificationReviewModal({
  submission,
  onClose,
  onApprove,
  onReject,
  isSaving,
}: VerificationReviewModalProps) {
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    await onApprove(reviewNotes || undefined);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    await onReject(rejectionReason, reviewNotes || undefined);
    onClose();
  };

  const isPending = submission.status === "pending";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Review
              </h2>
              <p className="text-sm text-gray-500">
                {submission.businessName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_COLORS[submission.status]
                }`}
              >
                {STATUS_LABELS[submission.status]}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
                  Business Information
                </h3>
                <div className="space-y-1">
                  <InfoItem
                    icon={Building}
                    label="Business Name"
                    value={submission.businessName}
                  />
                  <InfoItem
                    icon={Building}
                    label="Business Type"
                    value={BUSINESS_TYPE_LABELS[submission.businessType]}
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Years in Business"
                    value={submission.yearsInBusiness || "Not specified"}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={`${submission.businessAddress}, ${submission.city}, ${submission.state} ${submission.zipCode}`}
                  />
                  {submission.website && (
                    <InfoItem
                      icon={Globe}
                      label="Website"
                      value={
                        <a
                          href={submission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-glamlink-teal hover:underline"
                        >
                          {submission.website}
                        </a>
                      }
                    />
                  )}
                  {submission.socialMedia && (
                    <InfoItem
                      icon={AtSign}
                      label="Social Media"
                      value={submission.socialMedia}
                    />
                  )}
                </div>
              </div>

              {/* Owner Identity */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
                  Owner Identity
                </h3>
                <div className="space-y-1">
                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={submission.ownerFullName}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">ID Documents</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-400">Front: </span>
                      <DocumentLink doc={submission.ownerIdFront} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Back: </span>
                      <DocumentLink doc={submission.ownerIdBack} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Documents */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
                  Business Documents
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Business License
                    </p>
                    <DocumentLink doc={submission.businessLicense} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Insurance</p>
                    <DocumentLink doc={submission.insurance} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tax Document</p>
                    <DocumentLink doc={submission.taxDocument} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Certifications</p>
                    {submission.certifications &&
                    submission.certifications.length > 0 ? (
                      <div className="space-y-1">
                        {submission.certifications.map((cert) => (
                          <div key={cert.id}>
                            <DocumentLink doc={cert} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        None provided
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
                  Submission Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Brand ID: </span>
                    <span className="font-mono text-gray-700">
                      {submission.brandId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted: </span>
                    <span className="text-gray-700">
                      {new Date(submission.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  {submission.reviewedAt && (
                    <>
                      <div>
                        <span className="text-gray-500">Reviewed: </span>
                        <span className="text-gray-700">
                          {new Date(submission.reviewedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Reviewed by: </span>
                        <span className="text-gray-700">
                          {submission.reviewerEmail || "Unknown"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {submission.reviewNotes && (
                  <div>
                    <span className="text-gray-500 text-sm">
                      Review Notes:{" "}
                    </span>
                    <p className="text-gray-700 text-sm mt-1">
                      {submission.reviewNotes}
                    </p>
                  </div>
                )}
                {submission.rejectionReason && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <span className="text-red-600 text-sm font-medium">
                      Rejection Reason:{" "}
                    </span>
                    <p className="text-red-700 text-sm mt-1">
                      {submission.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer / Actions */}
          {isPending && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              {!showRejectForm ? (
                <div className="space-y-4">
                  {/* Review Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Notes (optional)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
                      placeholder="Add any notes about this review..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setShowRejectForm(true)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rejection Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Explain why this verification request is being rejected..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={isSaving || !rejectionReason.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
