"use client";

import Link from "next/link";
import { Lock, AlertCircle, Check } from "lucide-react";
import { useResetPassword } from "./useResetPassword";

export default function ResetPasswordForm() {
  const {
    formData,
    isSubmitting,
    error,
    success,
    isAuthenticated,
    requiresPasswordReset,
    passwordRequirements,
    allRequirementsMet,
    passwordsMatch,
    handleSubmit,
    handleInputChange,
    handleLogout,
  } = useResetPassword();

  // Don't render if conditions not met (will redirect)
  if (!isAuthenticated || !requiresPasswordReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-glamlink-teal">glamlink</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set Your New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          For security, please create a new password for your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            // Success state
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Password Updated Successfully!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Redirecting you to your profile...
              </p>
            </div>
          ) : (
            // Password form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700">
                      Your account was created by an administrator with a temporary password.
                      Please set a new password to continue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Password must have:</p>
                <ul className="space-y-1 text-xs">
                  <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordRequirements.minLength ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-current" />
                    )}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordRequirements.hasUppercase ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-current" />
                    )}
                    One uppercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordRequirements.hasLowercase ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-current" />
                    )}
                    One lowercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordRequirements.hasNumber ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-current" />
                    )}
                    One number
                  </li>
                </ul>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
                  />
                </div>
                {formData.confirmPassword && (
                  <p className={`mt-1 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !allRequirementsMet || !passwordsMatch}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating Password...
                    </>
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </div>

              {/* Logout Option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Sign out and use a different account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
