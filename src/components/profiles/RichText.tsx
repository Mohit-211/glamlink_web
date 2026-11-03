"use client";

import { useEffect, useId, useRef, useState } from "react";
import type DOMPurifyType from "dompurify";
import { ChevronDown } from "lucide-react";
import { htmlToText } from "@/lib/safeHtml";
import { cn } from "@/lib/utils";
import { isPlayerLink } from "./media";

/*
 * Rich text a page's owner wrote (the About, an education post), shown through
 * DOMPurify. DOMPurify needs a browser, so the server sends the words as plain
 * paragraphs (read by search engines, and shown at once) and the browser swaps
 * in the formatted text when DOMPurify has loaded, in its own small chunk.
 */

type Variant = "bio" | "article";

const BIO_TAGS = ["p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote"];

const RULES: Record<Variant, { tags: string[]; attributes: string[] }> = {
  bio: { tags: BIO_TAGS, attributes: ["href", "title"] },
  article: {
    tags: [...BIO_TAGS, "hr", "img", "figure", "figcaption", "iframe"],
    attributes: ["href", "title", "src", "alt", "width", "height", "allow", "allowfullscreen"],
  },
};

/** The short formatting of an About (the bio editor's: H3, lists, links, quotes). */
const BIO_STYLE =
  "space-y-3 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-secondary " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_h2]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5";

/** The text of each block, for the server's plain version. */
function paragraphsOf(html: string) {
  return html
    .split(/<\/(?:p|h[1-6]|li|blockquote|div|figcaption)\s*>|<br\s*\/?>/i)
    .map((part) => htmlToText(part))
    .filter(Boolean);
}

function sanitize(purify: typeof DOMPurifyType, html: string, variant: Variant) {
  const { tags, attributes } = RULES[variant];
  const clean = purify.sanitize(html, { ALLOWED_TAGS: tags, ALLOWED_ATTR: attributes });

  // A <template> parses without loading anything
  const template = document.createElement("template");
  template.innerHTML = clean;
  const root = template.content;

  root.querySelectorAll("a[href]").forEach((link) => {
    let external = false;
    try {
      external = new URL(link.getAttribute("href") ?? "", window.location.href).origin !== window.location.origin;
    } catch {
      // Not a link a browser can follow; leave it as it is
    }
    if (external) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
  root.querySelectorAll("iframe").forEach((frame) => {
    if (!isPlayerLink(frame.getAttribute("src"))) return frame.remove();
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("allowfullscreen", "");
  });
  root.querySelectorAll("img").forEach((image) => {
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
  });
  return template.innerHTML;
}

/** About this many characters fill the folded height; a guess for the server, measured in the browser. */
const FOLD_CHARACTERS = 320;

export default function RichText({
  html,
  variant = "bio",
  fold = false,
  className,
}: {
  html: string;
  variant?: Variant;
  /** Show the first lines with "Read more" (the profile's About). */
  fold?: boolean;
  className?: string;
}) {
  const [clean, setClean] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(() => fold && htmlToText(html).length > FOLD_CHARACTERS);
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    let live = true;
    import("dompurify").then(
      ({ default: purify }) => {
        if (live) setClean(sanitize(purify, html, variant));
      },
      () => {
        // Offline or blocked: the plain text stays
      }
    );
    return () => {
      live = false;
    };
  }, [html, variant]);

  // Whether the folded text is cut off, measured whenever its words (plain, then formatted) or width change
  useEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!fold || expanded || !box || !content) return;
    const observer = new ResizeObserver(() => setOverflows(content.offsetHeight > box.clientHeight + 4));
    observer.observe(content);
    return () => observer.disconnect();
  }, [fold, expanded, clean]);

  const style = variant === "article" ? "prose-article" : BIO_STYLE;
  const content =
    clean === null ? (
      <div key="plain" ref={contentRef} className={style}>
        {paragraphsOf(html).map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    ) : (
      <div key="formatted" ref={contentRef} className={style} dangerouslySetInnerHTML={{ __html: clean }} />
    );

  if (!fold) return <div className={className}>{content}</div>;

  const folded = !expanded && overflows;
  return (
    <div className={className}>
      <div id={id} ref={boxRef} className={cn(!expanded && "max-h-44 overflow-hidden", folded && "mask-b-from-55%")}>
        {content}
      </div>
      {(overflows || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((open) => !open)}
          className="link-glamlink mt-3 inline-flex items-center gap-1 text-sm"
        >
          {expanded ? "Read less" : "Read more"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
