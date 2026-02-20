"use client";

import { DollarSign, TrendingUp, Shield, Zap, Play, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

// Feature flags
const SHOW_VIDEO_STATS = false; // Set to true to show Monthly GMV and Active Shops

// Video configuration - easily changeable
const videoContent = {
  type: 'none' as 'local' | 'youtube' | 'none', // Set to 'none' to disable video
  src: '/videos/ai-video.mp4', // Local video path or YouTube URL (ignored if type is 'none')
  // For YouTube, use: 'https://www.youtube.com/watch?v=VIDEO_ID' or 'https://youtu.be/VIDEO_ID'
  // Test video (if local doesn't work): 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  title: 'Watch How Pros Earn More',
  description: '3 minute setup • Instant results',
  thumbnail: null as string | null, // Optional custom thumbnail
  placeholderTitle: 'Professional Video Coming Soon', // Title when no video
  placeholderDescription: 'Stay tuned for exclusive content showing how pros maximize their earnings', // Description when no video
};

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function ExpertiseIntoSalesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoContent.type === 'none') {
      // No action for placeholder
      return;
    } else if (videoContent.type === 'local' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (videoContent.type === 'youtube') {
      setIsPlaying(true);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Your Shop, Everywhere",
      description: "Be visible 24/7. Your products live in the main Shop tab where users browse anytime and directly on your profile for instant sales.",
      color: "from-yellow-400 to-orange-500",
      stat: "24/7",
      statLabel: "Visibility"
    },
    {
      icon: TrendingUp,
      title: "Sell Through Your Content",
      description: "Showcase your expertise with powerful before and after photos, engaging demo videos and client testimonials that turn trust into sales.",
      color: "from-pink-500 to-rose-500",
      stat: "3x",
      statLabel: "Conversion Rate"
    },
    {
      icon: Shield,
      title: "An Ecosystem That Works Together",
      description: "Your shop isn't isolated. Reviews, booking and future AI recommendations all drive clients back to you and your products.",
      color: "from-blue-500 to-indigo-500",
      stat: "360°",
      statLabel: "Integration"
    },
    {
      icon: DollarSign,
      title: "Built For Professionals",
      description: "Glamlink is 100% beauty and wellness. Every product is reviewed and approved before it goes live, ensuring a professional marketplace clients can trust. As a seller, you're responsible for your products and compliance. All sellers must be licensed professionals and agree to Glamlink's seller terms.",
      color: "from-green-500 to-emerald-500",
      stat: "100%",
      statLabel: "Verified"
    }
  ];

  return (
    <section className="relative py-12 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-glamlink-teal/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with gradient accent */}
          <div className="text-center mb-16">
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
              Turn Your Expertise Into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-glamlink-teal via-cyan-500 to-blue-500 animate-gradient">
                Unstoppable Sales
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light">
              If you're not selling retail, you're leaving money behind. Glamlink gives you 
              the steps to sign up your shop and start earning. For a limited time, enjoy 
              a lower platform fee while you grow.
            </p>
          </div>

          {/* Premium Video Player - Full Width */}
          <div className="mb-20">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                {/* Render based on video type */}
                {videoContent.type === 'none' ? (
                  /* No Video Placeholder */
                  <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/90 via-cyan-500/80 to-blue-500/90">
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="text-center px-8">
                        {/* Play button icon - hidden on mobile, visible on md and up */}
                        <div className="mb-6 hidden sm:block">
                          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-10 h-10 text-white ml-1" />
                          </div>
                        </div>
                        
                        {/* Title - always visible */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          {videoContent.placeholderTitle}
                        </h3>
                        
                        {/* Description - hidden on mobile, visible on md and up */}
                        <p className="hidden sm:block text-lg text-white/90 max-w-lg mx-auto">
                          {videoContent.placeholderDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : videoContent.type === 'local' ? (
                  <>
                    {/* Local Video Player */}
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      src={videoContent.src}
                      controls={isPlaying}
                      playsInline
                      poster={videoContent.thumbnail || undefined}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                    
                    {/* Play Overlay - Only show when not playing */}
                    {!isPlaying && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/90 via-cyan-500/80 to-blue-500/90 cursor-pointer"
                        onClick={handlePlayVideo}
                      >
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            {/* Play button */}
                            <button className="group relative mb-6 pointer-events-none">
                              <div className="absolute inset-0 bg-white rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse" />
                              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-10 h-10 text-glamlink-teal ml-1" fill="currentColor" />
                              </div>
                            </button>
                            
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {videoContent.title}
                            </h3>
                            <p className="text-white/80">
                              {videoContent.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : videoContent.type === 'youtube' && isPlaying ? (
                  /* YouTube Embed - Only show after clicking play */
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoContent.src)}?autoplay=1&rel=0`}
                    title={videoContent.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  /* YouTube Play Overlay */
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/90 via-cyan-500/80 to-blue-500/90 cursor-pointer"
                    onClick={handlePlayVideo}
                  >
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        {/* Play button */}
                        <button className="group relative mb-6 pointer-events-none">
                          <div className="absolute inset-0 bg-white rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse" />
                          <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-10 h-10 text-glamlink-teal ml-1" fill="currentColor" />
                          </div>
                        </button>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {videoContent.title}
                        </h3>
                        <p className="text-white/80">
                          {videoContent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating stats - conditionally rendered */}
                {SHOW_VIDEO_STATS && !isPlaying && (
                  <>
                    <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 z-20">
                      <div className="text-white">
                        <div className="text-2xl font-bold">$2.3M+</div>
                        <div className="text-sm opacity-80">Monthly GMV</div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 z-20">
                      <div className="text-white">
                        <div className="text-2xl font-bold">5,000+</div>
                        <div className="text-sm opacity-80">Active Shops</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Features - 2x2 Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    relative group cursor-pointer
                    transform transition-all duration-500 ease-out
                    ${isHovered ? 'scale-[1.02]' : ''}
                  `}
                >
                  <div className={`
                    relative bg-white rounded-2xl p-8 pb-20
                    border-2 transition-all duration-500
                    ${isHovered ? 'border-transparent shadow-2xl' : 'border-gray-100 shadow-lg'}
                  `}>
                    {/* Gradient border on hover */}
                    {isHovered && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} p-[2px]`}>
                        <div className="bg-white rounded-2xl w-full h-full" />
                      </div>
                    )}
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      {/* Icon with gradient background - centered on mobile, left-aligned on sm+ */}
                      <div className={`
                        relative flex-shrink-0 w-20 h-20 sm:w-16 sm:h-16 rounded-xl
                        bg-gradient-to-br ${feature.color}
                        flex items-center justify-center
                        transform transition-transform duration-500
                        ${isHovered ? 'rotate-6 scale-110' : ''}
                      `}>
                        <Icon className="w-10 h-10 sm:w-8 sm:h-8 text-white" />
                      </div>
                      
                      {/* Content - centered text on mobile, left-aligned on sm+ */}
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats - always visible at bottom right */}
                    <div className="absolute right-6 bottom-6">
                      <div className="text-right">
                        <div className={`text-2xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                          {feature.stat}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          {feature.statLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Now, Pay Less - Premium CTA */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-glamlink-teal to-cyan-500 rounded-3xl blur-xl opacity-30" />
            <div className="relative bg-gradient-to-r from-glamlink-teal to-cyan-500 rounded-3xl p-12 text-center overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white font-semibold">Limited Time Offer</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Join Now, Pay Less
                </h3>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Sign up today and benefit from introductory platform fees.
                </p>

                <a
                  href="https://crm.glamlink.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-glamlink-teal font-bold text-lg rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Selling
                  <ChevronRight className="w-5 h-5" />
                </a>

                <p className="text-white/80 text-sm mt-6">
                  No setup fees • Instant approval • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}