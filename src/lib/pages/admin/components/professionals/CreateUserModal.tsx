"use client";

import { useState, useCallback, useEffect } from 'react';
import { X, User, Mail, Copy, Check, AlertCircle, UserPlus } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: { uid: string; email: string; displayName: string }) => void;
  /** Optional initial value for Full Name field */
  initialDisplayName?: string;
  /** Optional initial value for Email field */
  initialEmail?: string;
}

interface CreatedUser {
  uid: string;
  email: string;
  displayName: string;
  temporaryPassword: string;
}

/**
 * CreateUserModal - Create a new user account from the admin panel
 *
 * Features:
 * - Simple form with Full Name and Email fields
 * - Creates user with temporary password via Admin API
 * - Shows temporary password with copy button
 * - Allows assigning to Profile Owner
 */
export default function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
  initialDisplayName = '',
  initialEmail = '',
}: CreateUserModalProps) {
  // Form state - initialize with props
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Update form values when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setDisplayName(initialDisplayName);
      setEmail(initialEmail);
      setError(null);
      setCreatedUser(null);
      setPasswordCopied(false);
    }
  }, [isOpen, initialDisplayName, initialEmail]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setDisplayName(initialDisplayName);
    setEmail(initialEmail);
    setError(null);
    setCreatedUser(null);
    setPasswordCopied(false);
  }, [initialDisplayName, initialEmail]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          displayName: displayName.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create user');
      }

      // Show success state with temporary password
      setCreatedUser(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, displayName]);

  /**
   * Copy temporary password to clipboard
   */
  const handleCopyPassword = useCallback(async () => {
    if (!createdUser?.temporaryPassword) return;

    try {
      await navigator.clipboard.writeText(createdUser.temporaryPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  }, [createdUser?.temporaryPassword]);

  /**
   * Assign created user to Profile Owner
   */
  const handleAssignToOwner = useCallback(() => {
    if (!createdUser) return;

    onUserCreated({
      uid: createdUser.uid,
      email: createdUser.email,
      displayName: createdUser.displayName,
    });

    handleClose();
  }, [createdUser, onUserCreated, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-glamlink-teal/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-glamlink-teal" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {createdUser ? 'User Created!' : 'Create User Account'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!createdUser ? (
            // Create User Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter full name..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Info Box */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  A temporary password will be generated. Share it with the user - they will be prompted to change it on first login.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !displayName.trim() || !email.trim()}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Success State with Temporary Password
            <div className="space-y-5">
              {/* Success Message */}
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">User account created successfully!</p>
                  <p className="text-sm text-green-700">{createdUser.email}</p>
                </div>
              </div>

              {/* Temporary Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-lg tracking-wider">
                    {createdUser.temporaryPassword}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className={`p-3 rounded-lg transition-colors ${
                      passwordCopied
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Copy password"
                  >
                    {passwordCopied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Share this password with the user. They will be required to change it when they first log in.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleAssignToOwner}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-glamlink-teal rounded-lg hover:bg-glamlink-teal/90 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Assign to Profile Owner
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
