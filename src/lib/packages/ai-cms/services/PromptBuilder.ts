/**
 * Prompt Builder Service
 * 
 * Handles dynamic construction of prompts for AI generation.
 * Combines templates, context, and user input into optimized prompts.
 */

import type { FieldType } from '../types';

export interface PromptBuildParams {
  contentType: string;
  userPrompt: string;
  currentData?: any;
  selectedFields?: Record<string, any>;
  isRefinement?: boolean;
  refinementContext?: any;
}

export interface ContentBlockPromptParams {
  contentType: string;
  contentField: string;
  userPrompt: string;
  currentContent: string;
  maxLength?: number;
}

export interface SingleFieldPromptParams {
  contentType: string;
  fieldName: string;
  fieldType: FieldType;
  userPrompt: string;
  currentValue: string;
  context?: Record<string, any>;
  suggestions?: string[];
  maxLength?: number;
}

export class PromptBuilder {
  /**
   * Build multi-field prompt
   */
  buildMultiFieldPrompt(params: PromptBuildParams): string {
    const {
      contentType,
      userPrompt,
      currentData,
      selectedFields,
      isRefinement,
      refinementContext
    } = params;

    let message = `Content Type: ${contentType}\n\n`;
    
    message += `User Instructions: ${userPrompt}\n\n`;
    
    const fieldNames = Object.keys(selectedFields || {});
    message += `Fields to ${isRefinement ? 'refine' : 'update'}: ${fieldNames.join(', ')}\n\n`;
    
    message += `Current field values:\n`;
    for (const field of fieldNames) {
      const value = currentData?.[field] || '';
      const truncatedValue = this.truncateForDisplay(value, 200);
      message += `${field}: ${truncatedValue}\n`;
    }
    
    if (isRefinement && refinementContext) {
      message += `\nRefinement Context:\n`;
      if (refinementContext.previousPrompts) {
        message += `Previous prompts: ${refinementContext.previousPrompts.slice(-2).join(', ')}\n`;
      }
      if (refinementContext.currentIteration) {
        message += `Current iteration: ${refinementContext.currentIteration}\n`;
      }
    }
    
    message += `\nPlease ${isRefinement ? 'refine' : 'update'} the specified fields based on the instructions.`;
    
    return message;
  }

  /**
   * Build content block prompt
   */
  buildContentBlockPrompt(params: ContentBlockPromptParams): string {
    const {
      contentType,
      contentField,
      userPrompt,
      currentContent,
      maxLength
    } = params;

    let message = `Content Type: ${contentType}\n`;
    message += `Field: ${contentField}\n\n`;
    message += `User Instructions: ${userPrompt}\n`;

    if (currentContent) {
      const truncatedContent = this.truncateForDisplay(currentContent, 1000);
      message += `\nCurrent Content:\n${truncatedContent}`;
    }

    if (maxLength) {
      message += `\nLength Requirement: Maximum ${maxLength} characters`;
    }

    message += `\nPlease ${currentContent ? 'improve the existing content' : 'generate new content'} based on the user instructions.`;

    return message;
  }

  /**
   * Build single field prompt
   */
  buildSingleFieldPrompt(params: SingleFieldPromptParams): string {
    const {
      contentType,
      fieldName,
      fieldType,
      userPrompt,
      currentValue,
      context,
      suggestions,
      maxLength
    } = params;

    let message = `Field: ${fieldName} (${fieldType})\n`;
    message += `Content Type: ${contentType}\n\n`;
    message += `User Instructions: ${userPrompt}`;

    if (currentValue) {
      const truncatedValue = this.truncateForDisplay(currentValue, 200);
      message += `\n\nCurrent Value:\n${truncatedValue}`;
    }

    if (context && Object.keys(context).length > 0) {
      message += `\n\nAdditional Context:`;
      for (const [key, value] of Object.entries(context)) {
        const truncatedValue = this.truncateForDisplay(String(value), 100);
        message += `\n${key}: ${truncatedValue}`;
      }
    }

    if (suggestions && suggestions.length > 0) {
      message += `\n\nUser Suggestions:`;
      suggestions.slice(0, 5).forEach((suggestion, i) => {
        message += `\n${i + 1}. ${suggestion}`;
      });
    }

    if (maxLength) {
      message += `\n\nLength Limit: ${maxLength} characters maximum`;
    }

    message += `\n\nPlease ${currentValue ? 'improve the current value' : 'generate a new value'} for this field based on the instructions.`;

    return message;
  }

