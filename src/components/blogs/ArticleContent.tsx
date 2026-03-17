"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface ArticleContentProps {
  content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  const [safeContent, setSafeContent] = useState("");

  useEffect(() => {
    if (typeof content === "string") {
      setSafeContent(DOMPurify.sanitize(content));
    } else {
      setSafeContent("");
    }
  }, [content]);

  // Fallback if no content
  if (!safeContent) {
    return (
      <div className="container mx-auto px-6 text-center py-10">
        <p className="text-muted-foreground">Content unavailable.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      <div
        className="prose-article max-w-2xl mx-auto"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    </div>
  );
};

export default ArticleContent;
