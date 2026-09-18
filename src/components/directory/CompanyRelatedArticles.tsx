import Link from "next/link";
import slugify from "slugify";
import { BookOpen } from "lucide-react";
import { TopicJournal } from "@/lib/topics";
import BlogCard from "@/components/blogs/BlogCard";

interface CompanyRelatedArticlesProps {
  articles: TopicJournal[];
  companyName: string;
}

/** Journal articles this company is tagged/associated with. Hidden entirely when there are none, rather than showing an empty section. */
const CompanyRelatedArticles = ({ articles, companyName }: CompanyRelatedArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12 md:py-14">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-3.5 w-3.5 text-[#24bbcb]" />
        <p className="text-[10px] tracking-[.15em] uppercase text-gray-400">Journal</p>
      </div>
      <h2 className="font-serif text-2xl text-gray-900 mb-1">Related Articles</h2>
      <p className="text-sm text-gray-500 font-light mb-8">
        Journal articles featuring or mentioning {companyName}.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const slug = article.slug || slugify(article.title || "", { lower: true, strict: true });
          const formattedDate = article.publish_date
            ? new Date(article.publish_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";
          return (
            <Link key={article.id} href={`/journal/${article.id}/${slug}`} className="block h-full">
              <BlogCard
                image={article.cover_image}
                category={article.journal_category?.title}
                title={article.title}
                excerpt={article.short_description}
                author={article.journal_author?.name}
                date={formattedDate}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CompanyRelatedArticles;
