"use client";

import { MagazinePage as MagazinePageType, MagazineIssue } from "../../types";
import MagazinePageContent from "./MagazinePageContent";
import { useEffect, useState } from "react";

interface MagazinePageViewProps {
  page: MagazinePageType;
  totalPages: number;
  issue?: MagazineIssue;
  pages?: MagazinePageType[];
  onNavigate?: (pageNumber: number) => void;
}

export default function MagazinePageView({ page, totalPages, issue, pages, onNavigate }: MagazinePageViewProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto magazine-section">
      {/* Magazine page container with realistic paper effect - responsive version */}
      <div
        className={`magazine-page relative bg-white shadow-2xl ${isMobile ? "" : "overflow-y-auto"}`}
        style={{
          height: isMobile ? "auto" : "750px",
          minHeight: isMobile ? "400px" : "auto",
          background: "linear-gradient(to bottom right, #fefefe 0%, #fcfcfc 40%, #f8f8f8 100%)",
          boxShadow: `
               0 1px 3px rgba(0,0,0,0.12),
               0 1px 2px rgba(0,0,0,0.24),
               0 10px 20px rgba(0,0,0,0.1),
               0 0 40px rgba(0,0,0,0.05) inset,
               -2px 0 2px rgba(0,0,0,0.05) inset
             `,
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
        }}
      >
        {/* Subtle paper texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
                 45deg,
                 transparent,
                 transparent 10px,
                 rgba(0,0,0,0.01) 10px,
                 rgba(0,0,0,0.01) 20px
               )`,
            mixBlendMode: "multiply",
          }}
        />

        {/* Top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />

        {/* Left edge shadow for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

        {/* Main content */}
        <div className="relative z-10">
          <MagazinePageContent page={page} issue={issue} pages={pages} onNavigate={onNavigate} />
        </div>
      </div>

      {/* Bottom shadow for lifted effect */}
      <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/10 blur-xl -z-10" />
    </div>
  );
}
