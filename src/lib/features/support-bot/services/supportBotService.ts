// Support Bot Service - AI Integration
import { askAI } from '@/lib/server/chatgpt';
import type { ChatMessage, FAQ } from '../types';
import { SYSTEM_PROMPT, MEMORY_LIMIT, DEFAULT_FAQS, FALLBACK_RESPONSES } from '../config';

interface GenerateResponseParams {
  userMessage: string;
  chatHistory: ChatMessage[];
  faqs?: FAQ[];
}

/**
 * Generate a response from the AI support bot
 * Handles memory limit by only sending recent messages
 */
export async function generateSupportResponse({
  userMessage,
  chatHistory,
  faqs = [],
}: GenerateResponseParams): Promise<string> {
  try {
    // Build FAQ context string
    const faqsToUse = faqs.length > 0 ? faqs : DEFAULT_FAQS.map((f, i) => ({ ...f, id: `default-${i}` }));
    const faqContext = faqsToUse
      .filter(f => f.isActive)
      .map(f => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');

    // Build system prompt with FAQ context
    const systemPrompt = SYSTEM_PROMPT.replace('{{FAQ_CONTEXT}}', faqContext);

    // Apply memory limit - only include recent messages for context
    const recentHistory = chatHistory.slice(-MEMORY_LIMIT);

    // Build conversation context
    const conversationContext = recentHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Build the full prompt
    const fullPrompt = conversationContext
      ? `Previous conversation:\n${conversationContext}\n\nUser: ${userMessage}`
      : userMessage;

    // Call the AI service
    const response = await askAI({
      prompt: fullPrompt,
      systemPrompt,
      model: 'gpt-4o-mini',
      files: [],
    });

    return response || FALLBACK_RESPONSES.error;
  } catch (error) {
    console.error('Error generating support response:', error);

    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return FALLBACK_RESPONSES.noApiKey;
    }

    return FALLBACK_RESPONSES.error;
  }
}

/**
 * Find relevant FAQs based on keywords in the user message
 */
export function findRelevantFAQs(message: string, faqs: FAQ[]): FAQ[] {
  const lowerMessage = message.toLowerCase();

  return faqs
    .filter(faq => {
      // Check if any keyword matches
      const keywordMatch = faq.keywords.some(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
      );

      // Check if question words match
      const questionWords = faq.question.toLowerCase().split(' ');
      const questionMatch = questionWords.some(word =>
        word.length > 3 && lowerMessage.includes(word)
      );

      return keywordMatch || questionMatch;
    })
    .slice(0, 3); // Return top 3 relevant FAQs
}
