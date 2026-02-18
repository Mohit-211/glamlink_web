import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginWithEmail, loginWithGoogle, clearError } from "@/lib/features/auth/authSlice";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UseLoginReturn {
  formData: LoginFormData;
  isLoading: boolean;
  error: string | null;
  showMagazineMessage: boolean;
  signupUrl: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearError: () => void;
}

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error, user, requiresPasswordReset, isAdmin } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Get redirect URL and message from query params
  const redirectUrl = searchParams.get('redirect');
  const message = searchParams.get('message');
  const showMagazineMessage = message === 'magazine';

  // Build signup URL with preserved query params
  const signupUrl = `/profile/signup${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user needs to reset password (admin-created accounts with temporary password)
      if (requiresPasswordReset) {
        router.push("/profile/reset-password-required");
        return;
      }

      // Check if there's a redirect URL
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Default redirect based on user type
        if (isAdmin) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
    }
  }, [isAuthenticated, user, router, redirectUrl, requiresPasswordReset, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginWithEmail(formData));
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    formData,
    isLoading,
    error,
    showMagazineMessage,
    signupUrl,
    handleSubmit,
    handleGoogleLogin,
    handleInputChange,
    handleClearError,
  };
}
