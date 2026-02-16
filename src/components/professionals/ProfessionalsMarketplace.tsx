'use client'
import { Search, Filter, MapPin, Star, Instagram, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const professionals = [
  {
    id: 1,
    name: 'Maya Rodriguez',
    title: 'Hair Stylist & Colorist',
    location: 'Brooklyn, NY',
    specialty: 'Balayage',
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    name: 'Jordan Lee',
    title: 'Makeup Artist',
    location: 'Manhattan, NY',
    specialty: 'Bridal',
    rating: 5.0,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    title: 'Nail Technician',
    location: 'Queens, NY',
    specialty: 'Nail Art',
    rating: 4.8,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
  },
  {
    id: 4,
    name: 'Marcus Chen',
    title: 'Barber',
    location: 'Bronx, NY',
    specialty: 'Fades',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
  },
  {
    id: 5,
    name: 'Sophie Williams',
    title: 'Lash Artist',
    location: 'Brooklyn, NY',
    specialty: 'Volume Lashes',
    rating: 4.7,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
  },
  {
    id: 6,
    name: 'David Kim',
    title: 'Esthetician',
    location: 'Manhattan, NY',
    specialty: 'Facials',
    rating: 4.9,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
  },
];

const sortOptions = ['Most Popular', 'Highest Rated', 'Nearest', 'Newest'];

const ProfessionalsMarketplace = () => {
  const [activeSort, setActiveSort] = useState('Most Popular');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 lg:py-24 bg-secondary/30 relative">
      <div className="container-glamlink">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Discover Talent
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            <span className="gradient-text">Meet The Professionals</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated marketplace of verified beauty experts.
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors">
              <Filter className="w-5 h-5 text-muted-foreground" />
              Filters
            </button>
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <div key={pro.id} className="rounded-2xl overflow-hidden shadow-lg bg-card group">
              
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{pro.rating}</span>
                    <span className="text-sm opacity-70">({pro.reviews})</span>
                  </div>
                  <h3 className="text-xl font-semibold">{pro.name}</h3>
                  <p className="opacity-80">{pro.title}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  {pro.location}
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {pro.specialty}
                  </span>
                </div>
                <Button className="w-full">Book Now</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        <p
          onClick={() => setIsModalOpen(true)}
          className="text-center text-primary font-semibold mt-8 cursor-pointer hover:underline"
        >
          Show More
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white w-[90%] max-w-md rounded-2xl p-8 shadow-2xl animate-[scaleIn_.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-4 text-4xl">👩</div>

            <h2 className="text-xl font-bold text-center mb-3">
              Welcome to Glamlink - your new favorite beauty app
            </h2>

            <p className="text-sm text-gray-600 text-center mb-6">
              Discover trusted beauty professionals near you. Book with ease,
              and shop expert-approved products - all in one place.
            </p>

            <p className="text-center font-semibold mb-4">
              Get the full experience — download the app:
            </p>

            <div className="flex justify-center gap-4">
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
                 App Store
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
                ▶ Google Play
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfessionalsMarketplace;
