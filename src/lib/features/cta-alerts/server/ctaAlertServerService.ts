import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  Firestore,
} from "firebase/firestore";
import {
  CTAAlertConfig,
  PublicCTAAlert,
  SavedModalTemplate,
  isCTAAlertWithinDateRange,
  getDefaultCTAAlertConfig,
} from "@/lib/pages/admin/types/ctaAlert";

// Storage location in Firestore: settings/ctaAlert
const SETTINGS_COLLECTION = "settings";
const CTA_ALERT_DOC_ID = "ctaAlert";

// Saved modal templates collection
const TEMPLATES_COLLECTION = "cta-alerts";

/**
 * Firebase-specific CTA Alert type with Timestamps
 */
interface FirebaseCTAAlert extends Omit<CTAAlertConfig, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> {
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Convert Firebase Timestamps to ISO strings
 */
function firebaseToConfig(data: FirebaseCTAAlert, docId: string): CTAAlertConfig {
  const {
    startDate: fbStartDate,
    endDate: fbEndDate,
    createdAt,
    updatedAt,
    ...rest
  } = data;

  return {
    ...rest,
    id: docId,
    startDate: fbStartDate instanceof Timestamp
      ? fbStartDate.toDate().toISOString().split('T')[0]
      : String(fbStartDate),
    endDate: fbEndDate instanceof Timestamp
      ? fbEndDate.toDate().toISOString().split('T')[0]
      : String(fbEndDate),
    createdAt: createdAt?.toDate?.().toISOString() || undefined,
    updatedAt: updatedAt?.toDate?.().toISOString() || undefined,
  };
}

/**
 * Convert config to Firebase format with Timestamps
 */
function configToFirebase(config: Partial<CTAAlertConfig>): Partial<FirebaseCTAAlert> {
  const firebaseData: any = { ...config };

  if (config.startDate) {
    firebaseData.startDate = Timestamp.fromDate(new Date(config.startDate));
  }

  if (config.endDate) {
    firebaseData.endDate = Timestamp.fromDate(new Date(config.endDate));
  }

  // Add/update timestamps
  firebaseData.updatedAt = Timestamp.now();

  return firebaseData;
}

class CTAAlertServerService {
  /**
   * Get the full CTA Alert configuration (for admin use)
   * Returns the complete config regardless of active status or date range
   */
  async getCTAAlertConfig(db: Firestore): Promise<CTAAlertConfig | null> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, CTA_ALERT_DOC_ID);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        console.log("No CTA Alert config found in Firebase");
        return null;
      }

      const data = docSnapshot.data() as FirebaseCTAAlert;
      return firebaseToConfig(data, docSnapshot.id);
    } catch (error) {
      console.error("Error fetching CTA Alert config:", error);
      return null;
    }
  }

  /**
   * Get the active CTA Alert for public display
   * Returns null if:
   * - No config exists
   * - Config is not active
   * - Current date is outside start/end date range
   */
  async getActiveCTAAlert(db: Firestore): Promise<PublicCTAAlert | null> {
    try {
      const config = await this.getCTAAlertConfig(db);

      if (!config) {
        return null;
      }

      // Check if CTA is active and within date range
      if (!isCTAAlertWithinDateRange(config)) {
        return null;
      }

      // Return only public-facing fields
      const publicAlert: PublicCTAAlert = {
        id: config.id,
        message: config.message,
        buttonText: config.buttonText,
        backgroundColor: config.backgroundColor,
        textColor: config.textColor,
        buttonBackgroundColor: config.buttonBackgroundColor,
        buttonTextColor: config.buttonTextColor,
        buttonHoverColor: config.buttonHoverColor,
        localStorageKey: config.localStorageKey,
        dismissAfterHours: config.dismissAfterHours,
        modalType: config.modalType,
        customModalId: config.customModalId,
        modalTitle: config.modalTitle,
        modalHtmlContent: config.modalHtmlContent,
        showGotItButton: config.showGotItButton ?? true,
      };

      return publicAlert;
    } catch (error) {
      console.error("Error fetching active CTA Alert:", error);
      return null;
    }
  }

  /**
   * Create or update the CTA Alert configuration
   * There is only ONE CTA alert config at a time (singleton)
   */
  async updateCTAAlertConfig(
    db: Firestore,
    config: Partial<CTAAlertConfig>
  ): Promise<CTAAlertConfig | null> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, CTA_ALERT_DOC_ID);

      // Check if config exists
      const existing = await getDoc(docRef);

      // Prepare data for Firebase
      const firebaseData = configToFirebase(config);

      if (!existing.exists()) {
        // Creating new config - add createdAt
        firebaseData.createdAt = Timestamp.now();
        firebaseData.id = CTA_ALERT_DOC_ID;
      }

      // Use setDoc with merge to create or update
      await setDoc(docRef, firebaseData, { merge: true });

      console.log("CTA Alert config saved to Firebase");

      // Return the updated config
      return this.getCTAAlertConfig(db);
    } catch (error) {
      console.error("Error saving CTA Alert config:", error);
      return null;
    }
  }

  /**
   * Initialize CTA Alert config with defaults if it doesn't exist
   */
  async initializeCTAAlertConfig(db: Firestore): Promise<CTAAlertConfig | null> {
    try {
      const existing = await this.getCTAAlertConfig(db);

      if (existing) {
        return existing;
      }

      // Create with defaults
      const defaults = getDefaultCTAAlertConfig();
      return this.updateCTAAlertConfig(db, defaults as CTAAlertConfig);
    } catch (error) {
      console.error("Error initializing CTA Alert config:", error);
      return null;
    }
  }

  /**
   * Deactivate the CTA Alert (quick disable)
   */
  async deactivateCTAAlert(db: Firestore): Promise<boolean> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, CTA_ALERT_DOC_ID);
      await setDoc(docRef, { isActive: false, updatedAt: Timestamp.now() }, { merge: true });
      console.log("CTA Alert deactivated");
      return true;
    } catch (error) {
      console.error("Error deactivating CTA Alert:", error);
      return false;
    }
  }

  /**
   * Check if CTA Alert config exists
   */
  async hasCTAAlertConfig(db: Firestore): Promise<boolean> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, CTA_ALERT_DOC_ID);
      const docSnapshot = await getDoc(docRef);
      return docSnapshot.exists();
    } catch (error) {
      console.error("Error checking CTA Alert config existence:", error);
      return false;
    }
  }

  // =========================================================================
  // SAVED MODAL TEMPLATES
  // =========================================================================

  /**
   * Get all saved modal templates
   */
  async getSavedTemplates(db: Firestore): Promise<SavedModalTemplate[]> {
    try {
      const templatesRef = collection(db, TEMPLATES_COLLECTION);
      const q = query(templatesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const templates: SavedModalTemplate[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        templates.push({
          id: doc.id,
          name: data.name || "",
          modalTitle: data.modalTitle || "",
          modalHtmlContent: data.modalHtmlContent || "",
          createdAt: data.createdAt?.toDate?.().toISOString() || undefined,
          updatedAt: data.updatedAt?.toDate?.().toISOString() || undefined,
        });
      });

      return templates;
    } catch (error) {
      console.error("Error fetching saved templates:", error);
      return [];
    }
  }

  /**
   * Save a new modal template or update existing one
   */
  async saveTemplate(
    db: Firestore,
    template: Omit<SavedModalTemplate, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ): Promise<SavedModalTemplate | null> {
    try {
      const templateId = template.id || `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);

      const now = Timestamp.now();
      const existingDoc = await getDoc(docRef);

      const templateData = {
        name: template.name,
        modalTitle: template.modalTitle,
        modalHtmlContent: template.modalHtmlContent,
        updatedAt: now,
        ...(existingDoc.exists() ? {} : { createdAt: now }),
      };

      await setDoc(docRef, templateData, { merge: true });

      console.log("Template saved:", templateId);

      return {
        id: templateId,
        name: template.name,
        modalTitle: template.modalTitle,
        modalHtmlContent: template.modalHtmlContent,
        createdAt: existingDoc.exists()
          ? existingDoc.data()?.createdAt?.toDate?.().toISOString()
          : now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString(),
      };
    } catch (error) {
      console.error("Error saving template:", error);
      return null;
    }
  }

  /**
   * Delete a modal template
   */
  async deleteTemplate(db: Firestore, templateId: string): Promise<boolean> {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
      await deleteDoc(docRef);
      console.log("Template deleted:", templateId);
      return true;
    } catch (error) {
      console.error("Error deleting template:", error);
      return false;
    }
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(db: Firestore, templateId: string): Promise<SavedModalTemplate | null> {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name || "",
        modalTitle: data.modalTitle || "",
        modalHtmlContent: data.modalHtmlContent || "",
        createdAt: data.createdAt?.toDate?.().toISOString() || undefined,
        updatedAt: data.updatedAt?.toDate?.().toISOString() || undefined,
      };
    } catch (error) {
      console.error("Error fetching template:", error);
      return null;
    }
  }
}

// Export singleton instance
const ctaAlertServerService = new CTAAlertServerService();
export default ctaAlertServerService;
