"use client";

import { Eye, Users, Heart, MessageCircle } from "lucide-react";

export default function PreviewBlockIntro() {
  const engagementStats = [
    { icon: <Eye className="w-5 h-5" />, label: "Profile Views", value: "10K+" },
    { icon: <Users className="w-5 h-5" />, label: "New Clients", value: "50+" },
    { icon: <Heart className="w-5 h-5" />, label: "Likes", value: "1K+" },
    { icon: <MessageCircle className="w-5 h-5" />, label: "Inquiries", value: "100+" },
  ];

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Let Your Expertise Shine</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">Share your journey, specialties, and the wins that set you apart. We'll turn it into a polished Glamlink Edit feature and connect it to your Glamlink Pro profile, so users can discover you, see proof, and book in a tap.</p>
    </div>
  );
}