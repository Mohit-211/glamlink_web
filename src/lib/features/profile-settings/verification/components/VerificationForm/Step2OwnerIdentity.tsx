"use client";

/**
 * Step2OwnerIdentity - Owner identity verification step
 */

import type { OwnerIdentityFormData, VerificationDocument } from "../../types";
import { ACCEPTED_ID_TYPES } from "../../config";
import DocumentUpload from "../DocumentUpload";
import { AlertCircle, Info } from "lucide-react";

interface Step2OwnerIdentityProps {
  data: OwnerIdentityFormData;
  onChange: (data: Partial<OwnerIdentityFormData>) => void;
  errors: string[];
}

export default function Step2OwnerIdentity({
  data,
  onChange,
  errors,
}: Step2OwnerIdentityProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ownerFullName: e.target.value });
  };

  const handleIdFrontChange = (doc: VerificationDocument | null) => {
    onChange({ ownerIdFront: doc });
  };

  const handleIdBackChange = (doc: VerificationDocument | null) => {
    onChange({ ownerIdBack: doc });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Owner Identity</h2>
        <p className="mt-1 text-sm text-gray-500">
          Verify your identity with a government-issued ID. This helps us
          confirm you are who you say you are.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important</p>
            <p>
              The name on your ID must match the name on your Glamlink profile.
              We accept the following ID types:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {ACCEPTED_ID_TYPES.map((idType) => (
                <li key={idType}>{idType}</li>
              ))}
            </ul>
          </div>
        </div>
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

      {/* Owner Full Name */}
      <div>
        <label
          htmlFor="ownerFullName"
          className="block text-sm font-medium text-gray-700"
        >
          Full Legal Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ownerFullName"
          name="ownerFullName"
          value={data.ownerFullName}
          onChange={handleNameChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
          placeholder="Enter your full legal name as it appears on your ID"
        />
        <p className="mt-1 text-xs text-gray-500">
          This must exactly match the name on your government-issued ID
        </p>
      </div>

      {/* ID Upload Section */}
      <div className="space-y-6">
        {/* ID Front */}
        <DocumentUpload
          label="Government-Issued ID (Front)"
          documentType="id_front"
          value={data.ownerIdFront}
          onChange={handleIdFrontChange}
          required
          helperText="Upload a clear photo of the front of your ID"
        />

        {/* ID Back */}
        <DocumentUpload
          label="Government-Issued ID (Back)"
          documentType="id_back"
          value={data.ownerIdBack}
          onChange={handleIdBackChange}
          helperText="Upload the back of your ID (optional, but recommended for driver's licenses)"
        />
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Privacy Notice:</span> Your ID documents
          are encrypted and stored securely. They are only accessible by
          authorized Glamlink administrators for verification purposes and will
          be retained according to our data retention policy.
        </p>
      </div>
    </div>
  );
}
