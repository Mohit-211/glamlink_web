"use client";

/**
 * SecuritySection - Password change functionality
 */

import { Lock, AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import type { UsePasswordChangeReturn } from "../types";

interface SecuritySectionProps extends UsePasswordChangeReturn {}

export default function SecuritySection({
  isChangingPassword,
  setIsChangingPassword,
  passwordForm,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordLoading,
  passwordError,
  passwordSuccess,
  passwordRequirements,
  allRequirementsMet,
  passwordsMatch,
  handlePasswordInputChange,
  handlePasswordSubmit,
  handleCancelPasswordChange,
}: SecuritySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-400" />
          Security
        </h2>
      </div>
      <div className="p-6">
        {/* Password Success Message */}
        {passwordSuccess && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {!isChangingPassword ? (
          // Password section - not editing
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Password
              </label>
              <p className="text-gray-900">••••••••••••</p>
            </div>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 text-sm font-medium text-glamlink-teal hover:text-glamlink-teal/80 border border-glamlink-teal hover:border-glamlink-teal/80 rounded-lg transition-colors"
            >
              Change Password
            </button>
          </div>
        ) : (
          // Password change form
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Error Message */}
            {passwordError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Password must have:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.minLength ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-current" />
                  )}
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.hasUppercase ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-current" />
                  )}
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.hasLowercase ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-current" />
                  )}
                  One lowercase letter
                </div>
                <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordRequirements.hasNumber ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-current" />
                  )}
                  One number
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.confirmPassword && (
                <p className={`mt-1 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={passwordLoading || !allRequirementsMet || !passwordsMatch}
                className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelPasswordChange}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Security Note */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> For security reasons, you may need to sign out and sign back in before changing your password if you've been logged in for a long time.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
