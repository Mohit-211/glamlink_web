import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import authService from "@/lib/services/firebase/authService";
import { ADMIN_EMAILS } from "@/lib/features/auth/config";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  newsletterSubscribed: boolean;
}

export interface UseSignupReturn {
  formData: SignupFormData;
  isLoading: boolean;
  error: string;
  loginUrl: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignUp: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearError: () => void;
}

export function useSignup(): UseSignupReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect');

  // Build login URL with preserved query params
  const loginUrl = `/profile/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    newsletterSubscribed: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if there's a redirect URL from query params
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Default redirect based on user type
        if (ADMIN_EMAILS.includes(user.email)) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Determine user type based on email
      const userType = ADMIN_EMAILS.includes(formData.email) ? 'admin' : 'client';

      // Sign up with Firebase
      await authService.signUp(
        formData.email,
        formData.password,
        formData.name,
        userType as 'client' | 'professional',
        formData.newsletterSubscribed
      );

      // Redirect after successful signup
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (ADMIN_EMAILS.includes(formData.email)) {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.signInWithGoogle();

      // Redirect after successful Google signup
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (result.user?.email && ADMIN_EMAILS.includes(result.user.email)) {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClearError = () => {
    setError("");
  };

  return {
    formData,
    isLoading,
    error,
    loginUrl,
    handleSubmit,
    handleGoogleSignUp,
    handleInputChange,
    handleClearError,
  };
}
