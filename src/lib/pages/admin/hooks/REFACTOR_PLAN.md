# Redux Hook Refactoring Pattern

## Overview

This document describes the pattern for refactoring monolithic Redux hooks into smaller, feature-specific hooks. This pattern was successfully applied to `useFormSubmissionsRedux` and can be reused for other large Redux hooks in the admin panel.

---

## Problem: Why Monolithic Hooks Are Problematic

### Issues with Large Monolithic Hooks

1. **Mixed Concerns**: Single hook handles multiple unrelated domains
2. **Cognitive Load**: Developers must understand all domains to use one
3. **Poor Performance**: Components import unnecessary code
4. **Difficult Testing**: Can't test domains independently
5. **Large Bundle Sizes**: Unused operations get bundled anyway
6. **Confusing Returns**: Return type contains properties for all domains

### Example Problem

```typescript
// Monolithic hook (400+ lines)
const {
  getFeatured,           // Domain 1
  digitalCard,           // Domain 2
  formConfigs,          // Domain 3
  // 20+ operations for all 3 domains
} = useFormSubmissionsRedux();

// Component only needs Get Featured, but imports everything
```

---

## Solution: Feature-Specific Redux Hooks

### Architecture Pattern

Split one monolithic hook into multiple feature-specific hooks, each focusing on a single domain:

**Before:**
```
/lib/pages/admin/hooks/
└── useFormSubmissionsRedux.ts (404 lines - handles 3 domains)
```

**After:**
```
/lib/pages/admin/components/form-submissions/
├── get-featured/
│   └── useGetFeaturedSubmissionsRedux.ts (120 lines - 1 domain)
├── professionals/
│   └── useDigitalCardSubmissionsRedux.ts (150 lines - 1 domain)
└── form-configurations/
    └── useFormConfigurationsRedux.ts (140 lines - 1 domain)
```

### Benefits

1. **Reduced Cognitive Load**: Each hook has one clear purpose
2. **Better Organization**: Hooks live near their feature components
3. **Improved Maintainability**: Changes to one domain don't affect others
4. **Better Tree-Shaking**: Unused code won't be bundled
5. **Easier Testing**: Test domains independently
6. **Clearer Types**: Each hook returns only what's needed

---

## Step-by-Step Refactoring Process

### Phase 1: Analyze the Monolithic Hook

1. **Identify Domains**
   - Look for distinct feature areas (e.g., Get Featured, Digital Card, Form Configs)
   - Each domain should have its own state slice and operations

2. **Map Redux Dependencies**
   - Find the Redux slices being used
   - Identify thunks/actions for each domain
   - Check if Redux slices are already split (they usually should be)

3. **Understand Current Usage**
   - Find all components using the monolithic hook
   - Determine which domains each component needs
   - Note: Most components only use 1-2 domains, not all

### Phase 2: Create Feature-Specific Hooks

For each domain, create a new hook following this template:

```typescript
'use client';

/**
 * use[Feature]Redux - Redux hook for [Feature] with caching
 *
 * Provides access to [Feature] data with automatic caching.
 * Data is only fetched if the cache is empty.
 */

import { useEffect, useCallback } from 'react';
import { useAdminDispatch, useAdminSelector } from '@/lib/pages/admin/hooks/useReduxAdmin';
import type { [FeatureType] } from './types';
import {
  fetch[Feature]Async,
  update[Feature]Async,
  delete[Feature]Async,
  // ... other thunks
} from '@/lib/pages/admin/store/slices/[feature-slice]';

// =============================================================================
// TYPES
// =============================================================================

export interface Use[Feature]ReduxReturn {
  // State
  [feature]: {
    data: [FeatureType][];
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    isDeleting: boolean;
  };

  // Operations (simplified names)
  fetchData: () => Promise<void>;
  getById: (id: string) => Promise<[FeatureType] | null>;
  updateItem: (id: string, data: Partial<[FeatureType]>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function use[Feature]Redux(): Use[Feature]ReduxReturn {
  const dispatch = useAdminDispatch();

  // Select state from Redux
  const [feature] = useAdminSelector((state) => state.admin.[featureSlice].[feature]);

  // ===========================================================================
  // AUTO-FETCH ON MOUNT (only if cache empty)
  // ===========================================================================

  useEffect(() => {
    if ([feature].data.length === 0 && ![feature].isLoading) {
      dispatch(fetch[Feature]Async());
    }
  }, []); // Empty deps - run once on mount

  // ===========================================================================
  // OPERATIONS
  // ===========================================================================

  const fetchData = useCallback(async () => {
    await dispatch(fetch[Feature]Async()).unwrap();
  }, [dispatch]);

  const getById = useCallback(
    async (id: string): Promise<[FeatureType] | null> => {
      try {
        const response = await fetch(`/api/[feature]/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        return data.success && data.data ? data.data : null;
      } catch (err) {
        console.error('Error fetching:', err);
        return null;
      }
    },
    []
  );

  const updateItem = useCallback(
    async (id: string, data: Partial<[FeatureType]>) => {
      await dispatch(update[Feature]Async({ id, ...data })).unwrap();
    },
    [dispatch]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await dispatch(delete[Feature]Async(id)).unwrap();
    },
    [dispatch]
  );

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    [feature],
    fetchData,
    getById,
    updateItem,
    deleteItem,
  };
}

