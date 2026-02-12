const HeroSection = () => {
  return (
    <section className="bg-[hsl(220_20%_96%)] py-28 md:py-36">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Top Label */}
        <p className="caption-text text-[hsl(var(--primary))] mb-8">
          The Glamlink Journal
        </p>

        {/* Main Headline */}
        <h1 className="editorial-headline text-[42px] md:text-[64px] lg:text-[76px] text-[hsl(var(--headline))] mb-10">
          Inside Beauty, Business,{" "}
          <span className="editorial-subhead">and Influence</span>
        </h1>

        {/* Divider */}
        <div className="divider-soft mx-auto mb-10" />

        {/* Description */}
        <p className="text-lg md:text-xl text-[hsl(var(--body))] max-w-3xl mx-auto leading-relaxed">
          Stories from the forefront of the beauty industry—featuring professionals,
          emerging trends, marketing insights, and the creators shaping the future.
        </p>

      </div>
    </section>
  );
};

export default HeroSection;
