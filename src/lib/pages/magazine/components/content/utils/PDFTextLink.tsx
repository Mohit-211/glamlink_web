"use client";

import React from "react";
import MagazineLink from "../../shared/MagazineLink";

interface PDFTextLinkProps {
  field: any; // LinkFieldType from MagazineLink
  children: React.ReactNode;
  className?: string;
  target?: string;
  pdfText?: string; // Text to show in PDF mode (defaults to "JOIN GLAMLINK")
  pdfHref?: string; // URL to use in PDF mode (defaults to Glamlink linktree)
}

/**
 * PDFTextLink - A wrapper component that displays a styled text link in PDF export mode
 * with custom text and URL, while maintaining normal MagazineLink behavior in web mode
 */
export default function PDFTextLink({ field, children, className = "", target = "_blank", pdfText = "JOIN GLAMLINK", pdfHref = "https://linktr.ee/glamlink_app" }: PDFTextLinkProps) {
  // Check if we're in PDF export mode - check both IDs and classes
  const checkPdfExport = () => {
    if (typeof window === "undefined") return false;

    // Check for ID-based selectors (existing PDF generators)
    const hasIdSelectors = !!(document.querySelector("#temp-section-export") || document.querySelector("#magazine-pdf-render-container") || document.querySelector("#temp-magazine-export"));

    // Check for class-based selectors (EditorCanvas and other generators)
    const hasClassSelectors = !!(document.querySelector(".pdf-export-mode") || document.querySelector(".magazine-pdf-export") || document.querySelector(".pdf-page-content"));

    const isPdf = hasIdSelectors || hasClassSelectors;

    // Debug logging for PDF detection
    console.log("🔍 PDFTextLink Detection:", {
      hasIdSelectors,
      hasClassSelectors,
      isPdf,
      foundElements: {
        byId: document.querySelector("#temp-section-export") ? "#temp-section-export" : document.querySelector("#magazine-pdf-render-container") ? "#magazine-pdf-render-container" : document.querySelector("#temp-magazine-export") ? "#temp-magazine-export" : "none",
        byClass: document.querySelector(".pdf-export-mode") ? ".pdf-export-mode" : document.querySelector(".magazine-pdf-export") ? ".magazine-pdf-export" : document.querySelector(".pdf-page-content") ? ".pdf-page-content" : "none",
      },
      field,
      pdfText,
      pdfHref,
    });

    return isPdf;
  };

  const isPdfExport = checkPdfExport();

  if (isPdfExport) {
    console.log("✅ PDF mode detected in PDFTextLink - rendering JOIN GLAMLINK link to:", pdfHref);
    // PDF export: Use special text and link
    // In jsPDF, we need to use a simple anchor tag with inline styles
    return (
      <a
        href={pdfHref}
        style={{
          color: "#1ea2b0", // Glamlink teal color
          fontWeight: "500",
          textDecoration: "none",
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {pdfText}
      </a>
    );
  }

  console.log("🌐 Web mode in PDFTextLink - rendering normal social link");
  // Regular web: Use MagazineLink with normal behavior
  return (
    <MagazineLink field={field} className={className} target={target}>
      {children}
    </MagazineLink>
  );
}
