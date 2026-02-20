/**
 * Lock Group Helper Utilities
 * 
 * Utilities for managing and determining lock groups across different resources.
 * This helps prevent unnecessary API calls when switching between resources
 * that share the same lock group.
 */

/**
 * Determine if two resources share the same lock group
 */
export function isSameLockGroup(
  group1: string | undefined,
  group2: string | undefined
): boolean {
  // If either is undefined, they're different
  if (!group1 || !group2) return false;
  
  return group1 === group2;
}

/**
 * Get the lock group for a given section/resource type
 * This can be customized per application
 */
export function getLockGroupForSection(
  sectionType: string,
  customGroups?: Record<string, string>
): string | undefined {
  // Default magazine editor lock groups
  const defaultGroups: Record<string, string> = {
    'basic-info': 'issue-metadata',
    'cover-config': 'issue-metadata',
    'cover-configuration': 'issue-metadata',
    'sections': 'sections-list',
    'template': 'template-config',
    ...customGroups
  };
  
  return defaultGroups[sectionType];
}

/**
 * Check if switching between two sections requires a lock change
 */
export function requiresLockChange(
  fromSection: string,
  toSection: string,
  customGroups?: Record<string, string>
): boolean {
  const fromGroup = getLockGroupForSection(fromSection, customGroups);
  const toGroup = getLockGroupForSection(toSection, customGroups);
  
  // If groups are the same, no lock change needed
  if (fromGroup === toGroup) {
    console.log(`[LockGroupHelper] No lock change needed: both sections in group "${fromGroup}"`);
    return false;
  }
  
  console.log(`[LockGroupHelper] Lock change required: "${fromGroup}" -> "${toGroup}"`);
  return true;
}

/**
 * Get all sections that share a lock group with the given section
 */
export function getRelatedSections(
  sectionType: string,
  allSections: string[],
  customGroups?: Record<string, string>
): string[] {
  const targetGroup = getLockGroupForSection(sectionType, customGroups);
  if (!targetGroup) return [];
  
  return allSections.filter(section => {
    const group = getLockGroupForSection(section, customGroups);
    return group === targetGroup;
  });
}

/**
 * Determine if a lock group represents shared resources
 */
export function isSharedLockGroup(lockGroup: string | undefined): boolean {
  if (!lockGroup) return false;
  
  // Common patterns for shared lock groups
  const sharedPatterns = [
    'metadata',
    'config',
    'settings',
    'group',
    'shared'
  ];
  
  return sharedPatterns.some(pattern => 
    lockGroup.toLowerCase().includes(pattern)
  );
}

/**
 * Create a cache key for a lock group
 */
export function getLockGroupCacheKey(
  collection: string,
  lockGroup: string
): string {
  return `${collection}:lockgroup:${lockGroup}`;
}

/**
 * Check if a resource is part of a lock group
 */
export function isInLockGroup(
  resourceId: string,
  lockGroup: string,
  groupMembers: string[]
): boolean {
  return groupMembers.includes(resourceId);
}

export default {
  isSameLockGroup,
  getLockGroupForSection,
  requiresLockChange,
  getRelatedSections,
  isSharedLockGroup,
  getLockGroupCacheKey,
  isInLockGroup
};