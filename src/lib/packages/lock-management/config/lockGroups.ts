/**
 * Lock Group Configuration
 * 
 * Defines which fields/tabs share locks to prevent conflicts across related content.
 * 
 * Note: No 'use client' directive - this configuration works on both client and server.
 */

import { LockGroupConfig } from '../types/lock.types';

// Lock group definitions
export const LOCK_GROUPS: LockGroupConfig = {
  // Magazine editor groups
  'issue-metadata': {
    description: 'Magazine issue metadata (title, subtitle, cover configuration)',
    fields: ['basic-info', 'cover-config'],
    priority: 'high'
  },
  
  'issue-content': {
    description: 'Magazine issue content sections',
    fields: ['sections', 'editor-note'],
    priority: 'medium'
  },
  
  // Document editor groups
  'document-metadata': {
    description: 'Document properties and settings',
    fields: ['title', 'description', 'tags', 'category'],
    priority: 'medium'
  },
  
  'document-content': {
    description: 'Main document content and formatting',
    fields: ['content', 'formatting', 'styles'],
    priority: 'high',
    maxDuration: 15 // 15 minutes for long-form editing
  },
  
  // User profile groups
  'profile-basic': {
    description: 'Basic profile information',
    fields: ['name', 'email', 'bio', 'avatar'],
    priority: 'low'
  },
  
  'profile-settings': {
    description: 'Profile settings and preferences',
    fields: ['privacy', 'notifications', 'preferences'],
    priority: 'low'
  },
  
  // Brand management groups
  'brand-identity': {
    description: 'Brand identity and visual elements',
    fields: ['name', 'logo', 'colors', 'fonts'],
    priority: 'high'
  },
  
  'brand-content': {
    description: 'Brand content and messaging',
    fields: ['tagline', 'mission', 'description', 'story'],
    priority: 'medium'
  },
  
  // Product management groups
  'product-basic': {
    description: 'Basic product information',
    fields: ['name', 'description', 'category', 'price'],
    priority: 'medium'
  },
  
  'product-media': {
    description: 'Product images and media',
    fields: ['images', 'videos', 'gallery'],
    priority: 'low'
  },
  
  'product-inventory': {
    description: 'Inventory and availability',
    fields: ['stock', 'variants', 'availability'],
    priority: 'high'
  }
};

// Function to get lock group for a specific field
export function getLockGroup(field: string): string | undefined {
  for (const [groupName, config] of Object.entries(LOCK_GROUPS)) {
    if (config.fields.includes(field)) {
      return groupName;
    }
  }
  return undefined;
}

// Function to get all fields in a lock group
export function getFieldsInGroup(groupName: string): string[] {
  return LOCK_GROUPS[groupName]?.fields || [];
}

// Function to check if two fields share a lock group
export function doFieldsShareLock(field1: string, field2: string): boolean {
  const group1 = getLockGroup(field1);
  const group2 = getLockGroup(field2);
  
  return group1 !== undefined && group1 === group2;
}

// Function to get lock group priority
export function getLockGroupPriority(field: string): 'high' | 'medium' | 'low' {
  const group = getLockGroup(field);
  return group ? LOCK_GROUPS[group].priority || 'medium' : 'medium';
}

// Function to get max duration for a lock group
export function getLockGroupMaxDuration(field: string): number | undefined {
  const group = getLockGroup(field);
  return group ? LOCK_GROUPS[group].maxDuration : undefined;
}

