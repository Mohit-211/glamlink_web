"use client";

/**
 * Step4Review - Review and submit step
 */

import { Check, AlertCircle, FileText, Image, Edit2 } from "lucide-react";
import type {
  BusinessInfoFormData,
  OwnerIdentityFormData,
  BusinessDocsFormData,
  VerificationDocument,
} from "../../types";
import { BUSINESS_TYPE_LABELS, VERIFICATION_TERMS } from "../../config";

interface Step4ReviewProps {
  businessInfo: BusinessInfoFormData;
  ownerIdentity: OwnerIdentityFormData;
  businessDocs: BusinessDocsFormData;
  agreedToTerms: boolean;
  onAgreeToTerms: (agreed: boolean) => void;
  onEditStep: (step: number) => void;
  errors: string[];
}

function DocumentPreview({ doc }: { doc: VerificationDocument | null }) {
  if (!doc) return <span className="text-gray-400 italic">Not uploaded</span>;

  const isImage = doc.mimeType.startsWith("image/");

  return (
    <div className="flex items-center gap-2">
      {isImage ? (
        <Image className="w-4 h-4 text-gray-500" />
      ) : (
        <FileText className="w-4 h-4 text-gray-500" />
      )}
      <span className="text-sm text-gray-700 truncate max-w-[200px]">
        {doc.fileName}
      </span>
    </div>
  );
}

function SectionCard({
  title,
  stepNumber,
  onEdit,
  children,
}: {
  title: string;
  stepNumber: number;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-glamlink-teal hover:text-glamlink-teal/80 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500 sm:w-40 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900 mt-1 sm:mt-0">{value || "—"}</dd>
    </div>
  );
}

export default function Step4Review({
  businessInfo,
  ownerIdentity,
  businessDocs,
  agreedToTerms,
  onAgreeToTerms,
  onEditStep,
  errors,
}: Step4ReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Review Your Application
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please review all information before submitting. Make sure everything
          is accurate.
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Business Information */}
      <SectionCard
        title="Business Information"
        stepNumber={1}
        onEdit={() => onEditStep(1)}
      >
        <dl className="space-y-0">
          <InfoRow label="Business Name" value={businessInfo.businessName} />
          <InfoRow
            label="Business Type"
            value={BUSINESS_TYPE_LABELS[businessInfo.businessType]}
          />
          <InfoRow
            label="Years in Business"
            value={businessInfo.yearsInBusiness || "Not specified"}
          />
          <InfoRow
            label="Address"
            value={
              businessInfo.businessAddress
                ? `${businessInfo.businessAddress}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zipCode}`
                : null
            }
          />
          <InfoRow label="Country" value={businessInfo.country} />
          <InfoRow label="Website" value={businessInfo.website || "—"} />
          <InfoRow
            label="Social Media"
            value={businessInfo.socialMedia || "—"}
          />
        </dl>
      </SectionCard>

      {/* Owner Identity */}
      <SectionCard
        title="Owner Identity"
        stepNumber={2}
        onEdit={() => onEditStep(2)}
      >
        <dl className="space-y-0">
          <InfoRow label="Full Name" value={ownerIdentity.ownerFullName} />
          <InfoRow
            label="ID (Front)"
            value={<DocumentPreview doc={ownerIdentity.ownerIdFront} />}
          />
          <InfoRow
            label="ID (Back)"
            value={<DocumentPreview doc={ownerIdentity.ownerIdBack} />}
          />
        </dl>
      </SectionCard>

      {/* Business Documents */}
      <SectionCard
        title="Business Documents"
        stepNumber={3}
        onEdit={() => onEditStep(3)}
      >
        <dl className="space-y-0">
          <InfoRow
            label="Business License"
            value={<DocumentPreview doc={businessDocs.businessLicense} />}
          />
          <InfoRow
            label="Certifications"
            value={
              businessDocs.certifications.length > 0 ? (
                <div className="space-y-1">
                  {businessDocs.certifications.map((cert) => (
                    <DocumentPreview key={cert.id} doc={cert} />
                  ))}
                </div>
              ) : (
                "—"
              )
            }
          />
          <InfoRow
            label="Insurance"
            value={<DocumentPreview doc={businessDocs.insurance} />}
          />
          <InfoRow
            label="Tax Document"
            value={<DocumentPreview doc={businessDocs.taxDocument} />}
          />
        </dl>
      </SectionCard>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-gray-900">
          Verification Agreement
        </h3>

        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            By checking the box below, I confirm that:
          </p>
          <ul className="space-y-2">
            {VERIFICATION_TERMS.map((term, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-glamlink-teal flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{term}</span>
              </li>
            ))}
          </ul>
        </div>

        <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-gray-200">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onAgreeToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
          />
          <span className="text-sm text-gray-700">
            I have read and agree to the verification terms above{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Submission Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-medium">What happens next?</span> After
          submitting, your application will be reviewed by our team. This
          typically takes 2-3 business days. You&apos;ll receive an email
          notification once your verification is complete.
        </p>
      </div>
    </div>
  );
}
