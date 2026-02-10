"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from ".././../../public/Glamlink logo.png";
import Image from "next/image";
const navLinks = [
  { label: "Home", href: "/", id: "home" },
  { label: "For Clients", href: "/for-clients", id: "for-clients" },
  { label: "Journal", href: "/journal", id: "journal" },

  {
    label: "For Professionals",
    href: "/for-professionals",
    id: "for-professionals",
  },
  { label: "Magazine", href: "/magazine", id: "magazine" },
  { label: "Promos", href: "/promos", id: "promos" },
];

interface HeaderProps {
  activeRoute?: string;
}

const Header = ({ activeRoute }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (link: (typeof navLinks)[number]) => {
    if (activeRoute) return link.id === activeRoute;
    return pathname === link.href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container-glamlink">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-primary flex items-center justify-center overflow-hidden">
              <Image
                src={logo}
                alt="Glamlink Logo"
                width={100}  // match the container width
                height={100} // match the container height
                className="object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`nav-link ${isActive(link) ? "text-primary after:scale-x-100" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="btn-primary gap-2">
              <Download className="w-4 h-4" />
              Download App
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-up">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${isActive(link)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Button className="btn-primary gap-2 mt-4 w-full">
                <Download className="w-4 h-4" />
                Download App
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
