'use client'
import { Search, Filter, MapPin, Star, Instagram, MessageCircle, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
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

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container-glamlink">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Discover Talent
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
             <span className="gradient-text"> Meet The Professionals</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated marketplace of verified beauty experts. This is where your clients will find you.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              <select 
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-transparent text-foreground font-medium outline-none cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Filters</span>
            </button>
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <div key={pro.id} className="card-professional group">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-semibold text-background">{pro.rating}</span>
                    <span className="text-sm text-background/70">({pro.reviews})</span>
                  </div>
                  <h3 className="text-xl font-semibold text-background">{pro.name}</h3>
                  <p className="text-background/80">{pro.title}</p>
                </div>

                {/* Social Icons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Instagram className="w-4 h-4 text-foreground" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <MessageCircle className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{pro.location}</span>
                  <span className="text-border">•</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {pro.specialty}
                  </span>
                </div>
                <Button className="w-full btn-primary">
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                page === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scale indicator */}
        <p className="text-center text-muted-foreground mt-6">
          Showing 6 of <span className="text-primary font-semibold">2,847</span> professionals
        </p>
      </div>
    </section>
  );
};

export default ProfessionalsMarketplace;
