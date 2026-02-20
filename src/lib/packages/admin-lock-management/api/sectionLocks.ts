/**
 * Admin Lock Management - API Functions
 *
 * Client-side functions for interacting with section lock API endpoints.
 * These are simple wrappers around fetch calls.
 */

import type {
  SectionLockStatus,
  AcquireLockRequest,
  AcquireLockResponse,
  ReleaseLockResponse,
} from '../types';
import { isLockExpired, getSecondsUntilExpiration } from '../utils';

/**
 * Check the lock status of a section
 *
 * @param sectionId - Section ID to check
 * @param userId - Current user ID
 * @returns Lock status including whether current user can override
 */
export async function checkSectionLock(
  sectionId: string,
  userId: string
): Promise<SectionLockStatus> {
  try {
    const response = await fetch(
      `/api/magazine/sections/${sectionId}/lock?userId=${userId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      console.error('Failed to check lock status:', response.statusText);
      // Return unlocked status on error
      return {
        isLocked: false,
        canOverride: false,
      };
    }

    const data = await response.json();

    // Calculate expiration seconds if lock exists
    if (data.isLocked && data.lockExpiresAt) {
      data.expiresInSeconds = getSecondsUntilExpiration(data.lockExpiresAt);

      // If expired, treat as unlocked
      if (isLockExpired(data.lockExpiresAt)) {
        data.isLocked = false;
        data.canOverride = false;
      }
    }

    return data as SectionLockStatus;
  } catch (error) {
    console.error('Error checking section lock:', error);
    // Return unlocked status on error
    return {
      isLocked: false,
      canOverride: false,
    };
  }
}

/**
 * Acquire a lock on a section
 *
 * @param request - Lock acquisition request with user info
 * @returns Response indicating success or failure
 */
export async function acquireSectionLock(
  request: AcquireLockRequest
): Promise<AcquireLockResponse> {
  try {
    const response = await fetch(
      `/api/magazine/sections/${request.sectionId}/lock`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: request.userId,
          userEmail: request.userEmail,
          userName: request.userName,
          override: request.override || false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to acquire lock',
        lockStatus: data.lockStatus,
      };
    }

    return {
      success: true,
      lockStatus: data.lockStatus,
    };
  } catch (error) {
    console.error('Error acquiring section lock:', error);
    return {
      success: false,
      error: 'Network error while acquiring lock',
    };
  }
}

/**
 * Release a lock on a section
 *
 * @param sectionId - Section ID to unlock
 * @param userId - Current user ID (must own the lock)
 * @returns Response indicating success or failure
 */
export async function releaseSectionLock(
  sectionId: string,
  userId: string
): Promise<ReleaseLockResponse> {
  try {
    const response = await fetch(
      `/api/magazine/sections/${sectionId}/lock?userId=${userId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to release lock',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error releasing section lock:', error);
    return {
      success: false,
      error: 'Network error while releasing lock',
    };
  }
}

/**
 * Refresh/extend a lock on a section
 *
 * Extends the lock expiration time by 5 minutes from now.
 * Only works if the current user owns the lock.
 *
 * @param sectionId - Section ID to refresh lock for
 * @param userId - Current user ID (must own the lock)
 * @returns Response indicating success or failure
 */
export async function refreshSectionLock(
  sectionId: string,
  userId: string
): Promise<ReleaseLockResponse> {
  try {
    const response = await fetch(
      `/api/magazine/sections/${sectionId}/lock?userId=${userId}`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to refresh lock',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error refreshing section lock:', error);
    return {
      success: false,
      error: 'Network error while refreshing lock',
    };
  }
}
