import { initializeServerApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { firebaseConfig } from '@/lib/config/firebase';

/**
 * Get a public Firebase app instance without authentication
 * Used for accessing public data that doesn't require user login
 */
export async function getPublicFirebaseApp() {
  try {
    console.log('[serverApp] Initializing public Firebase app');
    
    // Initialize server app without authentication
    const firebaseServerApp = initializeServerApp(firebaseConfig, {});
    const db = getFirestore(firebaseServerApp);
    
    return { 
      firebaseServerApp, 
      currentUser: null,
      db 
    };
  } catch (error) {
    console.error('[serverApp] Error initializing public app:', error);
    return { 
      firebaseServerApp: null, 
      currentUser: null,
      db: null 
    };
  }
}

export async function getAuthenticatedAppForUser() {
  try {
    // Get the session cookie
    const authIdToken = (await cookies()).get("__session")?.value;

    if (!authIdToken) {
      console.log('[serverApp] No session cookie found');
      return { 
        firebaseServerApp: null, 
        currentUser: null,
        db: null 
      };
    }

    console.log('[serverApp] Initializing server app with ID token');

    // Initialize server app with the ID token
    const firebaseServerApp = initializeServerApp(
      firebaseConfig,
      {
        authIdToken,
      }
    );

    const auth = getAuth(firebaseServerApp);
    await auth.authStateReady();

    const currentUser = auth.currentUser;
    console.log('[serverApp] Current user:', currentUser?.email);

    return { 
      firebaseServerApp, 
      currentUser,
      db: currentUser ? getFirestore(firebaseServerApp) : null
    };
  } catch (error) {
    console.error('[serverApp] Error initializing server app:', error);
    return { 
      firebaseServerApp: null, 
      currentUser: null,
      db: null 
    };
  }
}