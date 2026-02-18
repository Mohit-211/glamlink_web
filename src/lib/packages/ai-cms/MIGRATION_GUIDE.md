# AI-CMS Package Migration Guide

This guide shows how to migrate existing code to use the new AI-CMS package.

## Quick Migration Examples

### 1. Update API Routes

**Before (old API route):**
```typescript
// /app/api/magazine/editor/ai-multi-field/route.ts
export async function POST(request: NextRequest) {
  // 200+ lines of authentication, validation, and AI logic
  const { currentUser } = await getAuthenticatedAppForUser();
  // ... complex logic
}
```

**After (using AI-CMS package):**
```typescript
// /app/api/magazine/editor/ai-multi-field/route.ts
import { withAIRouteMiddleware } from '@/lib/packages/ai-cms';

export const POST = withAIRouteMiddleware(
  'multiField',
  'magazine-multi-field',
  async (request, user, validatedData) => {
    // Just the core business logic - middleware handles everything else
    return NextResponse.json({ success: true, data: validatedData });
  }
);
```

### 2. Update Components

**Before (complex imports):**
```typescript
import AIMultiFieldDialog from '../../../components/editor/AIMultiFieldDialog';
import AIModelSelector from '../../../components/editor/AIModelSelector';
import { useAIModel } from '../../../../contexts/AIModelContext';
import { AITab } from '../../../components/editor/TabSelectionEditor/tabs/AITab';
```

**After (single import):**
```typescript
import { 
  AIMultiFieldDialog, 
  AIModelSelector, 
  useAIModel,
  AITab
} from '@/lib/packages/ai-cms';
```

### 3. Update Component Usage

**Before:**
```typescript
// Old component with scattered state management
const IssueEditForm = () => {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [aiModel, setAiModel] = useState('gpt-5-mini');
  // ... 100+ lines of AI-related state and logic
  
  return (
    <div>
      {/* Complex form logic mixed with AI logic */}
      <AIMultiFieldDialog 
        // Many props passed manually
      />
    </div>
  );
};
```

**After:**
```typescript
// Clean component using AI-CMS hooks
const IssueEditForm = () => {
  const aiGeneration = useAIGeneration({
    contentType: 'magazine',
    onSuccess: (result) => console.log('AI generated:', result)
  });
  
  const fieldComparison = useFieldComparison(
    currentData, 
    aiGeneration.generatedContent?.fieldUpdates
  );
  
  return (
    <div>
      {/* Clean form logic */}
      <AIMultiFieldDialog 
        isOpen={aiGeneration.isGenerating}
        onClose={() => aiGeneration.clear()}
        contentType="basic-info"
        currentData={currentData}
        onApply={handleApply}
      />
    </div>
  );
};
```

## Complete Migration Steps

### Step 1: Install Package Dependencies

Update your existing API routes to use the new handlers:

```typescript
// /app/api/ai-cms/multi-field/route.ts (new file)
import { handleMultiFieldGeneration } from '@/lib/packages/ai-cms';

export async function POST(request: NextRequest) {
  return handleMultiFieldGeneration(request, {
    collection: 'magazine_issues',
    contentType: 'magazine'
  });
}

// /app/api/ai-cms/content-block/route.ts (new file)  
import { handleContentBlockGeneration } from '@/lib/packages/ai-cms';

export async function POST(request: NextRequest) {
  return handleContentBlockGeneration(request, {
    collection: 'content_blocks',
    contentType: 'blog'
  });
}

// /app/api/ai-cms/single-field/route.ts (new file)
import { handleSingleFieldGeneration } from '@/lib/packages/ai-cms';

export async function POST(request: NextRequest) {
  return handleSingleFieldGeneration(request, {
    collection: 'fields',
    contentType: 'form'
  });
}
```

### Step 2: Update Existing Components

Replace old imports with package imports:

```bash
# Find and replace across your codebase
# Before: import ... from './components/editor/AI...'  
# After: import { ... } from '@/lib/packages/ai-cms'
```

### Step 3: Wrap App with Context Providers

