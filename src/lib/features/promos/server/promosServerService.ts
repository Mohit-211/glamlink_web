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
  limit,
  DocumentSnapshot
} from "firebase/firestore";
import { PromoItem } from "../config";

const COLLECTION_NAME = "promos";

export interface FirebasePromo extends Omit<PromoItem, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> {
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

class PromosServerService {
  /**
   * Get all promos from Firebase
   */
  async getAllPromos(db: Firestore, includeHidden: boolean = false): Promise<PromoItem[]> {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const q = query(collectionRef, orderBy("endDate", "asc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No promos found in Firebase");
        return [];
      }

      return snapshot.docs
        .map((docSnapshot) => {
          const data = docSnapshot.data() as FirebasePromo;
          // Convert Firebase timestamps to strings and remove Firebase-specific fields
          const {
            createdAt,
            updatedAt,
            startDate: fbStartDate,
            endDate: fbEndDate,
            ...promo
          } = data;

          return {
            ...promo,
            id: docSnapshot.id, // CRITICAL: Include document ID
            startDate: fbStartDate instanceof Timestamp ? fbStartDate.toDate().toISOString().split('T')[0] : fbStartDate,
            endDate: fbEndDate instanceof Timestamp ? fbEndDate.toDate().toISOString().split('T')[0] : fbEndDate,
            createdAt: createdAt?.toDate?.().toISOString() || createdAt,
            updatedAt: updatedAt?.toDate?.().toISOString() || updatedAt
          } as PromoItem;
        })
        .filter((promo) => {
          // If includeHidden is false, filter out hidden promos
          // If visible is undefined, default to true (show the promo)
          if (!includeHidden) {
            return promo.visible !== false;
          }
          return true;
        });
    } catch (error) {
      console.error("Error fetching promos from Firebase:", error);
      return [];
    }
  }

  /**
   * Get only visible promos from Firebase
   */
  async getVisiblePromos(db: Firestore): Promise<PromoItem[]> {
    return this.getAllPromos(db, false);
  }

