import firestoreService from '@/lib/services/firebase/firestoreService';

// ============================================
// BASIC TYPE DEFINITIONS
// ============================================

interface Brand {
  id: string;
  name: string;
  [key: string]: any;
}

// ============================================
// FIREBASE PROFILE SERVICE - BRAND CRUD OPERATIONS
// ============================================

class FirebaseProfileService {
  // Create a new brand
  async createBrand(brandId: string, brandData: Brand): Promise<void> {
    return await firestoreService.createDocument('brands', brandId, brandData);
  }

  // Update brand document
  async updateBrand(brandId: string, updates: Partial<Brand>): Promise<void> {
    return await firestoreService.updateDocument('brands', brandId, updates);
  }

  // Set brand document (with merge option)
  async setBrand(brandId: string, brandData: Brand, merge: boolean = true): Promise<void> {
    return await firestoreService.setDocument('brands', brandId, brandData, merge);
  }

  // Delete brand
  async deleteBrand(brandId: string): Promise<void> {
    return await firestoreService.deleteDocument('brands', brandId);
  }

  // Get brand document (for admin operations)
  async getBrand(brandId: string): Promise<Brand | null> {
    return await firestoreService.getDocument<Brand>('brands', brandId);
  }

  // Update specific brand fields
  async updateBrandProfile(brandId: string, profileData: {
    name?: string;
    tagline?: string;
    mission?: string;
    description?: string;
    summary?: string;
    category?: string;
    themeColor?: string;
    profileImage?: string;
    coverImage?: string;
    website?: string;
    socialLinks?: Brand['socialLinks'];
    location?: string;
  }): Promise<void> {
    return await this.updateBrand(brandId, profileData);
  }

  // Publish/unpublish brand
  async publishBrand(brandId: string, isPublished: boolean): Promise<void> {
    const updates: Partial<Brand> = {
      isPublished,
      ...(isPublished && { publishedAt: new Date().toISOString() })
    };
    return await this.updateBrand(brandId, updates);
  }

  // Update spotlight product
  async updateSpotlightProduct(brandId: string, productId: string | null): Promise<void> {
    return await this.updateBrand(brandId, { spotlightProductId: productId || undefined });
  }

  // Update questionnaire
  async updateQuestionnaire(brandId: string, questionnaire: Brand['questionnaire']): Promise<void> {
    return await this.updateBrand(brandId, { questionnaire });
  }

  // Alias for backward compatibility
  async getDocument<T>(collection: string, documentId: string): Promise<T | null> {
    return await firestoreService.getDocument<T>(collection, documentId);
  }

  async updateDocument<T>(collection: string, documentId: string, updates: Partial<T>): Promise<void> {
    return await firestoreService.updateDocument(collection, documentId, updates);
  }
}

// Export singleton instance
const firebaseProfileService = new FirebaseProfileService();
export default firebaseProfileService;