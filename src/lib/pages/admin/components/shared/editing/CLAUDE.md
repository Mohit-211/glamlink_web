# Refactored Form System

This directory contains a refactored form editing system that addresses performance issues found in the original `editing/` directory.

## Problem Solved

The original form system had several issues causing poor user experience:

1. **Focus Loss**: Cursor jumped out of input fields while typing
2. **Excessive Re-renders**: All 26+ fields re-rendered on every keystroke
3. **Laggy Input**: Cascading state updates caused noticeable lag

## Root Causes (in original system)

1. **Double State Anti-Pattern**: Each field had both local state (`inputValue`) AND parent state (`value`), synchronized via `useEffect`
2. **Multiple State Updates**: `handleFieldChange` triggered 2-3 `setState` calls per keystroke
3. **Artificial Focus Management**: `useEffect` with `[formData]` dependency ran focus restoration every keystroke
4. **Parent State Mutations**: `customOnChange` could update parent state, causing field array recreation

## Solution Architecture

### Key Principles

1. **Controlled Components Only**: No local state in fields, use form context directly
2. **Single State Source**: Form data lives in context only, not duplicated
3. **Single State Update**: One `setState` per field change
4. **Native Focus**: Let browser handle focus, no artificial restoration
5. **Validation on Blur**: Only validate when field loses focus, not every keystroke

### Component Structure

```
editing/
├── index.ts              # Public exports
├── types.ts              # Type definitions
├── FormProvider.tsx      # React Context for form state
├── useFormState.ts       # Form state hook (alternative to context)
├── FormModal.tsx         # Modal wrapper component
├── FormRenderer.tsx      # Maps field configs to components
├── JsonEditor.tsx        # Raw JSON editing mode
└── fields/
    ├── index.ts          # Field registry and exports
    ├── BaseField.tsx     # Shared field wrapper
    ├── TextField.tsx     # Text input (controlled)
    ├── TextAreaField.tsx # Textarea (controlled)
    ├── SelectField.tsx   # Select dropdown
    ├── CheckboxField.tsx # Checkbox
    ├── NumberField.tsx   # Number input
    ├── DateField.tsx     # Date picker
    ├── EmailField.tsx    # Email input
    ├── UrlField.tsx      # URL input
    ├── PhoneField.tsx    # Phone input
    ├── ArrayField.tsx    # String/object arrays
    ├── ImageField.tsx    # Wraps legacy ImageUpload
    ├── GalleryField.tsx  # Wraps legacy GalleryField
    ├── LocationField.tsx # Wraps legacy LocationField
    ├── SpecialtiesField.tsx # Wraps legacy SpecialtiesField
    └── PromotionsField.tsx  # Wraps legacy PromotionField
```

## Usage

### Basic Usage

```typescript
import { FormModal } from '@/lib/pages/admin/components/shared/editing';
import { professionalEditFields } from '@/lib/pages/admin/config/editFields';

function MyComponent() {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Professional"
      initialData={professional}
      fields={professionalEditFields}
      onSave={handleSave}
    />
  );
}
```

### With Field Change Handler

```typescript
<FormModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Add Professional"
  initialData={defaultData}
  fields={fields}
  onSave={handleSave}
  onFieldChange={(name, value, data) => {
    // Handle field changes (e.g., modalType changes)
    if (name === 'modalType') {
      setCurrentModalType(value);
    }
  }}
/>
```

### With JSON Editor

```typescript
<FormModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit Professional"
  initialData={professional}
  fields={fields}
  onSave={handleSave}
  showTabs={true}
  defaultTab="form"
/>
```

## How It Works

### 1. FormProvider (Context)

Provides form state to all child components:

```typescript
<FormProvider initialData={data} fields={fields} onFieldChange={handler}>
  {children}
</FormProvider>
```

The context provides:
- `formData` - Current form values
- `getFieldValue(name)` - Get a specific field value
- `updateField(name, value)` - Update a field value
- `errors` - Validation errors per field
- `validateField(name)` - Validate a specific field
- `validateAllFields()` - Validate all fields

