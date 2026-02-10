import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import BlogCard from './BlogCard';
import FeaturedPost from './FeaturedPost';
import Pagination from './Pagination';
import blogFeatured from '../../../public/assets/blog-featured.jpg';
import blog1 from '../../../public/assets/blog-1.jpg';
import blog2 from '../../../public/assets/blog-2.jpg';
import blog3 from '../../../public/assets/blog-3.jpg';
import blog4 from '../../../public/assets/blog-4.jpg';
import blog5 from '../../../public/assets/blog-5.jpg';
import blog6 from '../../../public/assets/blog-6.jpg';
interface BlogPost {
  id: number;
  image: string | StaticImageData;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  featured?: boolean;
  slug: string;
}
const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: blogFeatured,
    category: 'Influencer Marketing',
    title: 'The Rise of Micro-Influencers in the Beauty Industry',
    excerpt:
      'How smaller creators are driving authentic engagement and reshaping brand partnerships in the beauty space. The shift toward authenticity over reach is changing the marketing landscape.',
    author: 'Elena Vasquez',
    date: 'January 28, 2024',
    featured: true,
    slug: 'micro-influencers-beauty-industry',
  },
  {
    id: 2,
    image: blog1,
    category: 'Beauty Professionals',
    title: 'Building Your Salon Brand in 2024',
    excerpt:
      'Essential strategies for salon owners looking to differentiate and grow their client base in a competitive market.',
    author: 'Marcus Chen',
    date: 'January 25, 2024',
    slug: 'building-your-salon-brand',
  },
  {
    id: 3,
    image: blog2,
    category: 'Trends',
    title: 'The Clean Beauty Movement: What Professionals Need to Know',
    excerpt:
      'Understanding the shift toward sustainable and transparent beauty products and how it affects service providers.',
    author: 'Sophie Laurent',
    date: 'January 22, 2024',
    slug: 'clean-beauty-movement',
  },
  {
    id: 4,
    image: blog3,
    category: 'Salon Growth',
    title: 'Maximizing Client Retention Through Personalization',
    excerpt:
      'Data-driven approaches to creating memorable experiences that keep clients coming back.',
    author: 'James Park',
    date: 'January 18, 2024',
    slug: 'client-retention-personalization',
  },
  {
    id: 5,
    image: blog4,
    category: 'Industry Insights',
    title: 'The Future of Beauty Tech: AI and Beyond',
    excerpt:
      'Exploring how artificial intelligence and emerging technologies are transforming the beauty industry landscape.',
    author: 'Aria Patel',
    date: 'January 15, 2024',
    slug: 'future-beauty-tech-ai',
  },
  {
    id: 6,
    image: blog5,
    category: 'Influencer Marketing',
    title: 'Measuring ROI on Creator Partnerships',
    excerpt:
      'A comprehensive guide to tracking and optimizing your influencer marketing investments.',
    author: 'David Kim',
    date: 'January 12, 2024',
    slug: 'measuring-roi-creator-partnerships',
  },
  {
    id: 7,
    image: blog6,
    category: 'Beauty Professionals',
    title: 'The Art of Client Consultation',
    excerpt:
      'Mastering the first impression and building trust from the very first conversation.',
    author: 'Isabella Torres',
    date: 'January 8, 2024',
    slug: 'art-of-client-consultation',
  },
];
const BlogGrid: React.FC = () => {
  const featured = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);
  return (
    <section className="container mx-auto px-6 py-12">
      {featured && (
        <Link href={`/article/${featured.slug}`} className="block">
          <FeaturedPost
            image={featured.image}
            category={featured.category}
            title={featured.title}
            excerpt={featured.excerpt}
            author={featured.author}
            date={featured.date}
          />
        </Link>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/article/${post.slug}`}
            className="block animate-fade-in-up opacity-0"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <BlogCard
              image={post.image}
              category={post.category}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.date}
            />
          </Link>
        ))}
      </div>
      <Pagination />
    </section>
  );
};
export default BlogGrid;