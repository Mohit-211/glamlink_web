import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { MagazineIssue } from "@/lib/pages/magazine/types/magazine";

const COLLECTION_NAME = "magazine_issues";

export interface FirebaseMagazineIssue extends Omit<MagazineIssue, 'sections'> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;  
  uploadedFrom?: "json" | "editor" | "migration";
  // sections deliberately excluded - they go in separate collection
}

class MagazineFirebaseService {
  private getCollectionRef() {
    if (!db) {
      throw new Error("Firebase is not initialized");
    }
    return collection(db, COLLECTION_NAME);
  }

  /**
   * Get all magazine issues from Firebase
   */
  async getAllIssues(): Promise<MagazineIssue[]> {
    try {
      if (!db) {
        console.log("Firebase not initialized");
        return [];
      }

      const collectionRef = this.getCollectionRef();
      const q = query(collectionRef, orderBy("issueDate", "desc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No magazine issues found in Firebase");
        return [];
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data() as FirebaseMagazineIssue;
        // Remove Firebase-specific fields before returning
        const { createdAt, updatedAt, uploadedFrom, ...issue } = data;
        return issue as MagazineIssue;
      });
    } catch (error) {
      console.error("Error fetching magazine issues from Firebase:", error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  /**
   * Get a single magazine issue by ID
   */
  async getIssueById(id: string): Promise<MagazineIssue | null> {
    try {
      if (!db) {
        console.log("Firebase not initialized");
        return null;
      }

      const collectionRef = this.getCollectionRef();
      const docRef = doc(collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as FirebaseMagazineIssue;
      const { createdAt, updatedAt, uploadedFrom, ...issue } = data;
      return issue as MagazineIssue;
    } catch (error) {
      console.error(`Error fetching issue ${id} from Firebase:`, error);
      return null;
    }
  }

  /**
   * Create a new magazine issue
   */
  async createIssue(issue: MagazineIssue, uploadedFrom: "json" | "editor" | "migration" = "editor"): Promise<boolean> {
    try {
      if (!db) {
        console.log("Firebase not initialized");
        return false;
      }

      const collectionRef = this.getCollectionRef();
      const docRef = doc(collectionRef, issue.id);

      // Check if issue already exists
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        console.error(`Issue ${issue.id} already exists`);
        return false;
      }

      const firebaseIssue: FirebaseMagazineIssue = {
        ...issue,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        uploadedFrom,
      };

      await setDoc(docRef, firebaseIssue);
      console.log(`Created issue ${issue.id} in Firebase`);
      return true;
    } catch (error) {
      console.error("Error creating magazine issue in Firebase:", error);
      return false;
    }
  }

  /**
   * Update an existing magazine issue
   */
  async updateIssue(id: string, updates: Partial<MagazineIssue>): Promise<boolean> {
    try {
      if (!db) {
        console.log("Firebase not initialized");
        return false;
      }

      const collectionRef = this.getCollectionRef();
      const docRef = doc(collectionRef, id);

      // Check if issue exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.error(`Issue ${id} does not exist`);
        return false;
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      console.log(`Updated issue ${id} in Firebase`);
      return true;
    } catch (error) {
      console.error(`Error updating issue ${id} in Firebase:`, error);
      return false;
    }
  }

  /**
   * Delete a magazine issue
   */
  async deleteIssue(id: string): Promise<boolean> {
    try {
      if (!db) {
        console.log("Firebase not initialized");
        return false;
      }

      const collectionRef = this.getCollectionRef();
      const docRef = doc(collectionRef, id);
      await deleteDoc(docRef);
      console.log(`Deleted issue ${id} from Firebase`);
      return true;
    } catch (error) {
      console.error(`Error deleting issue ${id} from Firebase:`, error);
      return false;
    }
  }

  /**
   * Bulk upload multiple issues (for migration)
   */
  async bulkUploadIssues(issues: MagazineIssue[]): Promise<{ success: number; failed: number }> {
    if (!db) {
      console.log("Firebase not initialized");
      return { success: 0, failed: issues.length };
    }

    const batch = writeBatch(db);
    const collectionRef = this.getCollectionRef();
    let success = 0;
    let failed = 0;

    for (const issue of issues) {
      try {
        const docRef = doc(collectionRef, issue.id);

        // Check if already exists
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          console.log(`Skipping ${issue.id} - already exists`);
          failed++;
          continue;
        }

        const firebaseIssue: FirebaseMagazineIssue = {
          ...issue,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          uploadedFrom: "migration",
        };

        batch.set(docRef, firebaseIssue);
        success++;
      } catch (error) {
        console.error(`Error preparing issue ${issue.id} for upload:`, error);
        failed++;
      }
    }

    if (success > 0) {
      try {
        await batch.commit();
        console.log(`Successfully uploaded ${success} issues to Firebase`);
      } catch (error) {
        console.error("Error committing batch upload:", error);
        return { success: 0, failed: issues.length };
      }
    }

    return { success, failed };
  }

  /**
   * Check if Firebase collection has any issues
   */
  async hasIssues(): Promise<boolean> {
    try {
      if (!db) {
        console.log("Firebase not initialized");
        return false;
      }

      const collectionRef = this.getCollectionRef();
      const snapshot = await getDocs(collectionRef);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking Firebase for issues:", error);
      return false;
    }
  }

  /**
   * Upload a single JSON issue to Firebase
   */
  async uploadJsonIssue(issueJson: any): Promise<boolean> {
    try {
      // Validate the JSON structure
      if (!issueJson.id || !issueJson.title || !issueJson.subtitle) {
        console.error("Invalid issue JSON: missing required fields");
        return false;
      }

      // Type cast to MagazineIssue
      const issue = issueJson as MagazineIssue;

      // Upload to Firebase
      return await this.createIssue(issue, "json");
    } catch (error) {
      console.error("Error uploading JSON issue:", error);
      return false;
    }
  }
}

// Export singleton instance
const magazineFirebaseService = new MagazineFirebaseService();
export default magazineFirebaseService;
