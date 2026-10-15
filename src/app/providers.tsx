"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <Toaster position="top-right" richColors />
      {children}
    </TooltipProvider>
  );
}
