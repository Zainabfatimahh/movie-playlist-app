import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "csspicker.dev",
      },
      {
        protocol: "https",
        hostname: "*.example.com",
      },
    ],
  },
};

export default nextConfig;
