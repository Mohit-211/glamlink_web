import { Download, Search, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PhoneMockups = () => {
  const mockups = [
    {
      title: 'Discover',
      icon: Search,
      screens: [
        { label: 'Explore', active: true },
        { label: 'Nearby', active: false },
        { label: 'Trending', active: false },
      ],
      content: 'professionals',
    },
    {
      title: 'Connect',
      icon: MessageCircle,
      screens: [
        { label: 'Chats', active: true },
        { label: 'Requests', active: false },
      ],
      content: 'messages',
    },
    {
      title: 'Shop',
      icon: ShoppingBag,
      screens: [
        { label: 'For You', active: true },
        { label: 'Favorites', active: false },
      ],
      content: 'products',
    },
  ];

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/30 to-background" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-glamlink">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="section-heading text-3xl lg:text-4xl mb-4">
            Your All-In-One <span className="gradient-text">Beauty Platform</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to look and feel your best, right at your fingertips.
          </p>
        </div>

        {/* Phone Mockups */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-12">
          {mockups.map((mockup, index) => (
            <div
              key={mockup.title}
              className={`relative transition-all duration-500 ${
                index === 1 ? 'lg:scale-110 lg:z-10' : 'lg:scale-95 opacity-90'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Phone Frame */}
              <div className="w-[260px] sm:w-[280px] animate-fade-up">
                <div className="bg-foreground rounded-[2.5rem] p-2.5 shadow-large">
                  <div className="bg-background rounded-[2rem] overflow-hidden">
                    {/* Phone Screen */}
                    <div className="aspect-[9/18] relative">
                      {/* Status Bar */}
                      <div className="h-7 bg-background flex items-center justify-center pt-1">
                        <div className="w-16 h-4 bg-foreground rounded-full" />
                      </div>

                      {/* App Header */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <mockup.icon className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-foreground">{mockup.title}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-secondary" />
                        </div>
                        <div className="flex gap-2">
                          {mockup.screens.map((screen) => (
                            <span
                              key={screen.label}
                              className={`text-xs px-3 py-1 rounded-full ${
                                screen.active
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-muted-foreground'
                              }`}
                            >
                              {screen.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {mockup.content === 'professionals' && (
                          <>
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />
                                <div className="flex-1">
                                  <div className="h-3 w-20 bg-foreground/10 rounded mb-1.5" />
                                  <div className="h-2 w-16 bg-foreground/5 rounded" />
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                  View
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                        {mockup.content === 'messages' && (
                          <>
                            {[1, 2, 3].map((i) => (
                              <div key={i} className={`flex gap-2 ${i % 2 === 0 ? 'justify-end' : ''}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl ${
                                  i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                }`}>
                                  <div className={`h-2 w-20 rounded ${i % 2 === 0 ? 'bg-primary-foreground/30' : 'bg-foreground/10'}`} />
                                  <div className={`h-2 w-12 rounded mt-1 ${i % 2 === 0 ? 'bg-primary-foreground/20' : 'bg-foreground/5'}`} />
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                        {mockup.content === 'products' && (
                          <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="rounded-xl bg-secondary/50 p-2">
                                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 mb-2" />
                                <div className="h-2 w-full bg-foreground/10 rounded mb-1" />
                                <div className="h-2 w-8 bg-primary/30 rounded" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="text-center mt-4">
                <span className="text-sm font-medium text-muted-foreground">{mockup.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="btn-hero gap-2">
            <Download className="w-5 h-5" />
            Download Glamlink
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PhoneMockups;
