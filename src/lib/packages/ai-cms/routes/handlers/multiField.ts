/**
 * Multi-Field AI Generation Handler
 * 
 * Handles multi-field AI content generation with refinement mode support.
 * Extracted from /app/api/magazine/editor/ai-multi-field/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import type { 
  GenerateRequest, 
  GenerationResponse, 
  ErrorResponse,
  AIModel 
} from '../../types';

export interface MultiFieldHandlerOptions {
  collection?: string;
  contentType?: string;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Main multi-field generation handler
 */
export async function handleMultiFieldGeneration(
  request: NextRequest,
  options: MultiFieldHandlerOptions = {}
): Promise<NextResponse<GenerationResponse | ErrorResponse>> {
  try {
    // Authentication check
    if (options.requireAuth !== false) {
      const { currentUser } = await getAuthenticatedAppForUser();
      if (!currentUser) {
        return NextResponse.json({ 
          success: false, 
          error: "Authentication required" 
        }, { status: 401 });
      }
    }

    // Parse request body
    const body = await request.json() as GenerateRequest;
    const { 
      contentType, 
      userPrompt, 
      currentData, 
      selectedFields, 
      model = 'gpt-5-mini',
      isRefinement = false,
      refinementContext
    } = body;

    // Validation
    if (!contentType || !userPrompt || !currentData) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: contentType, userPrompt, or currentData"
      }, { status: 400 });
    }

    if (!selectedFields || selectedFields.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No fields selected for generation"
      }, { status: 400 });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    if (!openai.apiKey) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured"
      }, { status: 500 });
    }

    // Build system message based on mode
    const systemMessage = isRefinement 
      ? buildRefinementSystemMessage(contentType, refinementContext)
      : buildInitialSystemMessage(contentType);

    // Build user message with current data and instructions
    const userMessage = buildUserMessage({
      contentType,
      userPrompt,
      currentData,
      selectedFields,
      isRefinement,
      refinementContext
    });

    // Call OpenAI
    console.log('Calling OpenAI with model:', model);
    const completion = await openai.chat.completions.create({
      model: mapModelToOpenAI(model),
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: getMaxTokensForModel(model),
      temperature: 0.7
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({
        success: false,
        error: "No response from AI"
      }, { status: 500 });
    }

    // Parse AI response to extract field updates
    const parsedResponse = parseAIResponse(aiResponse, selectedFields);

    return NextResponse.json({
      success: true,
      userResponse: parsedResponse.userResponse,
      fieldUpdates: parsedResponse.fieldUpdates,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: model,
      isRefinement: isRefinement
    } as GenerationResponse);

  } catch (error) {
    console.error('Multi-field generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    } as ErrorResponse, { status: 500 });
  }
}

/**
 * Build system message for initial generation
 */
function buildInitialSystemMessage(contentType: string): string {
  return `You are an AI content editor for a beauty magazine.
You help improve and modify content for magazine issues and other beauty-related content.

CONTENT TYPE: ${contentType}

INITIAL GENERATION INSTRUCTIONS:
1. You will receive current field values and user instructions
2. Generate improved versions of ONLY the specified fields
3. Keep content relevant to beauty, skincare, and wellness
4. Maintain professional tone while being engaging
5. Preserve any existing formatting where appropriate
6. For HTML content, maintain valid HTML structure

RESPONSE FORMAT:
Please respond with:
1. A brief explanation of what you changed and why
2. Then provide the updated field values in this exact format:

FIELD_UPDATES:
{
  "fieldName": "new value",
  "anotherField": "another new value"
}

IMPORTANT: Only include fields that were requested to be updated.`;
}

/**
 * Build system message for refinement mode
 */
function buildRefinementSystemMessage(contentType: string, refinementContext?: any): string {
  const iterationInfo = refinementContext?.currentIteration 
    ? `This is refinement iteration ${refinementContext.currentIteration}.`
    : 'This is a refinement request.';

  return `You are an AI content editor doing iterative refinement.
${iterationInfo}

CONTENT TYPE: ${contentType}

REFINEMENT MODE INSTRUCTIONS:
1. You are refining content that was previously generated
2. Focus on the specific user feedback and requests
3. Make targeted improvements while preserving what works
4. Be more conservative with changes unless specifically requested
5. Consider the context of previous refinements if provided

RESPONSE FORMAT:
Please respond with:
1. A brief explanation of the refinements made
2. Then provide the updated field values in this exact format:

FIELD_UPDATES:
{
  "fieldName": "refined value",
  "anotherField": "another refined value"
}

IMPORTANT: Only include fields that were requested to be refined.`;
}

/**
 * Build user message with context and instructions
 */
function buildUserMessage({
  contentType,
  userPrompt,
  currentData,
  selectedFields,
  isRefinement,
  refinementContext
}: {
  contentType: string;
  userPrompt: string;
  currentData: any;
  selectedFields: string[];
  isRefinement: boolean;
  refinementContext?: any;
}): string {
  let message = `Content Type: ${contentType}\n\n`;
  
  message += `User Instructions: ${userPrompt}\n\n`;
  
  message += `Fields to ${isRefinement ? 'refine' : 'update'}: ${selectedFields.join(', ')}\n\n`;
  
  message += `Current field values:\n`;
  for (const field of selectedFields) {
    const value = currentData[field] || '';
    message += `${field}: ${value}\n`;
  }
  
  if (isRefinement && refinementContext) {
    message += `\nRefinement Context:\n`;
    if (refinementContext.previousPrompts) {
      message += `Previous prompts: ${refinementContext.previousPrompts.join(', ')}\n`;
    }
    if (refinementContext.currentIteration) {
      message += `Current iteration: ${refinementContext.currentIteration}\n`;
    }
  }
  
  message += `\nPlease ${isRefinement ? 'refine' : 'update'} the specified fields based on the instructions.`;
  
  return message;
}

/**
 * Parse AI response to extract field updates
 */
function parseAIResponse(response: string, selectedFields: string[]): {
  userResponse: string;
  fieldUpdates: Record<string, any>;
} {
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
            fieldUpdates[field] = parsedUpdates[field];
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse field updates:', error);
      // Fallback: try to extract individual field updates
      fieldUpdates = extractFieldUpdatesFallback(parts[1], selectedFields);
    }
  }
  
  return {
    userResponse,
    fieldUpdates
  };
}

/**
 * Fallback method to extract field updates if JSON parsing fails
 */
function extractFieldUpdatesFallback(text: string, selectedFields: string[]): Record<string, any> {
  const updates: Record<string, any> = {};
  
  for (const field of selectedFields) {
    // Look for patterns like: "fieldName": "value"
    const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, 'i');
    const match = text.match(regex);
    if (match) {
      updates[field] = match[1];
    }
  }
  
  return updates;
}

/**
 * Map internal model names to OpenAI model names
 */
function mapModelToOpenAI(model: AIModel): string {
  const modelMap: Record<AIModel, string> = {
    'gpt-5': 'gpt-4-1106-preview', // Use latest GPT-4 as GPT-5 placeholder
    'gpt-5-mini': 'gpt-4',
    'gpt-5-nano': 'gpt-3.5-turbo'
  };
  
  return modelMap[model] || 'gpt-4';
}

/**
 * Get max tokens based on model
 */
function getMaxTokensForModel(model: AIModel): number {
  const tokenLimits: Record<AIModel, number> = {
    'gpt-5': 4096,
    'gpt-5-mini': 2048,
    'gpt-5-nano': 1024
  };
  
  return tokenLimits[model] || 2048;
}