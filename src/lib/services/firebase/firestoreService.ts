import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/config/firebase';

// Type guard for db
const dbTyped = db as any;

export interface BeautyAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  analysisType: string[];
  results: any;
  createdAt: string;
}

class FirestoreService {
  private checkDb() {
    if (!dbTyped) {
      // Firebase Firestore is not initialized. Using mock data fallback.
      return false;
    }
    return true;
  }

  async createDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> {
    if (!this.checkDb()) return;
    
    try {
      await setDoc(doc(db!, collectionName, documentId), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  async updateDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    updates: Partial<T>
  ): Promise<void> {
    if (!this.checkDb()) return;
    
    try {
      await updateDoc(doc(db!, collectionName, documentId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  async setDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: T,
    merge: boolean = true
  ): Promise<void> {
    if (!this.checkDb()) return;
    
    try {
      await setDoc(doc(db!, collectionName, documentId), {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge });
    } catch (error: any) {
      throw new Error(`Failed to set document: ${error.message}`);
    }
  }

  async getDocument<T>(
    collectionName: string,
    documentId: string
  ): Promise<T | null> {
    if (!this.checkDb()) return null;
    
    try {
      const docRef = doc(db!, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error: any) {
      // Check if it's a permission error
      if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
        // Permission denied for document. Using fallback data.
        return null;
      }
      // Error fetching document
      return null;
    }
  }

  async getDocuments<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    if (!this.checkDb()) return [];
    
    try {
      const q = query(collection(db!, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error: any) {
      // Check if it's a permission error
      if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
        // Permission denied for collection. Using fallback data.
        return [];
      }
      // Error fetching documents
      return [];
    }
  }

  async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    if (!this.checkDb()) return;
    
    try {
      await deleteDoc(doc(db!, collectionName, documentId));
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  // Beauty Analysis methods
  async saveAnalysis(userId: string, imageUrl: string, analysisType: string[], results: any): Promise<string> {
    if (!this.checkDb()) throw new Error('Firebase is not initialized');
    
    try {
      const analysisId = doc(collection(db!, 'analyses')).id;
      await this.createDocument('analyses', analysisId, {
        id: analysisId,
        userId,
        imageUrl,
        analysisType,
        results,
        createdAt: new Date().toISOString()
      });
      return analysisId;
    } catch (error: any) {
      throw new Error(`Failed to save analysis: ${error.message}`);
    }
  }

  async getUserAnalyses(userId: string, limitCount: number = 10): Promise<BeautyAnalysis[]> {
    try {
      return await this.getDocuments<BeautyAnalysis>('analyses', [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ]);
    } catch (error: any) {
      // Error fetching user analyses
      return [];
    }
  }

}

export default new FirestoreService();