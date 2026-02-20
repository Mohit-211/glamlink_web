import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  writeBatch,
  Firestore,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  MagazineSectionDocument, 
  MagazineSectionWithLock,
  SectionLockStatus,
  UpdateSectionOrderRequest,
  CreateSectionsFromTemplateRequest
} from '../types/collaboration';

class MagazineSectionService {
  private sectionsCollection = 'sections';  // Using consistent collection name
  private issuesCollection = 'magazine_issues';

  // Get all sections for an issue
  async getSectionsByIssueId(db: Firestore, issueId: string): Promise<MagazineSectionDocument[]> {
    try {
      const sectionsRef = collection(db, this.sectionsCollection);
      // Don't use orderBy in query to avoid requiring a composite index
      // We'll sort in JavaScript instead
      const q = query(
        sectionsRef, 
        where('issueId', '==', issueId)
      );
      
      const snapshot = await getDocs(q);
      
      // Map documents and sort by order field in JavaScript
      const sections = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MagazineSectionDocument))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      console.log(`Fetched ${sections.length} sections for issue ${issueId}`);
      return sections;
    } catch (error) {
      console.error('Error fetching sections:', error);
      return [];
    }
  }

  // Get sections with lock status for UI
  async getSectionsWithLockStatus(
    db: Firestore, 
    issueId: string, 
    currentUserId: string
  ): Promise<MagazineSectionWithLock[]> {
    const sections = await this.getSectionsByIssueId(db, issueId);
    const now = new Date().toISOString();

    return sections.map(section => {
      const lockStatus = this.calculateLockStatus(section, currentUserId, now);
      return {
        ...section,
        lockStatus,
        isCurrentUserLock: section.lockedBy === currentUserId
      };
    });
  }

  // Calculate lock status for a section
  private calculateLockStatus(
    section: MagazineSectionDocument, 
    currentUserId: string,
    now: string
  ): SectionLockStatus {
    const isLocked = !!section.lockedBy && !!section.lockExpiresAt;
    const isExpired = isLocked && section.lockExpiresAt! < now;
    
    let lockExpiresIn = 0;
    if (isLocked && !isExpired) {
      const expiresAt = new Date(section.lockExpiresAt!).getTime();
      const nowTime = new Date(now).getTime();
      lockExpiresIn = Math.max(0, Math.floor((expiresAt - nowTime) / 1000));
    }

    return {
      sectionId: section.id!,
      isLocked: isLocked && !isExpired,
      lockedBy: section.lockedBy || undefined,
      lockedByName: section.lockedByName || undefined,
      lockedByEmail: section.lockedByEmail || undefined,
      lockExpiresIn,
      canEdit: !isLocked || isExpired || section.lockedBy === currentUserId,
      isExpired
    };
  }

  // Get a single section
  async getSection(db: Firestore, sectionId: string): Promise<MagazineSectionDocument | null> {
    try {
      const sectionRef = doc(db, this.sectionsCollection, sectionId);
      const snapshot = await getDoc(sectionRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as MagazineSectionDocument;
      }
      return null;
    } catch (error) {
      console.error('Error fetching section:', error);
      return null;
    }
  }

  // Create a new section
  async createSection(
    db: Firestore, 
    section: Omit<MagazineSectionDocument, 'id'>,
    userId: string,
    userEmail: string
  ): Promise<MagazineSectionDocument | null> {
    try {
      // Get current max order for this issue
      const existingSections = await this.getSectionsByIssueId(db, section.issueId);
      const maxOrder = existingSections.length > 0 
        ? Math.max(...existingSections.map(s => s.order ?? 0))
        : -1;
      
      const now = new Date().toISOString();
      
      // Remove any id field that might have been passed in
      const { id: _, ...sectionWithoutId } = section as any;
      
      const sectionData = {
        ...sectionWithoutId,
        order: maxOrder + 1,  // Set order to be last in the list
        createdAt: now,
        createdBy: userId,
        createdByEmail: userEmail,
        lastModified: now,
        lastModifiedBy: userId,
        lastModifiedByEmail: userEmail,
        version: 1,
        lockedBy: null,
        lockedAt: null,
        lockExpiresAt: null
      };

      const sectionsRef = collection(db, this.sectionsCollection);
      const docRef = await addDoc(sectionsRef, sectionData);

      // Update issue section count
      await this.updateIssueSectionCount(db, section.issueId, 1);

      return {
        id: docRef.id,  // ONLY use Firebase document ID
        ...sectionData
      };
    } catch (error) {
      console.error('Error creating section:', error);
      return null;
    }
  }

  // Update a section
  async updateSection(
    db: Firestore,
    sectionId: string,
    updates: Partial<MagazineSectionDocument>,
    userId: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      console.log('📝 [magazineSectionService.updateSection] Starting update:', {
        sectionId,
        userId,
        userEmail,
        updateKeys: Object.keys(updates),
        hasContent: !!updates.content,
        hasContentBlocks: !!(updates as any).contentBlocks,
        hasContentContentBlocks: !!(updates.content as any)?.contentBlocks,
        contentBlocksCount: (updates.content as any)?.contentBlocks?.length || (updates as any).contentBlocks?.length || 0,
        sectionType: updates.type
      });

      const sectionRef = doc(db, this.sectionsCollection, sectionId);
      
      // Get current version for optimistic locking
      const current = await getDoc(sectionRef);
      if (!current.exists()) {
        console.error('❌ [magazineSectionService.updateSection] Section not found:', sectionId);
        return false;
      }

      const currentData = current.data() as MagazineSectionDocument;
      console.log('📊 [magazineSectionService.updateSection] Current section data:', {
        sectionId,
        currentType: currentData.type,
        currentVersion: currentData.version,
        currentHasContent: !!currentData.content,
        currentContentBlocksCount: (currentData.content as any)?.contentBlocks?.length || 0
      });
      
      // Check if locked by another user
      const now = new Date().toISOString();
      if (currentData.lockedBy && 
          currentData.lockedBy !== userId && 
          currentData.lockExpiresAt && 
          currentData.lockExpiresAt > now) {
        console.error('🔒 [magazineSectionService.updateSection] Section is locked by another user');
        return false;
      }

      // Prepare update
      const updateData = {
        ...updates,
        lastModified: now,
        lastModifiedBy: userId,
        lastModifiedByEmail: userEmail,
        version: increment(1)
      };

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.issueId;
      delete updateData.createdAt;
      delete updateData.createdBy;

      console.log('💾 [magazineSectionService.updateSection] Prepared update data:', {
        sectionId,
        updateKeys: Object.keys(updateData),
        hasContent: !!updateData.content,
        hasContentBlocks: !!(updateData as any).contentBlocks,
        contentBlocksInContent: !!(updateData.content as any)?.contentBlocks,
        finalContentBlocksCount: (updateData.content as any)?.contentBlocks?.length || (updateData as any).contentBlocks?.length || 0
      });

      // Log detailed contentBlocks if present
      if ((updateData.content as any)?.contentBlocks) {
        const blocks = (updateData.content as any).contentBlocks;
        console.log('📦 [magazineSectionService.updateSection] ContentBlocks being saved:', {
          count: blocks.length,
          blockTypes: blocks.map((b: any) => b.type),
          firstBlockKeys: blocks[0] ? Object.keys(blocks[0].props || {}) : []
        });
      }

      await updateDoc(sectionRef, updateData);
      
      console.log('✅ [magazineSectionService.updateSection] Section successfully updated in Firestore:', {
        sectionId,
        version: 'incremented by 1'
      });
      
      return true;
    } catch (error) {
      console.error('❌ [magazineSectionService.updateSection] Error updating section:', error);
      return false;
    }
  }

  // Delete a section
  async deleteSection(
    db: Firestore,
    sectionId: string,
    issueId: string
  ): Promise<boolean> {
    try {
      const sectionRef = doc(db, this.sectionsCollection, sectionId);
      await deleteDoc(sectionRef);

      // Update issue section count
      await this.updateIssueSectionCount(db, issueId, -1);

      // Reorder remaining sections
      await this.reorderSectionsAfterDelete(db, issueId, sectionId);

      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      return false;
    }
  }

  // Update section order (for drag-and-drop reordering)
  async updateSectionOrder(
    db: Firestore,
    request: UpdateSectionOrderRequest
  ): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      for (const item of request.sections) {
        const sectionRef = doc(db, this.sectionsCollection, item.id);
        batch.update(sectionRef, { order: item.order });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error updating section order:', error);
      return false;
    }
  }

  // Create multiple sections from template
  async createSectionsFromTemplate(
    db: Firestore,
    request: CreateSectionsFromTemplateRequest
  ): Promise<MagazineSectionDocument[]> {
    try {
      const batch = writeBatch(db);
      const now = new Date().toISOString();
      const createdSections: MagazineSectionDocument[] = [];

      // Get current max order
      const existingSections = await this.getSectionsByIssueId(db, request.issueId);
      let maxOrder = existingSections.length > 0 
        ? Math.max(...existingSections.map(s => s.order))
        : -1;

      // Create each section
      for (const sectionData of request.sections) {
        const newSectionRef = doc(collection(db, this.sectionsCollection));
        
        // Remove any client-generated ID from the section data if it exists
        const { id: _, ...sectionDataWithoutId } = sectionData as any;
        
        const newSection: MagazineSectionDocument = {
          ...sectionDataWithoutId,
          id: newSectionRef.id,  // ONLY use Firebase document ID
          issueId: request.issueId,
          order: ++maxOrder,
          createdAt: now,
          createdBy: request.userId,
          createdByEmail: request.userEmail,
          lastModified: now,
          lastModifiedBy: request.userId,
          lastModifiedByEmail: request.userEmail,
          version: 1
        };

        // Don't include the id field when saving to Firestore (it's the document ID)
        const { id: docId, ...sectionDataForFirestore } = newSection;
        batch.set(newSectionRef, sectionDataForFirestore);
        
        // But include it in the returned data for the UI
        createdSections.push(newSection);
      }

      // Update issue section count
      const issueRef = doc(db, this.issuesCollection, request.issueId);
      batch.update(issueRef, {
        sectionCount: increment(request.sections.length),
        lastModified: now,
        lastModifiedBy: request.userId,
        lastModifiedByEmail: request.userEmail
      });

      await batch.commit();
      return createdSections;
    } catch (error) {
      console.error('Error creating sections from template:', error);
      return [];
    }
  }

  // Helper: Update issue section count
  private async updateIssueSectionCount(
    db: Firestore,
    issueId: string,
    delta: number
  ): Promise<void> {
    try {
      const issueRef = doc(db, this.issuesCollection, issueId);
      await updateDoc(issueRef, {
        sectionCount: increment(delta),
        lastModified: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating issue section count:', error);
    }
  }

  // Helper: Reorder sections after deletion
  private async reorderSectionsAfterDelete(
    db: Firestore,
    issueId: string,
    deletedSectionId: string
  ): Promise<void> {
    try {
      const sections = await this.getSectionsByIssueId(db, issueId);
      const batch = writeBatch(db);
      
      let newOrder = 0;
      for (const section of sections) {
        if (section.id !== deletedSectionId) {
          const sectionRef = doc(db, this.sectionsCollection, section.id!);
          batch.update(sectionRef, { order: newOrder++ });
        }
      }

      await batch.commit();
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  }

  // Delete all sections for an issue (used when deleting the issue)
  async deleteAllSectionsForIssue(
    db: Firestore,
    issueId: string
  ): Promise<boolean> {
    try {
      // Query all sections for this issue (no orderBy to avoid index requirement)
      const sectionsRef = collection(db, this.sectionsCollection);
      const q = query(sectionsRef, where('issueId', '==', issueId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log(`No sections found for issue ${issueId}`);
        return true;
      }
      
      // Delete all sections in a batch for efficiency
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Deleted ${snapshot.docs.length} sections for issue ${issueId}`);
      return true;
    } catch (error) {
      console.error('Error deleting sections for issue:', error);
      return false;
    }
  }

  // Migrate sections from old embedded structure to new collection
  async migrateSectionsFromIssue(
    db: Firestore,
    issueId: string,
    embeddedSections: any[],
    userId: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      const now = new Date().toISOString();

      // Create section documents
      for (let i = 0; i < embeddedSections.length; i++) {
        const section = embeddedSections[i];
        const newSectionRef = doc(collection(db, this.sectionsCollection));
        
        const sectionDoc: MagazineSectionDocument = {
          id: newSectionRef.id,
          issueId: issueId,
          order: i,
          type: section.type || 'custom-section',
          title: section.title || '',
          subtitle: section.subtitle,
          content: section.content || section,
          createdAt: now,
          createdBy: userId,
          createdByEmail: userEmail,
          lastModified: now,
          lastModifiedBy: userId,
          lastModifiedByEmail: userEmail,
          version: 1
        };

        batch.set(newSectionRef, sectionDoc);
      }

      // Update issue to remove sections array and add section count
      const issueRef = doc(db, this.issuesCollection, issueId);
      batch.update(issueRef, {
        sections: null, // Remove embedded sections
        sectionCount: embeddedSections.length,
        lastModified: now,
        lastModifiedBy: userId,
        lastModifiedByEmail: userEmail,
        migrated: true // Flag to indicate migration complete
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error migrating sections:', error);
      return false;
    }
  }
}

// Export singleton instance
const magazineSectionService = new MagazineSectionService();
export default magazineSectionService;