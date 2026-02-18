import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearPasswordResetRequirement, logout } from "@/lib/features/auth/authSlice";
import authService from "@/lib/features/auth/utils/authService";

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export interface UseResetPasswordReturn {
  formData: ResetPasswordFormData;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  isAuthenticated: boolean;
  requiresPasswordReset: boolean;
  passwordRequirements: PasswordRequirements;
  allRequirementsMet: boolean;
  passwordsMatch: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => Promise<void>;
}

export function useResetPassword(): UseResetPasswordReturn {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, requiresPasswordReset } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password requirements
  const passwordRequirements: PasswordRequirements = {
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasLowercase: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
  };
  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;

  // Redirect if not authenticated or doesn't require password reset
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/profile/login");
    } else if (!requiresPasswordReset) {
      router.push("/profile");
    }
  }, [isAuthenticated, user, requiresPasswordReset, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (!allRequirementsMet) {
      setError("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update password in Firebase Auth
      await authService.updatePassword(formData.newPassword);

      // Clear the requiresPasswordReset flag in Firestore
      if (user) {
        await authService.clearPasswordResetRequirement(user.uid);
      }

      // Update Redux state
      dispatch(clearPasswordResetRequirement());

      setSuccess(true);

      // Redirect to profile after short delay
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/profile/login");
  };

  return {
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
  };
}
