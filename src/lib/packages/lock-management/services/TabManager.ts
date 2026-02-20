'use client';

/**
 * Tab Manager - Multi-tab Detection and Management
 * 
 * Enhanced and refactored tab manager extracted from the existing tabManager
 * with improved reliability and additional features.
 */

import { TabInfo, LockConfig } from '../types/lock.types';
import { resolveLockGroup } from '../config';

const TAB_ID_KEY = 'lock_management_tab_id';
const TAB_INFO_KEY = 'lock_management_tab_info';
const GLOBAL_TAB_REGISTRY_KEY = 'lock_management_all_tabs';

export interface TabManagerConfig {
  storagePrefix?: string;
  activityTimeoutMinutes?: number;
  cleanupIntervalMs?: number;
  enableCrossTabCommunication?: boolean;
}

export interface ExtendedTabInfo extends TabInfo {
  lockGroups?: string[];        // Which lock groups this tab is editing
  collections?: string[];       // Which collections this tab is editing
  lastLockActivity?: string;     // Last lock operation timestamp
  browserInfo?: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

/**
 * Enhanced Tab Manager for Lock Management
 * 
 * Handles unique tab identification, multi-tab conflict detection,
 * and cross-tab communication for collaborative editing.
 */
export class TabManager {
  private static instance: TabManager;
  private tabId: string;
  private config: Required<TabManagerConfig>;
  private visibilityChangeHandler: (() => void) | null = null;
  private beforeUnloadHandler: ((e: BeforeUnloadEvent) => void) | null = null;
  private activityInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private messageHandler: ((e: StorageEvent) => void) | null = null;

  private constructor(config: TabManagerConfig = {}) {
    this.config = {
      storagePrefix: config.storagePrefix || 'lock_management',
      activityTimeoutMinutes: config.activityTimeoutMinutes || 5,
      cleanupIntervalMs: config.cleanupIntervalMs || 60000, // 1 minute
      enableCrossTabCommunication: config.enableCrossTabCommunication ?? true
    };

    this.tabId = this.initializeTabId();
    this.setupEventListeners();
    this.startPeriodicCleanup();
  }

  static getInstance(config?: TabManagerConfig): TabManager {
    if (!TabManager.instance) {
      TabManager.instance = new TabManager(config);
    }
    return TabManager.instance;
  }

  /**
   * Get the unique identifier for this browser tab
   */
  getTabId(): string {
    console.log(`[TabManager] Getting tab ID: ${this.tabId}`);
    return this.tabId;
  }

