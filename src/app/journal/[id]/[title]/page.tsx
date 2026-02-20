import { getBlogsById } from '@/api/Api';
import ArticleContent from '@/components/blogs/ArticleContent';
import ArticleHeader from '@/components/blogs/ArticleHeader';
import AuthorSection from '@/components/blogs/AuthorSection';
import RelatedArticles from '@/components/blogs/RelatedArticles';
import Image from 'next/image';

interface BlogData {
  category_id: any;
  id: number;
  title: string;
  short_description: string;
  content: string;
  cover_image: string;
  created_at: string;
  slug?: string;
}

export default async function Article({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}) {
  const { id, title } = await params;

  console.log("Route ID:", id);
  console.log("Route Title:", title);

  const response = await getBlogsById(id);
  console.log(response, "response")
  const article: BlogData = response?.data;

  if (!article) {
    return <div className="text-center py-20">Article not found.</div>;
  }

  console.log(article, "article")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <article className="py-12 md:py-30">
          <ArticleHeader
            category="Blog"
            title={article.title}
            subtitle={article.short_description}
            author="Admin"
            date={new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            readTime="5 min read"
          />
          <div className="container mx-auto px-6 mb-12 md:mb-16">
            <div className="max-w-4xl mx-auto relative aspect-[16/9]">
              <Image
                unoptimized={process.env.NODE_ENV === "development"}
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
          <ArticleContent content={article.content} />
          {/* <AuthorSection
            author={{
              name: "Admin",
              role: "Content Writer",
              avatar: "",
              bio: "Passionate about writing and sharing insights.",
            }}
          /> */}
          <RelatedArticles category_id={article?.category_id} />
        </article>
      </main>
    </div>
  );
}
