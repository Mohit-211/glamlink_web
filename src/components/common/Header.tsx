"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { LogoutUser } from "@/api/Api";
import { useSession } from "@/lib/useSession";

// The menu of the Oct 2026 home page mockup, with the magazine beside the
// Journal and the podcast's own page where the mockup has Watch. Brands are
// found in the Directory, beside professionals.
const navLinks = [
  { label: "Home", href: "/", id: "home" },
  { label: "Journal", href: "/journal", id: "journal" },
  { label: "Magazine", href: "/magazine", id: "magazine" },
  { label: "Podcast", href: "/podcast", id: "podcast" },
  { label: "Shop", href: "/shop", id: "shop" },
  { label: "Directory", href: "/directory", id: "directory" },
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

  // A section stays highlighted on its inner pages too (an article under /journal).
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

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
              className="h-9 w-auto md:h-10"
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="nav-link rounded-lg px-4 py-2 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP SEARCH + BUTTON / PROFILE ICON */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/search"
              aria-label="Search"
              aria-current={pathname === "/search" ? "page" : undefined}
              className="nav-link flex h-11 w-11 items-center justify-center rounded-full"
            >
              <Search className="h-5 w-5" />
            </Link>
            {!hideAuthButton && (
              <div>
                {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setProfileDropdownOpen(!profileDropdownOpen)
                      }
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-primary hover:bg-secondary hover:shadow-large transition-all"
                    >
                      <User className="w-6 h-6 text-primary-foreground" />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-medium">
                        {/* Dashboard Option */}
                        <button
                          onClick={handleDashboard}
                          className="nav-link w-full px-4 py-3 flex items-center gap-3 border-b border-border"
                        >
                          <LayoutDashboard className="w-5 h-5" />
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
          </div>

          {/* MOBILE SEARCH + MENU BUTTON */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/search"
              aria-label="Search"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-muted"
            >
              <Search className="h-6 w-6" />
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card shadow-large max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="container-glamlink py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="nav-link rounded-lg px-4 py-3 text-base"
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
