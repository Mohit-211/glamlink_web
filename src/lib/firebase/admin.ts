/**
 * Firebase Admin SDK Initialization
 *
 * This file initializes the Firebase Admin SDK for server-side operations
 * that require elevated privileges, such as:
 * - Creating user accounts without password
 * - Managing user authentication
 * - Server-side Firestore operations with admin access
 *
 * Required environment variables:
 * - FIREBASE_ADMIN_PROJECT_ID
 * - FIREBASE_ADMIN_CLIENT_EMAIL
 * - FIREBASE_ADMIN_PRIVATE_KEY
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Admin SDK configuration from environment variables
const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Check if Admin SDK config is properly loaded
const isAdminConfigValid = Boolean(adminConfig.projectId && adminConfig.clientEmail && adminConfig.privateKey);

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

/**
 * Initialize Firebase Admin SDK
 * Only initializes once, returns existing instances on subsequent calls
 */
function initializeFirebaseAdmin() {
  if (!isAdminConfigValid) {
    console.warn('[Firebase Admin] Missing required environment variables. Admin SDK features will not work.');
    console.warn('[Firebase Admin] Required: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY');
    return { adminApp: null, adminAuth: null, adminDb: null };
  }

  try {
    // Check if already initialized
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: adminConfig.projectId,
          clientEmail: adminConfig.clientEmail,
          privateKey: adminConfig.privateKey,
        }),
      });
    } else {
      adminApp = getApps()[0];
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);

    return { adminApp, adminAuth, adminDb };
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error);
    return { adminApp: null, adminAuth: null, adminDb: null };
  }
}

// Initialize on module load
const { adminApp: app, adminAuth: auth, adminDb: db } = initializeFirebaseAdmin();

export { app as adminApp, auth as adminAuth, db as adminDb };

/**
 * Get Firebase Admin Auth instance
 * Throws error if not properly configured
 */
export function getAdminAuth(): Auth {
  if (!adminAuth) {
    throw new Error('Firebase Admin SDK not configured. Check environment variables.');
  }
  return adminAuth;
}

/**
 * Get Firebase Admin Firestore instance
 * Throws error if not properly configured
 */
export function getAdminFirestore(): Firestore {
  if (!adminDb) {
    throw new Error('Firebase Admin SDK not configured. Check environment variables.');
  }
  return adminDb;
}

/**
 * Check if Firebase Admin SDK is properly configured
 */
export function isAdminSDKConfigured(): boolean {
  return isAdminConfigValid && adminAuth !== null && adminDb !== null;
}

/**
 * Generate a random temporary password
 * 12 characters: uppercase, lowercase, and numbers
 */
export function generateTemporaryPassword(): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluded I, O to avoid confusion
  const lowercase = 'abcdefghjkmnpqrstuvwxyz'; // Excluded i, l, o to avoid confusion
  const numbers = '23456789'; // Excluded 0, 1 to avoid confusion
  const allChars = uppercase + lowercase + numbers;

  let password = '';

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  // Fill the rest randomly
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