export default use[Feature]Redux;
```

### Phase 3: Update Component Hooks

For each component hook that uses the monolithic hook:

1. **Update Import**
   ```typescript
   // BEFORE
   import { useFormSubmissionsRedux } from '@/lib/pages/admin/hooks/useFormSubmissionsRedux';

   // AFTER
   import { use[Feature]Redux } from './use[Feature]Redux';
   ```

2. **Update Hook Usage**
   ```typescript
   // BEFORE
   const {
     [feature],
     fetch[Feature]Data,
     get[Feature]ById,
     update[Feature],
     delete[Feature],
   } = useFormSubmissionsRedux();

   // AFTER
   const {
     [feature],
     fetchData,
     getById,
     updateItem,
     deleteItem,
   } = use[Feature]Redux();
   ```

3. **Update Method Calls**
   - Find all usages of the old method names
   - Replace with new simplified names
   - Update useCallback dependencies

### Phase 4: Update Exports

Create or update `index.ts` files in each feature directory:

```typescript
// Redux Hook
export { use[Feature]Redux } from './use[Feature]Redux';

// Component Hook
export { use[Feature]Tab } from './use[Feature]Tab';

// Tab Component
export { default as [Feature]Tab } from './[Feature]Tab';

// Types
export * from './types';
```

### Phase 5: Delete Old Files

1. Delete the monolithic hook file
2. Delete any unused API hooks
3. Verify no broken imports with grep

```bash
# Verify no remaining imports
grep -r "useFormSubmissionsRedux" lib/
grep -r "use[OldHook]API" lib/
```

### Phase 6: Document the Refactoring

Create documentation (this file!) describing:
1. Problem solved
2. Pattern used
3. Step-by-step process
4. Reusable template

---

## Verification Checklist

After refactoring, verify:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] No broken imports (`grep -r "[OldHook]" lib/`)
- [ ] All tabs load correctly
- [ ] Data fetches on first visit
- [ ] Cache works on return visits ("Updated X min, Y sec" shows)
- [ ] Manual refresh works and resets timer
- [ ] All CRUD operations work
- [ ] Loading states display correctly
- [ ] Error states display correctly

---

## File Size Comparison: FormSubmissions Example

**Before Refactoring:**
- Monolithic hook: 404 lines
- Unused API hook: 244 lines
- **Total:** 648 lines

**After Refactoring:**
- Get Featured hook: 120 lines
- Digital Card hook: 150 lines
- Form Configs hook: 140 lines
- **Total:** 410 lines

**Reduction:** 238 lines (37% reduction)

**Per-Component Reduction:**
- Before: Each component imports 404 lines
- After: Each component imports ~120-150 lines
- **Per-import reduction:** 60-65%

---

## When to Use This Pattern

### ✅ Apply This Pattern When:

1. **Hook exceeds 300 lines**
2. **Hook handles multiple unrelated domains**
3. **Components only use subset of hook's functionality**
4. **Multiple auto-fetch effects exist**
5. **Return type has 10+ properties**

### ❌ Don't Apply When:

1. **Hook is already focused (< 200 lines)**
2. **All components need all functionality**
3. **Domains are tightly coupled**
4. **Hook handles truly shared logic**

---

## Applying This to Other Hooks

### Candidates for Refactoring

Check these hooks in `/lib/pages/admin/hooks/`:

1. **usePromosRedux** (~150 lines) - Already well-sized ✅
2. **useProfessionalsRedux** (~180 lines) - Already well-sized ✅
3. **useDigitalRedux** (~120 lines) - Already well-sized ✅

### Future Additions

When creating new admin features:

1. **Start with feature-specific hook** in the component directory
2. **Keep hooks focused** (~100-150 lines)
3. **Follow the template** above
4. **Co-locate with components** for better organization

---

## Key Principles

1. **Feature-Specific, Not Monolithic**: One hook per domain
2. **Co-location**: Hooks live near their components
3. **Simplified Names**: `fetchData` not `fetch[Feature]Submissions`
4. **Auto-Fetch Pattern**: Fetch only if cache empty
5. **Consistent Structure**: Follow the template
6. **Clear Responsibilities**: One hook, one domain

---

## Example Migration: FormSubmissions

### Before

```typescript
// /lib/pages/admin/hooks/useFormSubmissionsRedux.ts (404 lines)
export function useFormSubmissionsRedux() {
  // State for 3 domains
  const getFeatured = useAdminSelector(...);
  const digitalCard = useAdminSelector(...);
  const formConfigs = useAdminSelector(...);

  // 3 auto-fetch effects
  useEffect(...); // Get Featured
  useEffect(...); // Digital Card
  useEffect(...); // Form Configs

  // 20+ operations
  return {
    getFeatured,
    digitalCard,
    formConfigs,
    fetchGetFeaturedSubmissions,
    getGetFeaturedSubmission,
    updateGetFeaturedStatus,
    deleteGetFeaturedSubmission,
    fetchDigitalCardSubmissions,
    getDigitalCardSubmission,
    updateDigitalCardStatus,
    deleteDigitalCardSubmission,
    convertToProfessional,
    fetchFormConfigs,
    getFormConfigById,
    createFormConfig,
    updateFormConfig,
    deleteFormConfig,
    toggleFormConfigEnabledState,
    migrateGetFeaturedForms,
    migrateDigitalCardForm,
  };
}
```

### After

```typescript
// /lib/pages/admin/components/form-submissions/get-featured/useGetFeaturedSubmissionsRedux.ts (120 lines)
export function useGetFeaturedSubmissionsRedux() {
  const getFeatured = useAdminSelector(...);

  useEffect(...); // Auto-fetch if cache empty

  return {
    getFeatured,
    fetchSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
  };
}

