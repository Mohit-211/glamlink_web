// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "", // optional
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/images/**", // restrict path if needed
      },
    ],
  },
};

export default nextConfig;