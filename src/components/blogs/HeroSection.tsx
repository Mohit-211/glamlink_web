const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <p className="caption-text text-primary mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            The Glamlink Journal
          </p>
          
          <h1 className="editorial-headline text-4xl md:text-5xl lg:text-6xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Inside Beauty, Business,{' '}
            <span className="editorial-subhead">and Influence</span>
          </h1>
          
          <div className="divider-accent mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }} />
          
          <p className="text-lg md:text-xl text-body max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Stories from the forefront of the beauty industry—featuring professionals, 
            emerging trends, marketing insights, and the creators shaping the future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
