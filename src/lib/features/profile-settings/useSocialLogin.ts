"use client";

/**
 * useSocialLogin - Hook for managing social login connections
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  linkWithPopup,
  unlink,
  getAuth,
  type UserInfo,
} from "firebase/auth";
import type { SocialProvider, SocialConnection, UseSocialLoginReturn } from "./types";

const PROVIDER_MAP = {
  "google.com": GoogleAuthProvider,
  "facebook.com": FacebookAuthProvider,
  "apple.com": OAuthProvider,
} as const;

const PROVIDER_LABELS = {
  "google.com": "Google",
  "facebook.com": "Facebook",
  "apple.com": "Apple",
} as const;

export function useSocialLogin(): UseSocialLoginReturn {
  const { user } = useAuth();

  // State
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch current connections from Firebase Auth
  const refreshConnections = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get provider data from Firebase Auth user (need to use getAuth().currentUser for full Firebase User)
      const firebaseUser = getAuth().currentUser;
      const providerData: UserInfo[] = firebaseUser?.providerData || [];

      // Create connection status for each provider
      const allConnections: SocialConnection[] = [
        "google.com",
        "facebook.com",
        "apple.com",
      ].map((providerId) => {
        const providerInfo = providerData.find((p: UserInfo) => p.providerId === providerId);

        return {
          provider: providerId as SocialProvider,
          connected: !!providerInfo,
          email: providerInfo?.email || undefined,
          displayName: providerInfo?.displayName || undefined,
          connectedAt: providerInfo ? new Date().toISOString() : undefined,
        };
      });

      setConnections(allConnections);
    } catch (err) {
      console.error("Error fetching social connections:", err);
      setError("Failed to load social login connections");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshConnections();
  }, [refreshConnections]);

  // Connect a social provider
  const connectProvider = async (provider: SocialProvider) => {
    const firebaseUser = getAuth().currentUser;
    if (!user || !firebaseUser) {
      setError("You must be logged in to connect social accounts");
      return;
    }

    setIsConnecting(true);
    setError(null);
    setSuccess(false);

    try {
      // Create provider instance
      let authProvider;
      if (provider === "google.com") {
        authProvider = new GoogleAuthProvider();
      } else if (provider === "facebook.com") {
        authProvider = new FacebookAuthProvider();
      } else if (provider === "apple.com") {
        authProvider = new OAuthProvider("apple.com");
      } else {
        throw new Error("Unsupported provider");
      }

      // Link the provider to the current user
      await linkWithPopup(firebaseUser, authProvider);

      // Refresh connections
      await refreshConnections();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error connecting provider:", err);

      // Handle specific Firebase errors
      if (err.code === "auth/credential-already-in-use") {
        setError(`This ${PROVIDER_LABELS[provider]} account is already linked to another user`);
      } else if (err.code === "auth/provider-already-linked") {
        setError(`${PROVIDER_LABELS[provider]} is already connected`);
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completion");
      } else {
        setError(`Failed to connect ${PROVIDER_LABELS[provider]}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect a social provider
  const disconnectProvider = async (provider: SocialProvider) => {
    const firebaseUser = getAuth().currentUser;
    if (!user || !firebaseUser) {
      setError("You must be logged in to disconnect social accounts");
      return;
    }

    // Check if user has a password or at least one other provider
    const providerCount = firebaseUser.providerData?.length || 0;
    const hasPassword = firebaseUser.providerData?.some((p: UserInfo) => p.providerId === "password");

    if (providerCount === 1 && !hasPassword) {
      setError("You must have at least one sign-in method. Add a password before disconnecting.");
      return;
    }

    setIsDisconnecting(true);
    setError(null);
    setSuccess(false);

    try {
      // Unlink the provider from the current user
      await unlink(firebaseUser, provider);

      // Refresh connections
      await refreshConnections();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error disconnecting provider:", err);

      if (err.code === "auth/no-such-provider") {
        setError(`${PROVIDER_LABELS[provider]} is not connected`);
      } else {
        setError(`Failed to disconnect ${PROVIDER_LABELS[provider]}`);
      }
    } finally {
      setIsDisconnecting(false);
    }
  };

  return {
    // State
    connections,

    // Status
    isLoading,
    isConnecting,
    isDisconnecting,
    error,
    success,

    // Handlers
    connectProvider,
    disconnectProvider,
    refreshConnections,
  };
}
