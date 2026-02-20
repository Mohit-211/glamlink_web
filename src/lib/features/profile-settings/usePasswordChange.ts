"use client";

/**
 * usePasswordChange - Hook for handling password change functionality
 */

import { useState } from "react";
import authService from "@/lib/features/auth/utils/authService";
import type { PasswordForm, PasswordRequirements, UsePasswordChangeReturn } from "./types";

export function usePasswordChange(): UsePasswordChangeReturn {
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Password requirements validation
  const passwordRequirements: PasswordRequirements = {
    minLength: passwordForm.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(passwordForm.newPassword),
    hasLowercase: /[a-z]/.test(passwordForm.newPassword),
    hasNumber: /[0-9]/.test(passwordForm.newPassword),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch =
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordForm.confirmPassword.length > 0;

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!allRequirementsMet) {
      setPasswordError("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.updatePassword(passwordForm.newPassword);
      setPasswordSuccess(true);
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);

      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update password";
      setPasswordError(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setPasswordError(null);
  };

  return {
    // Form state
    isChangingPassword,
    setIsChangingPassword,
    passwordForm,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,

    // Status
    passwordLoading,
    passwordError,
    passwordSuccess,

    // Validation
    passwordRequirements,
    allRequirementsMet,
    passwordsMatch,

    // Handlers
    handlePasswordInputChange,
    handlePasswordSubmit,
    handleCancelPasswordChange,
  };
}
