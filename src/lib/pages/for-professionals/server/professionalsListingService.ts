import { getAuthenticatedAppForUser, getPublicFirebaseApp } from "@/lib/firebase/serverApp";
import { FEATURE_FLAGS } from "@/lib/config/features";
import professionalsServerService from "./professionalsServerService";
import { Professional } from "../types";

class ProfessionalsListingService {
  /**
   * Get all public professionals for display
   * This runs on the server, so no localStorage or client-side checks
   */
  async getPublicProfessionals(): Promise<Professional[]> {
    try {
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();
      if (!db) {
        console.log("Checking API for records... no database available");
        console.error("No database available and no fallback configured");
        return [];
      }

      const visibleProfessionals = await professionalsServerService.getVisibleProfessionals(db);
      console.log("Found professionals in Firebase, displaying them...");
      return visibleProfessionals;
    } catch (error) {
      console.error("Error fetching public professionals:", error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get featured professionals for display
   */
  async getFeaturedProfessionals(): Promise<Professional[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("Checking API for records... no records found, returning empty array...");
        // Return empty array when no database is available
        return [];
      }

      // Get featured professionals from Firebase
      const featuredProfessionals = await professionalsServerService.getFeaturedProfessionals(db);

      console.log("Checking API for records... found records, displaying them...");
      return featuredProfessionals;
    } catch (error) {
      console.error("Error fetching featured professionals:", error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get founding professionals for display
   */
  async getFoundingProfessionals(): Promise<Professional[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("Checking API for records... no records found, returning empty array...");
        // Return empty array when no database is available
        return [];
      }

      // Get founding professionals from Firebase
      const foundingProfessionals = await professionalsServerService.getFoundingProfessionals(db);

      console.log("Checking API for records... found records, displaying them...");
      return foundingProfessionals;
    } catch (error) {
      console.error("Error fetching founding professionals:", error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get all professionals (including non-featured) for admin display
   */
  async getAllProfessionalsForAdmin(): Promise<Professional[]> {
    try {
      // For admin, always try to get authenticated app
      const { db, currentUser } = await getAuthenticatedAppForUser();

      if (!db || !currentUser) {
        console.log("No authenticated Firebase db available for admin");
        return [];
      }

      // Get all professionals (including non-featured) from Firebase
      const allProfessionals = await professionalsServerService.getAllProfessionals(db, true);

      console.log(`Found ${allProfessionals.length} total professionals in Firebase for admin`);
      return allProfessionals;
    } catch (error) {
      console.error("Error fetching all professionals for admin:", error);
      return [];
    }
  }

  /**
   * Get a single professional by ID
   */
  async getProfessionalById(id: string): Promise<Professional | null> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available");
        // Mock data file not found, returning null
        return null;
      }

      const professional = await professionalsServerService.getProfessionalById(db, id);
      return professional;
    } catch (error) {
      console.error("Error fetching professional:", error);
      return null;
    }
  }

  /**
   * Get professionals by specialty
   */
  async getProfessionalsBySpecialty(specialty: string): Promise<Professional[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning empty array");
        return [];
      }

      // Get professionals by specialty from Firebase
      const specialtyProfessionals = await professionalsServerService.getProfessionalsBySpecialty(db, specialty);

      console.log(`Found ${specialtyProfessionals.length} professionals for specialty ${specialty} in Firebase`);
      return specialtyProfessionals;
    } catch (error) {
      console.error(`Error fetching professionals for specialty ${specialty}:`, error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get professionals by location
   */
  async getProfessionalsByLocation(location: string): Promise<Professional[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning empty array");
        return [];
      }

      // Get professionals by location from Firebase
      const locationProfessionals = await professionalsServerService.getProfessionalsByLocation(db, location);

      console.log(`Found ${locationProfessionals.length} professionals for location ${location} in Firebase`);
      return locationProfessionals;
    } catch (error) {
      console.error(`Error fetching professionals for location ${location}:`, error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Get professionals by certification level
   */
  async getProfessionalsByCertification(certificationLevel: string): Promise<Professional[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning empty array");
        return [];
      }

      // Get professionals by certification level from Firebase
      const certificationProfessionals = await professionalsServerService.getProfessionalsByCertification(db, certificationLevel);

      console.log(`Found ${certificationProfessionals.length} professionals for certification level ${certificationLevel} in Firebase`);
      return certificationProfessionals;
    } catch (error) {
      console.error(`Error fetching professionals for certification level ${certificationLevel}:`, error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Search professionals by query
   */
  async searchProfessionals(query: string): Promise<Professional[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning empty search results");
        // Return empty array when database is unavailable
        return [];
      }

      // Search professionals in Firebase
      const searchResults = await professionalsServerService.searchProfessionals(db, query);

      console.log(`Found ${searchResults.length} search results for query "${query}" in Firebase`);
      return searchResults;
    } catch (error) {
      console.error(`Error searching professionals with query "${query}":`, error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Check if professionals collection has data
   */
  async hasProfessionalsData(): Promise<boolean> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available for checking professionals data");
        return false;
      }

      return await professionalsServerService.hasProfessionals(db);
    } catch (error) {
      console.error("Error checking professionals data:", error);
      return false;
    }
  }

  /**
   * Get professional statistics
   */
  async getProfessionalStats(): Promise<{
    total: number;
    featured: number;
    founding: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    averageRating: number;
    totalReviews: number;
  }> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_PROFESSIONALS_AUTH || false;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning empty stats");
        // Return empty stats when database is unavailable
        return {
          total: 0,
          featured: 0,
          founding: 0,
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
          averageRating: 0,
          totalReviews: 0
        };
      }

      // Get stats from Firebase
      const stats = await professionalsServerService.getProfessionalStats(db);

      console.log("Professional stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error fetching professional stats:", error);
      return {
        total: 0,
        featured: 0,
        founding: 0,
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        averageRating: 0,
        totalReviews: 0
      };
    }
  }
}

// Export singleton instance
const professionalsListingService = new ProfessionalsListingService();
export default professionalsListingService;