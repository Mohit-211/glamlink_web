# Migration Guide: Using Admin Profile Redux Store

This guide explains how to migrate admin components and hooks from local state management to the centralized Redux store using `adminProfileSlice`.

## Overview

The `adminProfileSlice` provides centralized state management for:
- Brand/Profile data
- Form state with unsaved changes tracking
- Questionnaire data
- Brainstorm ideas
- Upload states
- Loading and error states
- Active tab management

## Benefits

1. **Single Source of Truth**: All profile data in one place
2. **Automatic Synchronization**: Updates reflect across all components
3. **Built-in Caching**: Data persists during navigation
4. **Better Performance**: Prevents duplicate API calls
5. **Cleaner Code**: Less boilerplate in components

## Migration Steps

### 1. Replace Local State Hooks with Redux Store

#### Before (Local State):
```typescript
const ProfileTab = () => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      try {
        const data = await firestoreService.getDocument('brands', brandId);
        setBrand(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [brandId]);
  
  // ... rest of component
};
```

#### After (Redux Store):
```typescript
import { useProfileStore } from '@/lib/admin/hooks/useProfileStore';

const ProfileTab = () => {
  const { 
    brand, 
    isLoading, 
    error,
    loadBrandProfile 
  } = useProfileStore();
  
  useEffect(() => {
    if (brandId && !brand) {
      loadBrandProfile(brandId);
    }
  }, [brandId, brand, loadBrandProfile]);
  
  // ... rest of component
};
```

### 2. Use Pre-built Hooks

We provide specialized hooks that wrap the Redux store for common use cases:

#### For Profile Management:
```typescript
import { useAdminProfile } from '@/lib/admin/hooks/useAdminProfile';

const ProfileForm = () => {
  const {
    brand,
    formData,
    isLoading,
    isSaving,
    handleInputChange,
    handleSubmit,
    handleProfileImageUpload,
  } = useAdminProfile();
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

#### For Brainstorm Features:
```typescript
import { useAdminBrainstorm } from '@/lib/admin/hooks/useAdminBrainstorm';

const BrainstormTab = () => {
  const {
    ideas,
    isGenerating,
    generateIdeas,
    deleteIdea,
    getIdeasByCategory,
  } = useAdminBrainstorm();
  
  // Component logic
};
```

### 3. Update Form Handling

#### Before:
```typescript
const [formData, setFormData] = useState({});
const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

#### After:
```typescript
const { profileFormData, updateForm } = useProfileStore();
const handleChange = (e) => {
  updateForm({ [e.target.name]: e.target.value });
};
```

### 4. Handle Async Operations

All async operations return Redux thunk results that can be checked:

```typescript
const handleSave = async () => {
  const result = await saveBrandProfile(brandId, updates);
  
  if (saveBrandProfile.fulfilled.match(result)) {
    // Success
    console.log('Profile saved successfully');
  } else {
    // Error handling is automatic via Redux
    console.error('Failed to save profile');
  }
};
```

### 5. Access Nested State

The store provides computed values and helper functions:

```typescript
const {
  brainstormIdeas,    // All ideas
  selectedIdeaId,     // Currently selected idea ID
  getSelectedIdea,    // Helper to get the full selected idea object
} = useProfileStore();

const selectedIdea = getSelectedIdea();
```

## Common Patterns

### Loading States
```typescript
const { isLoading, isSaving, isGenerating } = useProfileStore();

if (isLoading) return <LoadingSpinner />;
if (isSaving) return <div>Saving...</div>;
```

### Error Handling
```typescript
const { error, clearProfileError } = useProfileStore();

useEffect(() => {
  if (error) {
    toast.error(error);
    // Auto-clear after showing
    const timer = setTimeout(clearProfileError, 5000);
    return () => clearTimeout(timer);
  }
}, [error, clearProfileError]);
```

### Tab Management
```typescript
const { activeTab, changeTab } = useProfileStore();

const handleTabClick = (tab: string) => {
  changeTab(tab);
};
```

### Image Uploads
```typescript
const { uploadImage, uploadingImages } = useProfileStore();

const handleImageUpload = async (file: File) => {
  await uploadImage(brandId, file, 'profile');
};

// Check upload state
if (uploadingImages.profile) {
  return <div>Uploading profile image...</div>;
}
```

## Best Practices

1. **Use the Specialized Hooks**: `useAdminProfile` and `useAdminBrainstorm` provide pre-configured functionality
2. **Avoid Direct API Calls**: Always use Redux actions for data operations
3. **Let Redux Handle Loading/Error States**: Don't duplicate these in local state
4. **Check Thunk Results**: When you need to know if an operation succeeded
5. **Leverage Caching**: Data persists in Redux, so check if it exists before fetching

## Available Actions

### Profile Actions
- `loadBrandProfile(brandId)` - Fetch brand data
- `saveBrandProfile(brandId, updates)` - Update brand
- `createBrand(userId, email)` - Create new brand
- `uploadImage(brandId, file, type)` - Upload profile/cover image

### Form Actions
- `updateForm(updates)` - Update form data
- `resetForm()` - Reset to saved data

### Questionnaire Actions
- `saveQuestionnaire(brandId, data)` - Save questionnaire
- `updateQuestionnaireData(data)` - Update local questionnaire data
- `updateQuestionnaireProgress(progress)` - Track progress

### Brainstorm Actions
- `generateIdeas(brand, options)` - Generate new ideas
- `deleteIdea(brandId, ideaId)` - Delete an idea
- `selectIdea(ideaId)` - Select/view an idea

### UI Actions
- `changeTab(tab)` - Change active tab
- `clearProfileError()` - Clear error message

## TypeScript Support

All actions and state are fully typed. Import types as needed:

```typescript
import { AdminProfileState } from '@/lib/admin/store/adminProfileSlice';
import { Brand, BrainstormIdea } from '@/lib/pages/brand/types';
```

## Debugging

Check Redux DevTools to see:
- Current state structure
- Action history
- State changes over time

The state is organized under `adminProfile` in the Redux store.