import Hero from "@/components/home/Hero";
import AccessSection from "@/components/home/AccessSection";
import WhyGlamlinkSection from "@/components/home/WhyGlamlinkSection";
import FounderBadge from "@/components/home/FounderBadge";
import DownloadCTA from "@/components/home/DownloadCTA";
import ProfessionalsMarketplace from "@/components/professionals/ProfessionalsMarketplace";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <MapSection /> */}
      <AccessSection />
       <ProfessionalsMarketplace/>
      <WhyGlamlinkSection />
      <FounderBadge />
      <script
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAd0VnpJBpOS7iISBY2GIVBnEkgpcqXXV0"
></script>

      {/* <DownloadCTA /> */}
    </>
  );
}
