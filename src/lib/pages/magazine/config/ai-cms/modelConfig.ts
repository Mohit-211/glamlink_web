export interface AIModel {
  id: string;
  label: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google';
  maxTokens: number;
  temperature: number;
  costPer1kTokens: number; // in USD
  speed: 'slow' | 'medium' | 'fast';
  quality: 'good' | 'excellent' | 'premium';
  bestFor: string[];
  available: boolean;
  isDefault?: boolean;
}

export interface ModelRecommendation {
  sectionType: string;
  contentBlock: string;
  recommendedModel: string;
  reason: string;
  alternativeModel?: string;
}

export const AI_MODELS: Record<string, AIModel> = {
  'gpt-5': {
    id: 'gpt-5',
    label: 'GPT-5',
    description: 'Most capable, best for complex reasoning and detailed content generation',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.002,
    speed: 'medium',
    quality: 'premium',
    bestFor: ['complex content', 'interviews', 'detailed articles', 'creative writing'],
    available: true,
    isDefault: false
  },
  
  'gpt-5-mini': {
    id: 'gpt-5-mini',
    label: 'GPT-5 Mini',
    description: 'Balanced performance and speed for most content editing tasks',
    provider: 'openai',
    maxTokens: 2048,
    temperature: 0.7,
    costPer1kTokens: 0.015,
    speed: 'fast',
    quality: 'excellent',
    bestFor: ['tips', 'product descriptions', 'short articles', 'lists'],
    available: true,
    isDefault: true
  },
  
  'gpt-5-nano': {
    id: 'gpt-5-nano',
    label: 'GPT-5 Nano',
    description: 'Fastest model, best for simple edits and quick tasks',
    provider: 'openai',
    maxTokens: 1024,
    temperature: 0.5,
    costPer1kTokens: 0.001,
    speed: 'fast',
    quality: 'good',
    bestFor: ['quotes', 'simple tips', 'product lists', 'basic descriptions'],
    available: true,
    isDefault: false
  },
  
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    label: 'Claude 3 Sonnet',
    description: 'Excellent for nuanced, professional content',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.015,
    speed: 'medium',
    quality: 'excellent',
    bestFor: ['professional profiles', 'interviews', 'educational content'],
    available: false // Placeholder for future implementation
  }
};

export const MODEL_RECOMMENDATIONS: ModelRecommendation[] = [
  {
    sectionType: 'maries-corner',
    contentBlock: 'mainStory',
    recommendedModel: 'gpt-5',
    reason: 'Complex article writing requires advanced reasoning and creativity',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'maries-corner', 
    contentBlock: 'mariesPicks',
    recommendedModel: 'gpt-5-mini',
    reason: 'Product recommendations benefit from good reasoning but are less complex',
    alternativeModel: 'gpt-5-nano'
  },
  {
    sectionType: 'maries-corner',
    contentBlock: 'sideStories', 
    recommendedModel: 'gpt-5-mini',
    reason: 'Tips and advice need good quality but are relatively straightforward',
    alternativeModel: 'gpt-5-nano'
  },
  {
    sectionType: 'cover-pro-feature',
    contentBlock: 'professional',
    recommendedModel: 'gpt-5',
    reason: 'Professional profiles require nuanced, high-quality writing',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'cover-pro-feature',
    contentBlock: 'interview',
    recommendedModel: 'gpt-5',
    reason: 'Interview content needs sophisticated dialogue and personality',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'top-product-spotlight',
    contentBlock: 'product',
    recommendedModel: 'gpt-5-mini',
    reason: 'Product descriptions need good detail but are structured content',
    alternativeModel: 'gpt-5-nano'
  },
  {
    sectionType: 'top-product-spotlight',
    contentBlock: 'similar',
    recommendedModel: 'gpt-5-nano',
    reason: 'Product lists are straightforward and don\'t require premium models',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'top-treatment',
    contentBlock: 'treatment',
    recommendedModel: 'gpt-5',
    reason: 'Treatment information requires accuracy and professional expertise',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'top-treatment',
    contentBlock: 'beforeAfter',
    recommendedModel: 'gpt-5-mini',
    reason: 'Testimonials need personality but are less complex than technical content',
    alternativeModel: 'gpt-5-nano'
  },
  {
    sectionType: 'rising-star',
    contentBlock: 'profile',
    recommendedModel: 'gpt-5-mini',
    reason: 'Profile content needs good storytelling but is less complex than interviews',
    alternativeModel: 'gpt-5-nano'
  },
  {
    sectionType: 'rising-star',
    contentBlock: 'achievements',
    recommendedModel: 'gpt-5-nano',
    reason: 'Achievement lists are straightforward and factual',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'quote-wall',
    contentBlock: 'quotes',
    recommendedModel: 'gpt-5-nano',
    reason: 'Quote generation is simple and doesn\'t require premium models',
    alternativeModel: 'gpt-5-mini'
  },
  {
    sectionType: 'pro-tips',
    contentBlock: 'tips',
    recommendedModel: 'gpt-5-mini',
    reason: 'Professional tips need good accuracy but are structured content',
    alternativeModel: 'gpt-5-nano'
  },
  {
    sectionType: 'whats-new-glamlink',
    contentBlock: 'updates',
    recommendedModel: 'gpt-5-nano',
    reason: 'Feature descriptions are straightforward marketing content',
    alternativeModel: 'gpt-5-mini'
  }
];

