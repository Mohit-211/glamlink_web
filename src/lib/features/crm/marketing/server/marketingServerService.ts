/**
 * Marketing Server Service
 *
 * Server-side service for marketing operations including campaigns,
 * sessions, attribution, and subscriber management.
 *
 * CRITICAL PATTERNS:
 * - Always transform Timestamps to ISO strings when reading
 * - Always transform ISO strings to Timestamps when writing
 * - Include document ID in all returned objects
 * - Use try-catch with console.error
 * - Return empty array/null on error (don't throw)
 * - Singleton export pattern
 */

import {
  Firestore,
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
  limit as limitQuery,
  Timestamp,
  Query,
  DocumentData,
} from 'firebase/firestore';

import type {
  Campaign,
  CampaignStatus,
  MarketingSession,
  MarketingStats,
  ChannelAttribution,
  Subscriber,
  Automation,
  SubscriberFilters,
} from '../types';

/**
 * Marketing Server Service Class
 *
 * Handles all server-side Firestore operations for the marketing system.
 * Uses subcollections under brands/{brandId}/marketing/ for scalability.
 */
class MarketingServerService {
  // ============================================
  // CAMPAIGNS
  // ============================================

  /**
   * Get all campaigns for a brand
   */
  async getCampaigns(
    db: Firestore,
    brandId: string,
    options?: { status?: CampaignStatus; limit?: number }
  ): Promise<Campaign[]> {
    try {
      const collectionRef = collection(db, `brands/${brandId}/marketing/campaigns`);

      let q: Query<DocumentData> = query(
        collectionRef,
        orderBy('createdAt', 'desc')
      );

      // Apply filters
      if (options?.status) {
        q = query(collectionRef, where('status', '==', options.status), orderBy('createdAt', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limitQuery(options.limit));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();

        // Transform Timestamps to ISO strings
        return {
          ...data,
          id: docSnapshot.id,
          createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt,
          scheduledAt: data.scheduledAt?.toDate?.().toISOString() || data.scheduledAt,
          sentAt: data.sentAt?.toDate?.().toISOString() || data.sentAt,
        } as Campaign;
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  /**
   * Get a single campaign by ID
   */
  async getCampaignById(
    db: Firestore,
    brandId: string,
    campaignId: string
  ): Promise<Campaign | null> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/campaigns`, campaignId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) return null;

      const data = docSnapshot.data();

      return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt,
        scheduledAt: data.scheduledAt?.toDate?.().toISOString() || data.scheduledAt,
        sentAt: data.sentAt?.toDate?.().toISOString() || data.sentAt,
      } as Campaign;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(
    db: Firestore,
    brandId: string,
    campaign: Campaign
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/campaigns`, campaign.id);

      const firebaseCampaign = {
        ...campaign,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        scheduledAt: campaign.scheduledAt
          ? Timestamp.fromDate(new Date(campaign.scheduledAt))
          : null,
        sentAt: campaign.sentAt
          ? Timestamp.fromDate(new Date(campaign.sentAt))
          : null,
      };

      await setDoc(docRef, firebaseCampaign);
      return true;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return false;
    }
  }

  /**
   * Update an existing campaign
   */
  async updateCampaign(
    db: Firestore,
    brandId: string,
    campaignId: string,
    updates: Partial<Campaign>
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/campaigns`, campaignId);

      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Transform date strings to Timestamps
      if (updates.scheduledAt) {
        firebaseUpdates.scheduledAt = Timestamp.fromDate(new Date(updates.scheduledAt));
      }
      if (updates.sentAt) {
        firebaseUpdates.sentAt = Timestamp.fromDate(new Date(updates.sentAt));
      }

      await updateDoc(docRef, firebaseUpdates);
      return true;
    } catch (error) {
      console.error('Error updating campaign:', error);
      return false;
    }
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(
    db: Firestore,
    brandId: string,
    campaignId: string
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/campaigns`, campaignId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
  }

  // ============================================
  // SESSIONS & TRACKING
  // ============================================

  /**
   * Create a new marketing session
   */
  async createSession(
    db: Firestore,
    brandId: string,
    session: MarketingSession
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/sessions`, session.id);

      const firebaseSession = {
        ...session,
        startedAt: Timestamp.fromDate(new Date(session.startedAt)),
        endedAt: session.endedAt
          ? Timestamp.fromDate(new Date(session.endedAt))
          : null,
      };

      await setDoc(docRef, firebaseSession);
      return true;
    } catch (error) {
      console.error('Error creating session:', error);
      return false;
    }
  }

  /**
   * Update an existing session
   */
  async updateSession(
    db: Firestore,
    brandId: string,
    sessionId: string,
    updates: Partial<MarketingSession>
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/sessions`, sessionId);

      const firebaseUpdates: any = { ...updates };

      // Transform date strings to Timestamps
      if (updates.endedAt) {
        firebaseUpdates.endedAt = Timestamp.fromDate(new Date(updates.endedAt));
      }

      await updateDoc(docRef, firebaseUpdates);
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  /**
   * Get sessions for a brand within a date range
   */
  async getSessions(
    db: Firestore,
    brandId: string,
    startDate: string,
    endDate: string
  ): Promise<MarketingSession[]> {
    try {
      const collectionRef = collection(db, `brands/${brandId}/marketing/sessions`);

      const q = query(
        collectionRef,
        where('startedAt', '>=', Timestamp.fromDate(new Date(startDate))),
        where('startedAt', '<=', Timestamp.fromDate(new Date(endDate))),
        orderBy('startedAt', 'desc')
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();

        return {
          ...data,
          id: docSnapshot.id,
          startedAt: data.startedAt?.toDate?.().toISOString() || data.startedAt,
          endedAt: data.endedAt?.toDate?.().toISOString() || data.endedAt,
        } as MarketingSession;
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  // ============================================
  // SUBSCRIBERS
  // ============================================

  /**
   * Get all subscribers for a brand
   */
  async getSubscribers(
    db: Firestore,
    brandId: string,
    filters?: SubscriberFilters
  ): Promise<Subscriber[]> {
    try {
      const collectionRef = collection(db, `brands/${brandId}/marketing/subscribers`);

      let q: Query<DocumentData> = query(
        collectionRef,
        orderBy('createdAt', 'desc')
      );

      // Apply filters
      if (filters?.subscribed !== undefined) {
        q = query(
          collectionRef,
          where('emailSubscribed', '==', filters.subscribed),
          orderBy('createdAt', 'desc')
        );
      }

      if (filters?.segmentId) {
        q = query(
          collectionRef,
          where('segmentIds', 'array-contains', filters.segmentId),
          orderBy('createdAt', 'desc')
        );
      }

      if (filters?.limit) {
        q = query(q, limitQuery(filters.limit));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();

        return {
          ...data,
          id: docSnapshot.id,
          subscribedAt: data.subscribedAt?.toDate?.().toISOString() || data.subscribedAt,
          unsubscribedAt: data.unsubscribedAt?.toDate?.().toISOString() || data.unsubscribedAt,
          lastEmailOpenedAt: data.lastEmailOpenedAt?.toDate?.().toISOString() || data.lastEmailOpenedAt,
          lastEmailClickedAt: data.lastEmailClickedAt?.toDate?.().toISOString() || data.lastEmailClickedAt,
          lastPurchaseAt: data.lastPurchaseAt?.toDate?.().toISOString() || data.lastPurchaseAt,
          createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt,
        } as Subscriber;
      });
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }

  /**
   * Create a new subscriber
   */
  async createSubscriber(
    db: Firestore,
    brandId: string,
    subscriber: Subscriber
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/subscribers`, subscriber.id);

      const firebaseSubscriber = {
        ...subscriber,
        subscribedAt: Timestamp.fromDate(new Date(subscriber.subscribedAt)),
        unsubscribedAt: subscriber.unsubscribedAt
          ? Timestamp.fromDate(new Date(subscriber.unsubscribedAt))
          : null,
        lastEmailOpenedAt: subscriber.lastEmailOpenedAt
          ? Timestamp.fromDate(new Date(subscriber.lastEmailOpenedAt))
          : null,
        lastEmailClickedAt: subscriber.lastEmailClickedAt
          ? Timestamp.fromDate(new Date(subscriber.lastEmailClickedAt))
          : null,
        lastPurchaseAt: subscriber.lastPurchaseAt
          ? Timestamp.fromDate(new Date(subscriber.lastPurchaseAt))
          : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, firebaseSubscriber);
      return true;
    } catch (error) {
      console.error('Error creating subscriber:', error);
      return false;
    }
  }

  /**
   * Update a subscriber
   */
  async updateSubscriber(
    db: Firestore,
    brandId: string,
    subscriberId: string,
    updates: Partial<Subscriber>
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/subscribers`, subscriberId);

      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Transform date strings to Timestamps
      if (updates.unsubscribedAt) {
        firebaseUpdates.unsubscribedAt = Timestamp.fromDate(new Date(updates.unsubscribedAt));
      }
      if (updates.lastEmailOpenedAt) {
        firebaseUpdates.lastEmailOpenedAt = Timestamp.fromDate(new Date(updates.lastEmailOpenedAt));
      }
      if (updates.lastEmailClickedAt) {
        firebaseUpdates.lastEmailClickedAt = Timestamp.fromDate(new Date(updates.lastEmailClickedAt));
      }
      if (updates.lastPurchaseAt) {
        firebaseUpdates.lastPurchaseAt = Timestamp.fromDate(new Date(updates.lastPurchaseAt));
      }

      await updateDoc(docRef, firebaseUpdates);
      return true;
    } catch (error) {
      console.error('Error updating subscriber:', error);
      return false;
    }
  }

  /**
   * Delete a subscriber
   */
  async deleteSubscriber(
    db: Firestore,
    brandId: string,
    subscriberId: string
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/subscribers`, subscriberId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      return false;
    }
  }

  // ============================================
  // AUTOMATIONS
  // ============================================

  /**
   * Get all automations for a brand
   */
  async getAutomations(
    db: Firestore,
    brandId: string
  ): Promise<Automation[]> {
    try {
      const collectionRef = collection(db, `brands/${brandId}/marketing/automations`);

      const q = query(collectionRef, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      return snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();

        return {
          ...data,
          id: docSnapshot.id,
          createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt,
          lastTriggeredAt: data.lastTriggeredAt?.toDate?.().toISOString() || data.lastTriggeredAt,
        } as Automation;
      });
    } catch (error) {
      console.error('Error fetching automations:', error);
      return [];
    }
  }

  /**
   * Create a new automation
   */
  async createAutomation(
    db: Firestore,
    brandId: string,
    automation: Automation
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/automations`, automation.id);

      const firebaseAutomation = {
        ...automation,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastTriggeredAt: automation.lastTriggeredAt
          ? Timestamp.fromDate(new Date(automation.lastTriggeredAt))
          : null,
      };

      await setDoc(docRef, firebaseAutomation);
      return true;
    } catch (error) {
      console.error('Error creating automation:', error);
      return false;
    }
  }

