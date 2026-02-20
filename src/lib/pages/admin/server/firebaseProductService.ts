import { FirebaseHelpers } from './firebaseHelpers';

// ============================================
// BASIC TYPE DEFINITIONS
// ============================================

interface Product {
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
// FIREBASE PRODUCT SERVICE - PRODUCT CRUD OPERATIONS
// ============================================

class FirebaseProductService {
  // Add a new product to brand
  async addProduct(brandId: string, product: Product): Promise<void> {
    return FirebaseHelpers.addToBrandArray(brandId, 'products', product);
  }

  // Update an existing product
  async updateProduct(brandId: string, productId: string, updates: Partial<Product>): Promise<void> {
    return FirebaseHelpers.updateInBrandArray(brandId, 'products', productId, updates);
  }

  // Remove a product from brand
  async removeProduct(brandId: string, productId: string): Promise<void> {
    return FirebaseHelpers.removeFromBrandArray(brandId, 'products', productId);
  }

  // Batch add multiple products
  async addMultipleProducts(brandId: string, products: Product[]): Promise<void> {
    for (const product of products) {
      await this.addProduct(brandId, product);
    }
  }

  // Update product stock status
  async updateProductStock(brandId: string, productId: string, inStock: boolean): Promise<void> {
    return this.updateProduct(brandId, productId, { inStock });
  }

  // Update product spotlight status
  async updateProductSpotlight(brandId: string, productId: string, isSpotlight: boolean): Promise<void> {
    return this.updateProduct(brandId, productId, { isSpotlight });
  }

  // Update product pricing
  async updateProductPricing(brandId: string, productId: string, pricing: {
    price: number;
    originalPrice?: number;
  }): Promise<void> {
    return this.updateProduct(brandId, productId, pricing);
  }

  // Update product images
  async updateProductImages(brandId: string, productId: string, images: {
    image?: string;
    thumbnailImage?: string;
    images?: string[];
    imageAlt?: string;
    imagesAlt?: string[];
  }): Promise<void> {
    return this.updateProduct(brandId, productId, images);
  }

  // Update product transformation images
  async updateProductTransformationImages(brandId: string, productId: string, transformationImages: {
    beforeImagePrimary?: string;
    beforeImages?: Array<{ url: string; altText: string }>;
    afterImagePrimary?: string;
    afterImages?: Array<{ url: string; altText: string }>;
  }): Promise<void> {
    return this.updateProduct(brandId, productId, transformationImages);
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
const firebaseProductService = new FirebaseProductService();
export default firebaseProductService;