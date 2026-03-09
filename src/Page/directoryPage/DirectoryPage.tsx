"use client"
import { useEffect, useState } from "react"
import { GetBeauticianListApi, GetBeauticianListDetailsApi, getBusinessProfile } from "@/api/Api"
import { Provider } from "@/types/provider"
import AreaSection from "@/components/directoryComponnet/AreaSection"
import CTASection from "@/components/directoryComponnet/CTASection"
import FeaturedProviders from "@/components/directoryComponnet/FeaturedProviders"
import HeroSection from "@/components/directoryComponnet/HeroSection"
export default function DirectoryPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [professionals, setProfessionals] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchProviders()
    fetchProfessionals()
  }, [])
  const fetchProfessionals = async () => {
    try {
      // Step 1: Get provider list
      const res = await getBusinessProfile()
      setProfessionals(res?.data)
    } catch (error) {
      console.log("API error:", error)
    } finally {
      setLoading(false)
    }
  }
  const fetchProviders = async () => {
    try {
      // Step 1: Get provider list
      const res = await GetBeauticianListApi()
      const providerList = res?.data || []
      // Step 2: Fetch details for each place_id
      const providersWithDetails = await Promise.all(
        providerList.map(async (provider: Provider) => {
          try {
            if (!provider.place_id) return provider
            const details = await GetBeauticianListDetailsApi(provider.place_id)
            console.log(details, "details")
            return {
              ...provider,
              details: details?.data || details
            }
          } catch (err) {
            console.log("Details fetch error:", err)
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
  if (loading) {
    return <p className="p-10">Loading...</p>
  }
  const featuredProviders = providers.slice(0, 3)
  // const southwestProviders = providers.filter(
  //   (p) => p.geometry?.viewport?.southwest
  // )
  // console.log(southwestProviders, "southwestProviders")
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <HeroSection />
      {/* Featured */}
      <FeaturedProviders data={professionals} />
      <h2 className="text-4xl font-semibold mt-20 mb-10">
        Las Vegas Microneedling Providers
      </h2>
      <AreaSection
        title="Southwest"
        data={providers}
      />
      <CTASection />
    </div>
  )
}