  /**
   * Set editing activity for a specific resource
   */
  setEditingResource(
    resourceId: string,
    collection: string,
    section?: string,
    lockGroup?: string
  ): void {
    if (typeof window === 'undefined') return;

    const resolvedLockGroup = resolveLockGroup(collection, section || 'default', lockGroup);
    const now = new Date().toISOString();

    const tabInfo: ExtendedTabInfo = {
      tabId: this.tabId,
      resourceId,
      collection,
      editingSection: section || null,
      lastActivity: now,
      isActive: !document.hidden,
      userId: this.getCurrentUserId(),
      lockGroups: resolvedLockGroup ? [resolvedLockGroup] : undefined,
      collections: [collection],
      lastLockActivity: now,
      browserInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    this.updateTabInfo(tabInfo);
    this.updateGlobalTabRegistry(tabInfo);
  }

  /**
   * Clear editing state when user stops editing
   */
  clearEditingState(): void {
    if (typeof window === 'undefined') return;

    sessionStorage.removeItem(this.getStorageKey(TAB_INFO_KEY));
    this.removeFromGlobalTabRegistry();
  }

  /**
   * Clear editing resource (alias for clearEditingState)
   */
  clearEditingResource(): void {
    this.clearEditingState();
  }

  /**
   * Get all active tabs editing the same resource
   */
  getActiveTabsForResource(resourceId: string, collection: string): ExtendedTabInfo[] {
    if (typeof window === 'undefined') return [];

    const allTabs = this.getAllActiveTabs();
    return allTabs.filter(tab => 
      tab.resourceId === resourceId && 
      tab.collection === collection &&
      tab.tabId !== this.tabId
    );
  }

  /**
   * Get all tabs with recent activity
   */
  getAllActiveTabs(): ExtendedTabInfo[] {
    if (typeof window === 'undefined') return [];

    const allTabsJson = localStorage.getItem(this.getStorageKey(GLOBAL_TAB_REGISTRY_KEY));
    if (!allTabsJson) return [];

    try {
      const allTabs: ExtendedTabInfo[] = JSON.parse(allTabsJson);
      const cutoffTime = new Date(Date.now() - this.config.activityTimeoutMinutes * 60 * 1000);

      return allTabs.filter(tab => 
        new Date(tab.lastActivity) > cutoffTime
      );
    } catch (error) {
      console.error('Error parsing tab registry:', error);
      return [];
    }
  }

  /**
   * Check if another tab is editing the same section/lock group
   */
  isOtherTabEditing(
    resourceId: string,
    collection: string,
    section?: string,
    lockGroup?: string
  ): { 
    isEditing: boolean; 
    conflictingTabs: ExtendedTabInfo[];
    conflictType: 'same_section' | 'same_lock_group' | 'same_resource';
  } {
    const activeTabs = this.getActiveTabsForResource(resourceId, collection);
    const resolvedLockGroup = resolveLockGroup(collection, section || 'default', lockGroup);
    
    // Check for exact section conflicts
    const sectionConflicts = activeTabs.filter(tab => 
      tab.editingSection === section
    );

    if (sectionConflicts.length > 0) {
      return {
        isEditing: true,
        conflictingTabs: sectionConflicts,
        conflictType: 'same_section'
      };
    }

    // Check for lock group conflicts
    if (resolvedLockGroup) {
      const lockGroupConflicts = activeTabs.filter(tab => 
        tab.lockGroups?.includes(resolvedLockGroup)
      );

      if (lockGroupConflicts.length > 0) {
        return {
          isEditing: true,
          conflictingTabs: lockGroupConflicts,
          conflictType: 'same_lock_group'
        };
      }
    }

    // Check for general resource conflicts
    const resourceConflicts = activeTabs.filter(tab => 
      tab.resourceId === resourceId && tab.collection === collection
    );

    return {
      isEditing: resourceConflicts.length > 0,
      conflictingTabs: resourceConflicts,
      conflictType: 'same_resource'
    };
  }

  /**
   * Send a message to other tabs
   */
  broadcastToOtherTabs(message: {
    type: string;
    resourceId?: string;
    collection?: string;
    data?: any;
  }): void {
    if (typeof window === 'undefined' || !this.config.enableCrossTabCommunication) return;

    const fullMessage = {
      ...message,
      fromTabId: this.tabId,
      timestamp: new Date().toISOString()
    };

    try {
      // Use localStorage to communicate with other tabs
      const messageKey = this.getStorageKey('tab_message');
      localStorage.setItem(messageKey, JSON.stringify(fullMessage));
      
      // Remove the message immediately (other tabs will have received it via storage event)
      localStorage.removeItem(messageKey);
    } catch (error) {
      console.error('Error broadcasting message to tabs:', error);
    }
  }

  /**
   * Listen for messages from other tabs
   */
  onMessageFromOtherTabs(callback: (message: any) => void): () => void {
    if (typeof window === 'undefined' || !this.config.enableCrossTabCommunication) {
      return () => {};
    }

    const messageKey = this.getStorageKey('tab_message');
    
    const handler = (e: StorageEvent) => {
      if (e.key === messageKey && e.newValue) {
        try {
          const message = JSON.parse(e.newValue);
          if (message.fromTabId !== this.tabId) { // Don't receive our own messages
            callback(message);
          }
        } catch (error) {
          console.error('Error parsing tab message:', error);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  /**
   * Get current tab information
   */
  getCurrentTabInfo(): ExtendedTabInfo | null {
    if (typeof window === 'undefined') return null;

    const tabInfoJson = sessionStorage.getItem(this.getStorageKey(TAB_INFO_KEY));
    if (!tabInfoJson) return null;

    try {
      return JSON.parse(tabInfoJson) as ExtendedTabInfo;
    } catch (error) {
      console.error('Error parsing current tab info:', error);
      return null;
    }
  }

  /**
   * Check if the current tab has focus
   */
  isCurrentTabActive(): boolean {
    return typeof document !== 'undefined' && !document.hidden;
  }

  /**
   * Get a summary of conflicts for debugging
   */
  getConflictSummary(
    resourceId: string,
    collection: string,
    section?: string
  ): string {
    const conflict = this.isOtherTabEditing(resourceId, collection, section);
    
    if (!conflict.isEditing) {
      return `No conflicts for ${resourceId} in ${collection}${section ? ` (${section})` : ''}`;
    }

    const conflictDetails = conflict.conflictingTabs.map(tab => 
      `Tab ${tab.tabId.slice(-4)} editing ${tab.editingSection || 'resource'}`
    ).join(', ');

    return `${conflict.conflictType.replace('_', ' ')} conflict detected: ${conflictDetails}`;
  }

  /**
   * Force cleanup of stale tabs
   */
  forceCleanup(): number {
    if (typeof window === 'undefined') return 0;

    const before = this.getAllActiveTabs().length;
    this.cleanupStaleEntries();
    const after = this.getAllActiveTabs().length;
    
    return before - after;
  }

  /**
   * Destroy the tab manager and clean up
   */
  destroy(): void {
    this.clearEventListeners();
    this.clearEditingState();
    
    if (this.activityInterval) {
      clearInterval(this.activityInterval);
      this.activityInterval = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Private methods

  private initializeTabId(): string {
    if (typeof window === 'undefined') {
      return 'server-tab-' + Math.random().toString(36).substr(2, 9);
    }

    const storageKey = this.getStorageKey(TAB_ID_KEY);
    let tabId = sessionStorage.getItem(storageKey);
    
    if (!tabId) {
      tabId = 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(storageKey, tabId);
      console.log(`[TabManager] Created new tab ID: ${tabId}`);
    } else {
      console.log(`[TabManager] Using existing tab ID: ${tabId}`);
    }
    
    return tabId;
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Handle visibility changes
    this.visibilityChangeHandler = () => this.updateActivity();
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);

    // Handle tab/window closing
    this.beforeUnloadHandler = () => this.clearEditingState();
    window.addEventListener('beforeunload', this.beforeUnloadHandler);

    // Start activity tracking
    this.activityInterval = setInterval(() => {
      if (this.isCurrentTabActive()) {
        this.updateActivity();
      }
    }, 30000); // Update every 30 seconds

    // Listen for cross-tab messages
    if (this.config.enableCrossTabCommunication) {
      this.messageHandler = (e: StorageEvent) => {
        // This is handled by individual message listeners
      };
      window.addEventListener('storage', this.messageHandler);
    }
  }

  private clearEventListeners(): void {
    if (typeof window === 'undefined') return;

    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }

    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }

    if (this.messageHandler) {
      window.removeEventListener('storage', this.messageHandler);
      this.messageHandler = null;
    }
  }

  private updateTabInfo(tabInfo: ExtendedTabInfo): void {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(this.getStorageKey(TAB_INFO_KEY), JSON.stringify(tabInfo));
  }

  private updateActivity(): void {
    const currentInfo = this.getCurrentTabInfo();
    if (!currentInfo) return;

    currentInfo.lastActivity = new Date().toISOString();
    currentInfo.isActive = this.isCurrentTabActive();

    this.updateTabInfo(currentInfo);
    this.updateGlobalTabRegistry(currentInfo);
  }

  private updateGlobalTabRegistry(tabInfo: ExtendedTabInfo): void {
    if (typeof window === 'undefined') return;

    try {
      const registryKey = this.getStorageKey(GLOBAL_TAB_REGISTRY_KEY);
      const allTabsJson = localStorage.getItem(registryKey);
      let allTabs: ExtendedTabInfo[] = allTabsJson ? JSON.parse(allTabsJson) : [];

      // Remove existing entry for this tab
      allTabs = allTabs.filter(tab => tab.tabId !== this.tabId);

      // Add current tab info
      allTabs.push(tabInfo);

      // Clean up old entries
      const cutoffTime = new Date(Date.now() - this.config.activityTimeoutMinutes * 60 * 1000);
      allTabs = allTabs.filter(tab => new Date(tab.lastActivity) > cutoffTime);

      localStorage.setItem(registryKey, JSON.stringify(allTabs));
    } catch (error) {
      console.error('Error updating tab registry:', error);
    }
  }

  private removeFromGlobalTabRegistry(): void {
    if (typeof window === 'undefined') return;

    try {
      const registryKey = this.getStorageKey(GLOBAL_TAB_REGISTRY_KEY);
      const allTabsJson = localStorage.getItem(registryKey);
      if (!allTabsJson) return;

      let allTabs: ExtendedTabInfo[] = JSON.parse(allTabsJson);
      allTabs = allTabs.filter(tab => tab.tabId !== this.tabId);

      if (allTabs.length > 0) {
        localStorage.setItem(registryKey, JSON.stringify(allTabs));
      } else {
        localStorage.removeItem(registryKey);
      }
    } catch (error) {
      console.error('Error removing from tab registry:', error);
    }
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleEntries();
    }, this.config.cleanupIntervalMs);
  }

  private cleanupStaleEntries(): void {
    if (typeof window === 'undefined') return;

    try {
      const registryKey = this.getStorageKey(GLOBAL_TAB_REGISTRY_KEY);
      const allTabsJson = localStorage.getItem(registryKey);
      if (!allTabsJson) return;

      const allTabs: ExtendedTabInfo[] = JSON.parse(allTabsJson);
      const cutoffTime = new Date(Date.now() - this.config.activityTimeoutMinutes * 60 * 1000);
      const activeTabs = allTabs.filter(tab => new Date(tab.lastActivity) > cutoffTime);

      if (activeTabs.length !== allTabs.length) {
        if (activeTabs.length > 0) {
          localStorage.setItem(registryKey, JSON.stringify(activeTabs));
        } else {
          localStorage.removeItem(registryKey);
        }
      }
    } catch (error) {
      console.error('Error cleaning up stale entries:', error);
    }
  }

  private getCurrentUserId(): string | undefined {
    // This should be implemented based on your auth system
    // For now, return undefined - it will be set by the consumer
    return undefined;
  }

  private getStorageKey(key: string): string {
    return `${this.config.storagePrefix}_${key}`;
  }
}

// Create and export singleton instance with default config
export const tabManager = TabManager.getInstance();

// Export factory function for custom configurations
export function createTabManager(config: TabManagerConfig): TabManager {
  return TabManager.getInstance(config);
}