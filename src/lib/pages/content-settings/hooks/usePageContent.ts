import { useState, useEffect } from 'react';
import pageContentService from '@/lib/services/pageContentService';
import { defaultPageContent } from '@/lib/config/pageContent';
import { EditablePage } from '../types';

export function usePageContent(selectedPage: EditablePage, isAuthenticated: boolean, activeTab: string) {
  const [pageContent, setPageContent] = useState<any>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);

  const loadPageContent = async () => {
    setIsLoadingContent(true);
    try {
      const content = await pageContentService.getPageContent(selectedPage);
      setPageContent(content);
    } catch (error) {
      console.error("Error loading page content:", error);
      setPageContent(defaultPageContent[selectedPage]);
    } finally {
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "content") {
      loadPageContent();
    }
  }, [selectedPage, isAuthenticated, activeTab]);

  const updateContentField = (path: string[], value: any) => {
    const newContent = { ...pageContent };
    let current = newContent;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setPageContent(newContent);
  };

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    try {
      const success = await pageContentService.savePageContent(selectedPage, pageContent);

      if (success) {
        alert("Content saved successfully!");
      } else {
        alert("Failed to save content.");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("An error occurred while saving content.");
    } finally {
      setIsSavingContent(false);
    }
  };

  return {
    pageContent,
    isLoadingContent,
    isSavingContent,
    updateContentField,
    handleSaveContent,
  };
}