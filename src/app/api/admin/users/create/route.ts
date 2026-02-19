import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { getAdminAuth, getAdminFirestore, generateTemporaryPassword, isAdminSDKConfigured } from '@/lib/firebase/admin';
import { ADMIN_EMAILS } from '@/lib/features/auth/config';

interface CreateUserRequest {
  email: string;
  displayName: string;
}

interface CreateUserResponse {
  success: boolean;
  data?: {
    uid: string;
    email: string;
    displayName: string;
    temporaryPassword: string;
  };
  error?: string;
}

/**
 * POST /api/admin/users/create
 *
 * Create a new user account with a temporary password.
 * Admin-only endpoint.
 *
 * Request body:
 *   - email: User's email address
 *   - displayName: User's full name
 *
 * Returns:
 *   - uid: Created user's UID
 *   - email: User's email
 *   - displayName: User's display name
 *   - temporaryPassword: Temporary password to share with the user
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateUserResponse>> {
  try {
    // 1. Verify the caller is authenticated
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // 2. Verify the caller is an admin
    const callerEmail = currentUser.email;
    if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // 3. Check if Firebase Admin SDK is configured
    if (!isAdminSDKConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin SDK not configured. Please set up environment variables.' },
        { status: 500 }
      );
    }

    // 4. Parse request body
    const body: CreateUserRequest = await request.json();
    const { email, displayName } = body;

    // 5. Validate input
    if (!email || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Email and display name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 6. Generate temporary password
    const temporaryPassword = generateTemporaryPassword();

    // 7. Create user with Firebase Admin SDK
    const adminAuth = getAdminAuth();
    const adminDb = getAdminFirestore();

    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        password: temporaryPassword,
        emailVerified: false, // User should verify email
      });
    } catch (createError: any) {
      // Handle specific Firebase Auth errors
      if (createError.code === 'auth/email-already-exists') {
        return NextResponse.json(
          { success: false, error: 'A user with this email already exists' },
          { status: 409 }
        );
      }
      if (createError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { success: false, error: 'Invalid email address' },
          { status: 400 }
        );
      }
      throw createError; // Re-throw unexpected errors
    }

    // 8. Create Firestore user profile with requiresPasswordReset flag
    const userProfile = {
      uid: userRecord.uid,
      email: email.trim().toLowerCase(),
      displayName: displayName.trim(),
      userType: 'professional' as const,
      requiresPasswordReset: true, // Flag for first login
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: callerEmail, // Audit trail - which admin created this user
    };

    await adminDb.collection('users').doc(userRecord.uid).set(userProfile);

    console.log(`[Admin User Creation] User created by ${callerEmail}: ${email} (${userRecord.uid})`);

    // 9. Return success with user data and temporary password
    return NextResponse.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        temporaryPassword: temporaryPassword,
      },
    });
  } catch (error: any) {
    console.error('[Admin User Creation] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
