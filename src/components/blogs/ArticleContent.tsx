interface ArticleContentProps {
  content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <div className="container mx-auto px-6">
      <div 
        className="prose-article max-w-2xl mx-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ArticleContent;
