import Image from "next/image";
import { StaticImageData } from "next/image";

interface FeaturedPostProps {
  image: string | StaticImageData;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

const FeaturedPost = ({ image, category, title, excerpt, author, date }: FeaturedPostProps) => {
  console.log(image,"image")
  return (
    <article className="group cursor-pointer mb-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
  <Image
    src={image}
    alt={title}
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</div>

        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="caption-text text-primary">{category}</span>
            <span className="caption-text text-caption">Editor's Pick</span>
          </div>
          
          <h2 className="font-editorial text-3xl md:text-4xl font-medium mb-4 text-headline group-hover:text-primary transition-colors duration-200 leading-tight">
            {title}
          </h2>
          
          <p className="text-body text-lg leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-foreground">{author}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-caption">{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;