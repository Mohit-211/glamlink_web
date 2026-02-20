"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MagazineIssueCard, Position, ResponsivePosition } from "../../types";

interface IssueCardProps {
  issue: MagazineIssueCard;
  onClick?: () => void;
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  const [currentHeight, setCurrentHeight] = useState("250px");
  const [currentFeaturedPersonPosition, setCurrentFeaturedPersonPosition] = useState<Position>({});
  const [currentFeaturedTitlePosition, setCurrentFeaturedTitlePosition] = useState<Position>({});
  const [currentTitlePosition, setCurrentTitlePosition] = useState<Position>({});

  // Helper function to check if a position is responsive
  const isResponsivePosition = (pos: Position | ResponsivePosition | undefined): pos is ResponsivePosition => {
    return pos !== undefined && "default" in pos;
  };

  // Helper function to get position for current breakpoint
  const getPositionForBreakpoint = (pos: Position | ResponsivePosition | undefined, width: number): Position => {
    if (!pos) return {};

    // If it's a simple position, return it
    if (!isResponsivePosition(pos)) {
      return pos;
    }

    // If it's responsive, get the appropriate breakpoint
    if (width >= 1536 && pos["2xl"]) {
      return pos["2xl"];
    } else if (width >= 1280 && pos.xl) {
      return pos.xl;
    } else if (width >= 1024 && pos.lg) {
      return pos.lg;
    } else if (width >= 768 && pos.md) {
      return pos.md;
    } else if (width >= 640 && pos.sm) {
      return pos.sm;
    } else {
      return pos.default || {};
    }
  };

  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      const height = issue.featuredPersonIssueHeight;

      // Update height
      if (typeof height === "string") {
        setCurrentHeight(height);
      } else if (typeof height === "object" && height !== null) {
        if (width >= 1536 && height["2xl"]) {
          setCurrentHeight(height["2xl"]);
        } else if (width >= 1280 && height.xl) {
          setCurrentHeight(height.xl);
        } else if (width >= 1024 && height.lg) {
          setCurrentHeight(height.lg);
        } else if (width >= 768 && height.md) {
          setCurrentHeight(height.md);
        } else if (width >= 640 && height.sm) {
          setCurrentHeight(height.sm);
        } else {
          setCurrentHeight(height.default || "250px");
        }
      } else {
        setCurrentHeight("250px");
      }