  /**
   * Get featured promos from Firebase
   */
  async getFeaturedPromos(db: Firestore): Promise<PromoItem[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allPromos = await this.getAllPromos(db, false);

      // Filter in JavaScript for featured and visible promos
      const featuredPromos = allPromos
        .filter(promo => promo.featured === true && promo.visible !== false)
        .sort((a, b) => {
          // Sort by priority (desc) then by endDate (asc)
          if (b.priority !== a.priority) {
            return (b.priority || 5) - (a.priority || 5);
          }
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        })
        .slice(0, 10); // Limit to top 10

      return featuredPromos;
    } catch (error) {
      console.error("Error fetching featured promos from Firebase:", error);
      return [];
    }
  }

  /**
   * Get active promos (within start and end dates)
   */
  async getActivePromos(db: Firestore): Promise<PromoItem[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allPromos = await this.getAllPromos(db, false);

      // Filter in JavaScript for active promos
      const now = new Date();
      const activePromos = allPromos
        .filter(promo => {
          if (promo.visible === false) return false;
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);
          return now >= startDate && now <= endDate;
        })
        .sort((a, b) => {
          // Sort by priority (desc) then by endDate (asc)
          if (b.priority !== a.priority) {
            return (b.priority || 5) - (a.priority || 5);
          }
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        });

      return activePromos;
    } catch (error) {
      console.error("Error fetching active promos from Firebase:", error);
      return [];
    }
  }

  /**
   * Get a single promo by ID
   */
  async getPromoById(db: Firestore, id: string, checkVisibility: boolean = true): Promise<PromoItem | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const documentSnapshot = await getDoc(docRef);

      if (!documentSnapshot.exists()) {
        return null;
      }

      const data = documentSnapshot.data() as FirebasePromo;
      const {
        createdAt,
        updatedAt,
        startDate: fbStartDate,
        endDate: fbEndDate,
        ...promo
      } = data;

      // Check visibility if requested
      if (checkVisibility && promo.visible === false) {
        return null;
      }

      return {
        ...promo,
        id: documentSnapshot.id, // CRITICAL: Include document ID
        startDate: fbStartDate instanceof Timestamp ? fbStartDate.toDate().toISOString().split('T')[0] : fbStartDate,
        endDate: fbEndDate instanceof Timestamp ? fbEndDate.toDate().toISOString().split('T')[0] : fbEndDate,
        createdAt: createdAt?.toDate?.().toISOString() || createdAt,
        updatedAt: updatedAt?.toDate?.().toISOString() || updatedAt
      } as PromoItem;
    } catch (error) {
      console.error("Error fetching promo:", error);
      return null;
    }
  }

  /**
   * Create a new promo with auto-generated ID
   */
  async createPromoWithAutoId(db: Firestore, promoData: Omit<PromoItem, 'id'>): Promise<PromoItem | null> {
    try {
      const docRef = doc(collection(db, COLLECTION_NAME));
      const id = docRef.id;

      const newPromo: PromoItem = {
        ...promoData,
        id,
      };

      const firebasePromo: FirebasePromo = {
        ...newPromo,
        startDate: Timestamp.fromDate(new Date(newPromo.startDate)),
        endDate: Timestamp.fromDate(new Date(newPromo.endDate)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, firebasePromo);
      console.log(`Created promo ${id} in Firebase`);

      // Return the created promo with proper date formatting
      return {
        ...newPromo,
        startDate: newPromo.startDate,
        endDate: newPromo.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error creating promo:", error);
      return null;
    }
  }

  /**
   * Create a new promo
   */
  async createPromo(db: Firestore, promo: PromoItem): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, promo.id);

      // Check if promo already exists
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        console.log(`Promo ${promo.id} already exists`);
        return false;
      }

      const firebasePromo: FirebasePromo = {
        ...promo,
        startDate: Timestamp.fromDate(new Date(promo.startDate)),
        endDate: Timestamp.fromDate(new Date(promo.endDate)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, firebasePromo);
      console.log(`Created promo ${promo.id} in Firebase`);
      return true;
    } catch (error) {
      console.error("Error creating promo:", error);
      return false;
    }
  }

  /**
   * Update an existing promo and return the updated data
   */
  async updatePromoAndReturn(db: Firestore, id: string, updates: Partial<PromoItem>): Promise<PromoItem | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      // Check if promo exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.log(`Promo ${id} not found`);
        return null;
      }

      // Convert date strings to Timestamps if present
      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.startDate) {
        firebaseUpdates.startDate = Timestamp.fromDate(new Date(updates.startDate));
      }

      if (updates.endDate) {
        firebaseUpdates.endDate = Timestamp.fromDate(new Date(updates.endDate));
      }

      await updateDoc(docRef, firebaseUpdates);

      // Fetch and return the updated promo
      const updatedPromo = await this.getPromoById(db, id, false);
      console.log(`Updated promo ${id} in Firebase`);

      return updatedPromo;
    } catch (error) {
      console.error("Error updating promo:", error);
      return null;
    }
  }

  /**
   * Update an existing promo
   */
  async updatePromo(db: Firestore, id: string, updates: Partial<PromoItem>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      // Check if promo exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.log(`Promo ${id} not found`);
        return false;
      }

      // Convert date strings to Timestamps if present
      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.startDate) {
        firebaseUpdates.startDate = Timestamp.fromDate(new Date(updates.startDate));
      }

      if (updates.endDate) {
        firebaseUpdates.endDate = Timestamp.fromDate(new Date(updates.endDate));
      }

      await updateDoc(docRef, firebaseUpdates);

      console.log(`Updated promo ${id} in Firebase`);
      return true;
    } catch (error) {
      console.error("Error updating promo:", error);
      return false;
    }
  }

  /**
   * Delete a promo
   */
  async deletePromo(db: Firestore, id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log(`Deleted promo ${id} from Firebase`);
      return true;
    } catch (error) {
      console.error("Error deleting promo:", error);
      return false;
    }
  }

  /**
   * Bulk upload multiple promos (for migration)
   */
  async bulkUploadPromos(db: Firestore, promos: PromoItem[]): Promise<{ success: number; failed: number }> {
    const batch = writeBatch(db);
    let success = 0;
    let failed = 0;

    for (const promo of promos) {
      try {
        console.log(`Processing promo ${promo.id}:`, JSON.stringify(promo, null, 2));

        const docRef = doc(db, COLLECTION_NAME, promo.id);

        // Check if already exists
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          console.log(`Skipping ${promo.id} - already exists`);
          failed++;
          continue;
        }

        const firebasePromo: FirebasePromo = {
          ...promo,
          startDate: Timestamp.fromDate(new Date(promo.startDate)),
          endDate: Timestamp.fromDate(new Date(promo.endDate)),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        // Convert undefined fields to null that Firebase accepts
        Object.keys(firebasePromo).forEach(key => {
          if ((firebasePromo as any)[key] === undefined) {
            (firebasePromo as any)[key] = null;
          }
        });

        console.log(`Firebase promo prepared for ${promo.id}:`, JSON.stringify(firebasePromo, null, 2));

        batch.set(docRef, firebasePromo);
        success++;
      } catch (error) {
        console.error(`Error preparing promo ${promo.id} for upload:`, error);
        failed++;
      }
    }

    if (success > 0) {
      try {
        await batch.commit();
        console.log(`Successfully uploaded ${success} promos to Firebase`);
      } catch (error) {
        console.error("Error committing batch upload:", error);
        return { success: 0, failed: promos.length };
      }
    }

    return { success, failed };
  }

  /**
   * Check if Firebase collection has any promos
   */
  async hasPromos(db: Firestore): Promise<boolean> {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(collectionRef);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking Firebase for promos:", error);
      return false;
    }
  }

  /**
   * Get promos by category
   */
  async getPromosByCategory(db: Firestore, category: string): Promise<PromoItem[]> {
    try {
      // Use simple query without compound filters to avoid index issues
      const allPromos = await this.getAllPromos(db, false);

      // Filter in JavaScript for category and visible promos
      const categoryPromos = allPromos
        .filter(promo => {
          if (promo.visible === false) return false;
          if (category === "All") return true;
          return promo.category === category;
        })
        .sort((a, b) => {
          // Sort by priority (desc) then by endDate (asc)
          if (b.priority !== a.priority) {
            return (b.priority || 5) - (a.priority || 5);
          }
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        });

      return categoryPromos;
    } catch (error) {
      console.error(`Error fetching promos for category ${category}:`, error);
      return [];
    }
  }
}

// Export singleton instance
const promosServerService = new PromosServerService();
export default promosServerService;