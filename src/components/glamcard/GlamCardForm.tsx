import { useState } from 'react';
import { User, Briefcase, Mail, Phone, FileText, Building, MapPin, Clock, Star, Instagram, MessageCircle, Calendar, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  businessName: string;
  location: string;
  hours: string;
  specialties: string;
  bookingNotes: string;
}

const GlamCardForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    businessName: '',
    location: '',
    hours: '',
    specialties: '',
    bookingNotes: '',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const displayName = formData.name || 'Your Name';
  const displayTitle = formData.title || 'Professional Title';
  const displayBio = formData.bio || 'Your professional bio will appear here. Share your story, expertise, and what makes you unique.';
  const displayLocation = formData.location || 'Your Location';
  const displayHours = formData.hours || 'Mon-Fri: 9AM-6PM';
  const displaySpecialties = formData.specialties || 'Your specialties';
  const displayBookingNotes = formData.bookingNotes || 'Important booking information';

  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="container-glamlink">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Create Your <span className="gradient-text">Glam Card</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill in your information and watch your professional digital card come to life in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">Basic Information</h3>
            
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Maya Rodriguez"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Hair Stylist & Colorist"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="maya@example.com"
                  maxLength={255}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Maya's Beauty Studio"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Brooklyn, NY"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell clients about your expertise, style, and what makes you unique..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Business Hours
                </label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleChange('hours', e.target.value)}
                  placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  Specialties
                </label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => handleChange('specialties', e.target.value)}
                  placeholder="Balayage, Color Correction, Bridal"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Booking Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Booking Notes
                </label>
                <textarea
                  value={formData.bookingNotes}
                  onChange={(e) => handleChange('bookingNotes', e.target.value)}
                  placeholder="Important information for clients booking appointments..."
                  maxLength={300}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
              {/* Preview header */}
              <div className="bg-primary px-6 py-4 flex items-center justify-between">
                <span className="text-primary-foreground font-semibold">ACCESS by Glamlink</span>
                <span className="text-primary-foreground/70 text-sm">Live Preview</span>
              </div>

              {/* Preview content */}
              <div className="p-6 lg:p-8">
                {/* Profile section */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'G'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
                    <p className="text-primary font-medium">{displayTitle}</p>
                    {formData.businessName && (
                      <p className="text-sm text-muted-foreground mt-1">{formData.businessName}</p>
                    )}
                  </div>
                </div>

                {/* About */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">About</h4>
                  <p className="text-foreground leading-relaxed">{displayBio}</p>
                </div>

                {/* Signature Work Gallery */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Signature Work
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-xl bg-secondary hover:bg-secondary/80 transition-colors" />
                    ))}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Location</h4>
                  <div className="aspect-[2/1] rounded-xl bg-secondary relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{displayLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      Hours
                    </div>
                    <p className="text-foreground font-medium">{displayHours}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Star className="w-4 h-4" />
                      Specialties
                    </div>
                    <p className="text-foreground font-medium">{displaySpecialties}</p>
                  </div>
                </div>

                {/* Booking notes */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8">
                  <div className="flex items-center gap-2 text-sm text-primary mb-1">
                    <Calendar className="w-4 h-4" />
                    Booking Notes
                  </div>
                  <p className="text-foreground text-sm">{displayBookingNotes}</p>
                </div>

                {/* Social icons */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                  <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlamCardForm;
