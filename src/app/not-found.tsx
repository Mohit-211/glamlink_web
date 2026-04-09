import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { headers } from "next/headers";

/* --------------------------------
   Metadata
-------------------------------- */

export const metadata: Metadata = {
  title: "Page Not Found | Glamlink",

  description: "The page you are looking for does not exist on Glamlink.",

  robots: {
    index: false,
    follow: false,
  },
};

/* --------------------------------
   Page
-------------------------------- */

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "unknown";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "404 Page Not Found",
    url: `https://glamlink.net${pathname}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Glamlink",
      url: "https://glamlink.net",
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Script
        id="404-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className="text-center">
        <h1 className="mb-4 text-4xl">404</h1>

        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>

        <Link href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
