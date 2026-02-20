import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  Firestore
} from "firebase/firestore";
import { PdfConfiguration, ExtractedLink } from "@/lib/pages/magazine/types/digitalMagazine";
import storageService from "./storageService";

const COLLECTION_NAME = "magazine_digital";

export interface DigitalMagazineCanvas {
  canvasName: string; // User-defined name for the canvas
  canvasUrl: string; // Firebase Storage URL (not Base64)
  canvasHeight: number;
  canvasTotalMm: number;
  configuration: PdfConfiguration;
  links: ExtractedLink[];
  sectionTitle?: string;
  sectionType?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CanvasListItem {
  name: string;
  url: string;
  createdAt: Timestamp;
  height: number;
  totalMm: number;
}

class DigitalMagazineService {
  /**
   * Convert Base64 data URL to Blob
   */
  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Get auto-generated canvas name
   */
  private async getAutoCanvasName(
    db: Firestore,
    issueId: string,
    sectionId: string
  ): Promise<string> {
    const canvases = await this.listCanvases(db, issueId, sectionId);
    const existingNumbers = canvases
      .map(c => {
        const match = c.name.match(/^Canvas_(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;
    
    return `Canvas_${nextNumber}`;
  }

  /**
   * Save generated canvas data to Firebase Storage and Firestore
   */
  async saveCanvas(
    db: Firestore,
    issueId: string,
    sectionId: string,
    data: {
      canvasName?: string; // Optional name, will auto-generate if not provided
      canvasDataUrl: string; // Base64 data URL to upload
      canvasHeight: number;
      canvasTotalMm: number;
      configuration: PdfConfiguration;
      links: ExtractedLink[];
      sectionTitle?: string;
      sectionType?: string;
    }
  ): Promise<boolean> {
    try {
      // Check canvas count limit (max 10)
      const canvasCount = await this.getCanvasCount(db, issueId, sectionId);
      if (canvasCount >= 10) {
        console.error(`Canvas limit reached for ${issueId}/${sectionId}. Maximum 10 canvases allowed.`);
        return false;
      }

      // Auto-generate name if not provided
      const canvasName = data.canvasName || await this.getAutoCanvasName(db, issueId, sectionId);
      
      // Convert Base64 to Blob
      const blob = this.dataURLtoBlob(data.canvasDataUrl);
      
      // Upload to Firebase Storage
      const storagePath = `magazine/digital/${issueId}/${sectionId}/${canvasName}.png`;
      const canvasUrl = await storageService.uploadImage(blob, storagePath, {
        contentType: 'image/png',
        customMetadata: {
          issueId,
          sectionId,
          canvasName,
          height: data.canvasHeight.toString(),
          totalMm: data.canvasTotalMm.toString()
        }
      });
      
      // Save metadata to Firestore (without the Base64 data)
      const docRef = doc(db, COLLECTION_NAME, issueId, "sections", sectionId, "canvases", canvasName);
      
      const canvasData: DigitalMagazineCanvas = {
        canvasName,
        canvasUrl,
        canvasHeight: data.canvasHeight,
        canvasTotalMm: data.canvasTotalMm,
        configuration: data.configuration,
        links: data.links,
        sectionTitle: data.sectionTitle,
        sectionType: data.sectionType,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await setDoc(docRef, canvasData);
      console.log(`✅ Saved canvas "${canvasName}" for ${issueId}/${sectionId}`);
      return true;
    } catch (error) {
      console.error("Error saving canvas to Firebase:", error);
      return false;
    }
  }

  /**
   * List all saved canvases for a section
   */
  async listCanvases(
    db: Firestore,
    issueId: string,
    sectionId: string
  ): Promise<CanvasListItem[]> {
    try {
      const canvasesRef = collection(db, COLLECTION_NAME, issueId, "sections", sectionId, "canvases");
      const q = query(canvasesRef, orderBy("createdAt", "desc"), limit(10));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log(`No saved canvases found for ${issueId}/${sectionId}`);
        return [];
      }
      
      const canvases: CanvasListItem[] = snapshot.docs.map(doc => {
        const data = doc.data() as DigitalMagazineCanvas;
        return {
          name: data.canvasName,
          url: data.canvasUrl,
          createdAt: data.createdAt,
          height: data.canvasHeight,
          totalMm: data.canvasTotalMm
        };
      });
      
      console.log(`✅ Found ${canvases.length} canvases for ${issueId}/${sectionId}`);
      return canvases;
    } catch (error) {
      console.error("Error listing canvases from Firebase:", error);
      return [];
    }
  }

  /**
   * Load specific canvas by name
   */
  async loadCanvas(
    db: Firestore,
    issueId: string,
    sectionId: string,
    canvasName: string
  ): Promise<DigitalMagazineCanvas | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, issueId, "sections", sectionId, "canvases", canvasName);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        console.log(`No canvas "${canvasName}" found for ${issueId}/${sectionId}`);
        return null;
      }
      
      const data = snapshot.data() as DigitalMagazineCanvas;
      console.log(`✅ Loaded canvas "${canvasName}" for ${issueId}/${sectionId}`);
      return data;
    } catch (error) {
      console.error("Error loading canvas from Firebase:", error);
      return null;
    }
  }

