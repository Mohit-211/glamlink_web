import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import GlamCardHero from "@/components/glamcard/GlamCardHero";
import GlamCardForm from "@/components/glamcard/GlamCardForm";
import GlamCardCTA from "@/components/glamcard/GlamCardCTA";

const GlamCard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-20">
        <GlamCardHero />
        <GlamCardForm />
        <GlamCardCTA />
      </main>

      <Footer />
    </div>
  );
};

export default GlamCard;
