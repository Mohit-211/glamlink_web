import { NextRequest } from 'next/server';
import { collection, addDoc, Timestamp, getFirestore } from 'firebase/firestore';
import { UserAgentParser } from './userAgentParser';
import { GeolocationService } from './geolocationService';

export interface LoginEventData {
  timestamp: Timestamp;
  status: 'success' | 'failed' | 'blocked';
  ipAddress: string;
  location: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  userAgent: string;
  failureReason?: string;
  twoFactorUsed?: boolean;
}

export class LoginLogger {
  /**
   * Log a login attempt (success, failed, or blocked)
   */
  static async logLoginAttempt(
    userId: string,
    status: 'success' | 'failed' | 'blocked',
    request: NextRequest,
    db: ReturnType<typeof getFirestore>,
    failureReason?: string,
    twoFactorUsed?: boolean
  ): Promise<void> {
    try {
      // Extract request info
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      const ipAddress = this.getClientIP(request);

      // Parse user agent
      const parsedUA = UserAgentParser.parse(userAgent);

      // Get location from IP (but don't block on it)
      let location = 'Unknown';
      try {
        const locationData = await GeolocationService.getLocationFromIP(ipAddress);
        location = GeolocationService.formatLocation(locationData);
      } catch (error) {
        console.error('Error getting location for login log:', error);
      }

      // Create login history document
      const loginHistoryRef = collection(db, 'users', userId, 'loginHistory');

      const eventData: LoginEventData = {
        timestamp: Timestamp.now(),
        status,
        ipAddress,
        location,
        deviceType: parsedUA.deviceType,
        browser: parsedUA.browser,
        userAgent,
        failureReason,
        twoFactorUsed,
      };

      await addDoc(loginHistoryRef, eventData);
    } catch (error) {
      console.error('Error logging login attempt:', error);
      // Don't throw - logging failures shouldn't break login flow
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
}