  /**
   * Update an automation
   */
  async updateAutomation(
    db: Firestore,
    brandId: string,
    automationId: string,
    updates: Partial<Automation>
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/automations`, automationId);

      const firebaseUpdates: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.lastTriggeredAt) {
        firebaseUpdates.lastTriggeredAt = Timestamp.fromDate(new Date(updates.lastTriggeredAt));
      }

      await updateDoc(docRef, firebaseUpdates);
      return true;
    } catch (error) {
      console.error('Error updating automation:', error);
      return false;
    }
  }

  /**
   * Delete an automation
   */
  async deleteAutomation(
    db: Firestore,
    brandId: string,
    automationId: string
  ): Promise<boolean> {
    try {
      const docRef = doc(db, `brands/${brandId}/marketing/automations`, automationId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting automation:', error);
      return false;
    }
  }

  // ============================================
  // STATS & ANALYTICS (to be implemented)
  // ============================================

  /**
   * Get marketing stats for a brand
   * TODO: Implement stats aggregation logic
   */
  async getMarketingStats(
    db: Firestore,
    brandId: string,
    startDate: string,
    endDate: string
  ): Promise<MarketingStats | null> {
    try {
      // TODO: Implement stats calculation from sessions
      console.log('getMarketingStats not yet implemented');
      return null;
    } catch (error) {
      console.error('Error fetching marketing stats:', error);
      return null;
    }
  }

  /**
   * Get channel attribution data
   * TODO: Implement attribution calculation logic
   */
  async getChannelAttribution(
    db: Firestore,
    brandId: string,
    startDate: string,
    endDate: string
  ): Promise<ChannelAttribution[]> {
    try {
      // TODO: Implement attribution calculation from sessions
      console.log('getChannelAttribution not yet implemented');
      return [];
    } catch (error) {
      console.error('Error fetching channel attribution:', error);
      return [];
    }
  }
}

// Singleton export
const marketingServerService = new MarketingServerService();
export default marketingServerService;
