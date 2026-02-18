"use client";

/**
 * Step3BusinessDocs - Business documents upload step
 */

import { Plus, X } from "lucide-react";
import type { BusinessDocsFormData, VerificationDocument } from "../../types";
import DocumentUpload from "../DocumentUpload";

interface Step3BusinessDocsProps {
  data: BusinessDocsFormData;
  onChange: (data: Partial<BusinessDocsFormData>) => void;
  onAddCertification: (doc: VerificationDocument) => void;
  onRemoveCertification: (docId: string) => void;
  errors: string[];
}

export default function Step3BusinessDocs({
  data,
  onChange,
  onAddCertification,
  onRemoveCertification,
  errors,
}: Step3BusinessDocsProps) {
  const handleBusinessLicenseChange = (doc: VerificationDocument | null) => {
    onChange({ businessLicense: doc });
  };

  const handleInsuranceChange = (doc: VerificationDocument | null) => {
    onChange({ insurance: doc });
  };

  const handleTaxDocumentChange = (doc: VerificationDocument | null) => {
    onChange({ taxDocument: doc });
  };

  // For certifications, we handle it differently since it's an array
  const handleCertificationUpload = (doc: VerificationDocument | null) => {
    if (doc) {
      onAddCertification(doc);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Business Documents
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload documents that prove your business is legitimate and properly
          registered.
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Documents Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
          Required Documents
        </h3>

        {/* Business License */}
        <DocumentUpload
          label="Business License or Registration"
          documentType="business_license"
          value={data.businessLicense}
          onChange={handleBusinessLicenseChange}
          required
          helperText="Upload your business license, LLC registration, or other official business registration document"
        />
      </div>

      {/* Optional Documents Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
          Optional Documents
        </h3>
        <p className="text-xs text-gray-500 -mt-4">
          Additional documents help strengthen your verification and build trust
          with customers
        </p>

        {/* Professional Certifications */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Professional Certifications
          </label>

          {/* Existing Certifications */}
          {data.certifications.length > 0 && (
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {cert.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(cert.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveCertification(cert.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Certification */}
          {data.certifications.length < 5 && (
            <DocumentUpload
              label=""
              documentType="certification"
              value={null}
              onChange={handleCertificationUpload}
              helperText="Add cosmetology license, esthetician certification, or other professional credentials (max 5)"
            />
          )}

          {data.certifications.length >= 5 && (
            <p className="text-xs text-gray-500">
              Maximum of 5 certifications allowed
            </p>
          )}
        </div>

        {/* Insurance Certificate */}
        <DocumentUpload
          label="Insurance Certificate"
          documentType="insurance"
          value={data.insurance}
          onChange={handleInsuranceChange}
          helperText="Proof of business liability insurance"
        />

        {/* Tax Document */}
        <DocumentUpload
          label="Tax Registration Document"
          documentType="tax_document"
          value={data.taxDocument}
          onChange={handleTaxDocumentChange}
          helperText="EIN letter, sales tax permit, or similar tax registration"
        />
      </div>

      {/* Tips Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm font-medium text-amber-800 mb-2">
          Tips for faster approval
        </p>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>Ensure all documents are clearly visible and not blurry</li>
          <li>Documents should show your business name as registered</li>
          <li>Include current/unexpired documents when possible</li>
          <li>
            More documentation can help speed up the verification process
          </li>
        </ul>
      </div>
    </div>
  );
}
