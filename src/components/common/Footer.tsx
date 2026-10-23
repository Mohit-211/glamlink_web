"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import logo from "../../../public/header_logo.png";
import { Instagram, Twitter, Facebook, Linkedin, Youtube } from "@/components/icons/BrandIcons";
import { subscribeNewsletter } from "@/api/Api";
import { readApiError } from "@/lib/apiError";

const footerLinks = {
  navigation: [
    { label: "Journal", href: "/journal" },
    { label: "Magazine", href: "/magazine" },
    { label: "Watch + Learn", href: "/watch" },
    { label: "The Beauty Vault Podcast", href: "/podcast" },
    { label: "Shop", href: "/shop" },
    { label: "Find a Professional", href: "/directory" },
    { label: "Find a Brand", href: "/industry" },
    { label: "Topics", href: "/topics" },
    { label: "Partner With Glamlink", href: "/partner" },
  ],
  company: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "CSAM Policy", href: "/csam-policy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Sitemap", href: "/sitemap.xml" },
    { label: "Contact Us", href: "/contact-us" },

  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

/** The footer's newsletter sign-up (source "footer"). */
function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("sending");
    try {
      await subscribeNewsletter({ email: email.trim(), source: "footer" });
      setStatus("done");
    } catch (err) {
      setError(readApiError(err, "We couldn't subscribe you. Please try again.").message);
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Thanks for subscribing.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "footer-newsletter-error" : undefined}
          className="input-glamlink flex-1"
        />
        <button type="submit" className="btn-primary px-5 text-sm" disabled={status === "sending"}>
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Subscribing" /> : "Join"}
        </button>
      </div>
      {error && (
        <p id="footer-newsletter-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="container-glamlink py-16">
        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src={logo}
                alt="Glamlink"
                className="h-11 w-auto"
              />
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Connecting beauty professionals with clients who love them —
              beautifully, instantly, and trustfully.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="font-semibold text-base mb-5">Navigation</h4>

            <ul className="space-y-3 text-sm">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold text-base mb-5">Company</h4>

            <ul className="space-y-3 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-5">
            <h4 className="font-semibold text-base">Stay Updated</h4>

            <p className="text-muted-foreground text-sm">
              Beauty insights, trends, and Glamlink updates — straight to your
              inbox.
            </p>

            <FooterNewsletter />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-border mt-14 pt-6 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between gap-3">
          <p>© {new Date().getFullYear()} Glamlink. All rights reserved.</p>

          <p>Built for beauty professionals worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
