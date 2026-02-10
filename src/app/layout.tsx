/** @format */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Script from "next/script";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import "@/styles/globals.css";
import { ReactNode, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
	// Create QueryClient per browser session (Next.js-safe)
	const [queryClient] = useState(() => new QueryClient());

	return (
		<html lang="en">
			<body className="min-h-screen bg-background">
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>
						<Toaster position="top-right" richColors />
						<Header />
						<Script
							src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAd0VnpJBpOS7iISBY2GIVBnEkgpcqXXV0&libraries=places"
							strategy="afterInteractive"
						/>

						<main>{children}</main>
						<Footer />
					</TooltipProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
