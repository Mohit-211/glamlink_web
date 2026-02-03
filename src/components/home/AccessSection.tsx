import { ArrowRight, Zap, Link2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Link2, text: "One powerful link for everything" },
  { icon: Calendar, text: "Instant booking integration" },
  { icon: Users, text: "Better client discovery" },
  { icon: Zap, text: "Faster conversions" },
];

const AccessSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-glamlink">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Access by Glamlink
            </div>

            <h2 className="section-heading text-3xl lg:text-4xl mb-6">
              Your Digital Business Card,{" "}
              <span className="gradient-text">Supercharged</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              The Access Card is your single, powerful link that manages
              everything—booking, contact info, services, and discovery. Share
              one link and let clients find, connect, and book with fewer steps
              and better conversions.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="feature-icon shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>

            <Button className="btn-hero gap-2">
              Claim Your Free Access Card
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Phone Mockup */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />

              {/* Phone Frame */}
              <div className="relative w-[280px] sm:w-[320px] animate-float">
                <div className="bg-foreground rounded-[3rem] p-3 shadow-large">
                  <div className="bg-background rounded-[2.5rem] overflow-hidden">
                    <div className="aspect-[9/19] relative">
                      {/* Status Bar */}
                      <div className="h-8 bg-secondary flex items-center justify-center">
                        <div className="w-20 h-5 bg-foreground rounded-full" />
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Profile */}
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto mb-3" />
                          <h4 className="font-semibold text-foreground">
                            Sarah Johnson
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Hair Stylist • NYC
                          </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-2">
                          {["Book", "Call", "Message"].map((action) => (
                            <div
                              key={action}
                              className="bg-secondary rounded-xl py-3 text-center"
                            >
                              <span className="text-xs font-medium text-foreground">
                                {action}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Services Preview */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Services
                          </p>
                          {[
                            "Haircut & Style",
                            "Color Treatment",
                            "Highlights",
                          ].map((service) => (
                            <div
                              key={service}
                              className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm text-foreground">
                                {service}
                              </span>
                              <span className="text-xs text-primary font-medium">
                                Book
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center gap-3 pt-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-secondary"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
