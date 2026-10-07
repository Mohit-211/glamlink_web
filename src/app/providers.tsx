"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ConfigProvider } from "antd";

export default function Providers({ children }: { children: ReactNode }) {
  // One QueryClient per browser session
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Ant Design components use the site typeface (Manrope) instead of their own font stack */}
      <ConfigProvider theme={{ token: { fontFamily: "var(--font-sans)" } }}>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          {children}
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
