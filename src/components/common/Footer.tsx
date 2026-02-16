"use client";

import Image from "next/image";
import { Instagram, Twitter, Facebook, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Safety", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black text-gray-100">
      <div className="container-glamlink px-5 sm:px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 lg:col-span-1 space-y-6">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-[#22bccb]/25 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Glamlink"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl sm:text-2.5xl font-bold tracking-tight text-white">
                Glamlink
              </span>
            </a>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
              Connecting beauty professionals with clients who love them —
              beautifully, instantly, and trustfully.
            </p>

            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/8 flex items-center justify-center text-gray-300 
                             hover:bg-[#22bccb]/90 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-5 text-white">
              Company
            </h4>
            <ul className="space-y-3 sm:space-y-3.5 text-sm sm:text-base">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#22bccb] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-5 text-white">
              Support
            </h4>
            <ul className="space-y-3 sm:space-y-3.5 text-sm sm:text-base">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#22bccb] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="hidden md:block">
            <h4 className="font-semibold text-base sm:text-lg mb-5 text-white">
              Legal
            </h4>
            <ul className="space-y-3 sm:space-y-3.5 text-sm sm:text-base">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#22bccb] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter – moved to full width on small screens */}
          <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-1 space-y-5 lg:space-y-6">
            <h4 className="font-semibold text-base sm:text-lg text-white">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm sm:text-base">
              Get the latest beauty tips, trends, and Glamlink updates.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 sm:px-5 py-3 rounded-xl bg-white/6 border border-white/12 text-white 
                           placeholder:text-gray-500 text-sm sm:text-base outline-none focus:border-[#22bccb] 
                           focus:ring-2 focus:ring-[#22bccb]/25 transition-all duration-200 min-w-0"
              />
              <button
                type="submit"
                className="px-5 sm:px-6 py-3 rounded-xl bg-[#22bccb] text-white font-medium text-sm sm:text-base whitespace-nowrap
                           hover:bg-[#1ea8b5] transition-all duration-300 shadow-md shadow-[#22bccb]/20 
                           hover:shadow-lg hover:shadow-[#22bccb]/30 hover:scale-[1.02] flex items-center justify-center min-w-[110px]"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Legal on mobile – shown only on small screens */}
          <div className="md:hidden col-span-2 sm:col-span-3 mt-4">
            <h4 className="font-semibold text-base mb-4 text-white">Legal</h4>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#22bccb] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 mt-12 sm:mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Glamlink. All rights reserved.</p>

          <div className="flex flex-wrap justify-center sm:justify-end gap-5 sm:gap-7">
            <a href="#" className="hover:text-[#22bccb] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#22bccb] transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-[#22bccb] transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
