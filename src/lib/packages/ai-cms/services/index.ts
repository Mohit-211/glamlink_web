/**
 * Services - Exports
 * 
 * Centralized exports for all service classes in the ai-cms package.
 * Services handle core business logic and AI operations.
 */

import { AIService, type AIServiceConfig } from './AIService';
import { PromptBuilder } from './PromptBuilder';
import { ResponseParser } from './ResponseParser';

export { AIService, type AIServiceConfig } from './AIService';
export { PromptBuilder } from './PromptBuilder';
export { ResponseParser } from './ResponseParser';

/**
 * Service factory for creating configured service instances
 */
export class ServiceFactory {
  /**
   * Create a configured AI service instance
   */
  static createAIService(config?: {
    apiKey?: string;
    defaultModel?: 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano';
    timeout?: number;
    maxRetries?: number;
  }) {
    return new AIService(config);
  }

  /**
   * Create a prompt builder instance
   */
  static createPromptBuilder() {
    return new PromptBuilder();
  }

  /**
   * Create a response parser instance
   */
  static createResponseParser() {
    return new ResponseParser();
  }

  /**
   * Create a complete service suite
   */
  static createServiceSuite(config?: Parameters<typeof ServiceFactory.createAIService>[0]) {
    return {
      aiService: ServiceFactory.createAIService(config),
      promptBuilder: ServiceFactory.createPromptBuilder(),
      responseParser: ServiceFactory.createResponseParser()
    };
  }
}