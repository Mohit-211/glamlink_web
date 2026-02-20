"use client";

import { ReactNode } from "react";
import { useAuth } from "./useAuth";
import { AuthLoading, AuthNotAuthenticated, AuthNotAdmin } from "./states";

export interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  featureName?: string;
  loadingComponent?: ReactNode;
  unauthorizedComponent?: ReactNode;
  loadingMessage?: string;
}

export default function AuthWrapper({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo = "/profile/login",
  featureName = "This Feature",
  loadingComponent,
  unauthorizedComponent,
  loadingMessage
}: AuthWrapperProps) {
  const { user, isLoading } = useAuth();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is admin (when required)
  const isAdmin = requireAdmin && user ? isUserAdmin(user.email || "") : !requireAdmin;

  // Show loading state
  if (isLoading) {
    return loadingComponent || <AuthLoading message={loadingMessage} />;
  }

  // Check if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return unauthorizedComponent || <AuthNotAuthenticated featureName={featureName} redirectTo={redirectTo} />;
  }

  // Check if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return unauthorizedComponent || <AuthNotAdmin featureName={featureName} user={user} />;
  }

  // User is authorized, render children
  return <>{children}</>;
}

// Helper function to check if user is admin
function isUserAdmin(email: string): boolean {
  const { ADMIN_EMAILS } = require("./config");
  return ADMIN_EMAILS.includes(email);
}