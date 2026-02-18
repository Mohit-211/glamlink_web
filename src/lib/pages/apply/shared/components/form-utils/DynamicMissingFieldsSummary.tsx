"use client";

import { useMemo } from "react";

interface DynamicMissingFieldsSummaryProps {
  selectedForm: string;
  getMissingFields: (formType: any) => string[];
}

export default function DynamicMissingFieldsSummary({
  selectedForm,
  getMissingFields
}: DynamicMissingFieldsSummaryProps) {
  const missingFields = useMemo(() => {
    if (!selectedForm || selectedForm === 'profile-only') return [];
    return getMissingFields(selectedForm as any);
  }, [selectedForm, getMissingFields]);

  const formTypeLabels = {
    'cover': 'Cover Feature',
    'local-spotlight': 'Local Spotlight',
    'top-treatment': 'Top Treatment',
    'rising-star': 'Rising Star'
  };

  if (!selectedForm || selectedForm === 'profile-only') {
    return null;
  }

  if (missingFields.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-900 mb-1">All {formTypeLabels[selectedForm as keyof typeof formTypeLabels]} Fields Complete</h4>
            <p className="text-xs text-green-700">
              You've filled in all required fields for this application type.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">
            Missing {formTypeLabels[selectedForm as keyof typeof formTypeLabels]} Fields
          </h4>
          <div className="space-y-1 text-xs">
            {missingFields.length > 0 ? (
              <div>
                <span className="font-medium text-amber-800">Please complete:</span>
                <ul className="mt-1 space-y-1 text-amber-700 ml-4">
                  {missingFields.map((field, index) => (
                    <li key={index}>• {field}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-amber-700">All required fields are complete!</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="text-xs text-amber-600">
              <strong>Note:</strong> Fields marked with an asterisk (*) are required. Complete all missing fields to submit your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}