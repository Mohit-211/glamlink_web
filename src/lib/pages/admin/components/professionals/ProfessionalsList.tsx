"use client";

import { Professional } from '@/lib/pages/for-professionals/types/professional';
import ProfessionalItem from './ProfessionalItem';

interface ProfessionalsListProps {
  professionals: Professional[];
  isLoading: boolean;
  hasBrand: boolean;
  onEdit: (professional: Professional) => void;
  onDelete: (professionalId: string) => Promise<void>;
}

export default function ProfessionalsList({
  professionals,
  isLoading,
  hasBrand,
  onEdit,
  onDelete
}: ProfessionalsListProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading professionals...</div>;
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">
          {hasBrand
            ? "No professionals found. Add your first professional or generate some with AI to get started."
            : "No brand associated with your account. Please contact support."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {professionals.map((professional) => (
          <ProfessionalItem
            key={professional.id}
            professional={professional}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}