      // Update text positions
      setCurrentFeaturedPersonPosition(getPositionForBreakpoint(issue.textPlacement?.featuredPersonPosition, width));
      setCurrentFeaturedTitlePosition(getPositionForBreakpoint(issue.textPlacement?.featuredTitlePosition, width));
      setCurrentTitlePosition(getPositionForBreakpoint(issue.textPlacement?.titlePosition, width));
    };

    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  }, [issue.featuredPersonIssueHeight, issue.textPlacement]);

  // Check display mode (prefer coverDisplayMode over useCoverBackground for backward compatibility)
  const displayMode = issue.coverDisplayMode || (issue.useCoverBackground ? "background" : "html");

  // If using background image with text included, render simplified version
  if (displayMode === "background" && issue.coverBackgroundImage) {
    return (
      <div onClick={onClick} className="group block cursor-pointer">
        <div className="relative aspect-[3/4] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
          <Image src={issue.coverBackgroundImage} alt={issue.coverImageAlt || `Issue #${issue.issueNumber} Cover`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="transition-transform duration-300 group-hover:scale-105 group-hover:brightness-105" />
        </div>
      </div>
    );
  }

  // Original rendering with text overlays
  return (
    <div onClick={onClick} className="group block cursor-pointer">
      {/* Luxurious Frame Container */}
      <div
        className="transition-all duration-500 rounded-sm overflow-hidden hover:shadow-2xl group-hover:shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #c4b5a0 0%, #d4c4b0 30%, #e0d0bc 50%, #d8c8b4 70%, #c8b8a4 100%)",
        }}
      >
        {/* Top Frame Area - Magazine Title */}
        <div className="px-6 py-4 flex justify-center">
          <div className="relative" style={{ maxWidth: "225px", width: "100%" }}>
            <div className="flex justify-between items-start">
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: "400",
                  fontSize: "20px",
                  fontStyle: "italic",
                  letterSpacing: "0px",
                  color: "#ffffff",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                The
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                display: "block",
                width: "100%",
                fontWeight: 700,
                fontSize: "40px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textAlign: "center",
                marginTop: "-8px",
                marginBottom: "-8px",
                lineHeight: "1",
                whiteSpace: "nowrap",
                color: "#ffffff",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              GLAMLINK
            </h2>
            <div className="flex justify-between items-end">
              <span></span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: "400",
                  fontSize: "20px",
                  fontStyle: "italic",
                  letterSpacing: "0px",
                  color: "#ffffff",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                edit
              </span>
            </div>
          </div>
        </div>

        {/* Image Container with Padding */}
        <div className="px-6 pb-4">
          <div className="relative overflow-hidden rounded-sm" style={{ height: "auto" }}>
            <Image src={issue.coverImage} alt={issue.coverImageAlt} width={500} height={667} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "contain" }} />

            {/* Featured Content Overlay */}
            <div className="absolute inset-0 text-white">
              {/* Featured Person */}
              {issue.featuredPerson && (
                <div
                  className="absolute"
                  style={{
                    top: currentFeaturedPersonPosition.top,
                    left: currentFeaturedPersonPosition.left,
                    bottom: currentFeaturedPersonPosition.bottom,
                    right: currentFeaturedPersonPosition.right,
                    ...(currentFeaturedPersonPosition.width && { width: currentFeaturedPersonPosition.width }),
                    ...(!Object.keys(currentFeaturedPersonPosition).length && { bottom: "25%", left: "5%" }),
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-roboto)",
                      fontWeight: 600,
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      letterSpacing: "0.5px",
                      lineHeight: "1.1",
                      textTransform: "uppercase",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      textAlign: (currentFeaturedPersonPosition.textAlign as any) || "left",
                    }}
                  >
                    {issue.featuredPerson}
                  </h3>
                </div>
              )}

              {/* Featured Title */}
              {issue.featuredTitle && (
                <div
                  className="absolute"
                  style={{
                    top: currentFeaturedTitlePosition.top,
                    left: currentFeaturedTitlePosition.left,
                    bottom: currentFeaturedTitlePosition.bottom,
                    right: currentFeaturedTitlePosition.right,
                    ...(currentFeaturedTitlePosition.width && { width: currentFeaturedTitlePosition.width }),
                    ...(!Object.keys(currentFeaturedTitlePosition).length && { bottom: "20%", left: "48%" }),
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-roboto)",
                      fontWeight: 400,
                      fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                      letterSpacing: "0.3px",
                      lineHeight: "1.1",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                      opacity: 0.95,
                      textAlign: (currentFeaturedTitlePosition.textAlign as any) || "left",
                    }}
                  >
                    {issue.featuredTitle}
                  </p>
                </div>
              )}

              {/* Main Title */}
              <div
                className="absolute"
                style={{
                  top: currentTitlePosition.top,
                  left: currentTitlePosition.left,
                  bottom: currentTitlePosition.bottom,
                  right: currentTitlePosition.right,
                  ...(currentTitlePosition.width && { width: currentTitlePosition.width }),
                  ...(!Object.keys(currentTitlePosition).length && { bottom: "10%", left: "50%", transform: "translateX(-50%)", width: "90%" }),
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 700,
                    fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                    lineHeight: "1.1",
                    color: "#ffffff",
                    textAlign: (currentTitlePosition.textAlign as any) || "center",
                  }}
                >
                  {issue.title}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Frame Area - Issue Details */}
        <div
          className="px-6 py-3 border-t"
          style={{
            borderTopColor: "rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="flex justify-between items-center text-sm">
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: "700",
                letterSpacing: "0.3px",
                color: "#ffffff",
              }}
            >
              {issue.subtitle}
            </span>
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: "700",
                letterSpacing: "0.5px",
                color: "#ffffff",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.15)",
              }}
            >
              Issue #{issue.issueNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
