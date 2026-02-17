"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/header_logo.png"; // adjust path if needed
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-sm transition-all duration-300">
      <div className="container-glamlink px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-[110px] md:w-[140px] h-9 md:h-11 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logo}
                alt="Glamlink"
                fill
                className="object-contain"
                priority
                quality={95}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative px-4 xl:px-5 py-2.5 text-sm xl:text-base font-medium rounded-lg transition-all duration-300 ${
                  isActive(link)
                    ? "text-[#24bbcb] bg-[#24bbcb]/5"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                }`}
              >
                {link.label}
                {isActive(link) && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#24bbcb] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button className="bg-[#24bbcb] hover:bg-[#1ea8b5] text-white font-semibold px-6 md:px-8 py-5 md:py-6 rounded-full shadow-lg shadow-[#24bbcb]/25 hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 text-base">
              <Download className="w-4.5 h-4.5" />
              Download App
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100/80 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-gray-700" />
            ) : (
              <Menu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[64px] md:top-[80px] bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        } overflow-y-auto z-40`}
      >
        <div className="container-glamlink px-5 py-8">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`px-5 py-4 text-lg font-medium rounded-xl transition-all ${
                  isActive(link)
                    ? "bg-[#24bbcb]/10 text-[#24bbcb]"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <Button
              className="w-full bg-[#24bbcb] hover:bg-[#1ea8b5] text-white font-semibold py-6 rounded-full shadow-lg shadow-[#24bbcb]/25 hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300 text-lg flex items-center justify-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Download className="w-5 h-5" />
              Download App
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
