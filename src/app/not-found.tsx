import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";

/*
 * The 404 page. It reads no request data (an earlier version read a header,
 * which made almost every route render on each request instead of being cached).
 */

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist on Glamlink.",
  robots: {
    index: false,
    follow: false,
  },
};

const SECTIONS = [
  { label: "Journal", href: "/journal" },
  { label: "Podcast", href: "/podcast" },
  { label: "Shop", href: "/shop" },
  { label: "Find a Professional", href: "/directory" },
];

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="hero-glamlink">
      <div className="container-glamlink max-w-2xl text-center">
        <p className="eyebrow">404</p>
        <h1 id="not-found-heading" className="hero-title mt-4">
          This page isn&apos;t here
        </h1>
        <p className="hero-subtitle mt-4">
          It may have moved, or the link may be out of date. Search Glamlink, or pick up somewhere below.
        </p>

        <Form action="/search" role="search" className="relative mx-auto mt-8 max-w-xl">
          <label htmlFor="not-found-search" className="sr-only">
            Search Glamlink
          </label>
          <input
            id="not-found-search"
            name="q"
            type="search"
            required
            minLength={2}
            maxLength={100}
            placeholder="Search treatments, professionals, products and more..."
            className="input-glamlink h-14 rounded-full pl-6 pr-16 shadow-soft"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        </Form>

        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <Link href={section.href} className="chip inline-flex rounded-full px-4 py-2 text-sm">
                {section.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className="link-glamlink mt-8 inline-block text-sm">
          Return to Home
        </Link>
      </div>
    </section>
  );
}
