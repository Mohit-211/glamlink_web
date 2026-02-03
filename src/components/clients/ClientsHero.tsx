import { Sparkles } from 'lucide-react';

const ClientsHero = () => {
  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-glamlink">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft border border-primary/20 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">For Beauty Lovers</span>
          </div>

          {/* Headline */}
          <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Redefining How The World{' '}
            <span className="gradient-text">Discovers Beauty</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Glamlink connects you with trusted beauty professionals, real transformations, 
            and expert-approved products you actually need—all in one beautifully designed platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClientsHero;
