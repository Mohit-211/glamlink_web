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
      const clean = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          "html",
          "body",
          "div",
          "span",
          "p",
          "br",
          "hr",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "s",
          "blockquote",
          "pre",
          "code",
          "ul",
          "ol",
          "li",
          "dl",
          "dt",
          "dd",
          "table",
          "thead",
          "tbody",
          "tfoot",
          "tr",
          "th",
          "td",
          "a",
          "img",
          "picture",
          "source",
          "video",
          "audio",
          "iframe",
          "figure",
          "figcaption",
          "section",
          "article",
          "header",
          "footer",
          "main",
          "aside",
          "nav",
          "form",
          "input",
          "textarea",
          "button",
          "label",
          "select",
          "option",
          "svg",
          "path",
          "canvas",
        ],

        ALLOWED_ATTR: [
          "class",
          "id",
          "style",
          "src",
          "srcset",
          "href",
          "target",
          "rel",
          "alt",
          "title",
          "width",
          "height",
          "loading",
          "allow",
          "allowfullscreen",
          "frameborder",
          "scrolling",
          "controls",
          "autoplay",
          "loop",
          "muted",
          "poster",
          "type",
          "value",
          "placeholder",
          "name",
          "for",
          "checked",
          "selected",
          "disabled",
          "viewBox",
          "fill",
          "stroke",
          "d",
        ],
      });

      setSafeContent(clean);
    } else {
      setSafeContent("");
    }
  }, [content]);

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