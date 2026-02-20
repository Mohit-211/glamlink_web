"use client";

import { useEffect, useRef } from "react";

export default function useDynamicButtonWidth(className: string) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateButtonWidths = () => {
      if (!containerRef.current) return;

      const buttons = containerRef.current.querySelectorAll(`.${className}`);
      if (buttons.length === 0) return;

      // Check if viewport width is less than or equal to 992px
      if (window.innerWidth <= 992) {
        // Make buttons full width on smaller devices
        buttons.forEach((btn) => {
          const element = btn as HTMLElement;
          element.style.width = "100%";
          element.style.display = "block";
        });
        return;
      }

      // For larger screens, apply dynamic width logic
      let maxWidth = 0;

      // Reset widths and find the maximum natural width
      buttons.forEach((btn) => {
        const element = btn as HTMLElement;
        element.style.width = "auto";
        element.style.display = "inline-block";
        const width = element.offsetWidth;
        if (width > maxWidth) maxWidth = width;
      });

      // Apply the maximum width to all buttons
      buttons.forEach((btn) => {
        const element = btn as HTMLElement;
        element.style.width = `${maxWidth}px`;
        element.style.display = "block";
      });
    };

    // Initial update
    updateButtonWidths();

    // Update on window resize
    window.addEventListener("resize", updateButtonWidths);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateButtonWidths);
    };
  }, [className]);

  return containerRef;
}