"use client";

import { useRecentProfessionals } from './useRecentProfessionals';
import ProfessionalCard from './ProfessionalCard';
import { RefreshIcon, UserGroupIcon } from '../shared/common/Icons';

export default function RecentProfessionals() {
  const { recentProfessionals, isLoading, fetchProfessionals } = useRecentProfessionals();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Professionals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Added in the last 7 days
          </p>
        </div>
        <button
          onClick={() => fetchProfessionals()}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh list"
        >
          <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && recentProfessionals.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-24 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recentProfessionals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserGroupIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recent professionals
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            No professionals have been added in the last 7 days. New entries will appear here automatically.
          </p>
        </div>
      )}

      {/* Professionals Grid */}
      {recentProfessionals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProfessionals.map(({ professional, relativeTime }) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              relativeTime={relativeTime}
            />
          ))}
        </div>
      )}

      {/* Count Summary */}
      {recentProfessionals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {recentProfessionals.length} professional{recentProfessionals.length !== 1 ? 's' : ''} added in the last 7 days
          </p>
        </div>
      )}
    </div>
  );
}
