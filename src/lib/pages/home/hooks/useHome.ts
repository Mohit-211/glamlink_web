"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchHomeData,
  clearError,
  updateHeroData,
  updateFeaturedProjects,
} from "../store/homeSlice";
import { HomeStateInterface } from "../config";

export function useHome() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Select home state from Redux store
  const homeState = useAppSelector((state) => state.home);
  
  // Fetch home data on mount
  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);
  
  // Handlers
  const handleCtaClick = useCallback(() => {
    router.push(homeState.heroData.ctaLink);
  }, [router, homeState.heroData.ctaLink]);
  
  const handleProjectClick = useCallback((projectId: string) => {
    router.push(`/projects/${projectId}`);
  }, [router]);
  
  const handleViewAllProjectsClick = useCallback(() => {
    router.push("/projects");
  }, [router]);
  
  const handleServiceClick = useCallback((serviceId: string) => {
    router.push(`/services/${serviceId}`);
  }, [router]);
  
  const handleScheduleClick = useCallback(() => {
    router.push("/contact");
  }, [router]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  const handleRefreshData = useCallback(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);
  
  // Business logic functions
  const updateHero = useCallback((heroData: typeof homeState.heroData) => {
    dispatch(updateHeroData(heroData));
  }, [dispatch]);
  
  const updateProjects = useCallback((projects: typeof homeState.featuredProjects) => {
    dispatch(updateFeaturedProjects(projects));
  }, [dispatch]);
  
  return {
    // State
    state: homeState,
    
    // Redux actions
    actions: {
      fetchHomeData: () => dispatch(fetchHomeData()),
      clearError: handleClearError,
      updateHero,
      updateProjects,
    },
    
    // UI handlers
    handlers: {
      onCtaClick: handleCtaClick,
      onProjectClick: handleProjectClick,
      onViewAllClick: handleViewAllProjectsClick,
      onServiceClick: handleServiceClick,
      onScheduleClick: handleScheduleClick,
      onRefreshData: handleRefreshData,
    },
  };
}