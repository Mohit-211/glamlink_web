# AI-CMS Package Usage Examples

Complete examples showing how to use the AI-CMS package in different scenarios.

## 1. Basic Magazine Content Generation

```typescript
import { 
  useAIGeneration, 
  AIMultiFieldDialog,
  AIModelProvider
} from '@/lib/packages/ai-cms';

const MagazineBasicInfoEditor = ({ currentData, onUpdate }) => {
  const [showAIDialog, setShowAIDialog] = useState(false);

  const ai = useAIGeneration({
    contentType: 'basic-info',
    onSuccess: (result) => {
      console.log('Generated fields:', result.fieldUpdates);
      onUpdate(result.fieldUpdates);
      setShowAIDialog(false);
    },
    onError: (error) => {
      console.error('Generation failed:', error);
    }
  });

  return (
    <div>
      <h2>Basic Information</h2>
      
      <input 
        value={currentData.title || ''} 
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Magazine title"
      />
      
      <textarea 
        value={currentData.description || ''} 
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Magazine description"
      />

      <button onClick={() => setShowAIDialog(true)}>
        ✨ Ask AI to Improve
      </button>

      <AIMultiFieldDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        contentType="basic-info"
        currentData={currentData}
        onApply={(updates) => {
          onUpdate(updates);
          setShowAIDialog(false);
        }}
      />
    </div>
  );
};

// Wrap in provider
export default function App() {
  return (
    <AIModelProvider>
      <MagazineBasicInfoEditor {...props} />
    </AIModelProvider>
  );
}
```

## 2. Content Block Generation for Blog Posts

```typescript
import { useAIGeneration } from '@/lib/packages/ai-cms';

const BlogContentEditor = ({ post, onUpdate }) => {
  const ai = useAIGeneration({
    contentType: 'blog',
    model: 'gpt-5', // Use more powerful model for long-form content
    onSuccess: (result) => {
      onUpdate({ 
        ...post, 
        content: result.generatedContent 
      });
    }
  });

  const generateIntroduction = async () => {
    await ai.generateContentBlock({
      contentType: 'blog',
      contentField: 'introduction',
      userPrompt: 'Write an engaging introduction for this blog post',
      currentContent: post.content || '',
      maxLength: 500,
      preserveFormatting: true
    });
  };

  const generateConclusion = async () => {
    await ai.generateContentBlock({
      contentType: 'blog', 
      contentField: 'conclusion',
      userPrompt: 'Write a compelling conclusion that summarizes key points',
      currentContent: post.content || '',
      maxLength: 300
    });
  };

  return (
    <div>
      <h1>{post.title}</h1>
      
      <div className="content-editor">
        <textarea 
          value={post.content || ''} 
          onChange={(e) => onUpdate({ ...post, content: e.target.value })}
          rows={20}
        />
      </div>

      <div className="ai-tools">
        <button onClick={generateIntroduction} disabled={ai.isGenerating}>
          {ai.isGenerating ? 'Generating...' : '✨ Generate Introduction'}
        </button>
        
        <button onClick={generateConclusion} disabled={ai.isGenerating}>
          {ai.isGenerating ? 'Generating...' : '✨ Generate Conclusion'}
        </button>
      </div>

      {ai.error && (
        <div className="error">
          Error: {ai.error}
        </div>
      )}
    </div>
  );
};
```

## 3. Field-by-Field AI Enhancement

```typescript
import { useAIGeneration } from '@/lib/packages/ai-cms';

const ProductFieldEditor = ({ product, onUpdate }) => {
  const ai = useAIGeneration({
    contentType: 'product',
    model: 'gpt-5-nano' // Fast model for single fields
  });

  const enhanceField = async (fieldName: string, currentValue: string, instruction: string) => {
    const result = await ai.generateSingleField({
      contentType: 'product',
      fieldName: fieldName,
      fieldType: 'text',
      userPrompt: instruction,
      currentValue: currentValue,
      maxLength: fieldName === 'name' ? 100 : 500
    });

    if (result?.success) {
      onUpdate({
        ...product,
        [fieldName]: result.generatedValue
      });
    }
  };

  return (
    <div>
      <div className="field-group">
        <label>Product Name</label>
        <div className="field-with-ai">
          <input 
            value={product.name || ''} 
            onChange={(e) => onUpdate({ ...product, name: e.target.value })}
          />
          <button onClick={() => enhanceField('name', product.name, 'Make this product name more appealing and professional')}>
            ✨ Enhance
          </button>
        </div>
      </div>

      <div className="field-group">
        <label>Description</label>
        <div className="field-with-ai">
          <textarea 
            value={product.description || ''} 
            onChange={(e) => onUpdate({ ...product, description: e.target.value })}
          />
          <button onClick={() => enhanceField('description', product.description, 'Write a compelling product description that highlights benefits')}>
            ✨ Enhance
          </button>
        </div>
      </div>

      <div className="field-group">
        <label>Key Benefits</label>
        <div className="field-with-ai">
          <textarea 
            value={product.benefits || ''} 
            onChange={(e) => onUpdate({ ...product, benefits: e.target.value })}
          />
          <button onClick={() => enhanceField('benefits', product.benefits, 'List specific benefits that appeal to customers')}>
            ✨ Enhance
          </button>
        </div>
      </div>

      {ai.isGenerating && (
        <div className="generating-indicator">
          🤖 Generating improved content...
        </div>
      )}
    </div>
  );
};
```