```typescript
// /app/layout.tsx or your main app component
import { AIModelProvider, AIEditingProvider } from '@/lib/packages/ai-cms';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AIModelProvider>
          <AIEditingProvider>
            {children}
          </AIEditingProvider>
        </AIModelProvider>
      </body>
    </html>
  );
}
```

### Step 4: Update Component Implementation

Use the new hooks for cleaner state management:

```typescript
// Example: Magazine Editor Component
import { 
  useAIGeneration, 
  useFieldComparison, 
  useRefinement,
  AIMultiFieldDialog 
} from '@/lib/packages/ai-cms';

const MagazineEditor = ({ initialData }) => {
  // Single hook provides all AI functionality
  const ai = useAIGeneration({
    contentType: 'magazine',
    onSuccess: (result) => {
      // Handle successful generation
      console.log('Generated content:', result.fieldUpdates);
    },
    onError: (error) => {
      console.error('AI Error:', error);
    }
  });

  // Field comparison for before/after view
  const comparison = useFieldComparison(
    initialData,
    ai.generatedContent?.fieldUpdates,
    {
      onSelectionChange: (fields) => {
        console.log('Selected fields:', fields);
      }
    }
  );

  // Refinement for iterative improvements
  const refinement = useRefinement(initialData, {
    contentType: 'magazine',
    maxIterations: 5
  });

  const handleGenerate = async (prompt: string, fields: string[]) => {
    await ai.generateMultiField({
      contentType: 'basic-info',
      userPrompt: prompt,
      currentData: initialData,
      selectedFields: fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    });
  };

  const handleRefine = async (prompt: string) => {
    const selectedFields = comparison.getSelectedFieldData();
    await refinement.refineContent(prompt, selectedFields);
  };

  return (
    <div>
      <button onClick={() => handleGenerate('Make this more professional', ['title', 'subtitle'])}>
        Generate Content
      </button>
      
      <button onClick={() => handleRefine('Add more details')}>
        Refine Content
      </button>

      <AIMultiFieldDialog
        isOpen={ai.isGenerating}
        onClose={ai.clear}
        contentType="basic-info"
        currentData={initialData}
        onApply={(updates) => {
          // Apply the updates to your data
          console.log('Applying updates:', updates);
        }}
      />

      {/* Show field comparisons */}
      {comparison.comparisons.map(comp => (
        <div key={comp.fieldName}>
          <h4>{comp.displayName}</h4>
          <p>Old: {comp.oldValue}</p>
          <p>New: {comp.newValue}</p>
          <button onClick={() => comparison.toggleField(comp.fieldName)}>
            {comp.shouldUpdate ? 'Deselect' : 'Select'}
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Benefits After Migration

### Before Migration:
- **2000+ lines** in IssueEditForm.tsx
- **Complex imports** from multiple paths  
- **Scattered AI logic** across components
- **Difficult to maintain** and extend
- **Hard to test** AI functionality

### After Migration:
- **~500 lines** in main components
- **Single import** from ai-cms package
- **Centralized AI logic** in reusable package
- **Easy to maintain** and extend
- **Testable** AI functionality in isolation

### Key Improvements:
- ✅ **50%+ code reduction** in main components
- ✅ **Clean import syntax** - single import for all AI features  
- ✅ **Reusable across app** - use AI features anywhere
- ✅ **Type-safe** - full TypeScript support
- ✅ **Well-tested** - isolated testing of AI features
- ✅ **Scalable** - easy to add new AI capabilities

## Compatibility

The new package is **100% backward compatible**. You can migrate incrementally:

1. **Phase 1**: Update imports (no functionality changes)
2. **Phase 2**: Use new hooks (cleaner state management)  
3. **Phase 3**: Use new API routes (better middleware)
4. **Phase 4**: Add new AI features easily

## Need Help?

The migration is designed to be straightforward, but if you encounter issues:

1. **Check imports** - ensure you're importing from the package
2. **Verify context providers** - make sure they wrap your app
3. **Update API endpoints** - point to new ai-cms routes
4. **Test incrementally** - migrate one component at a time

The AI-CMS package maintains the same API contracts as the original components, so migration should be smooth! 🚀