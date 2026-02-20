'use client';

/**
 * ProfessionalSubmissionModal - Modal for viewing professional submission details
 *
 * Displays digital card application data in collapsible sections.
 * Allows updating status and adding as professional from within the modal.
 */

import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Building, Mail, Phone, Globe, Instagram, Image, Video, Calendar, Info } from 'lucide-react';
import type { DigitalCardSubmission } from '../types';
import { formatSubmissionDate } from '../types';

// Import shared collapse-display components
import {
  CollapsibleSection,
  FieldDisplay,
  TextareaDisplay,
  LinkDisplay,
  ArrayBadgeDisplay,
} from '@/lib/pages/admin/components/shared/common/collapse-display';

// Import StatusControls component
import StatusControls from '@/lib/pages/admin/components/shared/editing/form/StatusControls';

// =============================================================================
// TYPES
// =============================================================================

interface ProfessionalSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: DigitalCardSubmission | null;
  onUpdateStatus: (id: string, reviewed: boolean, status?: string, hidden?: boolean) => Promise<void>;
  onAddProfessional?: (submission: DigitalCardSubmission) => Promise<void>;
  isSaving?: boolean;
  isConverting?: boolean;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ProfessionalSubmissionModal({
  isOpen,
  onClose,
  submission,
  onUpdateStatus,
  onAddProfessional,
  isSaving = false,
  isConverting = false
}: ProfessionalSubmissionModalProps) {
  const [status, setStatus] = useState(submission?.status || 'pending_review');

  // Reset status when submission changes
  useEffect(() => {
    if (submission) {
      setStatus(submission.status);
    }
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleSaveStatus = async () => {
    await onUpdateStatus(submission.id, true, status);
  };

  const handleAddProfessional = async () => {
    if (onAddProfessional) {
      await onAddProfessional(submission);
    }
  };

  const canAddProfessional = status === 'approved' && !submission.hidden && onAddProfessional;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {submission.name || 'Submission Details'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Professional Application - Submitted {formatSubmissionDate(submission.submittedAt)}
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
            // @ts-expect-error - Status type mismatch
            onStatusChange={setStatus}
            onSave={handleSaveStatus}
            isSaving={isSaving}
          />

          {/* Profile Information */}
          <CollapsibleSection title="Profile Information" defaultOpen={true}>
            <dl className="grid grid-cols-2 gap-4">
              <FieldDisplay label="Name" value={submission.name} />
              <FieldDisplay label="Title" value={submission.title} />
              <FieldDisplay
                label="Email"
                value={submission.email}
                icon={<Mail className="w-4 h-4 text-gray-400" />}
              />
              <FieldDisplay
                label="Phone"
                value={submission.phone}
                icon={<Phone className="w-4 h-4 text-gray-400" />}
              />
              <FieldDisplay label="Specialty" value={submission.specialty} />
              <FieldDisplay
                label="Custom Handle"
                value={submission.customHandle}
                icon={<Globe className="w-4 h-4 text-gray-400" />}
              />
            </dl>
            <TextareaDisplay label="Bio" value={submission.bio} />
          </CollapsibleSection>

          {/* Gallery & Portfolio */}
          {(submission.gallery && submission.gallery.length > 0) || submission.profileImage ? (
            <CollapsibleSection title="Gallery & Portfolio" defaultOpen={false}>
              {/* Profile Image */}
              {submission.profileImage && (() => {
                const profileSrc = typeof submission.profileImage === 'string'
                  ? submission.profileImage
                  : (submission.profileImage as any)?.url;
                return profileSrc ? (
                  <div className="mb-4">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Profile Image</dt>
                    <dd>
                      <img
                        src={profileSrc}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </dd>
                  </div>
                ) : null;
              })()}

              {/* Gallery Items */}
              {submission.gallery && submission.gallery.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4 text-gray-400" />
                    Gallery ({submission.gallery.length} items)
                  </dt>
                  <dd className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {submission.gallery.map((item, index) => {
                      // Handle both string URLs and object formats
                      const itemUrl = typeof item.url === 'string' ? item.url : (item as any).url?.url;
                      const thumbnailUrl = item.thumbnail || itemUrl;

                      if (!itemUrl) return null;

                      return (
                        <div key={item.id || index} className="relative group">
                          {item.type === 'video' ? (
                            <div className="relative">
                              <video
                                src={itemUrl}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                controls
                                preload="metadata"
                                poster={thumbnailUrl !== itemUrl ? thumbnailUrl : undefined}
                              />
                            </div>
                          ) : (
                            <img
                              src={itemUrl}
                              alt={item.title || `Gallery item ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          {item.title && (
                            <p className="text-xs text-gray-500 mt-1 truncate">{item.title}</p>
                          )}
                        </div>
                      );
                    })}
                  </dd>
                </div>
              )}
            </CollapsibleSection>
          ) : null}

          {/* Business Details */}
          <CollapsibleSection title="Business Details" defaultOpen={true}>
            <dl className="grid grid-cols-2 gap-4">
              <FieldDisplay
                label="Business Name"
                value={submission.businessName}
                icon={<Building className="w-4 h-4 text-gray-400" />}
              />
            </dl>

            {/* Locations */}
            {submission.locations && Array.isArray(submission.locations) && submission.locations.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Locations
                </dt>
                <dd className="space-y-2">
                  {submission.locations.map((location, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-900 font-medium">{location.address || `Location ${index + 1}`}</p>
                      {location.address && <p className="text-sm text-gray-600">{location.address}</p>}
                      {(location.city || location.state) && (
                        <p className="text-sm text-gray-600">
                          {[location.city, location.state, location.zipCode].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </dd>
              </div>
            )}
          </CollapsibleSection>

          {/* Specialties & Services */}
          <CollapsibleSection title="Specialties & Services" defaultOpen={false}>
            <ArrayBadgeDisplay label="Primary Specialties" items={submission.primarySpecialties} />
            <ArrayBadgeDisplay label="All Specialties" items={submission.specialties} />
          </CollapsibleSection>

          {/* Contact & Links */}
          <CollapsibleSection title="Contact & Links" defaultOpen={false}>
            <dl className="grid grid-cols-2 gap-4">
              <LinkDisplay
                label="Website"
                value={submission.website}
                icon={<Globe className="w-4 h-4 text-gray-400" />}
              />
              <LinkDisplay
                label="Instagram"
                value={submission.instagram}
                icon={<Instagram className="w-4 h-4 text-gray-400" />}
              />
              <LinkDisplay label="Booking URL" value={submission.bookingUrl} />
              <FieldDisplay
                label="Preferred Booking Method"
                value={submission.preferredBookingMethod ? {
                  'send-text': 'Send Text',
                  'instagram': 'Instagram Profile',
                  'booking-link': 'Go to Booking Link'
                }[submission.preferredBookingMethod] || submission.preferredBookingMethod : undefined}
                icon={<Calendar className="w-4 h-4 text-gray-400" />}
              />
            </dl>
          </CollapsibleSection>

          {/* Important Info */}
          {submission.importantInfo && Array.isArray(submission.importantInfo) && submission.importantInfo.length > 0 && (
            <CollapsibleSection title="Important Info" defaultOpen={true}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-glamlink-teal mt-1 flex-shrink-0" />
                <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                  {submission.importantInfo.map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </div>
            </CollapsibleSection>
          )}

          {/* Business Hours */}
          {submission.businessHours && (Array.isArray(submission.businessHours) ? submission.businessHours.length > 0 : submission.businessHours) && (
            <CollapsibleSection title="Business Hours" defaultOpen={false}>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-1" />
                <ul className="list-none text-sm text-gray-900 space-y-1">
                  {(Array.isArray(submission.businessHours) ? submission.businessHours : [submission.businessHours]).map((hours, index) => (
                    <li key={index}>{hours}</li>
                  ))}
                </ul>
              </div>
            </CollapsibleSection>
          )}

          {/* Metadata */}
          {submission.metadata && (
            <CollapsibleSection title="Submission Metadata" defaultOpen={false}>
              <dl className="grid grid-cols-2 gap-4">
                <FieldDisplay label="Source" value={submission.metadata.source} />
                <FieldDisplay label="IP Address" value={submission.metadata.ip} />
              </dl>
              <TextareaDisplay label="User Agent" value={submission.metadata.userAgent} />
            </CollapsibleSection>
          )}

          {/* Conversion Status */}
          {submission.convertedToProfessionalId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  Converted to Professional
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Professional ID: {submission.convertedToProfessionalId}
                {submission.convertedAt && ` - ${formatSubmissionDate(submission.convertedAt)}`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {canAddProfessional && !submission.convertedToProfessionalId && (
              <button
                onClick={handleAddProfessional}
                disabled={isConverting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isConverting ? 'Adding...' : 'Add as Professional'}
              </button>
            )}
          </div>
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
