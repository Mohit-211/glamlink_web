"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  GetBeauticianListApi,
  GetBeauticianListDetailsApi,
  getBusinessProfile,
  GetAllCategoryApi,
  GetProfilesByDirectory
} from "@/api/Api"

import { Provider } from "@/types/provider"

import AreaSection from "@/components/directoryComponnet/AreaSection"
import CTASection from "@/components/directoryComponnet/CTASection"
import FeaturedProviders from "@/components/directoryComponnet/FeaturedProviders"
import HeroSection from "@/components/directoryComponnet/HeroSection"

export default function DirectoryPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceParam = searchParams.get("service")

  const [providers, setProviders] = useState<Provider[]>([])
  const [professionals, setProfessionals] = useState<Provider[]>([])
  const [services, setServices] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [activeService, setActiveService] = useState(serviceParam || "All")

  /* =====================
     INITIAL LOAD
  ====================== */

  useEffect(() => {
    fetchProviders()
    fetchProfessionals()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (serviceParam) {
      setActiveService(serviceParam)
    }
  }, [serviceParam])

  /* =====================
     FETCH CATEGORIES
  ====================== */

  const fetchCategories = async () => {
    try {

      const res = await GetAllCategoryApi()
      setServices(res?.data?.rows || [])

    } catch (error) {

      console.log("Category API error:", error)

    }
  }

  /* =====================
     FETCH FEATURED PROFESSIONALS
  ====================== */

  const fetchProfessionals = async () => {

    try {

      const res = await getBusinessProfile()
      setProfessionals(res?.data || [])

    } catch (error) {

      console.log("API error:", error)

    }

  }

  /* =====================
     FETCH PROVIDERS
  ====================== */

  const fetchProviders = async () => {

    try {

      const res = await GetBeauticianListApi()
      const providerList = res?.data || []

      const providersWithDetails = await Promise.all(
        providerList.map(async (provider: Provider) => {

          try {

            if (!provider.place_id) return provider

            const details = await GetBeauticianListDetailsApi(provider.place_id)

            return {
              ...provider,
              details: details?.data || details
            }

          } catch {

            return provider

          }

        })
      )

      setProviders(providersWithDetails)

    } catch (error) {

      console.log("API error:", error)

    } finally {

      setLoading(false)

    }

  }

  /* =====================
     CATEGORY CLICK
  ====================== */

  const handleTabClick = async (service: any) => {

    setActiveService(service.title)

    if (service.title === "All") {

      router.push("/directory")

      // fetchProviders()

      // FEATURED PROVIDERS RESET
      fetchProfessionals()

    } else {

      router.push(`/directory?service=${service.title}`)

      try {

        const res = await GetProfilesByDirectory(service.id)

        // Only update FeaturedProviders
        setProfessionals(res?.data || [])

        // Providers logic unchanged
        // setProviders(res?.data)

      } catch (error) {

        console.log("Directory API error:", error)

      }

    }

  }

  if (loading) {
    return <p className="p-10">Loading...</p>
  }

  /* =====================
     FIND ACTIVE CATEGORY
  ====================== */

  const activeCategory = services.find(
    (item: any) => item.title === activeService
  )

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* SERVICE TABS */}

      <div className="flex flex-wrap gap-3 mb-10 mt-20 justify-center">

        <button
          onClick={() => handleTabClick({ title: "All" })}
          className={`px-5 py-2 rounded-full text-sm font-medium border
          ${activeService === "All"
              ? "bg-cyan-500 text-white border-cyan-500"
              : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          All
        </button>

        {services.map((service: any) => (

          <button
            key={service.id}
            onClick={() => handleTabClick(service)}
            className={`px-5 py-2 rounded-full text-sm font-medium border
            ${activeService === service.title
                ? "bg-cyan-500 text-white border-cyan-500"
                : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            {service.title}
          </button>

        ))}

      </div>

      {/* HERO SECTION */}

      <HeroSection
        service={activeService}
        description={activeCategory?.description || ""}
      />

      {/* FEATURED */}

      <FeaturedProviders data={professionals} />

      {/* TITLE */}

      <h2 className="text-4xl font-semibold mt-20 mb-10">
        Las Vegas Providers
      </h2>

      {/* PROVIDERS */}

      <AreaSection
        title="Southwest"
        data={providers}
      />

      {/* CTA */}

      <CTASection />

    </div>

  )

}