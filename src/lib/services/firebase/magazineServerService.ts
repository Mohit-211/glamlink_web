import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, Timestamp, writeBatch, Firestore } from "firebase/firestore";
import { MagazineIssue, MagazineIssueSection } from "@/lib/pages/magazine/types/magazine";

const COLLECTION_NAME = "magazine_issues";
const SECTIONS_COLLECTION = "sections";

export interface FirebaseMagazineIssue extends Omit<MagazineIssue, 'sections'> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  uploadedFrom?: "json" | "editor" | "migration";
  // sections deliberately excluded - they go in separate collection
}

class MagazineServerService {
  /**
   * Get all magazine issues from Firebase
   */
  async getAllIssues(db: Firestore, includeHidden: boolean = false): Promise<MagazineIssue[]> {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const q = query(collectionRef, orderBy("issueDate", "desc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No magazine issues found in Firebase");
        return [];
      }

      return snapshot.docs
        .map((doc) => {
          const data = doc.data() as FirebaseMagazineIssue;
          // Remove Firebase-specific fields before returning
          const { createdAt, updatedAt, uploadedFrom, ...issue } = data;
          return issue as MagazineIssue;
        })
        .filter((issue) => {
          // If includeHidden is false, filter out hidden issues
          // If visible is undefined, default to true (show the issue)
          if (!includeHidden) {
            return issue.visible !== false;
          }
          return true;
        });
    } catch (error) {
      console.error("Error fetching magazine issues from Firebase:", error);
      return [];
    }
  }

  /**
   * Get only visible magazine issues from Firebase
   */
  async getVisibleIssues(db: Firestore): Promise<MagazineIssue[]> {
    return this.getAllIssues(db, false);
  }

  /**
   * Load sections for a magazine issue from the separate sections collection
   */
  private async loadSectionsForIssue(db: Firestore, issueId: string): Promise<MagazineIssueSection[]> {
    try {
      const sectionsRef = collection(db, SECTIONS_COLLECTION);
      const q = query(sectionsRef, where("issueId", "==", issueId));
      const snapshot = await getDocs(q);
      
      // Map documents and sort by order field
      const sections = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: data.id || doc.id,
            type: data.type,
            title: data.title,
            subtitle: data.subtitle,
            content: data.content,
            backgroundColor: data.backgroundColor,
            urlSlug: data.urlSlug,
            tocTitle: data.tocTitle,
            tocSubtitle: data.tocSubtitle,
            order: data.order || 0
          } as MagazineIssueSection & { order?: number };
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(({ order, ...section }) => section as MagazineIssueSection);
      
      return sections;
    } catch (error) {
      console.error(`Error loading sections for issue ${issueId}:`, error);
      return [];
    }
  }

  /**
   * Get a single magazine issue by ID
   */
  async getIssueById(db: Firestore, id: string, checkVisibility: boolean = true): Promise<MagazineIssue | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as FirebaseMagazineIssue;
      const { createdAt, updatedAt, uploadedFrom, ...issue } = data;

      // Check visibility if requested
      if (checkVisibility && issue.visible === false) {
        return null;
      }

      // Load sections from separate collection
      const sections = await this.loadSectionsForIssue(db, id);
      
      return {
        ...issue,
        sections
      } as MagazineIssue;
    } catch (error) {
      console.error("Error fetching magazine issue:", error);
      return null;
    }
  }

  /**
   * Get a single magazine issue by urlId
   */
  async getIssueByUrlId(db: Firestore, urlId: string, checkVisibility: boolean = true): Promise<MagazineIssue | null> {
    try {
      // Get all issues (including hidden if checking visibility)
      const issues = await this.getAllIssues(db, !checkVisibility);
      const issue = issues.find((i) => i.urlId === urlId);

      // Check visibility if requested
      if (issue && checkVisibility && issue.visible === false) {
        return null;
      }

      // If we found an issue, load its sections
      if (issue) {
        const sections = await this.loadSectionsForIssue(db, issue.id);
        return {
          ...issue,
          sections
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching magazine issue by urlId:", error);
      return null;
    }
  }

  /**
   * Create a new magazine issue
   */
  async createIssue(db: Firestore, issue: MagazineIssue, uploadedFrom: "json" | "editor" | "migration" = "editor"): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, issue.id);

      // Check if issue already exists
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        console.log(`Issue ${issue.id} already exists`);
        return false;
      }

      // STRIP SECTIONS COMPLETELY - they go in separate collection
      const { sections, ...issueWithoutSections } = issue;

      const firebaseIssue: FirebaseMagazineIssue = {
        ...issueWithoutSections, // NO FUCKING SECTIONS IN magazine_issues!
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        uploadedFrom,
      };

      // TRIPLE CHECK - DELETE sections if it somehow exists
      delete (firebaseIssue as any).sections;

      await setDoc(docRef, firebaseIssue);
      console.log(`Created issue ${issue.id} in Firebase WITHOUT sections field`);
      return true;
    } catch (error) {
      console.error("Error creating magazine issue:", error);
      return false;
    }
  }

  /**
   * Update an existing magazine issue
   */
  async updateIssue(db: Firestore, id: string, updates: Partial<MagazineIssue>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      // Check if issue exists
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        console.log(`Issue ${id} not found`);
        return false;
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      console.log(`Updated issue ${id} in Firebase`);
      return true;
    } catch (error) {
      console.error("Error updating magazine issue:", error);
      return false;
    }
  }

  /**
   * Delete a magazine issue
   */
  async deleteIssue(db: Firestore, id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log(`Deleted issue ${id} from Firebase`);
      return true;
    } catch (error) {
      console.error("Error deleting magazine issue:", error);
      return false;
    }
  }

  /**
   * Bulk upload multiple issues (for migration)
   */
  async bulkUploadIssues(db: Firestore, issues: MagazineIssue[]): Promise<{ success: number; failed: number }> {
    const batch = writeBatch(db);
    let success = 0;
    let failed = 0;

    for (const issue of issues) {
      try {
        const docRef = doc(db, COLLECTION_NAME, issue.id);

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
  async hasIssues(db: Firestore): Promise<boolean> {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(collectionRef);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking Firebase for issues:", error);
      return false;
    }
  }
}

// Export singleton instance
const magazineServerService = new MagazineServerService();
export default magazineServerService;
