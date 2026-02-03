import { MapPin, User, Star, Clock, Phone } from "lucide-react";

const MapSection = () => {
  // Mock pin locations for the map
  const pins = [
    { id: 1, x: 25, y: 35, count: 12 },
    { id: 2, x: 45, y: 25, count: 8 },
    { id: 3, x: 65, y: 45, count: 15 },
    { id: 4, x: 35, y: 60, count: 6 },
    { id: 5, x: 75, y: 30, count: 9 },
    { id: 6, x: 55, y: 55, count: 11 },
    { id: 7, x: 20, y: 50, count: 4 },
  ];

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container-glamlink">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Map Mockup */}
          <div className="lg:col-span-3 map-mockup h-[400px] lg:h-[500px] relative">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-muted-foreground/30"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Decorative Roads */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 30 Q 30 35 50 25 T 100 30"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M 20 0 Q 25 40 35 50 T 40 100"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M 60 0 Q 65 30 75 45 T 80 100"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M 0 70 Q 40 65 60 75 T 100 70"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>

            {/* Location Pins */}
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-primary transition-transform group-hover:scale-110">
                    <span className="text-primary-foreground text-sm font-bold">
                      {pin.count}
                    </span>
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
                </div>
              </div>
            ))}

            {/* Center Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
            </div>

            {/* Map Attribution */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 inline mr-1" />
              Showing 65 professionals nearby
            </div>
          </div>

          {/* Detail Card */}
          <div className="lg:col-span-2">
            <div className="card-glamlink h-full flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Select a Professional
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  Click on a location pin on the map to view professional
                  details, services, and booking options.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-border pt-6 mt-auto">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-warning" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">4.9</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">15m</p>
                    <p className="text-xs text-muted-foreground">
                      Avg Response
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Phone className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">99%</p>
                    <p className="text-xs text-muted-foreground">
                      Booking Rate
                    </p>
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

export default MapSection;
