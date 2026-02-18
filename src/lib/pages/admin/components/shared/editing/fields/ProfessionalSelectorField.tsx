'use client';

/**
 * ProfessionalSelectorField - Form field for selecting professionals from the database
 *
 * Fetches professionals from the API and allows users to select one.
 * Used in content block configuration for the EmbeddableBusinessCard component.
 */

import React, { memo, useState, useEffect, useMemo } from 'react';
import { useFormContext } from '../form/FormProvider';
import { BaseField } from './BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface Professional {
  id: string;
  name: string;
  title?: string;
  specialty?: string;
  location?: string;
  profileImage?: string;
}

interface ProfessionalSelectorFieldProps {
  field: FieldConfig;
  error?: string;
}

function ProfessionalSelectorFieldComponent({
  field,
  error,
}: ProfessionalSelectorFieldProps) {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name) as string | undefined;

  // State for professionals list
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch professionals on mount
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/professionals', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch professionals');
        }

        const data = await response.json();
        // Handle both array response and { data: array } response
        const prosList = Array.isArray(data) ? data : data.data || [];
        setProfessionals(prosList);
        setFetchError(null);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setFetchError('Failed to load professionals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Filter professionals based on search query
  const filteredProfessionals = useMemo(() => {
    if (!searchQuery.trim()) return professionals;

    const query = searchQuery.toLowerCase();
    return professionals.filter(
      (pro) =>
        pro.name?.toLowerCase().includes(query) ||
        pro.specialty?.toLowerCase().includes(query) ||
        pro.location?.toLowerCase().includes(query) ||
        pro.title?.toLowerCase().includes(query)
    );
  }, [professionals, searchQuery]);

  // Get selected professional for display
  const selectedProfessional = useMemo(() => {
    if (!value) return null;
    return professionals.find((pro) => pro.id === value);
  }, [value, professionals]);

  const handleSelect = (professionalId: string) => {
    updateField(field.name, professionalId);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    updateField(field.name, '');
    setSearchQuery('');
  };

  return (
    <BaseField field={field} error={error}>
      <div className="relative">
        {/* Selected Professional Display */}
        {selectedProfessional && !isDropdownOpen ? (
          <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
            {selectedProfessional.profileImage && (
              <img
                src={selectedProfessional.profileImage}
                alt={selectedProfessional.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {selectedProfessional.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {selectedProfessional.specialty}
                {selectedProfessional.location && ` • ${selectedProfessional.location}`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(true)}
                className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={isLoading ? 'Loading professionals...' : 'Search professionals...'}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal disabled:bg-gray-100"
            />

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {fetchError ? (
                  <div className="p-3 text-sm text-red-500">{fetchError}</div>
                ) : isLoading ? (
                  <div className="p-3 text-sm text-gray-500">Loading...</div>
                ) : filteredProfessionals.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    {searchQuery ? 'No professionals found' : 'No professionals available'}
                  </div>
                ) : (
                  <>
                    {filteredProfessionals.map((pro) => (
                      <button
                        key={pro.id}
                        type="button"
                        onClick={() => handleSelect(pro.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          value === pro.id ? 'bg-glamlink-teal/10' : ''
                        }`}
                      >
                        {pro.profileImage ? (
                          <img
                            src={pro.profileImage}
                            alt={pro.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 text-sm">
                              {pro.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {pro.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {pro.specialty}
                            {pro.location && ` • ${pro.location}`}
                          </div>
                        </div>
                        {value === pro.id && (
                          <span className="text-glamlink-teal">✓</span>
                        )}
                      </button>
                    ))}
                  </>
                )}

                {/* Close button */}
                {selectedProfessional && (
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full p-2 text-sm text-gray-500 hover:bg-gray-50 border-t"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Click outside to close */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </BaseField>
  );
}

// Memoize to prevent unnecessary re-renders
export const ProfessionalSelectorField = memo(
  ProfessionalSelectorFieldComponent,
  (prev, next) => {
    return prev.field === next.field && prev.error === next.error;
  }
);

export default ProfessionalSelectorField;
