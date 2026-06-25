"use client";
import { Sparkles } from "lucide-react";
export default function AccessByGlamlink() {
    return (
        <main className="w-full bg-gradient-to-b from-white via-gray-50/70 to-white min-h-screen">
            {/* Hero Section */}
            <section className="w-full py-20 md:py-28">
                <div className="container-glamlink px-5 md:px-8">
                    <div className="mx-auto max-w-3xl text-center space-y-8">
                        {/* Eyebrow badge */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-sm font-medium">
                                <Sparkles className="w-4 h-4" />
                                <span>Access by Glamlink</span>
                            </div>
                        </div>
                        {/* Heading */}
                        <h1 className="font-display text-5xl md:text-6xl tracking-tight text-gray-900 leading-tight">
                            Leave a{" "}
                            <span className="bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb] bg-clip-text text-transparent">
                                Lasting Impression
                            </span>
                        </h1>
                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
                            A modern way to showcase your business and connect with clients.
                        </p>
                        {/* CTA */}
                        <div className="flex justify-center pt-2">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSe55pW4gKYZTCh0RTtHMQV4W_nD5tvusxP9lQiK1unfmmp91A/viewform?usp=header"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb]
                           text-white font-semibold text-base rounded-full shadow-lg shadow-[#24bbcb]/25
                           hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300
                           hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Join the Waitlist
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            {/* Divider — Step Into the Spotlight */}
        </main>
    );
}