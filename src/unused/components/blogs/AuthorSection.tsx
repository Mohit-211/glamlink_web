interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface AuthorSectionProps {
  author: Author;
}

const AuthorSection = ({ author }: AuthorSectionProps) => {
  return (
    <section className="container mx-auto px-6 mt-16 mb-12">
      <div className="max-w-2xl mx-auto">
        <div className="border-t border-border/50 pt-10">
          <div className="flex items-start gap-5">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className="caption-text text-caption mb-1">Written by</p>
              <h3 className="font-editorial text-xl font-medium text-headline mb-1">
                {author.name}
              </h3>
              <p className="text-sm text-primary mb-3">{author.role}</p>
              <p className="text-body text-sm leading-relaxed">
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
