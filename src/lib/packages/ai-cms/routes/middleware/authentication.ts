/**
 * Authentication Middleware
 * 
 * Handles user authentication for AI generation endpoints.
 * Integrates with Firebase Auth and session management.
 */

import { NextRequest } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  customClaims?: Record<string, any>;
}

export interface AuthenticationResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

/**
 * Main authentication middleware function
 */
export async function authenticate(request: NextRequest): Promise<AuthenticationResult> {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();
    
    if (!currentUser) {
      return {
        success: false,
        error: 'Authentication required. Please log in to use AI features.'
      };
    }

    // Convert Firebase user to our interface
    const user: AuthenticatedUser = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      emailVerified: currentUser.emailVerified,
      customClaims: {} // Custom claims not available in client auth
    };

    return {
      success: true,
      user
    };

  } catch (error) {
    console.error('Authentication error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

/**
 * Check if user has specific permissions
 */
export async function checkPermissions(
  user: AuthenticatedUser,
  requiredPermissions: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check for admin permissions
    const isAdmin = user.email === 'admin@glamlink.com' || 
                   user.customClaims?.admin === true;
    
    // Admin users have all permissions
    if (isAdmin) {
      return { success: true };
    }

    // Check for specific permissions in custom claims
    const userPermissions = user.customClaims?.permissions || [];
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      const missing = requiredPermissions.filter(permission => 
        !userPermissions.includes(permission)
      );
      
      return {
        success: false,
        error: `Missing required permissions: ${missing.join(', ')}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Permission check error:', error);
    return {
      success: false,
      error: 'Failed to verify permissions'
    };
  }
}

/**
 * Check if user can access AI features
 */
export async function checkAIAccess(user: AuthenticatedUser): Promise<{
  success: boolean;
  error?: string;
  limits?: {
    maxRequestsPerHour: number;
    maxRequestsPerDay: number;
    maxTokensPerRequest: number;
  };
}> {
  try {
    // Define access levels
    const accessLevels = {
      free: {
        maxRequestsPerHour: 5,
        maxRequestsPerDay: 20,
        maxTokensPerRequest: 1000
      },
      premium: {
        maxRequestsPerHour: 50,
        maxRequestsPerDay: 200,
        maxTokensPerRequest: 4000
      },
      admin: {
        maxRequestsPerHour: 1000,
        maxRequestsPerDay: 5000,
        maxTokensPerRequest: 8000
      }
    };

    // Check if user is admin
    const isAdmin = user.email === 'admin@glamlink.com' || 
                   user.customClaims?.admin === true;
    
    if (isAdmin) {
      return {
        success: true,
        limits: accessLevels.admin
      };
    }

    // Check subscription level
    const subscriptionLevel = user.customClaims?.subscription || 'free';
    const userLimits = accessLevels[subscriptionLevel as keyof typeof accessLevels] || accessLevels.free;

    // Check if AI access is explicitly disabled
    if (user.customClaims?.aiDisabled === true) {
      return {
        success: false,
        error: 'AI access has been disabled for this account'
      };
    }

    return {
      success: true,
      limits: userLimits
    };

  } catch (error) {
    console.error('AI access check error:', error);
    return {
      success: false,
      error: 'Failed to verify AI access permissions'
    };
  }
}

/**
 * Middleware wrapper for route handlers
 */
export function withAuthentication(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>,
  options: {
    requiredPermissions?: string[];
    requireAIAccess?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      // Authenticate user
      const authResult = await authenticate(request);
      if (!authResult.success || !authResult.user) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: authResult.error || 'Authentication required' 
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const user = authResult.user;

      // Check required permissions
      if (options.requiredPermissions && options.requiredPermissions.length > 0) {
        const permissionResult = await checkPermissions(user, options.requiredPermissions);
        if (!permissionResult.success) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: permissionResult.error 
            }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      // Check AI access if required
      if (options.requireAIAccess) {
        const aiAccessResult = await checkAIAccess(user);
        if (!aiAccessResult.success) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: aiAccessResult.error 
            }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Add limits to request context (could be used for rate limiting)
        (request as any).aiLimits = aiAccessResult.limits;
      }

      // Add user to request context
      (request as any).user = user;

      // Call the handler
      return await handler(request, user);

    } catch (error) {
      console.error('Authentication middleware error:', error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Internal authentication error' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Extract user from request (after authentication middleware)
 */
export function getUserFromRequest(request: NextRequest): AuthenticatedUser | null {
  return (request as any).user || null;
}

/**
 * Get AI limits from request (after authentication middleware)
 */
export function getAILimitsFromRequest(request: NextRequest) {
  return (request as any).aiLimits || null;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.email === 'admin@glamlink.com' || 
         user.customClaims?.admin === true;
}

/**
 * Get user subscription level
 */
export function getSubscriptionLevel(user: AuthenticatedUser): 'free' | 'premium' | 'admin' {
  if (isAdmin(user)) {
    return 'admin';
  }
  
  return user.customClaims?.subscription || 'free';
}