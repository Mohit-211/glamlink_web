import firestoreService from '@/lib/services/firebase/firestoreService';

// ============================================
// BASIC BRAND TYPE DEFINITIONS
// ============================================

interface Brand {
  id: string;
  name: string;
  products?: any[];
  certifiedProviders?: any[];
  beforeAfters?: any[];
  trainingPrograms?: any[];
  reviews?: any[];
  [key: string]: any;
}

// ============================================
// SHARED HELPER FUNCTIONS FOR NESTED ARRAYS
// ============================================

export class FirebaseHelpers {
  // Helper to get brand
  static async getBrand(brandId: string): Promise<Brand | null> {
    return await firestoreService.getDocument<Brand>('brands', brandId);
  }
  // Add item to a brand's nested array
  static async addToBrandArray<T>(brandId: string, arrayName: keyof Brand, item: T): Promise<void> {
    try {
      const brand = await firestoreService.getDocument<Brand>('brands', brandId);
      if (!brand) throw new Error('Brand not found');
      
      const updatedArray = [...(brand[arrayName] as T[] || []), item];
      await firestoreService.updateDocument('brands', brandId, {
        [arrayName]: updatedArray
      });
    } catch (error: any) {
      throw new Error(`Failed to add item to ${String(arrayName)}: ${error.message}`);
    }
  }

  // Update item in a brand's nested array
  static async updateInBrandArray<T extends { id: string }>(
    brandId: string,
    arrayName: keyof Brand,
    itemId: string,
    updates: Partial<T>
  ): Promise<void> {
    try {
      const brand = await firestoreService.getDocument<Brand>('brands', brandId);
      if (!brand) throw new Error('Brand not found');
      
      const array = brand[arrayName] as T[] || [];
      const updatedArray = array.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      await firestoreService.updateDocument('brands', brandId, {
        [arrayName]: updatedArray
      });
    } catch (error: any) {
      throw new Error(`Failed to update item in ${String(arrayName)}: ${error.message}`);
    }
  }

  // Remove item from a brand's nested array
  static async removeFromBrandArray<T extends { id: string }>(
    brandId: string,
    arrayName: keyof Brand,
    itemId: string
  ): Promise<void> {
    try {
      const brand = await firestoreService.getDocument<Brand>('brands', brandId);
      if (!brand) throw new Error('Brand not found');
      
      const array = brand[arrayName] as T[] || [];
      const updatedArray = array.filter(item => item.id !== itemId);
      
      await firestoreService.updateDocument('brands', brandId, {
        [arrayName]: updatedArray
      });
    } catch (error: any) {
      throw new Error(`Failed to remove item from ${String(arrayName)}: ${error.message}`);
    }
  }
}