// /lib/pages/admin/components/form-submissions/professionals/useDigitalCardSubmissionsRedux.ts (150 lines)
export function useDigitalCardSubmissionsRedux() {
  const digitalCard = useAdminSelector(...);

  useEffect(...); // Auto-fetch if cache empty

  return {
    digitalCard,
    fetchSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
    convertToProfessional,
  };
}

// /lib/pages/admin/components/form-submissions/form-configurations/useFormConfigurationsRedux.ts (140 lines)
export function useFormConfigurationsRedux() {
  const formConfigs = useAdminSelector(...);

  useEffect(...); // Auto-fetch if cache empty

  return {
    formConfigs,
    fetchFormConfigs,
    getFormConfigById,
    createFormConfig,
    updateFormConfig,
    deleteFormConfig,
    toggleFormConfigEnabledState,
    migrateGetFeaturedForms,
    migrateDigitalCardForm,
  };
}
```

---

## Summary

This refactoring pattern transforms large monolithic Redux hooks into smaller, focused, feature-specific hooks that are:

- **Easier to understand** (one domain per hook)
- **Easier to maintain** (changes isolated to one feature)
- **Easier to test** (test domains independently)
- **More performant** (better tree-shaking, smaller bundles)
- **Better organized** (co-located with components)

Apply this pattern whenever a Redux hook grows beyond 300 lines or handles multiple unrelated domains.

---

**Date:** December 2024
**Applied To:** useFormSubmissionsRedux
**Result:** 404 lines → 410 lines (3 hooks), 37% reduction, improved maintainability
