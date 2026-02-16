import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProfessionalsMarketplace from "@/components/professionals/ProfessionalsMarketplace";
import PassionToPower from "@/components/professionals/PassionToPower";
import ProfileCards from "@/components/professionals/ProfileCards";
import SalesSection from "@/components/professionals/SalesSection";
import PromoBanner from "@/components/professionals/PromoBanner";
import CapabilitiesGrid from "@/components/professionals/CapabilitiesGrid";
import ProfessionalsCTA from "@/components/professionals/ProfessionalsCTA";

const ForProfessionals = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="for-professionals" />

      <main className="pt-16 lg:pt-20">
        <ProfessionalsMarketplace />
        {/* <PassionToPower /> */}
        <ProfileCards />
        <SalesSection />
        <PromoBanner />
        <CapabilitiesGrid />
        <ProfessionalsCTA />
      </main>

    </div>
  );
};

export default ForProfessionals;
