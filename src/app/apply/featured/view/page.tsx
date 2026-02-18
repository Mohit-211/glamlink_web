"use client";

import { useState, useEffect } from "react";
import { GetFeaturedSubmission } from "@/lib/pages/apply/featured/types";
import { Alert, LoadingSpinner, formatDate } from "@/lib/components/ui";
import { FormType, getFormTypeInfo, getFormTypeLabel, getFormTypeColor, FORM_TYPES } from "@/lib/pages/apply/featured/components/forms";
import CollapsibleSection from "@/lib/pages/apply/featured/components/admin/CollapsibleSection";
import ProfileSection from "@/lib/pages/apply/featured/components/admin/ProfileSection";
import GlamlinkIntegrationSection from "@/lib/pages/apply/featured/components/admin/GlamlinkIntegrationSection";
import ContentPromotionSection from "@/lib/pages/apply/featured/components/admin/ContentPromotionSection";
import FormSpecificSection from "@/lib/pages/apply/featured/components/admin/FormSpecificSection";

type StatusFilterType = 'all' | 'approved' | 'rejected';
type FormTypeFilter = FormType | 'all';

export default function ApplyFeaturedViewPage() {
  const [submissions, setSubmissions] = useState<GetFeaturedSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<GetFeaturedSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [formTypeFilter, setFormTypeFilter] = useState<FormTypeFilter>('all');
  const [dateFilter, setDateFilter] = useState<string>(''); // ISO date string
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Track which submission is being updated

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/get-featured/submissions', {
        credentials: 'include'
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch submissions';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON (e.g., HTML error page), use default message
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
      setSubmissions(result.submissions || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Failed to fetch submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubmissionReviewStatus = async (
    submissionId: string,
    reviewed: boolean,
    status?: 'pending_review' | 'approved' | 'rejected'
  ) => {
    try {
      setIsUpdating(submissionId);

      const response = await fetch(`/api/get-featured/submissions/${submissionId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          reviewed,
          ...(status && { status })
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update submission';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON (e.g., HTML error page), use default message
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }

      // Update local state
      setSubmissions(prev => prev.map(submission =>
        submission.id === submissionId
          ? {
              ...submission,
              reviewed,
              ...(status && { status })
            }
          : submission
      ));

      // Update selected submission if it's the one being updated
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(prev => prev ? {
          ...prev,
          reviewed,
          ...(status && { status })
        } : null);
      }

      console.log('✅ Submission updated successfully:', result);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Failed to update submission:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const getFilteredSubmissions = () => {
    let filtered = submissions;

    // Apply status filter
    switch (statusFilter) {
      case 'approved':
        filtered = filtered.filter(submission => submission.status === 'approved');
        break;
      case 'rejected':
        filtered = filtered.filter(submission => submission.status === 'rejected');
        break;
      // 'all' shows all submissions regardless of status
    }

    // Apply form type filter
    if (formTypeFilter !== 'all') {
      filtered = filtered.filter(submission => submission.formType === formTypeFilter);
    }

    // Apply date filter (only submissions created after the selected date)
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(submission => {
        const submissionDate = new Date(submission.submittedAt);
        return submissionDate > filterDate;
      });
    }

    return filtered;
  };

  const filteredSubmissions = getFilteredSubmissions();

  const clearDateFilter = () => {
    setDateFilter('');
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setFormTypeFilter('all');
    setDateFilter('');
  };

  const formatFilterDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getListTitle = () => {
    const statusText = statusFilter === 'approved' ? 'Approved' :
                      statusFilter === 'rejected' ? 'Rejected' : '';

    const formTypeText = formTypeFilter !== 'all' ? getFormTypeLabel(formTypeFilter) : '';
    const dateText = dateFilter ? ` after ${formatFilterDate(dateFilter)}` : '';

    const filters = [statusText, formTypeText, dateText].filter(Boolean);
    const filterDescription = filters.length > 0 ? ` - ${filters.join(' - ')}` : '';

    if (filters.length > 0) {
      return `Submissions${filterDescription} (${filteredSubmissions.length})`;
    } else {
      return `All Submissions (${filteredSubmissions.length})`;
    }
  };

  const getEmptyStateTitle = () => {
    if (statusFilter === 'approved') return 'No approved submissions';
    if (statusFilter === 'rejected') return 'No rejected submissions';
    if (dateFilter) return `No submissions after ${formatFilterDate(dateFilter)}`;
    return 'No submissions yet';
  };

  const getEmptyStateMessage = () => {
    if (statusFilter === 'approved') return 'No submissions have been approved yet.';
    if (statusFilter === 'rejected') return 'No submissions have been rejected yet.';
    if (dateFilter) return `No submissions were created after ${formatFilterDate(dateFilter)}.`;
    return 'Applications will appear here when professionals apply to get featured.';
  };

  const getStatusBadge = (status: string, reviewed: boolean) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1";

    if (status === 'approved') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === 'rejected') {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (reviewed) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: string, reviewed: boolean) => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    if (reviewed) return 'In Review';
    return 'Pending Review';
  };

  const getStatusIcon = (status: string, reviewed: boolean) => {
    if (status === 'approved') {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else if (status === 'rejected') {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    } else if (reviewed) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const renderMedia = (file: any, index: number) => {
    if (!file) return null;

    // Helper function to get media source
    const getMediaSrc = (file: any): string => {
      // Prioritize Firebase Storage URL over base64 data
      if (file.url) {
        return file.url;
      } else if (file.data) {
        return `data:${file.type};base64,${file.data}`;
      }
      return ''; // No media data available
    };

    // Check if file is a video
    const isVideo = file.type && file.type.startsWith('video/');
    const mediaSrc = getMediaSrc(file);
    const hasMedia = !!(file.data || file.url);

    return (
      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
        {hasMedia ? (
          <div className="relative">
            {isVideo ? (
              <>
                <video
                  src={mediaSrc}
                  className="w-full h-48 object-cover"
                  controls
                  onError={(e) => {
                    console.warn('Failed to load video:', file.name);
                    // Hide broken video
                    e.currentTarget.style.display = 'none';
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                {/* Video indicator */}
                <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </>
            ) : (
              <img
                src={mediaSrc}
                alt={file.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.warn('Failed to load image:', file.name);
                  // Hide broken image
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        ) : (
          // Fallback for media with no data
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">Media not available</p>
            </div>
          </div>
        )}
        <div className="p-2 bg-gray-50">
          <p className="text-xs text-gray-600 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {file.size ? (
              file.size < 1024 * 1024
                ? `${(file.size / 1024).toFixed(1)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            ) : (
              'Unknown size'
            )}
          </p>
        </div>
      </div>
    );
  };

  // Keep the old renderImage function for backward compatibility
  const renderImage = renderMedia;

  // Dynamic field rendering based on form type
  const renderFormSpecificFields = (submission: GetFeaturedSubmission) => {
    const formType = submission.formType;

    switch (formType) {
      case 'cover':
        return (
          <>
            {renderFieldIfHasValue(submission.bio, 'Bio', <p className="text-gray-700 whitespace-pre-wrap">{submission.bio}</p>)}
            {renderArrayFieldIfHasValue(submission.achievements, 'Achievements',
              <ul className="space-y-2">
                {submission.achievements?.filter((a: any) => a && a.trim()).map((achievement: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-glamlink-teal mt-1 mr-2">"</span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
            {renderFieldIfHasValue(submission.favoriteQuote, 'Favorite Quote',
              <blockquote className="border-l-4 border-glamlink-teal pl-4 italic text-gray-700">
                "{submission.favoriteQuote}"
              </blockquote>
            )}
            {renderFieldIfHasValue(submission.professionalProduct, 'Professional Product', <p className="text-gray-700">{submission.professionalProduct}</p>)}
            {renderFieldIfHasValue(submission.confidenceStory, 'Confidence Story', <p className="text-gray-700 whitespace-pre-wrap">{submission.confidenceStory}</p>)}
            {renderArrayFieldIfHasValue(submission.excitementFeatures, 'Most Excited About',
              <div className="flex flex-wrap gap-2">
                {submission.excitementFeatures?.map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-glamlink-teal/10 text-glamlink-teal rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            )}
            {renderArrayFieldIfHasValue(submission.painPoints, 'Pain Points',
              <div className="flex flex-wrap gap-2">
                {submission.painPoints?.map((pain, index) => (
                  <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                    {pain}
                  </span>
                ))}
              </div>
            )}
            {renderBookingInfo(submission)}
            {renderEcommerceInfo(submission)}
            {renderFieldIfHasValue(submission.contentDays, 'Available for Content', <p className="text-gray-700">{submission.contentDays}</p>)}
            {renderFieldIfHasValue(submission.giveaway, 'Giveaway Contribution', <p className="text-gray-700">{submission.giveaway}</p>)}
            {renderFieldIfHasValue(submission.specialOffers, 'Special Offers for Glamlink Users', <p className="text-gray-700 whitespace-pre-wrap">{submission.specialOffers}</p>)}
          </>
        );

      case 'local-spotlight':
        return (
          <>
            {renderFieldIfHasValue(submission.city, 'City', <p className="text-gray-700">{submission.city}</p>)}
            {renderFieldIfHasValue(submission.website, 'Website',
              <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-glamlink-teal hover:underline">
                {submission.website}
              </a>
            )}
            {renderFieldIfHasValue(submission.instagramHandle, 'Instagram Handle', <p className="text-gray-700">{submission.instagramHandle}</p>)}
            {renderFieldIfHasValue(submission.specialties, 'Specialties', <p className="text-gray-700">{submission.specialties}</p>)}
            {renderFieldIfHasValue(submission.workExperience, 'Work Experience', <p className="text-gray-700 whitespace-pre-wrap">{submission.workExperience}</p>)}
            {renderFieldIfHasValue(submission.certifications, 'Certifications', <p className="text-gray-700">{submission.certifications}</p>)}
            {renderFieldIfHasValue(submission.certificationDetails, 'Certification Details', <p className="text-gray-700">{submission.certificationDetails}</p>)}
            {renderFieldIfHasValue(submission.socialMedia, 'Social Media', <p className="text-gray-700">{submission.socialMedia}</p>)}
            {renderFieldIfHasValue(submission.availability, 'Availability', <p className="text-gray-700">{submission.availability}</p>)}
            {renderFieldIfHasValue(submission.featuredInterest, 'Featured Interest', <p className="text-gray-700">{submission.featuredInterest}</p>)}
            {renderFieldIfHasValue(submission.whyLocalSpotlight, 'Why Local Spotlight', <p className="text-gray-700 whitespace-pre-wrap">{submission.whyLocalSpotlight}</p>)}
            {renderFieldIfHasValue(submission.hearAboutUs, 'How did you hear about us?', <p className="text-gray-700">{submission.hearAboutUs}</p>)}
          </>
        );

      case 'top-treatment':
        return (
          <>
            {renderFieldIfHasValue(submission.businessName, 'Business Name', <p className="text-gray-700">{submission.businessName}</p>)}
            {renderFieldIfHasValue(submission.treatmentName, 'Treatment Name', <p className="text-gray-700">{submission.treatmentName}</p>)}
            {renderFieldIfHasValue(submission.treatmentCategory, 'Treatment Category', <p className="text-gray-700">{submission.treatmentCategory}</p>)}
            {renderFieldIfHasValue(submission.treatmentDescription, 'Treatment Description', <p className="text-gray-700 whitespace-pre-wrap">{submission.treatmentDescription}</p>)}
            {renderFieldIfHasValue(submission.treatmentBenefits, 'Treatment Benefits', <p className="text-gray-700">{submission.treatmentBenefits}</p>)}
            {renderFieldIfHasValue(submission.treatmentDuration, 'Treatment Duration', <p className="text-gray-700">{submission.treatmentDuration}</p>)}
            {renderFieldIfHasValue(submission.treatmentPrice, 'Treatment Price', <p className="text-gray-700">{submission.treatmentPrice}</p>)}
            {renderFieldIfHasValue(submission.treatmentExperience, 'Treatment Experience', <p className="text-gray-700 whitespace-pre-wrap">{submission.treatmentExperience}</p>)}
            {renderFieldIfHasValue(submission.treatmentProcess, 'Treatment Process', <p className="text-gray-700 whitespace-pre-wrap">{submission.treatmentProcess}</p>)}
            {renderFieldIfHasValue(submission.clientResults, 'Client Results', <p className="text-gray-700 whitespace-pre-wrap">{submission.clientResults}</p>)}
            {renderFieldIfHasValue(submission.idealCandidates, 'Ideal Candidates', <p className="text-gray-700">{submission.idealCandidates}</p>)}
            {renderFieldIfHasValue(submission.aftercareInstructions, 'Aftercare Instructions', <p className="text-gray-700 whitespace-pre-wrap">{submission.aftercareInstructions}</p>)}
            {renderFieldIfHasValue(submission.trainingCertification, 'Training Certification', <p className="text-gray-700">{submission.trainingCertification}</p>)}
            {renderFieldIfHasValue(submission.specialEquipment, 'Special Equipment', <p className="text-gray-700">{submission.specialEquipment}</p>)}
            {renderFieldIfHasValue(submission.equipmentDetails, 'Equipment Details', <p className="text-gray-700">{submission.equipmentDetails}</p>)}
            {renderFieldIfHasValue(submission.consultationOffer, 'Consultation Offer', <p className="text-gray-700">{submission.consultationOffer}</p>)}
            {renderFieldIfHasValue(submission.whyTopTreatment, 'Why Top Treatment', <p className="text-gray-700 whitespace-pre-wrap">{submission.whyTopTreatment}</p>)}
          </>
        );

      case 'rising-star':
        return (
          <>
            {renderFieldIfHasValue(submission.businessName, 'Business Name', <p className="text-gray-700">{submission.businessName}</p>)}
            {renderFieldIfHasValue(submission.location, 'Location', <p className="text-gray-700">{submission.location}</p>)}
            {renderFieldIfHasValue(submission.instagram, 'Instagram', <p className="text-gray-700">{submission.instagram}</p>)}
            {renderFieldIfHasValue(submission.careerStartTime, 'Career Started', <p className="text-gray-700">{submission.careerStartTime}</p>)}
            {renderFieldIfHasValue(submission.backgroundStory, 'Background Story', <p className="text-gray-700 whitespace-pre-wrap">{submission.backgroundStory}</p>)}
            {renderFieldIfHasValue(submission.careerHighlights, 'Career Highlights', <p className="text-gray-700 whitespace-pre-wrap">{submission.careerHighlights}</p>)}
            {renderFieldIfHasValue(submission.uniqueApproach, 'Unique Approach', <p className="text-gray-700 whitespace-pre-wrap">{submission.uniqueApproach}</p>)}
            {renderArrayFieldIfHasValue(submission.achievementsRisingStar || [], 'Achievements',
              <ul className="space-y-2">
                {submission.achievementsRisingStar?.filter((a: any) => a && a.trim()).map((achievement: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-glamlink-teal mt-1 mr-2">"</span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
            {renderFieldIfHasValue(submission.clientTestimonials, 'Client Testimonials', <p className="text-gray-700 whitespace-pre-wrap">{submission.clientTestimonials}</p>)}
            {renderFieldIfHasValue(submission.industryChallenges, 'Industry Challenges', <p className="text-gray-700 whitespace-pre-wrap">{submission.industryChallenges}</p>)}
            {renderFieldIfHasValue(submission.innovations, 'Innovations', <p className="text-gray-700 whitespace-pre-wrap">{submission.innovations}</p>)}
            {renderFieldIfHasValue(submission.futureGoals, 'Future Goals', <p className="text-gray-700 whitespace-pre-wrap">{submission.futureGoals}</p>)}
            {renderFieldIfHasValue(submission.industryInspiration, 'Industry Inspiration', <p className="text-gray-700 whitespace-pre-wrap">{submission.industryInspiration}</p>)}
            {renderFieldIfHasValue(submission.communityInvolvement, 'Community Involvement', <p className="text-gray-700 whitespace-pre-wrap">{submission.communityInvolvement}</p>)}
            {renderFieldIfHasValue(submission.communityDetails, 'Community Details', <p className="text-gray-700 whitespace-pre-wrap">{submission.communityDetails}</p>)}
            {renderFieldIfHasValue(submission.socialMediaPresence, 'Social Media Presence', <p className="text-gray-700">{submission.socialMediaPresence}</p>)}
            {renderFieldIfHasValue(submission.awardsRecognition, 'Awards & Recognition', <p className="text-gray-700 whitespace-pre-wrap">{submission.awardsRecognition}</p>)}
            {renderFieldIfHasValue(submission.mediaFeatures, 'Media Features', <p className="text-gray-700 whitespace-pre-wrap">{submission.mediaFeatures}</p>)}
            {renderFieldIfHasValue(submission.mentorshipDetails, 'Mentorship Details', <p className="text-gray-700 whitespace-pre-wrap">{submission.mentorshipDetails}</p>)}
            {renderFieldIfHasValue(submission.advice, 'Advice for Others', <p className="text-gray-700 whitespace-pre-wrap">{submission.advice}</p>)}
            {renderFieldIfHasValue(submission.contactPreference, 'Contact Preference', <p className="text-gray-700">{submission.contactPreference}</p>)}
            {renderFieldIfHasValue(submission.additionalInfo, 'Additional Information', <p className="text-gray-700 whitespace-pre-wrap">{submission.additionalInfo}</p>)}
          </>
        );

      default:
      case 'profile-only':
        return null;
    }
  };

  // Helper functions for rendering fields
  const renderFieldIfHasValue = (value: any, label: string, content: React.ReactNode) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) return null;
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{label}</h3>
        {content}
      </div>
    );
  };

  const renderArrayFieldIfHasValue = (value: any[], label: string, content: React.ReactNode) => {
    if (!value || value.length === 0 || !value.some((v: any) => v && typeof v === 'string' && v.trim())) return null;
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{label}</h3>
        {content}
      </div>
    );
  };

  const renderBookingInfo = (submission: GetFeaturedSubmission) => {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Preference</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Method:</span> {submission.bookingPreference === 'in-app' ? 'In-app booking' : 'External booking'}
          </p>
          {submission.bookingLink && (
            <p className="text-gray-700">
              <span className="font-medium">Booking Link:</span>{' '}
              <a href={submission.bookingLink} target="_blank" rel="noopener noreferrer" className="text-glamlink-teal hover:underline">
                {submission.bookingLink}
              </a>
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderEcommerceInfo = (submission: GetFeaturedSubmission) => {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">E-commerce Interest</h3>
        <p className="text-gray-700">
          {submission.ecommerceInterest === 'yes'
            ? 'Interested in selling products through Glamlink'
            : 'Interested in e-commerce, but later'}
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Get Featured Submissions
                </h1>
                <p className="text-gray-600">
                  Review and manage applications from beauty professionals
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
                    className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                  >
                    <option value="all">All Submissions</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Form Type Filter */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="form-type-filter" className="text-sm font-medium text-gray-700">
                    Type:
                  </label>
                  <select
                    id="form-type-filter"
                    value={formTypeFilter}
                    onChange={(e) => setFormTypeFilter(e.target.value as FormTypeFilter)}
                    className="block w-44 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                  >
                    <option value="all">All Types</option>
                    {FORM_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
                    After:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date-filter"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="block w-36 px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                    />
                    {dateFilter && (
                      <button
                        onClick={clearDateFilter}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        title="Clear date filter"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {!dateFilter && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error" message={error} />
            </div>
          )}

          {/* Submissions Grid */}
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getEmptyStateTitle()}
              </h3>
              <p className="text-gray-600">
                {getEmptyStateMessage()}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submissions List */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {getListTitle()}
                </h2>

                {/* Active Filters Summary */}
                {(statusFilter !== 'all' || formTypeFilter !== 'all' || dateFilter) && (
                  <div className="mb-4 p-3 bg-glamlink-teal/5 border border-glamlink-teal/20 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-glamlink-teal-dark">
                        <span className="font-medium">Active filters:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {statusFilter !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-glamlink-teal/10 text-glamlink-teal">
                              Status: {statusFilter === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}
                          {formTypeFilter !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-glamlink-teal/10 text-glamlink-teal">
                              Type: {getFormTypeLabel(formTypeFilter)}
                            </span>
                          )}
                          {dateFilter && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-glamlink-teal/10 text-glamlink-teal">
                              After: {formatFilterDate(dateFilter)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-glamlink-teal hover:text-glamlink-teal-dark font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedSubmission?.id === submission.id
                        ? 'border-glamlink-teal ring-2 ring-glamlink-teal/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {submission.fullName}
                        </h3>
                        {submission.formType && (
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getFormTypeColor(submission.formType)}`}>
                              {getFormTypeLabel(submission.formType)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className={getStatusBadge(submission.status, submission.reviewed)}>
                        {getStatusIcon(submission.status, submission.reviewed)}
                        {getStatusText(submission.status, submission.reviewed)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{submission.email}</p>
                    <p className="text-xs text-gray-500">
                      Submitted {formatDate(submission.submittedAt)}
                    </p>
                    {submission.bio && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {submission.bio.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submission Details */}
              <div className="lg:col-span-2">
                {selectedSubmission ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Details Header */}
                    <div className="border-b border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                              {selectedSubmission.fullName}
                            </h2>
                            {selectedSubmission.formType && (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getFormTypeColor(selectedSubmission.formType)}`}>
                                {getFormTypeLabel(selectedSubmission.formType)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{selectedSubmission.email}</p>
                          <p className="text-sm text-gray-500">{selectedSubmission.phone}</p>
                        </div>
                        <span className={getStatusBadge(selectedSubmission.status, selectedSubmission.reviewed)}>
                          {getStatusIcon(selectedSubmission.status, selectedSubmission.reviewed)}
                          {getStatusText(selectedSubmission.status, selectedSubmission.reviewed)}
                        </span>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Submitted: {formatDate(selectedSubmission.submittedAt)}</p>
                        {selectedSubmission.metadata?.ip && (
                          <p>IP Address: {selectedSubmission.metadata.ip}</p>
                        )}
                        {selectedSubmission.metadata?.userAgent && (
                          <p className="text-xs truncate">Browser: {selectedSubmission.metadata.userAgent}</p>
                        )}
                      </div>

                      {/* Review Controls */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateSubmissionReviewStatus(
                              selectedSubmission.id,
                              !selectedSubmission.reviewed
                            )}
                            disabled={isUpdating === selectedSubmission.id}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                              selectedSubmission.reviewed
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isUpdating === selectedSubmission.id ? (
                              <div className="flex items-center">
                                <LoadingSpinner />
                                <span className="ml-2">
                                  {selectedSubmission.reviewed ? 'Updating...' : 'Marking...'}
                                </span>
                              </div>
                            ) : (
                              selectedSubmission.reviewed ? 'Mark as Not Reviewed' : 'Mark as Reviewed'
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <label htmlFor={`status-${selectedSubmission.id}`} className="text-sm font-medium text-gray-700">
                            Status:
                          </label>
                          <select
                            id={`status-${selectedSubmission.id}`}
                            value={selectedSubmission.status}
                            onChange={(e) => updateSubmissionReviewStatus(
                              selectedSubmission.id,
                              selectedSubmission.reviewed,
                              e.target.value as 'pending_review' | 'approved' | 'rejected'
                            )}
                            disabled={isUpdating === selectedSubmission.id}
                            className="block px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal disabled:opacity-50"
                          >
                            <option value="pending_review">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {selectedSubmission.reviewed && (
                          <span className="text-xs text-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Reviewed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details Content */}
                    <div className="p-6 space-y-6">
                      {/* Profile Information Section */}
                      <CollapsibleSection
                        title="Profile Information"
                        icon={
                          <div className="w-5 h-5 text-glamlink-teal">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        }
                        defaultOpen={true}
                      >
                        <ProfileSection submission={selectedSubmission} />
                      </CollapsibleSection>

                      {/* Glamlink Integration Section */}
                      <CollapsibleSection
                        title="Glamlink Integration"
                        icon={
                          <div className="w-5 h-5 text-glamlink-teal">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                        }
                        defaultOpen={true}
                      >
                        <GlamlinkIntegrationSection submission={selectedSubmission} />
                      </CollapsibleSection>

                      {/* Content Promotion Section */}
                      <CollapsibleSection
                        title="Content Promotion"
                        icon={
                          <div className="w-5 h-5 text-glamlink-teal">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        }
                        defaultOpen={true}
                      >
                        <ContentPromotionSection submission={selectedSubmission} />
                      </CollapsibleSection>

                      {/* Form-Specific Section */}
                      {selectedSubmission.formType && selectedSubmission.formType !== 'profile-only' && (
                        <CollapsibleSection
                          title={`${getFormTypeLabel(selectedSubmission.formType)} Details`}
                          icon={
                            <div className="w-5 h-5 text-glamlink-teal">
                              <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                          }
                          defaultOpen={true}
                        >
                          <FormSpecificSection submission={selectedSubmission} />
                        </CollapsibleSection>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a submission to view</h3>
                    <p className="text-gray-600">Choose a submission from the list to see all details.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
