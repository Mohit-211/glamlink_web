"use client";

/**
 * ProfileEditSection - Editable profile form with view and edit modes
 */

import { User, AlertCircle, Check, Edit2 } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import type { UseProfileEditReturn } from "../types";

interface ProfileEditSectionProps extends UseProfileEditReturn {}

export default function ProfileEditSection({
  isEditing,
  setIsEditing,
  profileForm,
  isLoading,
  isSaving,
  error,
  success,
  handleInputChange,
  handlePhotoChange,
  handleSubmit,
  handleCancel,
}: ProfileEditSectionProps) {
  const bioCharCount = profileForm.bio?.length || 0;
  const maxBioLength = 200;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            Profile
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" />
          Profile
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-glamlink-teal hover:text-glamlink-teal/80 border border-glamlink-teal hover:border-glamlink-teal/80 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Success Message */}
        {success && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isEditing ? (
          // View Mode
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <AvatarUpload
              currentPhotoURL={profileForm.photoURL}
              displayName={profileForm.displayName}
              onPhotoChange={() => {}}
              disabled
            />

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-0.5">
                    First Name
                  </label>
                  <p className="text-gray-900">{profileForm.firstName || "Not set"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-0.5">
                    Last Name
                  </label>
                  <p className="text-gray-900">{profileForm.lastName || "Not set"}</p>
                </div>
              </div>

              {profileForm.phoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-0.5">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{profileForm.phoneNumber}</p>
                </div>
              )}

              {profileForm.username && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-0.5">
                    Username
                  </label>
                  <p className="text-gray-900">@{profileForm.username}</p>
                </div>
              )}

              {profileForm.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-0.5">
                    Bio
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">{profileForm.bio}</p>
                </div>
              )}

              {!profileForm.username && !profileForm.bio && !profileForm.phoneNumber && (
                <p className="text-sm text-gray-500 italic">
                  Click Edit to add your phone, username and bio
                </p>
              )}
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <AvatarUpload
                currentPhotoURL={profileForm.photoURL}
                displayName={profileForm.displayName}
                onPhotoChange={handlePhotoChange}
              />
            </div>

            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={profileForm.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use your first name as it appears on your government-issued ID.
                </p>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={profileForm.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={profileForm.phoneNumber || ''}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used for account recovery and important notifications
              </p>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  @
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileForm.username}
                  onChange={handleInputChange}
                  placeholder="yourhandle"
                  className="appearance-none block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Letters, numbers, and underscores only. 3-30 characters.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={profileForm.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                maxLength={maxBioLength}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm resize-none"
              />
              <p className={`mt-1 text-xs ${bioCharCount >= maxBioLength ? 'text-red-500' : 'text-gray-500'}`}>
                {bioCharCount}/{maxBioLength} characters
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
