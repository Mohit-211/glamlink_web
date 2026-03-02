// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/images/**",
      },
      // Add glamlink.net
      {
        protocol: "https",
        hostname: "glamlink.net",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;