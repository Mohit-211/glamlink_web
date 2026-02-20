"use client";

import { Professional } from '@/lib/pages/for-professionals/types/professional';
import { StarIcon } from '@/lib/pages/admin/components/shared/common';
import { getCertificationColor } from './useProfessionals';

interface ProfessionalItemProps {
  professional: Professional;
  onEdit: (professional: Professional) => void;
  onDelete: (professionalId: string) => Promise<void>;
}

export default function ProfessionalItem({ professional, onEdit, onDelete }: ProfessionalItemProps) {

  return (
    <li>
      <div className="px-4 py-4 flex items-center sm:px-6">
        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            {professional.profileImage ? (
              <img
                className="h-12 w-12 rounded-lg object-cover"
                src={professional.profileImage}
                alt={professional.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-semibold text-lg">
                  {professional.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                <span>{professional.name}</span>
                {professional.isFounder && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-glamlink-teal text-white">
                    Founder
                  </span>
                )}
                {professional.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Featured
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <span>{professional.title}</span>
                <span className="mx-1">·</span>
                <span>{professional.specialty}</span>
                <span className="mx-1">·</span>
                <span>{professional.location}</span>
              </div>
              {professional.instagram && (
                <div className="text-sm text-gray-400">
                  @{professional.instagram.replace('@', '')}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCertificationColor(professional.certificationLevel)}`}>
                {professional.certificationLevel}
              </span>
              <span>{professional.yearsExperience} years</span>
              {professional.rating && (
                <span className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1">{professional.rating.toFixed(1)}</span>
                </span>
              )}
              {(professional.reviewCount || 0) > 0 && (
                <span>({professional.reviewCount || 0})</span>
              )}
            </div>
          </div>
        </div>
        <div className="ml-5 flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onEdit(professional)}
            className="text-glamlink-teal hover:text-glamlink-teal-dark font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(professional.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}