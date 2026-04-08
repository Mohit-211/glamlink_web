"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/header_logo.png";

const navLinks = [
  { label: "Home", href: "/", id: "home" },
  // { label: "For Clients", href: "/for-clients", id: "clients" },
  // { label: "For Professionals", href: "/for-professionals", id: "pros" },
  { label: "Magazine", href: "/magazine", id: "magazine" },
  { label: "Podcast", href: "/podcast", id: "podcast" },
  { label: "Journal", href: "/journal", id: "journal" },

  // { label: "Directory", href: "/directory", id: "directory" },
  // { label: "Media kit", href: "/media-kit", id: "media-kit" },

];

export default function Header({activeRoute}:any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="container-glamlink">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="Glamlink"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden lg:block">
            <Button asChild className="btn-primary rounded-full px-6 text-sm">
              <a
                href="https://linktr.ee/glamlink_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download App
              </a>
            </Button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-glamlink py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-base font-medium
                ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* MOBILE CTA */}

            <a
              href="https://linktr.ee/glamlink_app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <Button className="btn-primary w-full rounded-full py-6">
                <Download className="w-5 h-5 mr-2" />
                Download App
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
