"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus, setUser } from "./authSlice";
import authService from "./utils/authService";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

export function useAuth(requireAdmin = false) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  
  // Debug logging removed
  
  useEffect(() => {
    // Only use auth state listener, no need for checkAuthStatus
    // The listener will fire immediately with the current auth state
    const unsubscribe = authService.onAuthStateChange((user, userProfile) => {
      // Auth state changed
      
      if (user && userProfile) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!,
          photoURL: user.photoURL || undefined,
          userType: userProfile.userType,
        }));
      } else {
        dispatch(setUser(null));
      }
    });
    
    return () => unsubscribe();
  }, [dispatch]);
  
  // TEMPORARILY COMMENTED OUT TO STOP REDIRECT LOOP
  // useEffect(() => {
  //   // Redirect logic - only redirect if explicitly requiring authentication
  //   if (!authState.isLoading && requireAdmin && !authState.isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [authState.isLoading, authState.isAuthenticated, requireAdmin, router]);
  
  return authState;
}