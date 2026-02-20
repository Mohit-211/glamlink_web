/**
 * Response Parser Service
 * 
 * Handles parsing and validation of AI responses.
 * Extracts structured data from AI-generated content.
 */

import type { FieldType } from '../types';

export interface ParsedMultiFieldResponse {
  userResponse: string;
  fieldUpdates: Record<string, any>;
}

export interface ParsedContentBlockResponse {
  content: string;
  explanation: string;
}

export interface ParsedSingleFieldResponse {
  value: string;
  explanation: string;
}

export class ResponseParser {
  /**
   * Parse multi-field AI response
   */
  parseMultiFieldResponse(response: string, selectedFields: string[]): ParsedMultiFieldResponse {
    // Split response into explanation and field updates
    const parts = response.split('FIELD_UPDATES:');
    const userResponse = parts[0]?.trim() || 'Content updated successfully.';
    
    let fieldUpdates: Record<string, any> = {};
    
    if (parts[1]) {
      try {
        // Extract JSON from the response
        const jsonMatch = parts[1].match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedUpdates = JSON.parse(jsonMatch[0]);
          
          // Only include requested fields
          for (const field of selectedFields) {
            if (parsedUpdates[field] !== undefined) {
              fieldUpdates[field] = this.cleanFieldValue(parsedUpdates[field]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse field updates JSON:', error);
        // Fallback: try to extract individual field updates
        fieldUpdates = this.extractFieldUpdatesFallback(parts[1], selectedFields);
      }
    }
    
    return {
      userResponse,
      fieldUpdates
    };
  }

  /**
   * Parse content block AI response
   */
  parseContentBlockResponse(response: string, maxLength?: number): ParsedContentBlockResponse {
    // Split response into explanation and generated content
    const parts = response.split('GENERATED_CONTENT:');
    const explanation = parts[0]?.trim() || 'Content generated successfully.';
    
    let content = '';
    
    if (parts[1]) {
      content = parts[1].trim();
      
      // Apply length limit if specified
      if (maxLength && content.length > maxLength) {
        content = this.truncateContentSafely(content, maxLength);
      }
    } else {
      // Fallback: use entire response as content if no delimiter found
      content = response;
      if (maxLength && content.length > maxLength) {
        content = this.truncateContentSafely(content, maxLength);
      }
    }
    
    content = this.cleanHtmlContent(content);
    
    return {
      content,
      explanation
    };
  }

  /**
   * Parse single field AI response
   */
  parseSingleFieldResponse(response: string, fieldType: FieldType, maxLength?: number): ParsedSingleFieldResponse {
    // Split response into explanation and field value
    const parts = response.split('FIELD_VALUE:');
    const explanation = parts[0]?.trim() || 'Field updated successfully.';
    
    let value = '';
    
    if (parts[1]) {
      value = parts[1].trim();
      
      // Clean up based on field type
      value = this.cleanFieldValueByType(value, fieldType);
      
      // Apply length limit if specified
      if (maxLength && value.length > maxLength) {
        value = this.truncateFieldValue(value, fieldType, maxLength);
      }
    } else {
      // Fallback: use entire response as value if no delimiter found
      value = this.cleanFieldValueByType(response, fieldType);
      if (maxLength && value.length > maxLength) {
        value = this.truncateFieldValue(value, fieldType, maxLength);
      }
    }
    
    return { value, explanation };
  }

  /**
   * Parse alternatives from AI response
   */
  parseAlternatives(response: string, expectedCount: number): string[] {
    const alternatives: string[] = [];
    
    // Try to find numbered alternatives
    const numberedMatches = response.match(/\d+\.\s*([^\n]+)/g);
    if (numberedMatches) {
      numberedMatches.slice(0, expectedCount).forEach(match => {
        const alternative = match.replace(/^\d+\.\s*/, '').trim();
        if (alternative) {
          alternatives.push(alternative);
        }
      });
    }
    
    // If no numbered alternatives, try to split by common delimiters
    if (alternatives.length === 0) {
      const parts = response.split(/\n\n|\|\||\-\-\-/);
      parts.slice(0, expectedCount).forEach(part => {
        const cleaned = part.trim();
        if (cleaned && cleaned.length > 0) {
          alternatives.push(cleaned);
        }
      });
    }
    
    return alternatives;
  }

  /**
   * Validate parsed response
   */
  validateResponse(response: any, expectedType: 'multiField' | 'contentBlock' | 'singleField'): {
    isValid: boolean;
    issues: string[];
    sanitizedResponse?: any;
  } {
    const issues: string[] = [];
    let sanitizedResponse = response;
    
    switch (expectedType) {
      case 'multiField':
        if (!response.fieldUpdates || typeof response.fieldUpdates !== 'object') {
          issues.push('Missing or invalid field updates');
        } else {
          // Sanitize field updates
          const sanitizedUpdates: Record<string, any> = {};
          for (const [key, value] of Object.entries(response.fieldUpdates)) {
            if (typeof key === 'string' && key.length > 0) {
              sanitizedUpdates[key] = this.sanitizeValue(value);
            }
          }
          sanitizedResponse = {
            ...response,
            fieldUpdates: sanitizedUpdates
          };
        }
        break;
        
      case 'contentBlock':
        if (!response.content || typeof response.content !== 'string') {
          issues.push('Missing or invalid content');
        } else {
          sanitizedResponse = {
            ...response,
            content: this.sanitizeValue(response.content)
          };
        }
        break;
        
      case 'singleField':
        if (response.value === undefined || response.value === null) {
          issues.push('Missing field value');
        } else {
          sanitizedResponse = {
            ...response,
            value: this.sanitizeValue(response.value)
          };
        }
        break;
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      sanitizedResponse: issues.length === 0 ? sanitizedResponse : undefined
    };
  }

  /**
   * Extract field updates using fallback method
   */
  private extractFieldUpdatesFallback(text: string, selectedFields: string[]): Record<string, any> {
    const updates: Record<string, any> = {};
    
    for (const field of selectedFields) {
      // Look for patterns like: "fieldName": "value"
      const patterns = [
        new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, 'i'),
        new RegExp(`${field}:\\s*(.+)`, 'i'),
        new RegExp(`${field}\\s*=\\s*(.+)`, 'i')
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          updates[field] = this.cleanFieldValue(match[1]);
          break;
        }
      }
    }
    
    return updates;
  }

  /**
   * Clean field value generically
   */
  private cleanFieldValue(value: any): any {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }

  /**
   * Clean field value based on specific type
   */
  private cleanFieldValueByType(value: string, fieldType: FieldType): string {
    switch (fieldType) {
      case 'email':
        // Extract email if wrapped in text
        const emailMatch = value.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
        return emailMatch ? emailMatch[0] : value.trim();
      
      case 'url':
        // Extract URL if wrapped in text
        const urlMatch = value.match(/https?:\/\/[^\s]+/);
        return urlMatch ? urlMatch[0] : value.trim();
      
      case 'text':
        // Remove line breaks for single-line text
        return value.replace(/\n/g, ' ').trim();
        
      case 'number':
        // Extract numeric value
        const numberMatch = value.match(/[\d,.]+/);
        return numberMatch ? numberMatch[0] : value.trim();
        
      case 'html':
        return this.cleanHtmlContent(value);
      
      default:
        return value.trim();
    }
  }

  /**
   * Clean HTML content
   */
  private cleanHtmlContent(html: string): string {
    if (!html) return '';
    
    // Remove dangerous elements
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    cleaned = cleaned.replace(/javascript:/gi, '');
    cleaned = cleaned.replace(/on\w+\s*=/gi, '');
    
    // Fix common formatting issues
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    return cleaned.trim();
  }

  /**
   * Sanitize any value for security
   */
  private sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      // Remove potentially dangerous content
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeValue(item));
    }
    
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitizeValue(val);
      }
      return sanitized;
    }
    
    return value;
  }

  /**
   * Truncate content safely at word boundaries
   */
  private truncateContentSafely(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    
    const truncated = content.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    // If we can find a word boundary, use it
    if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  }

  /**
   * Truncate field value appropriately for field type
   */
  private truncateFieldValue(value: string, fieldType: FieldType, maxLength: number): string {
    if (value.length <= maxLength) return value;
    
    switch (fieldType) {
      case 'text':
        // Truncate at word boundary
        const truncated = value.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
      
      case 'html':
        // Try to maintain valid HTML structure
        return value.substring(0, maxLength) + (value.includes('<') ? '...' : '');
      
      default:
        return value.substring(0, maxLength);
    }
  }

  /**
   * Extract structured data from free-form AI response
   */
  extractStructuredData(response: string, expectedFields: string[]): Record<string, any> {
    const data: Record<string, any> = {};
    
    for (const field of expectedFields) {
      // Try different extraction patterns
      const patterns = [
        // JSON-like: "field": "value"
        new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, 'i'),
        // Key-value: field: value
        new RegExp(`${field}\\s*:\\s*(.+?)(?=\\n|$)`, 'i'),
        // Markdown-like: **Field**: value
        new RegExp(`\\*\\*${field}\\*\\*\\s*:\\s*(.+?)(?=\\n|$)`, 'i'),
        // Label format: Field: value
        new RegExp(`${field}\\s*:\\s*(.+?)(?=\\n\\n|$)`, 'i')
      ];
      
      for (const pattern of patterns) {
        const match = response.match(pattern);
        if (match && match[1]) {
          data[field] = match[1].trim();
          break;
        }
      }
    }
    
    return data;
  }

  /**
   * Detect and extract code blocks from response
   */
  extractCodeBlocks(response: string): Array<{
    language?: string;
    code: string;
  }> {
    const codeBlocks: Array<{ language?: string; code: string }> = [];
    
    // Match fenced code blocks
    const fencedMatches = response.matchAll(/```(\w+)?\n?([\s\S]*?)```/g);
    for (const match of fencedMatches) {
      codeBlocks.push({
        language: match[1] || undefined,
        code: match[2].trim()
      });
    }
    
    // Match inline code
    const inlineMatches = response.matchAll(/`([^`]+)`/g);
    for (const match of inlineMatches) {
      if (match[1].length > 10) { // Only consider longer inline code as blocks
        codeBlocks.push({
          code: match[1].trim()
        });
      }
    }
    
    return codeBlocks;
  }

  /**
   * Extract lists from response
   */
  extractLists(response: string): Array<{
    type: 'ordered' | 'unordered';
    items: string[];
  }> {
    const lists: Array<{ type: 'ordered' | 'unordered'; items: string[] }> = [];
    
    // Extract numbered lists
    const numberedItems = response.match(/^\d+\.\s+.+$/gm);
    if (numberedItems && numberedItems.length > 1) {
      lists.push({
        type: 'ordered',
        items: numberedItems.map(item => item.replace(/^\d+\.\s+/, '').trim())
      });
    }
    
    // Extract bulleted lists
    const bulletedItems = response.match(/^[\-\*]\s+.+$/gm);
    if (bulletedItems && bulletedItems.length > 1) {
      lists.push({
        type: 'unordered',
        items: bulletedItems.map(item => item.replace(/^[\-\*]\s+/, '').trim())
      });
    }
    
    return lists;
  }

  /**
   * Calculate response quality score
   */
  calculateQualityScore(response: string, expectedLength?: number): number {
    let score = 0;
    const maxScore = 100;
    
    // Length appropriateness (20 points)
    if (expectedLength) {
      const lengthRatio = response.length / expectedLength;
      if (lengthRatio >= 0.8 && lengthRatio <= 1.2) {
        score += 20;
      } else if (lengthRatio >= 0.6 && lengthRatio <= 1.5) {
        score += 15;
      } else if (lengthRatio >= 0.4 && lengthRatio <= 2.0) {
        score += 10;
      }
    } else {
      // Default length scoring
      if (response.length > 50 && response.length < 2000) {
        score += 20;
      } else if (response.length > 20) {
        score += 10;
      }
    }
    
    // Structure and formatting (30 points)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 1) score += 10; // Multiple sentences
    
    if (response.includes('\n')) score += 10; // Paragraph breaks
    
    const words = response.trim().split(/\s+/);
    if (words.length > 10) score += 10; // Adequate word count
    
    // Content quality indicators (30 points)
    if (response.match(/\b(because|therefore|however|moreover)\b/i)) {
      score += 10; // Logical connectors
    }
    
    if (response.match(/\b(example|instance|such as)\b/i)) {
      score += 10; // Examples provided
    }
    
    if (response.match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
      score += 10; // Proper nouns (specificity)
    }
    
    // Language quality (20 points)
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    if (avgSentenceLength > 8 && avgSentenceLength < 25) {
      score += 10; // Good sentence length
    }
    
    if (!response.match(/\b(very|really|quite|pretty)\s+\w+/gi)) {
      score += 10; // Avoids weak qualifiers
    }
    
    return Math.min(score, maxScore);
  }
}