import { Download, Users, Briefcase, Apple, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const DownloadCTA = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-glamlink">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-8 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <pattern
                  id="circles"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="30"
                    cy="30"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circles)" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Download Glamlink for Free
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Join thousands of beauty lovers and professionals transforming
                how beauty services are discovered and booked.
              </p>
            </div>

            {/* Two Paths */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {/* For Clients */}
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-primary-foreground/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-foreground">
                      For Clients
                    </h3>
                    <p className="text-sm text-primary-foreground/70">
                      Discover & book beauty pros
                    </p>
                  </div>
                </div>

                <p className="text-primary-foreground/80 mb-6">
                  Find verified professionals, browse portfolios, read reviews,
                  and book appointments—all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl py-6 gap-2">
                    <Apple className="w-5 h-5" />
                    App Store
                  </Button>
                  <Button className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl py-6 gap-2">
                    <Smartphone className="w-5 h-5" />
                    Google Play
                  </Button>
                </div>
              </div>

              {/* For Professionals */}
              <div className="bg-background rounded-2xl p-6 lg:p-8 shadow-large">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      For Professionals
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Grow your beauty business
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  Get discovered, manage bookings, accept payments, and build
                  your brand with powerful tools made for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 btn-primary rounded-xl py-6 gap-2">
                    <Download className="w-5 h-5" />
                    Join as Professional
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
