import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ Disable React Compiler for now
  // reactCompiler: true,

  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
