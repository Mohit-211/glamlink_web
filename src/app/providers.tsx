"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "../../store/store";

export default function Providers({ children }: { children: ReactNode }) {
  // One QueryClient per browser session
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}