  /**
   * Build custom prompt with template variables
   */
  buildCustomPrompt(template: string, variables: Record<string, any>): string {
    let prompt = template;
    
    // Replace template variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{${key}\\}`, 'g');
      prompt = prompt.replace(placeholder, String(value));
    }
    
    // Clean up any remaining placeholders
    prompt = prompt.replace(/\{[^}]*\}/g, '');
    
    return prompt.trim();
  }

  /**
   * Build contextual prompt based on content analysis
   */
  buildContextualPrompt(
    basePrompt: string,
    contentAnalysis: {
      length?: number;
      complexity?: 'simple' | 'moderate' | 'complex';
      tone?: string;
      issues?: string[];
    }
  ): string {
    let prompt = basePrompt;
    
    // Add length-based context
    if (contentAnalysis.length !== undefined) {
      if (contentAnalysis.length < 50) {
        prompt += '\n\nNote: The current content is very brief. Consider expanding with more details and examples.';
      } else if (contentAnalysis.length > 2000) {
        prompt += '\n\nNote: The current content is quite lengthy. Focus on clarity and conciseness.';
      }
    }
    
    // Add complexity-based context
    if (contentAnalysis.complexity) {
      switch (contentAnalysis.complexity) {
        case 'simple':
          prompt += '\n\nContent level: Keep language accessible and easy to understand.';
          break;
        case 'complex':
          prompt += '\n\nContent level: Maintain technical accuracy while ensuring clarity.';
          break;
      }
    }
    
    // Add tone guidance
    if (contentAnalysis.tone) {
      prompt += `\n\nTone guidance: Maintain a ${contentAnalysis.tone} tone throughout.`;
    }
    
    // Add issue-specific guidance
    if (contentAnalysis.issues && contentAnalysis.issues.length > 0) {
      prompt += `\n\nAddress these specific issues: ${contentAnalysis.issues.join(', ')}.`;
    }
    
    return prompt;
  }

  /**
   * Build prompt with examples
   */
  buildPromptWithExamples(
    basePrompt: string,
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>
  ): string {
    let prompt = basePrompt;
    
    if (examples.length > 0) {
      prompt += '\n\nHere are some examples of the desired format:\n';
      
      examples.forEach((example, index) => {
        prompt += `\nExample ${index + 1}:`;
        prompt += `\nInput: ${example.input}`;
        prompt += `\nOutput: ${example.output}`;
        if (example.explanation) {
          prompt += `\nExplanation: ${example.explanation}`;
        }
        prompt += '\n';
      });
      
      prompt += '\nPlease follow a similar approach for the current request.';
    }
    
    return prompt;
  }

  /**
   * Build prompt with constraints
   */
  buildPromptWithConstraints(
    basePrompt: string,
    constraints: {
      maxLength?: number;
      minLength?: number;
      requiredElements?: string[];
      forbiddenElements?: string[];
      tone?: string;
      audience?: string;
    }
  ): string {
    let prompt = basePrompt;
    
    if (Object.keys(constraints).length === 0) {
      return prompt;
    }
    
    prompt += '\n\nPlease observe these constraints:';
    
    if (constraints.maxLength) {
      prompt += `\n- Maximum length: ${constraints.maxLength} characters`;
    }
    
    if (constraints.minLength) {
      prompt += `\n- Minimum length: ${constraints.minLength} characters`;
    }
    
    if (constraints.requiredElements && constraints.requiredElements.length > 0) {
      prompt += `\n- Must include: ${constraints.requiredElements.join(', ')}`;
    }
    
    if (constraints.forbiddenElements && constraints.forbiddenElements.length > 0) {
      prompt += `\n- Must not include: ${constraints.forbiddenElements.join(', ')}`;
    }
    
    if (constraints.tone) {
      prompt += `\n- Tone: ${constraints.tone}`;
    }
    
    if (constraints.audience) {
      prompt += `\n- Target audience: ${constraints.audience}`;
    }
    
    return prompt;
  }

  /**
   * Analyze content to provide context for prompts
   */
  analyzeContent(content: string): {
    length: number;
    wordCount: number;
    complexity: 'simple' | 'moderate' | 'complex';
    tone: string;
    issues: string[];
    suggestions: string[];
  } {
    const length = content.length;
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Analyze complexity based on various factors
    let complexityScore = 0;
    
    // Sentence length
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    if (avgSentenceLength > 20) complexityScore += 1;
    
    // Technical terms (basic heuristic)
    const technicalWords = content.match(/\b\w{10,}\b/g) || [];
    if (technicalWords.length > wordCount * 0.1) complexityScore += 1;
    
    // Complexity determination
    const complexity = complexityScore === 0 ? 'simple' : 
                      complexityScore === 1 ? 'moderate' : 'complex';
    
    // Basic tone analysis
    const tone = this.analyzeTone(content);
    
    // Identify issues
    const issues = this.identifyContentIssues(content);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(content, issues);
    
    return {
      length,
      wordCount,
      complexity,
      tone,
      issues,
      suggestions
    };
  }

  /**
   * Truncate content for display in prompts
   */
  private truncateForDisplay(content: any, maxLength: number): string {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    
    if (text.length <= maxLength) {
      return text;
    }
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0 && lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }

  /**
   * Analyze tone of content
   */
  private analyzeTone(content: string): string {
    const text = content.toLowerCase();
    
    // Simple keyword-based tone detection
    const professionalWords = ['research', 'study', 'analysis', 'professional', 'clinical'];
    const casualWords = ['awesome', 'great', 'love', 'amazing', 'fun'];
    const formalWords = ['therefore', 'furthermore', 'consequently', 'moreover'];
    
    let professionalScore = 0;
    let casualScore = 0;
    let formalScore = 0;
    
    professionalWords.forEach(word => {
      if (text.includes(word)) professionalScore++;
    });
    
    casualWords.forEach(word => {
      if (text.includes(word)) casualScore++;
    });
    
    formalWords.forEach(word => {
      if (text.includes(word)) formalScore++;
    });
    
    if (formalScore > professionalScore && formalScore > casualScore) {
      return 'formal';
    } else if (casualScore > professionalScore) {
      return 'casual';
    } else if (professionalScore > 0) {
      return 'professional';
    }
    
    return 'neutral';
  }

  /**
   * Identify content issues
   */
  private identifyContentIssues(content: string): string[] {
    const issues: string[] = [];
    
    // Check for common issues
    if (content.length < 50) {
      issues.push('Content is very brief');
    }
    
    if (!content.includes('.') && content.length > 100) {
      issues.push('Missing proper sentence structure');
    }
    
    if (content.split('\n').length === 1 && content.length > 200) {
      issues.push('Needs paragraph breaks');
    }
    
    // Check for repeated words
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((counts: Record<string, number>, word) => {
      counts[word] = (counts[word] || 0) + 1;
      return counts;
    }, {});
    
    const repeatedWords = Object.entries(wordCounts)
      .filter(([word, count]) => count > 3 && word.length > 3)
      .map(([word]) => word);
    
    if (repeatedWords.length > 0) {
      issues.push('Contains repetitive language');
    }
    
    return issues;
  }

  /**
   * Generate suggestions based on content analysis
   */
  private generateSuggestions(content: string, issues: string[]): string[] {
    const suggestions: string[] = [];
    
    issues.forEach(issue => {
      switch (issue) {
        case 'Content is very brief':
          suggestions.push('Add more details and examples');
          break;
        case 'Missing proper sentence structure':
          suggestions.push('Improve sentence structure and punctuation');
          break;
        case 'Needs paragraph breaks':
          suggestions.push('Break content into readable paragraphs');
          break;
        case 'Contains repetitive language':
          suggestions.push('Use more varied vocabulary');
          break;
      }
    });
    
    // General suggestions
    if (content.length > 100 && !content.includes('?')) {
      suggestions.push('Consider adding engaging questions');
    }
    
    if (!content.toLowerCase().includes('example') && content.length > 200) {
      suggestions.push('Include specific examples');
    }
    
    return suggestions;
  }

  /**
   * Validate prompt before sending to AI
   */
  validatePrompt(prompt: string): {
    isValid: boolean;
    issues: string[];
    estimatedTokens: number;
  } {
    const issues: string[] = [];
    
    // Check length
    if (prompt.length < 10) {
      issues.push('Prompt is too short');
    }
    
    if (prompt.length > 8000) {
      issues.push('Prompt may be too long and expensive');
    }
    
    // Check for essential elements
    if (!prompt.toLowerCase().includes('instruction')) {
      issues.push('Prompt should include clear instructions');
    }
    
    // Estimate tokens (rough approximation)
    const estimatedTokens = Math.ceil(prompt.length / 4);
    
    return {
      isValid: issues.length === 0,
      issues,
      estimatedTokens
    };
  }
}