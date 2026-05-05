"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/header_logo.png";
import { Instagram, Twitter, Facebook, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  navigation: [

    { label: "Directory", href: "/directory" },
    { label: "Magazine", href: "/magazine" },
    { label: "Journal", href: "/journal" },
    { label: "Media-kit", href: "/media-kit" },
    { label: "Podcast", href: "/podcast" },
  ],
  company: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "CSAM Policy", href: "/csam-policy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

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
                width={160}
                height={40}
                className="object-contain"
                priority
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
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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

            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />

              <button type="submit" className="btn-primary text-sm px-5">
                Join
              </button>
            </form>
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
