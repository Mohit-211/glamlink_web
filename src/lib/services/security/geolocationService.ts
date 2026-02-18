export interface LocationData {
  city: string;
  region: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class GeolocationService {
  /**
   * Get location from IP address using ip-api.com (free, no API key required)
   * @param ip - IP address to lookup
   */
  static async getLocationFromIP(ip: string): Promise<LocationData> {
    // Skip for localhost/private IPs
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.')
    ) {
      return {
        city: 'Local',
        region: 'Local',
        country: 'Local',
      };
    }

    try {
      // Use ip-api.com free tier (no API key needed, 45 req/min limit)
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`, {
        headers: {
          'User-Agent': 'Glamlink-Security-Service/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('Geolocation API request failed');
      }

      const data = await response.json();

      if (data.status === 'fail') {
        console.warn('Geolocation lookup failed:', data.message);
        return this.getUnknownLocation();
      }

      return {
        city: data.city || 'Unknown',
        region: data.regionName || 'Unknown',
        country: data.country || 'Unknown',
        coordinates: data.lat && data.lon ? {
          lat: data.lat,
          lng: data.lon,
        } : undefined,
      };
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return this.getUnknownLocation();
    }
  }

  /**
   * Format location for display
   */
  static formatLocation(location: LocationData): string {
    if (location.country === 'Local') {
      return 'Local Network';
    }

    if (location.city === 'Unknown' && location.country === 'Unknown') {
      return 'Unknown Location';
    }

    const parts: string[] = [];
    if (location.city && location.city !== 'Unknown') parts.push(location.city);
    if (location.country && location.country !== 'Unknown') parts.push(location.country);

    return parts.join(', ') || 'Unknown Location';
  }

  private static getUnknownLocation(): LocationData {
    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
    };
  }
}
