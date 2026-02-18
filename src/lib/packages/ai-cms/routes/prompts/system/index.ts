/**
 * System Prompts - Exports
 * 
 * Centralized exports for all system prompts used in AI generation.
 * These prompts provide the foundation for AI content creation across all handlers.
 */

// Multi-field generation prompts
export {
  MULTI_FIELD_BASE_PROMPT,
  MULTI_FIELD_INITIAL_PROMPT,
  MULTI_FIELD_REFINEMENT_PROMPT,
  CONTENT_TYPE_PROMPTS,
  FIELD_SPECIFIC_GUIDANCE,
  getMultiFieldSystemPrompt,
  getFieldGuidance
} from './multiField';

// Content block generation prompts
export {
  CONTENT_BLOCK_BASE_PROMPT,
  CONTENT_BLOCK_GENERATION_PROMPT,
  HTML_CONTENT_BLOCK_PROMPT,
  LONG_FORM_CONTENT_PROMPT,
  CONTENT_BLOCK_TYPE_PROMPTS,
  CONTENT_IMPROVEMENT_PROMPT,
  getContentBlockSystemPrompt,
  getContentImprovementPrompt
} from './contentBlock';

// Single field generation prompts
export {
  SINGLE_FIELD_BASE_PROMPT,
  FIELD_TYPE_PROMPTS,
  BEAUTY_FIELD_PROMPTS,
  CONTEXTUAL_FIELD_PROMPTS,
  FIELD_VALIDATION_PROMPTS,
  getSingleFieldSystemPrompt,
  getContextualPrompt,
  getFieldValidationPrompt
} from './singleField';

// Refinement prompts
export {
  REFINEMENT_BASE_PROMPT,
  INITIAL_REFINEMENT_PROMPT,
  PROGRESSIVE_REFINEMENT_PROMPT,
  REFINEMENT_CONTEXT_PROMPTS,
  REFINEMENT_QUALITY_PROMPTS,
  REFINEMENT_BEST_PRACTICES,
  getRefinementSystemPrompt,
  assessRefinementCompletion,
  getRefinementBestPractices
} from './refinement';

/**
 * Common prompt building utilities
 */

/**
 * Build a complete system prompt by combining multiple prompt components
 */
export function buildSystemPrompt(components: {
  base: string;
  type?: string;
  context?: string;
  constraints?: string;
  examples?: string;
}): string {
  let prompt = components.base;
  
  if (components.type) {
    prompt += `\n\n${components.type}`;
  }
  
  if (components.context) {
    prompt += `\n\n${components.context}`;
  }
  
  if (components.constraints) {
    prompt += `\n\n${components.constraints}`;
  }
  
  if (components.examples) {
    prompt += `\n\n${components.examples}`;
  }
  
  return prompt.trim();
}

/**
 * Add beauty industry context to any prompt
 */
export function addBeautyContext(prompt: string): string {
  const beautyContext = `
BEAUTY INDUSTRY CONTEXT:
- Focus on beauty, skincare, wellness, and lifestyle content
- Use accurate beauty and skincare terminology
- Address diverse skin types, tones, and beauty preferences
- Include specific, actionable beauty advice when relevant
- Maintain professional expertise while being approachable
- Consider seasonal beauty trends and innovations
- Address common beauty concerns and questions`;

  return prompt + beautyContext;
}

/**
 * Add length constraints to any prompt
 */
export function addLengthConstraints(prompt: string, maxLength: number): string {
  const lengthContext = `
LENGTH REQUIREMENTS:
- Maximum ${maxLength} characters
- Prioritize quality and completeness within the limit
- Use concise language without sacrificing clarity
- Focus on the most important and valuable information
- Avoid redundancy and filler content`;

  return prompt + lengthContext;
}

/**
 * Add SEO optimization context to any prompt
 */
export function addSEOContext(prompt: string, keywords?: string[]): string {
  let seoContext = `
SEO OPTIMIZATION:
- Include relevant keywords naturally in the content
- Write compelling meta descriptions and titles
- Create content that matches search intent
- Use semantic keywords and related terms
- Maintain readability while incorporating SEO elements`;

  if (keywords && keywords.length > 0) {
    seoContext += `
- Target keywords: ${keywords.join(', ')}`;
  }

  return prompt + seoContext;
}

/**
 * Add accessibility context to any prompt
 */
export function addAccessibilityContext(prompt: string): string {
  const accessibilityContext = `
ACCESSIBILITY REQUIREMENTS:
- Use clear, simple language that's easy to understand
- Provide descriptive alt text for any image references
- Ensure content is screen reader friendly
- Use proper heading hierarchy and structure
- Include sufficient color contrast considerations
- Make content navigable and logical in structure`;

  return prompt + accessibilityContext;
}

/**
 * Common response format templates
 */
export const RESPONSE_FORMATS = {
  fieldUpdates: `
RESPONSE FORMAT:
Please respond with:
1. A brief explanation of what you changed and why
2. Then provide the updated field values in this exact format:

FIELD_UPDATES:
{
  "fieldName": "new value",
  "anotherField": "another new value"
}

IMPORTANT: Only include fields that were requested to be updated.`,

  generatedContent: `
RESPONSE FORMAT:
Provide your response in two parts:
1. A brief explanation of your approach and changes
2. The generated content marked with:

GENERATED_CONTENT:
[Your generated content here]

IMPORTANT: Only include the content for the specified field, no additional metadata.`,

  singleField: `
RESPONSE FORMAT:
Provide a brief explanation followed by:

FIELD_VALUE:
[Your generated value here]

IMPORTANT: Only provide the value for this specific field, no additional content.`,

  refinement: `
RESPONSE FORMAT:
Please respond with:
1. A brief explanation of the specific refinements made and why
2. Then provide the updated field values in this exact format:

FIELD_UPDATES:
{
  "fieldName": "refined value",
  "anotherField": "another refined value"
}

IMPORTANT: Only refine fields that were specifically requested.`
};

/**
 * Get appropriate response format for prompt type
 */
export function getResponseFormat(promptType: 'multiField' | 'contentBlock' | 'singleField' | 'refinement'): string {
  switch (promptType) {
    case 'multiField':
      return RESPONSE_FORMATS.fieldUpdates;
    case 'contentBlock':
      return RESPONSE_FORMATS.generatedContent;
    case 'singleField':
      return RESPONSE_FORMATS.singleField;
    case 'refinement':
      return RESPONSE_FORMATS.refinement;
    default:
      return RESPONSE_FORMATS.fieldUpdates;
  }
}

/**
 * Prompt validation utilities
 */

/**
 * Validate that a prompt contains required elements
 */
export function validatePrompt(prompt: string, requiredElements: string[]): boolean {
  return requiredElements.every(element => 
    prompt.toLowerCase().includes(element.toLowerCase())
  );
}

/**
 * Estimate token count for a prompt (rough approximation)
 */
export function estimateTokenCount(prompt: string): number {
  // Rough approximation: 1 token ≈ 4 characters
  return Math.ceil(prompt.length / 4);
}

/**
 * Truncate prompt if it exceeds maximum length
 */
export function truncatePrompt(prompt: string, maxTokens: number): string {
  const maxChars = maxTokens * 4; // Rough conversion
  
  if (prompt.length <= maxChars) {
    return prompt;
  }
  
  // Try to truncate at sentence boundary
  const truncated = prompt.substring(0, maxChars);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxChars * 0.8) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  return truncated + '...';
}