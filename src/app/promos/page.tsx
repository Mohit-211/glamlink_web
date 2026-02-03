import Header from "@/components/Header";
import Footer from "@/components/common/Footer";
import PromosHero from "@/components/promos/PromosHero";
import PromosEmptyState from "@/components/promos/PromosEmptyState";

const Promos = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeRoute="promos" />

      <main className="pt-16 lg:pt-20 flex-1 flex flex-col">
        <PromosHero />
        <PromosEmptyState />
      </main>

      <Footer />
    </div>
  );
};

export default Promos;
