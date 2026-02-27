"use client";

import Image from "next/image";
import logo from "../../../public/header_logo.png";
import { Instagram, Twitter, Facebook, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  Quick_Links: [
    { label: "About Us", href: "#" },
    { label: "Journals", href: "/journals" },
    { label: "Contact Us", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
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
        
        {/* ✅ 4 Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-10 justify-items-center">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-full h-11 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-[#24bbcb]/25 transition-transform group-hover:scale-105">
                <Image
                  src={logo}
                  alt="Glamlink"
                  fill
                  className="object-contain"
                  priority
                  quality={95}
                />
              </div>
            </a>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
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
                             hover:bg-[#24bbcb]/90 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-5 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm sm:text-base">
              {footerLinks.Quick_Links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#24bbcb] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-5 text-white">
              Legal
            </h4>
            <ul className="space-y-3 text-sm sm:text-base">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#24bbcb] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h4 className="font-semibold text-base sm:text-lg text-white">
              Stay Updated
            </h4>

            <p className="text-gray-400 text-sm sm:text-base">
              Get the latest beauty tips, trends, and Glamlink updates.
            </p>

            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/12 text-white 
                           placeholder:text-gray-500 text-sm sm:text-base outline-none focus:border-[#24bbcb] 
                           focus:ring-2 focus:ring-[#24bbcb]/25 transition-all duration-200"
              />

              <button
                type="submit"
                className="w-full px-5 py-3 rounded-xl bg-[#24bbcb] text-white font-medium text-sm sm:text-base
                           hover:bg-[#1ea8b5] transition-all duration-300 shadow-md shadow-[#24bbcb]/20 
                           hover:shadow-lg hover:shadow-[#24bbcb]/30 hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 mt-12 sm:mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Glamlink. All rights reserved.</p>

          <div className="flex flex-wrap justify-center sm:justify-end gap-5 sm:gap-7">
            <a href="#" className="hover:text-[#24bbcb] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#24bbcb] transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-[#24bbcb] transition-colors">
              Accessibility
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;