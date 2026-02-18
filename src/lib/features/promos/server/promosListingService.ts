import { getAuthenticatedAppForUser, getPublicFirebaseApp } from "@/lib/firebase/serverApp";
import { FEATURE_FLAGS } from "@/lib/config/features";
import promosServerService from "./promosServerService";
import { PromoItem } from "../config";
import { getMockActivePromos, getMockFeaturedPromos } from "../mockData";

class PromosListingService {
  /**
   * Get all public promos for display
   * This runs on the server, so no localStorage or client-side checks
   */
  async getPublicPromos(): Promise<PromoItem[]> {
    try {
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROMOS_AUTH || false;
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();
      if (!db) {
        console.log("Checking API for records... no database available");

        // Check if file fallback is disabled
        if (FEATURE_FLAGS.DISABLE_FILE_FALLBACK) {
          console.log("File fallback disabled, returning mock data...");
          return getMockActivePromos();
        }

        // File fallback logic would go here if not disabled
        console.log("No database available, using mock data...");
        return getMockActivePromos();
      }

      const visiblePromos = await promosServerService.getActivePromos(db);
      if (visiblePromos.length === 0) {
        console.log("No promos found in Firebase");
        if (FEATURE_FLAGS.DISABLE_FILE_FALLBACK) {
          console.log("File fallback disabled, using mock data...");
          return getMockActivePromos();
        }

        // File fallback logic would go here if not disabled
        console.log("Using mock data fallback...");
        return getMockActivePromos();
      }

      console.log("Found promos in Firebase, displaying them...");
      return visiblePromos;
    } catch (error) {
      console.error("Error fetching public promos:", error);
      // Return mock data on error
      return getMockActivePromos();
    }
  }

  /**
   * Get featured promos for display
   */
  async getFeaturedPromos(): Promise<PromoItem[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROMOS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("Checking API for records... no records found, using mock data...");
        // Return mock data when no database is available
        return getMockFeaturedPromos();
      }

      // Get featured promos from Firebase
      const featuredPromos = await promosServerService.getFeaturedPromos(db);

      // If no featured promos in Firebase, fall back to mock data
      if (featuredPromos.length === 0) {
        console.log("Checking API for records... no records found, using mock data...");
        return getMockFeaturedPromos();
      }

      console.log("Checking API for records... found records, displaying them...");
      return featuredPromos;
    } catch (error) {
      console.error("Error fetching featured promos:", error);
      // Return mock data on error
      return getMockFeaturedPromos();
    }
  }

  /**
   * Get all promos (including hidden) for admin display
   */
  async getAllPromosForAdmin(): Promise<PromoItem[]> {
    try {
      // For admin, always try to get authenticated app
      const { db, currentUser } = await getAuthenticatedAppForUser();

      if (!db || !currentUser) {
        console.log("No authenticated Firebase db available for admin");
        return [];
      }

      // Get all promos (including hidden) from Firebase
      const allPromos = await promosServerService.getAllPromos(db, true);

      console.log(`Found ${allPromos.length} total promos in Firebase for admin`);
      return allPromos;
    } catch (error) {
      console.error("Error fetching all promos for admin:", error);
      return [];
    }
  }

  /**
   * Get a single promo by ID
   */
  async getPromoById(id: string): Promise<PromoItem | null> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROMOS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available");
        // Try to get from mock data
        const mockPromos = getMockActivePromos();
        return mockPromos.find(promo => promo.id === id) || null;
      }

      const promo = await promosServerService.getPromoById(db, id);

      if (!promo) {
        // Try to get from mock data as fallback
        const mockPromos = getMockActivePromos();
        return mockPromos.find(mockPromo => mockPromo.id === id) || null;
      }

      return promo;
    } catch (error) {
      console.error("Error fetching promo:", error);
      return null;
    }
  }

  /**
   * Get promos by category
   */
  async getPromosByCategory(category: string): Promise<PromoItem[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROMOS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning mock promos for category");
        // Return mock data filtered by category
        const mockPromos = getMockActivePromos();
        return category === "All"
          ? mockPromos
          : mockPromos.filter(promo => promo.category === category);
      }

      // Get promos by category from Firebase
      const categoryPromos = await promosServerService.getPromosByCategory(db, category);

      // If no promos found in Firebase, fall back to mock data
      if (categoryPromos.length === 0) {
        console.log(`No promos found for category ${category} in Firebase, using mock data`);
        const mockPromos = getMockActivePromos();
        return category === "All"
          ? mockPromos
          : mockPromos.filter(promo => promo.category === category);
      }

      console.log(`Found ${categoryPromos.length} promos for category ${category} in Firebase`);
      return categoryPromos;
    } catch (error) {
      console.error(`Error fetching promos for category ${category}:`, error);
      // Return mock data on error
      const mockPromos = getMockActivePromos();
      return category === "All"
        ? mockPromos
        : mockPromos.filter(promo => promo.category === category);
    }
  }

  /**
   * Check if promos collection has data
   */
  async hasPromosData(): Promise<boolean> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROMOS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available for checking promos data");
        return false;
      }

      return await promosServerService.hasPromos(db);
    } catch (error) {
      console.error("Error checking promos data:", error);
      return false;
    }
  }

  /**
   * Get promo statistics
   */
  async getPromoStats(): Promise<{
    total: number;
    active: number;
    featured: number;
    expired: number;
    upcoming: number;
  }> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROMOS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, using mock stats");
        // Calculate stats from mock data
        const mockPromos = getMockActivePromos();
        const now = new Date();

        const stats = {
          total: mockPromos.length,
          active: mockPromos.filter(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return now >= start && now <= end;
          }).length,
          featured: mockPromos.filter(p => p.featured).length,
          expired: mockPromos.filter(p => now > new Date(p.endDate)).length,
          upcoming: mockPromos.filter(p => now < new Date(p.startDate)).length
        };

        return stats;
      }

      // Get all promos for stats calculation
      const allPromos = await promosServerService.getAllPromos(db, true);
      const now = new Date();

      const stats = {
        total: allPromos.length,
        active: allPromos.filter(p => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          return now >= start && now <= end;
        }).length,
        featured: allPromos.filter(p => p.featured).length,
        expired: allPromos.filter(p => now > new Date(p.endDate)).length,
        upcoming: allPromos.filter(p => now < new Date(p.startDate)).length
      };

      console.log("Promo stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error fetching promo stats:", error);
      return {
        total: 0,
        active: 0,
        featured: 0,
        expired: 0,
        upcoming: 0
      };
    }
  }
}

// Export singleton instance
const promosListingService = new PromosListingService();
export default promosListingService;