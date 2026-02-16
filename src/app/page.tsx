import Hero from "@/components/home/Hero";
import MapSection from "@/components/home/MapSection";
import AccessSection from "@/components/home/AccessSection";
import ProfessionalsSection from "@/components/home/ProfessionalsSection";
import WhyGlamlinkSection from "@/components/home/WhyGlamlinkSection";
import FounderBadge from "@/components/home/FounderBadge";
import DownloadCTA from "@/components/home/DownloadCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <MapSection /> */}
      <AccessSection />
      <ProfessionalsSection />
      <WhyGlamlinkSection />
      <FounderBadge />
      <script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"
></script>

      <DownloadCTA />
    </>
  );
}
