export interface ParsedUserAgent {
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export class UserAgentParser {
  /**
   * Parse user agent string to extract browser, OS, and device type
   */
  static parse(userAgent: string): ParsedUserAgent {
    const ua = userAgent.toLowerCase();

    return {
      browser: this.getBrowser(ua),
      os: this.getOS(ua),
      deviceType: this.getDeviceType(ua),
    };
  }

  private static getBrowser(ua: string): string {
    if (ua.includes('edg/') || ua.includes('edge/')) return 'Edge';
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('opera') || ua.includes('opr/')) return 'Opera';
    return 'Other';
  }

  private static getOS(ua: string): string {
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac os x')) return 'macOS';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('linux')) return 'Linux';
    return 'Other';
  }

  private static getDeviceType(ua: string): 'desktop' | 'mobile' | 'tablet' {
    if (ua.includes('ipad') || ua.includes('tablet')) return 'tablet';
    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
      // Check if it's a tablet-sized Android device
      if (ua.includes('tablet')) return 'tablet';
      return 'mobile';
    }
    return 'desktop';
  }
}