### 2. Field Components

Each field component:
- Uses `useFormContext()` to get value and update function
- NO local `useState` for the value
- Direct controlled pattern: `value={getFieldValue(name)}`
- Receives `error` as a prop (not from context) to enable targeted re-renders
- Memoized with both `field` and `error` comparison

```typescript
interface TextFieldProps {
  field: FieldConfig;
  error?: string;  // Passed from FormRenderer
}

function TextField({ field, error }: TextFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  return (
    <BaseField field={field} error={error}>
      <input
        value={value}
        onChange={(e) => updateField(field.name, e.target.value)}
        onBlur={() => validateField(field.name)}
      />
    </BaseField>
  );
}

// Memo compares both field and error for optimal re-rendering
export const TextField = memo(TextFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
```

**Why error is passed as a prop:**
- If fields got `error` from context directly and memo only compared `field`, validation errors wouldn't display (memo would block re-render)
- If we removed memo, ALL fields would re-render on every keystroke (defeating the optimization)
- By passing `error` as prop, only the field with a changed error re-renders

### 3. Wrapped Legacy Components

Complex components (Gallery, Location, Image, etc.) wrap existing implementations.

**IMPORTANT**: Do NOT wrap legacy components in `BaseField` - they render their own labels, which would cause duplicate labels.

```typescript
interface GalleryFieldProps {
  field: FieldConfig;
  error?: string;
}

function GalleryFieldComponent({ field, error }: GalleryFieldProps) {
  const { getFieldValue, updateField } = useFormContext();

  // Render legacy component directly - NO BaseField wrapper
  return (
    <LegacyGalleryField
      field={field}
      value={getFieldValue(field.name) || []}
      onChange={(name, val) => updateField(name, val)}
      error={error}
    />
  );
}

export const GalleryField = memo(GalleryFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
```

**Legacy components that should NOT use BaseField wrapper:**
- `ImageField` - wraps ImageUploadField (has its own label)
- `GalleryField` - wraps LegacyGalleryField (has its own label)
- `LocationField` - wraps LegacyLocationField (has its own label)
- `SpecialtiesField` - wraps LegacySpecialtiesField (has its own label)
- `PromotionsField` - wraps LegacyPromotionField (has its own label)

## Migration Guide

### From Old FormModal to New

Replace:
```typescript
import { FormModal } from '@/lib/pages/admin/components/shared/editing/FormModal';
```

With:
```typescript
import { FormModal } from '@/lib/pages/admin/components/shared/editing';
```

The prop interface is largely compatible. Key differences:
- No `formRendererProps` (not needed)
- `onFieldChange` is called after state update (safer)

## Key Differences from Original

| Aspect | Original | Refactored |
|--------|----------|------------|
| State location | Duplicated (parent + local) | Single (context) |
| setState per keystroke | 2-3 calls | 1 call |
| Focus management | Artificial (useEffect + timeout) | Native (browser) |
| Field memoization | By value comparison | By reference |
| Validation timing | Every keystroke | On blur/submit |
| Component structure | Props drilling | Context |

## Supported Field Types

- `text` - Single-line text input
- `textarea` - Multi-line text input
- `select` - Dropdown selection
- `checkbox` - Boolean toggle
- `number` - Numeric input with min/max
- `date` - Date picker
- `email` - Email input with validation
- `url` - URL input with validation
- `tel` - Phone number input
- `array` - String or object arrays
- `image` - Image upload
- `gallery` - Multi-media gallery
- `locationInput` - Google Maps location picker
- `specialties` - Beauty specialty tags
- `promotions` - Promotional offers

## Testing

To test the new system:

1. Type in text fields - cursor should stay in place
2. Type rapidly - no lag or missed characters
3. Switch between fields - focus moves correctly
4. Tab navigation should work naturally
5. Required field validation shows on blur
6. JSON editor mode works correctly
7. Save persists all field values
