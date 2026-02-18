'use client';

/**
 * SubmissionViewModal - Modal for viewing submission details
 *
 * Displays submission data in collapsible sections.
 * Allows updating status from within the modal.
 */

import { X } from 'lucide-react';
import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';
import { useSubmissionView, formatDate } from './useSubmissionView';
import {
  CollapsibleSection,
  FieldDisplay,
  TextareaDisplay,
  CheckboxArrayDisplay
} from '@/lib/pages/admin/components/shared/common/collapse-display';
import { StatusControls } from '@/lib/pages/admin/components/shared/editing/form/StatusControls';
import {
  CoverDetails,
  LocalSpotlightDetails,
  RisingStarDetails,
  TopTreatmentDetails,
  GlamlinkIntegrationDetails
} from './FormTypeDetails';

// =============================================================================
// TYPES
// =============================================================================

interface SubmissionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: GetFeaturedSubmission | null;
  onUpdateStatus: (id: string, reviewed: boolean, status?: string) => Promise<void>;
  isSaving?: boolean;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SubmissionViewModal({
  isOpen,
  onClose,
  submission,
  onUpdateStatus,
  isSaving = false
}: SubmissionViewModalProps) {
  const {
    status,
    setStatus,
    handleSaveStatus,
    getFormTypeLabel,
    getStatusLabel
  } = useSubmissionView({ submission, onUpdateStatus });

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {submission.fullName || 'Submission Details'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {getFormTypeLabel(submission.formType)} - Submitted {formatDate(submission.submittedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Status Controls */}
          <StatusControls
            status={status}
            onStatusChange={setStatus}
            onSave={handleSaveStatus}
            isSaving={isSaving}
            getStatusLabel={getStatusLabel}
          />

          {/* Profile Information */}
          <CollapsibleSection title="Profile Information" defaultOpen={true}>
            <dl className="grid grid-cols-2 gap-4">
              <FieldDisplay label="Full Name" value={submission.fullName} />
              <FieldDisplay label="Email" value={submission.email} />
              <FieldDisplay label="Phone" value={submission.phone} />
              <FieldDisplay label="Business Name" value={submission.businessName} />
              <FieldDisplay label="Business Address" value={submission.businessAddress} />
              <FieldDisplay label="Website" value={submission.website} />
              <FieldDisplay label="Instagram" value={submission.instagramHandle} />
            </dl>
            <CheckboxArrayDisplay label="Primary Specialties" items={submission.primarySpecialties} />
            <TextareaDisplay label="Certification Details" value={submission.certificationDetails} />
          </CollapsibleSection>

          {/* Form-Specific Content */}
          {submission.formType === 'cover' && <CoverDetails submission={submission} />}
          {submission.formType === 'local-spotlight' && <LocalSpotlightDetails submission={submission} />}
          {submission.formType === 'rising-star' && <RisingStarDetails submission={submission} />}
          {submission.formType === 'top-treatment' && <TopTreatmentDetails submission={submission} />}

          {/* Glamlink Integration */}
          <GlamlinkIntegrationDetails submission={submission} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
