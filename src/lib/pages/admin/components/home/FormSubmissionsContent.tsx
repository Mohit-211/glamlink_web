"use client";

import { formatDistanceToNow } from 'date-fns';
import { useFormSubmissions, FormSubmission } from './useFormSubmissions';
import { LoadingSpinner } from '@/lib/components/ui';

function SubmissionCard({ submission }: { submission: FormSubmission }) {
  const relativeTime = formatDistanceToNow(submission.submittedAt, { addSuffix: true });

  const typeLabel = submission.type === 'digital-card' ? 'Digital Card' : 'Get Featured';
  const typeBgColor = submission.type === 'digital-card'
    ? 'bg-teal-100 text-teal-800'
    : 'bg-purple-100 text-purple-800';

  const statusBgColor = submission.status === 'approved'
    ? 'bg-green-100 text-green-800'
    : submission.status === 'rejected'
    ? 'bg-red-100 text-red-800'
    : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{submission.name}</h4>
          <p className="text-sm text-gray-500 truncate">{submission.email}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${typeBgColor}`}>
          {typeLabel}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBgColor}`}>
          {submission.status.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-400">{relativeTime}</span>
      </div>
    </div>
  );
}

function SubmissionsList({ submissions, title, emptyMessage }: {
  submissions: FormSubmission[];
  title: string;
  emptyMessage: string;
}) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}

export default function FormSubmissionsContent() {
  const {
    digitalCardSubmissions,
    getFeaturedSubmissions,
    counts,
    isLoading,
    error,
    refetch
  } = useFormSubmissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-gray-600">Loading submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Digital Card</p>
              <p className="text-3xl font-bold text-teal-600">{counts.digitalCard}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Get Featured</p>
              <p className="text-3xl font-bold text-purple-600">{counts.getFeatured}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{counts.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Last 7 days</p>
        </div>
      </div>

      {/* Submissions Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Card Submissions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
            Digital Card Applications
            {counts.digitalCard > 0 && (
              <span className="ml-auto text-sm font-normal text-gray-500">
                {counts.digitalCard} submission{counts.digitalCard !== 1 ? 's' : ''}
              </span>
            )}
          </h3>
          <SubmissionsList
            submissions={digitalCardSubmissions}
            title="Digital Card"
            emptyMessage="No digital card applications in the last 7 days"
          />
        </div>

        {/* Get Featured Submissions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            Get Featured Applications
            {counts.getFeatured > 0 && (
              <span className="ml-auto text-sm font-normal text-gray-500">
                {counts.getFeatured} submission{counts.getFeatured !== 1 ? 's' : ''}
              </span>
            )}
          </h3>
          <SubmissionsList
            submissions={getFeaturedSubmissions}
            title="Get Featured"
            emptyMessage="No featured applications in the last 7 days"
          />
        </div>
      </div>
    </div>
  );
}
