/**
 * AI Service
 * 
 * Main service class for AI content generation operations.
 * Handles OpenAI interactions, prompt building, and response parsing.
 */

import OpenAI from 'openai';
import type { 
  AIModel, 
  GenerateRequest, 
  GenerateResponse, 
  ContentBlockRequest, 
  ContentBlockResponse,
  SingleFieldRequest,
  SingleFieldResponse,
  ErrorResponse 
} from '../types';
import { getMultiFieldSystemPrompt } from '../routes/prompts/system/multiField';
import { getContentBlockSystemPrompt } from '../routes/prompts/system/contentBlock';
import { getSingleFieldSystemPrompt } from '../routes/prompts/system/singleField';
import { PromptBuilder } from './PromptBuilder';
import { ResponseParser } from './ResponseParser';

export interface AIServiceConfig {
  apiKey?: string;
  defaultModel?: AIModel;
  timeout?: number;
  maxRetries?: number;
}

export class AIService {
  private openai: OpenAI;
  private promptBuilder: PromptBuilder;
  private responseParser: ResponseParser;
  private config: Required<AIServiceConfig>;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.OPENAI_API_KEY || '',
      defaultModel: config.defaultModel || 'gpt-5-mini',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3
    };

    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout
    });

    this.promptBuilder = new PromptBuilder();
    this.responseParser = new ResponseParser();
  }

  /**
   * Generate content for multiple fields
   */
  async generateMultiField(params: GenerateRequest): Promise<GenerateResponse> {
    const startTime = Date.now();
    try {
      const {
        contentType,
        userPrompt,
        currentData,
        selectedFields,
        model = this.config.defaultModel,
        isRefinement = false,
        refinementContext
      } = params;

      // Build system prompt
      const systemPrompt = getMultiFieldSystemPrompt(
        contentType,
        isRefinement,
        refinementContext?.currentIteration
      );

      // Build user message
      const userMessage = this.promptBuilder.buildMultiFieldPrompt({
        contentType,
        userPrompt,
        currentData,
        selectedFields,
        isRefinement,
        refinementContext
      });

      // Call OpenAI
      const completion = await this.callOpenAI({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        maxTokens: this.getMaxTokensForModel(model),
        temperature: 0.7
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse response
      const parsedResponse = this.responseParser.parseMultiFieldResponse(
        aiResponse,
        Object.keys(selectedFields || {})
      );

      return {
        success: true,
        content: parsedResponse.fieldUpdates || {},
        fieldUpdates: parsedResponse.fieldUpdates,
        tokensUsed: completion.usage?.total_tokens || 0,
        metadata: {
          tokensUsed: completion.usage?.total_tokens || 0,
          model,
          processingTime: Date.now() - startTime,
          iterations: isRefinement ? 2 : 1
        }
      };

    } catch (error) {
      console.error('Multi-field generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
        tokensUsed: 0,
        metadata: {
          tokensUsed: 0,
          model: params.model || this.config.defaultModel,
          processingTime: Date.now() - startTime,
          iterations: 0
        }
      };
    }
  }

  /**
   * Generate content block
   */
  async generateContentBlock(params: ContentBlockRequest): Promise<ContentBlockResponse> {
    try {
      const {
        contentType,
        userPrompt,
        currentContent,
        contentField,
        model = this.config.defaultModel,
        maxLength,
        preserveFormatting = true,
        includeMarkdown = false
      } = params;

      // Build system prompt
      const systemPrompt = getContentBlockSystemPrompt(contentType, {
        includeHtml: preserveFormatting,
        maxLength,
        isLongForm: (currentContent?.length || 0) > 1000
      });

      // Build user message
      const userMessage = this.promptBuilder.buildContentBlockPrompt({
        contentType,
        contentField: contentField || 'content',
        userPrompt,
        currentContent: currentContent || '',
        maxLength
      });

      // Call OpenAI
      const completion = await this.callOpenAI({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        maxTokens: this.getMaxTokensForModel(model),
        temperature: 0.8,
        topP: 0.9,
        presencePenalty: 0.1,
        frequencyPenalty: 0.1
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse response
      const parsedResponse = this.responseParser.parseContentBlockResponse(
        aiResponse,
        maxLength
      );

      return {
        success: true,
        userResponse: parsedResponse.content,
        blockUpdates: { [contentField || 'content']: parsedResponse.content },
        tokensUsed: completion.usage?.total_tokens || 0,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Content block generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
        userResponse: '',
        blockUpdates: {},
        tokensUsed: 0,
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate single field content
   */
  async generateSingleField(params: SingleFieldRequest): Promise<SingleFieldResponse> {
    try {
      const {
        contentType,
        fieldName,
        fieldType = 'text',
        userPrompt,
        currentValue,
        context,
        model = 'gpt-5-nano', // Use fastest model for single fields
        maxLength,
        suggestions = []
      } = params;

      // Build system prompt
      const systemPrompt = getSingleFieldSystemPrompt(
        fieldType,
        fieldName,
        contentType,
        {
          maxLength,
          isBeautyField: contentType.includes('beauty') || contentType.includes('skincare'),
          includeExamples: suggestions.length > 0
        }
      );

      // Build user message
      const userMessage = this.promptBuilder.buildSingleFieldPrompt({
        contentType,
        fieldName,
        fieldType,
        userPrompt,
        currentValue: currentValue || '',
        context,
        suggestions,
        maxLength
      });

      // Call OpenAI
      const completion = await this.callOpenAI({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        maxTokens: this.getMaxTokensForField(fieldType, model),
        temperature: this.getTemperatureForFieldType(fieldType),
        topP: 0.95
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse response
      const parsedResponse = this.responseParser.parseSingleFieldResponse(
        aiResponse,
        fieldType,
        maxLength
      );

      // Generate alternatives if requested
      const alternatives = suggestions.length > 0 
        ? await this.generateAlternatives(systemPrompt, userMessage, model, 2)
        : [];

      return {
        success: true,
        fieldValue: parsedResponse.value,
        alternatives,
        confidence: 0.9,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Single field generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
        fieldValue: '',
        alternatives: [],
        timestamp: new Date()
      };
    }
  }

  /**
   * Refine existing content
   */
  async refineContent(params: GenerateRequest & {
    previousResult?: GenerateResponse;
    refinementPrompt?: string;
    preserveUnchangedFields?: boolean;
  }): Promise<GenerateResponse> {
    const refinementParams: GenerateRequest = {
      ...params,
      isRefinement: true,
      refinementContext: {
        ...params.refinementContext,
        currentIteration: (params.refinementContext?.currentIteration || 0) + 1,
        previousPrompts: [
          ...(params.refinementContext?.previousPrompts || []),
          params.userPrompt
        ]
      }
    };

    if (params.refinementPrompt) {
      refinementParams.userPrompt = params.refinementPrompt;
    }

    return this.generateMultiField(refinementParams);
  }

  /**
   * Call OpenAI with retry logic
   */
  private async callOpenAI(params: {
    model: AIModel;
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    maxTokens: number;
    temperature: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  }): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const openaiModel = this.mapModelToOpenAI(params.model);
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: openaiModel,
          messages: params.messages,
          max_tokens: params.maxTokens,
          temperature: params.temperature,
          top_p: params.topP,
          presence_penalty: params.presencePenalty,
          frequency_penalty: params.frequencyPenalty
        });

        return completion;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`OpenAI attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < this.config.maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('All OpenAI attempts failed');
  }

  /**
   * Generate alternative suggestions
   */
  private async generateAlternatives(
    systemPrompt: string,
    userMessage: string,
    model: AIModel,
    count: number
  ): Promise<string[]> {
    try {
      const alternativePrompt = userMessage + `\n\nPlease provide ${count} alternative versions, each with a different approach.`;
      
      const completion = await this.callOpenAI({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: alternativePrompt }
        ],
        maxTokens: this.getMaxTokensForField('text', model) * count,
        temperature: 0.9
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.responseParser.parseAlternatives(response, count);
    } catch (error) {
      console.error('Failed to generate alternatives:', error);
      return [];
    }
  }

  /**
   * Map internal model names to OpenAI model names
   */
  private mapModelToOpenAI(model: AIModel): string {
    const modelMap: Record<AIModel, string> = {
      'gpt-5': 'gpt-4-1106-preview',
      'gpt-5-mini': 'gpt-4',
      'gpt-5-nano': 'gpt-3.5-turbo'
    };
    
    return modelMap[model] || 'gpt-4';
  }

  /**
   * Get max tokens based on model
   */
  private getMaxTokensForModel(model: AIModel): number {
    const tokenLimits: Record<AIModel, number> = {
      'gpt-5': 4096,
      'gpt-5-mini': 2048,
      'gpt-5-nano': 1024
    };
    
    return tokenLimits[model] || 2048;
  }

  /**
   * Get max tokens for field type and model
   */
  private getMaxTokensForField(fieldType: string, model: AIModel): number {
    const baseTokens = this.getMaxTokensForModel(model);
    
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'url':
        return Math.min(baseTokens, 256);
      case 'textarea':
        return Math.min(baseTokens, 512);
      case 'html':
        return Math.min(baseTokens, 1024);
      default:
        return Math.min(baseTokens, 512);
    }
  }

  /**
   * Get temperature for field type
   */
  private getTemperatureForFieldType(fieldType: string): number {
    switch (fieldType) {
      case 'email':
      case 'url':
        return 0.3;
      case 'text':
        return 0.7;
      case 'textarea':
      case 'html':
        return 0.8;
      default:
        return 0.7;
    }
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Check if OpenAI is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      if (!this.config.apiKey) {
        return false;
      }

      // Simple test call
      await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      });

      return true;
    } catch (error) {
      console.warn('OpenAI not available:', error);
      return false;
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): {
    apiKeyConfigured: boolean;
    defaultModel: AIModel;
    timeout: number;
    maxRetries: number;
  } {
    return {
      apiKeyConfigured: !!this.config.apiKey,
      defaultModel: this.config.defaultModel,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries
    };
  }
}