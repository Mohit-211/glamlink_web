import PromosHero from "@/components/promos/PromosHero";
import PromosEmptyState from "@/components/promos/PromosEmptyState";

const Promos = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromosHero />
      <PromosEmptyState />
    </div>
  );
};

export default Promos;