## 4. Advanced Refinement Process

```typescript
import { useRefinement, useFieldComparison, FieldComparison } from '@/lib/packages/ai-cms';

const ContentRefinementStudio = ({ initialContent, onSave }) => {
  const refinement = useRefinement(initialContent, {
    contentType: 'magazine',
    maxIterations: 8,
    onRefinementComplete: (iteration, success) => {
      console.log(`Refinement ${iteration} ${success ? 'succeeded' : 'failed'}`);
    }
  });

  const comparison = useFieldComparison(
    initialContent,
    refinement.content,
    {
      onSelectionChange: (selected) => {
        console.log('Selected fields for next refinement:', selected);
      }
    }
  );

  const suggestions = refinement.getRefinementSuggestions();
  const stats = refinement.getRefinementStats();

  return (
    <div className="refinement-studio">
      {/* Refinement Progress */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(stats.currentIteration / stats.maxIterations) * 100}%` }}>
        </div>
        <span>Iteration {stats.currentIteration} / {stats.maxIterations}</span>
      </div>

      {/* Field Comparisons */}
      <div className="field-comparisons">
        <h3>Changes ({comparison.changedFieldsCount} fields modified)</h3>
        {comparison.comparisons.map(comp => (
          <FieldComparison
            key={comp.fieldName}
            field={comp}
            onToggle={comparison.toggleField}
            showPreview={true}
          />
        ))}
      </div>

      {/* Quick Refinement Buttons */}
      <div className="quick-refinements">
        <h4>Quick Refinements:</h4>
        {suggestions.map(suggestion => (
          <button 
            key={suggestion}
            onClick={() => {
              const selectedFields = comparison.getSelectedFieldData();
              refinement.refineContent(suggestion, selectedFields);
            }}
            disabled={refinement.isRefining || !refinement.canRefine}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Custom Refinement */}
      <div className="custom-refinement">
        <textarea 
          placeholder="Describe how you want to improve the content..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              const prompt = e.target.value;
              const selectedFields = comparison.getSelectedFieldData();
              refinement.refineContent(prompt, selectedFields);
              e.target.value = '';
            }
          }}
        />
        <small>Press Ctrl+Enter to refine</small>
      </div>

      {/* History Navigation */}
      <div className="history-nav">
        <button onClick={refinement.revertToOriginal} disabled={!refinement.canRevert}>
          ← Original
        </button>
        
        {refinement.refinementHistory.map((item, index) => (
          <button 
            key={index}
            onClick={() => refinement.revertToIteration(item.iteration)}
            className={refinement.currentIteration === item.iteration ? 'active' : ''}
          >
            {item.iteration}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={() => onSave(refinement.content)} className="save-btn">
          💾 Save Changes
        </button>
        
        <button onClick={refinement.resetRefinement} className="reset-btn">
          🔄 Start Over
        </button>

        <button onClick={() => refinement.acceptRefinement()} className="accept-btn">
          ✅ Accept Current Version
        </button>
      </div>

      {/* Stats */}
      <div className="stats">
        <p>Success Rate: {(stats.successRate * 100).toFixed(1)}%</p>
        <p>Tokens Used: {stats.totalTokensUsed}</p>
        <p>Changes Made: {stats.changesFromOriginal}</p>
      </div>
    </div>
  );
};
```

## 5. Complete AI-Powered Form

```typescript
import { 
  useAIComplete, 
  AIMultiFieldDialog, 
  AIModelSelector,
  FieldComparison 
} from '@/lib/packages/ai-cms';

const AIEnhancedForm = ({ formData, onUpdate }) => {
  const [showAIDialog, setShowAIDialog] = useState(false);

  // Single hook provides all AI functionality
  const ai = useAIComplete({
    contentType: 'form',
    initialContent: formData,
    maxRefinements: 5
  });

  const handleGenerateAll = async () => {
    const result = await ai.generateAndCompare({
      contentType: 'basic-info',
      userPrompt: 'Make all fields more professional and engaging',
      currentData: formData,
      selectedFields: {
        title: true,
        description: true,
        tags: true,
        summary: true
      }
    });

    if (result) {
      onUpdate({ ...formData, ...result.fieldUpdates });
    }
  };

  const handleRefineSelected = async (prompt: string) => {
    const result = await ai.refineAndCompare(prompt);
    if (result?.fieldUpdates) {
      onUpdate({ ...formData, ...result.fieldUpdates });
    }
  };

  return (
    <div className="ai-enhanced-form">
      {/* Model Selection */}
      <div className="model-selector">
        <AIModelSelector />
      </div>

      {/* Form Fields */}
      <div className="form-fields">
        <input 
          value={formData.title || ''} 
          onChange={(e) => onUpdate({ ...formData, title: e.target.value })}
          placeholder="Title"
        />
        
        <textarea 
          value={formData.description || ''} 
          onChange={(e) => onUpdate({ ...formData, description: e.target.value })}
          placeholder="Description"
        />
        
        <input 
          value={formData.tags || ''} 
          onChange={(e) => onUpdate({ ...formData, tags: e.target.value })}
          placeholder="Tags (comma-separated)"
        />
      </div>

      {/* AI Controls */}
      <div className="ai-controls">
        <button onClick={handleGenerateAll} disabled={ai.isBusy}>
          ✨ Enhance All Fields
        </button>
        
        <button onClick={() => setShowAIDialog(true)} disabled={ai.isBusy}>
          🎯 Custom AI Instructions
        </button>
        
        <button onClick={() => handleRefineSelected('Make it more engaging')} disabled={ai.isBusy}>
          🔄 Make More Engaging
        </button>
      </div>

      {/* Field Comparisons */}
      {ai.comparison.comparisons.length > 0 && (
        <div className="field-comparisons">
          <h3>AI Suggestions:</h3>
          {ai.comparison.comparisons.map(comp => (
            <FieldComparison
              key={comp.fieldName}
              field={comp}
              onToggle={ai.comparison.toggleField}
              showPreview={true}
            />
          ))}
          
          <div className="comparison-actions">
            <button onClick={ai.comparison.selectAllChanged}>
              Select All Changes
            </button>
            <button onClick={ai.comparison.selectNone}>
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* AI Dialog */}
      <AIMultiFieldDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        contentType="basic-info"
        currentData={formData}
        onApply={(updates) => {
          onUpdate({ ...formData, ...updates });
          setShowAIDialog(false);
        }}
      />

      {/* Status */}
      {ai.isBusy && (
        <div className="ai-status">
          🤖 AI is working... ({ai.totalOperations} operations completed)
        </div>
      )}

      {ai.hasError && (
        <div className="ai-error">
          ❌ AI Error occurred. Please try again.
        </div>
      )}
    </div>
  );
};
```

## 6. Custom AI Service Integration

```typescript
import { AIService, PromptBuilder, ResponseParser } from '@/lib/packages/ai-cms';

const CustomAIIntegration = () => {
  const [result, setResult] = useState(null);
  
  // Create custom AI service
  const aiService = new AIService({
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-5',
    timeout: 45000,
    maxRetries: 3
  });

  const promptBuilder = new PromptBuilder();
  const responseParser = new ResponseParser();

  const customGeneration = async () => {
    try {
      // Build custom prompt
      const prompt = promptBuilder.buildCustomPrompt(
        'You are a {role} helping with {task}. {instructions}',
        {
          role: 'beauty expert',
          task: 'product recommendations',
          instructions: 'Provide detailed analysis and recommendations'
        }
      );

      // Use service directly
      const response = await aiService.generateMultiField({
        contentType: 'custom',
        userPrompt: prompt,
        currentData: { category: 'skincare' },
        selectedFields: { recommendations: true, analysis: true }
      });

      if (response.success) {
        // Parse response with custom logic
        const parsed = responseParser.parseMultiFieldResponse(
          response.userResponse,
          ['recommendations', 'analysis']
        );
        
        setResult(parsed);
      }
    } catch (error) {
      console.error('Custom AI generation failed:', error);
    }
  };

  // Check AI availability
  const checkAI = async () => {
    const available = await aiService.isAvailable();
    console.log('AI Service Available:', available);
    
    const stats = aiService.getUsageStats();
    console.log('Usage Stats:', stats);
  };

  return (
    <div>
      <button onClick={customGeneration}>
        🚀 Custom AI Generation
      </button>
      
      <button onClick={checkAI}>
        ❓ Check AI Status
      </button>

      {result && (
        <div>
          <h3>AI Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

These examples show the power and flexibility of the AI-CMS package! You can use it for everything from simple field enhancement to complex multi-step refinement processes. The package handles all the complexity while giving you clean, easy-to-use React hooks and components. 🚀