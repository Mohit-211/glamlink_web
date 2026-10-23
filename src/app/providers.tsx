"use client";

import { ReactNode, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { initSession } from "@/lib/session";

export default function Providers({ children }: { children: ReactNode }) {
  // Silent sign-in: restore the session from the refresh cookie on page load.
  useEffect(() => {
    initSession();
  }, []);

  return (
    <TooltipProvider>
      <Toaster position="top-right" richColors />
      {children}
    </TooltipProvider>
  );
}
