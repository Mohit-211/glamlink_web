import { generateSecret, generateURI, verify } from 'otplib';
import QRCode from 'qrcode';

export class TOTPService {
  /**
   * Generate a new TOTP secret
   */
  static generateSecret(): string {
    return generateSecret();
  }

  /**
   * Generate QR code data URL for authenticator app scanning
   * @param secret - TOTP secret
   * @param email - User's email address
   * @param issuer - App name (defaults to "Glamlink")
   */
  static async generateQRCode(
    secret: string,
    email: string,
    issuer: string = 'Glamlink'
  ): Promise<string> {
    // Generate otpauth URL
    const otpauth = generateURI({
      secret,
      label: email,
      issuer,
      algorithm: 'sha1',
      digits: 6,
      period: 30,
    });

    // Generate QR code as data URL
    try {
      const qrCodeUrl = await QRCode.toDataURL(otpauth, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
      });
      return qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify TOTP token
   * @param secret - TOTP secret
   * @param token - 6-digit code from authenticator app
   */
  static async verifyToken(secret: string, token: string): Promise<boolean> {
    try {
      const result = await verify({ token, secret });
      return result.valid;
    } catch (error) {
      console.error('Error verifying TOTP token:', error);
      return false;
    }
  }

  /**
   * Generate backup codes
   * @param count - Number of codes to generate (default: 10)
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar characters

    for (let i = 0; i < count; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      // Format as XXXX-XXXX for readability
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }

    return codes;
  }

  /**
   * Validate backup code format
   */
  static isValidBackupCodeFormat(code: string): boolean {
    // Should be in format XXXX-XXXX
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(code);
  }
}
