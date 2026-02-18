"use client";

import { DollarSign, TrendingUp, Shield, Zap, Play, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import type { ForProfessionalsSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';
import { isExpertiseIntoSalesSection } from '@/lib/pages/admin/components/content-settings/content/sections/for-professionals/types';

interface ExpertiseIntoSalesSectionProps {
  section: ForProfessionalsSection;
}

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Icon mapping
const iconMap: { [key: string]: any } = {
  Zap,
  TrendingUp,
  Shield,
  DollarSign
};

export function ExpertiseIntoSalesSection({ section }: ExpertiseIntoSalesSectionProps) {
  if (!isExpertiseIntoSalesSection(section)) return null;
  const { content } = section;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (content.video.type === 'none') {
      return;
    } else if (content.video.type === 'local' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (content.video.type === 'youtube') {
      setIsPlaying(true);
    }
  };

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
              {content.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-glamlink-teal via-cyan-500 to-blue-500 animate-gradient">
                {content.titleGradientText}
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light">
              {content.subtitle}
            </p>
          </div>

          {/* Premium Video Player */}
          <div className="mb-20">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                {content.video.type === 'none' ? (
                  /* No Video Placeholder */
                  <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/90 via-cyan-500/80 to-blue-500/90">
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="text-center px-8">
                        <div className="mb-6 hidden sm:block">
                          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-10 h-10 text-white ml-1" />
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          {content.video.placeholderTitle}
                        </h3>
                        <p className="hidden sm:block text-lg text-white/90 max-w-lg mx-auto">
                          {content.video.placeholderDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : content.video.type === 'local' ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      src={content.video.src}
                      controls={isPlaying}
                      playsInline
                      poster={content.video.thumbnail || undefined}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                    {!isPlaying && (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/90 via-cyan-500/80 to-blue-500/90 cursor-pointer"
                        onClick={handlePlayVideo}
                      >
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <button className="group relative mb-6 pointer-events-none">
                              <div className="absolute inset-0 bg-white rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse" />
                              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-10 h-10 text-glamlink-teal ml-1" fill="currentColor" />
                              </div>
                            </button>
                            <h3 className="text-2xl font-bold text-white mb-2">{content.video.title}</h3>
                            <p className="text-white/80">{content.video.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : content.video.type === 'youtube' && isPlaying ? (
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(content.video.src)}?autoplay=1&rel=0`}
                    title={content.video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/90 via-cyan-500/80 to-blue-500/90 cursor-pointer"
                    onClick={handlePlayVideo}
                  >
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <button className="group relative mb-6 pointer-events-none">
                          <div className="absolute inset-0 bg-white rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse" />
                          <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-10 h-10 text-glamlink-teal ml-1" fill="currentColor" />
                          </div>
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-2">{content.video.title}</h3>
                        <p className="text-white/80">{content.video.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Features */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {content.features.map((feature, index) => {
              const Icon = iconMap[Zap.name] || Zap; // Default fallback
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative group cursor-pointer transform transition-all duration-500 ease-out ${isHovered ? 'scale-[1.02]' : ''}`}
                >
                  <div className={`relative bg-white rounded-2xl p-8 pb-20 border-2 transition-all duration-500 ${isHovered ? 'border-transparent shadow-2xl' : 'border-gray-100 shadow-lg'}`}>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className={`relative flex-shrink-0 w-20 h-20 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-glamlink-teal to-cyan-500 flex items-center justify-center transform transition-transform duration-500 ${isHovered ? 'rotate-6 scale-110' : ''}`}>
                        <Icon className="w-10 h-10 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    <div className="absolute right-6 bottom-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-glamlink-teal to-cyan-500 bg-clip-text text-transparent">
                          {feature.stat}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{feature.statLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-glamlink-teal to-cyan-500 rounded-3xl blur-xl opacity-30" />
            <div className="relative bg-gradient-to-r from-glamlink-teal to-cyan-500 rounded-3xl p-12 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white font-semibold">{content.cta.badge}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{content.cta.title}</h3>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">{content.cta.subtitle}</p>
                <a
                  href={content.cta.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-glamlink-teal font-bold text-lg rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  {content.cta.buttonText}
                  <ChevronRight className="w-5 h-5" />
                </a>
                <p className="text-white/80 text-sm mt-6">{content.cta.disclaimer}</p>
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
