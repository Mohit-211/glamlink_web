import { NextRequest } from 'next/server';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where, Timestamp, getFirestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { UserAgentParser } from './userAgentParser';
import { GeolocationService } from './geolocationService';

export interface SessionData {
  id: string;
  userId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
  twoFactorVerified?: boolean;
}

export class SessionManager {
  /**
   * Create a new session document when user logs in
   */
  static async createSession(
    user: User,
    request: NextRequest,
    db: ReturnType<typeof getFirestore>
  ): Promise<string> {
    try {
      // Extract request info
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      const ipAddress = this.getClientIP(request);

      // Parse user agent
      const parsedUA = UserAgentParser.parse(userAgent);

      // Get location from IP
      const locationData = await GeolocationService.getLocationFromIP(ipAddress);
      const location = GeolocationService.formatLocation(locationData);

      // Generate session ID
      const sessionId = this.generateSessionId();

      // Create session document
      const sessionRef = doc(db, 'users', user.uid, 'sessions', sessionId);

      const sessionData: Omit<SessionData, 'id' | 'userId'> = {
        deviceType: parsedUA.deviceType,
        browser: parsedUA.browser,
        os: parsedUA.os,
        ipAddress,
        location,
        userAgent,
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now(),
      };

      await setDoc(sessionRef, sessionData);

      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }
  }

  /**
   * Update session activity timestamp
   */
  static async updateSessionActivity(
    userId: string,
    sessionId: string,
    db: ReturnType<typeof getFirestore>
  ): Promise<void> {
    try {
      const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        lastActive: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating session activity:', error);
      // Don't throw - this is a non-critical operation
    }
  }

  /**
   * Revoke a specific session
   */
  static async revokeSession(
    userId: string,
    sessionId: string,
    db: ReturnType<typeof getFirestore>
  ): Promise<void> {
    try {
      const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error revoking session:', error);
      throw new Error('Failed to revoke session');
    }
  }

  /**
   * Revoke all sessions except the current one
   */
  static async revokeAllOtherSessions(
    userId: string,
    currentSessionId: string,
    db: ReturnType<typeof getFirestore>
  ): Promise<void> {
    try {
      const sessionsRef = collection(db, 'users', userId, 'sessions');
      const sessionsQuery = query(sessionsRef);
      const sessionsSnap = await getDocs(sessionsQuery);

      const deletePromises = sessionsSnap.docs
        .filter((doc) => doc.id !== currentSessionId)
        .map((doc) => deleteDoc(doc.ref));

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error revoking all other sessions:', error);
      throw new Error('Failed to revoke sessions');
    }
  }

  /**
   * Get client IP address from request
   */
  private static getClientIP(request: NextRequest): string {
    // Try various headers (considering proxies, load balancers, etc.)
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }

    // Fallback to localhost
    return '127.0.0.1';
  }

  /**
   * Generate unique session ID
   */
  private static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
