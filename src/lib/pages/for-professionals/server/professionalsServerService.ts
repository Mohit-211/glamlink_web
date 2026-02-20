import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
  Firestore,
  limit
} from "firebase/firestore";
import { Professional } from "../types";

const COLLECTION_NAME = "professionals";

export interface FirebaseProfessional extends Omit<Professional, 'createdAt' | 'updatedAt'> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

class ProfessionalsServerService {
  /**
   * Get all professionals from Firebase
   */
  async getAllProfessionals(db: Firestore, includeHidden: boolean = false): Promise<Professional[]> {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const q = query(collectionRef, orderBy("name", "asc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No professionals found in Firebase");
        return [];
      }

      return snapshot.docs
        .map((docSnapshot) => {
          const data = docSnapshot.data() as FirebaseProfessional;
          // Convert Firebase timestamps to strings and remove Firebase-specific fields
          const {
            createdAt,
            updatedAt,
            ...professional
          } = data;

          return {
            ...professional,
            id: docSnapshot.id, // CRITICAL: Include document ID
            createdAt: createdAt?.toDate?.().toISOString() || createdAt,
            updatedAt: updatedAt?.toDate?.().toISOString() || updatedAt
          } as Professional;
        })
        .sort((a, b) => {
          // Sort by order first (nulls last), then by name
          // Handle null/undefined order values - they should come last
          const aOrder = a.order === null || a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
          const bOrder = b.order === null || b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;

          // Primary sort by order
          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }

          // Secondary sort by name
          return a.name.localeCompare(b.name);
        })
        .filter((professional) => {
          // If includeHidden is false, filter out non-featured professionals
          // If featured is undefined, default to false (don't show in main listing)
          if (!includeHidden) {
            return professional.featured === true;
          }
          return true;
        });
    } catch (error) {
      console.error("Error fetching professionals from Firebase:", error);
      return [];
    }
  }

  /**
   * Get only visible (featured) professionals from Firebase
   */
  async getVisibleProfessionals(db: Firestore): Promise<Professional[]> {
    return this.getAllProfessionals(db, false);
  }

  /**
   * Get featured professionals from Firebase
   */
  async getFeaturedProfessionals(db: Firestore): Promise<Professional[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allProfessionals = await this.getAllProfessionals(db, false);

      // Filter in JavaScript for featured professionals
      const featuredProfessionals = allProfessionals
        .filter(professional => professional.featured === true)
        .sort((a, b) => {
          // Sort by rating (desc) then by name (asc)
          if (b.rating !== a.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.name.localeCompare(b.name);
        })
        .slice(0, 20); // Limit to top 20

      return featuredProfessionals;
    } catch (error) {
      console.error("Error fetching featured professionals from Firebase:", error);
      return [];
    }
  }

  /**
   * Get founding professionals from Firebase
   */
  async getFoundingProfessionals(db: Firestore): Promise<Professional[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allProfessionals = await this.getAllProfessionals(db, true);

      // Filter in JavaScript for founding professionals
      const foundingProfessionals = allProfessionals
        .filter(professional => professional.isFounder === true)
        .sort((a, b) => {
          // Sort by name (asc)
          return a.name.localeCompare(b.name);
        });

      return foundingProfessionals;
    } catch (error) {
      console.error("Error fetching founding professionals from Firebase:", error);
      return [];
    }
  }

  /**
   * Get professionals by specialty
   */
  async getProfessionalsBySpecialty(db: Firestore, specialty: string): Promise<Professional[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allProfessionals = await this.getAllProfessionals(db, false);

      // Filter in JavaScript for specialty and featured professionals
      const specialtyProfessionals = allProfessionals
        .filter(professional => {
          if (!professional.featured) return false;
          return professional.specialty.toLowerCase().includes(specialty.toLowerCase());
        })
        .sort((a, b) => {
          // Sort by rating (desc) then by name (asc)
          if (b.rating !== a.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.name.localeCompare(b.name);
        });

      return specialtyProfessionals;
    } catch (error) {
      console.error(`Error fetching professionals for specialty ${specialty}:`, error);
      return [];
    }
  }

  /**
   * Get professionals by location
   */
  async getProfessionalsByLocation(db: Firestore, location: string): Promise<Professional[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allProfessionals = await this.getAllProfessionals(db, false);

      // Filter in JavaScript for location and featured professionals
      const locationProfessionals = allProfessionals
        .filter(professional => {
          if (!professional.featured) return false;
          return professional.location.toLowerCase().includes(location.toLowerCase());
        })
        .sort((a, b) => {
          // Sort by rating (desc) then by name (asc)
          if (b.rating !== a.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.name.localeCompare(b.name);
        });

      return locationProfessionals;
    } catch (error) {
      console.error(`Error fetching professionals for location ${location}:`, error);
      return [];
    }
  }

  /**
   * Get professionals by certification level
   */
  async getProfessionalsByCertification(db: Firestore, certificationLevel: string): Promise<Professional[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allProfessionals = await this.getAllProfessionals(db, false);

      // Filter in JavaScript for certification level and featured professionals
      const certificationProfessionals = allProfessionals
        .filter(professional => {
          if (!professional.featured) return false;
          return professional.certificationLevel === certificationLevel;
        })
        .sort((a, b) => {
          // Sort by rating (desc) then by name (asc)
          if (b.rating !== a.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.name.localeCompare(b.name);
        });

      return certificationProfessionals;
    } catch (error) {
      console.error(`Error fetching professionals for certification level ${certificationLevel}:`, error);
      return [];
    }
  }

  /**
   * Search professionals by query
   */
  async searchProfessionals(db: Firestore, searchQuery: string): Promise<Professional[]> {
    try {
      if (!searchQuery) {
        return this.getAllProfessionals(db, false);
      }

      // Use simple query without compound filters to avoid index issues
      const allProfessionals = await this.getAllProfessionals(db, false);

      // Filter in JavaScript for search query and featured professionals
      const searchProfessionals = allProfessionals
        .filter(professional => {
          if (!professional.featured) return false;

          const lowercaseQuery = searchQuery.toLowerCase();

          // Search in basic fields
          const basicFieldsMatch = (
            professional.name.toLowerCase().includes(lowercaseQuery) ||
            professional.title.toLowerCase().includes(lowercaseQuery) ||
            professional.specialty.toLowerCase().includes(lowercaseQuery) ||
            professional.location.toLowerCase().includes(lowercaseQuery) ||
            (professional.instagram && professional.instagram.toLowerCase().includes(lowercaseQuery)) ||
            (professional.bio && professional.bio.toLowerCase().includes(lowercaseQuery)) ||
            (professional.description && professional.description.toLowerCase().includes(lowercaseQuery))
          );

          // Search in enhanced specialties array
          const specialtiesMatch = professional.specialties?.some(specialty =>
            specialty.toLowerCase().includes(lowercaseQuery)
          );

          // Search in enhanced social links
          const socialLinksMatch = professional.enhancedSocialLinks &&
            Object.values(professional.enhancedSocialLinks).some((link: any) =>
              link && (typeof link === 'string' ? link : (link as any).url || '').toLowerCase().includes(lowercaseQuery)
            );

          // Search in promotions
          const promotionsMatch = professional.promotions?.some(promotion =>
            promotion.title.toLowerCase().includes(lowercaseQuery) ||
            (promotion.description && promotion.description.toLowerCase().includes(lowercaseQuery))
          );

          // Search in tags and SEO keywords
          const tagsMatch = professional.tags?.some(tag =>
            tag.toLowerCase().includes(lowercaseQuery)
          ) || professional.seoKeywords?.some(keyword =>
            keyword.toLowerCase().includes(lowercaseQuery)
          );

          return basicFieldsMatch || specialtiesMatch || socialLinksMatch || promotionsMatch || tagsMatch;
        })
        .sort((a, b) => {
          // Sort by rating (desc) then by name (asc)
          if (b.rating !== a.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.name.localeCompare(b.name);
        });

      return searchProfessionals;
    } catch (error) {
      console.error(`Error searching professionals with query "${searchQuery}":`, error);
      return [];
    }
  }

  /**
   * Get a single professional by ID
   */
  async getProfessionalById(db: Firestore, id: string, checkVisibility: boolean = true): Promise<Professional | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const documentSnapshot = await getDoc(docRef);

      if (!documentSnapshot.exists()) {
        return null;
      }

      const data = documentSnapshot.data() as FirebaseProfessional;
      const {
        createdAt,
        updatedAt,
        ...professional
      } = data;

      // Check visibility if requested
      if (checkVisibility && professional.featured === false) {
        return null;
      }

      return {
        ...professional,
        id: documentSnapshot.id, // CRITICAL: Include document ID
        createdAt: createdAt?.toDate?.().toISOString() || createdAt,
        updatedAt: updatedAt?.toDate?.().toISOString() || updatedAt
      } as Professional;
    } catch (error) {
      console.error("Error fetching professional:", error);
      return null;
    }
  }

  /**
   * Get a professional by cardUrl or fall back to document ID
   * This supports looking up professionals by their custom URL slug
   */
  async getProfessionalByIdOrCardUrl(db: Firestore, idOrCardUrl: string, checkVisibility: boolean = true): Promise<Professional | null> {
    try {
      // First, try to find by cardUrl field
      const collectionRef = collection(db, COLLECTION_NAME);
      const cardUrlQuery = query(collectionRef, where("cardUrl", "==", idOrCardUrl), limit(1));
      const cardUrlSnapshot = await getDocs(cardUrlQuery);

      if (!cardUrlSnapshot.empty) {
        const docSnapshot = cardUrlSnapshot.docs[0];
        const data = docSnapshot.data() as FirebaseProfessional;
        const { createdAt, updatedAt, ...professional } = data;

        // Check visibility if requested
        if (checkVisibility && professional.featured === false) {
          return null;
        }

        return {
          ...professional,
          id: docSnapshot.id,
          createdAt: createdAt?.toDate?.().toISOString() || createdAt,
          updatedAt: updatedAt?.toDate?.().toISOString() || updatedAt
        } as Professional;
      }

      // If not found by cardUrl, fall back to document ID lookup
      return this.getProfessionalById(db, idOrCardUrl, checkVisibility);
    } catch (error) {
      console.error("Error fetching professional by ID or cardUrl:", error);
      // Fall back to ID lookup on error
      return this.getProfessionalById(db, idOrCardUrl, checkVisibility);
    }
  }

  /**
   * Create a new professional with auto-generated ID
   */
  async createProfessionalWithAutoId(db: Firestore, professionalData: Omit<Professional, 'id'>): Promise<Professional | null> {
    try {
      const docRef = doc(collection(db, COLLECTION_NAME));
      const id = docRef.id;

      const newProfessional: Professional = {
        ...professionalData,
        id,
      };

      const firebaseProfessional: FirebaseProfessional = {
        ...newProfessional,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, firebaseProfessional);
      console.log(`Created professional ${id} in Firebase`);

      // Return the created professional with proper date formatting
      return {
        ...newProfessional,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error creating professional:", error);
      return null;
    }
  }

  /**
   * Create a new professional
   */
  async createProfessional(db: Firestore, professional: Professional): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, professional.id);

      // Check if professional already exists
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        console.log(`Professional ${professional.id} already exists`);
        return false;
      }

      const firebaseProfessional: FirebaseProfessional = {
        ...professional,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, firebaseProfessional);
      console.log(`Created professional ${professional.id} in Firebase`);
      return true;
    } catch (error) {
      console.error("Error creating professional:", error);
      return false;
    }
  }

  /**
   * Update an existing professional and return the updated data
   */
  async updateProfessionalAndReturn(db: Firestore, id: string, updates: Partial<Professional>): Promise<Professional | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      // Check if professional exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.log(`Professional ${id} not found`);
        return null;
      }

      // Prepare updates with timestamp
      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, firebaseUpdates);

      // Fetch and return the updated professional
      const updatedProfessional = await this.getProfessionalById(db, id, false);
      console.log(`Updated professional ${id} in Firebase`);

      return updatedProfessional;
    } catch (error) {
      console.error("Error updating professional:", error);
      return null;
    }
  }

  /**
   * Update an existing professional
   */
  async updateProfessional(db: Firestore, id: string, updates: Partial<Professional>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      // Check if professional exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.log(`Professional ${id} not found`);
        return false;
      }

      // Prepare updates with timestamp
      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, firebaseUpdates);

      console.log(`Updated professional ${id} in Firebase`);
      return true;
    } catch (error) {
      console.error("Error updating professional:", error);
      return false;
    }
  }

  /**
   * Delete a professional
   */
  async deleteProfessional(db: Firestore, id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log(`Deleted professional ${id} from Firebase`);
      return true;
    } catch (error) {
      console.error("Error deleting professional:", error);
      return false;
    }
  }

  /**
   * Bulk upload multiple professionals (for migration)
   */
  async bulkUploadProfessionals(db: Firestore, professionals: Professional[]): Promise<{ success: number; failed: number }> {
    const batch = writeBatch(db);
    let success = 0;
    let failed = 0;

    for (const professional of professionals) {
      try {
        console.log(`Processing professional ${professional.id}:`, JSON.stringify(professional, null, 2));

        const docRef = doc(db, COLLECTION_NAME, professional.id);

        // Check if already exists
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          console.log(`Skipping ${professional.id} - already exists`);
          failed++;
          continue;
        }

        const firebaseProfessional: FirebaseProfessional = {
          ...professional,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        // Convert undefined fields to null that Firebase accepts
        Object.keys(firebaseProfessional).forEach(key => {
          if ((firebaseProfessional as any)[key] === undefined) {
            (firebaseProfessional as any)[key] = null;
          }
        });

        console.log(`Firebase professional prepared for ${professional.id}:`, JSON.stringify(firebaseProfessional, null, 2));

        batch.set(docRef, firebaseProfessional);
        success++;
      } catch (error) {
        console.error(`Error preparing professional ${professional.id} for upload:`, error);
        failed++;
      }
    }

    if (success > 0) {
      try {
        await batch.commit();
        console.log(`Successfully uploaded ${success} professionals to Firebase`);
      } catch (error) {
        console.error("Error committing batch upload:", error);
        return { success: 0, failed: professionals.length };
      }
    }

    return { success, failed };
  }

  /**
   * Check if Firebase collection has any professionals
   */
  async hasProfessionals(db: Firestore): Promise<boolean> {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(collectionRef);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking Firebase for professionals:", error);
      return false;
    }
  }

  /**
   * Update a single professional's order value (for fractional ordering)
   * This is an O(1) operation - only updates one document
   */
  async updateProfessionalOrder(
    db: Firestore,
    professionalId: string,
    newOrder: number
  ): Promise<Professional | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, professionalId);

      // Check if professional exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.log(`Professional ${professionalId} not found`);
        return null;
      }

      // Update only the order field
      await updateDoc(docRef, {
        order: newOrder,
        updatedAt: Timestamp.now()
      });

      console.log(`Updated order for professional ${professionalId} to ${newOrder}`);

      // Return the updated professional
      return this.getProfessionalById(db, professionalId, false);
    } catch (error) {
      console.error(`Error updating order for professional ${professionalId}:`, error);
      return null;
    }
  }

  /**
   * Rebalance all order values with even gaps (1000, 2000, 3000, ...)
   * Called automatically when precision gets too low
   */
  async rebalanceAllOrders(db: Firestore): Promise<boolean> {
    try {
      // Get all professionals sorted by current order
      const allProfessionals = await this.getAllProfessionals(db, true);

      if (allProfessionals.length === 0) {
        console.log('No professionals to rebalance');
        return true;
      }

      // Create batch for atomic update
      const batch = writeBatch(db);
      const DEFAULT_GAP = 1000;

      // Assign new order values with even gaps
      allProfessionals.forEach((professional, index) => {
        const docRef = doc(db, COLLECTION_NAME, professional.id);
        const newOrder = (index + 1) * DEFAULT_GAP;
        batch.update(docRef, {
          order: newOrder,
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
      console.log(`Rebalanced order values for ${allProfessionals.length} professionals`);
      return true;
    } catch (error) {
      console.error('Error rebalancing order values:', error);
      return false;
    }
  }

  /**
   * Initialize order values for professionals that don't have them
   * Assigns values based on current sort (by name alphabetically)
   */
  async initializeOrders(db: Firestore): Promise<{ initialized: number; total: number }> {
    try {
      const allProfessionals = await this.getAllProfessionals(db, true);

      // Find professionals without order values
      const withoutOrders = allProfessionals.filter(
        p => p.order === null || p.order === undefined
      );

      if (withoutOrders.length === 0) {
        console.log('All professionals already have order values');
        return { initialized: 0, total: allProfessionals.length };
      }

      // Find max existing order value
      const maxExistingOrder = allProfessionals.reduce(
        (max, p) => Math.max(max, p.order ?? 0),
        0
      );

      // Sort professionals without orders by name
      withoutOrders.sort((a, b) => a.name.localeCompare(b.name));

      // Create batch for atomic update
      const batch = writeBatch(db);
      const DEFAULT_GAP = 1000;

      // Assign order values starting after max existing
      let nextOrder = maxExistingOrder + DEFAULT_GAP;
      withoutOrders.forEach((professional) => {
        const docRef = doc(db, COLLECTION_NAME, professional.id);
        batch.update(docRef, {
          order: nextOrder,
          updatedAt: Timestamp.now()
        });
        nextOrder += DEFAULT_GAP;
      });

      await batch.commit();
      console.log(`Initialized order values for ${withoutOrders.length} professionals`);

      return { initialized: withoutOrders.length, total: allProfessionals.length };
    } catch (error) {
      console.error('Error initializing order values:', error);
      return { initialized: 0, total: 0 };
    }
  }

  /**
   * Get professional statistics
   */
  async getProfessionalStats(db: Firestore): Promise<{
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
      // Get all professionals for stats calculation
      const allProfessionals = await this.getAllProfessionals(db, true);

      const stats = {
        total: allProfessionals.length,
        featured: allProfessionals.filter(p => p.featured === true).length,
        founding: allProfessionals.filter(p => p.isFounder === true).length,
        platinum: allProfessionals.filter(p => p.certificationLevel === "Platinum").length,
        gold: allProfessionals.filter(p => p.certificationLevel === "Gold").length,
        silver: allProfessionals.filter(p => p.certificationLevel === "Silver").length,
        bronze: allProfessionals.filter(p => p.certificationLevel === "Bronze").length,
        averageRating: allProfessionals.length > 0
          ? allProfessionals.reduce((sum, p) => sum + (p.rating || 0), 0) / allProfessionals.length
          : 0,
        totalReviews: allProfessionals.reduce((sum, p) => sum + (p.reviewCount || 0), 0)
      };

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
const professionalsServerService = new ProfessionalsServerService();
export default professionalsServerService;