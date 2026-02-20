"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HeroSection from "./HeroSection";
import WhyGlamLink from "./WhyGlamLink";
import BookTrustedPros from "./BookTrustedPros";
import FounderBadge from "./FounderBadge";
import Testimonials from "./Testimonials";
import FinalCTA from "./FinalCTA";
import { HomePageContent } from "@/lib/config/pageContent";
import pageContentService from "@/lib/services/pageContentService";
import { useSearchParamHandlers, SearchParamModals } from "@/lib/utils/searchParamHandlers";

interface HomePageProps {
  initialContent: HomePageContent;
}

export default function HomePage({ initialContent }: HomePageProps) {
  const [content, setContent] = useState<HomePageContent>(initialContent);
  const searchParams = useSearchParams();
  const { clearModalParam } = useSearchParamHandlers(searchParams);
  
  // Modal state management - initialize to false to avoid SSR issues
  const [modalState, setModalState] = useState({
    showUserDialog: false,
    showProDialog: false,
    showCombinedDialog: false
  });

  // Check for modal parameter after component mounts (client-side only)
  useEffect(() => {
    const modalType = searchParams.get('modal');

    if (modalType) {
      setModalState({
        showUserDialog: modalType === 'user',
        showProDialog: modalType === 'pro',
        showCombinedDialog: modalType === 'user-and-pro'
      });
    }
  }, [searchParams]);

  // Listen for content updates (immediate updates from content settings)
  useEffect(() => {
    const handleContentUpdate = async (event: CustomEvent) => {
      if (event.detail.pageId === 'home') {
        // Refresh content when it's updated in the settings
        const newContent = await pageContentService.getPageContent('home');
        setContent(newContent);
      }
    };

    window.addEventListener('glamlink:content-updated' as any, handleContentUpdate);
    return () => {
      window.removeEventListener('glamlink:content-updated' as any, handleContentUpdate);
    };
  }, []);

  // Handler to close dialogs and clear URL parameter
  const handleCloseDialog = () => {
    setModalState({
      showUserDialog: false,
      showProDialog: false,
      showCombinedDialog: false
    });
    clearModalParam();
  };

  return (
    <>
      <div className="min-h-screen">
        <HeroSection content={content.hero} />
        <WhyGlamLink content={content.whyGlamLink} />
        <BookTrustedPros content={content.bookTrustedPros} />
        <FounderBadge content={content.founderBadge} />
        <Testimonials content={content.testimonials} />
        <FinalCTA content={content.finalCTA} />
      </div>
      
      <SearchParamModals modalState={modalState} onClose={handleCloseDialog} />
    </>
  );
}
