
import { FirebaseHelpers } from './firebaseHelpers';

// ============================================
// BASIC TYPE DEFINITIONS
// ============================================

interface CertifiedProvider {
  id: string;
  name: string;
  [key: string]: any;
}

interface Brand {
  id: string;
  name: string;
  [key: string]: any;
}

// ============================================
// FIREBASE PROVIDER SERVICE - PROVIDER CRUD OPERATIONS
// ============================================

class FirebaseProviderService {
  // Add a new provider to brand
  async addProvider(brandId: string, provider: CertifiedProvider): Promise<void> {
    return FirebaseHelpers.addToBrandArray(brandId, 'certifiedProviders', provider);
  }

  // Update an existing provider
  async updateProvider(brandId: string, providerId: string, updates: Partial<CertifiedProvider>): Promise<void> {
    return FirebaseHelpers.updateInBrandArray(brandId, 'certifiedProviders', providerId, updates);
  }

  // Remove a provider from brand
  async removeProvider(brandId: string, providerId: string): Promise<void> {
    return FirebaseHelpers.removeFromBrandArray(brandId, 'certifiedProviders', providerId);
  }

  // Batch add multiple providers
  async addMultipleProviders(brandId: string, providers: CertifiedProvider[]): Promise<void> {
    for (const provider of providers) {
      await this.addProvider(brandId, provider);
    }
  }

  // Update provider verification status
  async updateProviderVerification(brandId: string, providerId: string, isVerified: boolean): Promise<void> {
    return this.updateProvider(brandId, providerId, { isVerified });
  }

  // Update provider certification level
  async updateProviderCertification(brandId: string, providerId: string, certificationLevel: CertifiedProvider['certificationLevel']): Promise<void> {
    return this.updateProvider(brandId, providerId, { certificationLevel });
  }

  // Update provider contact information
  async updateProviderContact(brandId: string, providerId: string, contact: {
    phone?: string;
    email?: string;
    location?: string;
  }): Promise<void> {
    return this.updateProvider(brandId, providerId, contact);
  }

  // Update provider images
  async updateProviderImages(brandId: string, providerId: string, images: {
    profileImage?: string;
    thumbnailImage?: string;
    images?: Array<{ url: string; altText: string }>;
    imageAlt?: string;
    imagesAlt?: string[];
  }): Promise<void> {
    return this.updateProvider(brandId, providerId, images);
  }

  // Update provider services
  async updateProviderServices(brandId: string, providerId: string, services: string[]): Promise<void> {
    return this.updateProvider(brandId, providerId, { services });
  }

  // Update provider rating (usually calculated from reviews)
  async updateProviderRating(brandId: string, providerId: string, rating: number, reviewCount: number): Promise<void> {
    return this.updateProvider(brandId, providerId, { rating, reviewCount });
  }

  // Alias for backward compatibility
  async addToBrandArray(brandId: string, arrayName: keyof Brand, item: any): Promise<void> {
    return FirebaseHelpers.addToBrandArray(brandId, arrayName, item);
  }

  async updateInBrandArray(brandId: string, arrayName: keyof Brand, itemId: string, updates: any): Promise<void> {
    return FirebaseHelpers.updateInBrandArray(brandId, arrayName, itemId, updates);
  }

  async removeFromBrandArray(brandId: string, arrayName: keyof Brand, itemId: string): Promise<void> {
    return FirebaseHelpers.removeFromBrandArray(brandId, arrayName, itemId);
  }
}

// Export singleton instance
const firebaseProviderService = new FirebaseProviderService();
export default firebaseProviderService;