import { useState, useCallback } from 'react';
import { 
  SectionGenerationRequest,
  SectionGenerationResult,
  magazineSectionService
} from '../services/MagazineSectionService';

export interface SectionGenerationProgress {
  sectionId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  currentBlock?: string;
  error?: string;
  result?: any;
}

export interface UseSectionGenerationOptions {
  onProgress?: (progress: Record<string, SectionGenerationProgress>) => void;
  onComplete?: (results: Record<string, any>) => void;
  onError?: (error: string) => void;
  maxParallelRequests?: number;
}

export interface UseSectionGenerationReturn {
  isGenerating: boolean;
  progress: Record<string, SectionGenerationProgress>;
  results: Record<string, any>;
  error: string | null;
  generateSections: (requests: SectionGenerationRequest[]) => Promise<void>;
  clearResults: () => void;
  retryFailed: () => Promise<void>;
}

export function useSectionGeneration(
  options: UseSectionGenerationOptions = {}
): UseSectionGenerationReturn {
  const {
    onProgress,
    onComplete,
    onError,
    maxParallelRequests = 3
  } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<Record<string, SectionGenerationProgress>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [lastRequests, setLastRequests] = useState<SectionGenerationRequest[]>([]);

  const updateProgress = useCallback((
    sectionId: string, 
    update: Partial<SectionGenerationProgress>
  ) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          ...update
        }
      };
      
      // Call progress callback
      if (onProgress) {
        onProgress(newProgress);
      }
      
      return newProgress;
    });
  }, [onProgress]);

  const generateSections = useCallback(async (requests: SectionGenerationRequest[]) => {
    if (requests.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setLastRequests(requests);
    
    // Initialize progress for all sections
    const initialProgress: Record<string, SectionGenerationProgress> = {};
    requests.forEach((request, index) => {
      const sectionId = `section-${index}`;
      initialProgress[sectionId] = {
        sectionId,
        status: 'pending',
        progress: 0
      };
    });
    setProgress(initialProgress);

    try {
      // Process requests in batches
      const batches = [];
      for (let i = 0; i < requests.length; i += maxParallelRequests) {
        batches.push(requests.slice(i, i + maxParallelRequests));
      }

      const allResults: Record<string, any> = {};

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        // Process batch in parallel
        const batchPromises = batch.map(async (request, requestIndex) => {
          const sectionId = `section-${batchIndex * maxParallelRequests + requestIndex}`;
          
          try {
            // Update to processing
            updateProgress(sectionId, {
              status: 'processing',
              progress: 10
            });

            // Make the API call
            const result = await magazineSectionService.generateSectionContent(request);
            
            if (result.success && result.data) {
              // Success
              updateProgress(sectionId, {
                status: 'completed',
                progress: 100,
                result: result.data
              });
              
              allResults[sectionId] = result.data;
            } else {
              // AI generation failed
              updateProgress(sectionId, {
                status: 'error',
                progress: 0,
                error: result.error || 'Generation failed'
              });
            }
          } catch (error) {
            console.error(`Error generating section ${sectionId}:`, error);
            updateProgress(sectionId, {
              status: 'error',
              progress: 0,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        });

        // Wait for batch to complete
        await Promise.all(batchPromises);
      }

      // Update results
      setResults(allResults);
      
      // Call completion callback
      if (onComplete && Object.keys(allResults).length > 0) {
        onComplete(allResults);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [maxParallelRequests, updateProgress, onComplete, onError]);

  const clearResults = useCallback(() => {
    setResults({});
    setProgress({});
    setError(null);
  }, []);

  const retryFailed = useCallback(async () => {
    if (lastRequests.length === 0) return;

    // Get failed sections
    const failedSections = Object.entries(progress)
      .filter(([_, prog]) => prog.status === 'error')
      .map(([sectionId, _]) => {
        const index = parseInt(sectionId.split('-')[1]);
        return lastRequests[index];
      })
      .filter(Boolean);

    if (failedSections.length > 0) {
      await generateSections(failedSections);
    }
  }, [lastRequests, progress, generateSections]);

  return {
    isGenerating,
    progress,
    results,
    error,
    generateSections,
    clearResults,
    retryFailed
  };
}