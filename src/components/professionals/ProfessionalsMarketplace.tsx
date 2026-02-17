"use client";

import { useState } from "react";
import {
  Search,
  Filter, // ← fixed here
  SlidersHorizontal,
  MapPin,
  Star,
  Instagram,
  MessageCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const professionals = [
  {
    id: 1,
    name: "Maya Rodriguez",
    title: "Hair Stylist & Colorist",
    location: "Brooklyn, NY",
    specialty: "Balayage",
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
  },
  {
    id: 2,
    name: "Jordan Lee",
    title: "Makeup Artist",
    location: "Manhattan, NY",
    specialty: "Bridal",
    rating: 5.0,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  },
  {
    id: 3,
    name: "Aisha Patel",
    title: "Nail Technician",
    location: "Queens, NY",
    specialty: "Nail Art",
    rating: 4.8,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
  },
  {
    id: 4,
    name: "Marcus Chen",
    title: "Barber",
    location: "Bronx, NY",
    specialty: "Fades",
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
  },
  {
    id: 5,
    name: "Sophie Williams",
    title: "Lash Artist",
    location: "Brooklyn, NY",
    specialty: "Volume Lashes",
    rating: 4.7,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
  },
  {
    id: 6,
    name: "David Kim",
    title: "Esthetician",
    location: "Manhattan, NY",
    specialty: "Facials",
    rating: 4.9,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
  },
];

const sortOptions = ["Most Popular", "Highest Rated", "Nearest", "Newest"];

const ProfessionalsMarketplace = () => {
  const [activeSort, setActiveSort] = useState("Most Popular");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/70 to-white">
      <div className="container-glamlink px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-sm font-semibold mb-5">
            Discover Talent
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl  tracking-tight text-gray-900 mb-5">
            Meet the <span className="text-[#24bbcb]">Professionals</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse our hand-curated marketplace of verified beauty experts ready
            to transform your look.
          </p>
        </div>

        {/* Search + Controls */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-full text-base shadow-sm 
                           focus:outline-none focus:border-[#24bbcb]/60 focus:ring-4 focus:ring-[#24bbcb]/15 
                           transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Sort + Filters */}
            <div className="flex gap-3 items-center">
              <div className="relative inline-flex items-center px-5 py-4 bg-white border border-gray-200 rounded-full shadow-sm hover:border-[#24bbcb]/40 transition-all">
                <SlidersHorizontal className="w-5 h-5 text-gray-500 mr-2" />
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer appearance-none pr-8"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <Button
                variant="outline"
                className="h-13 px-6 border-gray-200 hover:border-[#24bbcb]/50 hover:bg-[#24bbcb]/5 transition-all"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-md 
                         hover:shadow-2xl hover:shadow-[#24bbcb]/15 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                {/* Social icons on hover */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition">
                    <Instagram className="w-4.5 h-4.5 text-gray-800" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition">
                    <MessageCircle className="w-4.5 h-4.5 text-gray-800" />
                  </button>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1.5" />
                      <span className="font-semibold text-sm">
                        {pro.rating}
                      </span>
                      <span className="text-xs opacity-80 ml-1">
                        ({pro.reviews})
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl  mb-1">{pro.name}</h3>
                  <p className="text-base opacity-90">{pro.title}</p>
                </div>
              </div>

              {/* Footer bar */}
              <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#24bbcb]" />
                  <span>{pro.location}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-xs font-medium">
                  {pro.specialty}
                </span>
              </div>

              <Button className="w-full rounded-t-none bg-[#24bbcb] hover:bg-[#1ea8b5] text-white font-semibold py-6 transition-all duration-300 group-hover:scale-[1.02]">
                Book Now
              </Button>
            </div>
          ))}
        </div>

        {/* Show More */}
        <div className="text-center mt-12 md:mt-16">
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-[#24bbcb] hover:bg-[#1ea8b5] text-white px-10 py-7 rounded-full shadow-lg shadow-[#24bbcb]/25 
                       hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300 text-lg font-medium group"
          >
            Show More Professionals
            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Modal – Improved */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-white hover:bg-black/30 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#24bbcb]/10 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>

              <h2 className="text-2xl md:text-3xl  text-gray-900 mb-4">
                Unlock the Full Glamlink Experience
              </h2>

              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                Discover more verified beauty professionals, save favorites,
                read reviews, book instantly, and shop trusted products — all in
                the app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 min-w-[180px] py-7 text-base font-medium rounded-xl shadow-lg"
                >
                  <span className="mr-2"></span> App Store
                </Button>
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 min-w-[180px] py-7 text-base font-medium rounded-xl shadow-lg"
                >
                  <span className="mr-2">▶</span> Google Play
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-8">
                Free to download • No credit card needed
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfessionalsMarketplace;
