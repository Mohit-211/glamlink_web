import { Gift, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromosEmptyState = () => {
  return (
    <section className="flex-1 flex items-center justify-center py-16 lg:py-24 bg-secondary/20">
      <div className="container-glamlink">
        <div className="max-w-lg mx-auto text-center">
          {/* Icon illustration */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Outer ring */}
            <div className="absolute w-32 h-32 rounded-full border-2 border-dashed border-border animate-[spin_20s_linear_infinite]" />
            
            {/* Inner circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Gift className="w-10 h-10 text-primary/60" />
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/30" />
            <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary/20" />
          </div>

          {/* Message */}
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-3">
            No Active Promotions
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Check back soon for exciting offers and exclusive deals from your favorite 
            beauty brands and professionals. Great things are coming.
          </p>

          {/* Notify CTA */}
          <Button variant="outline" className="rounded-full px-6 py-5 gap-2 border-2 hover:border-primary hover:text-primary">
            <Bell className="w-4 h-4" />
            Notify Me When Promos Drop
          </Button>

          {/* Trust line */}
          <p className="text-sm text-muted-foreground mt-6">
            We keep promotions curated, not cluttered.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromosEmptyState;