  /**
   * Get count of saved canvases for a section
   */
  async getCanvasCount(
    db: Firestore,
    issueId: string,
    sectionId: string
  ): Promise<number> {
    try {
      const canvases = await this.listCanvases(db, issueId, sectionId);
      return canvases.length;
    } catch (error) {
      console.error("Error getting canvas count:", error);
      return 0;
    }
  }

  /**
   * Delete specific canvas by name
   */
  async deleteCanvas(
    db: Firestore,
    issueId: string,
    sectionId: string,
    canvasName: string
  ): Promise<boolean> {
    try {
      // Delete from Firestore
      const docRef = doc(db, COLLECTION_NAME, issueId, "sections", sectionId, "canvases", canvasName);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        console.log(`Canvas "${canvasName}" not found`);
        return false;
      }
      
      // Delete from Storage
      const storagePath = `magazine/digital/${issueId}/${sectionId}/${canvasName}.png`;
      try {
        await storageService.deleteFile(storagePath);
      } catch (storageError) {
        console.warn(`Could not delete storage file: ${storageError}`);
      }
      
      // Delete metadata
      await deleteDoc(docRef);
      console.log(`✅ Deleted canvas "${canvasName}" for ${issueId}/${sectionId}`);
      return true;
    } catch (error) {
      console.error("Error deleting canvas from Firebase:", error);
      return false;
    }
  }

  /**
   * Overwrite existing canvas
   */
  async overwriteCanvas(
    db: Firestore,
    issueId: string,
    sectionId: string,
    canvasName: string,
    data: {
      canvasDataUrl: string;
      canvasHeight: number;
      canvasTotalMm: number;
      configuration: PdfConfiguration;
      links: ExtractedLink[];
      sectionTitle?: string;
      sectionType?: string;
    }
  ): Promise<boolean> {
    try {
      // Check if canvas exists
      const existing = await this.loadCanvas(db, issueId, sectionId, canvasName);
      if (!existing) {
        console.error(`Canvas "${canvasName}" does not exist`);
        return false;
      }
      
      // Convert Base64 to Blob
      const blob = this.dataURLtoBlob(data.canvasDataUrl);
      
      // Overwrite in Firebase Storage
      const storagePath = `magazine/digital/${issueId}/${sectionId}/${canvasName}.png`;
      const canvasUrl = await storageService.uploadImage(blob, storagePath, {
        contentType: 'image/png',
        customMetadata: {
          issueId,
          sectionId,
          canvasName,
          height: data.canvasHeight.toString(),
          totalMm: data.canvasTotalMm.toString(),
          overwrittenAt: new Date().toISOString()
        }
      });
      
      // Update metadata in Firestore
      const docRef = doc(db, COLLECTION_NAME, issueId, "sections", sectionId, "canvases", canvasName);
      
      const canvasData: DigitalMagazineCanvas = {
        canvasName,
        canvasUrl,
        canvasHeight: data.canvasHeight,
        canvasTotalMm: data.canvasTotalMm,
        configuration: data.configuration,
        links: data.links,
        sectionTitle: data.sectionTitle,
        sectionType: data.sectionType,
        createdAt: existing.createdAt, // Keep original creation time
        updatedAt: Timestamp.now()
      };
      
      await setDoc(docRef, canvasData);
      console.log(`✅ Overwritten canvas "${canvasName}" for ${issueId}/${sectionId}`);
      return true;
    } catch (error) {
      console.error("Error overwriting canvas:", error);
      return false;
    }
  }

  /**
   * Check if a specific canvas exists
   */
  async canvasExists(
    db: Firestore,
    issueId: string,
    sectionId: string,
    canvasName: string
  ): Promise<boolean> {
    try {
      const canvas = await this.loadCanvas(db, issueId, sectionId, canvasName);
      return canvas !== null;
    } catch (error) {
      console.error("Error checking canvas existence:", error);
      return false;
    }
  }

  /**
   * Delete all canvases for a section
   */
  async deleteAllCanvases(
    db: Firestore,
    issueId: string,
    sectionId: string
  ): Promise<boolean> {
    try {
      const canvases = await this.listCanvases(db, issueId, sectionId);
      
      for (const canvas of canvases) {
        await this.deleteCanvas(db, issueId, sectionId, canvas.name);
      }
      
      console.log(`✅ Deleted all ${canvases.length} canvases for ${issueId}/${sectionId}`);
      return true;
    } catch (error) {
      console.error("Error deleting all canvases:", error);
      return false;
    }
  }

  /**
   * Save page configuration separately (for quick access without loading full canvas)
   */
  async saveConfiguration(
    db: Firestore,
    issueId: string,
    sectionId: string,
    configuration: PdfConfiguration
  ): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, issueId, "configs", sectionId);
      
      await setDoc(docRef, {
        configuration,
        updatedAt: Timestamp.now()
      });
      
      console.log(`✅ Saved configuration for ${issueId}/${sectionId}`);
      return true;
    } catch (error) {
      console.error("Error saving configuration:", error);
      return false;
    }
  }

  /**
   * Load page configuration
   */
  async loadConfiguration(
    db: Firestore,
    issueId: string,
    sectionId: string
  ): Promise<PdfConfiguration | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, issueId, "configs", sectionId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const data = snapshot.data();
      return data.configuration as PdfConfiguration;
    } catch (error) {
      console.error("Error loading configuration:", error);
      return null;
    }
  }
}

const digitalMagazineService = new DigitalMagazineService();
export default digitalMagazineService;