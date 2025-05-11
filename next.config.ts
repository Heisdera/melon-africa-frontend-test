import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