// Helper functions
export function getAvailableModels(): AIModel[] {
  return Object.values(AI_MODELS).filter(model => model.available);
}

export function getDefaultModel(): AIModel {
  return Object.values(AI_MODELS).find(model => model.isDefault) || AI_MODELS['gpt-5-mini'];
}

export function getModelById(modelId: string): AIModel | undefined {
  return AI_MODELS[modelId];
}

export function getRecommendedModel(sectionType: string, contentBlock: string): string {
  const recommendation = MODEL_RECOMMENDATIONS.find(
    rec => rec.sectionType === sectionType && rec.contentBlock === contentBlock
  );
  
  return recommendation?.recommendedModel || getDefaultModel().id;
}

export function getAlternativeModel(sectionType: string, contentBlock: string): string | undefined {
  const recommendation = MODEL_RECOMMENDATIONS.find(
    rec => rec.sectionType === sectionType && rec.contentBlock === contentBlock
  );
  
  return recommendation?.alternativeModel;
}

export function calculateEstimatedCost(modelId: string, estimatedTokens: number): number {
  const model = getModelById(modelId);
  if (!model) return 0;
  
  return (estimatedTokens / 1000) * model.costPer1kTokens;
}

export function getModelsByComplexity(complexity: 'low' | 'medium' | 'high'): AIModel[] {
  const availableModels = getAvailableModels();
  
  switch (complexity) {
    case 'low':
      return availableModels.filter(model => model.quality === 'good' || model.speed === 'fast');
    case 'medium':
      return availableModels.filter(model => model.quality === 'excellent' || model.quality === 'good');
    case 'high':
      return availableModels.filter(model => model.quality === 'premium' || model.quality === 'excellent');
    default:
      return availableModels;
  }
}

export function formatModelLabel(model: AIModel): string {
  return `${model.label} - ${model.quality} quality, ${model.speed} speed ($${model.costPer1kTokens}/1k tokens)`;
}

// Complexity scoring for automatic model selection
export function calculateComplexityScore(sectionType: string, contentBlock: string): number {
  // Base complexity scores by section type
  const sectionComplexity: Record<string, number> = {
    'maries-corner': 8,
    'cover-pro-feature': 9,
    'top-product-spotlight': 6,
    'top-treatment': 7,
    'rising-star': 6,
    'quote-wall': 3,
    'pro-tips': 5,
    'whats-new-glamlink': 4
  };
  
  // Content block multipliers
  const blockMultipliers: Record<string, number> = {
    'mainStory': 1.2,
    'interview': 1.3,
    'professional': 1.1,
    'treatment': 1.1,
    'profile': 1.0,
    'product': 0.9,
    'tips': 0.8,
    'quotes': 0.5,
    'similar': 0.7,
    'achievements': 0.6,
    'updates': 0.7
  };
  
  const baseScore = sectionComplexity[sectionType] || 5;
  const multiplier = blockMultipliers[contentBlock] || 1.0;
  
  return Math.round(baseScore * multiplier);
}

export function getOptimalModel(sectionType: string, contentBlock: string, prioritizeCost = false): AIModel {
  const complexityScore = calculateComplexityScore(sectionType, contentBlock);
  const availableModels = getAvailableModels();
  
  if (prioritizeCost) {
    // Sort by cost, then by quality
    return availableModels
      .filter(model => complexityScore <= 6 || model.quality !== 'good')
      .sort((a, b) => a.costPer1kTokens - b.costPer1kTokens)[0] || getDefaultModel();
  } else {
    // High complexity -> premium models, low complexity -> efficient models
    if (complexityScore >= 8) {
      return availableModels.find(model => model.quality === 'premium') || getDefaultModel();
    } else if (complexityScore >= 6) {
      return availableModels.find(model => model.quality === 'excellent' && model.speed !== 'slow') || getDefaultModel();
    } else {
      return availableModels.find(model => model.speed === 'fast' && model.costPer1kTokens < 0.01) || getDefaultModel();
    }
  }
}