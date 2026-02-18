"use client";

/**
 * useProfileEdit - Hook for managing profile editing functionality
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import authService from "@/lib/features/auth/utils/authService";
import type { ProfileForm, UseProfileEditReturn } from "./types";

const DEFAULT_PROFILE_FORM: ProfileForm = {
  displayName: "",
  firstName: "",
  lastName: "",
  username: "",
  bio: "",
  photoURL: "",
  phoneNumber: "",
};

export function useProfileEdit(): UseProfileEditReturn {
  const { user } = useAuth();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>(DEFAULT_PROFILE_FORM);
  const [originalForm, setOriginalForm] = useState<ProfileForm>(DEFAULT_PROFILE_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch profile data on mount
  const fetchProfile = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const profile = await authService.getUserProfile(user.uid);

      // Check if we have firstName/lastName, otherwise split displayName
      let firstName = (profile as any)?.firstName || "";
      let lastName = (profile as any)?.lastName || "";

      if (!firstName && !lastName) {
        const displayName = profile?.displayName || user.displayName || "";
        const nameParts = displayName.split(' ');
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(' ') || "";
      }

      const formData: ProfileForm = {
        displayName: profile?.displayName || user.displayName || "",
        firstName,
        lastName,
        username: (profile as any)?.username || "",
        bio: (profile as any)?.bio || "",
        photoURL: profile?.photoURL || user.photoURL || "",
        phoneNumber: (profile as any)?.phoneNumber || "",
      };

      setProfileForm(formData);
      setOriginalForm(formData);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // Use Firebase Auth data as fallback
      const displayName = user.displayName || "";
      const nameParts = displayName.split(' ');
      const fallbackForm: ProfileForm = {
        displayName,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        username: "",
        bio: "",
        photoURL: user.photoURL || "",
        phoneNumber: "",
      };
      setProfileForm(fallbackForm);
      setOriginalForm(fallbackForm);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, user?.displayName, user?.photoURL]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handlePhotoChange = (url: string) => {
    setProfileForm((prev) => ({ ...prev, photoURL: url }));
    setError(null);
    setSuccess(false);
  };

  const validateForm = (): string | null => {
    if (!profileForm.firstName.trim()) {
      return "First name is required";
    }

    if (!profileForm.lastName.trim()) {
      return "Last name is required";
    }

    if (profileForm.phoneNumber) {
      // Basic phone validation - allow international format
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      const digitsOnly = profileForm.phoneNumber.replace(/\D/g, '');
      if (!phoneRegex.test(profileForm.phoneNumber) || digitsOnly.length < 10) {
        return "Please enter a valid phone number";
      }
    }

    if (profileForm.username) {
      // Username validation: alphanumeric and underscores only
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(profileForm.username)) {
        return "Username can only contain letters, numbers, and underscores";
      }
      if (profileForm.username.length < 3) {
        return "Username must be at least 3 characters";
      }
      if (profileForm.username.length > 30) {
        return "Username must be 30 characters or less";
      }
    }

    if (profileForm.bio && profileForm.bio.length > 200) {
      return "Bio must be 200 characters or less";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user?.uid) {
      setError("You must be logged in to update your profile");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      // Auto-generate displayName from firstName + lastName
      const displayName = `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim();

      await authService.updateUserProfile(user.uid, {
        displayName,
        photoURL: profileForm.photoURL || undefined,
        // These fields are stored in Firestore but not in the UserProfile type
        // TypeScript will accept them due to Partial<UserProfile>
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        ...(profileForm.phoneNumber && { phoneNumber: profileForm.phoneNumber.trim() }),
        ...(profileForm.username && { username: profileForm.username.toLowerCase().trim() }),
        ...(profileForm.bio !== undefined && { bio: profileForm.bio.trim() }),
      } as any);

      setSuccess(true);
      setOriginalForm(profileForm);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileForm(originalForm);
    setIsEditing(false);
    setError(null);
  };

  return {
    // Form state
    isEditing,
    setIsEditing,
    profileForm,

    // Status
    isLoading,
    isSaving,
    error,
    success,

    // Handlers
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
    handleCancel,
  };
}
