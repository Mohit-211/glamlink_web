import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MagazineHero from "@/components/magazine/MagazineHero";
import MagazineIssues from "@/components/magazine/MagazineIssues";

const Magazine = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="magazine" />

      <main className="pt-16 lg:pt-20">
        <MagazineHero />
        <MagazineIssues />
      </main>

      <Footer />
    </div>
  );
};

export default Magazine;
