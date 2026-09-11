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
    }
  };

  /* =====================
     CATEGORY CLICK
  ====================== */

  const handleTabClick = async (service: any) => {
    setActiveService(service.title);

    if (service.title === "All") {
      router.push("/journal/directory");
      fetchProfessionals();
    } else {
      router.push(`/journal/directory?service=${service.title}`);

      try {
        const res = await GetProfilesByDirectory(service.id);
        setProfessionals(res?.data || []);
      } catch (error) {
        console.log("Directory API error:", error);
      }
    }
  };

  /* =====================
     FIND ACTIVE CATEGORY
  ====================== */

  const activeCategory = services.find(
    (item: any) => item.title === activeService
  );

  return (
    <div className="page-soft">
  

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

  );
}
