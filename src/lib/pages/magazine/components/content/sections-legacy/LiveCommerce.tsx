"use client";

import { LiveCommerceEvent } from "../../../types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface LiveCommerceProps {
  events?: LiveCommerceEvent[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; events?: string; benefits?: string };
}

export default function LiveCommerce({ events, isLoading, backgroundColor }: LiveCommerceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock data for when no events are provided
  const mockEvents: LiveCommerceEvent[] = [
    {
      id: "live-1",
      title: "Summer Glow Makeup Tutorial & Sale",
      hostName: "Sarah Beauty",
      hostImage: "/images/placeholder.png",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      duration: "60 minutes",
      productIds: ["prod-1", "prod-2", "prod-3"],
      viewerCount: 0,
      discountPercentage: 25,
      status: "upcoming",
      streamUrl: "#",
    },
    {
      id: "live-2",
      title: "K-Beauty Skincare Secrets",
      hostName: "Jenny Kim",
      hostImage: "/images/placeholder.png",
      startTime: new Date().toISOString(), // Now
      duration: "45 minutes",
      productIds: ["prod-4", "prod-5", "prod-6"],
      viewerCount: 342,
      discountPercentage: 30,
      status: "live",
      streamUrl: "#",
    },
    {
      id: "live-3",
      title: "Natural Hair Care Masterclass",
      hostName: "Maria Styles",
      hostImage: "/images/placeholder.png",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      duration: "90 minutes",
      productIds: ["prod-7", "prod-8"],
      viewerCount: 1205,
      discountPercentage: 20,
      status: "ended",
      streamUrl: "#",
    },
    {
      id: "live-4",
      title: "Anti-Aging Skincare Routine",
      hostName: "Dr. Emma Chen",
      hostImage: "/images/placeholder.png",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      duration: "60 minutes",
      productIds: ["prod-9", "prod-10", "prod-11"],
      viewerCount: 0,
      discountPercentage: 35,
      status: "upcoming",
      streamUrl: "#",
    },
  ];

  const displayEvents = events && events.length > 0 ? events : mockEvents;

  // Parse background colors
  const backgrounds = typeof backgroundColor === "object" ? backgroundColor : { main: backgroundColor };

  // Check if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    return value && (value.startsWith("bg-") || value.includes(" bg-") || value.includes("from-") || value.includes("to-"));
  };

  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === "transparent") return {};
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    return { style: { background: bgValue } };
  };

  const mainBgProps = getBackgroundProps(backgrounds?.main);
  const eventsBgProps = getBackgroundProps(backgrounds?.events);
  const benefitsBgProps = getBackgroundProps(backgrounds?.benefits);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  const getTimeUntil = (startTime: string) => {
    const start = new Date(startTime);
    const diff = start.getTime() - currentTime.getTime();

    if (diff <= 0) return "Started";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} away`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return { text: "🔴 LIVE NOW", color: "bg-red-500 text-white animate-pulse" };
      case "upcoming":
        return { text: "📅 Upcoming", color: "bg-blue-500 text-white" };
      case "ended":
        return { text: "✓ Ended", color: "bg-gray-500 text-white" };
      default:
        return { text: status, color: "bg-gray-400 text-white" };
    }
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div {...mainBgProps} className={mainBgProps?.className || ""}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Live Commerce Hub</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Shop with your favorite beauty experts in real-time with exclusive discounts</p>
      </div>

      {/* Live Commerce Stats */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-red-600">$79.64B</div>
            <div className="text-sm text-gray-600">Market by 2025</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">67%</div>
            <div className="text-sm text-gray-600">Higher Conversion</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">40%</div>
            <div className="text-sm text-gray-600">Less Returns</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">10x</div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {displayEvents.map((event) => {
          const statusBadge = getStatusBadge(event.status);

          return (
            <div key={event.id} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${eventsBgProps?.className || "bg-white"}`} {...(eventsBgProps?.style && { style: eventsBgProps.style })}>
              {/* Host Info Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <Image src={event.hostImage} alt={event.hostName} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.hostName}</h4>
                      <p className="text-sm text-gray-600">{event.duration}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.color}`}>{statusBadge.text}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>

                {/* Time & Viewers */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {event.status === "upcoming" && (
                      <div className="text-gray-600">
                        <span className="font-medium">Starts in: </span>
                        <span className="text-blue-600 font-semibold">{getTimeUntil(event.startTime)}</span>
                      </div>
                    )}
                    {event.status === "live" && <div className="text-red-600 font-semibold">🔴 {formatViewerCount(event.viewerCount)} watching now</div>}
                    {event.status === "ended" && (
                      <div className="text-gray-600">
                        <span className="font-medium">Total viewers: </span>
                        <span className="font-semibold">{formatViewerCount(event.viewerCount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{event.discountPercentage}% OFF</div>
                    <div className="text-xs text-gray-500">During live</div>
                  </div>
                </div>

                {/* Product Count */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">🛍️ {event.productIds.length} products featured</span>
                </div>

                {/* Action Button */}
                {event.status === "live" && (
                  <Link href={event.streamUrl || "#"} className="block w-full text-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                    Join Live Stream
                  </Link>
                )}
                {event.status === "upcoming" && <button className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Set Reminder</button>}
                {event.status === "ended" && <button className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Watch Replay</button>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Shopping Benefits */}
      <div className={`mt-12 rounded-2xl p-8 ${benefitsBgProps?.className || "bg-white"}`} {...(benefitsBgProps?.style && { style: benefitsBgProps.style })}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Shop Live?</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">💬</div>
            <h4 className="font-semibold text-gray-900 mb-2">Real-Time Q&A</h4>
            <p className="text-sm text-gray-600">Ask questions and get instant answers from experts</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🎁</div>
            <h4 className="font-semibold text-gray-900 mb-2">Exclusive Deals</h4>
            <p className="text-sm text-gray-600">Special discounts only available during live streams</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">👀</div>
            <h4 className="font-semibold text-gray-900 mb-2">See It In Action</h4>
            <p className="text-sm text-gray-600">Watch products being used and demonstrated live</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🏆</div>
            <h4 className="font-semibold text-gray-900 mb-2">Limited Editions</h4>
            <p className="text-sm text-gray-600">Access to exclusive products and bundles</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Never miss a live shopping event</p>
        <Link href="/brand" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-colors">
          Follow Your Favorite Brands
        </Link>
      </div>
    </div>
  );
}
