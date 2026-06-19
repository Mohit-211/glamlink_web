"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/header_logo.png";

const navLinks = [
  { label: "Home", href: "/", id: "home" },
  { label: "Magazine", href: "/magazine", id: "magazine" },
  { label: "Podcast", href: "/podcast", id: "podcast" },
  { label: "Journal", href: "/journal", id: "journal" },
];

export default function Header({ activeRoute }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("GlamlinkaccessToken");
    setIsLoggedIn(!!token);
  }, []);

  const isActive = (href: string) => pathname === href;
const hideAuthButton =
  pathname.startsWith("/dashboard");
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP BUTTON */}
          { !hideAuthButton&&
          <div className="hidden lg:block">
            <Button
              asChild
              className="btn-primary rounded-full px-6 text-sm"
            >
              <Link
                href={
                  isLoggedIn
                    ? "/dashboard"
                    : "/login"
                }
              >
                {isLoggedIn
                  ? "Dashboard"
                  : "Login"}
              </Link>
            </Button>
          </div>
          }

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
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
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`px-4 py-3 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* MOBILE BUTTON */}
                { !hideAuthButton&&
            <Link
              href={
                isLoggedIn
                  ? "/dashboard"
                  : "/login"
              }
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="mt-4"
            >
              <Button className="btn-primary w-full rounded-full py-6">
                {isLoggedIn
                  ? "Dashboard"
                  : "Login"}
              </Button>
            </Link>
}
          </div>
        </div>
      )}
    </header>
  );
}