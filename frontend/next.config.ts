import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["authora-health.test"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
