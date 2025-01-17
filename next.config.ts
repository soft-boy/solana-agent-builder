import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This will disable ESLint during the build process
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
