"use client";

import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { User } from "./config";

export interface UseAuthWrapperOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export interface UseAuthWrapperReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  redirectTo: string;
}

export function useAuthWrapper(options: UseAuthWrapperOptions = {}): UseAuthWrapperReturn {
  const { requireAuth = false, requireAdmin = false, redirectTo = "/profile/login" } = options;
  const { user, isLoading } = useAuth();

  const result = useMemo((): UseAuthWrapperReturn => {
    const isAuthenticated = !!user;
    const isAdmin = user ? isUserAdmin(user.email || "") : false;
    const isAuthorized =
      (!requireAuth || isAuthenticated) &&
      (!requireAdmin || isAdmin);

    return {
      user,
      isLoading,
      isAuthenticated,
      isAuthorized,
      isAdmin,
      redirectTo
    };
  }, [user, isLoading, requireAuth, requireAdmin, redirectTo]);

  return result;
}

// Helper function to check if user is admin
function isUserAdmin(email: string): boolean {
  const { ADMIN_EMAILS } = require("./config");
  return ADMIN_EMAILS.includes(email);
}