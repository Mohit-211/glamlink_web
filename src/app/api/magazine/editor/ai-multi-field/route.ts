import { NextRequest } from 'next/server';
import { handleMultiFieldGeneration } from '@/lib/packages/ai-cms/routes/handlers';

export async function POST(request: NextRequest) {
  // Use the centralized AI-CMS package handler
  return handleMultiFieldGeneration(request, {
    collection: 'magazine_issues',
    contentType: 'magazine'
  });
}