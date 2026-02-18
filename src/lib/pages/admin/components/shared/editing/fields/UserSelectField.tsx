'use client';

/**
 * UserSelectField - Form field for selecting users (Firebase Auth accounts)
 *
 * Fetches users from the API and allows admins to select one.
 * Used for assigning profile ownership to professionals.
 * Display format: "Full Name (email@example.com)"
 */

import React, { memo, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useFormContext } from '../form/FormProvider';
import { BaseField } from './BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}

interface UserSelectFieldProps {
  field: FieldConfig;
  error?: string;
}

function UserSelectFieldComponent({
  field,
  error,
}: UserSelectFieldProps) {
  const { getFieldValue, updateField } = useFormContext();
  const value = getFieldValue(field.name) as string | undefined;

  // State for users list and search
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Debounce timer ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch users with search query (debounced)
  const fetchUsers = useCallback(async (query: string) => {
    if (!query.trim() && !value) {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);
      const searchParam = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : '';
      const response = await fetch(`/api/admin/users${searchParam}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const usersList = Array.isArray(data) ? data : data.data || [];
      setUsers(usersList);
      setFetchError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setFetchError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [value]);

  // Fetch selected user info on mount if value exists
  useEffect(() => {
    if (value && !selectedUser) {
      // Fetch the specific user to display their info
      const fetchSelectedUser = async () => {
        try {
          const response = await fetch(`/api/admin/users?uid=${encodeURIComponent(value)}`, {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            const usersList = Array.isArray(data) ? data : data.data || [];
            const user = usersList.find((u: User) => u.uid === value);
            if (user) {
              setSelectedUser(user);
            }
          }
        } catch (err) {
          console.error('Error fetching selected user:', err);
        }
      };

      fetchSelectedUser();
    }
  }, [value, selectedUser]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (isDropdownOpen || searchQuery.trim()) {
        fetchUsers(searchQuery);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, isDropdownOpen, fetchUsers]);

  // Format user display name
  const formatUserDisplay = (user: User): string => {
    const name = user.displayName || 'No Name';
    const email = user.email || 'No Email';
    return `${name} (${email})`;
  };

  // Filter users based on search query (client-side filtering of already-fetched results)
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleSelect = (user: User) => {
    updateField(field.name, user.uid);
    setSelectedUser(user);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    updateField(field.name, '');
    setSelectedUser(null);
    setSearchQuery('');
  };

  return (
    <BaseField field={field} error={error}>
      <div className="relative">
        {/* Selected User Display */}
        {selectedUser && !isDropdownOpen ? (
          <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-glamlink-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="text-glamlink-teal font-medium">
                {(selectedUser.displayName || selectedUser.email || '?').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {selectedUser.displayName || 'No Name'}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {selectedUser.email || 'No Email'}
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
              placeholder={field.placeholder || 'Search by name or email...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal"
            />

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {fetchError ? (
                  <div className="p-3 text-sm text-red-500">{fetchError}</div>
                ) : isLoading ? (
                  <div className="p-3 text-sm text-gray-500">Loading...</div>
                ) : !searchQuery.trim() ? (
                  <div className="p-3 text-sm text-gray-500">
                    Type to search users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No users found
                  </div>
                ) : (
                  <>
                    {filteredUsers.map((user) => (
                      <button
                        key={user.uid}
                        type="button"
                        onClick={() => handleSelect(user)}
                        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          value === user.uid ? 'bg-glamlink-teal/10' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-glamlink-teal/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-glamlink-teal font-medium">
                            {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {user.displayName || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user.email || 'No Email'}
                          </div>
                        </div>
                        {value === user.uid && (
                          <span className="text-glamlink-teal">✓</span>
                        )}
                      </button>
                    ))}
                  </>
                )}

                {/* Close button */}
                {selectedUser && (
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
export const UserSelectField = memo(
  UserSelectFieldComponent,
  (prev, next) => {
    return prev.field === next.field && prev.error === next.error;
  }
);

export default UserSelectField;
