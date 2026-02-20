import bcrypt from 'bcryptjs';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly SALT_LENGTH = 16;
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;
  private static readonly KEY_LENGTH = 32;

  /**
   * Get encryption key from environment variable
   */
  private static getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is not set');
    }

    // Derive a 32-byte key from the environment variable
    const salt = Buffer.from('glamlink-2fa-salt'); // Fixed salt for consistency
    return scryptSync(key, salt, this.KEY_LENGTH);
  }

  /**
   * Encrypt text using AES-256-GCM
   * @param text - Plain text to encrypt
   */
  static encrypt(text: string): string {
    try {
      const key = this.getEncryptionKey();
      const iv = randomBytes(this.IV_LENGTH);

      const cipher = createCipheriv(this.ALGORITHM, key, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Combine IV + AuthTag + Encrypted data
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt text using AES-256-GCM
   * @param encryptedText - Encrypted text (format: iv:authTag:encrypted)
   */
  static decrypt(encryptedText: string): string {
    try {
      const key = this.getEncryptionKey();
      const parts = encryptedText.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash text using bcrypt (for backup codes)
   * @param text - Plain text to hash
   */
  static async hash(text: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(text, salt);
  }

  /**
   * Compare text with hash using bcrypt
   * @param text - Plain text
   * @param hash - Hashed text
   */
  static async compareHash(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }

  /**
   * Generate a secure random token
   * @param length - Length in bytes (default: 32)
   */
  static generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }
}
