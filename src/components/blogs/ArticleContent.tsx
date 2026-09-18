"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { getBusinessCardBySlug } from "@/api/Api";

interface ArticleContentProps {
  content: string;
}

// Matches @handle when preceded by start-of-string/whitespace/punctuation,
// so it doesn't catch emails like "name@example.com".
const MENTION_REGEX = /(^|[\s(])@([a-zA-Z0-9_.-]{2,50})/g;

// TEMPORARY TEST MODE: every @mention links to this URL regardless of
// whether the handle matches a real business card. Set to false to
// restore real per-handle existence checks via businessCardExists().
const TEST_MODE_ALWAYS_LINK = true;
const TEST_MODE_URL = "https://glamlink.net/access-card/niki-capobianco";

async function businessCardExists(handle: string): Promise<boolean> {
  try {
    const res = await getBusinessCardBySlug(handle);
    if (res?.success === false && res?.status !== 402) return false;
    return !!(res?.data && (res.data.id || res.data.custom_handle));
  } catch {
    return false;
  }
}

async function linkifyMentions(html: string): Promise<string> {
  if (typeof document === "undefined" || !html.includes("@")) return html;

  const container = document.createElement("div");
  container.innerHTML = html;

  // Collect unique candidate handles from text nodes only (skips tags/attrs/links/code).
  const handles = new Set<string>();
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const tag = node.parentElement?.tagName;
        if (tag && ["A", "CODE", "PRE", "SCRIPT", "STYLE"].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent || "";
    MENTION_REGEX.lastIndex = 0;
    let match;
    let found = false;
    while ((match = MENTION_REGEX.exec(text))) {
      handles.add(match[2]);
      found = true;
    }
    if (found) textNodes.push(node as Text);
  }

  if (handles.size === 0) return html;

  const existsByHandle = new Map<string, boolean>();
  if (TEST_MODE_ALWAYS_LINK) {
    handles.forEach((handle) => existsByHandle.set(handle, true));
  } else {
    await Promise.all(
      Array.from(handles).map(async (handle) => {
        existsByHandle.set(handle, await businessCardExists(handle));
      })
    );
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent || "";
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    MENTION_REGEX.lastIndex = 0;
    let match;
    while ((match = MENTION_REGEX.exec(text))) {
      const [, lead, handle] = match;
      const start = match.index + lead.length;
      const end = start + handle.length + 1; // +1 for "@"

      if (!existsByHandle.get(handle)) continue;

      frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      const anchor = document.createElement("a");
      anchor.href = TEST_MODE_ALWAYS_LINK
        ? TEST_MODE_URL
        : `/access-card/${encodeURIComponent(handle)}`;
      anchor.className = "mention-link";
      anchor.textContent = `@${handle}`;
      frag.appendChild(anchor);
      lastIndex = end;
    }
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode?.replaceChild(frag, textNode);
  }

  return container.innerHTML;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  const [safeContent, setSafeContent] = useState("");

  useEffect(() => {
    let cancelled = false;

    const process = async () => {
      if (typeof content !== "string") {
        if (!cancelled) setSafeContent("");
        return;
      }

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

      const linked = await linkifyMentions(clean);
      if (!cancelled) setSafeContent(linked);
    };

    process();

    return () => {
      cancelled = true;
    };
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