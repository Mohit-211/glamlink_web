'use client';

/**
 * Lock Coordinator - Manages coordination between multiple LockManager instances
 * 
 * This utility prevents race conditions when multiple components try to manage
 * the same lock group. It uses sessionStorage to coordinate handoffs between
 * components that share a lock group.
 */

const COORDINATOR_KEY_PREFIX = 'lock_coordinator_';
const ACTIVE_COMPONENTS_KEY = 'active_lock_components';
const LOCK_HANDOFF_KEY = 'lock_handoff_in_progress';

interface ActiveComponent {
  componentId: string;
  resourceId: string;
  lockGroup?: string;
  mountedAt: string;
  lastActivity: string;
}

interface LockHandoff {
  fromComponentId: string;
  toComponentId: string;
  lockGroup: string;
  resourceId: string;
  initiatedAt: string;
}

export class LockCoordinator {
  private componentId: string;
  private cleanupTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.componentId = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[LockCoordinator] Created new coordinator instance: ${this.componentId}`);
  }

  /**
   * Register a component as active for a lock group
   */
  registerComponent(resourceId: string, lockGroup?: string): void {
    console.log(`[LockCoordinator] Registering component ${this.componentId} for resource ${resourceId}, lockGroup: ${lockGroup}`);
    
    const components = this.getActiveComponents();
    const now = new Date().toISOString();
    
    // Add or update this component
    const existingIndex = components.findIndex(c => c.componentId === this.componentId);
    const component: ActiveComponent = {
      componentId: this.componentId,
      resourceId,
      lockGroup,
      mountedAt: existingIndex >= 0 ? components[existingIndex].mountedAt : now,
      lastActivity: now
    };

    if (existingIndex >= 0) {
      components[existingIndex] = component;
    } else {
      components.push(component);
    }

    this.setActiveComponents(components);
    console.log(`[LockCoordinator] Active components:`, components);
  }

  /**
   * Unregister a component
   */
  unregisterComponent(): void {
    console.log(`[LockCoordinator] Unregistering component ${this.componentId}`);
    
    const components = this.getActiveComponents();
    const filtered = components.filter(c => c.componentId !== this.componentId);
    this.setActiveComponents(filtered);
    
    console.log(`[LockCoordinator] Remaining active components:`, filtered);
  }

  /**
   * Check if another component with the same lock group is active
   */
  hasOtherComponentWithSameLockGroup(lockGroup: string): boolean {
    const components = this.getActiveComponents();
    const others = components.filter(c => 
      c.componentId !== this.componentId && 
      c.lockGroup === lockGroup
    );
    
    console.log(`[LockCoordinator] Checking for other components with lockGroup ${lockGroup}:`, others);
    return others.length > 0;
  }

  /**
   * Initiate a lock handoff to another component
   */
  initiateLockHandoff(resourceId: string, lockGroup: string): void {
    console.log(`[LockCoordinator] Initiating lock handoff for ${lockGroup} from ${this.componentId}`);
    
    const handoff: LockHandoff = {
      fromComponentId: this.componentId,
      toComponentId: '', // Will be claimed by next component
      lockGroup,
      resourceId,
      initiatedAt: new Date().toISOString()
    };
    
    sessionStorage.setItem(this.getKey(LOCK_HANDOFF_KEY), JSON.stringify(handoff));
    
    // Clear handoff after 500ms if not claimed
    this.cleanupTimeout = setTimeout(() => {
      this.clearHandoff();
    }, 500);
  }

  /**
   * Check if there's a pending handoff for this lock group
   */
  checkForPendingHandoff(lockGroup: string): boolean {
    const handoffStr = sessionStorage.getItem(this.getKey(LOCK_HANDOFF_KEY));
    if (!handoffStr) return false;
    
    try {
      const handoff: LockHandoff = JSON.parse(handoffStr);
      
      // Check if handoff is for our lock group and not too old
      const isRecent = new Date().getTime() - new Date(handoff.initiatedAt).getTime() < 1000;
      const isForOurGroup = handoff.lockGroup === lockGroup;
      const isFromDifferentComponent = handoff.fromComponentId !== this.componentId;
      
      if (isRecent && isForOurGroup && isFromDifferentComponent) {
        console.log(`[LockCoordinator] Found pending handoff for ${lockGroup}`, handoff);
        
        // Claim the handoff
        handoff.toComponentId = this.componentId;
        sessionStorage.setItem(this.getKey(LOCK_HANDOFF_KEY), JSON.stringify(handoff));
        
        // Clear handoff after claiming
        setTimeout(() => this.clearHandoff(), 100);
        
        return true;
      }
    } catch (error) {
      console.error('[LockCoordinator] Error checking handoff:', error);
    }
    
    return false;
  }

  /**
   * Clear any pending handoff
   */
  private clearHandoff(): void {
    sessionStorage.removeItem(this.getKey(LOCK_HANDOFF_KEY));
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
      this.cleanupTimeout = null;
    }
  }

  /**
   * Get all active components
   */
  private getActiveComponents(): ActiveComponent[] {
    const componentsStr = sessionStorage.getItem(this.getKey(ACTIVE_COMPONENTS_KEY));
    if (!componentsStr) return [];
    
    try {
      const components: ActiveComponent[] = JSON.parse(componentsStr);
      
      // Filter out stale components (inactive for more than 60 seconds)
      const cutoff = new Date().getTime() - 60000;
      return components.filter(c => 
        new Date(c.lastActivity).getTime() > cutoff
      );
    } catch (error) {
      console.error('[LockCoordinator] Error parsing active components:', error);
      return [];
    }
  }

  /**
   * Set active components
   */
  private setActiveComponents(components: ActiveComponent[]): void {
    sessionStorage.setItem(this.getKey(ACTIVE_COMPONENTS_KEY), JSON.stringify(components));
  }

  /**
   * Get storage key with prefix
   */
  private getKey(key: string): string {
    return `${COORDINATOR_KEY_PREFIX}${key}`;
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    console.log(`[LockCoordinator] Destroying coordinator ${this.componentId}`);
    this.unregisterComponent();
    this.clearHandoff();
  }
}

// Export singleton for shared coordination
let coordinatorInstance: LockCoordinator | null = null;

export function getLockCoordinator(): LockCoordinator {
  if (!coordinatorInstance && typeof window !== 'undefined') {
    coordinatorInstance = new LockCoordinator();
  }
  return coordinatorInstance!;
}

export function resetLockCoordinator(): void {
  if (coordinatorInstance) {
    coordinatorInstance.destroy();
    coordinatorInstance = null;
  }
}