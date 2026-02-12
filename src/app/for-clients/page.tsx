import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ClientsHero from "@/components/clients/ClientsHero";
import PhoneMockups from "@/components/clients/PhoneMockups";
import FeaturesGrid from "@/components/clients/FeaturesGrid";
import HowItWorks from "@/components/clients/HowItWorks";
import ClientsCTA from "@/components/clients/ClientsCTA";

const ForClients = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="for-clients" />
      <main>
        <ClientsHero />
        <PhoneMockups />
        <FeaturesGrid />
        <HowItWorks />
        <ClientsCTA />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ForClients;
