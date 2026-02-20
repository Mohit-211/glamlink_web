"use client";

import Link from 'next/link';
import { Professional } from '@/lib/pages/for-professionals/types/professional';
import { UserGroupIcon } from '../shared/common/Icons';

interface ProfessionalCardProps {
  professional: Professional;
  relativeTime: string;
}

export default function ProfessionalCard({ professional, relativeTime }: ProfessionalCardProps) {
  const avatarUrl = professional.profileImage || professional.image || professional.portraitImage;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={professional.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {professional.name}
          </h3>

          {/* Title and Specialty */}
          <p className="text-sm text-gray-600 truncate">
            {professional.title}
            {professional.specialty && (
              <span className="text-gray-400"> &bull; {professional.specialty}</span>
            )}
          </p>

          {/* Relative Time Badge */}
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Added {relativeTime}
            </span>
          </div>
        </div>

        {/* Optional: Link to edit */}
        <div className="flex-shrink-0">
          <Link
            href={`/admin/professionals?edit=${professional.id}`}
            className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
