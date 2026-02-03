import { Eye, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const issues2025 = [
  {
    id: 1,
    month: 'January',
    year: '2025',
    title: 'The New Wave',
    subtitle: 'Rising Stars Redefining Beauty',
    featuredPro: 'Maya Rodriguez',
    cover: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&h=800&fit=crop',
    highlights: ['2025 Trend Forecast', 'Sustainable Beauty', 'Pro Spotlights'],
  },
  {
    id: 2,
    month: 'February',
    year: '2025',
    title: 'Love & Luxe',
    subtitle: 'Romance-Ready Looks',
    featuredPro: 'Jordan Lee',
    cover: 'https://images.unsplash.com/photo-1526510747491-312a9dd58691?w=600&h=800&fit=crop',
    highlights: ['Bridal Edition', 'Date Night Glam', 'Self-Care Rituals'],
  },
  {
    id: 3,
    month: 'March',
    year: '2025',
    title: 'Power Players',
    subtitle: 'Women Leading the Industry',
    featuredPro: 'Aisha Patel',
    cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
    highlights: ['Boss Moves', 'Empire Builders', 'Future Icons'],
  },
  {
    id: 4,
    month: 'April',
    year: '2025',
    title: 'Fresh Start',
    subtitle: 'Spring Transformations',
    featuredPro: 'Sophie Williams',
    cover: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop',
    highlights: ['Skin Revival', 'Color Trends', 'Wellness Reset'],
  },
];

const issues2024 = [
  {
    id: 5,
    month: 'December',
    year: '2024',
    title: 'Year in Review',
    subtitle: 'The Best of 2024',
    featuredPro: 'Marcus Chen',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    highlights: ['Top 100 Pros', 'Breakthrough Moments', 'Award Winners'],
  },
  {
    id: 6,
    month: 'November',
    year: '2024',
    title: 'Golden Hour',
    subtitle: 'Holiday Glamour',
    featuredPro: 'Elena Torres',
    cover: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&h=800&fit=crop',
    highlights: ['Party Season', 'Gift Guide', 'Festive Looks'],
  },
  {
    id: 7,
    month: 'October',
    year: '2024',
    title: 'Dark Romance',
    subtitle: 'Moody Autumn Beauty',
    featuredPro: 'David Kim',
    cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    highlights: ['Fall Palette', 'Dramatic Looks', 'Cozy Rituals'],
  },
  {
    id: 8,
    month: 'September',
    year: '2024',
    title: 'Back to Basics',
    subtitle: 'Timeless Techniques',
    featuredPro: 'Nina Patel',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop',
    highlights: ['Classic Beauty', 'Pro Tips', 'Essential Tools'],
  },
];

interface IssueCardProps {
  issue: typeof issues2025[0];
}

const IssueCard = ({ issue }: IssueCardProps) => {
  return (
    <div className="group">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-secondary">
        <img
          src={issue.cover}
          alt={`${issue.month} ${issue.year} - ${issue.title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-80" />
        
        {/* Cover content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top: Month/Year */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium tracking-wide uppercase">
                {issue.month}
              </p>
              <p className="text-white/50 text-xs">{issue.year}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Bottom: Title & Info */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-serif text-white mb-1">
              {issue.title}
            </h3>
            <p className="text-white/80 text-sm mb-3">{issue.subtitle}</p>
            
            {/* Highlights */}
            <div className="flex flex-wrap gap-2">
              {issue.highlights.slice(0, 2).map((highlight, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 rounded-full text-sm h-10 border-border hover:border-primary hover:text-primary"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Issue
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 rounded-full text-sm h-10 border-border hover:border-primary hover:text-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Digital Edition
        </Button>
      </div>
    </div>
  );
};

const MagazineIssues = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="container-glamlink">
        {/* 2025 Issues */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl lg:text-3xl font-serif text-foreground">
              2025 Issues
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {issues2025.length} issues
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {issues2025.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>

        {/* 2024 Issues */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl lg:text-3xl font-serif text-foreground">
              2024 Issues
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {issues2024.length} issues
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {issues2024.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>

        {/* Load more / Archive link */}
        <div className="text-center mt-16">
          <Button variant="outline" className="rounded-full px-8 py-6 text-base border-2">
            Browse Full Archive
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            24 issues available in our archive
          </p>
        </div>
      </div>
    </section>
  );
};

export default MagazineIssues;
