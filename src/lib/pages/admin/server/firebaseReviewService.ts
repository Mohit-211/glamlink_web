
import { FirebaseHelpers } from './firebaseHelpers';

// ============================================
// BASIC TYPE DEFINITIONS
// ============================================

interface Review {
  id: string;
  name: string;
  rating: number;
  [key: string]: any;
}

interface Brand {
  id: string;
  name: string;
  [key: string]: any;
}

// ============================================
// FIREBASE REVIEW SERVICE - REVIEW CRUD OPERATIONS
// ============================================

class FirebaseReviewService {
  // Add a new review to brand
  async addReview(brandId: string, review: Review): Promise<void> {
    return FirebaseHelpers.addToBrandArray(brandId, 'reviews', review);
  }

  // Update an existing review
  async updateReview(brandId: string, reviewId: string, updates: Partial<Review>): Promise<void> {
    return FirebaseHelpers.updateInBrandArray(brandId, 'reviews', reviewId, updates);
  }

  // Remove a review from brand
  async removeReview(brandId: string, reviewId: string): Promise<void> {
    return FirebaseHelpers.removeFromBrandArray(brandId, 'reviews', reviewId);
  }

  // Batch add multiple reviews
  async addMultipleReviews(brandId: string, reviews: Review[]): Promise<void> {
    for (const review of reviews) {
      await this.addReview(brandId, review);
    }
  }

  // Update review helpful count
  async updateHelpfulCount(brandId: string, reviewId: string, helpfulCount: number): Promise<void> {
    return this.updateReview(brandId, reviewId, { helpfulCount });
  }

  // Increment helpful count
  async incrementHelpfulCount(brandId: string, reviewId: string): Promise<void> {
    // Note: This requires fetching the current count first
    // In a real implementation, you might want to use Firestore increment
    const brand = await FirebaseHelpers.getBrand(brandId);
    if (brand) {
      const review = brand.reviews?.find(r => r.id === reviewId);
      if (review) {
        return this.updateHelpfulCount(brandId, reviewId, review.helpfulCount + 1);
      }
    }
  }

  // Update review verification status
  async updateVerifiedPurchase(brandId: string, reviewId: string, verifiedPurchase: boolean): Promise<void> {
    return this.updateReview(brandId, reviewId, { verifiedPurchase });
  }

  // Add images to review
  async addReviewImages(brandId: string, reviewId: string, images: string[]): Promise<void> {
    return this.updateReview(brandId, reviewId, { images });
  }

  // Get reviews for a specific product
  async getProductReviews(brandId: string, productId: string): Promise<Review[]> {
    const brand = await FirebaseHelpers.getBrand(brandId);
    if (!brand) return [];
    return brand.reviews?.filter(r => r.productId === productId) || [];
  }

  // Get reviews for a specific provider
  async getProviderReviews(brandId: string, providerId: string): Promise<Review[]> {
    const brand = await FirebaseHelpers.getBrand(brandId);
    if (!brand) return [];
    return brand.reviews?.filter(r => r.providerId === providerId) || [];
  }

  // Calculate average rating for a product or provider
  async calculateAverageRating(reviews: Review[]): Promise<{ rating: number; count: number }> {
    if (reviews.length === 0) return { rating: 0, count: 0 };
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      rating: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length
    };
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
const firebaseReviewService = new FirebaseReviewService();
export default firebaseReviewService;