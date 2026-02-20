"use client";

import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/config/firebase';
import { setUser } from './authSlice';
import authService from '@/lib/services/firebase/authService';
import { useAppDispatch } from '../../../../store/hooks';

// Client-side cookie functions
async function setSessionCookie(idToken: string) {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    // Error setting session cookie
  }
}

async function clearSessionCookie() {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    // Error clearing session cookie
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange(async (user, userProfile) => {
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

    // Listen for ID token changes to update session cookie
    let unsubscribeToken = () => {};
    if (auth) {
      unsubscribeToken = onIdTokenChanged(auth, async (user) => {
        // ID token changed
        
        if (user) {
          try {
            const idToken = await user.getIdToken();
            await setSessionCookie(idToken);
          } catch (error) {
            // Error getting ID token
          }
        } else {
          await clearSessionCookie();
        }
      });
    }

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, [dispatch]);

  return <>{children}</>;
}