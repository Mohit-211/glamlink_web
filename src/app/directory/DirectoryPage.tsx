"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  GetBeauticianListApi,
  GetBeauticianListDetailsApi,
  getBusinessProfile,
  GetAllCategoryApi,
  GetProfilesByDirectory,
} from "@/api/Api";

import { Provider } from "@/types/provider";

import AreaSection from "@/components/directoryComponent/AreaSection";
import CTASection from "@/components/directoryComponent/CTASection";
import FeaturedProviders from "@/components/directoryComponent/FeaturedProviders";
import HeroSection from "@/components/directoryComponent/HeroSection";

export default function DirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceParam = searchParams.get("service");

  const [providers, setProviders] = useState<Provider[]>([]);
  const [professionals, setProfessionals] = useState<Provider[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState(serviceParam || "All");

  /* =====================
     INITIAL LOAD
  ====================== */

  useEffect(() => {
    fetchProviders();
    fetchProfessionals();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (serviceParam) {
      setActiveService(serviceParam);
    }
  }, [serviceParam]);

  /* =====================
     FETCH CATEGORIES
  ====================== */

  const fetchCategories = async () => {
    try {
      const res = await GetAllCategoryApi();
      setServices(res?.data?.rows || []);
    } catch (error) {
      console.log("Category API error:", error);
    }
  };

  /* =====================
     FETCH FEATURED PROFESSIONALS
  ====================== */

  const fetchProfessionals = async () => {
    try {
      const res = await getBusinessProfile();
      setProfessionals(res?.data || []);
    } catch (error) {
      console.log("API error:", error);
    }
  };

  /* =====================
     FETCH PROVIDERS
  ====================== */

  const fetchProviders = async () => {
    try {
      const res = await GetBeauticianListApi();
      const providerList = res?.data || [];

      const providersWithDetails = await Promise.all(
        providerList.map(async (provider: Provider) => {
          try {
            if (!provider.place_id) return provider;

            const details = await GetBeauticianListDetailsApi(
              provider.place_id
            );

            return {
              ...provider,
              details: details?.data || details,
            };
          } catch {
            return provider;
          }
        })
      );

      setProviders(providersWithDetails);
    } catch (error) {
      console.log("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     CATEGORY CLICK
  ====================== */

  const handleTabClick = async (service: any) => {
    setActiveService(service.title);

    if (service.title === "All") {
      router.push("/directory");
      fetchProfessionals();
    } else {
      router.push(`/directory?service=${service.title}`);

      try {
        const res = await GetProfilesByDirectory(service.id);
        setProfessionals(res?.data || []);
      } catch (error) {
        console.log("Directory API error:", error);
      }
    }
  };

  /* =====================
     LOADING UI
  ====================== */

  if (loading) {
    return (
      <div className="container-glamlink section-glamlink">
        <div className="animate-pulse space-y-16">
          {/* Tabs Skeleton */}
          <div className="flex justify-center gap-3 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-28 rounded-full bg-muted" />
            ))}
          </div>

          {/* Hero Skeleton */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="h-10 w-64 bg-muted rounded" />
              <div className="h-6 w-80 bg-muted rounded" />
              <div className="h-10 w-40 bg-muted rounded-full" />
            </div>

            <div className="h-64 rounded-xl bg-muted" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =====================
     FIND ACTIVE CATEGORY
  ====================== */

  const activeCategory = services.find(
    (item: any) => item.title === activeService
  );

  return (
    <div className="page-soft">
      <div className="container-glamlink section-glamlink">
        {/* SERVICE TABS */}

        <div className="flex flex-wrap gap-3 mb-14 mt-4 justify-center">
          <button
            onClick={() => handleTabClick({ title: "All" })}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border
            ${
              activeService === "All"
                ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
            }`}
          >
            All
          </button>

          {services.map((service: any) => (
            <button
              key={service.id}
              onClick={() => handleTabClick(service)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border
              ${
                activeService === service.title
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        {/* HERO */}

        <HeroSection
          service={activeService}
          description={activeCategory?.description || ""}
        />

        {/* FEATURED PROVIDERS */}

        <div className="mt-24">
          <FeaturedProviders data={professionals} />
        </div>

        {/* AREA TITLE */}

        <div className="mt-28">
          <h2 className="section-title">Las Vegas Providers</h2>
        </div>

        {/* PROVIDERS */}

        <div className="mt-12">
          <AreaSection title="Southwest" data={providers} />
        </div>

        {/* CTA */}

        <div className="mt-28">
          <CTASection />
        </div>
      </div>
    </div>
  );
}
