import Image from "next/image";
import { StaticImageData } from "next/image";

interface BlogCardProps {
   image: string | StaticImageData;

  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  featured?: boolean;
}

const BlogCard = ({ image, category, title, excerpt, author, date, featured = false }: BlogCardProps) => {
  return (
    <article className={`blog-card group cursor-pointer ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}>
        <Image
          src={image}
          alt={title}
          className="blog-card-image w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="caption-text bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-primary">
            {category}
          </span>
        </div>
      </div>
      
      <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
        <h3 className={`font-editorial font-medium mb-3 text-headline group-hover:text-primary transition-colors duration-200 ${
          featured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {title}
        </h3>
        
        <p className={`text-body leading-relaxed mb-4 line-clamp-2 ${featured ? 'md:line-clamp-3' : ''}`}>
          {excerpt}
        </p>
        
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-foreground">{author}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-caption">{date}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
