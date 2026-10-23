"use client";

import { useMemo, useSyncExternalStore } from "react";
import DOMPurify from "dompurify";
import type { ArticleMention } from "@/lib/api/types";
import { profileHref } from "@/lib/routes";

interface ArticleContentProps {
  content: string;
  /** The people the article features who have a page (from findJournalById). */
  mentions?: ArticleMention[];
}

// Matches @handle when preceded by start-of-string/whitespace/punctuation,
// so it doesn't catch emails like "name@example.com".
const MENTION_REGEX = /(^|[\s(])@([a-zA-Z0-9_.-]{2,50})/g;

/** Embeds an article may carry: video players, podcasts and the magazine flipbook. */
const EMBED_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "open.spotify.com",
  "publuu.com",
  "www.instagram.com",
];

/** Tags and attributes an article may use. No forms, scripts or SVG. */
const ALLOWED_TAGS = [
  "div", "span", "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark", "small",
  "blockquote", "pre", "code",
  "ul", "ol", "li", "dl", "dt", "dd",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
  "a", "img", "picture", "source", "video", "audio", "iframe",
  "figure", "figcaption", "section", "article", "header", "footer", "aside",
];

const ALLOWED_ATTR = [
  "class", "style", "src", "srcset", "sizes", "href", "target", "rel", "alt", "title",
  "width", "height", "loading", "allow", "allowfullscreen", "frameborder", "scrolling",
  "controls", "autoplay", "loop", "muted", "playsinline", "poster", "type",
  "colspan", "rowspan",
];

/**
 * Decodes HTML entities (e.g. "&lt;iframe src=..." -> "<iframe src=...").
 * This handles the case where the CMS/editor stored the content already
 * HTML-escaped, which causes tags like <iframe> to render as visible text
 * instead of being interpreted as markup.
 */
function decodeHtmlEntities(html: string): string {
  if (typeof document === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function isAllowedEmbed(src: string) {
  try {
    const url = new URL(src, window.location.href);
    return url.protocol === "https:" && EMBED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Links each @handle the API matched to a page; a handle with no page stays
 * plain text. Only text nodes are touched (never tags, links or code).
 */
function linkMentions(container: HTMLElement, mentions: ArticleMention[]) {
  const pages = new Map<string, string>();
  mentions.forEach((m) => {
    if (m.handle) pages.set(m.handle.toLowerCase(), m.slug);
  });
  if (pages.size === 0) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const tag = node.parentElement?.tagName;
      if (tag && ["A", "CODE", "PRE", "SCRIPT", "STYLE"].includes(tag)) return NodeFilter.FILTER_REJECT;
      return node.textContent?.includes("@") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);

  for (const textNode of textNodes) {
    const text = textNode.textContent || "";
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let linked = false;
    MENTION_REGEX.lastIndex = 0;
    let match;
    while ((match = MENTION_REGEX.exec(text))) {
      const [, lead, handle] = match;
      const slug = pages.get(handle.toLowerCase());
      if (!slug) continue;
      const start = match.index + lead.length;
      frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      const anchor = document.createElement("a");
      anchor.href = profileHref(slug);
      anchor.className = "mention-link";
      anchor.textContent = `@${handle}`;
      frag.appendChild(anchor);
      lastIndex = start + handle.length + 1; // +1 for "@"
      linked = true;
    }
    if (!linked) continue;
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode?.replaceChild(frag, textNode);
  }
}

/** Sanitized article HTML with embeds checked and mentions linked. */
function prepare(content: string, mentions: ArticleMention[]): string {
  const clean = DOMPurify.sanitize(decodeHtmlEntities(content), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target"],
  });

  const container = document.createElement("div");
  container.innerHTML = clean;
  container.querySelectorAll("iframe").forEach((frame) => {
    if (!isAllowedEmbed(frame.getAttribute("src") ?? "")) frame.remove();
  });
  container.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });
  linkMentions(container, mentions);
  return container.innerHTML;
}

const NO_MENTIONS: ArticleMention[] = [];

/** False while rendering on the server and hydrating, true once in the browser. */
const noSubscribe = () => () => {};
const useInBrowser = () => useSyncExternalStore(noSubscribe, () => true, () => false);

const ArticleContent = ({ content, mentions = NO_MENTIONS }: ArticleContentProps) => {
  // Sanitizing needs the DOM, so the body is prepared in the browser only
  const inBrowser = useInBrowser();
  const safeContent = useMemo(
    () => (inBrowser ? (typeof content === "string" ? prepare(content, mentions) : "") : null),
    [inBrowser, content, mentions]
  );

  if (safeContent === null) return null;

  if (!safeContent) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <p className="text-muted-foreground">Content unavailable.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      <div className="prose-article mx-auto max-w-2xl" dangerouslySetInnerHTML={{ __html: safeContent }} />
    </div>
  );
};

export default ArticleContent;