// Collection-specific lock group mappings
export const COLLECTION_LOCK_GROUPS: Record<string, Record<string, string>> = {
  // Magazine collections
  magazine_issues: {
    'basic-info': 'issue-metadata',
    'cover-config': 'issue-metadata',
    'sections': 'issue-content',
    'editor-note': 'issue-content'
  },
  
  sections: {
    // Each section gets its own lock (no grouping)
  },
  
  // Document collections
  documents: {
    'title': 'document-metadata',
    'description': 'document-metadata',
    'tags': 'document-metadata',
    'category': 'document-metadata',
    'content': 'document-content',
    'formatting': 'document-content',
    'styles': 'document-content'
  },
  
  // User collections
  users: {
    'name': 'profile-basic',
    'email': 'profile-basic',
    'bio': 'profile-basic',
    'avatar': 'profile-basic',
    'privacy': 'profile-settings',
    'notifications': 'profile-settings',
    'preferences': 'profile-settings'
  },
  
  // Brand collections
  brands: {
    'name': 'brand-identity',
    'logo': 'brand-identity',
    'colors': 'brand-identity',
    'fonts': 'brand-identity',
    'tagline': 'brand-content',
    'mission': 'brand-content',
    'description': 'brand-content',
    'story': 'brand-content'
  },
  
  // Product collections
  products: {
    'name': 'product-basic',
    'description': 'product-basic',
    'category': 'product-basic',
    'price': 'product-basic',
    'images': 'product-media',
    'videos': 'product-media',
    'gallery': 'product-media',
    'stock': 'product-inventory',
    'variants': 'product-inventory',
    'availability': 'product-inventory'
  }
};

// Function to get lock group for a collection/field combination
export function getCollectionFieldLockGroup(collection: string, field: string): string | undefined {
  return COLLECTION_LOCK_GROUPS[collection]?.[field];
}

// Function to resolve the final lock group considering both field and collection
export function resolveLockGroup(collection: string, field: string, explicitGroup?: string): string | undefined {
  // Explicit group takes precedence
  if (explicitGroup) {
    return explicitGroup;
  }
  
  // Check collection-specific mapping
  const collectionGroup = getCollectionFieldLockGroup(collection, field);
  if (collectionGroup) {
    return collectionGroup;
  }
  
  // Fallback to general field mapping
  return getLockGroup(field);
}

// Function to validate lock group configuration
export function validateLockGroups(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for circular dependencies
  const allFields = new Set<string>();
  for (const config of Object.values(LOCK_GROUPS)) {
    for (const field of config.fields) {
      if (allFields.has(field)) {
        errors.push(`Field "${field}" appears in multiple lock groups`);
      }
      allFields.add(field);
    }
  }
  
  // Check priority values
  for (const [groupName, config] of Object.entries(LOCK_GROUPS)) {
    if (config.priority && !['high', 'medium', 'low'].includes(config.priority)) {
      errors.push(`Invalid priority "${config.priority}" for group "${groupName}"`);
    }
    
    if (config.maxDuration && config.maxDuration <= 0) {
      errors.push(`Invalid maxDuration "${config.maxDuration}" for group "${groupName}"`);
    }
  }
  
  // Check collection mappings reference valid groups
  for (const [collection, mappings] of Object.entries(COLLECTION_LOCK_GROUPS)) {
    for (const [field, group] of Object.entries(mappings)) {
      if (group && !LOCK_GROUPS[group]) {
        errors.push(`Collection "${collection}" field "${field}" references unknown group "${group}"`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to get lock group summary for debugging
export function getLockGroupSummary(): Record<string, any> {
  const summary: Record<string, any> = {};
  
  for (const [groupName, config] of Object.entries(LOCK_GROUPS)) {
    summary[groupName] = {
      description: config.description,
      fieldCount: config.fields.length,
      priority: config.priority || 'medium',
      maxDuration: config.maxDuration || 'default',
      collections: []
    };
    
    // Find which collections use this group
    for (const [collection, mappings] of Object.entries(COLLECTION_LOCK_GROUPS)) {
      const fieldsUsingGroup = Object.entries(mappings)
        .filter(([_, group]) => group === groupName)
        .map(([field, _]) => field);
      
      if (fieldsUsingGroup.length > 0) {
        summary[groupName].collections.push({
          collection,
          fields: fieldsUsingGroup
        });
      }
    }
  }
  
  return summary;
}

// Export default lock group resolver function
export function createLockGroupResolver(collection: string) {
  return (field: string, explicitGroup?: string) => {
    return resolveLockGroup(collection, field, explicitGroup);
  };
}

// Aliases for backward compatibility with expected export names
export const lockGroups = LOCK_GROUPS;
export const LOCK_GROUP_CONFIGS = LOCK_GROUPS;