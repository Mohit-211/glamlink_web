"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/header_logo.png";
import { LogoutUser } from "@/api/Api";
import { useSession } from "@/lib/useSession";

const navLinks = [
  { label: "Home", href: "/", id: "home" },
  { label: "Magazine", href: "/magazine", id: "magazine" },
  { label: "Podcast", href: "/podcast", id: "podcast" },
  { label: "Directory", href: "/directory", id: "directory" },
  // { label: "Journal", href: "/journal", id: "journal" },
  // { label: "Topics", href: "/topics", id: "topics" },
  { label: "Access", href: "/access", id: "access" },

];

export default function Header({ activeRoute }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Restored from the refresh cookie on page load (see app/providers).
  const isLoggedIn = useSession().status === "signed-in";
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  const hideAuthButton = pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    try {
      // Ends this session on the API and clears the refresh cookie.
      await LogoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push("/login");
    }
  };

  const handleDashboard = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/dashboard");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP BUTTON / PROFILE ICON */}
          {!hideAuthButton && (
            <div className="hidden lg:block">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setProfileDropdownOpen(!profileDropdownOpen)
                    }
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary hover:shadow-lg transition-all"
                  >
                    <User className="w-6 h-6 text-white" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-medium"
                    >
                      {/* Dashboard Option */}
                      <button
                        onClick={handleDashboard}
                        className="w-full px-4 py-3 flex items-center gap-3 text-foreground/80 hover:bg-muted transition-colors border-b border-border"
                      >
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                        <span className="font-medium">Dashboard</span>
                      </button>

                      {/* Logout Option */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  asChild
                  className="btn-primary rounded-full px-6 text-sm"
                >
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          )}

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
        <div className="lg:hidden border-t border-border bg-card shadow-lg max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="container-glamlink py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-base font-medium ${isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {!hideAuthButton && (
              <div className="mt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button
                      onClick={handleDashboard}
                      className="btn-primary w-full rounded-full py-6 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full rounded-full py-6 flex items-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/5"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="btn-primary w-full rounded-full py-6">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}