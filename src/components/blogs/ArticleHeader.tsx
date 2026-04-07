interface ArticleHeaderProps {
  category: string;
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  readTime: string;
}

const ArticleHeader = ({ category, title, subtitle, author, date, readTime }: ArticleHeaderProps) => {
  return (
    <header className="container mx-auto px-6 mb-10 md:mb-12">
      <div className="max-w-3xl mx-auto text-center">
        <span className="caption-text text-primary mb-4 block">
          {category}
        </span>
        
        <h1 className="font-editorial text-3xl md:text-4xl lg:text-5xl font-medium text-headline mb-4 leading-tight text-balance">
          {title}
        </h1>
        
        {subtitle && (
          <p className="font-editorial text-xl md:text-2xl text-body/80 italic mb-8 leading-relaxed">
            {subtitle}
          </p>
        )}
        
        <div className="flex items-center justify-center gap-3 text-sm text-caption">
          <span className="font-medium text-foreground">{author}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{readTime}</span>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
