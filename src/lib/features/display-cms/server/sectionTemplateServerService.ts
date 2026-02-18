import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  Firestore,
} from "firebase/firestore";
import { SectionTemplate, ForClientsSectionType } from "../types";

// Storage location in Firestore
const TEMPLATES_COLLECTION = "for_clients_section_templates";

/**
 * Firebase-specific template type with Timestamps
 */
interface FirebaseSectionTemplate extends Omit<SectionTemplate, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Convert Firebase Timestamps to ISO strings
 */
function firebaseToTemplate(data: FirebaseSectionTemplate): SectionTemplate {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
  };
}

/**
 * Convert template to Firebase format with Timestamps
 */
function templateToFirebase(template: Partial<SectionTemplate>): Partial<FirebaseSectionTemplate> {
  const firebaseData: any = { ...template };

  // Remove ISO string timestamps if they exist (from client)
  delete firebaseData.createdAt;
  delete firebaseData.updatedAt;

  // Always set updatedAt
  firebaseData.updatedAt = Timestamp.now();

  return firebaseData;
}

class SectionTemplateServerService {
  /**
   * Get all templates (no filtering - for Redux cache)
   * Client-side filtering is faster than multiple Firestore queries
   */
  async getAllTemplates(db: Firestore): Promise<SectionTemplate[]> {
    try {
      const templatesRef = collection(db, TEMPLATES_COLLECTION);
      // No where or orderBy - just fetch everything (no composite index needed!)
      const querySnapshot = await getDocs(templatesRef);
      const templates: SectionTemplate[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseSectionTemplate;
        templates.push(firebaseToTemplate(data));
      });

      // Sort by createdAt client-side (newest first)
      return templates.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order
      });
    } catch (error) {
      console.error('Error fetching all templates:', error);
      throw error;
    }
  }

  /**
   * Get all templates for a specific section type (DEPRECATED - use getAllTemplates + client filter)
   */
  async getTemplates(
    db: Firestore,
    sectionType: ForClientsSectionType
  ): Promise<SectionTemplate[]> {
    try {
      // Fetch all and filter client-side (no composite index needed)
      const allTemplates = await this.getAllTemplates(db);
      return allTemplates.filter(t => t.sectionType === sectionType);
    } catch (error) {
      console.error(`Error fetching templates for ${sectionType}:`, error);
      throw error;
    }
  }

  /**
   * Get a single template by ID
   */
  async getTemplate(db: Firestore, templateId: string): Promise<SectionTemplate | null> {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      const data = docSnapshot.data() as FirebaseSectionTemplate;
      return firebaseToTemplate(data);
    } catch (error) {
      console.error(`Error fetching template ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Save a template (create or update)
   */
  async saveTemplate(
    db: Firestore,
    template: Partial<SectionTemplate>
  ): Promise<SectionTemplate> {
    try {
      // Generate ID if creating new template
      const templateId = template.id || `template-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);

      // Check if document exists to determine if this is create or update
      const existingDoc = await getDoc(docRef);
      const isUpdate = existingDoc.exists();

      // Convert to Firebase format
      const firebaseData = templateToFirebase({
        ...template,
        id: templateId,
      });

      // Set createdAt only for new documents
      if (!isUpdate) {
        firebaseData.createdAt = Timestamp.now();
      }

      // Save to Firestore
      await setDoc(docRef, firebaseData, { merge: true });

      // Fetch and return the saved template
      const saved = await this.getTemplate(db, templateId);
      if (!saved) {
        throw new Error("Template saved but could not be retrieved");
      }

      return saved;
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(db: Firestore, templateId: string): Promise<void> {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting template ${templateId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const sectionTemplateServerService = new SectionTemplateServerService();
